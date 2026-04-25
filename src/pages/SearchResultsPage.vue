<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { t, openLoginRequired } from '../i18n/store.js';
import fichesData from '../data/fiches.json';

const route = useRoute();
const router = useRouter();

const PER_SECTION = 6;
const CATEGORIES = ['hotel', 'ruelle', 'parc'];

const query = computed(() => (route.query.q ?? '').toString());
const filterCat = computed(() => {
  const c = (route.query.categorie ?? '').toString();
  return CATEGORIES.includes(c) ? c : null;
});

const matches = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return fichesData;
  return fichesData.filter(
    (f) =>
      f.nom.toLowerCase().includes(q) ||
      f.lieu.toLowerCase().includes(q) ||
      (f.descriptif ?? []).some((line) => line.toLowerCase().includes(q)),
  );
});

const matchesByCategory = computed(() => {
  const groups = { hotel: [], ruelle: [], parc: [] };
  for (const f of matches.value) {
    if (groups[f.categorie]) groups[f.categorie].push(f);
  }
  return groups;
});

const sections = computed(() => {
  if (filterCat.value) {
    const items = matchesByCategory.value[filterCat.value] ?? [];
    return items.length
      ? [{ categorie: filterCat.value, items, totalCount: items.length, showAll: false }]
      : [];
  }
  return CATEGORIES.map((cat) => {
    const all = matchesByCategory.value[cat] ?? [];
    return {
      categorie: cat,
      items: all.slice(0, PER_SECTION),
      totalCount: all.length,
      showAll: all.length > PER_SECTION,
    };
  }).filter((s) => s.items.length > 0);
});

const totalMatches = computed(() => matches.value.length);

const goFiche = (id) => {
  router.push({ name: 'fiche', params: { id } });
};
const goSection = (categorie) => {
  router.push({ name: 'search', query: { ...route.query, categorie } });
};
const goGlobal = () => {
  const q = { ...route.query };
  delete q.categorie;
  router.push({ name: 'search', query: q });
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
      <button v-if="filterCat" type="button" class="sr-back" @click="goGlobal">
        ← {{ t('search_page.back_to_global') }}
      </button>
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
          <div class="sr-photo" aria-hidden="true">
            <button
              type="button"
              class="sr-heart"
              :aria-label="t('search_page.save_aria')"
              @click.stop="onSaveClick(f)"
            >
              <span class="sr-heart-icon">♡</span>
            </button>
          </div>
          <h3 class="sr-card-name">{{ f.nom }}</h3>
          <p class="sr-card-loc">{{ f.lieu }}</p>
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

.sr-back {
  align-self: flex-start;
  margin-top: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--surface);
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.sr-back:hover {
  background: var(--brand-tint);
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
