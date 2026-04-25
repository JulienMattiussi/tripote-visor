import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SearchResultsPage from '../src/pages/SearchResultsPage.vue';
import HeroSearch from '../src/components/HeroSearch.vue';
import fiches from '../src/data/fiches.json';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('SearchResultsPage - global view', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/search');
  });

  it('groups results into the three category sections', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const titles = wrapper.findAll('.sr-section-title').map((t) => t.text());
    expect(titles).toEqual(['Hotels', 'Alleys', 'Parks']);
  });

  it('shows at most six cards per section in the global view', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    for (const section of wrapper.findAll('.sr-section')) {
      expect(section.findAll('.sr-card').length).toBeLessThanOrEqual(6);
    }
  });

  it('displays a "Show all" link when a category exceeds six results', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const showAllButtons = wrapper.findAll('.sr-show-all');
    // All three categories have > 6 fiches, so all sections should show the link.
    expect(showAllButtons.length).toBe(3);
  });

  it('clicking a card navigates to the corresponding fiche page', async () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const firstCard = wrapper.find('.sr-card');
    const expectedId = fiches.find((f) => f.categorie === 'hotel').id;
    await firstCard.trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('fiche');
    expect(router.currentRoute.value.params.id).toBe(expectedId);
  });

  it('clicking a heart opens the login-required modal without navigating', async () => {
    const { loginRequiredOpen, loginRequiredContext, closeLoginRequired } =
      await import('../src/i18n/store.js');
    closeLoginRequired();
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const firstCard = wrapper.find('.sr-card');
    const expectedName = firstCard.find('.sr-card-name').text();
    await firstCard.find('.sr-heart').trigger('click');
    expect(loginRequiredOpen.value).toBe(true);
    expect(loginRequiredContext.value).toEqual({ target: 'save', name: expectedName });
    expect(router.currentRoute.value.name).toBe('search');
    closeLoginRequired();
  });

  it('clicking "Show all" pushes to /search with categorie=hotel', async () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    await wrapper.find('.sr-show-all').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.query.categorie).toBe('hotel');
  });
});

describe('SearchResultsPage - filtered view', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/search?categorie=hotel');
  });

  it('renders only the requested category section', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const titles = wrapper.findAll('.sr-section-title').map((t) => t.text());
    expect(titles).toEqual(['Hotels']);
  });

  it('shows every fiche in the category (no 6-cap)', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const expected = fiches.filter((f) => f.categorie === 'hotel').length;
    expect(wrapper.findAll('.sr-card').length).toBe(expected);
  });

  it('renders a "Back to global search" button that drops the categorie filter', async () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const back = wrapper.find('.sr-back');
    expect(back.exists()).toBe(true);
    await back.trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.query.categorie).toBeUndefined();
  });
});

describe('SearchResultsPage - query filtering', () => {
  it('filters by name (case-insensitive) and shows only matching fiches', async () => {
    setLocale('en');
    const router = await setupRouter('/search?q=mireille');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const cards = wrapper.findAll('.sr-card');
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toContain('Mireille');
  });

  it('filters by location substring', async () => {
    setLocale('en');
    const router = await setupRouter('/search?q=Lyon');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    for (const card of wrapper.findAll('.sr-card')) {
      expect(card.text()).toContain('Lyon');
    }
  });

  it('shows the empty-for-query state when nothing matches', async () => {
    setLocale('en');
    const router = await setupRouter('/search?q=xyzzynothingmatches');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    expect(wrapper.find('.sr-empty').exists()).toBe(true);
    expect(wrapper.text()).toContain('xyzzynothingmatches');
  });
});

describe('HeroSearch submit', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  afterEach(() => vi.unstubAllGlobals());

  it('ignores submit when query is empty', async () => {
    const wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.find('form').trigger('submit');
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('pushes to /search?q=... on submit from the All tab', async () => {
    const wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.find('input[type="text"]').setValue('riad');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('search');
    expect(router.currentRoute.value.query.q).toBe('riad');
    expect(router.currentRoute.value.query.categorie).toBeUndefined();
  });

  it('adds categorie=hotel when submitting from the Hotels tab', async () => {
    const wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.findAll('.tab')[1].trigger('click'); // Hotels
    await wrapper.find('input[type="text"]').setValue('paris');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.query.q).toBe('paris');
    expect(router.currentRoute.value.query.categorie).toBe('hotel');
  });

  it('adds categorie=parc from the Parks tab and categorie=ruelle from Alleys', async () => {
    let wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.findAll('.tab')[2].trigger('click'); // Parks
    await wrapper.find('input[type="text"]').setValue('vincennes');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.query.categorie).toBe('parc');

    router = await setupRouter('/');
    wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.findAll('.tab')[3].trigger('click'); // Alleys
    await wrapper.find('input[type="text"]').setValue('marais');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.query.categorie).toBe('ruelle');
  });
});

describe('SearchResultsPage - locale', () => {
  it('switches section titles to French when locale is fr', async () => {
    setLocale('fr');
    const router = await setupRouter('/search');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const titles = wrapper.findAll('.sr-section-title').map((t) => t.text());
    expect(titles).toEqual(['Hôtels', 'Ruelles', 'Parcs']);
  });
});
