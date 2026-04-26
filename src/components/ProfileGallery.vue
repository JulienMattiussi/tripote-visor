<script setup>
import { t } from '../i18n/store.js';

defineProps({
  profile: { type: Object, required: true },
});
</script>

<template>
  <section class="fp-gallery">
    <div class="container fp-gallery-grid">
      <div class="fp-photo-main" :aria-label="t('profile_page.thumb_main')">
        <img v-if="profile.photo" :src="profile.photo" :alt="profile.name" />
        <span v-else class="fp-photo-empty">{{ t('profile_page.thumb_main') }}</span>
      </div>
      <div class="fp-photo-thumbs">
        <div class="fp-thumb">
          <span>{{ t('profile_page.thumb_interior') }}</span>
        </div>
        <div class="fp-thumb">
          <span>{{ t('profile_page.thumb_ambiance') }}</span>
        </div>
        <div class="fp-thumb">
          <span>{{ t('profile_page.thumb_more') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fp-gallery {
  background: var(--bg);
  padding: 16px 0;
}

.fp-gallery-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
}

.fp-photo-main,
.fp-thumb {
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-weight: 700;
  font-size: 14px;
}

.fp-photo-main {
  aspect-ratio: 16 / 9;
}

.fp-photo-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fp-photo-thumbs {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 8px;
}

.fp-thumb {
  min-height: 80px;
}

@media (max-width: 900px) {
  .fp-gallery-grid {
    grid-template-columns: 1fr;
  }
  .fp-photo-thumbs {
    grid-template-rows: none;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
