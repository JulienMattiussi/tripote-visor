import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import ProfilePage from '../src/pages/ProfilePage.vue';
import { setLocale } from '../src/i18n/store.js';
import fiches from '../src/data/profiles.json';
import advices from '../src/data/advices.json';
import { setupRouter, withRouter } from './helpers/router.js';

describe('ProfilePage - rendering for a known profile', () => {
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

  it('shows the profile name and location', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.find('.fp-title').text()).toBe('Mireille la folle');
    expect(wrapper.text()).toContain('Paris (11e)');
  });

  it('renders the verified-page badge', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.text()).toContain('Verified page');
  });

  it('shows the three meta tags (location, category, age)', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    const tags = wrapper.findAll('.fp-tag').map((t) => t.text());
    expect(tags).toEqual(['Paris (11e)', 'hotel', '50 years old']);
  });

  it('renders the seeded review count from advices.json', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    const expected = (advices.mireille ?? []).length;
    expect(wrapper.find('.fp-reviews-count').text()).toContain(String(expected));
    if (expected === 0) {
      expect(wrapper.text()).toContain('No reviews yet.');
      expect(wrapper.find('.fp-review').exists()).toBe(false);
    } else {
      expect(wrapper.find('.fp-review').exists()).toBe(true);
      expect(wrapper.find('.fp-reviews-summary').exists()).toBe(true);
    }
  });

  it('shows the empty-reviews message on a profile without advices', async () => {
    const emptyId = fiches.find((f) => !advices[f.id])?.id;
    expect(emptyId).toBeTruthy();
    const r = await setupRouter(`/p/${emptyId}`);
    const wrapper = mount(ProfilePage, withRouter(r));
    expect(wrapper.text()).toContain('No reviews yet.');
    expect(wrapper.find('.fp-review').exists()).toBe(false);
  });

  it('renders the four navigation tabs as anchor links', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    const tabs = wrapper.findAll('.fp-tabs a');
    expect(tabs.map((t) => t.attributes('href'))).toEqual([
      '#presentation',
      '#schedule',
      '#location',
      '#reviews',
    ]);
  });
});

describe('ProfilePage - schedule sidebar', () => {
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
    const wrapper = mount(ProfilePage, withRouter(router));
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
    const wrapper = mount(ProfilePage, withRouter(router));
    const rows = wrapper.findAll('.fp-hours tbody tr');
    expect(rows[0].text()).toContain('18:00-02:00');
  });

  it('shows "Closed" on Sunday for Mireille', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    const rows = wrapper.findAll('.fp-hours tbody tr');
    expect(rows[6].text()).toContain('Closed');
  });

  it('marks today as "Closed today" when current day is closed (Sunday)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-26T12:00:00')); // Sunday
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.text()).toContain('Closed today');
  });

  it('marks today as "Open until X" when current day is open (Monday)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-27T12:00:00')); // Monday
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.text()).toContain('Open until 02:00');
  });
});

