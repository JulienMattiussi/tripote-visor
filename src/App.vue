<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import PreferencesModal from './components/modals/PreferencesModal.vue';
import SignInModal from './components/modals/SignInModal.vue';
import CookieConsentModal from './components/modals/CookieConsentModal.vue';
import LoginRequiredModal from './components/modals/LoginRequiredModal.vue';
</script>

<template>
  <AppHeader />
  <main>
    <router-view />
  </main>
  <AppFooter />
  <PreferencesModal />
  <SignInModal />
  <CookieConsentModal />
  <LoginRequiredModal />
</template>
