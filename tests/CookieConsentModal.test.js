import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import CookieConsentModal from '../src/components/CookieConsentModal.vue';
import { setLocale } from '../src/i18n/store.js';
import { cookieModalOpen, openCookieModal, closeCookieModal } from '../src/state/modals.js';
import { setupRouter, withRouter } from './helpers/router.js';

describe('CookieConsentModal', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    closeCookieModal();
    router = await setupRouter('/');
  });

  it('is hidden until openCookieModal() is called', async () => {
    const wrapper = mount(CookieConsentModal, withRouter(router));
    expect(wrapper.find('.cm-backdrop').exists()).toBe(false);

    openCookieModal();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.cm-backdrop').exists()).toBe(true);
  });

  it('renders the title, the body, and the Allow all CTA (no embedded privacy link)', async () => {
    openCookieModal();
    const wrapper = mount(CookieConsentModal, withRouter(router));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.cm-title').text()).toBe('Learn more about how we protect your data');
    expect(wrapper.text()).toContain('Transparency and Consent Framework');
    expect(wrapper.find('.cm-allow-all').text()).toBe('Allow all');

    // The body paragraph used to embed a "Privacy and cookies statement" link;
    // it was removed and must not come back.
    expect(wrapper.find('.cm-link').exists()).toBe(false);
    expect(wrapper.find('.cm-body a').exists()).toBe(false);
  });

  it('shows the four cookie categories: strict (Always active) + 3 None', async () => {
    openCookieModal();
    const wrapper = mount(CookieConsentModal, withRouter(router));
    await wrapper.vm.$nextTick();

    const cats = wrapper.findAll('.cm-cat');
    expect(cats).toHaveLength(4);

    expect(cats[0].find('.cm-cat-name').text()).toBe('Strictly necessary cookies');
    expect(cats[0].find('.cm-cat-state').text()).toBe('Always active');
    expect(cats[0].find('.cm-cat-state').classes()).toContain('cm-cat-state--always');

    const others = [
      ['Targeted advertising cookies', 'None'],
      ['Performance cookies', 'None'],
      ['Functional cookies', 'None'],
    ];
    for (let i = 0; i < 3; i++) {
      expect(cats[i + 1].find('.cm-cat-name').text()).toBe(others[i][0]);
      expect(cats[i + 1].find('.cm-cat-state').text()).toBe(others[i][1]);
      expect(cats[i + 1].find('.cm-cat-state').classes()).not.toContain('cm-cat-state--always');
    }

    // No interactive toggles in the categories anymore.
    expect(wrapper.findAll('.cm-cat input[type="checkbox"]')).toHaveLength(0);
    expect(wrapper.findAll('.cm-cat button')).toHaveLength(0);
  });

  it('exposes the Reject all and Confirm selection buttons in the footer', async () => {
    openCookieModal();
    const wrapper = mount(CookieConsentModal, withRouter(router));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.cm-btn--reject').text()).toBe('Reject all');
    expect(wrapper.find('.cm-btn--confirm').text()).toBe('Confirm selection');
  });

  it('clicking any of the three CTAs (Allow all / Reject all / Confirm) closes the modal', async () => {
    for (const selector of ['.cm-allow-all', '.cm-btn--reject', '.cm-btn--confirm']) {
      openCookieModal();
      const wrapper = mount(CookieConsentModal, withRouter(router));
      await wrapper.vm.$nextTick();

      await wrapper.find(selector).trigger('click');
      expect(cookieModalOpen.value, selector).toBe(false);
      wrapper.unmount();
    }
  });

  it('renders the modal in French (with Aucun for the three configurable categories)', async () => {
    setLocale('fr');
    openCookieModal();
    const wrapper = mount(CookieConsentModal, withRouter(router));
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.cm-title').text()).toBe(
      'En savoir plus sur la protection de vos données',
    );
    expect(wrapper.find('.cm-allow-all').text()).toBe('Tout autoriser');
    expect(wrapper.find('.cm-btn--reject').text()).toBe('Tout refuser');
    expect(wrapper.find('.cm-btn--confirm').text()).toBe('Confirmer la sélection');

    const cats = wrapper.findAll('.cm-cat');
    expect(cats[0].find('.cm-cat-state').text()).toBe('Toujours actif');
    expect(cats[1].find('.cm-cat-state').text()).toBe('Aucun');
    expect(cats[2].find('.cm-cat-state').text()).toBe('Aucun');
    expect(cats[3].find('.cm-cat-state').text()).toBe('Aucun');
  });
});

describe('Footer wiring for cookie consent / legal links', () => {
  let router;
  beforeEach(async () => {
    setLocale('en');
    closeCookieModal();
    router = await setupRouter('/');
  });

  it('the legal nav no longer exposes a Privacy and Cookies Statement link', () => {
    const wrapper = mount(App, withRouter(router));
    const labels = wrapper.findAll('.legal a, .legal button').map((el) => el.text());
    expect(labels).not.toContain('Privacy and Cookies Statement');
  });

  it('clicking the Cookie consent link in the legal nav opens the modal', async () => {
    const wrapper = mount(App, withRouter(router));
    const trigger = wrapper.findAll('.legal button').find((b) => b.text() === 'Cookie consent');
    expect(trigger).toBeDefined();

    expect(cookieModalOpen.value).toBe(false);
    await trigger.trigger('click');
    expect(cookieModalOpen.value).toBe(true);
  });
});
