<script setup>
import { computed } from 'vue';
import { t } from '../../i18n/store.js';

const props = defineProps({
  profile: { type: Object, required: true },
});

const THUMB_LABEL_KEYS = ['profile_page.thumb_interior', 'profile_page.thumb_ambiance'];

const thumbs = computed(() => {
  const photos = props.profile.secondary_photos ?? [];
  return THUMB_LABEL_KEYS.map((key, i) => ({ src: photos[i] ?? '', label: t(key) }));
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
        <div v-for="(thumb, i) in thumbs" :key="i" class="fp-thumb">
          <img v-if="thumb.src" :src="thumb.src" :alt="thumb.label" loading="lazy" />
          <span v-else>{{ thumb.label }}</span>
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
  grid-template-columns: 1fr 1fr;
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
  aspect-ratio: 1 / 1;
}

.fp-photo-main img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fp-photo-thumbs {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  aspect-ratio: 1 / 1;
}

.fp-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 900px) {
  .fp-gallery-grid {
    grid-template-columns: 1fr;
  }
  .fp-photo-thumbs {
    aspect-ratio: auto;
    grid-template-rows: none;
    grid-template-columns: 1fr 1fr;
  }
  .fp-thumb {
    aspect-ratio: 2 / 1;
  }
}
</style>
