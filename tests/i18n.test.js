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
import { setupRouter, withRouter } from './helpers/router.js';

describe('i18n store', () => {
  beforeEach(() => {
    setLocale('en');
    setCurrency('USD');
  });

  it('returns English strings by default', () => {
    expect(t('nav.discover')).toBe('Discover');
    expect(t('hero.title')).toBe('Where to?');
  });

  it('returns French strings after switching locale', () => {
    setLocale('fr');
    expect(t('nav.discover')).toBe('Découvrir');
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
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('renders French nav labels once locale is fr', async () => {
    const wrapper = mount(AppHeader, withRouter(router));
    expect(wrapper.text()).toContain('Discover');
    expect(wrapper.text()).toContain('Sign in');

    setLocale('fr');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Découvrir');
    expect(wrapper.text()).toContain('Se connecter');
  });
});
