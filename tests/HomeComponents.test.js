import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import CategoryGrid from '../src/components/CategoryGrid.vue';
import ExperienceCards from '../src/components/ExperienceCards.vue';
import KivaBanner from '../src/components/KivaBanner.vue';
import InspirationCards from '../src/components/InspirationCards.vue';
import DestinationsGrid from '../src/components/DestinationsGrid.vue';
import TravelersChoice from '../src/components/TravelersChoice.vue';
import CommunityBlurb from '../src/components/CommunityBlurb.vue';
import ThingsToDoBanner from '../src/components/ThingsToDoBanner.vue';
import { setLocale, setCurrency } from '../src/i18n/store.js';
import { setupRouter, withRouter } from './helpers/router.js';

beforeEach(() => {
  setLocale('en');
  setCurrency('USD');
  vi.stubGlobal('alert', vi.fn());
});
afterEach(() => vi.unstubAllGlobals());

describe('CategoryGrid', () => {
  it('renders four category cards with translated labels', () => {
    const wrapper = mount(CategoryGrid);
    expect(wrapper.findAll('.cat-card')).toHaveLength(4);
    const labels = wrapper.findAll('.cat-label').map((l) => l.text());
    expect(labels).toHaveLength(4);
    expect(labels.every((l) => l.length > 0)).toBe(true);
  });

  it('switches labels to French when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(CategoryGrid);
    const labels = wrapper.findAll('.cat-label').map((l) => l.text());
    expect(labels.some((l) => l.includes('plein air'))).toBe(true);
  });
});

describe('ExperienceCards', () => {
  it('renders four experience cards with localised price tags', () => {
    const wrapper = mount(ExperienceCards);
    expect(wrapper.findAll('.exp-card')).toHaveLength(4);
    expect(wrapper.text()).toMatch(/\$72|72\s*\$/);
  });

  it('toggling the favourite heart flips its filled state', async () => {
    const wrapper = mount(ExperienceCards);
    const firstHeart = wrapper.findAll('.fav-btn')[0];
    expect(firstHeart.find('.heart').classes()).not.toContain('filled');
    await firstHeart.trigger('click');
    expect(wrapper.findAll('.fav-btn')[0].find('.heart').classes()).toContain('filled');
  });
});

describe('KivaBanner', () => {
  it('renders the title and the Donate CTA', () => {
    const wrapper = mount(KivaBanner);
    expect(wrapper.text()).toContain('Donate now');
  });

  it('clicking Donate fires the front-simulation alert', async () => {
    const wrapper = mount(KivaBanner);
    await wrapper.find('button.pill-btn').trigger('click');
    expect(window.alert).toHaveBeenCalledOnce();
    expect(window.alert.mock.calls[0][0]).toContain('front simulation only');
  });
});

describe('InspirationCards', () => {
  it('renders three inspiration cards', () => {
    const wrapper = mount(InspirationCards);
    expect(wrapper.findAll('.insp-card')).toHaveLength(3);
  });

  it('toggling a favourite is independent per card', async () => {
    const wrapper = mount(InspirationCards);
    const hearts = wrapper.findAll('.fav-btn');
    await hearts[0].trigger('click');
    expect(wrapper.findAll('.fav-btn')[0].find('.heart').classes()).toContain('filled');
    expect(wrapper.findAll('.fav-btn')[1].find('.heart').classes()).not.toContain('filled');
  });
});

describe('DestinationsGrid', () => {
  it('renders four destination cards with English names by default', () => {
    const wrapper = mount(DestinationsGrid);
    expect(wrapper.findAll('.dest-card')).toHaveLength(4);
    const text = wrapper.text();
    expect(text).toContain('Rome, Italy');
    expect(text).toContain('Paris, France');
    expect(text).toContain('London, UK');
  });

  it('uses French names when locale is fr', () => {
    setLocale('fr');
    const wrapper = mount(DestinationsGrid);
    const text = wrapper.text();
    expect(text).toContain('Rome, Italie');
    expect(text).toContain('Londres, Royaume-Uni');
  });
});

describe('TravelersChoice (home promo)', () => {
  it('CTA navigates to /travelers-choice', async () => {
    const router = await setupRouter('/');
    const wrapper = mount(TravelersChoice, withRouter(router));
    await wrapper.find('button.pill-btn').trigger('click');
    await flushPromises();
    expect(router.currentRoute.value.name).toBe('travelers-choice');
  });
});

describe('CommunityBlurb', () => {
  it('renders the community section with formatted amount', () => {
    const wrapper = mount(CommunityBlurb);
    expect(wrapper.find('h2').exists()).toBe(true);
    // formatAmount(30) in EN/USD renders as "$30"
    expect(wrapper.text()).toMatch(/\$30|30\s*\$/);
  });
});

describe('ThingsToDoBanner', () => {
  it('renders the headline and the Book now CTA', () => {
    const wrapper = mount(ThingsToDoBanner);
    expect(wrapper.text()).toContain('Book now');
  });

  it('clicking Book now fires the front-simulation alert', async () => {
    const wrapper = mount(ThingsToDoBanner);
    await wrapper.find('button.pill-btn').trigger('click');
    expect(window.alert).toHaveBeenCalledOnce();
    expect(window.alert.mock.calls[0][0]).toContain('front simulation only');
  });
});
