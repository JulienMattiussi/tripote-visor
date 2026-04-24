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

  it('renders the hero + five explanatory sections and a parody note', () => {
    const wrapper = mount(HowTheSiteWorksPage, withRouter(router));
    expect(wrapper.find('.how-hero-title').text()).toBe('How the site works');
    expect(wrapper.findAll('.how-section')).toHaveLength(5);

    const titles = wrapper.findAll('.how-section h2').map((h) => h.text());
    expect(titles).toEqual([
      'Reviews come from real travellers',
      'How places are ranked',
      'Travellers’ Choice',
      'How Tripote-visor makes money',
      'Report a problem',
    ]);

    expect(wrapper.find('.how-parody').attributes('role')).toBe('note');
    expect(wrapper.find('.how-parody').text()).toContain('parody');
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
      'Des avis de vrais voyageurs',
      'Comment les lieux sont classés',
      'Travellers’ Choice',
      'Comment Tripote-visor gagne de l’argent',
      'Signaler un problème',
    ]);
    expect(wrapper.find('.how-back').text()).toBe('Retour à l’accueil');
  });
});

describe('Footer link to How the site works', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('clicking the "How the site works" link in the legal nav navigates to /how-it-works', async () => {
    const wrapper = mount(App, withRouter(router));
    const link = wrapper.findAll('.legal a').find((a) => a.text() === 'How the site works');
    expect(link).toBeDefined();
    expect(link.attributes('href')).toBe('/how-it-works');
  });

  it('the About column exposes "How the site works" as the last link, wired to /how-it-works', () => {
    const wrapper = mount(App, withRouter(router));
    const aboutCol = wrapper.findAll('.footer-col').at(0);
    const items = aboutCol.findAll('li');

    expect(items).toHaveLength(6);
    expect(items.at(-1).text()).toBe('How the site works');

    const link = items.at(-1).find('a');
    expect(link.attributes('href')).toBe('/how-it-works');
  });
});
