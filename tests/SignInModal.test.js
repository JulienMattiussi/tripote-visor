import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SignInModal from '../src/components/SignInModal.vue';
import AppHeader from '../src/components/AppHeader.vue';
import { signinOpen, signinScreen, openSignin, closeSignin, setLocale } from '../src/i18n/store.js';

describe('SignInModal', () => {
  beforeEach(() => {
    setLocale('en');
    closeSignin();
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is hidden until openSignin() is called', async () => {
    const wrapper = mount(SignInModal);
    expect(wrapper.find('.si-backdrop').exists()).toBe(false);

    openSignin();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.si-backdrop').exists()).toBe(true);
  });

  it('shows the initial screen with Google and email buttons', async () => {
    openSignin();
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    const providers = wrapper.findAll('.si-provider');
    expect(providers).toHaveLength(2);
    expect(providers[0].text()).toContain('Continue with Google');
    expect(providers[1].text()).toContain('Continue with email');

    // Initial screen has no back arrow
    expect(wrapper.find('.si-back').exists()).toBe(false);
    // No email/password inputs yet
    expect(wrapper.find('input[type="email"]').exists()).toBe(false);
  });

  it('Google button is permanently disabled and does not trigger an alert', async () => {
    openSignin();
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    const googleBtn = wrapper.findAll('.si-provider')[0];
    expect(googleBtn.attributes('disabled')).toBeDefined();
    expect(googleBtn.attributes('aria-disabled')).toBe('true');

    await googleBtn.trigger('click');
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('clicking "Continue with email" switches to the email screen', async () => {
    openSignin();
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.findAll('.si-provider')[1].trigger('click');

    expect(signinScreen.value).toBe('email');
    expect(wrapper.find('.si-title').text()).toBe('Welcome back!');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('.si-back').exists()).toBe(true);
    expect(wrapper.find('.si-submit').text()).toBe('Log in');
    expect(wrapper.text()).toContain('Forgot password?');

    // Signup CTA and the Terms/Privacy legal blurb were removed — guard
    // against regressions that would re-introduce them.
    expect(wrapper.text()).not.toContain('Not a member yet?');
    expect(wrapper.text()).not.toContain('Sign up');
    expect(wrapper.text()).not.toContain('Terms of Use');
    expect(wrapper.text()).not.toContain('By continuing');
  });

  it('back button returns from email screen to the initial screen', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('.si-back').trigger('click');
    expect(signinScreen.value).toBe('initial');
    expect(wrapper.findAll('.si-provider')).toHaveLength(2);
    expect(wrapper.find('input[type="email"]').exists()).toBe(false);
  });

  it('toggles password visibility with the eye button', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    const input = () => wrapper.find('input[autocomplete="current-password"]');
    const toggle = wrapper.find('.si-toggle');

    expect(input().attributes('type')).toBe('password');
    expect(toggle.attributes('aria-label')).toBe('Show password');

    await toggle.trigger('click');
    expect(input().attributes('type')).toBe('text');
    expect(toggle.attributes('aria-label')).toBe('Hide password');

    await toggle.trigger('click');
    expect(input().attributes('type')).toBe('password');
  });

  it('submit is ignored when email or password is blank', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('form').trigger('submit');
    expect(window.alert).not.toHaveBeenCalled();
    expect(wrapper.find('.si-error').exists()).toBe(false);
  });

  it('submitting filled credentials shows the invalid-credentials error (never a success alert)', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('input[type="email"]').setValue('julien@example.com');
    await wrapper.find('input[autocomplete="current-password"]').setValue('hunter2');
    await wrapper.find('form').trigger('submit');

    expect(window.alert).not.toHaveBeenCalled();
    const err = wrapper.find('.si-error');
    expect(err.exists()).toBe(true);
    expect(err.text()).toContain('Unknown username or password');
    expect(err.attributes('role')).toBe('alert');
  });

  it('typing in either field clears the error', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    const emailInput = wrapper.find('input[type="email"]');
    const pwdInput = wrapper.find('input[autocomplete="current-password"]');

    await emailInput.setValue('a@b.c');
    await pwdInput.setValue('pw');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.si-error').exists()).toBe(true);

    await emailInput.setValue('a@b.co');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.si-error').exists()).toBe(false);

    // Re-trigger error, then clear via password input this time
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.si-error').exists()).toBe(true);
    await pwdInput.setValue('pw2');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.si-error').exists()).toBe(false);
  });

  it('shows the error message in French when locale is fr', async () => {
    setLocale('fr');
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('input[type="email"]').setValue('a@b.c');
    await wrapper.find('input[autocomplete="current-password"]').setValue('pw');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.find('.si-error').text()).toContain('Identifiant ou mot de passe inconnu');
  });

  it('going back to the initial screen clears any error', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('input[type="email"]').setValue('a@b.c');
    await wrapper.find('input[autocomplete="current-password"]').setValue('pw');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.si-error').exists()).toBe(true);

    await wrapper.find('.si-back').trigger('click');
    await wrapper.vm.$nextTick();
    // Return to email screen — error must not persist across screen trips
    signinScreen.value = 'email';
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.si-error').exists()).toBe(false);
  });

  it('close button closes the modal and resets the next open to initial', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('.si-close').trigger('click');
    expect(signinOpen.value).toBe(false);
    expect(signinScreen.value).toBe('initial');
  });

  it('renders French copy when locale is fr on both screens', async () => {
    setLocale('fr');
    openSignin();
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.si-title').text()).toContain('Connectez-vous pour profiter pleinement');
    const providers = wrapper.findAll('.si-provider');
    expect(providers[0].text()).toContain('Se connecter avec Google');
    expect(providers[1].text()).toContain('Se connecter via e-mail');

    await providers[1].trigger('click');
    expect(wrapper.find('.si-title').text()).toBe('Quel plaisir de vous revoir !');
    expect(wrapper.find('.si-submit').text()).toBe('Connectez-vous');
    expect(wrapper.text()).toContain('Mot de passe oublié ?');

    expect(wrapper.text()).not.toContain('Pas encore membre ?');
    expect(wrapper.text()).not.toContain('Inscrivez-vous');
    expect(wrapper.text()).not.toContain('Conditions d’utilisation');
    expect(wrapper.text()).not.toContain('En poursuivant');
  });
});

