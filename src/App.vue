<script setup>
import AppHeader from './components/AppHeader.vue';
import HeroSearch from './components/HeroSearch.vue';
import ThingsToDoBanner from './components/ThingsToDoBanner.vue';
import CategoryGrid from './components/CategoryGrid.vue';
import ExperienceCards from './components/ExperienceCards.vue';
import KivaBanner from './components/KivaBanner.vue';
import InspirationCards from './components/InspirationCards.vue';
import DestinationsGrid from './components/DestinationsGrid.vue';
import TravelersChoice from './components/TravelersChoice.vue';
import CommunityBlurb from './components/CommunityBlurb.vue';
import AppFooter from './components/AppFooter.vue';
import PreferencesModal from './components/PreferencesModal.vue';
import SignInModal from './components/SignInModal.vue';
</script>

<template>
  <AppHeader />
  <main>
    <HeroSearch />
    <div class="container">
      <ThingsToDoBanner />
      <CategoryGrid />
      <ExperienceCards />
      <KivaBanner />
      <InspirationCards />
      <DestinationsGrid />
    </div>
    <TravelersChoice />
    <div class="container">
      <CommunityBlurb />
    </div>
  </main>
  <AppFooter />
  <PreferencesModal />
  <SignInModal />
</template>
