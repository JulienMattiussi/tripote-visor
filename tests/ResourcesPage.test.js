import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import ResourcesPage from '../src/pages/ResourcesPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('ResourcesPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/resources');
  });

  it('renders the hero with title + subtitle', () => {
    const wrapper = mount(ResourcesPage, withRouter(router));
    expect(wrapper.find('.rs-title').text()).toBe('Resources and Policies');
    expect(wrapper.find('.rs-subtitle').text()).toMatch(/A quick overview/);
  });

  it('exposes the three top-level blocks: partners, content, policies', () => {
    const wrapper = mount(ResourcesPage, withRouter(router));
    const titles = wrapper.findAll('.rs-block-title').map((h) => h.text());
    expect(titles).toEqual(['For partners', 'Our editorial content', 'Our policies']);
  });

  it('the editorial content block has the two sub-articles (review journey + transparency report)', () => {
    const wrapper = mount(ResourcesPage, withRouter(router));
    const subTitles = wrapper.findAll('.rs-sub-title').map((h) => h.text());
    expect(subTitles).toEqual(['The journey of a review', 'Annual transparency report']);
  });

  it('the review-journey article shows 5 bullets and no follow-up link', () => {
    const wrapper = mount(ResourcesPage, withRouter(router));
    const bullets = wrapper.findAll('.rs-bullets li');
    expect(bullets).toHaveLength(5);

    // No "see in full / click here" link should remain in the page.
    expect(wrapper.text()).not.toMatch(/See full|click here|Afficher en entier/i);
  });

  it('the policies block lists 4 brief summaries (privacy, ToU, integrity, cookies) without links and without a mobile entry', () => {
    const wrapper = mount(ResourcesPage, withRouter(router));
    const titles = wrapper.findAll('.rs-policy-title').map((h) => h.text());
    expect(titles).toEqual([
      'Privacy policy',
      'Terms of use',
      'Content integrity policy',
      'Cookies charter',
    ]);
    // None of those summaries should ship a "click here" link.
    expect(wrapper.findAll('.rs-policy-body a')).toHaveLength(0);

    // No surviving reference to a mobile app or mobile licences anywhere on the page.
    expect(wrapper.text()).not.toMatch(/mobile|companion app/i);
  });

  it('back-to-home button navigates to /', async () => {
    const wrapper = mount(ResourcesPage, withRouter(router));
    await wrapper.find('.rs-footer .pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(ResourcesPage, withRouter(router));

    expect(wrapper.find('.rs-title').text()).toBe('Ressources et règlements');
    const titles = wrapper.findAll('.rs-block-title').map((h) => h.text());
    expect(titles).toEqual(['Pour les partenaires', 'Notre contenu éditorial', 'Nos politiques']);

    const policyTitles = wrapper.findAll('.rs-policy-title').map((h) => h.text());
    expect(policyTitles).toEqual([
      'Politique de confidentialité',
      'Conditions générales d’utilisation',
      'Politique d’intégrité des contenus',
      'Charte des cookies',
    ]);

    expect(wrapper.find('.rs-footer .pill-btn').text()).toBe('Retour à l’accueil');
  });
});

describe('Footer wiring for Resources and Policies', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('the "Resources and Policies" link in the About column points to /resources', () => {
    const wrapper = mount(App, withRouter(router));
    const link = wrapper
      .findAll('.footer-col a')
      .find((a) => a.text() === 'Resources and Policies');
    expect(link).toBeDefined();
    expect(link.attributes('href')).toBe('/resources');
  });
});
