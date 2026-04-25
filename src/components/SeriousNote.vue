<script setup>
import { t } from '../i18n/store.js';
</script>

<template>
  <aside class="serious-note" role="note" aria-labelledby="serious-note-title">
    <span class="serious-note-label">{{ t('serious_note.label') }}</span>
    <h2 id="serious-note-title" class="serious-note-title">{{ t('serious_note.title') }}</h2>
    <p class="serious-note-body">{{ t('serious_note.body') }}</p>
  </aside>
</template>

<style scoped>
.serious-note {
  background: var(--bg);
  border: 1px solid var(--border);
  border-left: 4px solid var(--brand-dark);
  border-radius: var(--radius);
  padding: 28px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: var(--shadow);
}

.serious-note-label {
  align-self: flex-start;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-dark);
  border: 1px solid var(--brand-dark);
  padding: 4px 10px;
  border-radius: 4px;
}

.serious-note-title {
  font-size: 18px;
  font-weight: 800;
  margin: 4px 0 0 0;
  color: var(--text);
  line-height: 1.3;
}

.serious-note-body {
  font-size: 15px;
  line-height: 1.65;
  color: var(--text);
  margin: 0;
}

@media (max-width: 700px) {
  .serious-note {
    padding: 24px 20px;
  }
  .serious-note-body {
    font-size: 14px;
  }
}
</style>
