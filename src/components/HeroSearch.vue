<script setup>
import { ref } from 'vue';

const tabs = [
  { id: 'all', label: 'Search All', icon: '🔎' },
  { id: 'hotels', label: 'Hotels', icon: '🏨' },
  { id: 'things', label: 'Things to Do', icon: '🎡' },
  { id: 'restaurants', label: 'Restaurants', icon: '🍽️' },
  { id: 'cruises', label: 'Cruises', icon: '🚢' },
];

const activeTab = ref('all');
const query = ref('');

const placeholder = {
  all: 'Places to go, things to do, hotels…',
  hotels: 'Where are you going?',
  things: 'Things to do, attractions, tours…',
  restaurants: 'Find restaurants, cuisines…',
  cruises: 'Search cruise lines, ports…',
};

const onSubmit = (e) => {
  e.preventDefault();
  if (!query.value.trim()) return;
  alert(`Recherche (${activeTab.value}): ${query.value}`);
};
</script>

<template>
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">Where to?</h1>

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
            :placeholder="placeholder[activeTab]"
            aria-label="Search"
          />
        </div>
        <button type="submit" class="pill-btn pill-btn--brand search-btn">Search</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 48px 0 24px;
  background: #fff;
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
  background: #fff;
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
  border: 1.5px solid #000;
  border-radius: 999px;
  padding: 6px 6px 6px 18px;
  background: #fff;
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
