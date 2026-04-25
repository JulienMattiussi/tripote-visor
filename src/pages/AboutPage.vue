<script setup>
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';
import SeriousNote from '../components/SeriousNote.vue';

const router = useRouter();
const goHome = () => router.push({ name: 'home' });
</script>

<template>
  <section class="ab-hero">
    <div class="container ab-hero-inner">
      <h1 class="ab-title">{{ t('about_page.hero_title') }}</h1>
      <p class="ab-subtitle">{{ t('about_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container ab-main">
    <article class="ab-block">
      <h2 class="ab-block-title">{{ t('about_page.parody_title') }}</h2>
      <p class="ab-block-body">{{ t('about_page.parody_body') }}</p>
    </article>

    <SeriousNote class="ab-serious" />

    <div class="ab-footer">
      <button type="button" class="pill-btn pill-btn--brand" @click="goHome">
        {{ t('about_page.back_home') }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.ab-hero {
  background: var(--surface-alt);
  padding: 56px 0 32px;
}

.ab-hero-inner {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ab-title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--brand-dark);
  line-height: 1.05;
}

.ab-subtitle {
  font-size: 16px;
  margin: 0;
  line-height: 1.55;
  color: var(--text);
  max-width: 640px;
}

.ab-main {
  padding-top: 40px;
  padding-bottom: 64px;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.ab-block {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 36px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ab-block-title {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  color: var(--brand-dark);
  letter-spacing: -0.005em;
}

.ab-block-body {
  font-size: 15px;
  line-height: 1.65;
  margin: 0;
  color: var(--text);
}

.ab-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

@media (max-width: 700px) {
  .ab-title {
    font-size: 30px;
  }
  .ab-block {
    padding: 24px 20px;
  }
  .ab-block-body {
    font-size: 14px;
  }
}
</style>
