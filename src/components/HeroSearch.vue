<script setup>
import { ref, computed } from 'vue';
import { t } from '../i18n/store.js';

const tabs = computed(() => [
  { id: 'all', label: t('hero.tab_all'), icon: '🔎' },
  { id: 'hotels', label: t('hero.tab_hotels'), icon: '🛏️' },
  { id: 'things', label: t('hero.tab_things'), icon: '🌳' },
  { id: 'alleys', label: t('hero.tab_alleys'), icon: '🛣️' },
]);

const activeTab = ref('all');
const query = ref('');

const placeholderKeyMap = {
  all: 'hero.placeholder_all',
  hotels: 'hero.placeholder_hotels',
  things: 'hero.placeholder_things',
  alleys: 'hero.placeholder_alleys',
};
const placeholder = computed(() => t(placeholderKeyMap[activeTab.value]));

const onSubmit = (e) => {
  e.preventDefault();
  if (!query.value.trim()) return;
  alert(`${t('hero.search_btn')} (${activeTab.value}): ${query.value}`);
};
</script>

<template>
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">{{ t('hero.title') }}</h1>

      <div class="tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          role="tab"
          :aria-selected="activeTab === tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon" aria-hidden="true">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <form class="search-form" @submit="onSubmit">
        <div class="search-input-wrap">
          <span class="search-icon" aria-hidden="true">🔍</span>
          <input
            v-model="query"
            type="text"
            :placeholder="placeholder"
            :aria-label="t('hero.search_aria')"
          />
        </div>
        <button type="submit" class="pill-btn pill-btn--brand search-btn">
          {{ t('hero.search_btn') }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 48px 0 24px;
  background: var(--bg);
}

.hero-title {
  text-align: center;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 24px 0;
  color: var(--brand-dark);
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text);
  transition: background 0.15s ease;
}

.tab:hover {
  background: var(--surface);
}

.tab.active {
  background: var(--bg);
  border-bottom: 3px solid var(--brand-dark);
  border-radius: 0;
  padding-bottom: 7px;
}

.tab-icon {
  font-size: 16px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 760px;
  margin: 0 auto;
  border: 1.5px solid var(--text);
  border-radius: 999px;
  padding: 6px 6px 6px 18px;
  background: var(--bg);
  box-shadow: var(--shadow);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.search-icon {
  font-size: 16px;
  color: var(--text-muted);
}

.search-form input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 10px 0;
  font-family: inherit;
}

.search-btn {
  padding: 12px 28px;
  font-size: 15px;
}
</style>
