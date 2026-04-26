import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AppFooter from '../src/components/AppFooter.vue';
import { setLocale, setCurrency, locale, currency } from '../src/i18n/store.js';
import {
  signinOpen,
  cookieModalOpen,
  modalOpen,
  modalTab,
  closeSignin,
  closeCookieModal,
  closePreferences,
} from '../src/state/modals.js';
import { setupRouter, withRouter } from './helpers/router.js';

let router;
const mountFooter = () => mount(AppFooter, withRouter(router));

const resetState = () => {
  closeSignin();
  closeCookieModal();
  closePreferences();
  setLocale('en');
  setCurrency('USD');
};

describe('AppFooter - About column', () => {
  beforeEach(async () => {
    resetState();
    router = await setupRouter('/');
  });

  it('renders four about-column links pointing to the secondary pages', () => {
    const wrapper = mountFooter();
    const cols = wrapper.findAll('.footer-col');
    const aboutLinks = cols[0].findAll('a');
    expect(aboutLinks.map((a) => a.attributes('href'))).toEqual([
      '/about',
      '/resources',
      '/safety',
    ]);
  });
});

describe('AppFooter - Explore column', () => {
  beforeEach(async () => {
    resetState();
    router = await setupRouter('/');
  });
  afterEach(() => resetState());

  it('renders four routed explore links plus one Join button', () => {
    const wrapper = mountFooter();
    const cols = wrapper.findAll('.footer-col');
    const exploreLinks = cols[1].findAll('a');
    expect(exploreLinks.map((a) => a.attributes('href'))).toEqual([
      '/write-review',
      '/add-sex-worker',
      '/discover',
      '/encounters',
    ]);
    const joinBtn = cols[1].find('button.link-like');
    expect(joinBtn.exists()).toBe(true);
  });

  it('clicking the Join button opens the signin modal', async () => {
    const wrapper = mountFooter();
    expect(signinOpen.value).toBe(false);
    await wrapper.findAll('.footer-col')[1].find('button.link-like').trigger('click');
    expect(signinOpen.value).toBe(true);
  });
});

describe('AppFooter - Settings column', () => {
  beforeEach(async () => {
    resetState();
    router = await setupRouter('/');
  });
  afterEach(() => resetState());

  it('renders the currency select with USD/EUR options', () => {
    const wrapper = mountFooter();
    const select = wrapper.findAll('.selects select')[0];
    const values = select.findAll('option').map((o) => o.element.value);
    expect(values).toContain('USD');
    expect(values).toContain('EUR');
    expect(values).toContain('__more__');
  });

  it('changing currency to EUR calls setCurrency', async () => {
    const wrapper = mountFooter();
    expect(currency.value).toBe('USD');
    await wrapper.findAll('.selects select')[0].setValue('EUR');
    expect(currency.value).toBe('EUR');
  });

  it('selecting "…" on the currency select opens PreferencesModal on the currency tab', async () => {
    const wrapper = mountFooter();
    expect(modalOpen.value).toBe(false);
    await wrapper.findAll('.selects select')[0].setValue('__more__');
    expect(modalOpen.value).toBe(true);
    expect(modalTab.value).toBe('currency');
  });

  it('changing locale to fr calls setLocale', async () => {
    const wrapper = mountFooter();
    expect(locale.value).toBe('en');
    await wrapper.findAll('.selects select')[1].setValue('fr');
    expect(locale.value).toBe('fr');
  });

  it('selecting "…" on the locale select opens PreferencesModal on the region tab', async () => {
    const wrapper = mountFooter();
    await wrapper.findAll('.selects select')[1].setValue('__more__');
    expect(modalOpen.value).toBe(true);
    expect(modalTab.value).toBe('region');
  });

  it('renders a single GitHub social link with target=_blank', () => {
    const wrapper = mountFooter();
    const social = wrapper.find('.socials .social');
    expect(social.exists()).toBe(true);
    expect(social.attributes('href')).toContain('github');
    expect(social.attributes('target')).toBe('_blank');
    expect(social.attributes('rel')).toContain('noopener');
  });
});

describe('AppFooter - Legal nav', () => {
  beforeEach(async () => {
    resetState();
    router = await setupRouter('/');
  });
  afterEach(() => resetState());

  it('renders the Terms router-link plus a Cookie consent button', () => {
    const wrapper = mountFooter();
    const legalLinks = wrapper.findAll('.legal a');
    expect(legalLinks.map((a) => a.attributes('href'))).toEqual(['/terms']);
    expect(wrapper.find('.legal button.link-like').exists()).toBe(true);
  });

  it('clicking the Cookie consent button opens the cookie modal', async () => {
    const wrapper = mountFooter();
    expect(cookieModalOpen.value).toBe(false);
    await wrapper.find('.legal button.link-like').trigger('click');
    expect(cookieModalOpen.value).toBe(true);
  });
});

describe('AppFooter - Disclaimer + copyright', () => {
  beforeEach(async () => {
    resetState();
    router = await setupRouter('/');
  });

  it('renders a copyright line with the current year', () => {
    const wrapper = mountFooter();
    expect(wrapper.find('.copyright').text()).toContain(String(new Date().getFullYear()));
  });

  it('toggling Read more shows and hides the long disclaimer', async () => {
    const wrapper = mountFooter();
    const btn = wrapper.find('.read-more');
    expect(btn.text()).toMatch(/Read more/);
    await btn.trigger('click');
    expect(btn.text()).toMatch(/Read less/);
    await btn.trigger('click');
    expect(btn.text()).toMatch(/Read more/);
  });
});

describe('AppFooter - Locale switch', () => {
  beforeEach(async () => {
    resetState();
    setLocale('fr');
    router = await setupRouter('/');
  });
  afterEach(() => resetState());

  it('renders FR labels when locale is fr', () => {
    const wrapper = mountFooter();
    const text = wrapper.text();
    expect(text).toContain('États-Unis');
    expect(text).toContain('France');
  });
});
