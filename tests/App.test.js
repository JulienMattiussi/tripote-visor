import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';

describe('App', () => {
  it('renders header, main, and footer landmarks', () => {
    const wrapper = mount(App);

    expect(wrapper.find('header.site-header').exists()).toBe(true);
    expect(wrapper.find('main').exists()).toBe(true);
    expect(wrapper.find('footer').exists()).toBe(true);
  });

  it('renders every home-page section component', () => {
    const wrapper = mount(App);
    const html = wrapper.html();

    expect(html).toContain('Where to?'); // HeroSearch
    expect(html).toContain('Find things to do by interest'); // CategoryGrid
    expect(html).toContain("Travelers' Choice"); // TravelersChoice
  });
});
