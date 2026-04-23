<script setup>
import { onBeforeUnmount, watch } from 'vue';
import {
  locale,
  currency,
  modalOpen,
  modalTab,
  t,
  setLocale,
  setCurrency,
  closePreferences,
} from '../i18n/store.js';
import { regions, SUGGESTED_REGION } from '../i18n/regions.js';
import { currencies } from '../i18n/currencies.js';

const onBackdrop = (event) => {
  if (event.target === event.currentTarget) closePreferences();
};

const pickRegion = (region) => {
  if (!region.enabled) return;
  setLocale(region.locale);
};

const pickCurrency = (entry) => {
  if (!entry.enabled) return;
  setCurrency(entry.code);
};

const onKeydown = (event) => {
  if (event.key === 'Escape' && modalOpen.value) closePreferences();
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeydown);
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
}

watch(modalOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
});
</script>

<template>
  <div
    v-if="modalOpen"
    class="prefs-backdrop"
    role="dialog"
    aria-modal="true"
    :aria-label="t('prefs.title')"
    @click="onBackdrop"
  >
    <div class="prefs-panel">
      <button
        class="prefs-close"
        type="button"
        :aria-label="t('prefs.close')"
        @click="closePreferences"
      >
        ×
      </button>

      <h2 class="prefs-title">{{ t('prefs.title') }}</h2>

      <div class="prefs-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          :aria-selected="modalTab === 'region'"
          :class="['prefs-tab', { active: modalTab === 'region' }]"
          @click="modalTab = 'region'"
        >
          {{ t('prefs.tab_region') }}
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="modalTab === 'currency'"
          :class="['prefs-tab', { active: modalTab === 'currency' }]"
          @click="modalTab = 'currency'"
        >
          {{ t('prefs.tab_currency') }}
        </button>
      </div>

      <div class="prefs-scroll">
        <section v-if="modalTab === 'region'" class="prefs-section">
          <h3 class="prefs-subtitle">{{ t('prefs.suggested') }}</h3>
          <div class="prefs-grid suggested">
            <button
              type="button"
              :class="['prefs-item', { selected: locale === SUGGESTED_REGION.locale }]"
              @click="setLocale(SUGGESTED_REGION.locale)"
            >
              <span class="prefs-item-label">{{ SUGGESTED_REGION.country }}</span>
              <span class="prefs-item-sub">{{ SUGGESTED_REGION.language }}</span>
            </button>
          </div>

          <h3 class="prefs-subtitle">{{ t('prefs.choose_region') }}</h3>
          <div class="prefs-grid">
            <button
              v-for="region in regions"
              :key="region.code"
              type="button"
              :disabled="!region.enabled"
              :class="[
                'prefs-item',
                {
                  selected: region.enabled && region.locale === locale,
                  disabled: !region.enabled,
                },
              ]"
              @click="pickRegion(region)"
            >
              <span class="prefs-item-label">{{ region.country }}</span>
              <span class="prefs-item-sub">
                {{ region.enabled ? region.language : t('prefs.unavailable') }}
              </span>
            </button>
          </div>
        </section>

        <section v-else class="prefs-section">
          <h3 class="prefs-subtitle">{{ t('prefs.choose_currency') }}</h3>
          <div class="prefs-grid">
            <button
              v-for="entry in currencies"
              :key="entry.code"
              type="button"
              :disabled="!entry.enabled"
              :class="[
                'prefs-item',
                {
                  selected: entry.enabled && entry.code === currency,
                  disabled: !entry.enabled,
                },
              ]"
              @click="pickCurrency(entry)"
            >
              <span class="prefs-item-label">{{ entry.name }}</span>
              <span class="prefs-item-sub">
                {{ entry.enabled ? entry.code : t('prefs.unavailable') }}
              </span>
            </button>
          </div>
        </section>
      </div>

      <p class="prefs-footer">{{ t('prefs.footer') }}</p>
    </div>
  </div>
</template>

<style scoped>
.prefs-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.prefs-panel {
  background: var(--bg);
  border-radius: var(--radius);
  width: 100%;
  max-width: 1024px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}

.prefs-close {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 28px;
  line-height: 1;
  color: var(--text);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prefs-close:hover {
  background: var(--surface);
}

.prefs-title {
  font-size: 22px;
  font-weight: 800;
  margin: 24px 48px 0 36px;
  color: var(--brand-dark);
  letter-spacing: -0.01em;
}

.prefs-tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid var(--border);
  margin: 16px 36px 0 36px;
}

.prefs-tab {
  padding: 12px 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
}

.prefs-tab.active {
  color: var(--brand-dark);
  border-bottom-color: var(--brand);
}

.prefs-scroll {
  overflow-y: auto;
  padding: 24px 36px 12px 36px;
  flex: 1;
}

.prefs-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prefs-subtitle {
  font-size: 17px;
  font-weight: 800;
  margin: 8px 0 0 0;
  color: var(--text);
}

.prefs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px 24px;
  margin-bottom: 8px;
}

.prefs-grid.suggested {
  grid-template-columns: repeat(4, 1fr);
}

.prefs-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px 16px;
  border: 2px solid transparent;
  border-radius: var(--radius);
  text-align: left;
  background: var(--bg);
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.prefs-item:hover:not(.disabled) {
  background: var(--brand-tint);
}

.prefs-item.selected {
  border-color: var(--brand);
}

.prefs-item.disabled {
  cursor: not-allowed;
  color: var(--text-muted);
}

.prefs-item.disabled .prefs-item-label,
.prefs-item.disabled .prefs-item-sub {
  color: var(--text-muted);
  opacity: 0.7;
}

.prefs-item-label {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
}

.prefs-item-sub {
  font-size: 13px;
  color: var(--text-muted);
}

.prefs-footer {
  border-top: 1px solid var(--border);
  padding: 14px 36px;
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 800px) {
  .prefs-grid,
  .prefs-grid.suggested {
    grid-template-columns: repeat(2, 1fr);
  }
  .prefs-title {
    margin: 20px 48px 0 20px;
    font-size: 20px;
  }
  .prefs-tabs {
    margin: 14px 20px 0 20px;
  }
  .prefs-scroll {
    padding: 20px 20px 8px 20px;
  }
  .prefs-footer {
    padding: 12px 20px;
  }
}
</style>
