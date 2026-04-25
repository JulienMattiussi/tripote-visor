import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import HotelsPage from '../src/pages/HotelsPage.vue';
import ParksPage from '../src/pages/ParksPage.vue';
import AlleysPage from '../src/pages/AlleysPage.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import fiches from '../src/data/fiches.json';
import { setupRouter, withRouter } from './helpers/router.js';

const PER_PAGE = 10;

describe('HotelsPage - default view', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/hotels');
  });

  it('renders the Hotels hero title', () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Hotels');
  });

  it('shows exactly 10 hotel cards by default', () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    expect(wrapper.findAll('.lst-card').length).toBe(PER_PAGE);
  });

  it('only renders fiches whose categorie is hotel', () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    const visibleNames = wrapper.findAll('.lst-card-name').map((n) => n.text());
    const allowed = new Set(fiches.filter((f) => f.categorie === 'hotel').map((f) => f.nom));
    for (const name of visibleNames) expect(allowed.has(name)).toBe(true);
  });

  it('formats price with the per-night suffix in EN/EUR', () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    expect(wrapper.find('.lst-price').text()).toMatch(/from .*€.*\/ night/);
  });

  it('renders in French and uses the FR per-night suffix', async () => {
    setLocale('fr');
    const wrapper = mount(HotelsPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Hôtels');
    expect(wrapper.find('.lst-price').text()).toContain('/ nuit');
  });
});

describe('ListingsPage - sort options', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/hotels');
  });

  it('"price ascending" sorts the visible cards from cheapest to most expensive', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-sort select').setValue('price_asc');
    const prices = wrapper.findAll('.lst-price').map((p) => {
      return parseInt(p.text().replace(/[^0-9]/g, ''), 10);
    });
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('"price descending" sorts the visible cards from most expensive to cheapest', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-sort select').setValue('price_desc');
    const prices = wrapper.findAll('.lst-price').map((p) => {
      return parseInt(p.text().replace(/[^0-9]/g, ''), 10);
    });
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('"top rated" sorts the visible cards by note descending', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-sort select').setValue('top_rated');
    const ratings = wrapper.findAll('.lst-rating-num').map((r) => parseFloat(r.text()));
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it('"recommended" produces a stable order across re-renders within the same hour', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-25T12:30:00Z'));
    const w1 = mount(HotelsPage, withRouter(router));
    const order1 = w1.findAll('.lst-card-name').map((n) => n.text());
    const w2 = mount(HotelsPage, withRouter(router));
    const order2 = w2.findAll('.lst-card-name').map((n) => n.text());
    expect(order1).toEqual(order2);
    vi.useRealTimers();
  });

  it('"recommended" produces a different order at a different hour', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-25T12:30:00Z'));
    const w1 = mount(HotelsPage, withRouter(router));
    const order1 = w1.findAll('.lst-card-name').map((n) => n.text());
    vi.setSystemTime(new Date('2026-04-25T15:30:00Z'));
    const w2 = mount(HotelsPage, withRouter(router));
    const order2 = w2.findAll('.lst-card-name').map((n) => n.text());
    expect(order1).not.toEqual(order2);
    vi.useRealTimers();
  });
});

describe('ListingsPage - search', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/hotels');
  });

  it('initialises the search input from the URL ?q= query param', async () => {
    const r = await setupRouter('/hotels?q=Paris');
    const wrapper = mount(HotelsPage, withRouter(r));
    expect(wrapper.find('.lst-search input').element.value).toBe('Paris');
    const expected = fiches.filter(
      (f) =>
        f.categorie === 'hotel' &&
        (f.nom.toLowerCase().includes('paris') || f.lieu.toLowerCase().includes('paris')),
    ).length;
    expect(wrapper.findAll('.lst-card').length).toBe(expected);
  });

  it('typing a query reveals all matching fiches (no 10-cap)', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-search input').setValue('Paris');
    const expected = fiches.filter(
      (f) =>
        f.categorie === 'hotel' &&
        (f.nom.toLowerCase().includes('paris') || f.lieu.toLowerCase().includes('paris')),
    ).length;
    expect(wrapper.findAll('.lst-card').length).toBe(expected);
  });

  it('shows the empty-state when no fiche matches', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-search input').setValue('zzz-no-match');
    expect(wrapper.findAll('.lst-card').length).toBe(0);
    expect(wrapper.find('.lst-empty').exists()).toBe(true);
  });

  it('search results respect the chosen sort', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    await wrapper.find('.lst-sort select').setValue('price_asc');
    await wrapper.find('.lst-search input').setValue('Paris');
    const prices = wrapper.findAll('.lst-price').map((p) => {
      return parseInt(p.text().replace(/[^0-9]/g, ''), 10);
    });
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});

describe('ListingsPage - card click navigates to fiche', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
    router = await setupRouter('/hotels');
  });

  it('clicking a card pushes to /p/:id', async () => {
    const wrapper = mount(HotelsPage, withRouter(router));
    const firstName = wrapper.find('.lst-card-name').text();
    const expectedId = fiches.find((f) => f.nom === firstName).id;
    await wrapper.find('.lst-card').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('fiche');
    expect(router.currentRoute.value.params.id).toBe(expectedId);
  });
});

describe('ParksPage / AlleysPage - parity', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('EUR');
  });

  it('ParksPage shows park-only fiches with per-person pricing', async () => {
    router = await setupRouter('/parks');
    const wrapper = mount(ParksPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Parks');
    expect(wrapper.findAll('.lst-card').length).toBe(PER_PAGE);
    const allowed = new Set(fiches.filter((f) => f.categorie === 'parc').map((f) => f.nom));
    for (const name of wrapper.findAll('.lst-card-name').map((n) => n.text())) {
      expect(allowed.has(name)).toBe(true);
    }
    expect(wrapper.find('.lst-price').text()).toMatch(/from .*€.*\/ person/);
  });

  it('AlleysPage shows alley-only fiches', async () => {
    router = await setupRouter('/alleys');
    const wrapper = mount(AlleysPage, withRouter(router));
    expect(wrapper.find('.lst-hero-title').text()).toBe('Alleys');
    expect(wrapper.findAll('.lst-card').length).toBe(PER_PAGE);
    const allowed = new Set(fiches.filter((f) => f.categorie === 'ruelle').map((f) => f.nom));
    for (const name of wrapper.findAll('.lst-card-name').map((n) => n.text())) {
      expect(allowed.has(name)).toBe(true);
    }
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
