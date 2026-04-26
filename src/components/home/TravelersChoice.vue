<script setup>
import { useRouter } from 'vue-router';
import { t } from '../../i18n/store.js';

const router = useRouter();
const onSeeWinners = () => router.push({ name: 'encounters' });
</script>

<template>
  <section class="tc">
    <div class="container tc-inner">
      <div class="tc-copy">
        <h2 class="tc-title">{{ t('tc.title') }}</h2>
        <p class="tc-sub">{{ t('tc.subtitle') }}</p>
        <button class="pill-btn pill-btn--light" type="button" @click="onSeeWinners">
          {{ t('tc.cta') }}
        </button>
      </div>

      <div class="tc-art" aria-hidden="true">
        <div class="shape shape--top">
          <img src="/articles/boulogne.jpg" alt="" loading="lazy" />
        </div>
        <div class="shape shape--main">
          <img src="/articles/mimi.jpg" alt="" loading="lazy" />
        </div>
        <div class="shape shape--bottom">
          <img src="/articles/moules.jpg" alt="" loading="lazy" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tc {
  background: var(--brand-dark);
  color: var(--on-dark);
  padding: 64px 0;
  margin-top: 32px;
}

.tc-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.tc-title {
  font-size: 40px;
  line-height: 1.1;
  margin: 0 0 16px 0;
  font-weight: 800;
  max-width: 480px;
  letter-spacing: -0.01em;
}

.tc-sub {
  font-size: 15px;
  margin: 0 0 24px 0;
  max-width: 440px;
  line-height: 1.4;
}

.tc-art {
  position: relative;
  height: 360px;
}

.shape {
  position: absolute;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.shape img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.shape--top {
  width: 180px;
  height: 180px;
  top: 0;
  left: 12%;
  z-index: 1;
}

.shape--main {
  width: 260px;
  height: 260px;
  top: 50px;
  left: 32%;
  z-index: 3;
}

.shape--bottom {
  width: 150px;
  height: 150px;
  bottom: 20px;
  right: 8%;
  z-index: 2;
}

@media (max-width: 800px) {
  .tc-inner {
    grid-template-columns: 1fr;
  }
  .tc-title {
    font-size: 28px;
  }
  .tc-art {
    height: 260px;
  }
  .shape--top {
    width: 120px;
    height: 120px;
  }
  .shape--main {
    width: 190px;
    height: 190px;
    left: 28%;
    top: 30px;
  }
  .shape--bottom {
    width: 110px;
    height: 110px;
  }
}
</style>
