<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { t, locale } from '../i18n/store.js';
import { openLoginRequired } from '../state/modals.js';
import { formatLocation } from '../lib/profiles.js';
import { todayStatus, periodsOf } from '../lib/schedule.js';
import profilesData from '../data/profiles.json';
import schedulesData from '../data/schedules.json';
import advicesData from '../data/advices.json';
import ProfileGallery from '../components/profile/ProfileGallery.vue';
import ProfileSchedule from '../components/profile/ProfileSchedule.vue';
import ProfileReviews from '../components/profile/ProfileReviews.vue';

const route = useRoute();
const router = useRouter();

const profile = computed(() => profilesData.find((f) => f.id === route.params.id));
const schedule = computed(() =>
  profile.value ? schedulesData.find((s) => s.id === profile.value.schedule_id) : null,
);
const reviews = computed(() => (profile.value ? (advicesData[profile.value.id] ?? []) : []));
const reviewCount = computed(() => reviews.value.length);
const averageRating = computed(() => {
  if (!reviewCount.value) return 0;
  return reviews.value.reduce((acc, r) => acc + r.rating, 0) / reviewCount.value;
});

const descriptionLines = computed(() => {
  if (!profile.value) return [];
  const en = profile.value.description.en;
  if (locale.value === 'en' && Array.isArray(en) && en.length) return en;
  return profile.value.description.fr ?? [];
});

const status = computed(() => todayStatus(schedule.value, t));

const services = computed(() => {
  const codes = profile.value?.services ?? [];
  return codes.map((c) => t(`profile_page.service_${c}`));
});

const PAYMENT_METHODS = [
  { flag: 'payment_cash', labelKey: 'payment_cash' },
  { flag: 'payment_check', labelKey: 'payment_check' },
  { flag: 'payment_card', labelKey: 'payment_card' },
  { flag: 'payment_paypal', labelKey: 'payment_paypal' },
];

const paymentMethods = computed(() => {
  if (!profile.value) return [];
  return PAYMENT_METHODS.filter((p) => profile.value[p.flag] === true).map((p) =>
    t(`profile_page.${p.labelKey}`),
  );
});

const periods = computed(() => periodsOf(schedule.value, t));

const categoryLabel = computed(() =>
  profile.value ? t(`profile_page.cat_${profile.value.category}`) : '',
);

const tags = computed(() => {
  if (!profile.value) return [];
  return [
    formatLocation(profile.value),
    categoryLabel.value,
    t('profile_page.age_label', { age: profile.value.age }),
  ];
});

const CONTACT_CHIPS = [
  { target: 'site', flag: 'has_site', icon: '🌐', labelKey: 'action_site' },
  { target: 'menu', flag: 'has_menu', icon: '📋', labelKey: 'action_menu' },
  { target: 'phone', flag: 'has_phone', icon: '📞', labelKey: 'action_phone' },
  { target: 'email', flag: 'has_email', icon: '✉️', labelKey: 'action_email' },
];

const availableChips = computed(() => {
  if (!profile.value) return [];
  return CONTACT_CHIPS.filter((chip) => profile.value[chip.flag] === true);
});

const requireLogin = (target) => {
  openLoginRequired({ target, name: profile.value?.name });
};
const goWriteReview = () => {
  if (!profile.value) return;
  router.push({ name: 'write-review', query: { profile: profile.value.id } });
};
const goHome = () => router.push({ name: 'home' });

const mapUrl = computed(() => {
  if (!profile.value?.lat || !profile.value?.lon) return '';
  const { lat, lon } = profile.value;
  const dLat = 0.005;
  const dLon = 0.008;
  const bbox = [lon - dLon, lat - dLat, lon + dLon, lat + dLat].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
});
</script>

