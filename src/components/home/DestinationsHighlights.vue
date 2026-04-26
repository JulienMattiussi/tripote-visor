<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '../../i18n/store.js';
import { reviewAverageFor } from '../../lib/profiles.js';
import profilesData from '../../data/profiles.json';
import citiesData from '../../data/cities.json';

const TOP_CITIES = 6;
const PER_CITY = 3;

const router = useRouter();

const cityPhotoByName = Object.fromEntries(citiesData.map((c) => [c.name, (c.photo ?? '').trim()]));

const groupedByCity = computed(() => {
  const groups = new Map();
  for (const f of profilesData) {
    const city = (f.city ?? '').trim();
    if (!city) continue;
    if (!groups.has(city)) groups.set(city, []);
    groups.get(city).push(f);
  }
  return groups;
});

const hasPhoto = (city) => Boolean((cityPhotoByName[city] ?? '').trim());

const topCities = computed(() => {
  const entries = [...groupedByCity.value.entries()]
    .filter(([, list]) => list.length >= PER_CITY)
    .sort((a, b) => {
      const byCount = b[1].length - a[1].length;
      if (byCount !== 0) return byCount;
      const byPhoto = (hasPhoto(b[0]) ? 1 : 0) - (hasPhoto(a[0]) ? 1 : 0);
      if (byPhoto !== 0) return byPhoto;
      return a[0].localeCompare(b[0]);
    })
    .slice(0, TOP_CITIES);

  return entries.map(([name, list]) => ({
    name,
    photo: cityPhotoByName[name] ?? '',
    fiches: [...list]
      .sort(
        (a, b) => reviewAverageFor(b.id) - reviewAverageFor(a.id) || a.name.localeCompare(b.name),
      )
      .slice(0, PER_CITY),
  }));
});

const goFiche = (id) => {
  router.push({ name: 'profile', params: { id } });
};
</script>

<template>
  <section v-if="topCities.length" class="dh" :aria-label="t('dest_top.aria')">
    <h2 class="dh-title">{{ t('dest_top.title') }}</h2>
    <ul class="dh-grid">
      <li v-for="city in topCities" :key="city.name" class="dh-card">
        <div class="dh-thumb">
          <img v-if="city.photo" :src="city.photo" :alt="city.name" loading="lazy" />
        </div>
        <div class="dh-body">
          <h3 class="dh-city">{{ city.name }}</h3>
          <ul class="dh-fiches">
            <li v-for="f in city.fiches" :key="f.id">
              <button type="button" class="dh-chip" @click="goFiche(f.id)">
                {{ f.name }}
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.dh {
  margin-top: 8px;
}

.dh-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--brand-dark);
  margin: 0 0 16px 0;
}

.dh-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.dh-card {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 16px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px;
  align-items: stretch;
}

.dh-thumb {
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--brand-light), var(--surface-alt));
  overflow: hidden;
  box-shadow: var(--shadow);
}

.dh-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dh-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 4px 4px 0;
  min-width: 0;
}

.dh-city {
  font-size: 18px;
  font-weight: 800;
  color: var(--brand-dark);
  margin: 0;
}

.dh-fiches {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dh-chip {
  width: 100%;
  text-align: left;
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--bg);
  font-size: 13px;
  font-weight: 600;
  color: var(--brand-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: inherit;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.dh-chip:hover,
.dh-chip:focus-visible {
  background: var(--brand-tint);
  border-color: var(--brand);
  outline: none;
}

@media (max-width: 800px) {
  .dh-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .dh-card {
    grid-template-columns: 110px 1fr;
  }
}
</style>
