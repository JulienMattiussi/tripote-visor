<script setup>
import { computed } from 'vue';
import { t } from '../i18n/store.js';
import { orderedDays, todayStatus } from '../data/schedule.js';

const props = defineProps({
  schedule: { type: Object, default: null },
});

const status = computed(() => todayStatus(props.schedule, t));
const days = computed(() => orderedDays(props.schedule, t));
</script>

<template>
  <div id="horaires" class="fp-side-block">
    <h3 class="fp-side-title">{{ t('fiche_page.hours_title') }}</h3>
    <p :class="['fp-status-tag', status.open ? 'open' : 'closed']">
      {{ status.label }}
    </p>
    <table class="fp-hours">
      <tbody>
        <tr v-for="d in days" :key="d.key" :class="{ today: d.isToday }">
          <th scope="row">{{ d.label }}</th>
          <td v-if="d.time">{{ d.time }}</td>
          <td v-else class="fp-closed-cell">{{ t('fiche_page.closed') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.fp-side-block {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  box-shadow: var(--shadow);
}

.fp-side-title {
  font-size: 16px;
  font-weight: 800;
  margin: 0 0 12px 0;
  color: var(--text);
}

.fp-status-tag {
  display: inline-block;
  font-weight: 700;
  font-size: 13px;
  padding: 2px 0;
}

.fp-status-tag.open {
  color: var(--brand-dark);
}

.fp-status-tag.closed {
  color: var(--danger);
}

.fp-hours {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 10px;
}

.fp-hours th,
.fp-hours td {
  padding: 4px 0;
  text-align: left;
  font-weight: 600;
}

.fp-hours td {
  text-align: right;
  color: var(--text);
  font-weight: 500;
}

.fp-hours tr.today th,
.fp-hours tr.today td {
  color: var(--brand-dark);
  font-weight: 800;
}

.fp-closed-cell {
  color: var(--danger);
}
</style>
