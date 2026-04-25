<script setup>
import { t } from '../i18n/store.js';

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <aside v-if="!collapsed" class="serious-note" role="note" aria-labelledby="serious-note-title">
    <span class="serious-note-label">{{ t('serious_note.label') }}</span>
    <h2 id="serious-note-title" class="serious-note-title">{{ t('serious_note.title') }}</h2>
    <p class="serious-note-body">{{ t('serious_note.body') }}</p>
  </aside>
  <details v-else class="serious-note serious-note--collapsed" role="note">
    <summary>
      <span class="serious-note-label">{{ t('serious_note.label') }}</span>
      <span class="serious-note-title">{{ t('serious_note.title') }}</span>
    </summary>
    <p class="serious-note-body">{{ t('serious_note.body') }}</p>
  </details>
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

.serious-note--collapsed summary {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-wrap: wrap;
}

.serious-note--collapsed summary::-webkit-details-marker {
  display: none;
}

.serious-note--collapsed summary::after {
  content: '▾';
  margin-left: auto;
  color: var(--brand-dark);
  font-size: 14px;
  transition: transform 0.15s ease;
}

.serious-note--collapsed[open] summary::after {
  transform: rotate(180deg);
}

.serious-note--collapsed .serious-note-title {
  font-size: 16px;
  margin: 0;
}

.serious-note--collapsed .serious-note-body {
  margin-top: 14px;
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
