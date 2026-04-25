import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import AboutPage from '../src/pages/AboutPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('AboutPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/about');
  });

  it('renders the hero with title + subtitle and the parody block', () => {
    const wrapper = mount(AboutPage, withRouter(router));
    expect(wrapper.find('.ab-title').text()).toBe('About Tripote-visor');
    expect(wrapper.find('.ab-subtitle').text()).toMatch(/parody site/);

    expect(wrapper.find('.ab-block-title').text()).toBe('The parody');
    const body = wrapper.find('.ab-block-body').text();
    expect(body).toContain('parody of well-known travel review platforms');
    expect(body).toContain('client-facing reviews');
    expect(body).toContain('the gap between a polished interface');

    // No implementation tech in user-facing copy.
    expect(wrapper.text()).not.toContain('Vue');

    // The bridge sentence ("see Terms of Use") was removed.
    expect(wrapper.find('.ab-block-bridge').exists()).toBe(false);
  });

  it('embeds the shared SeriousNote callout', () => {
    const wrapper = mount(AboutPage, withRouter(router));
    const note = wrapper.find('.serious-note');
    expect(note.exists()).toBe(true);
    expect(note.attributes('role')).toBe('note');
    expect(note.find('.serious-note-label').text()).toBe('Please read');
    expect(note.find('.serious-note-title').text()).toBe(
      'A serious note on prostitution and human trafficking',
    );
    expect(note.text()).toContain('116 006');
  });

  it('serious note is rendered once on the page (no duplication with the parody block)', () => {
    const wrapper = mount(AboutPage, withRouter(router));
    expect(wrapper.findAll('.serious-note')).toHaveLength(1);
  });

  it('back-to-home button navigates to /', async () => {
    const wrapper = mount(AboutPage, withRouter(router));
    await wrapper.find('.ab-footer .pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(AboutPage, withRouter(router));
    expect(wrapper.find('.ab-title').text()).toBe('À propos de Tripote-visor');
    expect(wrapper.find('.ab-block-title').text()).toBe('La parodie');

    const body = wrapper.find('.ab-block-body').text();
    expect(body).toContain('parodie des grandes plateformes');
    expect(body).toContain('personnes prostituées');
    expect(body).not.toContain('Vue');

    expect(wrapper.find('.serious-note-title').text()).toBe(
      'Une note sérieuse sur la prostitution et la traite des êtres humains',
    );
    expect(wrapper.find('.ab-footer .pill-btn').text()).toBe('Retour à l’accueil');
  });
});

describe('Footer wiring for About', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('the first link in the About column points to /about', () => {
    const wrapper = mount(App, withRouter(router));
    const aboutCol = wrapper.findAll('.footer-col').at(0);
    const firstLink = aboutCol.find('li a');
    // EN label is "About Us" (col_about_1); FR label is "À propos de Tripote-visor".
    expect(firstLink.text()).toBe('About Us');
    expect(firstLink.attributes('href')).toBe('/about');
  });
});
