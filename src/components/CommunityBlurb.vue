<script setup>
import { t } from '../i18n/store.js';
</script>

<template>
  <section class="blurb">
    <h2>{{ t('community.title') }}</h2>
    <p>{{ t('community.body') }}</p>
  </section>
</template>

<style scoped>
.blurb {
  padding: 40px 0;
  max-width: 900px;
}

.blurb h2 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: var(--brand-dark);
}

.blurb p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text);
  margin: 0;
}
</style>
