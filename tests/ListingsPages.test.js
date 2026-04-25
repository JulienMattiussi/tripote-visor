import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import HotelsPage from '../src/pages/HotelsPage.vue';
import ParksPage from '../src/pages/ParksPage.vue';
import AlleysPage from '../src/pages/AlleysPage.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { HOTELS, PARKS, ALLEYS } from '../src/data/listings.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('HotelsPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/hotels');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('renders the hero with the Hotels title and intro', () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Hotels');
    expect(wrapper.text()).toContain('Find a place to crash');
  });

  it('renders one card per hotel in the data file with name, location and price', () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    expect(wrapper.findAll('.lst-card')).toHaveLength(HOTELS.length);
    expect(wrapper.find('.lst-count').text()).toContain(String(HOTELS.length));

    const firstCard = wrapper.find('.lst-card');
    expect(firstCard.find('.lst-card-name').text()).toBe(HOTELS[0].name);
    expect(firstCard.find('.lst-card-loc').text()).toBe(HOTELS[0].location);
    expect(firstCard.find('.lst-price').text()).toContain('/ night');
  });

  it('typing a destination filters the visible hotels', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-search input').setValue('Paris');
    expect(wrapper.findAll('.lst-card').length).toBe(
      HOTELS.filter((h) => h.location.includes('Paris')).length,
    );
  });

  it('sort by price asc orders the cards from cheapest to most expensive', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-sort select').setValue('price_asc');

    const visiblePrices = wrapper.findAll('.lst-card').map((c) => {
      const text = c.find('.lst-price').text();
      return parseInt(text.replace(/[^0-9]/g, ''), 10);
    });
    const sorted = [...visiblePrices].sort((a, b) => a - b);
    expect(visiblePrices).toEqual(sorted);
  });

  it('renders in French and uses the FR-grouped EUR amounts', () => {
    setLocale('fr');
    const wrapper = mount(HotelsPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Hôtels');
    expect(wrapper.find('.lst-search input').attributes('placeholder')).toBe('Où allez-vous ?');
    expect(wrapper.find('.lst-price').text()).toContain('à partir de');
    expect(wrapper.find('.lst-price').text()).toContain('/ nuit');
  });
});

describe('ParksPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/parks');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('renders the hero with the Parks title and intro', () => {
    const wrapper = mount(ParksPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Parks');
    expect(wrapper.text()).toContain('Tours, tickets, dives, and treks');
  });

  it('renders one card per park with duration + per-person price', () => {
    const wrapper = mount(ParksPage, withRouter(router));
    expect(wrapper.findAll('.lst-card')).toHaveLength(PARKS.length);

    const firstCard = wrapper.find('.lst-card');
    expect(firstCard.find('.lst-card-name').text()).toBe(PARKS[0].name);
    expect(firstCard.find('.lst-duration').exists()).toBe(true);
    expect(firstCard.find('.lst-price').text()).toContain('/ person');
  });

  it('multi-day parks render their duration in days, not hours', () => {
    const wrapper = mount(ParksPage, withRouter(router));
    const machu = PARKS.find((a) => a.id === 'machu-picchu');
    const card = wrapper
      .findAll('.lst-card')
      .find((c) => c.find('.lst-card-name').text() === machu.name);
    expect(card.find('.lst-duration').text()).toContain(`${Math.round(machu.durationHours / 24)}`);
    expect(card.find('.lst-duration').text()).toContain('days');
  });
});

describe('AlleysPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/alleys');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('renders the hero with the Alleys title and intro', () => {
    const wrapper = mount(AlleysPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Alleys');
    expect(wrapper.text()).toContain('Cobblestone lanes');
  });

  it('renders one card per alley with duration + per-person price', () => {
    const wrapper = mount(AlleysPage, withRouter(router));
    expect(wrapper.findAll('.lst-card')).toHaveLength(ALLEYS.length);

    const firstCard = wrapper.find('.lst-card');
    expect(firstCard.find('.lst-card-name').text()).toBe(ALLEYS[0].name);
    expect(firstCard.find('.lst-duration').exists()).toBe(true);
    expect(firstCard.find('.lst-price').text()).toContain('/ person');
  });

  it('renders in French with the Ruelles title', () => {
    setLocale('fr');
    const wrapper = mount(AlleysPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Ruelles');
  });
});

describe('ListingsPage navigation from the scrolled-header category tabs', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true, writable: true });
    Object.defineProperty(window, 'pageYOffset', {
      value: 400,
      configurable: true,
      writable: true,
    });
  });

  it('clicking the Hotels tab in the category-tabs row navigates to /hotels', async () => {
    const wrapper = mount(App, withRouter(router));
    window.dispatchEvent(new Event('scroll'));
    await flushPromises();

    const hotelsLink = wrapper.findAll('.category-nav a').find((a) => a.text() === 'Hotels');
    expect(hotelsLink.attributes('href')).toBe('/hotels');
  });

  it('clicking the Parks tab navigates to /parks', async () => {
    const wrapper = mount(App, withRouter(router));
    window.dispatchEvent(new Event('scroll'));
    await flushPromises();

    const parksLink = wrapper.findAll('.category-nav a').find((a) => a.text() === 'Parks');
    expect(parksLink.attributes('href')).toBe('/parks');
  });

  it('clicking the Alleys tab navigates to /alleys', async () => {
    const wrapper = mount(App, withRouter(router));
    window.dispatchEvent(new Event('scroll'));
    await flushPromises();

    const alleysLink = wrapper.findAll('.category-nav a').find((a) => a.text() === 'Alleys');
    expect(alleysLink.attributes('href')).toBe('/alleys');
  });
});