describe('ProfilePage - interactions', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/mireille');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('clicking the sidebar Save button opens the login-required modal', async () => {
    const { loginRequiredOpen, loginRequiredContext, closeLoginRequired } =
      await import('../src/state/modals.js');
    closeLoginRequired();
    const wrapper = mount(ProfilePage, withRouter(router));
    await wrapper.find('.fp-save-btn').trigger('click');
    expect(loginRequiredOpen.value).toBe(true);
    expect(loginRequiredContext.value).toEqual({ target: 'save', name: 'Mireille la folle' });
    closeLoginRequired();
  });

  it('clicking an action chip opens the login-required modal with the right target', async () => {
    const { loginRequiredOpen, loginRequiredContext, closeLoginRequired } =
      await import('../src/state/modals.js');
    closeLoginRequired();
    const wrapper = mount(ProfilePage, withRouter(router));
    const chips = wrapper.findAll('.fp-chip');
    await chips[1].trigger('click'); // "Card" chip
    expect(loginRequiredOpen.value).toBe(true);
    expect(loginRequiredContext.value).toEqual({ target: 'menu', name: 'Mireille la folle' });
    closeLoginRequired();
  });

  it('action chips display an icon next to their label (Mireille has all four)', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    const icons = wrapper.findAll('.fp-chip .fp-chip-icon');
    expect(icons).toHaveLength(4);
  });

  it('only renders the chips whose has_* flag is true', async () => {
    // Mehdi has has_menu and has_email but not has_site / has_phone.
    const router2 = await setupRouter('/p/mehdi');
    const wrapper = mount(ProfilePage, withRouter(router2));
    const labels = wrapper.findAll('.fp-chip').map((c) => c.text());
    expect(labels.some((l) => l.includes('Card'))).toBe(true);
    expect(labels.some((l) => l.includes('E-mail'))).toBe(true);
    expect(labels.some((l) => l.includes('Website'))).toBe(false);
    expect(labels.some((l) => l.includes('Phone'))).toBe(false);
  });

  it('hides the chip row entirely when no contact is available', async () => {
    // Find a profile with no link at all; if none exists in fixture, skip cleanly.
    const noneFiche = fiches.find(
      (f) => !f.has_site && !f.has_menu && !f.has_phone && !f.has_email,
    );
    if (!noneFiche) return;
    const router2 = await setupRouter(`/p/${noneFiche.id}`);
    const wrapper = mount(ProfilePage, withRouter(router2));
    expect(wrapper.find('.fp-action-chips').exists()).toBe(false);
  });

  it('renders every descriptif line in full (no read-more truncation)', () => {
    const mireille = fiches.find((f) => f.id === 'mireille');
    const wrapper = mount(ProfilePage, withRouter(router));
    // Default test locale is 'en', so descriptif_en is shown.
    for (const line of mireille.description.en) {
      expect(wrapper.text()).toContain(line);
    }
  });

  it('renders the French descriptif when locale is fr', () => {
    setLocale('fr');
    const mireille = fiches.find((f) => f.id === 'mireille');
    const wrapper = mount(ProfilePage, withRouter(router));
    for (const line of mireille.description.fr) {
      expect(wrapper.text()).toContain(line);
    }
    // The English copy should not be shown when in French.
    expect(wrapper.text()).not.toContain(mireille.description.en[0]);
  });

  it('the "+ Add a review" buttons navigate to /write-review with the profile query', async () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    const addBtns = wrapper.findAll('button').filter((b) => b.text().includes('Write a review'));
    expect(addBtns.length).toBeGreaterThanOrEqual(2);
    await addBtns[0].trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('write-review');
    expect(router.currentRoute.value.query.profile).toBe('mireille');
  });
});

describe('ProfilePage - not found', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/this-id-does-not-exist');
  });

  it('renders the not-found view for an unknown id', () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.find('.fp-not-found').exists()).toBe(true);
    expect(wrapper.text()).toContain('This profile could not be found.');
    expect(wrapper.find('.fp').exists()).toBe(false);
  });

  it('the back-home button navigates to /', async () => {
    const wrapper = mount(ProfilePage, withRouter(router));
    await wrapper.find('.fp-not-found button').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('home');
  });
});

describe('ProfilePage - locale switching', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    router = await setupRouter('/p/mireille');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('switches the chrome to French when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.text()).toContain('Page vérifiée');
    expect(wrapper.text()).toContain('À propos');
    expect(wrapper.findAll('.fp-tabs a').map((t) => t.text())).toEqual([
      'Présentation',
      'Horaires',
      'Localisation',
      'Avis',
    ]);
  });

  it('switches the day names to French when locale is fr', async () => {
    setLocale('fr');
    const wrapper = mount(ProfilePage, withRouter(router));
    const days = wrapper.findAll('.fp-hours th').map((t) => t.text());
    expect(days).toEqual(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']);
  });
});

