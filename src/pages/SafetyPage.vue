<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';
import SeriousNote from '../components/SeriousNote.vue';

const router = useRouter();
const goHome = () => router.push({ name: 'home' });

const BELIEFS = ['authenticity', 'voice', 'rules', 'fraud'];
const DETECT_BULLETS = ['b1', 'b2', 'b3', 'b4', 'b5'];
const SANCTION_BULLETS = ['b1', 'b2', 'b3', 'b4'];

const beliefs = computed(() =>
  BELIEFS.map((key) => ({
    key,
    title: t(`safety_page.belief_${key}_title`),
    body: t(`safety_page.belief_${key}_body`),
  })),
);

const detectBullets = computed(() => DETECT_BULLETS.map((k) => t(`safety_page.detect_${k}`)));
const sanctionBullets = computed(() => SANCTION_BULLETS.map((k) => t(`safety_page.sanction_${k}`)));
</script>

<template>
  <section class="sf-hero">
    <div class="container sf-hero-inner">
      <h1 class="sf-title">{{ t('safety_page.hero_title') }}</h1>
      <p class="sf-subtitle">{{ t('safety_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container sf-main">
    <article class="sf-document">
      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('safety_page.intro_title') }}</h2>
        <p class="sf-section-body">{{ t('safety_page.intro_body') }}</p>
      </section>

      <section v-for="b in beliefs" :key="b.key" class="sf-section sf-belief">
        <h3 class="sf-section-title">{{ b.title }}</h3>
        <p class="sf-section-body">{{ b.body }}</p>
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('safety_page.detect_title') }}</h2>
        <p class="sf-section-body">{{ t('safety_page.detect_intro') }}</p>
        <ul class="sf-bullets">
          <li v-for="(text, i) in detectBullets" :key="`detect-${i}`">{{ text }}</li>
        </ul>
      </section>

      <section class="sf-section">
        <h2 class="sf-section-title">{{ t('safety_page.sanction_title') }}</h2>
        <ul class="sf-bullets">
          <li v-for="(text, i) in sanctionBullets" :key="`sanction-${i}`">{{ text }}</li>
        </ul>
      </section>

      <section class="sf-section sf-limits">
        <h2 class="sf-section-title">{{ t('safety_page.limits_title') }}</h2>
        <p class="sf-section-body">{{ t('safety_page.limits_body') }}</p>
      </section>
    </article>

    <SeriousNote class="sf-serious" />

    <div class="sf-footer">
      <button type="button" class="pill-btn pill-btn--brand" @click="goHome">
        {{ t('safety_page.back_home') }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.sf-hero {
  background: var(--brand-dark);
  color: var(--on-dark);
  padding: 64px 0 40px;
}

.sf-hero-inner {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sf-title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0;
  line-height: 1.05;
}

.sf-subtitle {
  font-size: 16px;
  margin: 0;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.92);
  max-width: 640px;
}

.sf-main {
  padding-top: 40px;
  padding-bottom: 64px;
  max-width: 760px;
}

.sf-document {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 40px 48px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.sf-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sf-section-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: var(--brand-dark);
  letter-spacing: -0.005em;
}

.sf-section-body {
  font-size: 15px;
  line-height: 1.65;
  margin: 0;
  color: var(--text);
}

.sf-belief .sf-section-title {
  font-size: 16px;
}

.sf-bullets {
  margin: 4px 0 0 0;
  padding: 0 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
  line-height: 1.55;
  color: var(--text);
}

.sf-limits {
  border-top: 1px solid var(--border);
  padding-top: 22px;
  margin-top: 8px;
}

.sf-serious {
  margin-top: 32px;
}

.sf-footer {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

@media (max-width: 700px) {
  .sf-hero {
    padding: 48px 0 32px;
  }
  .sf-title {
    font-size: 30px;
  }
  .sf-document {
    padding: 28px 24px;
  }
  .sf-section-body,
  .sf-bullets {
    font-size: 14px;
  }
}
</style>
