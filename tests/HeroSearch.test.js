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

  it('shows all 5 search tabs', () => {
    const wrapper = mount(HeroSearch);
    const tabs = wrapper.findAll('.tab');

    expect(tabs).toHaveLength(5);
    const labels = tabs.map((t) => t.text());
    expect(labels.join(' ')).toMatch(/Search All.*Hotels.*Things to Do.*Restaurants.*Cruises/);
  });

  it('switches the placeholder when the active tab changes', async () => {
    const wrapper = mount(HeroSearch);
    const input = wrapper.find('input[type="text"]');

    expect(input.attributes('placeholder')).toMatch(/Places to go/i);

    await wrapper.findAll('.tab')[1].trigger('click');
    expect(input.attributes('placeholder')).toMatch(/Where are you going/i);
  });

  it('ignores submit when the query is empty', async () => {
    const wrapper = mount(HeroSearch);
    await wrapper.find('form').trigger('submit');
    expect(window.alert).not.toHaveBeenCalled();
  });
});
