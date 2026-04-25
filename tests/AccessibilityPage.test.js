import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import AccessibilityPage from '../src/pages/AccessibilityPage.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('AccessibilityPage', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/accessibility');
  });

  it('renders the hero with three shield icons and the page title', () => {
    const wrapper = mount(AccessibilityPage, withRouter(router));
    expect(wrapper.find('.acc-title').text()).toBe('Accessibility statement');
    expect(wrapper.findAll('.acc-shield')).toHaveLength(3);
  });

  it('mentions the EAA and WCAG references with external links', () => {
    const wrapper = mount(AccessibilityPage, withRouter(router));
    const text = wrapper.text();
    expect(text).toContain('European Accessibility Act');
    expect(text).toContain('WCAG 2.1 AA');
    expect(text).toContain('Since June 2025');

    const links = wrapper.findAll('.acc-links a');
    expect(links).toHaveLength(2);
    for (const a of links) {
      expect(a.attributes('target')).toBe('_blank');
      expect(a.attributes('rel')).toBe('noopener noreferrer');
    }
  });

  it('back-to-home button navigates to /', async () => {
    const wrapper = mount(AccessibilityPage, withRouter(router));
    await wrapper.find('.acc-back').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('renders the page in French', () => {
    setLocale('fr');
    const wrapper = mount(AccessibilityPage, withRouter(router));
    expect(wrapper.find('.acc-title').text()).toBe('Politique d’accessibilité');
    expect(wrapper.text()).toContain('Depuis juin 2025');
    expect(wrapper.text()).toContain('Acte législatif européen');
    expect(wrapper.find('.acc-back').text()).toBe('Retour à l’accueil');
  });
});

describe('Footer wiring for accessibility', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('the legal nav no longer contains a "Contact us" link', () => {
    const wrapper = mount(App, withRouter(router));
    const labels = wrapper.findAll('.legal a, .legal a[href]').map((a) => a.text());
    expect(labels).not.toContain('Contact us');
  });

  it('the "Accessibility Statement" link in the legal nav points to /accessibility', () => {
    const wrapper = mount(App, withRouter(router));
    const link = wrapper.findAll('.legal a').find((a) => a.text() === 'Accessibility Statement');
    expect(link).toBeDefined();
    expect(link.attributes('href')).toBe('/accessibility');
  });
});
