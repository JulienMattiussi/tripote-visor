<script setup>
const onSeeWinners = () => alert('See winners — simulation front seulement');
</script>

<template>
  <section class="tc">
    <div class="container tc-inner">
      <div class="tc-copy">
        <div class="tc-badge" aria-hidden="true">
          <span class="tc-badge-year">2026</span>
        </div>
        <h2 class="tc-title">Travelers' Choice Awards Best of the Best</h2>
        <p class="tc-sub">
          Among our top 1% of places, stays, eats, and experiences — decided by you.
        </p>
        <button class="pill-btn pill-btn--light" type="button" @click="onSeeWinners">
          See the winners
        </button>
      </div>

      <div class="tc-art" aria-hidden="true">
        <div class="shape shape-yellow"></div>
        <div class="shape shape-photo">
          <img
            src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&q=60"
            alt=""
            loading="lazy"
          />
        </div>
        <div class="shape shape-accent"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tc {
  background: var(--brand-dark);
  color: #fff;
  padding: 64px 0;
  margin-top: 32px;
}

.tc-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;
}

.tc-badge {
  width: 60px;
  height: 80px;
  background: var(--accent-yellow);
  border-radius: 8px 8px 30px 30px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 10px;
  margin-bottom: 18px;
}

.tc-badge-year {
  color: var(--brand-dark);
  font-weight: 900;
  font-size: 14px;
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
}

.shape-yellow {
  width: 180px;
  height: 180px;
  background: var(--accent-yellow);
  top: 0;
  left: 20%;
  z-index: 1;
}

.shape-photo {
  width: 280px;
  height: 280px;
  top: 50px;
  left: 35%;
  overflow: hidden;
  z-index: 2;
}

.shape-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shape-accent {
  width: 150px;
  height: 150px;
  background: var(--brand-light);
  bottom: 20px;
  right: 10%;
  z-index: 1;
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
  .shape-yellow {
    width: 120px;
    height: 120px;
  }
  .shape-photo {
    width: 200px;
    height: 200px;
    left: 28%;
    top: 30px;
  }
  .shape-accent {
    width: 110px;
    height: 110px;
  }
}
</style>
