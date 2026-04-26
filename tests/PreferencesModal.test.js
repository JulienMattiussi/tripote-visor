import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PreferencesModal from '../src/components/modals/PreferencesModal.vue';
import { locale, currency, setLocale, setCurrency } from '../src/i18n/store.js';
import { modalOpen, modalTab, openPreferences, closePreferences } from '../src/state/modals.js';

describe('PreferencesModal', () => {
  beforeEach(() => {
    closePreferences();
    setLocale('en');
    setCurrency('USD');
    modalTab.value = 'region';
  });

  it('is hidden until openPreferences() is called', () => {
    const wrapper = mount(PreferencesModal);
    expect(wrapper.find('.prefs-backdrop').exists()).toBe(false);

    openPreferences('region');
    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.find('.prefs-backdrop').exists()).toBe(true);
      expect(wrapper.find('.prefs-title').text()).toBe('Preferences');
    });
  });

  it('grays out every region except US and France with "Unavailable now"', async () => {
    openPreferences('region');
    const wrapper = mount(PreferencesModal);
    await wrapper.vm.$nextTick();

    const disabled = wrapper.findAll('.prefs-item.disabled');
    expect(disabled.length).toBeGreaterThan(10);

    const enabled = wrapper
      .findAll('.prefs-item:not(.disabled)')
      .map((b) => b.find('.prefs-item-label').text());
    // Enabled = the two suggested duplicates (France) + US + France in the grid
    expect(enabled).toContain('United States');
    expect(enabled).toContain('France');

    expect(disabled[0].text()).toContain('Unavailable now');
  });

  it('switching to Currency tab shows only USD and EUR as enabled', async () => {
    openPreferences('currency');
    const wrapper = mount(PreferencesModal);
    await wrapper.vm.$nextTick();

    const enabled = wrapper
      .findAll('.prefs-item:not(.disabled)')
      .map((b) => b.find('.prefs-item-label').text());
    expect(enabled).toEqual(['U.S. Dollars', 'Euro']);

    const disabledFirst = wrapper.find('.prefs-item.disabled');
    expect(disabledFirst.text()).toContain('Unavailable now');
  });

  it('selecting France switches locale to fr and updates currency to EUR independently', async () => {
    openPreferences('region');
    const wrapper = mount(PreferencesModal);
    await wrapper.vm.$nextTick();

    const franceButton = wrapper
      .findAll('.prefs-grid:not(.suggested) .prefs-item')
      .find((b) => b.find('.prefs-item-label').text() === 'France');
    await franceButton.trigger('click');

    expect(locale.value).toBe('fr');
    expect(currency.value).toBe('USD');

    modalTab.value = 'currency';
    await wrapper.vm.$nextTick();
    const euroBtn = wrapper
      .findAll('.prefs-item')
      .find((b) => b.find('.prefs-item-label').text() === 'Euro');
    await euroBtn.trigger('click');
    expect(currency.value).toBe('EUR');

    // Now the translated French label should be present in the tab strip
    expect(wrapper.find('.prefs-title').text()).toBe('Préférences');
  });

  it('clicking a disabled currency is a no-op', async () => {
    openPreferences('currency');
    const wrapper = mount(PreferencesModal);
    await wrapper.vm.$nextTick();

    const disabledBtn = wrapper.find('.prefs-item.disabled');
    await disabledBtn.trigger('click');
    expect(currency.value).toBe('USD');
  });

  it('modalOpen false after clicking the close button', async () => {
    openPreferences('region');
    const wrapper = mount(PreferencesModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('.prefs-close').trigger('click');
    expect(modalOpen.value).toBe(false);
  });
});
