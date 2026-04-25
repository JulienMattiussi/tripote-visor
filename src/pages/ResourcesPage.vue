<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';

const router = useRouter();
const goHome = () => router.push({ name: 'home' });

const POLICIES = ['privacy', 'tou', 'integrity', 'cookies'];

const policies = computed(() =>
  POLICIES.map((key) => ({
    key,
    title: t(`resources_page.${key}_title`),
    body: t(`resources_page.${key}_body`),
  })),
);

const journeyBullets = computed(() =>
  ['b1', 'b2', 'b3', 'b4', 'b5'].map((k) => t(`resources_page.review_journey_${k}`)),
);
</script>

<template>
  <section class="rs-hero">
    <div class="container rs-hero-inner">
      <h1 class="rs-title">{{ t('resources_page.hero_title') }}</h1>
      <p class="rs-subtitle">{{ t('resources_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container rs-main">
    <section class="rs-block">
      <h2 class="rs-block-title">{{ t('resources_page.partners_title') }}</h2>
      <p class="rs-block-body">{{ t('resources_page.partners_body') }}</p>
    </section>

    <section class="rs-block">
      <h2 class="rs-block-title">{{ t('resources_page.content_title') }}</h2>

      <article class="rs-sub">
        <h3 class="rs-sub-title">{{ t('resources_page.review_journey_title') }}</h3>
        <p class="rs-block-body">{{ t('resources_page.review_journey_intro') }}</p>
        <ul class="rs-bullets">
          <li v-for="(text, i) in journeyBullets" :key="`j-${i}`">{{ text }}</li>
        </ul>
      </article>

      <article class="rs-sub">
        <h3 class="rs-sub-title">{{ t('resources_page.transparency_title') }}</h3>
        <p class="rs-block-body">{{ t('resources_page.transparency_body') }}</p>
      </article>
    </section>

    <section class="rs-block">
      <h2 class="rs-block-title">{{ t('resources_page.policies_title') }}</h2>
      <dl class="rs-policies">
        <template v-for="p in policies" :key="p.key">
          <dt class="rs-policy-title">{{ p.title }}</dt>
          <dd class="rs-policy-body">{{ p.body }}</dd>
        </template>
      </dl>
    </section>

    <div class="rs-footer">
      <button type="button" class="pill-btn pill-btn--brand" @click="goHome">
        {{ t('resources_page.back_home') }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.rs-hero {
  background: var(--surface-alt);
  padding: 56px 0 28px;
}

.rs-hero-inner {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rs-title {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--brand-dark);
}

.rs-subtitle {
  font-size: 15px;
  margin: 0;
  color: var(--text);
  max-width: 720px;
  line-height: 1.55;
}

.rs-main {
  padding-top: 40px;
  padding-bottom: 64px;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.rs-block {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 32px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rs-block-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  color: var(--brand-dark);
  letter-spacing: -0.005em;
}

.rs-block-body {
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
  color: var(--text);
}

.rs-sub {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.rs-sub:first-of-type {
  border-top: none;
  padding-top: 0;
}

.rs-sub-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0;
  color: var(--text);
}

.rs-bullets {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
}

.rs-policies {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.rs-policy-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  margin: 0;
}

.rs-policy-body {
  margin: 4px 0 0 0;
  font-size: 14px;
  line-height: 1.55;
  color: var(--text);
}

.rs-footer {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

@media (max-width: 700px) {
  .rs-title {
    font-size: 28px;
  }
  .rs-block {
    padding: 24px 20px;
  }
}
</style>
