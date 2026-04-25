<script setup>
import { ref, computed } from 'vue';
import { t } from '../i18n/store.js';

const favorites = ref({ 1: false, 2: false, 3: false });

const RAW_ARTICLES = [
  { id: 1, img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700&q=60' },
  { id: 2, img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=700&q=60' },
  { id: 3, img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=700&q=60' },
];

const articles = computed(() =>
  RAW_ARTICLES.map((a) => ({ ...a, title: t(`inspiration.item_${a.id}_title`) })),
);

const toggleFav = (id) => {
  favorites.value[id] = !favorites.value[id];
};
</script>

<template>
  <section class="section inspiration">
    <h2 class="section-title">{{ t('inspiration.title') }}</h2>
    <ul class="insp-grid">
      <li v-for="a in articles" :key="a.id" class="insp-card">
        <div class="thumb">
          <img :src="a.img" :alt="a.title" loading="lazy" />
          <button
            class="fav-btn"
            :aria-pressed="favorites[a.id]"
            :aria-label="favorites[a.id] ? t('experiences.fav_remove') : t('experiences.fav_add')"
            @click="toggleFav(a.id)"
          >
            <svg
              viewBox="0 0 24 24"
              :class="['heart', { filled: favorites[a.id] }]"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"
              />
            </svg>
          </button>
        </div>
        <h3 class="insp-title">{{ a.title }}</h3>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.inspiration {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 28px 24px;
  margin: 24px 0;
}

.insp-grid {
  list-style: none;
  margin: 12px 0 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.insp-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
}

.thumb {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.insp-card:hover .thumb img {
  transform: scale(1.03);
}

.fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
}

.heart {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--text);
  stroke-width: 2;
}

.heart.filled {
  fill: var(--danger);
  stroke: var(--danger);
}

.insp-title {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  line-height: 1.35;
}

@media (max-width: 800px) {
  .insp-grid {
    grid-template-columns: 1fr;
  }
}
</style>
