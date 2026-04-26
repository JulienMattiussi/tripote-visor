import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SeriousNote from '../src/components/SeriousNote.vue';
import { setLocale } from '../src/i18n/store.js';

beforeEach(() => setLocale('en'));

describe('SeriousNote', () => {
  it('renders an aside with label, title, and body in English by default', () => {
    const wrapper = mount(SeriousNote);
    expect(wrapper.find('aside.serious-note').exists()).toBe(true);
    expect(wrapper.find('details').exists()).toBe(false);
    expect(wrapper.find('.serious-note-label').text()).toBe('Please read');
    expect(wrapper.find('.serious-note-title').text()).toContain('serious note on prostitution');
    expect(wrapper.find('.serious-note-body').text()).toContain(
      'International Labour Organization',
    );
  });

  it('exposes the title via aria-labelledby for screen readers', () => {
    const wrapper = mount(SeriousNote);
    const aside = wrapper.find('aside.serious-note');
    const titleId = wrapper.find('.serious-note-title').attributes('id');
    expect(titleId).toBeTruthy();
    expect(aside.attributes('aria-labelledby')).toBe(titleId);
  });

  it('renders a collapsible <details> when collapsed=true', () => {
    const wrapper = mount(SeriousNote, { props: { collapsed: true } });
    expect(wrapper.find('aside').exists()).toBe(false);
    const details = wrapper.find('details.serious-note--collapsed');
    expect(details.exists()).toBe(true);
    expect(details.find('summary').exists()).toBe(true);
    expect(details.find('.serious-note-label').text()).toBe('Please read');
    expect(details.find('.serious-note-body').text().length).toBeGreaterThan(50);
  });

  it('switches strings to French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(SeriousNote);
    expect(wrapper.find('.serious-note-label').text()).toBe('À lire');
    expect(wrapper.find('.serious-note-title').text()).toContain('prostitution');
    expect(wrapper.find('.serious-note-body').text()).toContain(
      'Organisation internationale du travail',
    );
  });
});
