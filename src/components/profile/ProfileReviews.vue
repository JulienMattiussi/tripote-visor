<script setup>
import { computed, ref } from 'vue';
import { t, formatReviewDate } from '../../i18n/store.js';

const props = defineProps({
  reviews: { type: Array, default: () => [] },
});

const emit = defineEmits(['add-review']);

const REVIEWS_PREVIEW = 5;
const showAll = ref(false);

const reviewCount = computed(() => props.reviews.length);
const averageRating = computed(() => {
  if (!reviewCount.value) return 0;
  return props.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount.value;
});
const visible = computed(() =>
  showAll.value ? props.reviews : props.reviews.slice(0, REVIEWS_PREVIEW),
);
</script>

<template>
  <section id="reviews" class="fp-block">
    <div class="fp-reviews-header">
      <h2 class="fp-block-title">{{ t('profile_page.reviews_title') }}</h2>
      <button type="button" class="fp-top-btn fp-reviews-add" @click="emit('add-review')">
        + {{ t('profile_page.add_review') }}
      </button>
    </div>
    <p v-if="reviewCount === 0" class="fp-empty">
      {{ t('profile_page.no_reviews') }}
    </p>
    <template v-else>
      <p class="fp-reviews-summary">
        <span class="fp-reviews-avg">{{ averageRating.toFixed(1) }}</span>
        <span class="fp-stars" aria-hidden="true">
          <span
            v-for="n in 5"
            :key="n"
            :class="['dot', { filled: n <= Math.round(averageRating) }]"
          ></span>
        </span>
        <span class="fp-reviews-total">
          {{ t('profile_page.reviews_count', { count: reviewCount }) }}
        </span>
      </p>
      <ul class="fp-reviews-list">
        <li v-for="(r, i) in visible" :key="i" class="fp-review" :lang="r.lang">
          <div class="fp-review-head">
            <div class="fp-review-rating" aria-hidden="true">
              <span v-for="n in 5" :key="n" :class="['dot', { filled: n <= r.rating }]"></span>
            </div>
            <span class="fp-review-meta">
              <span class="fp-review-author">{{ r.author }}</span>
              <span aria-hidden="true">·</span>
              <time class="fp-review-date" :datetime="r.date">
                {{ formatReviewDate(r.date) }}
              </time>
            </span>
          </div>
          <h3 class="fp-review-title">{{ r.title }}</h3>
          <p class="fp-review-body">{{ r.body }}</p>
        </li>
      </ul>
      <button
        v-if="reviewCount > REVIEWS_PREVIEW && !showAll"
        type="button"
        class="fp-reviews-more"
        @click="showAll = true"
      >
        {{ t('profile_page.see_all_reviews', { count: reviewCount }) }}
      </button>
    </template>
  </section>
</template>

<style scoped>
.fp-block {
  background: var(--bg);
  padding: 18px 0;
  border-bottom: 1px solid var(--border);
  scroll-margin-top: 130px;
}

.fp-block:last-of-type {
  border-bottom: none;
}

.fp-block-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: var(--brand-dark);
}

.fp-empty {
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
}

.fp-reviews-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.fp-reviews-header .fp-block-title {
  margin: 0;
}

.fp-top-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--surface);
  font-weight: 700;
  font-size: 13px;
  color: var(--text);
}

.fp-top-btn:hover {
  background: var(--brand-tint);
}

.fp-reviews-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 18px 0;
  font-size: 14px;
  color: var(--text);
}

.fp-reviews-avg {
  font-size: 22px;
  font-weight: 800;
  color: var(--brand-dark);
}

.fp-stars {
  display: inline-flex;
  gap: 2px;
}

.fp-stars .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border);
  display: inline-block;
}

.fp-stars .dot.filled {
  background: var(--brand);
}

.fp-reviews-total {
  color: var(--text-muted);
}

.fp-reviews-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.fp-review {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fp-review-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fp-review-rating {
  display: inline-flex;
  gap: 2px;
}

.fp-review-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.fp-review-author {
  font-weight: 600;
  color: var(--brand-dark);
}

.fp-review-date {
  color: var(--text-muted);
}

.fp-review-rating .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
  display: inline-block;
}

.fp-review-rating .dot.filled {
  background: var(--brand);
}

.fp-review-title {
  font-size: 15px;
  font-weight: 800;
  margin: 4px 0 0 0;
  color: var(--text);
  line-height: 1.3;
}

.fp-review-body {
  font-size: 14px;
  line-height: 1.55;
  margin: 0;
  color: var(--text);
}

.fp-reviews-more {
  margin-top: 14px;
  align-self: flex-start;
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--surface);
  font-weight: 700;
  font-size: 13px;
  color: var(--brand-dark);
  cursor: pointer;
  font-family: inherit;
  border: 1px solid var(--border);
}

.fp-reviews-more:hover {
  background: var(--brand-tint);
  border-color: var(--brand);
}
</style>
