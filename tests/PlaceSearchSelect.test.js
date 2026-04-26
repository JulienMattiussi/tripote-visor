import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PlaceSearchSelect from '../src/components/PlaceSearchSelect.vue';
import profilesData from '../src/data/profiles.json';
import { setLocale } from '../src/i18n/store.js';

const mireille = profilesData.find((f) => f.id === 'mireille');

beforeEach(() => setLocale('en'));

describe('PlaceSearchSelect', () => {
  it('renders the search input when modelValue is null', () => {
    const wrapper = mount(PlaceSearchSelect, {
      props: { modelValue: null, placeholder: 'Search for a place' },
    });
    expect(wrapper.find('.ps-search input').exists()).toBe(true);
    expect(wrapper.find('.ps-search input').attributes('placeholder')).toBe('Search for a place');
    expect(wrapper.find('.ps-selected').exists()).toBe(false);
  });

  it('shows up to 6 suggestions matching the typed query', async () => {
    const wrapper = mount(PlaceSearchSelect, {
      props: { modelValue: null, placeholder: '' },
    });
    await wrapper.find('.ps-search input').setValue('Paris');
    const cards = wrapper.findAll('.ps-suggestion');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThanOrEqual(6);
  });

  it('shows the no-match copy when the query has no result', async () => {
    const wrapper = mount(PlaceSearchSelect, {
      props: { modelValue: null, placeholder: '' },
    });
    await wrapper.find('.ps-search input').setValue('zzz-no-match-zzz');
    expect(wrapper.find('.ps-suggestion').exists()).toBe(false);
    expect(wrapper.find('.ps-no-match').text()).toBe('No place matches your search.');
  });

  it('emits update:modelValue with the picked profile on suggestion click', async () => {
    const wrapper = mount(PlaceSearchSelect, {
      props: { modelValue: null, placeholder: '' },
    });
    await wrapper.find('.ps-search input').setValue('Mireille');
    await wrapper.find('.ps-suggestion').trigger('click');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0].id).toBe('mireille');
  });

  it('renders the selected card when modelValue is a profile, and × emits null', async () => {
    const wrapper = mount(PlaceSearchSelect, {
      props: { modelValue: mireille, placeholder: '' },
    });
    expect(wrapper.find('.ps-search').exists()).toBe(false);
    expect(wrapper.find('.ps-selected').exists()).toBe(true);
    expect(wrapper.find('.ps-selected-name').text()).toBe('Mireille la folle');
    expect(wrapper.find('.ps-selected-loc').text()).toBe('Paris (11e)');

    await wrapper.find('.ps-selected-clear').trigger('click');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toBeNull();
  });

  it('renders French copy when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mount(PlaceSearchSelect, {
      props: { modelValue: null, placeholder: '' },
    });
    await wrapper.find('.ps-search input').setValue('zzz-no-match');
    expect(wrapper.find('.ps-no-match').text()).toBe('Aucun lieu ne correspond à votre recherche.');
  });
});
