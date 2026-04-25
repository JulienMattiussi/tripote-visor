import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import AppHeader from '../src/components/AppHeader.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

let router;
const mountHeader = () => mount(AppHeader, withRouter(router));

const setScroll = async (wrapper, y) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
  Object.defineProperty(window, 'pageYOffset', { value: y, configurable: true, writable: true });
  window.dispatchEvent(new Event('scroll'));
  await wrapper.vm.$nextTick();
};

describe('AppHeader', () => {
  beforeEach(async () => {
    setLocale('en');
    setCurrency('USD');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true, writable: true });
    router = await setupRouter('/');
  });

  it('renders the logo with the bust icon and brand name', () => {
    const wrapper = mountHeader();

    expect(wrapper.find('.logo').exists()).toBe(true);
    expect(wrapper.find('.logo-owl').exists()).toBe(true);
    expect(wrapper.find('.logo-text').text()).toBe('Tripote-visor');
  });

  it('top nav contains only the Discover and Review dropdowns', () => {
    const wrapper = mountHeader();
    const items = wrapper.findAll('.main-nav li');

    expect(items).toHaveLength(2);
    expect(items.map((li) => li.text())).toEqual(['Discover', 'Review']);

    expect(wrapper.find('.main-nav li.highlight').exists()).toBe(false);
    expect(wrapper.findAll('.nav-menu-trigger')).toHaveLength(2);

    // Rewards, Forums and Plan with AI were removed.
    expect(wrapper.text()).not.toContain('Rewards');
    expect(wrapper.text()).not.toContain('Forums');
    expect(wrapper.text()).not.toContain('Plan with AI');
  });

  it('uses CSS variables for the brand color (no hardcoded hex)', () => {
    const wrapper = mountHeader();
    const html = wrapper.html();

    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(html).toContain('var(--brand)');
  });

  it('clicking the logo while already on the home page reloads the window', async () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadSpy, pathname: '/' },
    });
    const wrapper = mountHeader();
    await wrapper.find('.logo').trigger('click');
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('clicking the logo from another page navigates back home (no reload)', async () => {
    router = await setupRouter('/p/mireille');
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadSpy, pathname: '/p/mireille' },
    });
    const wrapper = mountHeader();
    await wrapper.find('.logo').trigger('click');
    await flushPromises();
    expect(reloadSpy).not.toHaveBeenCalled();
    expect(router.currentRoute.value.name).toBe('home');
  });
});

describe('AppHeader scroll-triggered compact state', () => {
  beforeEach(async () => {
    setLocale('en');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true, writable: true });
    vi.stubGlobal('alert', vi.fn());
    router = await setupRouter('/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('at scroll 0, shows the default nav and no compact search or category tabs', () => {
    const wrapper = mountHeader();
    expect(wrapper.classes()).not.toContain('scrolled');
    expect(wrapper.find('.main-nav').exists()).toBe(true);
    expect(wrapper.find('.compact-search').exists()).toBe(false);
    expect(wrapper.find('.category-tabs-row').exists()).toBe(false);
  });

  it('crossing the scroll threshold shows the compact search and the category tabs row', async () => {
    const wrapper = mountHeader();

    await setScroll(wrapper, 250);

    expect(wrapper.classes()).toContain('scrolled');
    expect(wrapper.find('.compact-search').exists()).toBe(true);
    expect(wrapper.find('.compact-search input').attributes('placeholder')).toBe('Search');

    // Top nav still has the two dropdowns (unchanged across scroll).
    const navLabels = wrapper.findAll('.main-nav li').map((li) => li.text());
    expect(navLabels).toEqual(['Discover', 'Review']);

    // Category tabs row with the 3 verticals (Cruises was removed).
    const tabs = wrapper.findAll('.category-nav li');
    expect(tabs.map((t) => t.text())).toEqual(['Hotels', 'Parks', 'Alleys']);
  });

  it('scrolling back above the threshold hides the compact search + tabs row', async () => {
    const wrapper = mountHeader();

    await setScroll(wrapper, 300);
    expect(wrapper.find('.compact-search').exists()).toBe(true);
    expect(wrapper.findAll('.main-nav li')).toHaveLength(2);

    await setScroll(wrapper, 0);
    expect(wrapper.classes()).not.toContain('scrolled');
    expect(wrapper.findAll('.main-nav li')).toHaveLength(2);
    expect(wrapper.find('.compact-search').exists()).toBe(false);
    expect(wrapper.find('.category-tabs-row').exists()).toBe(false);
  });

  it('compact-search submit ignores empty queries and pushes to /search?q=... otherwise', async () => {
    const wrapper = mountHeader();
    await setScroll(wrapper, 300);

    await wrapper.find('.compact-search').trigger('submit');
    expect(router.currentRoute.value.name).not.toBe('search');

    await wrapper.find('.compact-search input').setValue('nancy');
    await wrapper.find('.compact-search').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('search');
    expect(router.currentRoute.value.query.q).toBe('nancy');
  });

  it('shows the French placeholder and category labels when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mountHeader();
    await setScroll(wrapper, 300);

    expect(wrapper.find('.compact-search input').attributes('placeholder')).toBe('Rechercher');
    const tabs = wrapper.findAll('.category-nav li').map((t) => t.text());
    expect(tabs).toEqual(['Hôtels', 'Parcs', 'Ruelles']);
  });
});

