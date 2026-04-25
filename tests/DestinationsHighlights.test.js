import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DestinationsHighlights from '../src/components/DestinationsHighlights.vue';
import fichesData from '../src/data/fiches.json';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

const TOP_CITIES = 6;
const PER_CITY = 3;

const expectedCities = () => {
  const groups = new Map();
  for (const f of fichesData) {
    const ville = (f.ville ?? '').trim();
    if (!ville) continue;
    if (!groups.has(ville)) groups.set(ville, []);
    groups.get(ville).push(f);
  }
  return [...groups.entries()]
    .filter(([, list]) => list.length >= PER_CITY)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, TOP_CITIES)
    .map(([ville, list]) => ({
      ville,
      fiches: [...list]
        .sort((a, b) => b.note - a.note || a.nom.localeCompare(b.nom))
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

  it('renders one card per top city, ordered by fiche count desc then alpha', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    const cards = wrapper.findAll('.dh-card');
    const expected = expectedCities();
    expect(cards.length).toBe(expected.length);
    cards.forEach((card, idx) => {
      expect(card.find('.dh-city').text()).toBe(expected[idx].ville);
    });
  });

  it('caps the visible cities at 6 (with the current dataset there are 10 eligible)', () => {
    const eligible = [...new Set(fichesData.map((f) => f.ville))].filter(
      (ville) => fichesData.filter((f) => f.ville === ville).length >= PER_CITY,
    );
    expect(eligible.length).toBeGreaterThanOrEqual(TOP_CITIES);
    expect(expectedCities().length).toBe(TOP_CITIES);
  });

  it('lists exactly three fiche chips per card, picked by best rating', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    const cards = wrapper.findAll('.dh-card');
    const expected = expectedCities();
    cards.forEach((card, idx) => {
      const chipNames = card.findAll('.dh-chip').map((b) => b.text());
      expect(chipNames).toEqual(expected[idx].fiches.map((f) => f.nom));
      expect(chipNames).toHaveLength(PER_CITY);
    });
  });

  it('clicking a chip navigates to the matching fiche', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(DestinationsHighlights, withRouter(router));
    const expected = expectedCities();
    const firstFiche = expected[0].fiches[0];
    await wrapper.findAll('.dh-card')[0].findAll('.dh-chip')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('fiche');
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
