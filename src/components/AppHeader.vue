<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { t, currency, currencyFlag, openPreferences, openSignin } from '../i18n/store.js';

const SCROLL_THRESHOLD = 220;

const scrolled = ref(false);
const compactQuery = ref('');

const fullNavItems = computed(() => [
  { key: 'plan_ai', label: t('nav.plan_ai'), highlight: true },
  { key: 'rewards', label: t('nav.rewards') },
  { key: 'discover', label: t('nav.discover') },
  { key: 'review', label: t('nav.review') },
  { key: 'forums', label: t('nav.forums') },
]);

// In scrolled state the search bar takes the center, "Plan with AI" /
// "Rewards" hide, and "Forums" migrates to the category tabs row below —
// "Discover" and "Review" stay in the top bar as quick links.
const SCROLLED_NAV_KEYS = new Set(['discover', 'review']);
const navItems = computed(() =>
  scrolled.value
    ? fullNavItems.value.filter((item) => SCROLLED_NAV_KEYS.has(item.key))
    : fullNavItems.value,
);

const categoryTabs = computed(() => [
  { key: 'hotels', label: t('hero.tab_hotels') },
  { key: 'things', label: t('hero.tab_things') },
  { key: 'restaurants', label: t('hero.tab_restaurants') },
  { key: 'cruises', label: t('hero.tab_cruises') },
  { key: 'forums', label: t('nav.forums') },
]);

const onScroll = () => {
  scrolled.value = (window.scrollY || window.pageYOffset || 0) > SCROLL_THRESHOLD;
};

const onCompactSubmit = (e) => {
  e.preventDefault();
  if (!compactQuery.value.trim()) return;
  alert(`${t('hero.search_btn')}: ${compactQuery.value}`);
};

onMounted(() => {
  if (typeof window === 'undefined') return;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="container header-inner">
      <a href="#" class="logo" :aria-label="t('nav.logo_aria')">
        <svg class="logo-owl" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M 2,13 C 3,3 13,13 13.5,1"
            fill="none"
            stroke="var(--brand)"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M 30,13 C 29,3 19,13 18.5,1"
            fill="none"
            stroke="var(--brand)"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <circle
            cx="9.345"
            cy="17.336"
            r="4.462"
            fill="none"
            stroke="var(--brand)"
            stroke-width="1.5"
          />
          <circle cx="9.345" cy="17.336" r="2.34" fill="var(--brand)" />
          <circle
            cx="22.532"
            cy="17.336"
            r="4.462"
            fill="none"
            stroke="var(--brand)"
            stroke-width="1.5"
          />
          <circle cx="22.532" cy="17.336" r="2.34" fill="var(--brand)" />
          <circle cx="16" cy="29.5" r="0.6" fill="var(--brand)" />
        </svg>
        <span class="logo-text">Tripote-visor</span>
      </a>

      <form v-if="scrolled" class="compact-search" @submit="onCompactSubmit">
        <span class="compact-search-icon" aria-hidden="true">🔍</span>
        <input
          v-model="compactQuery"
          type="text"
          :placeholder="t('hero.compact_placeholder')"
          :aria-label="t('hero.search_aria')"
        />
      </form>

      <nav class="main-nav" :aria-label="t('nav.primary_aria')">
        <ul>
          <li v-for="item in navItems" :key="item.key" :class="{ highlight: item.highlight }">
            <a href="#">
              <span v-if="item.highlight" class="sparkle" aria-hidden="true">✦</span>
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <button
          class="currency-btn"
          type="button"
          :aria-label="t('nav.currency_aria')"
          @click="openPreferences('region')"
        >
          <span class="flag" aria-hidden="true">{{ currencyFlag() }}</span>
          {{ currency }}
        </button>
        <button class="pill-btn pill-btn--dark sign-in" type="button" @click="openSignin">
          {{ t('nav.sign_in') }}
        </button>
      </div>
    </div>

    <div v-if="scrolled" class="category-tabs-row">
      <div class="container">
        <nav class="category-nav" :aria-label="t('nav.primary_aria')">
          <ul>
            <li v-for="tab in categoryTabs" :key="tab.key">
              <a href="#">{{ tab.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid var(--border);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 18px;
  letter-spacing: -0.02em;
  flex-shrink: 0;
}

.logo-owl {
  width: 32px;
  height: 32px;
}

.logo-text {
  color: var(--brand-dark);
}

.main-nav {
  flex: 1;
}

.site-header.scrolled .main-nav {
  flex: 0 0 auto;
}

.site-header.scrolled .main-nav ul {
  justify-content: flex-end;
}

.main-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 4px;
  justify-content: center;
}

.main-nav li a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.15s ease;
}

.main-nav li a:hover {
  background: var(--surface);
}

.main-nav li.highlight a {
  border: 1.5px solid var(--brand);
  color: var(--brand-dark);
}

.main-nav li.highlight a:hover {
  background: var(--brand-tint);
}

.sparkle {
  color: var(--brand);
  font-size: 12px;
}

.compact-search {
  flex: 1;
  max-width: 520px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid var(--border);
  border-radius: 999px;
  padding: 6px 16px;
  background: var(--surface);
  transition: background 0.15s ease;
  animation: compact-search-in 0.2s ease;
}

.compact-search:hover,
.compact-search:focus-within {
  background: var(--bg);
  border-color: var(--text);
}

.compact-search-icon {
  font-size: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.compact-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  padding: 6px 0;
  font-family: inherit;
  color: var(--text);
}

@keyframes compact-search-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-tabs-row {
  border-top: 1px solid var(--border);
  background: var(--bg);
  animation: category-tabs-in 0.2s ease;
}

.category-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 32px;
}

.category-nav a {
  display: inline-block;
  padding: 12px 0;
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s ease;
}

.category-nav a:hover {
  border-bottom-color: var(--brand);
}

@keyframes category-tabs-in {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.currency-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
}

.currency-btn:hover {
  background: var(--surface);
}

.flag {
  font-size: 16px;
}

.sign-in {
  padding: 8px 18px;
}

@media (max-width: 900px) {
  .main-nav,
  .category-tabs-row {
    display: none;
  }
  .compact-search {
    max-width: none;
  }
}
</style>
