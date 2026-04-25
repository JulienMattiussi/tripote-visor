import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import FichePage from '../src/pages/FichePage.vue';
import { setLocale } from '../src/i18n/store.js';
import fiches from '../src/data/fiches.json';
import { setupRouter, withRouter } from './helpers/router.js';

describe('FichePage - rendering for a known fiche', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/mireille');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('shows the fiche name and location', () => {
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.find('.fp-title').text()).toBe('Mireille');
    expect(wrapper.text()).toContain('Paris 11e');
  });

  it('renders the verified-page badge', () => {
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Verified page');
  });

  it('shows the three meta tags (lieu, catégorie, age)', () => {
    const wrapper = mount(FichePage, withRouter(router));
    const tags = wrapper.findAll('.fp-tag').map((t) => t.text());
    expect(tags).toEqual(['Paris 11e', 'hotel', '50 years old']);
  });

  it('shows 0 reviews count and the empty-reviews message', () => {
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.find('.fp-reviews-count').text()).toContain('0');
    expect(wrapper.text()).toContain('No reviews yet.');
  });

  it('renders the photo placeholder when fiche.photo is empty', () => {
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.find('.fp-photo-main img').exists()).toBe(false);
    expect(wrapper.find('.fp-photo-empty').exists()).toBe(true);
  });

  it('renders the four navigation tabs as anchor links', () => {
    const wrapper = mount(FichePage, withRouter(router));
    const tabs = wrapper.findAll('.fp-tabs a');
    expect(tabs.map((t) => t.attributes('href'))).toEqual([
      '#presentation',
      '#horaires',
      '#localisation',
      '#avis',
    ]);
  });

  it('renders the bottom recommendation question with three radio answers', () => {
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Would you recommend');
    expect(wrapper.findAll('input[type="radio"][name="bottom-q"]')).toHaveLength(3);
  });
});

describe('FichePage - schedule sidebar', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/mireille');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('renders all 7 weekdays in Monday-first order', () => {
    const wrapper = mount(FichePage, withRouter(router));
    const days = wrapper.findAll('.fp-hours th').map((t) => t.text());
    expect(days).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });

  it('shows the open hours for Mireille (18:00-02:00 Monday)', () => {
    const wrapper = mount(FichePage, withRouter(router));
    const rows = wrapper.findAll('.fp-hours tbody tr');
    expect(rows[0].text()).toContain('18:00-02:00');
  });

  it('shows "Closed" on Sunday for Mireille', () => {
    const wrapper = mount(FichePage, withRouter(router));
    const rows = wrapper.findAll('.fp-hours tbody tr');
    expect(rows[6].text()).toContain('Closed');
  });

  it('marks today as "Closed today" when current day is closed (Sunday)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-26T12:00:00')); // Sunday
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Closed today');
  });

  it('marks today as "Open until X" when current day is open (Monday)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-27T12:00:00')); // Monday
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Open until 02:00');
  });
});

describe('FichePage - interactions', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/mireille');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('toggles the sidebar Save button label between Save and Saved', async () => {
    const wrapper = mount(FichePage, withRouter(router));
    const btn = wrapper.find('.fp-save-btn');
    expect(btn.text()).toContain('Save');
    await btn.trigger('click');
    expect(btn.text()).toContain('Saved');
    await btn.trigger('click');
    expect(btn.text()).toContain('Save');
  });

  it('action chips fire the front-simulation alert', async () => {
    const wrapper = mount(FichePage, withRouter(router));
    await wrapper.find('.fp-chip').trigger('click');
    expect(window.alert).toHaveBeenCalled();
    expect(window.alert.mock.calls[0][0]).toContain('front simulation only');
  });

  it('expands the descriptif when "More" is clicked and shows hidden lines', async () => {
    const mireille = fiches.find((f) => f.id === 'mireille');
    const lastLine = mireille.descriptif[mireille.descriptif.length - 1];
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).not.toContain(lastLine);
    await wrapper.find('.fp-link-btn').trigger('click');
    expect(wrapper.text()).toContain(lastLine);
  });
});

describe('FichePage - not found', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/this-id-does-not-exist');
  });

  it('renders the not-found view for an unknown id', () => {
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.find('.fp-not-found').exists()).toBe(true);
    expect(wrapper.text()).toContain('This profile could not be found.');
    expect(wrapper.find('.fp').exists()).toBe(false);
  });

  it('the back-home button navigates to /', async () => {
    const wrapper = mount(FichePage, withRouter(router));
    await wrapper.find('.fp-not-found button').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });
});

describe('FichePage - locale switching', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/mireille');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('switches the chrome to French when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Page vérifiée');
    expect(wrapper.text()).toContain('À propos');
    expect(wrapper.text()).toContain('Recommanderiez-vous');
    expect(wrapper.findAll('.fp-tabs a').map((t) => t.text())).toEqual([
      'Présentation',
      'Horaires',
      'Localisation',
      'Avis',
    ]);
  });

  it('switches the day names to French when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mount(FichePage, withRouter(router));
    const days = wrapper.findAll('.fp-hours th').map((t) => t.text());
    expect(days).toEqual(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
  });
});

describe('FichePage - services by category', () => {
  beforeEach(() => {
    setLocale('en');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('shows hotel-specific services for an hotel fiche', async () => {
    const router = await setupRouter('/p/mireille');
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Air conditioning');
    expect(wrapper.text()).toContain('Wi-Fi');
  });

  it('shows alley-specific services for an alley fiche', async () => {
    const router = await setupRouter('/p/roger');
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Quiet street');
  });

  it('shows park-specific services for a park fiche', async () => {
    const router = await setupRouter('/p/aminata');
    const wrapper = mount(FichePage, withRouter(router));
    expect(wrapper.text()).toContain('Open air');
  });
});
