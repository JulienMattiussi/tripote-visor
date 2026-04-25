<script setup>
import { computed } from 'vue';
import { t, locale } from '../i18n/store.js';
import { STORIES } from '../data/travel-stories.js';

const featured = computed(() => STORIES.find((s) => s.featured));
const others = computed(() => STORIES.filter((s) => !s.featured));

const formatDate = (iso) => {
  const date = new Date(iso);
  return date.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const onRead = (story) => {
  alert(`${t(`ts_page.story_${story.key}_title`)} ${t('common.sim_suffix')}`);
};
</script>

<template>
  <section class="ts-hero">
    <div class="container">
      <h1 class="ts-hero-title">{{ t('ts_page.hero_title') }}</h1>
      <p class="ts-hero-subtitle">{{ t('ts_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container ts-main">
    <article v-if="featured" class="ts-featured" @click="onRead(featured)">
      <div class="ts-featured-image">
        <img :src="featured.image" :alt="t(`ts_page.story_${featured.key}_title`)" />
        <span class="ts-featured-label">{{ t('ts_page.featured_label') }}</span>
      </div>
      <div class="ts-featured-body">
        <span class="ts-cat">{{ t(`ts_page.cat_${featured.category_key}`) }}</span>
        <h2 class="ts-featured-title">
          {{ t(`ts_page.story_${featured.key}_title`) }}
        </h2>
        <p class="ts-featured-excerpt">
          {{ t(`ts_page.story_${featured.key}_excerpt`) }}
        </p>
        <div class="ts-meta">
          <span>{{ t('ts_page.by_author', { author: featured.author }) }}</span>
          <span class="ts-meta-sep" aria-hidden="true">·</span>
          <span>{{ formatDate(featured.date_iso) }}</span>
          <span class="ts-meta-sep" aria-hidden="true">·</span>
          <span>{{ t('ts_page.read_time', { minutes: featured.read_minutes }) }}</span>
        </div>
        <button
          type="button"
          class="pill-btn pill-btn--brand ts-read-btn"
          @click.stop="onRead(featured)"
        >
          {{ t('ts_page.read_article') }}
        </button>
      </div>
    </article>

    <ul class="ts-grid">
      <li v-for="story in others" :key="story.key" class="ts-card" @click="onRead(story)">
        <div class="ts-card-thumb">
          <img :src="story.image" :alt="t(`ts_page.story_${story.key}_title`)" loading="lazy" />
        </div>
        <span class="ts-cat">{{ t(`ts_page.cat_${story.category_key}`) }}</span>
        <h3 class="ts-card-title">{{ t(`ts_page.story_${story.key}_title`) }}</h3>
        <p class="ts-card-excerpt">{{ t(`ts_page.story_${story.key}_excerpt`) }}</p>
        <div class="ts-meta">
          <span>{{ t('ts_page.by_author', { author: story.author }) }}</span>
          <span class="ts-meta-sep" aria-hidden="true">·</span>
          <span>{{ t('ts_page.read_time', { minutes: story.read_minutes }) }}</span>
        </div>
      </li>
    </ul>

    <p class="ts-disclaimer">{{ t('ts_page.footer_note') }}</p>
  </main>
</template>

<style scoped>
.ts-hero {
  padding: 56px 0 24px;
  background: var(--surface-alt);
}

.ts-hero-title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 8px 0;
  color: var(--brand-dark);
}

.ts-hero-subtitle {
  font-size: 16px;
  margin: 0;
  color: var(--text);
  max-width: 640px;
  line-height: 1.5;
}

.ts-main {
  padding-top: 32px;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.ts-featured {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  background: var(--bg);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.ts-featured:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.ts-featured-image {
  position: relative;
  min-height: 320px;
  overflow: hidden;
}

.ts-featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ts-featured-label {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--brand);
  color: var(--on-dark);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 6px 12px;
  border-radius: 999px;
}

.ts-featured-body {
  padding: 32px 32px 32px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.ts-featured-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--brand-dark);
  margin: 0;
  line-height: 1.2;
}

.ts-featured-excerpt {
  font-size: 15px;
  color: var(--text);
  line-height: 1.5;
  margin: 0;
}

.ts-cat {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--brand);
}

.ts-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.ts-meta-sep {
  color: var(--text-muted);
}

.ts-read-btn {
  align-self: flex-start;
  margin-top: 8px;
}

.ts-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.ts-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  background: var(--bg);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.ts-card:hover {
  transform: translateY(-2px);
}

.ts-card-thumb {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.ts-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.ts-card:hover .ts-card-thumb img {
  transform: scale(1.04);
}

.ts-card-title {
  font-size: 17px;
  font-weight: 800;
  margin: 4px 0 0 0;
  color: var(--brand-dark);
  line-height: 1.3;
}

.ts-card-excerpt {
  font-size: 14px;
  color: var(--text);
  line-height: 1.45;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ts-disclaimer {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  margin: 32px 0 0 0;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .ts-featured {
    grid-template-columns: 1fr;
  }
  .ts-featured-body {
    padding: 24px;
  }
  .ts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .ts-grid {
    grid-template-columns: 1fr;
  }
  .ts-hero-title {
    font-size: 30px;
  }
}
</style>
