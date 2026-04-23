<script setup>
import { computed } from 'vue';
import { t, locale } from '../i18n/store.js';

const NAMES = {
  rome: { en: 'Rome, Italy', fr: 'Rome, Italie' },
  paris: { en: 'Paris, France', fr: 'Paris, France' },
  vegas: { en: 'Las Vegas, NV', fr: 'Las Vegas, NV' },
  london: { en: 'London, UK', fr: 'Londres, Royaume-Uni' },
};

const destinations = computed(() => [
  {
    key: 'rome',
    name: NAMES.rome[locale.value] ?? NAMES.rome.en,
    img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=700&q=60',
  },
  {
    key: 'paris',
    name: NAMES.paris[locale.value] ?? NAMES.paris.en,
    img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&q=60',
  },
  {
    key: 'vegas',
    name: NAMES.vegas[locale.value] ?? NAMES.vegas.en,
    img: 'https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=700&q=60',
  },
  {
    key: 'london',
    name: NAMES.london[locale.value] ?? NAMES.london.en,
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=700&q=60',
  },
]);
</script>

<template>
  <section class="section">
    <h2 class="section-title">{{ t('destinations.title') }}</h2>
    <ul class="dest-grid">
      <li v-for="d in destinations" :key="d.key" class="dest-card">
        <img :src="d.img" :alt="d.name" loading="lazy" />
        <div class="overlay" />
        <span class="dest-name">{{ d.name }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.dest-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.dest-card {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.dest-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.dest-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 55%, rgba(0, 0, 0, 0.65) 100%);
}

.dest-name {
  position: absolute;
  left: 16px;
  bottom: 16px;
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

@media (max-width: 900px) {
  .dest-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
