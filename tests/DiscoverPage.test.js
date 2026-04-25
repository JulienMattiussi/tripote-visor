import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DiscoverPage from '../src/pages/DiscoverPage.vue';
import fichesData from '../src/data/fiches.json';
import advicesData from '../src/data/advices.json';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

const avgOf = (id) => {
  const list = advicesData[id] ?? [];
  if (!list.length) return 0;
  return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
};

const expectedTop4 = () =>
  [...fichesData]
    .sort((a, b) => avgOf(b.id) - avgOf(a.id) || a.nom.localeCompare(b.nom))
    .slice(0, 4);

beforeEach(() => {
  setLocale('en');
  setCurrency('USD');
});

describe('DiscoverPage', () => {
  it('renders the hero title and the section heading', async () => {
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    expect(wrapper.find('.dp-hero-title').text()).toContain(
      'Discover experiences approved by users',
    );
    expect(wrapper.find('.dp-section-title').text()).toBe('Must-try experiences');
  });

  it('renders the top-4 fiches by rating, ranked 1 to 4', async () => {
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    const cards = wrapper.findAll('.dp-card');
    expect(cards).toHaveLength(4);

    const top4 = expectedTop4();
    cards.forEach((card, idx) => {
      const fiche = top4[idx];
      expect(card.find('.dp-rank').text()).toBe(String(idx + 1));
      expect(card.find('.dp-name').text()).toBe(fiche.nom);
      const expectedLieu = fiche.lieu ? `${fiche.ville} (${fiche.lieu})` : fiche.ville;
      expect(card.find('.dp-loc').text()).toBe(expectedLieu);
      const avg = avgOf(fiche.id);
      const expected = avg > 0 ? avg.toFixed(1) : '-';
      expect(card.find('.dp-rating-num').text()).toBe(expected);
    });
  });

  it('clicking a card navigates to the matching fiche', async () => {
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    await wrapper.findAll('.dp-card')[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('fiche');
    expect(router.currentRoute.value.params.id).toBe(expectedTop4()[0].id);
  });

  it('toggling a heart on a card does not trigger card navigation', async () => {
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    const firstCard = wrapper.findAll('.dp-card')[0];
    await firstCard.find('.dp-fav').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('discover');
    expect(firstCard.find('.heart').classes()).toContain('filled');
  });

  it('does not render a SeriousNote callout', async () => {
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    expect(wrapper.find('.serious-note').exists()).toBe(false);
  });

  it('mounts the DestinationsHighlights block', async () => {
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    expect(wrapper.find('.dh').exists()).toBe(true);
  });

  it('back-to-home button navigates to /', async () => {
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    await wrapper.find('.dp-back').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('renders French copy when locale is fr', async () => {
    setLocale('fr');
    const router = await setupRouter('/discover');
    const wrapper = mount(DiscoverPage, withRouter(router));
    expect(wrapper.text()).toContain('Découvrez des expériences approuvées par les utilisateurs');
    expect(wrapper.text()).toContain('Expériences incontournables');
  });
});
