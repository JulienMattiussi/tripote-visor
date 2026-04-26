<script setup>
import { useRouter } from 'vue-router';
import { t } from '../../i18n/store.js';

const router = useRouter();
const onBook = () => router.push({ name: 'discover' });

const slides = ['/ttd/slide-1.jpg', '/ttd/slide-2.jpg', '/ttd/slide-3.jpg', '/ttd/slide-4.jpg'];
</script>

<template>
  <section class="ttd-banner" :aria-label="t('ttd.aria')">
    <div class="ttd-image">
      <div class="ttd-track" aria-hidden="true">
        <img :src="slides[0]" :alt="t('ttd.alt_image')" loading="lazy" />
        <img v-for="(src, i) in slides.slice(1)" :key="i" :src="src" alt="" loading="lazy" />
        <img :src="slides[0]" alt="" loading="lazy" />
      </div>
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
  overflow: hidden;
}

.ttd-track {
  position: absolute;
  inset: 0;
  display: flex;
  width: 500%;
  animation: ttd-slideshow 20s linear infinite;
}

.ttd-track img {
  width: 20%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
}

@keyframes ttd-slideshow {
  0%,
  22.5% {
    transform: translateX(0%);
  }
  25%,
  47.5% {
    transform: translateX(-20%);
  }
  50%,
  72.5% {
    transform: translateX(-40%);
  }
  75%,
  97.5% {
    transform: translateX(-60%);
  }
  100% {
    transform: translateX(-80%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ttd-track {
    animation: none;
    transform: translateX(0%);
  }
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