describe('AppHeader Discover and Review dropdowns', () => {
  beforeEach(async () => {
    setLocale('en');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true, writable: true });
    vi.stubGlobal('alert', vi.fn());
    router = await setupRouter('/');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('clicking Discover opens its dropdown with Top destinations and Travel Stories', async () => {
    const wrapper = mountHeader();
    expect(wrapper.find('.nav-dropdown').exists()).toBe(false);

    const triggers = wrapper.findAll('.nav-menu-trigger');
    const discoverTrigger = triggers.find((b) => b.text().trim() === 'Discover');
    await discoverTrigger.trigger('click');

    expect(discoverTrigger.attributes('aria-expanded')).toBe('true');
    const items = wrapper.findAll('.nav-dropdown-item');
    expect(items.map((i) => i.text())).toEqual(['Top destinations', 'Travel Stories']);
    expect(wrapper.find('.nav-dropdown').attributes('role')).toBe('menu');
    expect(wrapper.find('.nav-dropdown').attributes('aria-label')).toBe('Discover options');
  });

  it('clicking Review opens its dropdown with the three review actions', async () => {
    const wrapper = mountHeader();
    const reviewTrigger = wrapper
      .findAll('.nav-menu-trigger')
      .find((b) => b.text().trim() === 'Review');
    await reviewTrigger.trigger('click');

    const items = wrapper.findAll('.nav-dropdown-item');
    expect(items.map((i) => i.text())).toEqual(['Write a review', 'Publish photos', 'Add a place']);
    expect(wrapper.find('.nav-dropdown').attributes('aria-label')).toBe('Review options');
  });

  it('opening one menu closes the other (only one dropdown at a time)', async () => {
    const wrapper = mountHeader();
    const triggers = wrapper.findAll('.nav-menu-trigger');
    const discoverTrigger = triggers.find((b) => b.text().trim() === 'Discover');
    const reviewTrigger = triggers.find((b) => b.text().trim() === 'Review');

    await discoverTrigger.trigger('click');
    expect(wrapper.findAll('.nav-dropdown')).toHaveLength(1);
    expect(wrapper.find('.nav-dropdown').attributes('aria-label')).toBe('Discover options');

    await reviewTrigger.trigger('click');
    expect(wrapper.findAll('.nav-dropdown')).toHaveLength(1);
    expect(wrapper.find('.nav-dropdown').attributes('aria-label')).toBe('Review options');
  });

  it('clicking the same trigger again closes the dropdown', async () => {
    const wrapper = mountHeader();
    const reviewTrigger = wrapper
      .findAll('.nav-menu-trigger')
      .find((b) => b.text().trim() === 'Review');

    await reviewTrigger.trigger('click');
    expect(wrapper.find('.nav-dropdown').exists()).toBe(true);

    await reviewTrigger.trigger('click');
    expect(wrapper.find('.nav-dropdown').exists()).toBe(false);
    expect(reviewTrigger.attributes('aria-expanded')).toBe('false');
  });

  it('each Review dropdown item navigates to its dedicated form route', async () => {
    const expected = [
      { label: 'Write a review', name: 'write-review' },
      { label: 'Publish photos', name: 'post-photos' },
      { label: 'Add a place', name: 'add-place' },
    ];

    for (const { label, name } of expected) {
      router = await setupRouter('/');
      const wrapper = mountHeader();
      const reviewTrigger = wrapper
        .findAll('.nav-menu-trigger')
        .find((b) => b.text().trim() === 'Review');
      await reviewTrigger.trigger('click');

      const item = wrapper.findAll('.nav-dropdown-item').find((i) => i.text() === label);
      expect(item, label).toBeDefined();
      await item.trigger('click');
      await flushPromises();

      expect(router.currentRoute.value.name, label).toBe(name);
      expect(window.alert).not.toHaveBeenCalled();
      wrapper.unmount();
    }
  });

  it('clicking the Top destinations item navigates to /discover (no alert)', async () => {
    const wrapper = mountHeader();
    const discoverTrigger = wrapper
      .findAll('.nav-menu-trigger')
      .find((b) => b.text().trim() === 'Discover');
    await discoverTrigger.trigger('click');

    await wrapper.findAll('.nav-dropdown-item')[0].trigger('click');
    await flushPromises();

    expect(router.currentRoute.value.name).toBe('discover');
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('clicking outside the dropdown closes it', async () => {
    const wrapper = mountHeader();
    const reviewTrigger = wrapper
      .findAll('.nav-menu-trigger')
      .find((b) => b.text().trim() === 'Review');
    await reviewTrigger.trigger('click');
    expect(wrapper.find('.nav-dropdown').exists()).toBe(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.nav-dropdown').exists()).toBe(false);
  });

  it('Escape key closes any open dropdown', async () => {
    const wrapper = mountHeader();
    const reviewTrigger = wrapper
      .findAll('.nav-menu-trigger')
      .find((b) => b.text().trim() === 'Review');
    await reviewTrigger.trigger('click');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.nav-dropdown').exists()).toBe(false);
  });

  it('renders French labels in the dropdowns when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mountHeader();
    const triggers = wrapper.findAll('.nav-menu-trigger');
    const discoverTrigger = triggers.find((b) => b.text().trim() === 'Découvrir');
    expect(discoverTrigger).toBeDefined();

    await discoverTrigger.trigger('click');
    expect(wrapper.findAll('.nav-dropdown-item').map((i) => i.text())).toEqual([
      'Top destinations',
      'Récits de voyage',
    ]);

    const reviewTrigger = triggers.find((b) => b.text().trim() === 'Avis');
    await reviewTrigger.trigger('click');
    expect(wrapper.findAll('.nav-dropdown-item').map((i) => i.text())).toEqual([
      'Écrire un avis',
      'Publier des photos',
      'Ajouter un lieu',
    ]);
  });
});
