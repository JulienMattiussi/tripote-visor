<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { t, formatAmount, locale } from '../i18n/store.js';
import { formatLocation, reviewCountFor, reviewAverageFor } from '../lib/profiles.js';
import profilesData from '../data/profiles.json';

const props = defineProps({
  listingType: {
    type: String,
    required: true,
    validator: (v) => ['hotels', 'parks', 'alleys'].includes(v),
  },
});

const TYPE_TO_CAT = { hotels: 'hotel', parks: 'park', alleys: 'alley' };
const PER_PAGE_DEFAULT = 10;

const router = useRouter();
const route = useRoute();

const titleKey = computed(() => `listings.${props.listingType}_title`);
const introKey = computed(() => `listings.${props.listingType}_intro`);

const sortBy = ref('recommended');
const query = ref((route.query.q ?? '').toString());

watch(
  () => route.query.q,
  (q) => {
    query.value = (q ?? '').toString();
  },
);

const baseFiches = computed(() => {
  const cat = TYPE_TO_CAT[props.listingType];
  return profilesData.filter((f) => f.category === cat);
});

const filteredFiches = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return baseFiches.value;
  return baseFiches.value.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      (f.city ?? '').toLowerCase().includes(q) ||
      (f.district ?? '').toLowerCase().includes(q) ||
      [...(f.description.fr ?? []), ...(f.description.en ?? [])].some((line) =>
        line.toLowerCase().includes(q),
      ),
  );
});

// Hour-stable PRNG (mulberry32). Seed = hours since epoch.
const mulberry32 = (a) => () => {
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const shuffleStable = (arr, seed) => {
  const out = [...arr];
  const rng = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const sortedFiches = computed(() => {
  const list = filteredFiches.value;
  switch (sortBy.value) {
    case 'top_rated':
      return [...list].sort(
        (a, b) => reviewAverageFor(b.id) - reviewAverageFor(a.id) || a.name.localeCompare(b.name),
      );
    case 'price_asc':
      return [...list].sort((a, b) => a.price - b.price);
    case 'price_desc':
      return [...list].sort((a, b) => b.price - a.price);
    default: {
      const seed = Math.floor(Date.now() / 3_600_000);
      return shuffleStable(list, seed);
    }
  }
});

const visibleFiches = computed(() => {
  if (query.value.trim()) return sortedFiches.value;
  return sortedFiches.value.slice(0, PER_PAGE_DEFAULT);
});

const formatReviews = (count) => count.toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US');

const onSubmit = (e) => {
  e.preventDefault();
};

const goFiche = (id) => {
  router.push({ name: 'profile', params: { id } });
};
</script>

<template>
  <section class="lst-hero">
    <div class="container">
      <h1 class="lst-hero-title">{{ t(titleKey) }}</h1>
      <p class="lst-hero-intro">{{ t(introKey) }}</p>
      <form class="lst-search" @submit="onSubmit">
        <span class="lst-search-icon" aria-hidden="true">🔍</span>
        <input
          v-model="query"
          type="text"
          :placeholder="t('listings.search_placeholder')"
          :aria-label="t('listings.search_aria')"
        />
        <button type="submit" class="pill-btn pill-btn--brand">
          {{ t('listings.search_btn') }}
        </button>
      </form>
    </div>
  </section>

  <main class="container lst-main">
    <div class="lst-toolbar">
      <span class="lst-count">
        {{ t('listings.results_count', { count: visibleFiches.length }) }}
      </span>
      <label class="lst-sort">
        <span>{{ t('listings.sort_label') }}</span>
        <select v-model="sortBy">
          <option value="recommended">{{ t('listings.sort_recommended') }}</option>
          <option value="top_rated">{{ t('listings.sort_top_rated') }}</option>
          <option value="price_asc">{{ t('listings.sort_price_asc') }}</option>
          <option value="price_desc">{{ t('listings.sort_price_desc') }}</option>
        </select>
      </label>
    </div>

    <p v-if="!visibleFiches.length" class="lst-empty">{{ t('listings.empty_state') }}</p>

    <ul v-else class="lst-grid">
      <li
        v-for="f in visibleFiches"
        :key="f.id"
        class="lst-card"
        tabindex="0"
        role="link"
        @click="goFiche(f.id)"
        @keydown.enter="goFiche(f.id)"
      >
        <div class="lst-card-thumb" aria-hidden="true"></div>
        <div class="lst-card-body">
          <h3 class="lst-card-name">{{ f.name }}</h3>
          <p class="lst-card-loc">{{ formatLocation(f) }}</p>
          <div class="lst-card-rating">
            <span class="lst-stars" aria-hidden="true">
              <span
                v-for="i in 5"
                :key="i"
                :class="['dot', { filled: i <= Math.round(reviewAverageFor(f.id)) }]"
              ></span>
            </span>
            <span class="lst-rating-num">
              {{ reviewCountFor(f.id) ? reviewAverageFor(f.id).toFixed(1) : '-' }}
            </span>
            <span class="lst-reviews">({{ formatReviews(reviewCountFor(f.id)) }})</span>
          </div>
          <div class="lst-card-foot">
            <span class="lst-price">
              {{ t('listings.from_per_session', { amount: formatAmount(f.price) }) }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.lst-hero {
  background: var(--surface-alt);
  padding: 56px 0 32px;
}

.lst-hero-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 6px 0;
  color: var(--brand-dark);
}

.lst-hero-intro {
  font-size: 15px;
  margin: 0 0 18px 0;
  color: var(--text);
  max-width: 720px;
  line-height: 1.5;
}

.lst-search {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 720px;
  border: 1.5px solid var(--text);
  border-radius: 999px;
  padding: 6px 6px 6px 18px;
  background: var(--bg);
  box-shadow: var(--shadow);
}

.lst-search-icon {
  font-size: 16px;
  color: var(--text-muted);
}

.lst-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 10px 0;
  font-family: inherit;
}

.lst-main {
  padding-top: 24px;
  padding-bottom: 64px;
}

.lst-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.lst-count {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.lst-sort {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
}

.lst-sort select {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  background: var(--bg);
}

.lst-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
  background: var(--surface);
  border-radius: var(--radius);
}

.lst-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.lst-card {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.lst-card:hover,
.lst-card:focus-visible {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
  outline: none;
}

.lst-card-thumb {
  aspect-ratio: 4 / 3;
  background: var(--surface);
}

.lst-card-body {
  padding: 16px 20px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lst-card-name {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: var(--brand-dark);
  line-height: 1.25;
}

.lst-card-loc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.lst-card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.lst-stars {
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

.lst-rating-num {
  font-weight: 700;
}

.lst-reviews {
  color: var(--text-muted);
}

.lst-card-foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.lst-price {
  font-size: 14px;
  font-weight: 800;
  color: var(--brand-dark);
}

@media (max-width: 700px) {
  .lst-card {
    grid-template-columns: 1fr;
  }
  .lst-card-body {
    padding: 16px;
  }
  .lst-card-foot {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
