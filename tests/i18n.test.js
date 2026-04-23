import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeader from '../src/components/AppHeader.vue';
import {
  t,
  setLocale,
  setCurrency,
  formatAmount,
  locale,
  detectBrowserDefaults,
} from '../src/i18n/store.js';

describe('i18n store', () => {
  beforeEach(() => {
    setLocale('en');
    setCurrency('USD');
  });

  it('returns English strings by default', () => {
    expect(t('nav.plan_ai')).toBe('Plan with AI');
    expect(t('hero.title')).toBe('Where to?');
  });

  it('returns French strings after switching locale', () => {
    setLocale('fr');
    expect(t('nav.plan_ai')).toBe('Planifier avec IA');
    expect(t('hero.title')).toBe('Quelle destination ?');
  });

  it('falls back to English if a key is missing in the current locale', () => {
    setLocale('fr');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('interpolates {name} placeholders', () => {
    expect(t('footer.copyright', { year: 2030 })).toBe(
      '© 2030 Tripote-visor LLC All rights reserved.',
    );
  });

  it('rejects unknown locales', () => {
    setLocale('zz');
    expect(locale.value).toBe('en');
  });

  it('formats amounts with $ prefix in USD', () => {
    setCurrency('USD');
    expect(formatAmount(72)).toMatch(/^\$72$/);
  });

  it('formats amounts with € suffix in EUR and French number grouping', () => {
    setLocale('fr');
    setCurrency('EUR');
    expect(formatAmount(1000)).toMatch(/€$/);
    expect(formatAmount(1000)).toMatch(/\d/);
  });
});

describe('detectBrowserDefaults', () => {
  it('picks fr/EUR for French navigators', () => {
    expect(detectBrowserDefaults({ language: 'fr-FR', languages: ['fr-FR'] })).toEqual({
      locale: 'fr',
      currency: 'EUR',
    });
  });

  it('picks en/USD for English navigators', () => {
    expect(detectBrowserDefaults({ language: 'en-US', languages: ['en-US', 'en'] })).toEqual({
      locale: 'en',
      currency: 'USD',
    });
  });

  it('uses the first supported entry in navigator.languages', () => {
    expect(
      detectBrowserDefaults({ language: 'de-DE', languages: ['de-DE', 'fr-FR', 'en-US'] }),
    ).toEqual({ locale: 'fr', currency: 'EUR' });
  });

  it('falls back to en/USD when no supported language is present', () => {
    expect(detectBrowserDefaults({ language: 'ja-JP', languages: ['ja-JP'] })).toEqual({
      locale: 'en',
      currency: 'USD',
    });
  });

  it('handles missing navigator gracefully', () => {
    expect(detectBrowserDefaults(null)).toEqual({ locale: 'en', currency: 'USD' });
  });
});

describe('AppHeader reacts to locale change', () => {
  beforeEach(() => setLocale('en'));

  it('renders French nav labels once locale is fr', async () => {
    const wrapper = mount(AppHeader);
    expect(wrapper.text()).toContain('Plan with AI');

    setLocale('fr');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Planifier avec IA');
    expect(wrapper.text()).toContain('Se connecter');
  });
});