describe('SignInModal — forgot password flow', () => {
  beforeEach(() => {
    setLocale('en');
    closeSignin();
  });

  it('clicking "Forgot password?" from the email screen opens the forgot screen', async () => {
    openSignin();
    signinScreen.value = 'email';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('.si-forgot').trigger('click');
    expect(signinScreen.value).toBe('forgot');

    expect(wrapper.find('.si-title').text()).toBe('Forgot your password?');
    expect(wrapper.text()).toContain('No worries');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(false);
    expect(wrapper.find('.si-submit').text()).toBe('Send a link');
    expect(wrapper.find('.si-back').exists()).toBe(true);
  });

  it('submitting the forgot form replaces it with a confirmation message', async () => {
    openSignin();
    signinScreen.value = 'forgot';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.si-success').exists()).toBe(false);

    await wrapper.find('input[type="email"]').setValue('julien@example.com');
    await wrapper.find('form').trigger('submit');

    const success = wrapper.find('.si-success');
    expect(success.exists()).toBe(true);
    expect(success.attributes('role')).toBe('status');
    expect(success.text()).toContain('a reset link is on its way');
    // Form must be gone once submission succeeded
    expect(wrapper.find('input[type="email"]').exists()).toBe(false);
    expect(wrapper.find('.si-submit').exists()).toBe(false);
  });

  it('forgot submit is ignored when the email field is blank', async () => {
    openSignin();
    signinScreen.value = 'forgot';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.si-success').exists()).toBe(false);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
  });

  it('back button from the forgot screen returns to the email screen', async () => {
    openSignin();
    signinScreen.value = 'forgot';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('.si-back').trigger('click');
    expect(signinScreen.value).toBe('email');
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('re-entering the forgot screen clears any previous confirmation and input', async () => {
    openSignin();
    signinScreen.value = 'forgot';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    await wrapper.find('input[type="email"]').setValue('j@e.c');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.si-success').exists()).toBe(true);

    await wrapper.find('.si-back').trigger('click');
    await wrapper.vm.$nextTick();
    await wrapper.find('.si-forgot').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.si-success').exists()).toBe(false);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').element.value).toBe('');
  });

  it('renders the forgot screen and its success message in French', async () => {
    setLocale('fr');
    openSignin();
    signinScreen.value = 'forgot';
    const wrapper = mount(SignInModal);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.si-title').text()).toBe('Vous avez oublié votre mot de passe ?');
    expect(wrapper.text()).toContain('Pas de problème');
    expect(wrapper.find('.si-submit').text()).toBe('Envoyer un lien');

    await wrapper.find('input[type="email"]').setValue('julien@example.fr');
    await wrapper.find('form').trigger('submit');
    expect(wrapper.find('.si-success').text()).toContain('Si cette adresse est dans nos registres');
  });
});

describe('AppHeader Sign-in button', () => {
  beforeEach(() => {
    setLocale('en');
    closeSignin();
  });

  it('opens the sign-in modal when the Sign in pill is clicked', async () => {
    const wrapper = mount(AppHeader);
    expect(signinOpen.value).toBe(false);
    await wrapper.find('.sign-in').trigger('click');
    expect(signinOpen.value).toBe(true);
    expect(signinScreen.value).toBe('initial');
  });
});
