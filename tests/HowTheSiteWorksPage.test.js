import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import HowTheSiteWorksPage from '../src/pages/HowTheSiteWorksPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('HowTheSiteWorksPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/how-it-works');
  });

  it('renders the hero, nine explanatory sections, and the parody note', () => {
    const wrapper = mount(HowTheSiteWorksPage, withRouter(router));
    expect(wrapper.find('.how-hero-title').text()).toBe('How the site works');
    expect(wrapper.findAll('.how-section')).toHaveLength(9);

    const titles = wrapper.findAll('.how-section h2').map((h) => h.text());
    expect(titles).toEqual([
      'Who can be listed',
      'How places are ranked',
      'Travellers’ Choice',
      'How Tripote-visor makes money',
      'How reviews are moderated',
      'When reviews appear and how long they stay',
      'No paid reviews',
      'AI summaries and machine translations',
      'Our role, and how to report a problem',
    ]);

    expect(wrapper.find('.how-parody').attributes('role')).toBe('note');
    expect(wrapper.find('.how-parody').text()).toContain('parody');
  });

  it('surfaces the real Tripote-visor terminology and numeric commitments', () => {
    const wrapper = mount(HowTheSiteWorksPage, withRouter(router));
    const text = wrapper.text();

    // Key product terms borrowed from the real reference page.
    expect(text).toContain('Popularity Ranking');
    expect(text).toContain('Cost Per Click');
    expect(text).toContain('Travellers’ Choice');

    // Representative numbers from the actual policies.
    expect(text).toMatch(/24\/7/);
    expect(text).toMatch(/twelve weeks/);
    expect(text).toMatch(/24 to 48 hours/);
  });

  it('back-to-home button navigates to /', async () => {
    const wrapper = mount(HowTheSiteWorksPage, withRouter(router));
    await wrapper.find('.how-back').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(HowTheSiteWorksPage, withRouter(router));
    expect(wrapper.find('.how-hero-title').text()).toBe('Fonctionnement du site');
    const titles = wrapper.findAll('.how-section h2').map((h) => h.text());
    expect(titles).toEqual([
      'Qui peut être répertorié',
      'Comment les lieux sont classés',
      'Travellers’ Choice',
      'Comment Tripote-visor gagne de l’argent',
      'Modération des avis',
      'Publication et durée de vie des avis',
      'Pas d’avis contre rémunération',
      'Résumés par IA et traductions automatiques',
      'Notre rôle et comment signaler un problème',
    ]);

    const text = wrapper.text();
    expect(text).toContain('Coût par Clic');
    expect(text).toContain('Notre sélection');
    expect(text).toContain('Favoris des utilisateurs');
    expect(text).toMatch(/24h\/24/);
    expect(wrapper.find('.how-back').text()).toBe('Retour à l’accueil');
  });
});

describe('Footer link to How the site works', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('the legal nav no longer exposes a "How the site works" link (only the About column does)', () => {
    const wrapper = mount(App, withRouter(router));
    const labels = wrapper.findAll('.legal a').map((a) => a.text());
    expect(labels).not.toContain('How the site works');
  });

  it('the About column exposes "How the site works" as the last link, wired to /how-it-works', () => {
    const wrapper = mount(App, withRouter(router));
    const aboutCol = wrapper.findAll('.footer-col').at(0);
    const items = aboutCol.findAll('li');

    // Careers + Investor Relations were removed - column now has 4 entries.
    expect(items).toHaveLength(4);
    expect(items.at(-1).text()).toBe('How the site works');

    const link = items.at(-1).find('a');
    expect(link.attributes('href')).toBe('/how-it-works');
  });
});
