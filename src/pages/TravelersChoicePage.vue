<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { t, locale } from '../i18n/store.js';
import { TC_CATEGORIES } from '../data/travelers-choice.js';

const route = useRoute();
const router = useRouter();
const year = 2026;

const TABS = [{ key: 'all' }, { key: 'hotels' }, { key: 'restaurants' }, { key: 'things' }];
const TAB_KEYS = new Set(TABS.map((t) => t.key));

const activeTab = ref('all');

const syncFromRoute = () => {
  const param = route.params.category;
  activeTab.value = TAB_KEYS.has(param) ? param : 'all';
};

syncFromRoute();
watch(() => route.params.category, syncFromRoute);

const tabs = computed(() => TABS.map((tab) => ({ ...tab, label: t(`tc_page.tab_${tab.key}`) })));

const visibleCategories = computed(() =>
  activeTab.value === 'all'
    ? TC_CATEGORIES
    : TC_CATEGORIES.filter((cat) => cat.key === activeTab.value),
);

const onTabClick = (tabKey) => {
  router.push(
    tabKey === 'all'
      ? { name: 'travelers-choice' }
      : { name: 'travelers-choice-category', params: { category: tabKey } },
  );
};

const formatReviews = (count) => {
  const formatted = count.toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US');
  return t('tc_page.reviews_count', { count: formatted });
};

const scrollToTop = () => {
  if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <section class="tc-hero">
    <div class="container tc-hero-inner">
      <div class="tc-badge" aria-hidden="true">{{ year }}</div>
      <h1 class="tc-hero-title">{{ t('tc_page.hero_title', { year }) }}</h1>
      <p class="tc-hero-subtitle">{{ t('tc_page.hero_subtitle') }}</p>
      <div class="tc-hero-shapes" aria-hidden="true">
        <span class="shape shape-yellow"></span>
        <span class="shape shape-pink"></span>
      </div>
    </div>
  </section>

  <div class="container tc-intro-wrap">
    <p class="tc-intro">{{ t('tc_page.intro', { year }) }}</p>
  </div>

  <nav class="tc-tabs-row" aria-label="Travelers' Choice categories">
    <div class="container">
      <ul class="tc-tabs">
        <li v-for="tab in tabs" :key="tab.key">
          <button
            type="button"
            :class="['tc-tab', { active: activeTab === tab.key }]"
            :aria-pressed="activeTab === tab.key"
            @click="onTabClick(tab.key)"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <main class="container tc-main">
    <article v-for="cat in visibleCategories" :key="cat.key" :id="`cat-${cat.key}`" class="tc-cat">
      <header class="tc-cat-head">
        <div class="tc-cat-text">
          <h2 class="tc-cat-title">{{ t(`tc_page.cat_${cat.key}_title`) }}</h2>
          <p class="tc-cat-desc">{{ t(`tc_page.cat_${cat.key}_desc`) }}</p>
        </div>
        <img class="tc-cat-cover" :src="cat.cover" :alt="t(`tc_page.cat_${cat.key}_title`)" />
      </header>

      <ol class="tc-grid">
        <li v-for="winner in cat.winners" :key="winner.rank" class="tc-card">
          <div class="tc-card-thumb">
            <img :src="winner.image" :alt="winner.name" loading="lazy" />
            <span class="tc-rank-badge" aria-label="Rank">#{{ winner.rank }}</span>
          </div>
          <h3 class="tc-card-name">{{ winner.name }}</h3>
          <p class="tc-card-loc">{{ winner.location }}</p>
          <div class="tc-card-rating">
            <span class="tc-stars" aria-hidden="true">
              <span
                v-for="i in 5"
                :key="i"
                :class="['dot', { filled: i <= Math.round(winner.rating) }]"
              ></span>
            </span>
            <span class="tc-rating-num">{{ winner.rating.toFixed(1) }}</span>
            <span class="tc-reviews">({{ formatReviews(winner.reviews) }})</span>
          </div>
        </li>
      </ol>
    </article>

    <div class="tc-back-to-top">
      <button type="button" class="pill-btn pill-btn--brand" @click="scrollToTop">
        {{ t('tc_page.back_to_top') }}
      </button>
    </div>

    <p class="tc-disclaimer">{{ t('tc_page.footer_note') }}</p>
  </main>
</template>

<style scoped>
.tc-hero {
  position: relative;
  background: var(--brand-dark);
  color: var(--on-dark);
  padding: 64px 0 80px;
  overflow: hidden;
}

.tc-hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  max-width: 700px;
}

.tc-badge {
  background: var(--accent-yellow);
  color: var(--brand-dark);
  font-weight: 900;
  font-size: 18px;
  padding: 10px 16px;
  border-radius: 8px 8px 30px 30px;
  width: 70px;
  height: 90px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
}

.tc-hero-title {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0;
}

.tc-hero-subtitle {
  font-size: 16px;
  margin: 0;
  max-width: 540px;
  line-height: 1.5;
}

.tc-hero-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.tc-hero-shapes .shape {
  position: absolute;
  border-radius: 50%;
}

.tc-hero-shapes .shape-yellow {
  width: 220px;
  height: 220px;
  background: var(--accent-yellow);
  opacity: 0.95;
  top: -40px;
  right: 18%;
}

.tc-hero-shapes .shape-pink {
  width: 180px;
  height: 180px;
  background: var(--brand);
  opacity: 0.8;
  bottom: -30px;
  right: 6%;
}

.tc-intro-wrap {
  padding: 24px 24px 8px;
}

.tc-intro {
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  max-width: 760px;
  color: var(--text);
}

.tc-tabs-row {
  position: sticky;
  top: 64px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  z-index: 50;
  margin-top: 16px;
}

.tc-tabs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.tc-tab {
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  border-bottom: 3px solid transparent;
  white-space: nowrap;
  font-family: inherit;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.tc-tab:hover {
  color: var(--brand-dark);
}

.tc-tab.active {
  color: var(--brand-dark);
  border-bottom-color: var(--brand);
}

.tc-main {
  padding-top: 24px;
  padding-bottom: 64px;
}

.tc-cat {
  margin: 32px 0 56px;
  scroll-margin-top: 130px;
}

.tc-cat-head {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: center;
  margin-bottom: 24px;
}

.tc-cat-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tc-cat-title {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  color: var(--brand-dark);
  letter-spacing: -0.01em;
}

.tc-cat-desc {
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  color: var(--text);
}

.tc-cat-cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.tc-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.tc-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tc-card-thumb {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.tc-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tc-card:hover .tc-card-thumb img {
  transform: scale(1.04);
}

.tc-rank-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--brand);
  color: var(--on-dark);
  font-weight: 900;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: var(--shadow);
}

.tc-card-name {
  font-size: 15px;
  font-weight: 800;
  margin: 4px 0 0 0;
  color: var(--text);
  line-height: 1.3;
}

.tc-card-loc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.tc-card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.tc-stars {
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

.tc-rating-num {
  font-weight: 700;
}

.tc-reviews {
  color: var(--text-muted);
}

.tc-back-to-top {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

.tc-disclaimer {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  margin-top: 32px;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .tc-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .tc-cat-head {
    grid-template-columns: 1fr;
  }
  .tc-hero-title {
    font-size: 32px;
  }
}

@media (max-width: 600px) {
  .tc-grid {
    grid-template-columns: 1fr;
  }
}
</style>
