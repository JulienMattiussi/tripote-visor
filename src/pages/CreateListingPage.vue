<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';

const router = useRouter();

const TYPES = ['hotel', 'restaurant', 'attraction', 'rental'];
const RELATIONSHIPS = ['owner', 'employee', 'traveller'];

const COUNTRIES = [
  { code: 'FR', label: 'France' },
  { code: 'BE', label: 'Belgique / België' },
  { code: 'CH', label: 'Suisse / Schweiz' },
  { code: 'CA', label: 'Canada' },
  { code: 'US', label: 'United States' },
  { code: 'IT', label: 'Italia' },
  { code: 'ES', label: 'España' },
  { code: 'DE', label: 'Deutschland' },
  { code: 'PT', label: 'Portugal' },
  { code: 'GB', label: 'United Kingdom' },
];

const type = ref('hotel');
const name = ref('');
const country = ref('FR');
const address = ref('');
const city = ref('');
const postal = ref('');
const phone = ref('');
const website = ref('');
const description = ref('');
const relationship = ref('');
const submitted = ref(false);
const showError = ref(false);

const isValid = computed(
  () =>
    type.value &&
    name.value.trim() &&
    country.value &&
    address.value.trim() &&
    city.value.trim() &&
    postal.value.trim() &&
    description.value.trim() &&
    relationship.value,
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
      <h1 class="form-hero-title">{{ t('cl_page.hero_title') }}</h1>
      <p class="form-hero-subtitle">{{ t('cl_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container form-main">
    <div v-if="!submitted" class="form-card">
      <form @submit="onSubmit">
        <fieldset class="field">
          <legend class="field-label">{{ t('cl_page.type_label') }} <em>*</em></legend>
          <div class="chip-group">
            <label v-for="entry in TYPES" :key="entry" class="chip">
              <input v-model="type" type="radio" :value="entry" />
              <span>{{ t(`cl_page.type_${entry}`) }}</span>
            </label>
          </div>
        </fieldset>

        <label class="field">
          <span class="field-label">{{ t('cl_page.name_label') }} <em>*</em></span>
          <input v-model="name" type="text" :placeholder="t('cl_page.name_placeholder')" required />
        </label>

        <label class="field">
          <span class="field-label">{{ t('cl_page.country_label') }} <em>*</em></span>
          <select v-model="country" required>
            <option v-for="c in COUNTRIES" :key="c.code" :value="c.code">{{ c.label }}</option>
          </select>
        </label>

        <label class="field">
          <span class="field-label">{{ t('cl_page.address_label') }} <em>*</em></span>
          <input
            v-model="address"
            type="text"
            :placeholder="t('cl_page.address_placeholder')"
            required
          />
        </label>

        <div class="row">
          <label class="field">
            <span class="field-label">{{ t('cl_page.city_label') }} <em>*</em></span>
            <input
              v-model="city"
              type="text"
              :placeholder="t('cl_page.city_placeholder')"
              required
            />
          </label>
          <label class="field">
            <span class="field-label">{{ t('cl_page.postal_label') }} <em>*</em></span>
            <input
              v-model="postal"
              type="text"
              :placeholder="t('cl_page.postal_placeholder')"
              required
            />
          </label>
        </div>

        <div class="row">
          <label class="field">
            <span class="field-label">{{ t('cl_page.phone_label') }}</span>
            <input v-model="phone" type="tel" :placeholder="t('cl_page.phone_placeholder')" />
          </label>
          <label class="field">
            <span class="field-label">{{ t('cl_page.website_label') }}</span>
            <input v-model="website" type="url" :placeholder="t('cl_page.website_placeholder')" />
          </label>
        </div>

        <label class="field">
          <span class="field-label">{{ t('cl_page.description_label') }} <em>*</em></span>
          <textarea
            v-model="description"
            rows="5"
            :placeholder="t('cl_page.description_placeholder')"
            required
          ></textarea>
        </label>

        <fieldset class="field">
          <legend class="field-label">{{ t('cl_page.relationship_label') }} <em>*</em></legend>
          <div class="radio-stack">
            <label v-for="r in RELATIONSHIPS" :key="r" class="radio-row">
              <input v-model="relationship" type="radio" :value="r" />
              <span>{{ t(`cl_page.relationship_${r}`) }}</span>
            </label>
          </div>
        </fieldset>

        <div v-if="showError" class="form-error" role="alert">
          {{ t('cl_page.error_required') }}
        </div>

        <button type="submit" class="pill-btn pill-btn--brand form-submit">
          {{ t('cl_page.submit') }}
        </button>
      </form>
    </div>

    <div v-else class="form-success" role="status">
      <span class="form-success-icon" aria-hidden="true">✓</span>
      <h2>{{ t('cl_page.success_title') }}</h2>
      <p>{{ t('cl_page.success_body') }}</p>
      <button type="button" class="pill-btn pill-btn--dark" @click="goHome">
        {{ t('cl_page.back_home') }}
      </button>
    </div>
  </main>
</template>

<style scoped>
@import '../styles/form-page.css';

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
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

.radio-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-row {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.15s ease;
}

.radio-row:hover {
  background: var(--surface);
}

.radio-row input {
  width: 18px;
  height: 18px;
  accent-color: var(--brand);
}

@media (max-width: 600px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
