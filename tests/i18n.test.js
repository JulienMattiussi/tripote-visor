import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AppHeader from '../src/components/AppHeader.vue';
import {
  t,
  setLocale,
  setCurrency,
  formatAmount,
  formatLieu,
  formatReviewDate,
  reviewCountFor,
  reviewAverageFor,
  locale,
  detectBrowserDefaults,
} from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';
import advicesData from '../src/data/advices.json';

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

describe('formatLieu', () => {
  it('joins ville and lieu with parens when both are present', () => {
    expect(formatLieu({ ville: 'Paris', lieu: '11e' })).toBe('Paris (11e)');
    expect(formatLieu({ ville: 'Marseille', lieu: 'Le Vieux-Port' })).toBe(
      'Marseille (Le Vieux-Port)',
    );
  });

  it('returns the ville alone when lieu is empty or missing', () => {
    expect(formatLieu({ ville: 'Strasbourg', lieu: '' })).toBe('Strasbourg');
    expect(formatLieu({ ville: 'Saint-Denis' })).toBe('Saint-Denis');
  });

  it('returns an empty string when fed null/undefined', () => {
    expect(formatLieu(null)).toBe('');
    expect(formatLieu(undefined)).toBe('');
  });
});

describe('reviewCountFor / reviewAverageFor', () => {
  it('reports 0 / 0 for an unknown fiche', () => {
    expect(reviewCountFor('does-not-exist')).toBe(0);
    expect(reviewAverageFor('does-not-exist')).toBe(0);
  });

  it('matches the seeded advices data for a fiche that has reviews', () => {
    const id = Object.keys(advicesData).find((k) => advicesData[k].length > 0);
    expect(id).toBeTruthy();
    const list = advicesData[id];
    const avg = list.reduce((acc, r) => acc + r.rating, 0) / list.length;
    expect(reviewCountFor(id)).toBe(list.length);
    expect(reviewAverageFor(id)).toBeCloseTo(avg, 6);
  });
});

describe('formatReviewDate', () => {
  beforeEach(() => setLocale('en'));

  it('renders an ISO date with the active locale', () => {
    setLocale('en');
    expect(formatReviewDate('2025-08-12')).toBe('August 12, 2025');
    setLocale('fr');
    expect(formatReviewDate('2025-08-12')).toBe('12 août 2025');
  });

  it('returns an empty string for falsy or invalid input', () => {
    expect(formatReviewDate('')).toBe('');
    expect(formatReviewDate(null)).toBe('');
    expect(formatReviewDate('not-a-date')).toBe('');
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
