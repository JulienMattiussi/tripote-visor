<script setup>
import { ref, onBeforeUnmount, watch } from 'vue';
import { t } from '../../i18n/store.js';
import { signinOpen, signinScreen, closeSignin, goToSigninEmail } from '../../state/modals.js';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const error = ref(false);
const forgotEmail = ref('');
const forgotSent = ref(false);

const goToForgot = () => {
  forgotEmail.value = '';
  forgotSent.value = false;
  signinScreen.value = 'forgot';
};

const onBack = () => {
  signinScreen.value = signinScreen.value === 'forgot' ? 'email' : 'initial';
};

const onForgotSubmit = (e) => {
  e.preventDefault();
  if (!forgotEmail.value.trim()) return;
  forgotSent.value = true;
};

const onBackdrop = (event) => {
  if (event.target === event.currentTarget) closeSignin();
};

const onSubmit = (e) => {
  e.preventDefault();
  if (!email.value.trim() || !password.value.trim()) return;
  // Demo: no backend - every credential pair fails.
  error.value = true;
};

const onEmailInput = () => {
  error.value = false;
};
const onPasswordInput = () => {
  error.value = false;
};

const onKeydown = (event) => {
  if (!signinOpen.value) return;
  if (event.key === 'Escape') closeSignin();
};

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', onKeydown);
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
}

watch(signinOpen, (open) => {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = open ? 'hidden' : '';
  if (!open) {
    email.value = '';
    password.value = '';
    showPassword.value = false;
    error.value = false;
    forgotEmail.value = '';
    forgotSent.value = false;
  }
});

watch(signinScreen, (screen) => {
  error.value = false;
  if (screen !== 'forgot') {
    forgotSent.value = false;
  }
});
</script>

