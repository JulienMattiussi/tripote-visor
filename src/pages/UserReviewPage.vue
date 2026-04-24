<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';

const router = useRouter();

const place = ref('');
const rating = ref(0);
const visitDate = ref('');
const tripType = ref('');
const title = ref('');
const body = ref('');
const submitted = ref(false);
const showError = ref(false);

const RATING_LABELS = [
  '',
  'rating_terrible',
  'rating_poor',
  'rating_average',
  'rating_very_good',
  'rating_excellent',
];
const TRIP_TYPES = ['couples', 'family', 'friends', 'business', 'solo'];

const ratingLabel = computed(() =>
  rating.value > 0 ? t(`ur_page.${RATING_LABELS[rating.value]}`) : '',
);

const isValid = computed(
  () =>
    place.value.trim() &&
    rating.value > 0 &&
    visitDate.value &&
    tripType.value &&
    title.value.trim() &&
    body.value.trim(),
);

const onSubmit = (e) => {
  e.preventDefault();
  if (!isValid.value) {
    showError.value = true;
    return;
  }
  submitted.value = true;
  showError.value = false;
};

const goHome = () => router.push({ name: 'home' });
</script>

<template>
  <section class="form-hero">
    <div class="container">
      <h1 class="form-hero-title">{{ t('ur_page.hero_title') }}</h1>
      <p class="form-hero-subtitle">{{ t('ur_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container form-main">
    <div v-if="!submitted" class="form-card">
      <form @submit="onSubmit">
        <label class="field">
          <span class="field-label">{{ t('ur_page.place_label') }} <em>*</em></span>
          <input
            v-model="place"
            type="text"
            :placeholder="t('ur_page.place_placeholder')"
            required
          />
        </label>

        <fieldset class="field rating-field">
          <legend class="field-label">{{ t('ur_page.rating_label') }} <em>*</em></legend>
          <div class="rating-stars" role="radiogroup">
            <button
              v-for="i in 5"
              :key="i"
              type="button"
              role="radio"
              :aria-checked="rating === i"
              :class="['star-btn', { active: i <= rating }]"
              :aria-label="t(`ur_page.${RATING_LABELS[i]}`)"
              @click="rating = i"
            >
              ★
            </button>
            <span v-if="ratingLabel" class="rating-text">{{ ratingLabel }}</span>
          </div>
        </fieldset>

        <label class="field">
          <span class="field-label">{{ t('ur_page.visit_date_label') }} <em>*</em></span>
          <input
            v-model="visitDate"
            type="date"
            :placeholder="t('ur_page.visit_date_placeholder')"
            required
          />
        </label>

        <fieldset class="field">
          <legend class="field-label">{{ t('ur_page.trip_type_label') }} <em>*</em></legend>
          <div class="chip-group">
            <label v-for="type in TRIP_TYPES" :key="type" class="chip">
              <input v-model="tripType" type="radio" :value="type" />
              <span>{{ t(`ur_page.trip_${type}`) }}</span>
            </label>
          </div>
        </fieldset>

        <label class="field">
          <span class="field-label">{{ t('ur_page.title_label') }} <em>*</em></span>
          <input
            v-model="title"
            type="text"
            :placeholder="t('ur_page.title_placeholder')"
            maxlength="120"
            required
          />
        </label>

        <label class="field">
          <span class="field-label">{{ t('ur_page.body_label') }} <em>*</em></span>
          <textarea
            v-model="body"
            rows="8"
            :placeholder="t('ur_page.body_placeholder')"
            required
          ></textarea>
        </label>

        <div v-if="showError" class="form-error" role="alert">
          {{ t('ur_page.error_required') }}
        </div>

        <button type="submit" class="pill-btn pill-btn--brand form-submit">
          {{ t('ur_page.submit') }}
        </button>
      </form>
    </div>

    <div v-else class="form-success" role="status">
      <span class="form-success-icon" aria-hidden="true">✓</span>
      <h2>{{ t('ur_page.success_title') }}</h2>
      <p>{{ t('ur_page.success_body') }}</p>
      <button type="button" class="pill-btn pill-btn--dark" @click="goHome">
        {{ t('ur_page.back_home') }}
      </button>
    </div>
  </main>
</template>

<style scoped>
@import '../styles/form-page.css';

.rating-stars {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 28px;
}

.star-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: var(--border);
  cursor: pointer;
  line-height: 1;
  padding: 0 2px;
  transition:
    color 0.15s ease,
    transform 0.1s ease;
}

.star-btn:hover {
  transform: scale(1.1);
}

.star-btn.active {
  color: var(--accent-yellow);
}

.rating-text {
  margin-left: 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--brand-dark);
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border: 1.5px solid var(--border);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.chip input {
  display: none;
}

.chip:has(input:checked) {
  border-color: var(--brand);
  background: var(--brand-tint);
  color: var(--brand-dark);
}
</style>
