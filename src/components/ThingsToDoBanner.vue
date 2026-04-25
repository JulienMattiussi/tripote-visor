<script setup>
import { t } from '../i18n/store.js';

const onBook = () => alert(`${t('ttd.cta')} ${t('common.sim_suffix')}`);
</script>

<template>
  <section class="ttd-banner" :aria-label="t('ttd.aria')">
    <div class="ttd-image">
      <img
        src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&q=60"
        :alt="t('ttd.alt_image')"
        loading="lazy"
      />
      <span class="credit">@Eddie J.</span>
    </div>
    <div class="ttd-text">
      <h2>
        {{ t('ttd.headline_line1') }}<br />{{ t('ttd.headline_line2') }}<br />{{
          t('ttd.headline_line3')
        }}
      </h2>
      <p>{{ t('ttd.subtitle') }}</p>
      <button class="pill-btn pill-btn--dark" type="button" @click="onBook">
        {{ t('ttd.cta') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.ttd-banner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: var(--brand-light);
  border-radius: var(--radius);
  overflow: hidden;
  margin-top: 16px;
  min-height: 260px;
}

.ttd-image {
  position: relative;
}

.ttd-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.credit {
  position: absolute;
  left: 16px;
  bottom: 16px;
  background: var(--scrim);
  color: var(--on-dark);
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
}

.ttd-text {
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 14px;
}

.ttd-text h2 {
  font-size: 32px;
  margin: 0;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--text);
}

.ttd-text p {
  font-size: 15px;
  color: var(--text);
  margin: 0;
}

@media (max-width: 700px) {
  .ttd-banner {
    grid-template-columns: 1fr;
  }
  .ttd-text {
    padding: 28px 24px;
  }
  .ttd-text h2 {
    font-size: 24px;
  }
}
</style>
