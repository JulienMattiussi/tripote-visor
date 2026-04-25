<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import PreferencesModal from './components/PreferencesModal.vue';
import SignInModal from './components/SignInModal.vue';
import CookieConsentModal from './components/CookieConsentModal.vue';
import LoginRequiredModal from './components/LoginRequiredModal.vue';
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
