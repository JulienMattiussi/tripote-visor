import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

let router;
const mountApp = () => mount(App, withRouter(router));

describe('App', () => {
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  it('renders header, main, and footer landmarks', () => {
    const wrapper = mountApp();

    expect(wrapper.find('header.site-header').exists()).toBe(true);
    expect(wrapper.find('main').exists()).toBe(true);
    expect(wrapper.find('footer').exists()).toBe(true);
  });

  it('renders every home-page section component on the / route', () => {
    const wrapper = mountApp();
    const html = wrapper.html();

    expect(html).toContain('Where to?'); // HeroSearch
    expect(html).toContain('Find things to do by interest'); // CategoryGrid
    expect(html).toContain("Travelers' Choice"); // TravelersChoice (home section)
  });

  it('renders the Travelers’ Choice page when navigating to /travelers-choice', async () => {
    router = await setupRouter('/travelers-choice');
    const wrapper = mount(App, withRouter(router));

    const text = wrapper.text();
    expect(text).toContain("Travellers' Choice Awards Best of the Best 2026");
    expect(text).toContain('Hotels — Best of the Best');
    // Home section title is gone — the home page is no longer rendered.
    expect(text).not.toContain('Where to?');
    expect(text).not.toContain('Find things to do by interest');
  });
});
