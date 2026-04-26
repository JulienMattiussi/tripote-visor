<script setup>
import { computed, onBeforeUnmount, watch } from 'vue';
import { t } from '../../i18n/store.js';
import {
  loginRequiredOpen,
  loginRequiredContext,
  closeLoginRequired,
  openSignin,
} from '../../state/modals.js';

const message = computed(() => {
  const ctx = loginRequiredContext.value;
  const name = ctx.name ?? '';
  if (ctx.target === 'save') {
    return t('login_required_modal.message_save', { name });
  }
  if (ctx.target === 'publish_review') {
    return t('login_required_modal.message_publish_review', { name });
  }
  if (ctx.target === 'publish_photos') {
    return t('login_required_modal.message_publish_photos', { name });
  }
  if (ctx.target === 'add_place') {
    return t('login_required_modal.message_add_place', { name });
  }
  if (!ctx.target) return '';
  const target = t(`login_required_modal.target_${ctx.target}`);
  return t('login_required_modal.message', { target, name });
});

const onBackdrop = (event) => {
  if (event.target === event.currentTarget) closeLoginRequired();
};

const onSignin = () => {
  closeLoginRequired();
  openSignin();
};

const onKeydown = (event) => {
  if (!loginRequiredOpen.value) return;
  if (event.key === 'Escape') closeLoginRequired();
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeydown);
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
}

watch(loginRequiredOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
});
</script>

<template>
  <div
    v-if="loginRequiredOpen"
    class="lr-backdrop"
    role="dialog"
    aria-modal="true"
    :aria-label="t('login_required_modal.title_aria')"
    @click="onBackdrop"
  >
    <div class="lr-panel">
      <button
        type="button"
        class="lr-close"
        :aria-label="t('login_required_modal.close_aria')"
        @click="closeLoginRequired"
      >
        ×
      </button>
      <h2 class="lr-title">{{ t('login_required_modal.title') }}</h2>
      <p class="lr-message">{{ message }}</p>
      <div class="lr-actions">
        <button type="button" class="lr-cancel" @click="closeLoginRequired">
          {{ t('login_required_modal.cancel') }}
        </button>
        <button type="button" class="pill-btn pill-btn--brand lr-signin" @click="onSignin">
          {{ t('login_required_modal.signin_link') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lr-backdrop {
  position: fixed;
  inset: 0;
  background: var(--scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 24px;
}

.lr-panel {
  background: var(--bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-modal);
  width: 100%;
  max-width: 420px;
  padding: 32px 28px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lr-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface);
  font-size: 20px;
  line-height: 1;
  color: var(--text);
  font-family: inherit;
}

.lr-close:hover {
  background: var(--brand-tint);
}

.lr-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  color: var(--brand-dark);
}

.lr-message {
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
  color: var(--text);
}

.lr-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 6px;
}

.lr-cancel {
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--surface);
  font-weight: 700;
  font-size: 14px;
  color: var(--text);
  font-family: inherit;
}

.lr-cancel:hover {
  background: var(--brand-tint);
}

.lr-signin {
  padding: 10px 22px;
}
</style>
