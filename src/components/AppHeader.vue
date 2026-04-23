<script setup>
import { ref } from 'vue';

const navItems = [
  { label: 'Plan with AI', icon: 'sparkles', highlight: true },
  { label: 'Rewards' },
  { label: 'Discover' },
  { label: 'Review' },
  { label: 'Forums' },
];

const currency = ref('USD');
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <a href="#" class="logo" aria-label="Tripote-visor home">
        <svg class="logo-owl" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path d="M 2,13 C 3,3 13,13 13.5,1" fill="none" stroke="#d946ef" stroke-width="1.5" stroke-linecap="round" />
          <path d="M 30,13 C 29,3 19,13 18.5,1" fill="none" stroke="#d946ef" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="9.345" cy="17.336" r="4.462" fill="none" stroke="#d946ef" stroke-width="1.5" />
          <circle cx="9.345" cy="17.336" r="2.34" fill="#d946ef" />
          <circle cx="22.532" cy="17.336" r="4.462" fill="none" stroke="#d946ef" stroke-width="1.5" />
          <circle cx="22.532" cy="17.336" r="2.34" fill="#d946ef" />
          <circle cx="16" cy="29.5" r="0.6" fill="#d946ef" />
        </svg>
        <span class="logo-text">Tripote-visor</span>
      </a>

      <nav class="main-nav" aria-label="Primary">
        <ul>
          <li v-for="item in navItems" :key="item.label" :class="{ highlight: item.highlight }">
            <a href="#">
              <span v-if="item.highlight" class="sparkle" aria-hidden="true">✦</span>
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <div class="header-actions">
        <button class="currency-btn" type="button">
          <span class="flag" aria-hidden="true">🇺🇸</span>
          {{ currency }}
        </button>
        <button class="pill-btn pill-btn--dark sign-in" type="button">Sign in</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid var(--border);
  background: #fff;
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
  color: #6b1a4f;
}

.main-nav {
  flex: 1;
}

.main-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 4px;
  justify-content: center;
}

.main-nav li a {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.15s ease;
}

.main-nav li a:hover {
  background: var(--surface);
}

.main-nav li.highlight a {
  border: 1.5px solid var(--brand);
  color: var(--brand-dark);
}

.main-nav li.highlight a:hover {
  background: rgba(0, 170, 108, 0.08);
}

.sparkle {
  color: var(--brand);
  font-size: 12px;
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
  .main-nav {
    display: none;
  }
}
</style>
