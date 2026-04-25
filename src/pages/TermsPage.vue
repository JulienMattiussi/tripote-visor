<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';
import SeriousNote from '../components/SeriousNote.vue';

const router = useRouter();
const goHome = () => router.push({ name: 'home' });

const SECTION_KEYS = ['1', '2', '3', '4', '5', '6'];

const sections = computed(() =>
  SECTION_KEYS.map((n) => ({
    key: n,
    title: t(`terms_page.section_${n}_title`),
    body: t(`terms_page.section_${n}_body`),
  })),
);
</script>

<template>
  <section class="tos-hero">
    <div class="container tos-hero-inner">
      <span class="tos-badge" aria-hidden="true">{{ t('terms_page.parody_badge') }}</span>
      <h1 class="tos-title">{{ t('terms_page.hero_title') }}</h1>
      <p class="tos-effective">{{ t('terms_page.hero_effective') }}</p>
      <p class="tos-subtitle">{{ t('terms_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container tos-main">
    <article class="tos-document">
      <section v-for="section in sections" :key="section.key" class="tos-section">
        <h2 class="tos-section-title">{{ section.title }}</h2>
        <p class="tos-section-body">{{ section.body }}</p>
      </section>
    </article>

    <SeriousNote class="tos-serious" />

    <div class="tos-footer">
      <button type="button" class="pill-btn pill-btn--brand" @click="goHome">
        {{ t('terms_page.back_home') }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.tos-hero {
  background: var(--brand-dark);
  color: var(--on-dark);
  padding: 72px 0 48px;
}

.tos-hero-inner {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tos-badge {
  align-self: flex-start;
  background: var(--accent-yellow);
  color: var(--brand-dark);
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 999px;
  margin-bottom: 4px;
}

.tos-title {
  font-size: 44px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0;
  line-height: 1.05;
}

.tos-effective {
  font-size: 13px;
  font-weight: 600;
  margin: 4px 0 0 0;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.tos-subtitle {
  font-size: 16px;
  margin: 12px 0 0 0;
  line-height: 1.55;
  max-width: 640px;
  color: rgba(255, 255, 255, 0.92);
}

.tos-main {
  padding-top: 48px;
  padding-bottom: 64px;
  max-width: 760px;
}

.tos-document {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px 48px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.tos-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tos-section-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: var(--brand-dark);
  letter-spacing: -0.005em;
}

.tos-section-body {
  font-size: 15px;
  line-height: 1.65;
  margin: 0;
  color: var(--text);
}

.tos-serious {
  margin-top: 32px;
}

.tos-footer {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

@media (max-width: 700px) {
  .tos-hero {
    padding: 48px 0 32px;
  }
  .tos-title {
    font-size: 32px;
  }
  .tos-document {
    padding: 28px 24px;
  }
  .tos-section-body {
    font-size: 14px;
  }
}
</style>
