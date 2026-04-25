<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  t,
  openLoginRequired,
  formatLieu,
  reviewCountFor,
  reviewAverageFor,
} from '../i18n/store.js';
import fichesData from '../data/fiches.json';

const route = useRoute();
const router = useRouter();

const PER_SECTION = 6;
const CATEGORIES = ['hotel', 'ruelle', 'parc'];
const CATEGORIE_TO_ROUTE = { hotel: 'hotels', ruelle: 'alleys', parc: 'parks' };

const query = computed(() => (route.query.q ?? '').toString());

const matches = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return fichesData;
  return fichesData.filter(
    (f) =>
      f.nom.toLowerCase().includes(q) ||
      (f.ville ?? '').toLowerCase().includes(q) ||
      (f.lieu ?? '').toLowerCase().includes(q) ||
      [...(f.descriptif ?? []), ...(f.descriptif_en ?? [])].some((line) =>
        line.toLowerCase().includes(q),
      ),
  );
});

const matchesByCategory = computed(() => {
  const groups = { hotel: [], ruelle: [], parc: [] };
  for (const f of matches.value) {
    if (groups[f.categorie]) groups[f.categorie].push(f);
  }
  return groups;
});

const sections = computed(() =>
  CATEGORIES.map((cat) => {
    const all = matchesByCategory.value[cat] ?? [];
    return {
      categorie: cat,
      items: all.slice(0, PER_SECTION),
      totalCount: all.length,
      showAll: all.length > PER_SECTION,
    };
  }).filter((s) => s.items.length > 0),
);

const totalMatches = computed(() => matches.value.length);

const goFiche = (id) => {
  router.push({ name: 'fiche', params: { id } });
};
const goSection = (categorie) => {
  const name = CATEGORIE_TO_ROUTE[categorie];
  if (!name) return;
  const q = query.value ? { q: query.value } : {};
  router.push({ name, query: q });
};

const onSaveClick = (fiche) => {
  openLoginRequired({ target: 'save', name: fiche.nom });
};

const titleText = computed(() =>
  query.value ? t('search_page.title_with_query', { q: query.value }) : t('search_page.title_all'),
);

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
      :key="section.categorie"
      class="sr-section"
      :aria-label="t(`search_page.section_${section.categorie}`)"
    >
      <header class="sr-section-head">
        <h2 class="sr-section-title">
          {{ t(`search_page.section_${section.categorie}`) }}
        </h2>
        <button
          v-if="section.showAll"
          type="button"
          class="sr-show-all"
          @click="goSection(section.categorie)"
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
          <h3 class="sr-card-name">{{ f.nom }}</h3>
          <p class="sr-card-loc">{{ formatLieu(f) }}</p>
          <p class="sr-card-meta">
            {{
              t('search_page.card_meta', { age: f.age, cat: t(`fiche_page.cat_${f.categorie}`) })
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
