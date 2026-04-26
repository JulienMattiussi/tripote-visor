import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ArticlePage from '../src/pages/ArticlePage.vue';
import articlesData from '../src/data/articles.json';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

const boulogne = articlesData.find((a) => a.key === 'boulogne');

beforeEach(() => setLocale('en'));

describe('ArticlePage', () => {
  it('renders the matching article title, lead, author and date', async () => {
    const router = await setupRouter('/encounters/boulogne');
    const wrapper = mount(ArticlePage, withRouter(router));

    expect(wrapper.find('.article-title').text()).toBe(boulogne.title.en);
    expect(wrapper.find('.article-lead').text()).toBe(boulogne.lead.en);
    expect(wrapper.find('.article-author').text()).toBe('Tintin Morane');
    expect(wrapper.find('time').attributes('datetime')).toBe('2026-03-12');
    expect(wrapper.find('.article-cat').text()).toBe('Adventure');
  });

  it('renders every non-quote fragment of each body paragraph', async () => {
    const router = await setupRouter('/encounters/boulogne');
    const wrapper = mount(ArticlePage, withRouter(router));
    const text = wrapper.find('.article-content').text().replace(/\s+/g, ' ');
    // Each paragraph may contain inline “ … ” citations that get pulled onto
    // their own line; the surrounding prose still has to appear verbatim.
    for (const para of boulogne.body.en) {
      const fragments = para.split(/“[^”]*”/);
      for (const fragment of fragments) {
        const trimmed = fragment.trim();
        if (trimmed.length > 6) expect(text).toContain(trimmed);
      }
    }
  });

  it('renders “ … ” citations as dash-prefixed quote lines', async () => {
    const router = await setupRouter('/encounters/boulogne');
    const wrapper = mount(ArticlePage, withRouter(router));
    const quotes = wrapper.findAll('.article-q').map((q) => q.text());
    // boulogne has 2 inline citations; both should be lifted into .article-q lines.
    expect(quotes.length).toBeGreaterThan(0);
    for (const q of quotes) expect(q.startsWith('-')).toBe(true);
  });

  it('switches the article body to French when locale is fr', async () => {
    setLocale('fr');
    const router = await setupRouter('/encounters/boulogne');
    const wrapper = mount(ArticlePage, withRouter(router));
    expect(wrapper.find('.article-title').text()).toBe(boulogne.title.fr);
    const text = wrapper.find('.article-content').text().replace(/\s+/g, ' ');
    for (const para of boulogne.body.fr) {
      const fragments = para.split(/“[^”]*”/);
      for (const fragment of fragments) {
        const trimmed = fragment.trim();
        if (trimmed.length > 6) expect(text).toContain(trimmed);
      }
    }
    expect(wrapper.find('.article-cat').text()).toBe('Aventure');
  });

  it('renders the not-found view for an unknown article key', async () => {
    const router = await setupRouter('/encounters/this-key-does-not-exist');
    const wrapper = mount(ArticlePage, withRouter(router));
    expect(wrapper.find('.article-not-found').exists()).toBe(true);
    expect(wrapper.text()).toContain('This article could not be found.');
    expect(wrapper.find('.article').exists()).toBe(false);
  });

  it('back button navigates to /encounters', async () => {
    const router = await setupRouter('/encounters/marseille');
    const wrapper = mount(ArticlePage, withRouter(router));
    await wrapper.find('.article-back').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('encounters');
  });
});
