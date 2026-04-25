<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { t, currency, currencyFlag, openPreferences, openSignin } from '../i18n/store.js';

const router = useRouter();
const route = useRoute();

const onLogoClick = (event) => {
  if (route.path === '/') {
    event.preventDefault();
    if (typeof window !== 'undefined') window.location.reload();
  }
};

const SCROLL_THRESHOLD = 220;

const scrolled = ref(false);
const compactQuery = ref('');

const discoverMenuItems = computed(() => [
  { key: 'top', label: t('nav.discover_top'), to: { name: 'discover' } },
  { key: 'stories', label: t('nav.discover_stories'), to: { name: 'travel-stories' } },
]);

const reviewMenuItems = computed(() => [
  { key: 'write', label: t('nav.review_write'), to: { name: 'write-review' } },
  { key: 'photos', label: t('nav.review_photos'), to: { name: 'post-photos' } },
  { key: 'add_sex_worker', label: t('nav.review_add_place'), to: { name: 'add-sex-worker' } },
]);

const categoryTabs = computed(() => [
  { key: 'hotels', label: t('hero.tab_hotels'), to: { name: 'hotels' } },
  { key: 'things', label: t('hero.tab_things'), to: { name: 'parks' } },
  { key: 'alleys', label: t('hero.tab_alleys'), to: { name: 'alleys' } },
]);

const openMenu = ref(null);
const discoverMenuRef = ref(null);
const reviewMenuRef = ref(null);

const toggleMenu = (key) => {
  openMenu.value = openMenu.value === key ? null : key;
};

const onMenuItemClick = (entry) => {
  openMenu.value = null;
  router.push(entry.to);
};

const onDocClick = (event) => {
  if (!openMenu.value) return;
  const refMap = { discover: discoverMenuRef, review: reviewMenuRef };
  const wrapperEl = refMap[openMenu.value]?.value;
  if (wrapperEl && !wrapperEl.contains(event.target)) {
    openMenu.value = null;
  }
};

const onDocKeydown = (event) => {
  if (event.key === 'Escape' && openMenu.value) {
    openMenu.value = null;
  }
};

const onScroll = () => {
  scrolled.value = (window.scrollY || window.pageYOffset || 0) > SCROLL_THRESHOLD;
};

const onCompactSubmit = (e) => {
  e.preventDefault();
  const q = compactQuery.value.trim();
  if (!q) return;
  router.push({ name: 'search', query: { q } });
  compactQuery.value = '';
};

onMounted(() => {
  if (typeof window === 'undefined') return;
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onDocKeydown);
  onScroll();
});

onUnmounted(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onDocKeydown);
});
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="container header-inner">
      <router-link to="/" class="logo" :aria-label="t('nav.logo_aria')" @click="onLogoClick">
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
      </router-link>

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
          <li ref="discoverMenuRef" class="nav-menu-item">
            <button
              type="button"
              class="nav-menu-trigger"
              :class="{ active: openMenu === 'discover' }"
              :aria-expanded="openMenu === 'discover'"
              aria-haspopup="menu"
              @click.stop="toggleMenu('discover')"
            >
              {{ t('nav.discover') }}
            </button>
            <div
              v-if="openMenu === 'discover'"
              class="nav-dropdown"
              role="menu"
              :aria-label="t('nav.discover_menu_aria')"
            >
              <button
                v-for="entry in discoverMenuItems"
                :key="entry.key"
                type="button"
                role="menuitem"
                class="nav-dropdown-item"
                @click="onMenuItemClick(entry)"
              >
                {{ entry.label }}
              </button>
            </div>
          </li>
          <li ref="reviewMenuRef" class="nav-menu-item">
            <button
              type="button"
              class="nav-menu-trigger"
              :class="{ active: openMenu === 'review' }"
              :aria-expanded="openMenu === 'review'"
              aria-haspopup="menu"
              @click.stop="toggleMenu('review')"
            >
              {{ t('nav.review') }}
            </button>
            <div
              v-if="openMenu === 'review'"
              class="nav-dropdown"
              role="menu"
              :aria-label="t('nav.review_menu_aria')"
            >
              <button
                v-for="entry in reviewMenuItems"
                :key="entry.key"
                type="button"
                role="menuitem"
                class="nav-dropdown-item"
                @click="onMenuItemClick(entry)"
              >
                {{ entry.label }}
              </button>
            </div>
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
              <router-link :to="tab.to">{{ tab.label }}</router-link>
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
  background: var(--bg);
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

.nav-menu-item {
  position: relative;
}

.nav-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
  font-family: inherit;
  transition: background 0.15s ease;
}

.nav-menu-trigger:hover,
.nav-menu-trigger.active {
  background: var(--surface);
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  background: var(--bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-popover);
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  z-index: 200;
}

.nav-dropdown-item {
  text-align: left;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  font-family: inherit;
  transition: background 0.15s ease;
}

.nav-dropdown-item:hover {
  background: var(--surface);
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
