<script setup>
import HeroSearch from '../components/home/HeroSearch.vue';
import ThingsToDoBanner from '../components/home/ThingsToDoBanner.vue';
import AgeGrid from '../components/home/AgeGrid.vue';
import ExperienceCards from '../components/home/ExperienceCards.vue';
import DestinationsHighlights from '../components/home/DestinationsHighlights.vue';
import TravelersChoice from '../components/home/TravelersChoice.vue';
import CommunityBlurb from '../components/home/CommunityBlurb.vue';
import SeriousNote from '../components/SeriousNote.vue';
</script>

<template>
  <HeroSearch />
  <div class="container">
    <ThingsToDoBanner />
    <ExperienceCards />
    <AgeGrid />
    <DestinationsHighlights />
  </div>
  <TravelersChoice />
  <div class="container">
    <CommunityBlurb />
    <SeriousNote collapsed class="home-serious" />
  </div>
</template>

<style scoped>
.home-serious {
  margin: 24px 0 32px;
}
</style>
