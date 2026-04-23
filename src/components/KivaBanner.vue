<script setup>
const onDonate = () => alert('Donate now — simulation front seulement');
</script>

<template>
  <section class="kiva" aria-label="Foundation promo">
    <div class="kiva-image">
      <img
        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=700&q=60"
        alt="Small business owner"
        loading="lazy"
      />
    </div>
    <div class="kiva-text">
      <div class="brand-tag">
        <span class="tag-icon" aria-hidden="true">◎</span>
        <span>Tripote-visor Foundation</span>
      </div>
      <h2>Show some love to small businesses</h2>
      <p>
        Donate to our partner today to provide loans to local entrepreneurs and the Tripote-visor
        Foundation will match it, up to $150,000 USD collectively. Terms apply.
      </p>
      <button class="pill-btn pill-btn--dark" type="button" @click="onDonate">Donate now</button>
    </div>
  </section>
</template>

<style scoped>
.kiva {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0;
  background: var(--surface-alt);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 24px 0;
  min-height: 220px;
}

.kiva-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.kiva-text {
  padding: 28px 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.brand-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.tag-icon {
  color: var(--brand);
  font-size: 14px;
}

.kiva-text h2 {
  font-size: 24px;
  margin: 0;
  font-weight: 800;
  color: var(--brand-dark);
}

.kiva-text p {
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
  color: var(--text);
  max-width: 620px;
}

.kiva-text .pill-btn {
  align-self: flex-start;
  margin-top: 8px;
}

@media (max-width: 700px) {
  .kiva {
    grid-template-columns: 1fr;
  }
  .kiva-image img {
    height: 200px;
  }
}
</style>