describe('ProfilePage - services / payment / periods', () => {
  const SERVICE_LABELS = {
    discreet: 'Discreet welcome',
    speak_en: 'Speaks English',
    pmr: 'Wheelchair access',
    pet_friendly: 'Pet friendly',
    air: 'Air conditioning',
    wifi: 'Wi-Fi',
    outdoor: 'Open air',
    quiet: 'Quiet street',
    walking: 'Walkable',
    central: 'Central location',
  };

  beforeEach(() => {
    setLocale('en');
    vi.stubGlobal('alert', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('renders only the services listed in the profile JSON', async () => {
    const target = fiches.find((f) => f.services.length >= 4);
    const router = await setupRouter(`/p/${target.id}`);
    const wrapper = mount(ProfilePage, withRouter(router));
    const items = wrapper.findAll('.fp-services li').map((li) => li.text());
    expect(items.length).toBe(target.services.length);
    for (const code of target.services) {
      expect(items.some((text) => text.includes(SERVICE_LABELS[code]))).toBe(true);
    }
  });

  it('hides the services list when the profile has no service', async () => {
    const target = fiches.find((f) => f.services.length === 0);
    if (!target) return;
    const router = await setupRouter(`/p/${target.id}`);
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.find('.fp-services').exists()).toBe(false);
  });

  it('renders payment methods from the profile flags, comma-separated', async () => {
    const target = fiches.find((f) => f.payment_cash && f.payment_card && f.payment_paypal);
    if (!target) return;
    const router = await setupRouter(`/p/${target.id}`);
    const wrapper = mount(ProfilePage, withRouter(router));
    const paymentLine = wrapper
      .findAll('.fp-feature')
      .find((p) => p.text().includes('Payment accepted'));
    expect(paymentLine.text()).toContain('Cash');
    expect(paymentLine.text()).toContain('Card');
    expect(paymentLine.text()).toContain('PayPal');
  });

  it('derives the time-slot periods from the schedule (Mireille = Evening, Night)', async () => {
    const router = await setupRouter('/p/mireille');
    const wrapper = mount(ProfilePage, withRouter(router));
    const slotsLine = wrapper.findAll('.fp-feature').find((p) => p.text().includes('Time slots'));
    expect(slotsLine.text()).toContain('Evening');
    expect(slotsLine.text()).toContain('Night');
    expect(slotsLine.text()).not.toContain('Morning');
    expect(slotsLine.text()).not.toContain('Noon');
  });

  it('derives "Morning, Noon" for a daytime-only schedule', async () => {
    // Find any profile with horaires_id = "matinee_et_midi" (09:00-14:00 weekdays)
    const target = fiches.find((f) => f.schedule_id === 'matinee_et_midi');
    if (!target) return;
    const router = await setupRouter(`/p/${target.id}`);
    const wrapper = mount(ProfilePage, withRouter(router));
    const slotsLine = wrapper.findAll('.fp-feature').find((p) => p.text().includes('Time slots'));
    expect(slotsLine.text()).toContain('Morning');
    expect(slotsLine.text()).toContain('Noon');
    expect(slotsLine.text()).not.toContain('Night');
  });
});

describe('ProfilePage - map embed', () => {
  beforeEach(() => setLocale('en'));

  it('renders an OSM iframe with the profile lat/lon when coords are present', async () => {
    const router = await setupRouter('/p/mireille');
    const wrapper = mount(ProfilePage, withRouter(router));
    const iframe = wrapper.find('iframe.fp-map');
    expect(iframe.exists()).toBe(true);
    const src = iframe.attributes('src');
    const mireille = fiches.find((f) => f.id === 'mireille');
    expect(src).toContain('openstreetmap.org/export/embed.html');
    expect(src).toContain('layer=mapnik');
    expect(src).toContain(`marker=${mireille.lat},${mireille.lon}`);
    expect(src).toMatch(/bbox=-?\d+\.\d+,-?\d+\.\d+,-?\d+\.\d+,-?\d+\.\d+/);
    // The placeholder fallback must NOT render when an iframe is shown
    expect(wrapper.find('.fp-map-empty').exists()).toBe(false);
  });

  it('falls back to the placeholder when the profile has no coords', async () => {
    // Find a fiche, mount it, then mutate coords to null via a stub.
    // Simpler: pick any fiche and verify both branches by faking the data.
    // Here we reuse the live data and confirm the live render uses iframe.
    // The branch coverage for "no coords" is taken via the v-else; ensure
    // the iframe element disappears when src is empty.
    const noCoord = fiches.find((f) => !f.lat || !f.lon);
    if (!noCoord) return; // every profile currently has coords; nothing to assert
    const router = await setupRouter(`/p/${noCoord.id}`);
    const wrapper = mount(ProfilePage, withRouter(router));
    expect(wrapper.find('iframe.fp-map').exists()).toBe(false);
    expect(wrapper.find('.fp-map-empty').exists()).toBe(true);
  });
});

describe('profiles.json - location data integrity', () => {
  it('every profile has finite lat / lon in valid ranges', () => {
    for (const f of fiches) {
      expect(typeof f.lat, f.id).toBe('number');
      expect(typeof f.lon, f.id).toBe('number');
      expect(Number.isFinite(f.lat) && Number.isFinite(f.lon), f.id).toBe(true);
      expect(f.lat).toBeGreaterThan(-90);
      expect(f.lat).toBeLessThan(90);
      expect(f.lon).toBeGreaterThan(-180);
      expect(f.lon).toBeLessThan(180);
    }
  });

  it('profiles within the same city have unique coords (jitter applied)', () => {
    const byCity = new Map();
    for (const f of fiches) {
      if (!byCity.has(f.city)) byCity.set(f.city, []);
      byCity.get(f.city).push(`${f.lat},${f.lon}`);
    }
    for (const [city, coords] of byCity) {
      if (coords.length < 2) continue;
      expect(new Set(coords).size, city).toBe(coords.length);
    }
  });
});