<template>
  <section v-if="!profile" class="fp-not-found container">
    <p>{{ t('profile_page.not_found') }}</p>
    <button type="button" class="pill-btn pill-btn--brand" @click="goHome">
      {{ t('profile_page.back_home') }}
    </button>
  </section>

  <article v-else class="fp">
    <header class="fp-header">
      <div class="container">
        <div class="fp-title-row">
          <div class="fp-title-block">
            <h1 class="fp-title">{{ profile.name }}</h1>
            <span class="fp-verified" aria-hidden="true"
              >✓ {{ t('profile_page.verified_page') }}</span
            >
          </div>
          <div class="fp-actions-top">
            <button type="button" class="fp-top-btn" @click="requireLogin('save')">
              <span class="fp-heart" aria-hidden="true">♡</span>
              {{ t('profile_page.save_btn') }}
            </button>
            <button type="button" class="fp-top-btn" @click="goWriteReview">
              + {{ t('profile_page.add_review') }}
            </button>
          </div>
        </div>

        <div class="fp-meta">
          <span class="fp-rating-stub" aria-hidden="true">
            <span class="fp-dots">
              <span
                v-for="i in 5"
                :key="i"
                :class="['dot', { filled: i <= Math.round(averageRating) }]"
              ></span>
            </span>
            <span v-if="reviewCount" class="fp-rating-num">
              {{ averageRating.toFixed(1) }}
            </span>
            <span class="fp-reviews-count">({{ reviewCount }})</span>
          </span>
          <span class="fp-tags">
            <span v-for="(tag, i) in tags" :key="i" class="fp-tag">{{ tag }}</span>
          </span>
        </div>
      </div>
    </header>

    <ProfileGallery :profile="profile" />

    <nav class="fp-tabs" :aria-label="t('profile_page.tab_presentation')">
      <div class="container fp-tabs-inner">
        <a href="#presentation">{{ t('profile_page.tab_presentation') }}</a>
        <a href="#schedule">{{ t('profile_page.tab_schedule') }}</a>
        <a href="#location">{{ t('profile_page.tab_location') }}</a>
        <a href="#reviews">{{ t('profile_page.tab_reviews') }}</a>
      </div>
    </nav>

    <main class="container fp-main">
      <div class="fp-left">
        <section id="presentation" class="fp-block">
          <h2 class="fp-block-title">{{ t('profile_page.glance_title') }}</h2>
          <p class="fp-status">
            <span :class="['fp-status-tag', status.open ? 'open' : 'closed']">
              {{ status.label }}
            </span>
            <a href="#schedule">{{ t('profile_page.see_all_schedule') }}</a>
          </p>
          <p class="fp-address">
            <span class="fp-icon" aria-hidden="true">📍</span>{{ formatLocation(profile) }}
          </p>
          <div v-if="availableChips.length" class="fp-action-chips">
            <button
              v-for="chip in availableChips"
              :key="chip.target"
              type="button"
              class="fp-chip"
              @click="requireLogin(chip.target)"
            >
              <span class="fp-chip-icon" aria-hidden="true">{{ chip.icon }}</span>
              {{ t(`profile_page.${chip.labelKey}`) }}
            </button>
          </div>
        </section>

        <section class="fp-block">
          <h2 class="fp-block-title">{{ t('profile_page.about') }}</h2>
          <ul class="fp-description">
            <li v-for="(line, i) in descriptionLines" :key="i">{{ line }}</li>
          </ul>
        </section>

        <section class="fp-block">
          <h3 class="fp-sub-title">{{ t('profile_page.services_title') }}</h3>
          <ul v-if="services.length" class="fp-services">
            <li v-for="s in services" :key="s">
              <span class="fp-icon" aria-hidden="true">✓</span>{{ s }}
            </li>
          </ul>
          <p v-if="paymentMethods.length" class="fp-feature">
            <span class="fp-icon" aria-hidden="true">💳</span>
            <strong>{{ t('profile_page.payment_title') }} :</strong>
            {{ paymentMethods.join(', ') }}
          </p>
          <p v-if="periods.length" class="fp-feature">
            <span class="fp-icon" aria-hidden="true">🕒</span>
            <strong>{{ t('profile_page.meals_title') }} :</strong>
            {{ periods.join(', ') }}
          </p>
        </section>

        <section id="location" class="fp-block">
          <h2 class="fp-block-title">{{ t('profile_page.localization_title') }}</h2>
          <iframe
            v-if="mapUrl"
            class="fp-map"
            :src="mapUrl"
            :title="t('profile_page.localization_title')"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          <div v-else class="fp-map fp-map-empty" aria-hidden="true">
            <span>{{ t('profile_page.map_placeholder') }}</span>
          </div>
          <p class="fp-address">
            <span class="fp-icon" aria-hidden="true">📍</span>{{ formatLocation(profile) }}
          </p>
          <p class="fp-feature">
            <span class="fp-icon" aria-hidden="true">🅿️</span>{{ t('profile_page.parking_info') }}
          </p>
        </section>

        <ProfileReviews :reviews="reviews" @add-review="goWriteReview" />
      </div>

      <aside class="fp-right">
        <div class="fp-side-block">
          <h3 class="fp-side-title">{{ t('profile_page.save_title') }}</h3>
          <button
            type="button"
            class="pill-btn pill-btn--light fp-save-btn"
            @click="requireLogin('save')"
          >
            <span class="fp-heart" aria-hidden="true">♡</span>
            {{ t('profile_page.save_btn') }}
          </button>
        </div>

        <ProfileSchedule :schedule="schedule" />
      </aside>
    </main>
  </article>
