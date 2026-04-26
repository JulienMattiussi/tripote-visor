<script setup>
import { onBeforeUnmount, watch } from 'vue';
import { t } from '../i18n/store.js';
import { cookieModalOpen, closeCookieModal } from '../state/modals.js';

const onBackdrop = (event) => {
  if (event.target === event.currentTarget) closeCookieModal();
};

const categories = [
  { key: 'strict', state: 'state_always', alwaysActive: true },
  { key: 'advertising', state: 'state_none' },
  { key: 'performance', state: 'state_none' },
  { key: 'functional', state: 'state_none' },
];

const onKeydown = (event) => {
  if (event.key === 'Escape' && cookieModalOpen.value) closeCookieModal();
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeydown);
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
}

watch(cookieModalOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
});
</script>

<template>
  <div
    v-if="cookieModalOpen"
    class="cm-backdrop"
    role="dialog"
    aria-modal="true"
    :aria-label="t('cookie_modal.title')"
    @click="onBackdrop"
  >
    <div class="cm-panel">
      <header class="cm-header">
        <div class="cm-logo" aria-hidden="true">
          <svg viewBox="0 0 32 32" fill="none">
            <path
              d="M 2,13 C 3,3 13,13 13.5,1"
              fill="none"
              stroke="var(--brand-dark)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M 30,13 C 29,3 19,13 18.5,1"
              fill="none"
              stroke="var(--brand-dark)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <circle
              cx="9.345"
              cy="17.336"
              r="4.462"
              fill="none"
              stroke="var(--brand-dark)"
              stroke-width="1.5"
            />
            <circle cx="9.345" cy="17.336" r="2.34" fill="var(--brand-dark)" />
            <circle
              cx="22.532"
              cy="17.336"
              r="4.462"
              fill="none"
              stroke="var(--brand-dark)"
              stroke-width="1.5"
            />
            <circle cx="22.532" cy="17.336" r="2.34" fill="var(--brand-dark)" />
            <circle cx="16" cy="29.5" r="0.6" fill="var(--brand-dark)" />
          </svg>
          <span class="cm-logo-text">Tripote-visor</span>
        </div>
      </header>

      <div class="cm-scroll">
        <h2 class="cm-title">{{ t('cookie_modal.title') }}</h2>
        <p class="cm-body">{{ t('cookie_modal.body') }}</p>

        <button type="button" class="cm-allow-all" @click="closeCookieModal">
          {{ t('cookie_modal.allow_all') }}
        </button>

        <h3 class="cm-manage-title">{{ t('cookie_modal.manage_title') }}</h3>

        <ul class="cm-cats">
          <li v-for="cat in categories" :key="cat.key" class="cm-cat">
            <span class="cm-cat-name">{{ t(`cookie_modal.cat_${cat.key}`) }}</span>
            <span :class="['cm-cat-state', { 'cm-cat-state--always': cat.alwaysActive }]">
              {{ t(`cookie_modal.${cat.state}`) }}
            </span>
          </li>
        </ul>
      </div>

      <footer class="cm-footer">
        <button type="button" class="cm-btn cm-btn--reject" @click="closeCookieModal">
          {{ t('cookie_modal.reject_all') }}
        </button>
        <button type="button" class="cm-btn cm-btn--confirm" @click="closeCookieModal">
          {{ t('cookie_modal.confirm') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.cm-backdrop {
  position: fixed;
  inset: 0;
  background: var(--scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 24px;
}

.cm-panel {
  background: var(--bg);
  border-radius: var(--radius);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow-modal);
  overflow: hidden;
}

.cm-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
}

.cm-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cm-logo svg {
  width: 28px;
  height: 28px;
}

.cm-logo-text {
  font-weight: 800;
  color: var(--brand-dark);
  font-size: 16px;
}

.cm-scroll {
  overflow-y: auto;
  padding: 24px;
  flex: 1;
}

.cm-title {
  font-size: 18px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: var(--text);
  line-height: 1.3;
}

.cm-body {
  font-size: 13px;
  color: var(--text);
  line-height: 1.55;
  margin: 0 0 16px 0;
}

.cm-allow-all {
  display: block;
  width: 100%;
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--brand-dark);
  color: var(--on-dark);
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 24px;
  cursor: pointer;
}

.cm-allow-all:hover {
  background: var(--brand-hover);
}

.cm-manage-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: var(--text);
}

.cm-cats {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.cm-cat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-top: 1px solid var(--border);
  font-size: 14px;
}

.cm-cat:last-child {
  border-bottom: 1px solid var(--border);
}

.cm-cat-name {
  font-weight: 700;
  color: var(--text);
}

.cm-cat-state {
  font-weight: 700;
  color: var(--brand-dark);
  white-space: nowrap;
  font-size: 13px;
}

.cm-cat-state--always {
  color: var(--brand);
}

.cm-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cm-btn {
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.cm-btn--reject {
  background: var(--brand-dark);
  color: var(--on-dark);
}

.cm-btn--reject:hover {
  background: var(--brand-hover);
}

.cm-btn--confirm {
  background: var(--brand-dark);
  color: var(--on-dark);
}

.cm-btn--confirm:hover {
  background: var(--brand-hover);
}

@media (max-width: 600px) {
  .cm-footer {
    flex-direction: column;
  }
  .cm-btn {
    width: 100%;
  }
}
</style>
