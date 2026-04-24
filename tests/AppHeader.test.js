import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeader from '../src/components/AppHeader.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';

const setScroll = async (wrapper, y) => {
  Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
  Object.defineProperty(window, 'pageYOffset', { value: y, configurable: true, writable: true });
  window.dispatchEvent(new Event('scroll'));
  await wrapper.vm.$nextTick();
};

describe('AppHeader', () => {
  beforeEach(() => {
    setLocale('en');
    setCurrency('USD');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true, writable: true });
  });

  it('renders the logo with the bust icon and brand name', () => {
    const wrapper = mount(AppHeader);

    expect(wrapper.find('.logo').exists()).toBe(true);
    expect(wrapper.find('.logo-owl').exists()).toBe(true);
    expect(wrapper.find('.logo-text').text()).toBe('Tripote-visor');
  });

  it('exposes the full nav with the highlighted Plan with AI entry', () => {
    const wrapper = mount(AppHeader);
    const items = wrapper.findAll('.main-nav li');

    expect(items).toHaveLength(5);
    expect(items.map((li) => li.text())).toEqual(
      expect.arrayContaining(['Rewards', 'Discover', 'Review', 'Forums']),
    );

    const highlight = wrapper.find('.main-nav li.highlight');
    expect(highlight.exists()).toBe(true);
    expect(highlight.text()).toContain('Plan with AI');
  });

  it('uses CSS variables for the brand color (no hardcoded hex)', () => {
    const wrapper = mount(AppHeader);
    const html = wrapper.html();

    expect(html).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(html).toContain('var(--brand)');
  });
});

describe('AppHeader scroll-triggered compact state', () => {
  beforeEach(() => {
    setLocale('en');
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
    Object.defineProperty(window, 'pageYOffset', { value: 0, configurable: true, writable: true });
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('at scroll 0, shows the default nav and no compact search or category tabs', () => {
    const wrapper = mount(AppHeader);
    expect(wrapper.classes()).not.toContain('scrolled');
    expect(wrapper.find('.main-nav').exists()).toBe(true);
    expect(wrapper.find('.compact-search').exists()).toBe(false);
    expect(wrapper.find('.category-tabs-row').exists()).toBe(false);
  });

  it('crossing the scroll threshold shows the compact search, keeps Discover + Review in the nav, and drops Plan with AI / Rewards / Forums', async () => {
    const wrapper = mount(AppHeader);

    await setScroll(wrapper, 250);

    expect(wrapper.classes()).toContain('scrolled');
    expect(wrapper.find('.compact-search').exists()).toBe(true);
    expect(wrapper.find('.compact-search input').attributes('placeholder')).toBe('Search');

    // Nav still exists but only keeps the two secondary quick links.
    const navLabels = wrapper.findAll('.main-nav li').map((li) => li.text());
    expect(navLabels).toEqual(['Discover', 'Review']);
    expect(wrapper.find('.main-nav li.highlight').exists()).toBe(false);

    // Category tabs row with the 5 verticals appears below.
    const tabs = wrapper.findAll('.category-nav li');
    expect(tabs.map((t) => t.text())).toEqual([
      'Hotels',
      'Things to Do',
      'Restaurants',
      'Cruises',
      'Forums',
    ]);
  });

  it('scrolling back above the threshold restores the full nav and hides the compact search + tabs row', async () => {
    const wrapper = mount(AppHeader);

    await setScroll(wrapper, 300);
    expect(wrapper.find('.compact-search').exists()).toBe(true);
    expect(wrapper.findAll('.main-nav li')).toHaveLength(2);

    await setScroll(wrapper, 0);
    expect(wrapper.classes()).not.toContain('scrolled');
    expect(wrapper.findAll('.main-nav li')).toHaveLength(5);
    expect(wrapper.find('.main-nav li.highlight').text()).toContain('Plan with AI');
    expect(wrapper.find('.compact-search').exists()).toBe(false);
    expect(wrapper.find('.category-tabs-row').exists()).toBe(false);
  });

  it('submits the compact search via alert only when non-empty', async () => {
    const wrapper = mount(AppHeader);
    await setScroll(wrapper, 300);

    await wrapper.find('.compact-search').trigger('submit');
    expect(window.alert).not.toHaveBeenCalled();

    await wrapper.find('.compact-search input').setValue('nancy');
    await wrapper.find('.compact-search').trigger('submit');
    expect(window.alert).toHaveBeenCalledOnce();
    expect(window.alert.mock.calls[0][0]).toContain('nancy');
  });

  it('shows the French placeholder and category labels when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mount(AppHeader);
    await setScroll(wrapper, 300);

    expect(wrapper.find('.compact-search input').attributes('placeholder')).toBe('Rechercher');
    const tabs = wrapper.findAll('.category-nav li').map((t) => t.text());
    expect(tabs).toEqual(['Hôtels', 'Activités', 'Restaurants', 'Croisières', 'Forums']);
  });
});
