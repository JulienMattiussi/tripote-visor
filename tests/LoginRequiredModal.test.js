import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginRequiredModal from '../src/components/LoginRequiredModal.vue';
import {
  setLocale,
  loginRequiredOpen,
  loginRequiredContext,
  signinOpen,
  openLoginRequired,
  closeLoginRequired,
  closeSignin,
} from '../src/i18n/store.js';

describe('LoginRequiredModal', () => {
  beforeEach(() => {
    setLocale('en');
    closeLoginRequired();
    closeSignin();
  });
  afterEach(() => {
    closeLoginRequired();
    closeSignin();
  });

  it('is hidden when loginRequiredOpen is false', () => {
    const wrapper = mount(LoginRequiredModal);
    expect(wrapper.find('.lr-backdrop').exists()).toBe(false);
  });

  it('renders the access message with the target and name when opened', async () => {
    openLoginRequired({ target: 'menu', name: 'Mireille' });
    const wrapper = mount(LoginRequiredModal);
    expect(wrapper.find('.lr-backdrop').exists()).toBe(true);
    expect(wrapper.find('.lr-message').text()).toBe(
      'You must be signed in to access the pricing card of Mireille.',
    );
  });

  it('renders a different message when the target is "save"', () => {
    openLoginRequired({ target: 'save', name: 'Mireille' });
    const wrapper = mount(LoginRequiredModal);
    expect(wrapper.find('.lr-message').text()).toBe(
      'You must be signed in to save Mireille’s profile.',
    );
  });

  it('renders the French message in fr locale', () => {
    setLocale('fr');
    openLoginRequired({ target: 'menu', name: 'Mireille' });
    const wrapper = mount(LoginRequiredModal);
    expect(wrapper.find('.lr-message').text()).toBe(
      'Vous devez être connecté pour accéder à la carte tarifaire de Mireille.',
    );
  });

  it('renders the French save message in fr locale', () => {
    setLocale('fr');
    openLoginRequired({ target: 'save', name: 'Aïcha' });
    const wrapper = mount(LoginRequiredModal);
    expect(wrapper.find('.lr-message').text()).toBe(
      'Vous devez être connecté pour enregistrer la fiche de Aïcha.',
    );
  });

  it('clicking Cancel closes the modal', async () => {
    openLoginRequired({ target: 'phone', name: 'Roger' });
    const wrapper = mount(LoginRequiredModal);
    await wrapper.find('.lr-cancel').trigger('click');
    expect(loginRequiredOpen.value).toBe(false);
  });

  it('clicking the close (×) button closes the modal', async () => {
    openLoginRequired({ target: 'phone', name: 'Roger' });
    const wrapper = mount(LoginRequiredModal);
    await wrapper.find('.lr-close').trigger('click');
    expect(loginRequiredOpen.value).toBe(false);
  });

  it('clicking the backdrop closes the modal', async () => {
    openLoginRequired({ target: 'site', name: 'Mireille' });
    const wrapper = mount(LoginRequiredModal);
    await wrapper.find('.lr-backdrop').trigger('click');
    expect(loginRequiredOpen.value).toBe(false);
  });

  it('clicking inside the panel does not close the modal', async () => {
    openLoginRequired({ target: 'site', name: 'Mireille' });
    const wrapper = mount(LoginRequiredModal);
    await wrapper.find('.lr-panel').trigger('click');
    expect(loginRequiredOpen.value).toBe(true);
  });

  it('clicking "Sign in" closes this modal and opens the signin modal', async () => {
    openLoginRequired({ target: 'site', name: 'Mireille' });
    const wrapper = mount(LoginRequiredModal);
    await wrapper.find('.lr-signin').trigger('click');
    expect(loginRequiredOpen.value).toBe(false);
    expect(signinOpen.value).toBe(true);
  });

  it('closing resets the context', () => {
    openLoginRequired({ target: 'site', name: 'Mireille' });
    closeLoginRequired();
    expect(loginRequiredContext.value).toEqual({ target: null, name: null });
  });
});
