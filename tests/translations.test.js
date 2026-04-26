import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import { translations } from '../src/i18n/translations.js';
import { t, setLocale, setCurrency, AVAILABLE_LOCALES } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

const flattenKeys = (obj, prefix = '') => {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flattenKeys(v, key));
    } else {
      out.push(key);
    }
  }
  return out;
};

const getByPath = (obj, path) =>
  path.split('.').reduce((acc, seg) => (acc == null ? undefined : acc[seg]), obj);

describe('translation dictionary integrity', () => {
  it('exposes exactly the two locales the preferences modal offers', () => {
    expect(Object.keys(translations).sort()).toEqual([...AVAILABLE_LOCALES].sort());
  });

  it('has the same key set in every locale (no key missing in en or fr)', () => {
    const keysByLocale = Object.fromEntries(
      Object.entries(translations).map(([loc, dict]) => [loc, new Set(flattenKeys(dict))]),
    );
    const enKeys = keysByLocale.en;
    const frKeys = keysByLocale.fr;

    const missingInFr = [...enKeys].filter((k) => !frKeys.has(k));
    const missingInEn = [...frKeys].filter((k) => !enKeys.has(k));

    expect(missingInFr).toEqual([]);
    expect(missingInEn).toEqual([]);
  });

  it('every string value is a non-empty string', () => {
    for (const [loc, dict] of Object.entries(translations)) {
      for (const key of flattenKeys(dict)) {
        const value = getByPath(dict, key);
        expect(typeof value, `${loc}.${key}`).toBe('string');
        expect(value.trim().length, `${loc}.${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('no translation contains the em-dash character (U+2014); use a regular hyphen instead', () => {
    for (const [loc, dict] of Object.entries(translations)) {
      for (const key of flattenKeys(dict)) {
        const value = getByPath(dict, key);
        expect(value.includes('—'), `${loc}.${key} contains an em-dash`).toBe(false);
      }
    }
  });

  it('placeholders in en and fr use the same set of {name} tokens per key', () => {
    const extractTokens = (s) => {
      const tokens = new Set();
      const re = /\{(\w+)\}/g;
      let m;
      while ((m = re.exec(s)) !== null) tokens.add(m[1]);
      return [...tokens].sort();
    };

    for (const key of flattenKeys(translations.en)) {
      const enTokens = extractTokens(getByPath(translations.en, key));
      const frTokens = extractTokens(getByPath(translations.fr, key));
      expect(frTokens, key).toEqual(enTokens);
    }
  });

  it('strings that must genuinely differ between en and fr actually differ', () => {
    // Keys that are the same literal in both languages are fine (brand names,
    // "France", shared year labels, etc.). But the visible navigation chrome
    // and section titles must be translated, not left in English.
    const mustDiffer = [
      'nav.discover',
      'nav.review_write',
      'nav.review_add_place',
      'nav.discover_stories',
      'nav.sign_in',
      'hero.title',
      'hero.search_btn',
      'hero.tab_all',
      'hero.tab_things',
      'ttd.cta',
      'ttd.subtitle',
      'age_groups.title',
      'age_groups.subtitle',
      'age_groups.under_30',
      'age_groups.over_60',
      'experiences.title',
      'experiences.subtitle',
      'experiences.from_price',
      'discover_page.hero_title',
      'discover_page.section_title',
      'dest_top.title',
      'tc.cta',
      'community.title',
      'footer.col_about_1',
      'footer.col_explore_title',
      'footer.legal_terms',
      'footer.read_more',
      'prefs.title',
      'prefs.unavailable',
    ];
    for (const key of mustDiffer) {
      expect(getByPath(translations.en, key), key).not.toBe(getByPath(translations.fr, key));
    }
  });
});

describe('locale switching on the full App', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    setCurrency('USD');
    router = await setupRouter('/');
  });
  const mountApp = () => mount(App, withRouter(router));

  // Each EN sample must be a distinctive string that does NOT appear as a
  // substring of any FR translation (catches partial matches like
  // "Explore" ⊂ "Explorez"). FR_SAMPLES holds the expected French replacement
  // for the same screen area.
  const EN_SAMPLES = [
    'Discover',
    'Sign in',
    'What environment?',
    'Search All',
    'Discover now',
    'Pick the age range that suits you',
    'Four cities, four exceptional experiences.',
    'Four stories you won’t forget',
    'Read the stories',
    'About Tripote-visor',
    'Read more ▾',
  ];

  const FR_SAMPLES = [
    'Découvrir',
    'Se connecter',
    'Quel environnement ?',
    'Tout rechercher',
    'Découvrez maintenant',
    'Choisissez selon l’âge qui vous convient',
    'Quatre villes, quatre expériences exceptionnelles.',
    'Quatre histoires qu’on n’oublie pas',
    'Lire les récits',
    'À propos de Tripote-visor',
    'Voir plus ▾',
  ];

  it('renders every sampled English string by default', () => {
    const wrapper = mountApp();
    const text = wrapper.text();
    for (const sample of EN_SAMPLES) {
      expect(text, sample).toContain(sample);
    }
  });

  it('switching to fr replaces every sampled English string with its French counterpart', async () => {
    const wrapper = mountApp();
    setLocale('fr');
    await wrapper.vm.$nextTick();
    const text = wrapper.text();

    for (const sample of FR_SAMPLES) {
      expect(text, sample).toContain(sample);
    }
    // None of the distinctive English samples should still be present.
    for (const sample of EN_SAMPLES) {
      expect(text, sample).not.toContain(sample);
    }
  });

  it('switching back from fr to en restores every English string', async () => {
    const wrapper = mountApp();
    setLocale('fr');
    await wrapper.vm.$nextTick();
    setLocale('en');
    await wrapper.vm.$nextTick();
    const text = wrapper.text();
    for (const sample of EN_SAMPLES) {
      expect(text, sample).toContain(sample);
    }
  });

  it('the html lang attribute follows the selected locale', async () => {
    mountApp();
    setLocale('fr');
    await Promise.resolve();
    expect(document.documentElement.lang).toBe('fr');
    setLocale('en');
    await Promise.resolve();
    expect(document.documentElement.lang).toBe('en');
  });

  it('aria-labels and image alt text are translated along with body copy', async () => {
    const wrapper = mountApp();
    setLocale('fr');
    await wrapper.vm.$nextTick();

    const ttdImg = wrapper.find('.ttd-image img');
    expect(ttdImg.attributes('alt')).toBe(translations.fr.ttd.alt_image);

    const socials = wrapper.find('.socials');
    expect(socials.attributes('aria-label')).toBe(translations.fr.footer.socials_aria);
  });

  it('footer country select shows the translated country name', async () => {
    const wrapper = mountApp();
    const options = () =>
      wrapper
        .findAll('.selects select')
        .at(1)
        .findAll('option')
        .slice(0, 2)
        .map((o) => o.text());

    expect(options()).toEqual(['United States', 'France']);

    setLocale('fr');
    await wrapper.vm.$nextTick();
    expect(options()).toEqual(['États-Unis', 'France']);
  });

  it('prices reformat to EUR with French grouping when switching to fr/EUR', async () => {
    const wrapper = mountApp();
    // Default EN/USD: at least one price uses the "from $X" template
    expect(wrapper.text()).toMatch(/from \$\d+/);

    setLocale('fr');
    setCurrency('EUR');
    await wrapper.vm.$nextTick();
    const text = wrapper.text();
    expect(text).toMatch(/à partir de \d[\d\s]*\s?€/);
    expect(text).not.toMatch(/from \$\d+/);
  });

  it('interpolated values (year, amount) are reused across locales', async () => {
    setLocale('en');
    setCurrency('USD');
    const wrapper = mountApp();
    const year = new Date().getFullYear();
    expect(wrapper.text()).toContain(`© ${year} Tripote-visor LLC All rights reserved.`);

    setLocale('fr');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain(`© ${year} Tripote-visor LLC Tous droits réservés.`);
  });
});

describe('no hardcoded UI string leaks in components', () => {
  let router;
  beforeEach(async () => {
    router = await setupRouter('/');
  });
  const mountApp = () => mount(App, withRouter(router));

  it('does not leave a literal "Discover now" or "Sign in" label anywhere when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mountApp();
    await wrapper.vm.$nextTick();
    const text = wrapper.text();

    // Strings that used to be hardcoded in templates or alerts - would slip
    // through to FR mode if someone ever adds a literal again.
    expect(text).not.toContain('Discover now');
    expect(text).not.toContain('Sign in');
    expect(text).not.toContain('Donate now');
    expect(text).not.toContain('Read the stories');
  });

  it('t() applied to every currently known key yields a string for both locales', () => {
    for (const loc of AVAILABLE_LOCALES) {
      setLocale(loc);
      for (const key of flattenKeys(translations.en)) {
        const value = t(key);
        expect(typeof value, `${loc}/${key}`).toBe('string');
        expect(value.length, `${loc}/${key}`).toBeGreaterThan(0);
        // t() must not return the raw key - that would mean a lookup miss.
        expect(value, `${loc}/${key}`).not.toBe(key);
      }
    }
    // Reset
    setLocale('en');
  });
});
