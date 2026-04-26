import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SearchResultsPage from '../src/pages/SearchResultsPage.vue';
import HeroSearch from '../src/components/HeroSearch.vue';
import fiches from '../src/data/profiles.json';
import { setLocale } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('SearchResultsPage - global view', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/search');
  });

  it('groups results into the three category sections', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const titles = wrapper.findAll('.sr-section-title').map((t) => t.text());
    expect(titles).toEqual(['Hotels', 'Alleys', 'Parks']);
  });

  it('shows at most six cards per section in the global view', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    for (const section of wrapper.findAll('.sr-section')) {
      expect(section.findAll('.sr-card').length).toBeLessThanOrEqual(6);
    }
  });

  it('displays a "Show all" link when a category exceeds six results', () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const showAllButtons = wrapper.findAll('.sr-show-all');
    // All three categories have > 6 fiches, so all sections should show the link.
    expect(showAllButtons.length).toBe(3);
  });

  it('clicking a card navigates to the corresponding profile page', async () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const firstCard = wrapper.find('.sr-card');
    const expectedId = fiches.find((f) => f.category === 'hotel').id;
    await firstCard.trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('profile');
    expect(router.currentRoute.value.params.id).toBe(expectedId);
  });

  it('clicking a heart opens the login-required modal without navigating', async () => {
    const { loginRequiredOpen, loginRequiredContext, closeLoginRequired } =
      await import('../src/state/modals.js');
    closeLoginRequired();
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const firstCard = wrapper.find('.sr-card');
    const expectedName = firstCard.find('.sr-card-name').text();
    await firstCard.find('.sr-heart').trigger('click');
    expect(loginRequiredOpen.value).toBe(true);
    expect(loginRequiredContext.value).toEqual({ target: 'save', name: expectedName });
    expect(router.currentRoute.value.name).toBe('search');
    closeLoginRequired();
  });

  it('clicking "Show all" on the Hotels section navigates to /hotels', async () => {
    const wrapper = mount(SearchResultsPage, withRouter(router));
    await wrapper.find('.sr-show-all').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('hotels');
  });

  it('"Show all" forwards the active query to the listing page', async () => {
    // "an" is a substring with > 6 hits in every category, so Hotels keeps its
    // "Show all" link and the navigation reaches /hotels with q forwarded.
    const r = await setupRouter('/search?q=an');
    const wrapper = mount(SearchResultsPage, withRouter(r));
    await wrapper.find('.sr-show-all').trigger('click');
    await flushPromises();
    expect(r.currentRoute.value.name).toBe('hotels');
    expect(r.currentRoute.value.query.q).toBe('an');
  });
});

describe('SearchResultsPage - query filtering', () => {
  it('filters by name (case-insensitive) and shows only matching fiches', async () => {
    setLocale('en');
    const router = await setupRouter('/search?q=mireille');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const cards = wrapper.findAll('.sr-card');
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toContain('Mireille');
  });

  it('filters by location substring', async () => {
    setLocale('en');
    const router = await setupRouter('/search?q=Lyon');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    for (const card of wrapper.findAll('.sr-card')) {
      expect(card.text()).toContain('Lyon');
    }
  });

  it('shows the empty-for-query state when nothing matches', async () => {
    setLocale('en');
    const router = await setupRouter('/search?q=xyzzynothingmatches');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    expect(wrapper.find('.sr-empty').exists()).toBe(true);
    expect(wrapper.text()).toContain('xyzzynothingmatches');
  });
});

describe('HeroSearch submit', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/');
  });

  afterEach(() => vi.unstubAllGlobals());

  it('ignores submit when query is empty', async () => {
    const wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.find('form').trigger('submit');
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('pushes to /search?q=... on submit from the All tab', async () => {
    const wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.find('input[type="text"]').setValue('riad');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('search');
    expect(router.currentRoute.value.query.q).toBe('riad');
  });

  it('routes the Hotels tab directly to /hotels?q=...', async () => {
    const wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.findAll('.tab')[1].trigger('click'); // Hotels
    await wrapper.find('input[type="text"]').setValue('paris');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('hotels');
    expect(router.currentRoute.value.query.q).toBe('paris');
  });

  it('routes the Parks tab to /parks and Alleys tab to /alleys', async () => {
    let wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.findAll('.tab')[2].trigger('click'); // Parks
    await wrapper.find('input[type="text"]').setValue('vincennes');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('parks');
    expect(router.currentRoute.value.query.q).toBe('vincennes');

    router = await setupRouter('/');
    wrapper = mount(HeroSearch, withRouter(router));
    await wrapper.findAll('.tab')[3].trigger('click'); // Alleys
    await wrapper.find('input[type="text"]').setValue('marais');
    await wrapper.find('form').trigger('submit');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('alleys');
    expect(router.currentRoute.value.query.q).toBe('marais');
  });
});

