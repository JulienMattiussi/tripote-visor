<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { t, formatAmount, formatLieu, reviewCountFor, reviewAverageFor } from '../i18n/store.js';
import DestinationsHighlights from '../components/DestinationsHighlights.vue';
import fichesData from '../data/fiches.json';

const router = useRouter();

const topFiches = computed(() =>
  [...fichesData]
    .sort((a, b) => reviewAverageFor(b.id) - reviewAverageFor(a.id) || a.nom.localeCompare(b.nom))
    .slice(0, 4),
);

const favorites = ref({});

const toggleFav = (id) => {
  favorites.value[id] = !favorites.value[id];
};

const goFiche = (id) => {
  router.push({ name: 'fiche', params: { id } });
};

const goHome = () => router.push({ name: 'home' });
</script>

<template>
  <section class="dp-hero" :aria-label="t('discover_page.hero_aria')">
    <div class="dp-hero-overlay">
      <div class="container dp-hero-grid">
        <h1 class="dp-hero-title">{{ t('discover_page.hero_title') }}</h1>
        <div class="dp-hero-art" aria-hidden="true">
          <span class="dp-circle dp-circle--top">
            <img src="/cities/paris.jpg" alt="" loading="lazy" />
          </span>
          <span class="dp-circle dp-circle--main">
            <img src="/cities/nice.jpg" alt="" loading="lazy" />
          </span>
          <span class="dp-circle dp-circle--bottom">
            <img src="/cities/lyon.jpg" alt="" loading="lazy" />
          </span>
        </div>
      </div>
    </div>
  </section>

  <main class="container dp-main">
    <p class="dp-disclaimer">{{ t('discover_page.disclaimer') }}</p>

    <h2 class="dp-section-title">{{ t('discover_page.section_title') }}</h2>

    <ul class="dp-grid">
      <li
        v-for="(f, idx) in topFiches"
        :key="f.id"
        class="dp-card"
        tabindex="0"
        role="link"
        @click="goFiche(f.id)"
        @keydown.enter="goFiche(f.id)"
      >
        <div class="dp-thumb" aria-hidden="true">
          <button
            class="dp-fav"
            type="button"
            :aria-pressed="favorites[f.id] || false"
            :aria-label="favorites[f.id] ? t('experiences.fav_remove') : t('experiences.fav_add')"
            @click.stop="toggleFav(f.id)"
          >
            <svg
              viewBox="0 0 24 24"
              :class="['heart', { filled: favorites[f.id] }]"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"
              />
            </svg>
          </button>
        </div>
        <div class="dp-rank-row">
          <span class="dp-rank">{{ idx + 1 }}</span>
          <span class="dp-loc">{{ formatLieu(f) }}</span>
        </div>
        <h3 class="dp-name">{{ f.nom }}</h3>
        <div class="dp-rating">
          <span class="dp-stars" aria-hidden="true">
            <span
              v-for="i in 5"
              :key="i"
              :class="['dot', { filled: i <= Math.round(reviewAverageFor(f.id)) }]"
            ></span>
          </span>
          <span class="dp-rating-num">
            {{ reviewCountFor(f.id) ? reviewAverageFor(f.id).toFixed(1) : '-' }}
          </span>
          <span class="dp-rating-count">({{ reviewCountFor(f.id) }})</span>
        </div>
        <div class="dp-price">
          {{ t('discover_page.from_price', { amount: formatAmount(f.prix) }) }}
        </div>
      </li>
    </ul>

    <DestinationsHighlights />

    <button type="button" class="pill-btn pill-btn--brand dp-back" @click="goHome">
      {{ t('discover_page.back_home') }}
    </button>
  </main>
</template>

<style scoped>
.dp-hero {
  position: relative;
  min-height: 360px;
  background: linear-gradient(135deg, var(--brand-dark), var(--brand-hover)) center/cover no-repeat;
  display: flex;
  align-items: center;
  border-radius: 0;
  overflow: hidden;
}

.dp-hero-overlay {
  width: 100%;
  background: var(--scrim);
  padding: 72px 0;
}

.dp-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 32px;
  align-items: center;
}

.dp-hero-title {
  color: var(--on-dark);
  font-size: 40px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0;
  max-width: 560px;
}

.dp-hero-art {
  position: relative;
  width: 100%;
  height: 320px;
  justify-self: end;
}

.dp-circle {
  position: absolute;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.dp-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dp-circle--top {
  width: 150px;
  height: 150px;
  top: 6%;
  left: 8%;
  z-index: 1;
}

.dp-circle--main {
  width: 220px;
  height: 220px;
  top: 18%;
  left: 32%;
  z-index: 3;
}

.dp-circle--bottom {
  width: 160px;
  height: 160px;
  bottom: 4%;
  right: 4%;
  z-index: 2;
}

.dp-main {
  padding-top: 24px;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dp-disclaimer {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

.dp-section-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--brand-dark);
  margin: 0;
}

.dp-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.dp-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  background: var(--bg);
  border-radius: var(--radius);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.dp-card:hover,
.dp-card:focus-visible {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
  outline: none;
}

.dp-thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--brand-light), var(--surface-alt));
  overflow: hidden;
  box-shadow: var(--shadow);
}

.dp-fav {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  backdrop-filter: blur(2px);
}

.dp-fav:hover {
  background: var(--bg);
}

.heart {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--text);
  stroke-width: 2;
}

.heart.filled {
  fill: var(--danger);
  stroke: var(--danger);
}

.dp-rank-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 8px;
}

.dp-rank {
  font-size: 40px;
  font-weight: 800;
  color: var(--brand-dark);
  line-height: 1;
}

.dp-loc {
  font-size: 13px;
  color: var(--text-muted);
}

.dp-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dp-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.dp-stars {
  display: inline-flex;
  gap: 2px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
  display: inline-block;
}

.dot.filled {
  background: var(--brand);
}

.dp-rating-num {
  font-weight: 700;
  color: var(--text);
}

.dp-rating-count {
  color: var(--text-muted);
}

.dp-price {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.dp-back {
  align-self: flex-start;
}

@media (max-width: 900px) {
  .dp-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dp-hero-title {
    font-size: 28px;
  }
  .dp-hero-grid {
    grid-template-columns: 1fr;
  }
  .dp-hero-art {
    height: 240px;
    justify-self: center;
    max-width: 360px;
  }
  .dp-circle--top {
    width: 110px;
    height: 110px;
  }
  .dp-circle--main {
    width: 170px;
    height: 170px;
  }
  .dp-circle--bottom {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 500px) {
  .dp-grid {
    grid-template-columns: 1fr;
  }
}
</style>
