<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';

const router = useRouter();

const SECTION_KEYS = [
  'listing',
  'ranking',
  'tc',
  'revenue',
  'moderation',
  'publication',
  'incentives',
  'ai',
  'role',
];

const sections = computed(() =>
  SECTION_KEYS.map((key) => ({
    key,
    title: t(`how_page.section_${key}_title`),
    body: t(`how_page.section_${key}_body`),
  })),
);

const goHome = () => router.push({ name: 'home' });
</script>

<template>
  <section class="how-hero">
    <div class="container">
      <h1 class="how-hero-title">{{ t('how_page.hero_title') }}</h1>
      <p class="how-hero-subtitle">{{ t('how_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container how-main">
    <article v-for="section in sections" :key="section.key" class="how-section">
      <h2>{{ section.title }}</h2>
      <p>{{ section.body }}</p>
    </article>

    <aside class="how-parody" role="note">
      <span class="how-parody-icon" aria-hidden="true">ⓘ</span>
      <p>{{ t('how_page.parody_note') }}</p>
    </aside>

    <button type="button" class="pill-btn pill-btn--brand how-back" @click="goHome">
      {{ t('how_page.back_home') }}
    </button>
  </main>
</template>

<style scoped>
.how-hero {
  background: var(--surface-alt);
  padding: 56px 0 28px;
}

.how-hero-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 8px 0;
  color: var(--brand-dark);
}

.how-hero-subtitle {
  font-size: 15px;
  margin: 0;
  color: var(--text);
  max-width: 760px;
  line-height: 1.55;
}

.how-main {
  padding-top: 40px;
  padding-bottom: 64px;
  max-width: 780px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.how-section h2 {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: var(--brand-dark);
}

.how-section p {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  color: var(--text);
}

.how-parody {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 16px 20px;
  background: var(--brand-tint);
  border-radius: var(--radius);
  color: var(--brand-dark);
}

.how-parody-icon {
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  margin-top: 2px;
}

.how-parody p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.how-back {
  align-self: flex-start;
}
</style>