describe('SearchResultsPage - locale', () => {
  it('switches section titles to French when locale is fr', async () => {
    setLocale('fr');
    const router = await setupRouter('/search');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    const titles = wrapper.findAll('.sr-section-title').map((t) => t.text());
    expect(titles).toEqual(['Hôtels', 'Ruelles', 'Parcs']);
  });
});

describe('SearchResultsPage - age filtering', () => {
  beforeEach(() => setLocale('en'));

  const ageInBucket = (age, bucket) => {
    if (bucket === 'under-30') return age < 30;
    if (bucket === '30-45') return age >= 30 && age < 45;
    if (bucket === '45-60') return age >= 45 && age < 60;
    if (bucket === 'over-60') return age >= 60;
    return true;
  };

  const parseAge = (metaText) => {
    const m = metaText.match(/(\d+)\s+years\s+old/);
    return m ? Number(m[1]) : null;
  };

  for (const bucket of ['under-30', '30-45', '45-60', 'over-60']) {
    it(`?age=${bucket} renders only fiches whose age falls in the bucket`, async () => {
      const router = await setupRouter(`/search?age=${bucket}`);
      const wrapper = mount(SearchResultsPage, withRouter(router));
      const expected = fiches.filter((f) => ageInBucket(f.age, bucket));
      expect(wrapper.find('.sr-count').text()).toContain(String(expected.length));
      const visibleAges = wrapper.findAll('.sr-card-meta').map((el) => parseAge(el.text()));
      expect(visibleAges.length).toBeGreaterThan(0);
      for (const age of visibleAges) {
        expect(age).not.toBeNull();
        expect(ageInBucket(age, bucket), `${age} not in ${bucket}`).toBe(true);
      }
    });
  }

  it('treats 30 as the lower bound of 30-45 (not under-30)', async () => {
    const has30 = fiches.some((f) => f.age === 30);
    if (!has30) return;
    const under = await setupRouter('/search?age=under-30');
    const underWrapper = mount(SearchResultsPage, withRouter(under));
    const underAges = underWrapper.findAll('.sr-card-meta').map((el) => parseAge(el.text()));
    expect(underAges).not.toContain(30);

    const mid = await setupRouter('/search?age=30-45');
    const midWrapper = mount(SearchResultsPage, withRouter(mid));
    const midCount = Number(midWrapper.find('.sr-count').text().match(/(\d+)/)[1]);
    const expected = fiches.filter((f) => f.age >= 30 && f.age < 45).length;
    expect(midCount).toBe(expected);
  });

  it('renders the bucket label in the page title', async () => {
    const router = await setupRouter('/search?age=under-30');
    const wrapper = mount(SearchResultsPage, withRouter(router));
    expect(wrapper.find('.sr-title').text()).toContain('Under 30');
  });

  it('combines ?q= and ?age= (intersect both filters)', async () => {
    // Mireille is age 50, which sits in the 45-60 bucket
    const matching = await setupRouter('/search?q=mireille&age=45-60');
    const matchWrapper = mount(SearchResultsPage, withRouter(matching));
    const matchCards = matchWrapper.findAll('.sr-card');
    expect(matchCards.length).toBe(1);
    expect(matchCards[0].text()).toContain('Mireille');

    // Same name but with a bucket Mireille does not belong to
    const empty = await setupRouter('/search?q=mireille&age=under-30');
    const emptyWrapper = mount(SearchResultsPage, withRouter(empty));
    expect(emptyWrapper.findAll('.sr-card').length).toBe(0);
  });
});
