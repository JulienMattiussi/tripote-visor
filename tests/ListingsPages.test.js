import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import HotelsPage from '../src/pages/HotelsPage.vue';
import AttractionsPage from '../src/pages/AttractionsPage.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { HOTELS, ATTRACTIONS } from '../src/data/listings.js';
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

describe('AttractionsPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/attractions');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('renders the hero with the Things to Do title and intro', () => {
    const wrapper = mount(AttractionsPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Things to Do');
    expect(wrapper.text()).toContain('Tours, tickets, dives, and treks');
  });

  it('renders one card per attraction with duration + per-person price', () => {
    const wrapper = mount(AttractionsPage, withRouter(router));
    expect(wrapper.findAll('.lst-card')).toHaveLength(ATTRACTIONS.length);

    const firstCard = wrapper.find('.lst-card');
    expect(firstCard.find('.lst-card-name').text()).toBe(ATTRACTIONS[0].name);
    expect(firstCard.find('.lst-duration').exists()).toBe(true);
    expect(firstCard.find('.lst-price').text()).toContain('/ person');
  });

  it('multi-day attractions render their duration in days, not hours', () => {
    const wrapper = mount(AttractionsPage, withRouter(router));
    const machu = ATTRACTIONS.find((a) => a.id === 'machu-picchu');
    const card = wrapper
      .findAll('.lst-card')
      .find((c) => c.find('.lst-card-name').text() === machu.name);
    expect(card.find('.lst-duration').text()).toContain(`${Math.round(machu.durationHours / 24)}`);
    expect(card.find('.lst-duration').text()).toContain('days');
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

  it('clicking the Things to Do tab navigates to /attractions', async () => {
    const wrapper = mount(App, withRouter(router));
    window.dispatchEvent(new Event('scroll'));
    await flushPromises();

    const thingsLink = wrapper.findAll('.category-nav a').find((a) => a.text() === 'Things to Do');
    expect(thingsLink.attributes('href')).toBe('/attractions');
  });
});
