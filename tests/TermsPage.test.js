import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import TermsPage from '../src/pages/TermsPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('TermsPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/terms');
  });

  it('renders the hero with the title, effective date and parody badge', () => {
    const wrapper = mount(TermsPage, withRouter(router));
    expect(wrapper.find('.tos-title').text()).toBe('Terms of Use');
    expect(wrapper.find('.tos-effective').text()).toMatch(/Effective date:\s*25 April 2026/);
    expect(wrapper.find('.tos-badge').text()).toBe('Parody notice');
  });

  it('exposes the six numbered sections in order', () => {
    const wrapper = mount(TermsPage, withRouter(router));
    const titles = wrapper.findAll('.tos-section-title').map((h) => h.text());
    expect(titles).toEqual([
      '1. About this website',
      '2. No real data processing',
      '3. No restrictions on use',
      '4. Fictional content',
      '5. No warranty',
      '6. In short',
    ]);
  });

  it('declares the four user-required points (parody, no data, no restrictions, fictional)', () => {
    const wrapper = mount(TermsPage, withRouter(router));
    const text = wrapper.text();
    expect(text).toContain('parody');
    expect(text).toContain('does not collect, store, or transmit personal data');
    expect(text).toContain('No fee, no quota, no licence');
    expect(text).toContain('entirely fictional');
  });

  it('mounts the shared SeriousNote component outside the numbered article', () => {
    const wrapper = mount(TermsPage, withRouter(router));

    const note = wrapper.find('.serious-note');
    expect(note.exists()).toBe(true);
    expect(note.attributes('role')).toBe('note');

    expect(note.find('.serious-note-label').text()).toBe('Please read');
    expect(note.find('.serious-note-title').text()).toBe(
      'A serious note on prostitution and human trafficking',
    );

    const body = note.find('.serious-note-body').text();
    expect(body).toContain('International Labour Organization');
    expect(body).toContain('coerced');
    expect(body).toContain('criminal networks');
    expect(body).toContain('116 006');

    // The serious note must not be rendered inside the numbered article.
    expect(wrapper.findAll('.tos-document .serious-note')).toHaveLength(0);
  });

  it('back-to-home button navigates to /', async () => {
    const wrapper = mount(TermsPage, withRouter(router));
    await wrapper.find('.tos-footer .pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(TermsPage, withRouter(router));
    expect(wrapper.find('.tos-title').text()).toBe('Conditions d’utilisation');
    expect(wrapper.find('.tos-badge').text()).toBe('Avis de parodie');

    const titles = wrapper.findAll('.tos-section-title').map((h) => h.text());
    expect(titles).toEqual([
      '1. À propos du site',
      '2. Aucun traitement de données réel',
      '3. Aucune restriction d’usage',
      '4. Contenu fictif',
      '5. Aucune garantie',
      '6. En résumé',
    ]);

    const text = wrapper.text();
    expect(text).toContain('parodie');
    expect(text).toContain('aucune donnée personnelle');
    expect(wrapper.find('.tos-footer .pill-btn').text()).toBe('Retour à l’accueil');

    // Serious note also localised
    const note = wrapper.find('.serious-note');
    expect(note.find('.serious-note-label').text()).toBe('À lire');
    expect(note.find('.serious-note-title').text()).toBe(
      'Une note sérieuse sur la prostitution et la traite des êtres humains',
    );
    expect(note.text()).toContain('Organisation internationale du travail');
    expect(note.text()).toContain('Ac.Sé');
    expect(note.text()).toContain('116 006');
  });
});

describe('Footer wiring for Terms of Use', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('the legal nav exposes the Terms of Use link wired to /terms', () => {
    const wrapper = mount(App, withRouter(router));
    const link = wrapper.findAll('.legal a').find((a) => a.text() === 'Terms of Use');
    expect(link).toBeDefined();
    expect(link.attributes('href')).toBe('/terms');
  });
});
