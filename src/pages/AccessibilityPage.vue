<script setup>
import { useRouter } from 'vue-router';
import { t } from '../i18n/store.js';

const router = useRouter();
const goHome = () => router.push({ name: 'home' });

// Each shield icon has the same outline path and a different glyph inside.
// `cx` and `cy` are pre-computed so all three line up vertically with the badge.
const SHIELD_OUTLINE = 'M10 4 H70 V40 C70 56 50 70 40 76 C30 70 10 56 10 40 Z';
</script>

<template>
  <section class="acc-hero" aria-hidden="true">
    <div class="acc-shields">
      <svg viewBox="0 0 80 80" class="acc-shield" :aria-label="t('acc_page.hero_aria_lock')">
        <path :d="SHIELD_OUTLINE" fill="none" stroke="#fff" stroke-width="2" />
        <circle cx="40" cy="38" r="11" fill="none" stroke="#fff" stroke-width="2" />
        <rect x="35" y="34" width="10" height="9" rx="1.5" fill="#fff" />
        <path d="M37 34 V31 a3 3 0 0 1 6 0 V34" fill="none" stroke="#fff" stroke-width="2" />
      </svg>

      <svg viewBox="0 0 80 80" class="acc-shield" :aria-label="t('acc_page.hero_aria_check')">
        <path :d="SHIELD_OUTLINE" fill="none" stroke="#fff" stroke-width="2" />
        <circle cx="40" cy="38" r="11" fill="none" stroke="#fff" stroke-width="2" />
        <path
          d="M34 38 L39 43 L47 33"
          fill="none"
          stroke="#fff"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>

      <svg viewBox="0 0 80 80" class="acc-shield" :aria-label="t('acc_page.hero_aria_user')">
        <path :d="SHIELD_OUTLINE" fill="none" stroke="#fff" stroke-width="2" />
        <circle cx="40" cy="38" r="11" fill="none" stroke="#fff" stroke-width="2" />
        <circle cx="40" cy="35" r="3" fill="#fff" />
        <path
          d="M33 44 a7 7 0 0 1 14 0"
          fill="none"
          stroke="#fff"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </div>
  </section>

  <main class="container acc-main">
    <h1 class="acc-title">{{ t('acc_page.hero_title') }}</h1>

    <p>{{ t('acc_page.intro') }}</p>

    <p>
      {{ t('acc_page.progress') }}
    </p>

    <p>{{ t('acc_page.ongoing') }}</p>

    <ul class="acc-links" aria-label="External references">
      <li>
        <a
          href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ t('acc_page.eaa_link') }}
        </a>
      </li>
      <li>
        <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">
          {{ t('acc_page.wcag_link') }}
        </a>
      </li>
    </ul>

    <button type="button" class="pill-btn pill-btn--brand acc-back" @click="goHome">
      {{ t('acc_page.back_home') }}
    </button>
  </main>
</template>

<style scoped>
.acc-hero {
  background: var(--brand-dark);
  padding: 32px 0 0 0;
  display: flex;
  justify-content: center;
}

.acc-shields {
  display: flex;
  gap: 80px;
  justify-content: center;
  align-items: flex-end;
  padding: 24px 16px 0 16px;
  max-width: 100%;
}

.acc-shield {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.acc-main {
  padding-top: 48px;
  padding-bottom: 64px;
  max-width: 720px;
}

.acc-title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 28px 0;
  color: var(--brand-dark);
}

.acc-main p {
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 18px 0;
  color: var(--text);
}

.acc-links {
  list-style: none;
  margin: 24px 0 32px 0;
  padding: 16px 20px;
  background: var(--surface);
  border-radius: var(--radius);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.acc-links a {
  color: var(--brand-dark);
  text-decoration: underline;
  font-weight: 600;
  font-size: 14px;
}

.acc-back {
  margin-top: 8px;
}

@media (max-width: 700px) {
  .acc-shields {
    gap: 32px;
  }
  .acc-shield {
    width: 84px;
    height: 84px;
  }
  .acc-title {
    font-size: 28px;
  }
}
</style>
