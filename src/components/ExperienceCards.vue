<script setup>
import { ref } from 'vue';

const experiences = ref([
  {
    id: 1,
    title: 'French Pastry and Dessert Walking Tour in Nancy with Local Guide',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=60',
    rating: 4.8,
    reviews: 73,
    price: 'from $72 per adult',
    favorite: false,
  },
  {
    id: 2,
    title: 'Self Guided Secrets Tour - Explore Nancy & Miss nothing',
    img: 'https://images.unsplash.com/photo-1509803874385-db7c23652552?w=600&q=60',
    rating: 4.9,
    reviews: 21,
    price: 'from $5 per group',
    favorite: false,
  },
  {
    id: 3,
    title: 'Art Nouveau visit to Nancy',
    img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=60',
    rating: 4.7,
    reviews: 3,
    price: 'from $16 per adult',
    favorite: false,
  },
  {
    id: 4,
    title: 'Nancy Private Walking Tour With a Professional Guide',
    img: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=600&q=60',
    rating: 4.7,
    reviews: 8,
    price: 'from $320 per group',
    favorite: false,
  },
]);

const toggleFav = (exp) => {
  exp.favorite = !exp.favorite;
};
</script>

<template>
  <section class="section experiences">
    <h2 class="section-title">Explore experiences near Nancy</h2>
    <p class="section-subtitle">Can't-miss picks near you</p>

    <div class="carousel">
      <ul class="exp-grid">
        <li v-for="exp in experiences" :key="exp.id" class="exp-card">
          <div class="thumb">
            <img :src="exp.img" :alt="exp.title" loading="lazy" />
            <button
              class="fav-btn"
              :aria-pressed="exp.favorite"
              :aria-label="exp.favorite ? 'Remove from favorites' : 'Add to favorites'"
              @click="toggleFav(exp)"
            >
              <svg
                viewBox="0 0 24 24"
                :class="['heart', { filled: exp.favorite }]"
                aria-hidden="true"
              >
                <path
                  d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z"
                />
              </svg>
            </button>
          </div>
          <h3 class="exp-title">{{ exp.title }}</h3>
          <div class="rating">
            <span class="stars" aria-hidden="true">
              <span
                v-for="i in 5"
                :key="i"
                :class="['dot', { filled: i <= Math.round(exp.rating) }]"
              ></span>
            </span>
            <span class="rating-num">{{ exp.rating.toFixed(1) }}</span>
            <span class="reviews">({{ exp.reviews }})</span>
          </div>
          <div class="price">{{ exp.price }}</div>
        </li>
      </ul>

      <button class="nav-arrow" type="button" aria-label="Next">›</button>
    </div>
  </section>
</template>

<style scoped>
.experiences {
  position: relative;
}

.carousel {
  position: relative;
}

.exp-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.exp-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

.thumb {
  position: relative;
  aspect-ratio: 4 / 3;
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

.exp-card:hover .thumb img {
  transform: scale(1.04);
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
  backdrop-filter: blur(2px);
}

.fav-btn:hover {
  background: #fff;
}

.heart {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #000;
  stroke-width: 2;
}

.heart.filled {
  fill: var(--danger);
  stroke: var(--danger);
}

.exp-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  margin: 4px 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.stars {
  display: inline-flex;
  gap: 2px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d9d9d9;
  display: inline-block;
}

.dot.filled {
  background: var(--brand);
}

.rating-num {
  font-weight: 700;
}

.reviews {
  color: var(--text-muted);
}

.price {
  font-size: 13px;
  color: var(--text-muted);
}

.nav-arrow {
  position: absolute;
  right: -16px;
  top: 40%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  box-shadow: var(--shadow-hover);
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.nav-arrow:hover {
  background: var(--surface);
}

@media (max-width: 900px) {
  .exp-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .nav-arrow {
    display: none;
  }
}
</style>
