<script setup>
const categories = [
  {
    label: 'Outdoors',
    img: 'https://images.unsplash.com/photo-1526491109672-74740652b963?w=600&q=60',
  },
  {
    label: 'Food',
    img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=60',
  },
  {
    label: 'Culture',
    img: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&q=60',
  },
  {
    label: 'Water',
    img: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=60',
  },
];
</script>

<template>
  <section class="section">
    <h2 class="section-title">Find things to do by interest</h2>
    <p class="section-subtitle">Whatever you're into, we've got it</p>
    <ul class="cat-grid">
      <li v-for="c in categories" :key="c.label" class="cat-card">
        <img :src="c.img" :alt="c.label" loading="lazy" />
        <span class="cat-label">{{ c.label }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.cat-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.cat-card {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.cat-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-label {
  position: absolute;
  left: 16px;
  bottom: 14px;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

@media (max-width: 900px) {
  .cat-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
