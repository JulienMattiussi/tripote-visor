import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AgeGrid from '../src/components/AgeGrid.vue';
import ExperienceCards from '../src/components/ExperienceCards.vue';
import InspirationCards from '../src/components/InspirationCards.vue';
import DestinationsGrid from '../src/components/DestinationsGrid.vue';
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
  it('renders four experience cards with localised price tags', () => {
    const wrapper = mount(ExperienceCards);
    expect(wrapper.findAll('.exp-card')).toHaveLength(4);
    expect(wrapper.text()).toMatch(/\$72|72\s*\$/);
  });

  it('toggling the favourite heart flips its filled state', async () => {
    const wrapper = mount(ExperienceCards);
    const firstHeart = wrapper.findAll('.fav-btn')[0];
    expect(firstHeart.find('.heart').classes()).not.toContain('filled');
    await firstHeart.trigger('click');
    expect(wrapper.findAll('.fav-btn')[0].find('.heart').classes()).toContain('filled');
  });
});

describe('InspirationCards', () => {
  it('renders three inspiration cards', () => {
    const wrapper = mount(InspirationCards);
    expect(wrapper.findAll('.insp-card')).toHaveLength(3);
  });

  it('toggling a favourite is independent per card', async () => {
    const wrapper = mount(InspirationCards);
    const hearts = wrapper.findAll('.fav-btn');
    await hearts[0].trigger('click');
    expect(wrapper.findAll('.fav-btn')[0].find('.heart').classes()).toContain('filled');
    expect(wrapper.findAll('.fav-btn')[1].find('.heart').classes()).not.toContain('filled');
  });
});

describe('DestinationsGrid', () => {
  it('renders four destination cards with English names by default', () => {
    const wrapper = mount(DestinationsGrid);
    expect(wrapper.findAll('.dest-card')).toHaveLength(4);
    const text = wrapper.text();
    expect(text).toContain('Rome, Italy');
    expect(text).toContain('Paris, France');
    expect(text).toContain('London, UK');
  });

  it('uses French names when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(DestinationsGrid);
    const text = wrapper.text();
    expect(text).toContain('Rome, Italie');
    expect(text).toContain('Londres, Royaume-Uni');
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
