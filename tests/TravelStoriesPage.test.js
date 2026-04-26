import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import AppHeader from '../src/components/AppHeader.vue';
import TravelStoriesPage from '../src/pages/TravelStoriesPage.vue';
import { setLocale } from '../src/i18n/store.js';
import articlesData from '../src/data/articles.json';
import { setupRouter, withRouter } from './helpers/router.js';

describe('TravelStoriesPage', () => {
  let router;

  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/encounters');
  });

  it('keeps exactly 4 articles: 1 featured + 3 in the grid', () => {
    expect(articlesData).toHaveLength(4);
    expect(articlesData.filter((a) => a.featured)).toHaveLength(1);

    const wrapper = mount(TravelStoriesPage, withRouter(router));
    expect(wrapper.find('.ts-featured').exists()).toBe(true);
    expect(wrapper.findAll('.ts-card')).toHaveLength(3);
  });

  it('renders the hero title, subtitle, and the Featured badge in English', () => {
    const wrapper = mount(TravelStoriesPage, withRouter(router));
    expect(wrapper.find('.ts-hero-title').text()).toBe('Encounter Stories');
    expect(wrapper.text()).toContain('Inspiration, tips, and unforgettable experiences');
    expect(wrapper.find('.ts-featured-label').text()).toBe('Featured');
  });

  it('shows each story’s title, category and author in the locale strings', () => {
    const wrapper = mount(TravelStoriesPage, withRouter(router));
    expect(wrapper.find('.ts-featured-title').text()).toBe('A wild night in the Bois de Boulogne');
    const cardTitles = wrapper.findAll('.ts-card-title').map((c) => c.text());
    expect(cardTitles).toEqual([
      'Encounters in Marseille',
      'The minivan girls',
      'Micheline, a love story',
    ]);
    // First card carries the Culture category and the author byline.
    expect(wrapper.findAll('.ts-card .ts-cat')[0].text()).toBe('Culture');
    expect(wrapper.findAll('.ts-card')[0].text()).toContain('By Mafalda Tournesol');
    expect(wrapper.findAll('.ts-card')[0].text()).toContain('3 min read');
  });

  it('clicking the featured Read button navigates to the matching article route', async () => {
    const wrapper = mount(TravelStoriesPage, withRouter(router));
    await wrapper.find('.ts-read-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('article');
    expect(router.currentRoute.value.params.key).toBe('boulogne');
  });

  it('clicking a grid card navigates to the matching article route', async () => {
    const wrapper = mount(TravelStoriesPage, withRouter(router));
    await wrapper.findAll('.ts-card')[1].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('article');
    expect(router.currentRoute.value.params.key).toBe('minivans');
  });

  it('renders the page in French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(TravelStoriesPage, withRouter(router));

    expect(wrapper.find('.ts-hero-title').text()).toBe('Récit de rencontres');
    expect(wrapper.find('.ts-featured-label').text()).toBe('À la une');
    expect(wrapper.find('.ts-featured-title').text()).toBe('Une nuit de folie au bois de Boulogne');
    expect(wrapper.findAll('.ts-card-title').map((c) => c.text())).toEqual([
      'Rencontres à Marseille',
      'Les filles en minivan',
      'Micheline, une histoire d’amour',
    ]);
    expect(wrapper.findAll('.ts-card .ts-cat')[0].text()).toBe('Culture');
    // Read time uses the FR template
    expect(wrapper.text()).toContain('3 min de lecture');
  });
});

describe('Encounter Stories navigation from the header', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('clicking the Encounter Stories item in the Discover dropdown navigates to /encounters', async () => {
    const wrapper = mount(AppHeader, withRouter(router));
    const discoverTrigger = wrapper
      .findAll('.nav-menu-trigger')
      .find((b) => b.text().trim() === 'Discover');
    await discoverTrigger.trigger('click');

    const items = wrapper.findAll('.nav-dropdown-item');
    expect(items[1].text()).toBe('Encounter Stories');
    await items[1].trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('encounters');
  });

  it('the App renders the Encounter Stories page on /encounters', async () => {
    router = await setupRouter('/encounters');
    const wrapper = mount(App, withRouter(router));
    expect(wrapper.text()).toContain('Encounter Stories');
    expect(wrapper.text()).toContain('A wild night in the Bois de Boulogne');
  });
});
