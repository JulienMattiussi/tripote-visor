import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeader from '../src/components/AppHeader.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';

describe('AppHeader', () => {
  beforeEach(() => {
    setLocale('en');
    setCurrency('USD');
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
