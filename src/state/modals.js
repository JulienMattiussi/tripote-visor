import { ref } from 'vue';

export const modalOpen = ref(false);
export const modalTab = ref('region');
export const signinOpen = ref(false);
export const signinScreen = ref('initial');
export const cookieModalOpen = ref(false);
export const loginRequiredOpen = ref(false);
export const loginRequiredContext = ref({ target: null, name: null });

export function openPreferences(tab = 'region') {
  modalTab.value = tab;
  modalOpen.value = true;
}

export function closePreferences() {
  modalOpen.value = false;
}

export function openSignin() {
  signinScreen.value = 'initial';
  signinOpen.value = true;
}

export function closeSignin() {
  signinOpen.value = false;
  signinScreen.value = 'initial';
}

export function goToSigninEmail() {
  signinScreen.value = 'email';
}

export function openCookieModal() {
  cookieModalOpen.value = true;
}

export function closeCookieModal() {
  cookieModalOpen.value = false;
}

export function openLoginRequired({ target, name }) {
  loginRequiredContext.value = { target, name };
  loginRequiredOpen.value = true;
}

export function closeLoginRequired() {
  loginRequiredOpen.value = false;
  loginRequiredContext.value = { target: null, name: null };
}
