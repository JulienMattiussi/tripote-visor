<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { t, formatAmount } from '../../i18n/store.js';
import { reviewCountFor, reviewAverageFor } from '../../lib/profiles.js';
import profilesData from '../../data/profiles.json';

const router = useRouter();

const HOUR_MS = 3600 * 1000;

const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let x = seed;
  x = Math.imul(x ^ (x >>> 15), x | 1);
  x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
  return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
};

const picks = computed(() => {
  const rng = mulberry32(Math.floor(Date.now() / HOUR_MS));
  const byCity = new Map();
  for (const f of profilesData) {
    if (!byCity.has(f.city)) byCity.set(f.city, []);
    byCity.get(f.city).push(f);
  }
  const cities = [...byCity.keys()];
  for (let i = cities.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cities[i], cities[j]] = [cities[j], cities[i]];
  }
  return cities.slice(0, 4).map((city) => {
    const list = byCity.get(city);
    return list[Math.floor(rng() * list.length)];
  });
});

const goFiche = (id) => router.push({ name: 'profile', params: { id } });
</script>

<template>
  <section class="section experiences">
    <h2 class="section-title">{{ t('experiences.title') }}</h2>
    <p class="section-subtitle">{{ t('experiences.subtitle') }}</p>

    <ul class="exp-grid">
      <li
        v-for="f in picks"
        :key="f.id"
        class="exp-card"
        tabindex="0"
        role="link"
        @click="goFiche(f.id)"
        @keydown.enter="goFiche(f.id)"
      >
        <div class="exp-thumb">
          <span class="exp-city-tag">{{ f.city }}</span>
          <div class="exp-rating-overlay" aria-hidden="true">
            <span class="exp-stars">
              <span
                v-for="i in 5"
                :key="i"
                :class="['dot', { filled: i <= Math.round(reviewAverageFor(f.id)) }]"
              ></span>
            </span>
            <span class="exp-rating-num">
              {{ reviewCountFor(f.id) ? reviewAverageFor(f.id).toFixed(1) : '-' }}
            </span>
            <span class="exp-rating-count">({{ reviewCountFor(f.id) }})</span>
          </div>
        </div>
        <h3 class="exp-name">{{ f.name }}</h3>
        <div class="exp-price">
          {{ t('experiences.from_price', { amount: formatAmount(f.price) }) }}
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.experiences {
  position: relative;
}

.exp-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.exp-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.exp-card:hover,
.exp-card:focus-visible {
  transform: translateY(-2px);
  outline: none;
}

.exp-thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  background: var(--brand-light);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.exp-city-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  text-align: center;
  background: var(--scrim);
  color: var(--on-dark);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.02em;
  padding: 6px 12px;
  border-radius: 999px;
  text-transform: uppercase;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.exp-rating-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 13px;
  box-shadow: var(--shadow);
}

.exp-stars {
  display: inline-flex;
  gap: 2px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  display: inline-block;
}

.dot.filled {
  background: var(--brand);
}

.exp-rating-num {
  font-weight: 700;
}

.exp-rating-count {
  color: var(--text-muted);
}

.exp-name {
  font-size: 14px;
  font-weight: 800;
  color: var(--brand-dark);
  margin: 6px 0 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exp-price {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .exp-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