</template>

<style scoped>
.fp-not-found {
  padding: 80px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.fp-header {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  padding: 24px 0 16px;
}

.fp-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.fp-title-block {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.fp-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--brand-dark);
  margin: 0;
}

.fp-verified {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.fp-actions-top {
  display: flex;
  gap: 8px;
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

.fp-heart {
  font-size: 14px;
  color: var(--text);
}

.fp-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 10px;
  font-size: 14px;
}

.fp-rating-stub {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.fp-dots {
  display: inline-flex;
  gap: 2px;
}

.fp-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
  display: inline-block;
}

.fp-dots .dot.filled {
  background: var(--brand);
}

.fp-rating-num {
  font-weight: 700;
  font-size: 14px;
}

.fp-reviews-count {
  color: var(--text-muted);
  font-weight: 600;
}

.fp-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
}

.fp-tag {
  background: var(--surface);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.fp-tabs {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 64px;
  z-index: 40;
}

.fp-tabs-inner {
  display: flex;
  gap: 24px;
}

.fp-tabs a {
  padding: 14px 0;
  font-weight: 700;
  font-size: 14px;
  color: var(--text);
  border-bottom: 3px solid transparent;
}

.fp-tabs a:hover {
  border-bottom-color: var(--brand);
}

.fp-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  padding-top: 24px;
  padding-bottom: 64px;
}

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

.fp-sub-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 8px 0;
  color: var(--text);
}

.fp-status {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.fp-status a {
  color: var(--brand-dark);
  font-weight: 700;
  text-decoration: underline;
}

.fp-status-tag {
  display: inline-block;
  font-weight: 700;
  font-size: 13px;
  padding: 2px 0;
}

.fp-status-tag.open {
  color: var(--brand-dark);
}

.fp-status-tag.closed {
  color: var(--danger);
}

.fp-address,
.fp-feature {
  font-size: 14px;
  margin: 6px 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.fp-icon {
  display: inline-block;
  min-width: 16px;
}

.fp-action-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0;
}

.fp-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.fp-chip-icon {
  font-size: 14px;
  line-height: 1;
}

.fp-chip:hover {
  background: var(--surface);
  border-color: var(--brand);
}

.fp-description {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
  line-height: 1.5;
}

.fp-services {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px 16px;
  font-size: 14px;
}

.fp-services li {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.fp-map {
  width: 100%;
  height: 260px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 12px;
}

.fp-map-empty {
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-weight: 700;
}

.fp-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fp-side-block {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow);
}

.fp-side-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: var(--text);
}

.fp-save-btn {
  width: 100%;
  border: 1px solid var(--text);
  padding: 10px 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 900px) {
  .fp-main {
    grid-template-columns: 1fr;
  }
  .fp-services {
    grid-template-columns: 1fr;
  }
  .fp-tabs {
    position: static;
  }
}
</style>
