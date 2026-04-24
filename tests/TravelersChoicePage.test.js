import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import TravelersChoicePage from '../src/pages/TravelersChoicePage.vue';
import { setLocale } from '../src/i18n/store.js';
import { TC_CATEGORIES } from '../src/data/travelers-choice.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('TravelersChoicePage', () => {
  let router;

  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/travelers-choice');
  });

  it('renders the hero with year badge, big title, and subtitle', () => {
    const wrapper = mount(TravelersChoicePage, withRouter(router));
    expect(wrapper.find('.tc-hero').exists()).toBe(true);
    expect(wrapper.find('.tc-badge').text()).toBe('2026');
    expect(wrapper.find('.tc-hero-title').text()).toBe(
      "Travellers' Choice Awards Best of the Best 2026",
    );
    expect(wrapper.text()).toContain('Among our top 1% of places, stays, eats, and experiences');
  });

  it('renders the 4 category tabs in order (Destinations / Beaches / Rentals removed)', () => {
    const wrapper = mount(TravelersChoicePage, withRouter(router));
    const tabs = wrapper.findAll('.tc-tab').map((b) => b.text());
    expect(tabs).toEqual(['All', 'Hotels', 'Alleys', 'Things to Do']);
    expect(wrapper.find('.tc-tab.active').text()).toBe('All');
  });

  it('on /travelers-choice (All tab), renders every category section', () => {
    const wrapper = mount(TravelersChoicePage, withRouter(router));
    const sections = wrapper.findAll('.tc-cat');
    expect(sections).toHaveLength(TC_CATEGORIES.length);

    for (const cat of TC_CATEGORIES) {
      expect(wrapper.find(`#cat-${cat.key}`).exists()).toBe(true);
    }
  });

  it('shows winner cards with rank badge, name, location, and rating for each category', () => {
    const wrapper = mount(TravelersChoicePage, withRouter(router));
    const totalWinners = TC_CATEGORIES.reduce((sum, c) => sum + c.winners.length, 0);
    expect(wrapper.findAll('.tc-card')).toHaveLength(totalWinners);

    const firstCard = wrapper.find('.tc-card');
    expect(firstCard.find('.tc-rank-badge').text()).toBe('#1');
    expect(firstCard.find('.tc-card-name').text()).toBe(TC_CATEGORIES[0].winners[0].name);
    expect(firstCard.find('.tc-card-loc').text()).toBe(TC_CATEGORIES[0].winners[0].location);
    expect(firstCard.find('.tc-rating-num').text()).toBe(
      TC_CATEGORIES[0].winners[0].rating.toFixed(1),
    );
  });

  it('on /travelers-choice/hotels, shows only the Hotels section and marks the tab active', async () => {
    router = await setupRouter('/travelers-choice/hotels');
    const wrapper = mount(TravelersChoicePage, withRouter(router));

    const sections = wrapper.findAll('.tc-cat');
    expect(sections).toHaveLength(1);
    expect(wrapper.find('.tc-cat-title').text()).toBe('Hotels — Best of the Best');
    expect(wrapper.find('.tc-tab.active').text()).toBe('Hotels');
    expect(wrapper.text()).not.toContain('Restaurants — Best of the Best');
  });

  it('clicking a tab pushes the matching route and filters the visible sections', async () => {
    const wrapper = mount(TravelersChoicePage, withRouter(router));

    const alleysTab = wrapper.findAll('.tc-tab').find((t) => t.text() === 'Alleys');
    await alleysTab.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('travelers-choice-category');
    expect(router.currentRoute.value.params.category).toBe('restaurants');

    const sections = wrapper.findAll('.tc-cat');
    expect(sections).toHaveLength(1);
    expect(wrapper.find('.tc-cat-title').text()).toBe('Alleys — Best of the Best');
  });

  it('clicking the All tab from a sub-route returns to the unfiltered page', async () => {
    router = await setupRouter('/travelers-choice/hotels');
    const wrapper = mount(TravelersChoicePage, withRouter(router));

    const allTab = wrapper.findAll('.tc-tab').find((t) => t.text() === 'All');
    await allTab.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('travelers-choice');
    expect(wrapper.findAll('.tc-cat')).toHaveLength(TC_CATEGORIES.length);
  });

  it('an unknown category param falls back to the All view', async () => {
    router = await setupRouter('/travelers-choice/bogus');
    const wrapper = mount(TravelersChoicePage, withRouter(router));

    expect(wrapper.find('.tc-tab.active').text()).toBe('All');
    expect(wrapper.findAll('.tc-cat')).toHaveLength(TC_CATEGORIES.length);
  });

  it('renders the page in French when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mount(TravelersChoicePage, withRouter(router));

    expect(wrapper.find('.tc-hero-title').text()).toBe(
      'Prix Travellers’ Choice Best of the Best 2026',
    );
    const tabs = wrapper.findAll('.tc-tab').map((b) => b.text());
    expect(tabs).toEqual(['Tous', 'Hôtels', 'Ruelles', 'Activités']);
    expect(wrapper.text()).toContain('Hôtels — Best of the Best');
    expect(wrapper.find('.tc-disclaimer').text()).toContain('site parodique');
  });
});

describe('TravelersChoicePage navigation from the home page', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it("the home TravelersChoice section's button navigates to /travelers-choice", async () => {
    const wrapper = mount(App, withRouter(router));

    const seeWinnersBtn = wrapper.findAll('button').find((b) => b.text() === 'See the winners');
    expect(seeWinnersBtn).toBeDefined();
    await seeWinnersBtn.trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('travelers-choice');
  });
});
