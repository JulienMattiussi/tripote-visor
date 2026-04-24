import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import AppHeader from '../src/components/AppHeader.vue';
import TravelStoriesPage from '../src/pages/TravelStoriesPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { STORIES } from '../src/data/travel-stories.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('TravelStoriesPage', () => {
  let router;

  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/travel-stories');
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps exactly 4 stories: 1 featured + 3 in the grid', () => {
    expect(STORIES).toHaveLength(4);
    expect(STORIES.filter((s) => s.featured)).toHaveLength(1);

    const wrapper = mount(TravelStoriesPage, withRouter(router));
    expect(wrapper.find('.ts-featured').exists()).toBe(true);
    expect(wrapper.findAll('.ts-card')).toHaveLength(3);
  });

  it('renders the hero title, subtitle, and the Featured badge in English', () => {
    const wrapper = mount(TravelStoriesPage, withRouter(router));
    expect(wrapper.find('.ts-hero-title').text()).toBe('Travel Stories');
    expect(wrapper.text()).toContain('Inspiration, tips, and unforgettable trips');
    expect(wrapper.find('.ts-featured-label').text()).toBe('Featured');
  });

  it('shows each story’s title, category and author in the locale strings', () => {
    const wrapper = mount(TravelStoriesPage, withRouter(router));
    expect(wrapper.find('.ts-featured-title').text()).toBe(
      'On the road in the Highlands: a 7-day Scottish adventure',
    );
    const cardTitles = wrapper.findAll('.ts-card-title').map((c) => c.text());
    expect(cardTitles).toEqual([
      'What we learned from a month in Hanoi',
      '12 hidden bistros in Paris locals love',
      'How to plan a low-budget trip to Iceland',
    ]);
    // First card carries the Culture category and the author byline.
    expect(wrapper.findAll('.ts-card .ts-cat')[0].text()).toBe('Culture');
    expect(wrapper.findAll('.ts-card')[0].text()).toContain('By Étienne Mercier');
    expect(wrapper.findAll('.ts-card')[0].text()).toContain('6 min read');
  });

  it('clicking a story (Read article) triggers an alert with its title', async () => {
    const wrapper = mount(TravelStoriesPage, withRouter(router));
    await wrapper.find('.ts-read-btn').trigger('click');
    expect(window.alert).toHaveBeenCalledOnce();
    expect(window.alert.mock.calls[0][0]).toContain(
      'On the road in the Highlands: a 7-day Scottish adventure',
    );
  });

  it('renders the page in French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(TravelStoriesPage, withRouter(router));

    expect(wrapper.find('.ts-hero-title').text()).toBe('Récits de voyage');
    expect(wrapper.find('.ts-featured-label').text()).toBe('À la une');
    expect(wrapper.find('.ts-featured-title').text()).toBe(
      'Sur les routes des Highlands : 7 jours d’aventure écossaise',
    );
    expect(wrapper.findAll('.ts-card-title').map((c) => c.text())).toEqual([
      'Ce que nous avons appris d’un mois à Hanoï',
      '12 bistrots parisiens cachés que les locaux adorent',
      'Comment planifier un voyage en Islande à petit budget',
    ]);
    expect(wrapper.findAll('.ts-card .ts-cat')[0].text()).toBe('Culture');
    // Read time uses the FR template
    expect(wrapper.text()).toContain('6 min de lecture');
  });
});

describe('Travel Stories navigation from the header', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('clicking the Travel Stories item in the Discover dropdown navigates to /travel-stories', async () => {
    const wrapper = mount(AppHeader, withRouter(router));
    const discoverTrigger = wrapper
      .findAll('.nav-menu-trigger')
      .find((b) => b.text().trim() === 'Discover');
    await discoverTrigger.trigger('click');

    const items = wrapper.findAll('.nav-dropdown-item');
    expect(items[1].text()).toBe('Travel Stories');
    await items[1].trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('travel-stories');
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('the App renders the Travel Stories page on /travel-stories', async () => {
    router = await setupRouter('/travel-stories');
    const wrapper = mount(App, withRouter(router));
    expect(wrapper.text()).toContain('Travel Stories');
    expect(wrapper.text()).toContain('On the road in the Highlands');
  });
});
