<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { t } from '../i18n/store.js';
import { openLoginRequired } from '../state/modals.js';
import { formatLocation, reviewCountFor, reviewAverageFor } from '../lib/profiles.js';
import profilesData from '../data/profiles.json';
import { ageInBucket, ageBucketLabelKey } from '../lib/ageBuckets.js';

const route = useRoute();
const router = useRouter();

const PER_SECTION = 6;
const CATEGORIES = ['hotel', 'alley', 'park'];
const CATEGORY_TO_ROUTE = { hotel: 'hotels', alley: 'alleys', park: 'parks' };

const query = computed(() => (route.query.q ?? '').toString());
const ageBucket = computed(() => (route.query.age ?? '').toString());

const matches = computed(() => {
  const q = query.value.trim().toLowerCase();
  const bucket = ageBucket.value;
  return profilesData.filter((f) => {
    if (bucket && !ageInBucket(f.age, bucket)) return false;
    if (!q) return true;
    return (
      f.name.toLowerCase().includes(q) ||
      (f.city ?? '').toLowerCase().includes(q) ||
      (f.district ?? '').toLowerCase().includes(q) ||
      [...(f.description.fr ?? []), ...(f.description.en ?? [])].some((line) =>
        line.toLowerCase().includes(q),
      )
    );
  });
});

const matchesByCategory = computed(() => {
  const groups = { hotel: [], alley: [], park: [] };
  for (const f of matches.value) {
    if (groups[f.category]) groups[f.category].push(f);
  }
  return groups;
});

const sections = computed(() =>
  CATEGORIES.map((cat) => {
    const all = matchesByCategory.value[cat] ?? [];
    return {
      category: cat,
      items: all.slice(0, PER_SECTION),
      totalCount: all.length,
      showAll: all.length > PER_SECTION,
    };
  }).filter((s) => s.items.length > 0),
);

const totalMatches = computed(() => matches.value.length);

const goFiche = (id) => {
  router.push({ name: 'profile', params: { id } });
};
const goSection = (category) => {
  const name = CATEGORY_TO_ROUTE[category];
  if (!name) return;
  const q = query.value ? { q: query.value } : {};
  router.push({ name, query: q });
};

const onSaveClick = (profile) => {
  openLoginRequired({ target: 'save', name: profile.name });
};

const ageLabel = computed(() => {
  const key = ageBucketLabelKey(ageBucket.value);
  return key ? t(key) : '';
});

const titleText = computed(() => {
  if (query.value) return t('search_page.title_with_query', { q: query.value });
  if (ageLabel.value) return t('search_page.title_with_age', { age: ageLabel.value });
  return t('search_page.title_all');
});

const emptyText = computed(() =>
  query.value ? t('search_page.empty_for_query', { q: query.value }) : t('search_page.empty'),
);
</script>

<template>
  <main class="container sr">
    <header class="sr-head">
      <h1 class="sr-title">{{ titleText }}</h1>
      <p class="sr-count">{{ t('search_page.results_count', { count: totalMatches }) }}</p>
    </header>

    <p v-if="!sections.length" class="sr-empty">{{ emptyText }}</p>

    <section
      v-for="section in sections"
      :key="section.category"
      class="sr-section"
      :aria-label="t(`search_page.section_${section.category}`)"
    >
      <header class="sr-section-head">
        <h2 class="sr-section-title">
          {{ t(`search_page.section_${section.category}`) }}
        </h2>
        <button
          v-if="section.showAll"
          type="button"
          class="sr-show-all"
          @click="goSection(section.category)"
        >
          {{ t('search_page.show_all') }}
        </button>
      </header>

      <ul class="sr-grid">
        <li
          v-for="f in section.items"
          :key="f.id"
          class="sr-card"
          tabindex="0"
          role="link"
          @click="goFiche(f.id)"
          @keydown.enter="goFiche(f.id)"
        >
          <div class="sr-photo">
            <img v-if="f.photo" :src="f.photo" :alt="f.name" loading="lazy" />
            <button
              type="button"
              class="sr-heart"
              :aria-label="t('search_page.save_aria')"
              @click.stop="onSaveClick(f)"
            >
              <span class="sr-heart-icon">♡</span>
            </button>
            <div class="sr-rating-overlay" aria-hidden="true">
              <span class="sr-stars">
                <span
                  v-for="i in 5"
                  :key="i"
                  :class="['dot', { filled: i <= Math.round(reviewAverageFor(f.id)) }]"
                ></span>
              </span>
              <span class="sr-rating-num">
                {{ reviewCountFor(f.id) ? reviewAverageFor(f.id).toFixed(1) : '-' }}
              </span>
              <span class="sr-reviews">({{ reviewCountFor(f.id) }})</span>
            </div>
          </div>
          <h3 class="sr-card-name">{{ f.name }}</h3>
          <p class="sr-card-loc">{{ formatLocation(f) }}</p>
          <p class="sr-card-meta">
            {{
              t('search_page.card_meta', { age: f.age, cat: t(`profile_page.cat_${f.category}`) })
            }}
          </p>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.sr {
  padding: 32px 24px 64px;
}

.sr-head {
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sr-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--brand-dark);
  margin: 0;
}

.sr-count {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.sr-empty {
  font-size: 15px;
  color: var(--text-muted);
  background: var(--surface);
  border-radius: var(--radius);
  padding: 28px;
  text-align: center;
}

.sr-section {
  margin-bottom: 36px;
}

.sr-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 14px;
}

.sr-section-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  color: var(--text);
}

.sr-show-all {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-dark);
  text-decoration: underline;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
}

.sr-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.sr-card {
  background: var(--bg);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.sr-card:hover,
.sr-card:focus-visible {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  outline: none;
}

.sr-photo {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
}

.sr-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sr-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
  font-size: 16px;
  cursor: pointer;
}

.sr-heart-icon {
  color: var(--text);
}

.sr-card-name {
  margin: 8px 0 0;
  font-size: 15px;
  font-weight: 800;
  color: var(--brand-dark);
  line-height: 1.25;
}

.sr-card-loc {
  font-size: 13px;
  color: var(--text);
  margin: 0;
}

.sr-rating-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 18px 10px 8px;
  font-size: 12px;
  color: var(--on-dark);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}

.sr-stars {
  display: inline-flex;
  gap: 2px;
}

.sr-rating-overlay .dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  display: inline-block;
}

.sr-rating-overlay .dot.filled {
  background: var(--brand);
}

.sr-rating-num {
  font-weight: 700;
}

.sr-reviews {
  opacity: 0.85;
}

.sr-card-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 900px) {
  .sr-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .sr-grid {
    grid-template-columns: 1fr;
  }
}
</style>