<template>
  <div
    v-if="signinOpen"
    class="si-backdrop"
    role="dialog"
    aria-modal="true"
    :aria-label="t('signin.initial_title')"
    @click="onBackdrop"
  >
    <div class="si-panel">
      <button
        v-if="signinScreen !== 'initial'"
        class="si-back"
        type="button"
        :aria-label="t('signin.back')"
        @click="onBack"
      >
        ‹
      </button>

      <button class="si-close" type="button" :aria-label="t('signin.close')" @click="closeSignin">
        ×
      </button>

      <div class="si-logo" aria-hidden="true">
        <svg viewBox="0 0 40 40" class="si-logo-svg">
          <path
            d="M 4,16 C 5,4 17,16 17,1"
            fill="none"
            stroke="var(--brand-dark)"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M 36,16 C 35,4 23,16 23,1"
            fill="none"
            stroke="var(--brand-dark)"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <circle cx="11" cy="22" r="6" fill="none" stroke="var(--brand-dark)" stroke-width="1.8" />
          <circle cx="11" cy="22" r="3" fill="var(--brand-dark)" />
          <circle cx="29" cy="22" r="6" fill="none" stroke="var(--brand-dark)" stroke-width="1.8" />
          <circle cx="29" cy="22" r="3" fill="var(--brand-dark)" />
          <circle cx="20" cy="35" r="0.9" fill="var(--brand-dark)" />
        </svg>
      </div>

      <div v-if="signinScreen === 'initial'" class="si-body">
        <h2 class="si-title">{{ t('signin.initial_title') }}</h2>

        <button class="si-provider" type="button" disabled aria-disabled="true">
          <svg viewBox="0 0 48 48" class="si-provider-icon" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.61 20.08H42V20H24v8h11.3C33.65 32.66 29.22 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 12.96 4 4 12.96 4 24s8.96 20 20 20 20-8.96 20-20c0-1.34-.14-2.65-.39-3.92z"
            />
            <path
              fill="#FF3D00"
              d="M6.31 14.69l6.57 4.82C14.66 15.11 18.97 12 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.31 14.69z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.17 0 9.86-1.98 13.41-5.19l-6.19-5.24C29.21 35.09 26.71 36 24 36c-5.2 0-9.62-3.32-11.28-7.95l-6.52 5.02C9.5 39.56 16.23 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.61 20.08H42V20H24v8h11.3c-.79 2.24-2.23 4.17-4.09 5.57l6.19 5.24C36.97 39.21 44 34 44 24c0-1.34-.14-2.65-.39-3.92z"
            />
          </svg>
          <span>{{ t('signin.continue_google') }}</span>
        </button>

        <button class="si-provider" type="button" @click="goToSigninEmail">
          <svg
            viewBox="0 0 24 24"
            class="si-provider-icon stroke"
            fill="none"
            stroke="var(--text)"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" />
          </svg>
          <span>{{ t('signin.continue_email') }}</span>
        </button>
      </div>

      <form v-else-if="signinScreen === 'email'" class="si-body" @submit="onSubmit">
        <h2 class="si-title">{{ t('signin.email_title') }}</h2>

        <label class="si-field">
          <span class="si-field-label">{{ t('signin.email_label') }}</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            :placeholder="t('signin.email_placeholder')"
            :aria-invalid="error"
            @input="onEmailInput"
          />
        </label>

        <label class="si-field">
          <span class="si-field-label">{{ t('signin.password_label') }}</span>
          <div class="si-password-wrap">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              :placeholder="t('signin.password_placeholder')"
              :aria-invalid="error"
              @input="onPasswordInput"
            />
            <button
              type="button"
              class="si-toggle"
              :aria-label="showPassword ? t('signin.hide_password') : t('signin.show_password')"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
        </label>

        <button type="button" class="si-forgot" @click="goToForgot">
          {{ t('signin.forgot_password') }}
        </button>

        <div v-if="error" class="si-error" role="alert">
          <span class="si-error-icon" aria-hidden="true">⚠</span>
          <span>{{ t('signin.error_invalid') }}</span>
        </div>

        <button type="submit" class="si-submit">{{ t('signin.submit') }}</button>
      </form>

      <section v-else class="si-body">
        <h2 class="si-title">{{ t('signin.forgot_title') }}</h2>
        <p class="si-forgot-body">{{ t('signin.forgot_body') }}</p>

        <form v-if="!forgotSent" @submit="onForgotSubmit">
          <label class="si-field">
            <span class="si-field-label">{{ t('signin.email_label') }}</span>
            <input
              v-model="forgotEmail"
              type="email"
              autocomplete="email"
              :placeholder="t('signin.email_placeholder')"
            />
          </label>
          <button type="submit" class="si-submit">{{ t('signin.forgot_submit') }}</button>
        </form>

        <div v-else class="si-success" role="status">
          <span class="si-success-icon" aria-hidden="true">✓</span>
          <span>{{ t('signin.forgot_success') }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.si-backdrop {
  position: fixed;
  inset: 0;
  background: var(--scrim);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.si-panel {
  background: var(--bg);
  border-radius: var(--radius);
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 40px 36px 28px 36px;
  box-shadow: var(--shadow-modal);
}

.si-close,
.si-back {
  position: absolute;
  top: 14px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 1;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
}

.si-close {
  right: 16px;
  font-size: 26px;
}

.si-back {
  left: 16px;
  font-size: 24px;
}

.si-close:hover,
.si-back:hover {
  background: var(--surface);
}

.si-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.si-logo-svg {
  width: 48px;
  height: 48px;
}

.si-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.si-title {
  font-size: 22px;
  font-weight: 800;
  text-align: center;
  margin: 0 0 8px 0;
  color: var(--brand-dark);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.si-provider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid var(--text);
  border-radius: 999px;
  font-weight: 700;
  font-size: 15px;
  background: var(--bg);
  color: var(--text);
}

.si-provider:hover {
  background: var(--surface);
}

.si-provider:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  background: var(--surface);
  border-color: var(--border);
  color: var(--text-muted);
}

.si-provider:disabled:hover {
  background: var(--surface);
}

.si-provider-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.si-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.si-field-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.si-field input {
  padding: 12px 14px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  background: var(--bg);
  outline: none;
  width: 100%;
}

.si-field input:focus {
  border-color: var(--brand);
}

.si-password-wrap {
  position: relative;
}

.si-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  line-height: 1;
  padding: 4px;
}

.si-forgot {
  align-self: flex-start;
  color: var(--brand-dark);
  font-size: 14px;
  font-weight: 700;
  text-decoration: underline;
}

.si-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--danger-tint);
  color: var(--danger);
  font-size: 14px;
  font-weight: 600;
}

.si-error-icon,
.si-success-icon {
  font-size: 16px;
  line-height: 1;
}

.si-forgot-body {
  font-size: 14px;
  color: var(--text);
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.si-success {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 8px;
  background: var(--brand-tint);
  color: var(--brand-dark);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

input[aria-invalid='true'] {
  border-color: var(--danger);
}

.si-submit {
  margin-top: 6px;
  padding: 14px 18px;
  border-radius: 999px;
  background: var(--brand-dark);
  color: var(--on-dark);
  font-weight: 700;
  font-size: 15px;
}

.si-submit:hover {
  background: var(--brand-hover);
}

@media (max-width: 500px) {
  .si-panel {
    padding: 40px 20px 20px 20px;
  }
  .si-title {
    font-size: 19px;
  }
}
</style>
