<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { t, openLoginRequired } from '../i18n/store.js';
import fichesData from '../data/fiches.json';
import schedulesData from '../data/schedules.json';
import reviewsData from '../data/reviews.json';

const route = useRoute();
const router = useRouter();

const fiche = computed(() => fichesData.find((f) => f.id === route.params.id));
const schedule = computed(() =>
  fiche.value ? schedulesData.find((s) => s.id === fiche.value.horaires_id) : null,
);

const reviews = computed(() => (fiche.value ? (reviewsData[fiche.value.id] ?? []) : []));
const reviewCount = computed(() => reviews.value.length);

const DAYS_ORDER = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const DAY_BY_INDEX = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const todayName = computed(() => DAY_BY_INDEX[new Date().getDay()]);

const todayStatus = computed(() => {
  if (!schedule.value) return { open: false, label: '' };
  const todaySched = schedule.value.jours[todayName.value];
  if (!todaySched) {
    return { open: false, label: t('fiche_page.status_closed_today') };
  }
  const [, end] = todaySched.split('-');
  return { open: true, label: t('fiche_page.status_open', { time: end }) };
});

const orderedDays = computed(() =>
  DAYS_ORDER.map((day) => ({
    key: day,
    label: t(`fiche_page.day_${day}`),
    time: schedule.value?.jours?.[day] ?? null,
    isToday: day === todayName.value,
  })),
);

const services = computed(() => {
  const codes = fiche.value?.services ?? [];
  return codes.map((c) => t(`fiche_page.service_${c}`));
});

const PAYMENT_METHODS = [
  { flag: 'payment_cash', labelKey: 'payment_cash' },
  { flag: 'payment_check', labelKey: 'payment_check' },
  { flag: 'payment_card', labelKey: 'payment_card' },
  { flag: 'payment_paypal', labelKey: 'payment_paypal' },
];

const paymentMethods = computed(() => {
  if (!fiche.value) return [];
  return PAYMENT_METHODS.filter((p) => fiche.value[p.flag] === true).map((p) =>
    t(`fiche_page.${p.labelKey}`),
  );
});

const PERIODS = [
  { key: 'matin', ranges: [[360, 720]] },
  { key: 'midi', ranges: [[720, 840]] },
  {
    key: 'apres_midi',
    ranges: [[840, 1080]],
  },
  { key: 'soir', ranges: [[1080, 1320]] },
  {
    key: 'nuit',
    ranges: [
      [1320, 1440],
      [0, 360],
    ],
  },
];

const parseTime = (str) => {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
};

const segmentsOf = (range) => {
  const [s, e] = range.split('-').map(parseTime);
  if (e <= s)
    return [
      [s, 1440],
      [0, e],
    ];
  return [[s, e]];
};

const overlap = (a, b, c, d) => Math.max(a, c) < Math.min(b, d);

const periods = computed(() => {
  if (!schedule.value) return [];
  const matched = new Set();
  for (const time of Object.values(schedule.value.jours)) {
    if (!time) continue;
    const segs = segmentsOf(time);
    for (const period of PERIODS) {
      if (matched.has(period.key)) continue;
      if (segs.some((s) => period.ranges.some((r) => overlap(s[0], s[1], r[0], r[1])))) {
        matched.add(period.key);
      }
    }
  }
  return PERIODS.filter((p) => matched.has(p.key)).map((p) => t(`fiche_page.period_${p.key}`));
});

const categoryLabel = computed(() =>
  fiche.value ? t(`fiche_page.cat_${fiche.value.categorie}`) : '',
);

const tags = computed(() => {
  if (!fiche.value) return [];
  return [
    fiche.value.lieu,
    categoryLabel.value,
    t('fiche_page.age_label', { age: fiche.value.age }),
  ];
});

const CONTACT_CHIPS = [
  { target: 'site', flag: 'has_site', icon: '🌐', labelKey: 'action_site' },
  { target: 'menu', flag: 'has_menu', icon: '📋', labelKey: 'action_menu' },
  { target: 'phone', flag: 'has_phone', icon: '📞', labelKey: 'action_phone' },
  { target: 'email', flag: 'has_email', icon: '✉️', labelKey: 'action_email' },
];

