<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../../i18n/store.js';
import { AGE_BUCKETS } from '../../lib/ageBuckets.js';

const router = useRouter();

const buckets = computed(() =>
  AGE_BUCKETS.map((b) => ({ id: b.id, img: b.img, label: t(b.labelKey) })),
);

const onPick = (id) => router.push({ name: 'search', query: { age: id } });
</script>

<template>
  <section class="section">
    <h2 class="section-title">{{ t('age_groups.title') }}</h2>
    <p class="section-subtitle">{{ t('age_groups.subtitle') }}</p>
    <ul class="age-grid">
      <li
        v-for="b in buckets"
        :key="b.id"
        class="age-card"
        tabindex="0"
        role="link"
        :aria-label="b.label"
        @click="onPick(b.id)"
        @keydown.enter="onPick(b.id)"
      >
        <img :src="b.img" :alt="b.label" loading="lazy" />
        <span class="age-label">{{ b.label }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.age-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.age-card {
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

.age-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.age-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.age-label {
  position: absolute;
  left: 16px;
  bottom: 14px;
  color: var(--on-dark);
  font-size: 22px;
  font-weight: 800;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

@media (max-width: 900px) {
  .age-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
