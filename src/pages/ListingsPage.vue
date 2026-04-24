<script setup>
import { computed, ref } from 'vue';
import { t, formatAmount, locale } from '../i18n/store.js';
import { LISTINGS_BY_TYPE } from '../data/listings.js';

const props = defineProps({
  listingType: {
    type: String,
    required: true,
    validator: (v) => ['hotels', 'attractions'].includes(v),
  },
});

const isHotels = computed(() => props.listingType === 'hotels');

const titleKey = computed(() => `listings.${props.listingType}_title`);
const introKey = computed(() => `listings.${props.listingType}_intro`);

const sortBy = ref('recommended');
const query = ref('');

const baseListings = computed(() => LISTINGS_BY_TYPE[props.listingType] ?? []);

const visibleListings = computed(() => {
  const filtered = query.value.trim()
    ? baseListings.value.filter((l) =>
        l.location.toLowerCase().includes(query.value.trim().toLowerCase()),
      )
    : baseListings.value;
  const priceOf = (l) => (isHotels.value ? l.pricePerNightEur : l.pricePerPersonEur);
  switch (sortBy.value) {
    case 'top_rated':
      return [...filtered].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case 'price_asc':
      return [...filtered].sort((a, b) => priceOf(a) - priceOf(b));
    case 'price_desc':
      return [...filtered].sort((a, b) => priceOf(b) - priceOf(a));
    default:
      return filtered;
  }
});

const formatReviews = (count) => count.toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US');

const formatDuration = (hours) =>
  hours >= 24
    ? t('listings.duration_days', { days: Math.round(hours / 24) })
    : t('listings.duration', { hours });

const onSubmit = (e) => {
  e.preventDefault();
};

const onView = (listing) => {
  alert(`${listing.name} ${t('common.sim_suffix')}`);
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
          aria-label="Search by destination"
        />
        <button type="submit" class="pill-btn pill-btn--brand">
          {{ t('listings.search_btn') }}
        </button>
      </form>
    </div>
  </section>

  <main class="container lst-main">
    <div class="lst-toolbar">
      <span class="lst-count">{{
        t('listings.results_count', { count: visibleListings.length })
      }}</span>
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

    <p v-if="!visibleListings.length" class="lst-empty">{{ t('listings.empty_state') }}</p>

    <ul v-else class="lst-grid">
      <li v-for="listing in visibleListings" :key="listing.id" class="lst-card">
        <div class="lst-card-thumb">
          <img :src="listing.image" :alt="listing.name" loading="lazy" />
        </div>
        <div class="lst-card-body">
          <h3 class="lst-card-name">{{ listing.name }}</h3>
          <p class="lst-card-loc">{{ listing.location }}</p>
          <div class="lst-card-rating">
            <span class="lst-stars" aria-hidden="true">
              <span
                v-for="i in 5"
                :key="i"
                :class="['dot', { filled: i <= Math.round(listing.rating) }]"
              ></span>
            </span>
            <span class="lst-rating-num">{{ listing.rating.toFixed(1) }}</span>
            <span class="lst-reviews">({{ formatReviews(listing.reviews) }})</span>
          </div>
          <div class="lst-card-foot">
            <span v-if="isHotels" class="lst-price">
              {{ t('listings.from_per_night', { amount: formatAmount(listing.pricePerNightEur) }) }}
            </span>
            <template v-else>
              <span class="lst-duration">{{ formatDuration(listing.durationHours) }}</span>
              <span class="lst-price">
                {{
                  t('listings.from_per_person', { amount: formatAmount(listing.pricePerPersonEur) })
                }}
              </span>
            </template>
            <button type="button" class="lst-view-btn" @click="onView(listing)">
              {{ t('listings.view_details') }}
            </button>
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
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.lst-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.lst-card-thumb {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.lst-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.lst-duration {
  font-size: 13px;
  color: var(--text-muted);
}

.lst-view-btn {
  margin-left: auto;
  padding: 8px 18px;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-weight: 700;
  font-size: 13px;
}

.lst-view-btn:hover {
  background: var(--brand-hover);
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
  .lst-view-btn {
    margin-left: 0;
  }
}
</style>
