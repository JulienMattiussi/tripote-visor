import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DestinationsHighlights from '../src/components/DestinationsHighlights.vue';
import profilesData from '../src/data/profiles.json';
import advicesData from '../src/data/advices.json';
import citiesData from '../src/data/cities.json';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

const TOP_CITIES = 6;
const PER_CITY = 3;

const avgOf = (id) => {
  const list = advicesData[id] ?? [];
  if (!list.length) return 0;
  return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
};

const photoOf = (city) => {
  const entry = citiesData.find((c) => c.name === city);
  return (entry?.photo ?? '').trim();
};

const expectedCities = () => {
  const groups = new Map();
  for (const f of profilesData) {
    const city = (f.city ?? '').trim();
    if (!city) continue;
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city).push(f);
  }
  return [...groups.entries()]
    .filter(([, list]) => list.length >= PER_CITY)
    .sort((a, b) => {
      const byCount = b[1].length - a[1].length;
      if (byCount !== 0) return byCount;
      const byPhoto = (photoOf(b[0]) ? 1 : 0) - (photoOf(a[0]) ? 1 : 0);
      if (byPhoto !== 0) return byPhoto;
      return a[0].localeCompare(b[0]);
    })
    .slice(0, TOP_CITIES)
    .map(([name, list]) => ({
      name,
      fiches: [...list]
        .sort((a, b) => avgOf(b.id) - avgOf(a.id) || a.name.localeCompare(b.name))
        .slice(0, PER_CITY),
    }));
};

beforeEach(() => {
  setLocale('en');
  setCurrency('USD');
});

describe('DestinationsHighlights', () => {
  it('renders the trending-destinations title', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    expect(wrapper.find('.dh-title').text()).toBe('Trending destinations highlights');
  });

  it('renders one card per top city, ordered by profile count desc then alpha', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    const cards = wrapper.findAll('.dh-card');
    const expected = expectedCities();
    expect(cards.length).toBe(expected.length);
    cards.forEach((card, idx) => {
      expect(card.find('.dh-city').text()).toBe(expected[idx].name);
    });
  });

  it('caps the visible cities at 6 (with the current dataset there are 10 eligible)', () => {
    const eligible = [...new Set(profilesData.map((f) => f.city))].filter(
      (city) => profilesData.filter((f) => f.city === city).length >= PER_CITY,
    );
    expect(eligible.length).toBeGreaterThanOrEqual(TOP_CITIES);
    expect(expectedCities().length).toBe(TOP_CITIES);
  });

  it('lists exactly three profile chips per card, picked by best rating', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    const cards = wrapper.findAll('.dh-card');
    const expected = expectedCities();
    cards.forEach((card, idx) => {
      const chipNames = card.findAll('.dh-chip').map((b) => b.text());
      expect(chipNames).toEqual(expected[idx].fiches.map((f) => f.name));
      expect(chipNames).toHaveLength(PER_CITY);
    });
  });

  it('clicking a chip navigates to the matching profile', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    const expected = expectedCities();
    const firstFiche = expected[0].fiches[0];
    await wrapper.findAll('.dh-card')[0].findAll('.dh-chip')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('profile');
    expect(router.currentRoute.value.params.id).toBe(firstFiche.id);
  });

  it('does not render heart icons on city thumbnails', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    expect(wrapper.find('.dh-fav').exists()).toBe(false);
    expect(wrapper.find('.heart').exists()).toBe(false);
  });

  it('renders the French title when locale is fr', async () => {
    setLocale('fr');
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    expect(wrapper.find('.dh-title').text()).toBe('Les incontournables des destinations tendance');
  });
});
