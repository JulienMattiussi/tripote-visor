<script setup>
import { computed } from 'vue';
import { t } from '../i18n/store.js';

const categories = computed(() => [
  {
    key: 'outdoors',
    label: t('categories.outdoors'),
    img: 'https://images.unsplash.com/photo-1526491109672-74740652b963?w=600&q=60',
  },
  {
    key: 'food',
    label: t('categories.food'),
    img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=60',
  },
  {
    key: 'culture',
    label: t('categories.culture'),
    img: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&q=60',
  },
  {
    key: 'water',
    label: t('categories.water'),
    img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=60',
  },
]);
</script>

<template>
  <section class="section">
    <h2 class="section-title">{{ t('categories.title') }}</h2>
    <p class="section-subtitle">{{ t('categories.subtitle') }}</p>
    <ul class="cat-grid">
      <li v-for="c in categories" :key="c.key" class="cat-card">
        <img :src="c.img" :alt="c.label" loading="lazy" />
        <span class="cat-label">{{ c.label }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.cat-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.cat-card {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.cat-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-label {
  position: absolute;
  left: 16px;
  bottom: 14px;
  color: var(--on-dark);
  font-size: 22px;
  font-weight: 800;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

@media (max-width: 900px) {
  .cat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
