<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { t } from '../i18n/store.js';
import { openLoginRequired } from '../state/modals.js';
import fichesData from '../data/fiches.json';
import PlaceSearchSelect from '../components/PlaceSearchSelect.vue';

const route = useRoute();

const initialFiche = (() => {
  const id = (route.query.fiche ?? '').toString();
  return id ? (fichesData.find((f) => f.id === id) ?? null) : null;
})();

const todayIso = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const selectedFiche = ref(initialFiche);
const rating = ref(0);
const visitDate = ref(todayIso());
const title = ref('');
const body = ref('');
const showError = ref(false);

const RATING_LABELS = [
  '',
  'rating_terrible',
  'rating_poor',
  'rating_average',
  'rating_very_good',
  'rating_excellent',
];

const ratingLabel = computed(() =>
  rating.value > 0 ? t(`ur_page.${RATING_LABELS[rating.value]}`) : '',
);

const isValid = computed(
  () =>
    selectedFiche.value &&
    rating.value > 0 &&
    visitDate.value &&
    title.value.trim() &&
    body.value.trim(),
);

const onSubmit = (e) => {
  e.preventDefault();
  if (!isValid.value) {
    showError.value = true;
    return;
  }
  showError.value = false;
  openLoginRequired({ target: 'publish_review', name: selectedFiche.value.nom });
};
</script>

<template>
  <section class="form-hero">
    <div class="container">
      <h1 class="form-hero-title">{{ t('ur_page.hero_title') }}</h1>
      <p class="form-hero-subtitle">{{ t('ur_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container form-main">
    <div class="form-card">
      <form @submit="onSubmit">
        <div class="field">
          <span class="field-label">{{ t('ur_page.place_label') }} <em>*</em></span>
          <PlaceSearchSelect
            v-model="selectedFiche"
            :placeholder="t('ur_page.place_placeholder')"
          />
        </div>

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
