import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import HeroSearch from '../src/components/HeroSearch.vue';
import { setLocale } from '../src/i18n/store.js';

describe('HeroSearch', () => {
  beforeEach(() => {
    setLocale('en');
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the 4 search tabs (Cruises was removed)', () => {
    const wrapper = mount(HeroSearch);
    const tabs = wrapper.findAll('.tab');

    expect(tabs).toHaveLength(4);
    const labels = tabs.map((t) => t.text());
    expect(labels.join(' ')).toMatch(/Search All.*Hotels.*Parks.*Alleys/);
    expect(labels.join(' ')).not.toContain('Cruises');
    expect(labels.join(' ')).not.toContain('Restaurants');
  });

  it('keeps the same unified placeholder across every tab', async () => {
    const wrapper = mount(HeroSearch);
    const input = wrapper.find('input[type="text"]');

    expect(input.attributes('placeholder')).toBe('A name, a city, a fancy…');
    await wrapper.findAll('.tab')[1].trigger('click');
    expect(input.attributes('placeholder')).toBe('A name, a city, a fancy…');
    await wrapper.findAll('.tab')[3].trigger('click');
    expect(input.attributes('placeholder')).toBe('A name, a city, a fancy…');
  });

  it('ignores submit when the query is empty', async () => {
    const wrapper = mount(HeroSearch);
    await wrapper.find('form').trigger('submit');
    expect(window.alert).not.toHaveBeenCalled();
  });
});
