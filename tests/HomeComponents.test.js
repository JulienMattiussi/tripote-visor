import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AgeGrid from '../src/components/AgeGrid.vue';
import ExperienceCards from '../src/components/ExperienceCards.vue';
import TravelersChoice from '../src/components/TravelersChoice.vue';
import CommunityBlurb from '../src/components/CommunityBlurb.vue';
import ThingsToDoBanner from '../src/components/ThingsToDoBanner.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

beforeEach(() => {
  setLocale('en');
  setCurrency('USD');
  vi.stubGlobal('alert', vi.fn());
});
afterEach(() => vi.unstubAllGlobals());

describe('AgeGrid', () => {
  it('renders four age-bucket cards with translated labels', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(AgeGrid, withRouter(router));
    expect(wrapper.findAll('.age-card')).toHaveLength(4);
    const labels = wrapper.findAll('.age-label').map((l) => l.text());
    expect(labels).toEqual(['Under 30', '30 to 45', '45 to 60', 'Over 60']);
  });

  it('switches labels to French when locale is fr', async () => {
    setLocale('fr');
    const router = await setupRouter('/');
    const wrapper = mount(AgeGrid, withRouter(router));
    const labels = wrapper.findAll('.age-label').map((l) => l.text());
    expect(labels).toEqual(['Moins de 30 ans', '30 à 45 ans', '45 à 60 ans', 'Plus de 60 ans']);
  });

  it('clicking a card navigates to /search with the matching age query', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(AgeGrid, withRouter(router));
    await wrapper.findAll('.age-card')[2].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('search');
    expect(router.currentRoute.value.query.age).toBe('45-60');
  });
});

describe('ExperienceCards', () => {
  it('renders four cards from four distinct cities with the city tag overlaid', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(ExperienceCards, withRouter(router));
    const cards = wrapper.findAll('.exp-card');
    expect(cards).toHaveLength(4);
    const cities = wrapper.findAll('.exp-city-tag').map((c) => c.text());
    expect(cities).toHaveLength(4);
    expect(new Set(cities).size).toBe(4);
  });

  it('clicking a card navigates to that profile', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(ExperienceCards, withRouter(router));
    await wrapper.findAll('.exp-card')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('profile');
    expect(typeof router.currentRoute.value.params.id).toBe('string');
  });

  it('the same hour produces the same picks (hourly rotation)', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-26T13:42:00'));
    const router = await setupRouter('/');
    const w1 = mount(ExperienceCards, withRouter(router));
    const w2 = mount(ExperienceCards, withRouter(router));
    expect(w1.findAll('.exp-city-tag').map((c) => c.text())).toEqual(
      w2.findAll('.exp-city-tag').map((c) => c.text()),
    );
    vi.useRealTimers();
  });
});

describe('TravelersChoice (home promo)', () => {
  it('CTA navigates to /encounters', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(TravelersChoice, withRouter(router));
    await wrapper.find('button.pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('encounters');
  });
});

describe('CommunityBlurb', () => {
  it('renders the community section with the closing tagline', () => {
    const wrapper = mount(CommunityBlurb);
    expect(wrapper.find('h2').exists()).toBe(true);
    expect(wrapper.text()).toContain("We're here to take a load off");
  });
});

describe('ThingsToDoBanner', () => {
  it('renders the headline and the Discover now CTA', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(ThingsToDoBanner, withRouter(router));
    expect(wrapper.text()).toContain('Discover now');
  });

  it('clicking Discover now navigates to /discover', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(ThingsToDoBanner, withRouter(router));
    await wrapper.find('button.pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('discover');
  });
});
