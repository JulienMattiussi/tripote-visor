import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import SafetyPage from '../src/pages/SafetyPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('SafetyPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/safety');
  });

  it('renders the hero with title + subtitle', () => {
    const wrapper = mount(SafetyPage, withRouter(router));
    expect(wrapper.find('.sf-title').text()).toBe('Trust & Safety');
    expect(wrapper.find('.sf-subtitle').text()).toBe('Our content integrity policy.');
  });

  it('exposes the intro, the four belief sections, the detect block, the sanctions block and the limits block in order', () => {
    const wrapper = mount(SafetyPage, withRouter(router));
    const titles = wrapper.findAll('.sf-section-title').map((h) => h.text());
    expect(titles).toEqual([
      'Our approach to content integrity',
      'Real experiences from real clients',
      'Every encounter deserves a voice',
      'The rules apply to every listing',
      'A wide catalogue means stricter rules',
      'How we identify fraudulent content',
      'How we sanction fraud',
      'What this platform does not do',
    ]);
  });

  it('renders 5 detection bullets and 4 sanction bullets', () => {
    const wrapper = mount(SafetyPage, withRouter(router));
    const lists = wrapper.findAll('.sf-bullets');
    expect(lists).toHaveLength(2);
    expect(lists[0].findAll('li')).toHaveLength(5);
    expect(lists[1].findAll('li')).toHaveLength(4);
  });

  it('the "limits" block surfaces the no-police statement and points to the serious note', () => {
    const wrapper = mount(SafetyPage, withRouter(router));
    const limits = wrapper.find('.sf-limits');
    expect(limits.text()).toContain('do not partner with the police');
    expect(limits.text()).toContain('do not verify');
    expect(limits.text()).toMatch(/note immediately below/);
  });

  it('mounts the shared SeriousNote callout once, after the document', () => {
    const wrapper = mount(SafetyPage, withRouter(router));
    expect(wrapper.findAll('.serious-note')).toHaveLength(1);
    // It must be rendered outside the policy article.
    expect(wrapper.findAll('.sf-document .serious-note')).toHaveLength(0);
    expect(wrapper.find('.serious-note-title').text()).toBe(
      'A serious note on prostitution and human trafficking',
    );
  });

  it('back-to-home button navigates to /', async () => {
    const wrapper = mount(SafetyPage, withRouter(router));
    await wrapper.find('.sf-footer .pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(SafetyPage, withRouter(router));
    expect(wrapper.find('.sf-title').text()).toBe('Confiance et sécurité');

    const titles = wrapper.findAll('.sf-section-title').map((h) => h.text());
    expect(titles).toEqual([
      'Notre approche de l’intégrité des contenus',
      'Des expériences vécues par de vrais clients',
      'Chaque rencontre mérite d’être racontée',
      'Les mêmes règles pour toutes et tous',
      'Un large catalogue impose des règles plus strictes',
      'Comment nous identifions la fraude',
      'Comment nous sanctionnons la fraude',
      'Ce que cette plateforme ne fait pas',
    ]);

    expect(wrapper.find('.sf-limits').text()).toContain(
      'aucun partenariat avec les forces de l’ordre',
    );
    expect(wrapper.find('.serious-note-title').text()).toBe(
      'Une note sérieuse sur la prostitution et la traite des êtres humains',
    );
    expect(wrapper.find('.sf-footer .pill-btn').text()).toBe('Retour à l’accueil');
  });
});

describe('Footer wiring for Trust & Safety', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('the "Trust & Safety" link in the About column points to /safety', () => {
    const wrapper = mount(App, withRouter(router));
    const link = wrapper.findAll('.footer-col a').find((a) => a.text() === 'Trust & Safety');
    expect(link).toBeDefined();
    expect(link.attributes('href')).toBe('/safety');
  });
});