const availableChips = computed(() => {
  if (!fiche.value) return [];
  return CONTACT_CHIPS.filter((chip) => fiche.value[chip.flag] === true);
});

const requireLogin = (target) => {
  openLoginRequired({ target, name: fiche.value?.nom });
};
const onPlaceholder = (key) => {
  alert(`${t(`fiche_page.${key}`)} ${t('common.sim_suffix')}`);
};
const goHome = () => router.push({ name: 'home' });
</script>

<template>
  <section v-if="!fiche" class="fp-not-found container">
    <p>{{ t('fiche_page.not_found') }}</p>
    <button type="button" class="pill-btn pill-btn--brand" @click="goHome">
      {{ t('fiche_page.back_home') }}
    </button>
  </section>

  <article v-else class="fp">
    <header class="fp-header">
      <div class="container">
        <div class="fp-title-row">
          <div class="fp-title-block">
            <h1 class="fp-title">{{ fiche.nom }}</h1>
            <span class="fp-verified" aria-hidden="true"
              >✓ {{ t('fiche_page.verified_page') }}</span
            >
          </div>
          <div class="fp-actions-top">
            <button type="button" class="fp-top-btn" @click="requireLogin('save')">
              <span class="fp-heart" aria-hidden="true">♡</span>
              {{ t('fiche_page.save_btn') }}
            </button>
            <button type="button" class="fp-top-btn" @click="onPlaceholder('add_review')">
              + {{ t('fiche_page.add_review') }}
            </button>
          </div>
        </div>

        <div class="fp-meta">
          <span class="fp-rating-stub" aria-hidden="true">
            <span class="fp-dots">
              <span v-for="i in 5" :key="i" class="dot"></span>
            </span>
            <span class="fp-reviews-count">({{ reviewCount }})</span>
          </span>
          <span class="fp-tags">
            <span v-for="(tag, i) in tags" :key="i" class="fp-tag">{{ tag }}</span>
          </span>
        </div>
      </div>
    </header>

    <section class="fp-gallery">
      <div class="container fp-gallery-grid">
        <div class="fp-photo-main" aria-label="Photo principale">
          <img v-if="fiche.photo" :src="fiche.photo" :alt="fiche.nom" />
          <span v-else class="fp-photo-empty">{{ t('fiche_page.thumb_main') }}</span>
        </div>
        <div class="fp-photo-thumbs">
          <div class="fp-thumb">
            <span>{{ t('fiche_page.thumb_interior') }}</span>
          </div>
          <div class="fp-thumb">
            <span>{{ t('fiche_page.thumb_ambiance') }}</span>
          </div>
          <div class="fp-thumb">
            <span>{{ t('fiche_page.thumb_more') }}</span>
          </div>
        </div>
      </div>
    </section>

    <nav class="fp-tabs" :aria-label="t('fiche_page.tab_presentation')">
      <div class="container fp-tabs-inner">
        <a href="#presentation">{{ t('fiche_page.tab_presentation') }}</a>
        <a href="#horaires">{{ t('fiche_page.tab_horaires') }}</a>
        <a href="#localisation">{{ t('fiche_page.tab_localisation') }}</a>
        <a href="#avis">{{ t('fiche_page.tab_avis') }}</a>
      </div>
    </nav>

    <main class="container fp-main">
      <div class="fp-left">
        <section id="presentation" class="fp-block">
          <h2 class="fp-block-title">{{ t('fiche_page.glance_title') }}</h2>
          <p class="fp-status">
            <span :class="['fp-status-tag', todayStatus.open ? 'open' : 'closed']">
              {{ todayStatus.label }}
            </span>
            <a href="#horaires">{{ t('fiche_page.see_all_horaires') }}</a>
          </p>
          <p class="fp-address">
            <span class="fp-icon" aria-hidden="true">📍</span>{{ fiche.lieu }}
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
              {{ t(`fiche_page.${chip.labelKey}`) }}
            </button>
          </div>
        </section>

        <section class="fp-block">
          <h2 class="fp-block-title">{{ t('fiche_page.about') }}</h2>
          <ul class="fp-descriptif">
            <li v-for="(line, i) in fiche.descriptif" :key="i">{{ line }}</li>
          </ul>
        </section>

        <section class="fp-block">
          <h3 class="fp-sub-title">{{ t('fiche_page.services_title') }}</h3>
          <ul v-if="services.length" class="fp-services">
            <li v-for="s in services" :key="s">
              <span class="fp-icon" aria-hidden="true">✓</span>{{ s }}
            </li>
          </ul>
          <p v-if="paymentMethods.length" class="fp-feature">
            <span class="fp-icon" aria-hidden="true">💳</span>
            <strong>{{ t('fiche_page.payment_title') }} :</strong>
            {{ paymentMethods.join(', ') }}
          </p>
          <p v-if="periods.length" class="fp-feature">
            <span class="fp-icon" aria-hidden="true">🕒</span>
            <strong>{{ t('fiche_page.meals_title') }} :</strong>
            {{ periods.join(', ') }}
          </p>
        </section>

        <section id="localisation" class="fp-block">
          <h2 class="fp-block-title">{{ t('fiche_page.localization_title') }}</h2>
          <div class="fp-map" aria-hidden="true">
            <span>{{ t('fiche_page.map_placeholder') }}</span>
          </div>
          <p class="fp-address">
            <span class="fp-icon" aria-hidden="true">📍</span>{{ fiche.lieu }}
          </p>
          <p class="fp-feature">
            <span class="fp-icon" aria-hidden="true">🅿️</span>{{ t('fiche_page.parking_info') }}
          </p>
        </section>

        <section id="avis" class="fp-block">
          <h2 class="fp-block-title">{{ t('fiche_page.reviews_title') }}</h2>
          <p v-if="reviewCount === 0" class="fp-empty">
            {{ t('fiche_page.no_reviews') }}
          </p>
          <p v-else>{{ t('fiche_page.reviews_count', { count: reviewCount }) }}</p>
        </section>
      </div>

      <aside class="fp-right">
        <div class="fp-side-block">
          <h3 class="fp-side-title">{{ t('fiche_page.save_title') }}</h3>
          <button
            type="button"
            class="pill-btn pill-btn--light fp-save-btn"
            @click="requireLogin('save')"
          >
            <span class="fp-heart" aria-hidden="true">♡</span>
            {{ t('fiche_page.save_btn') }}
          </button>
        </div>

        <div id="horaires" class="fp-side-block">
          <h3 class="fp-side-title">{{ t('fiche_page.hours_title') }}</h3>
          <p :class="['fp-status-tag', todayStatus.open ? 'open' : 'closed']">
            {{ todayStatus.label }}
          </p>
          <table class="fp-hours">
            <tbody>
              <tr v-for="d in orderedDays" :key="d.key" :class="{ today: d.isToday }">
                <th scope="row">{{ d.label }}</th>
                <td v-if="d.time">{{ d.time }}</td>
                <td v-else class="fp-closed-cell">{{ t('fiche_page.closed') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
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

.fp-gallery {
  background: var(--bg);
  padding: 16px 0;
}

.fp-gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
}

.fp-photo-main,
.fp-thumb {
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 14px;
}

.fp-photo-main {
  aspect-ratio: 16 / 9;
}

.fp-photo-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fp-photo-thumbs {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
}

.fp-thumb {
  min-height: 80px;
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

.fp-descriptif {
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
  height: 220px;
  background: var(--surface);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-weight: 700;
  margin-bottom: 12px;
}

.fp-empty {
  color: var(--text-muted);
  font-style: italic;
  margin: 0;
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

.fp-hours {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 10px;
}

.fp-hours th,
.fp-hours td {
  padding: 4px 0;
  text-align: left;
  font-weight: 600;
}

.fp-hours td {
  text-align: right;
  color: var(--text);
  font-weight: 500;
}

.fp-hours tr.today th,
.fp-hours tr.today td {
  color: var(--brand-dark);
  font-weight: 800;
}

.fp-closed-cell {
  color: var(--danger);
}

@media (max-width: 900px) {
  .fp-main {
    grid-template-columns: 1fr;
  }
  .fp-gallery-grid {
    grid-template-columns: 1fr;
  }
  .fp-photo-thumbs {
    grid-template-rows: none;
    grid-template-columns: repeat(3, 1fr);
  }
  .fp-services {
    grid-template-columns: 1fr;
  }
  .fp-tabs {
    position: static;
  }
}
</style>
