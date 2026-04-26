<script setup>
import { ref, computed } from 'vue';
import { t } from '../i18n/store.js';
import { formatLieu } from '../data/fiches.js';
import fichesData from '../data/fiches.json';

const SUGGESTION_LIMIT = 6;

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const placeQuery = ref('');

const suggestions = computed(() => {
  if (props.modelValue) return [];
  const q = placeQuery.value.trim().toLowerCase();
  if (!q) return [];
  return fichesData
    .filter((f) => {
      const haystack = [
        f.nom,
        f.ville ?? '',
        f.lieu ?? '',
        ...(f.descriptif ?? []),
        ...(f.descriptif_en ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, SUGGESTION_LIMIT);
});

const selectFiche = (fiche) => {
  emit('update:modelValue', fiche);
  placeQuery.value = '';
};

const clearSelection = () => {
  emit('update:modelValue', null);
};
</script>

<template>
  <div class="ps-field">
    <div v-if="!modelValue" class="ps-search">
      <input v-model="placeQuery" type="text" :placeholder="placeholder" />
      <ul v-if="suggestions.length" class="ps-suggestions">
        <li v-for="f in suggestions" :key="f.id">
          <button type="button" class="ps-suggestion" @click="selectFiche(f)">
            <span class="ps-thumb" aria-hidden="true"></span>
            <span class="ps-suggestion-name">{{ f.nom }}</span>
            <span class="ps-suggestion-loc">{{ formatLieu(f) }}</span>
          </button>
        </li>
      </ul>
      <p v-else-if="placeQuery.trim()" class="ps-no-match">
        {{ t('place_search.no_match') }}
      </p>
    </div>

    <div v-else class="ps-selected">
      <span class="ps-selected-thumb" aria-hidden="true"></span>
      <span class="ps-selected-body">
        <span class="ps-selected-name">{{ modelValue.nom }}</span>
        <span class="ps-selected-loc">{{ formatLieu(modelValue) }}</span>
      </span>
      <button
        type="button"
        class="ps-selected-clear"
        :aria-label="t('place_search.change_selection')"
        @click="clearSelection"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>
.ps-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ps-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ps-search input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: inherit;
  font-size: 15px;
  background: var(--bg);
}

.ps-search input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px var(--brand-tint);
}

.ps-suggestions {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.ps-suggestion {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  font-family: inherit;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;
}

.ps-suggestion:hover,
.ps-suggestion:focus-visible {
  border-color: var(--brand);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
  outline: none;
}

.ps-thumb {
  display: block;
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, var(--brand-light), var(--surface-alt));
}

.ps-suggestion-name {
  padding: 8px 12px 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--brand-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ps-suggestion-loc {
  padding: 0 12px 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.ps-no-match {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
  padding: 8px 0;
}

.ps-selected {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border: 1.5px solid var(--brand);
  border-radius: 12px;
  background: var(--brand-tint);
}

.ps-selected-thumb {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--brand-light), var(--surface-alt));
}

.ps-selected-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ps-selected-name {
  font-size: 15px;
  font-weight: 800;
  color: var(--brand-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ps-selected-loc {
  font-size: 13px;
  color: var(--text);
}

.ps-selected-clear {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--border);
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.ps-selected-clear:hover,
.ps-selected-clear:focus-visible {
  border-color: var(--brand);
  color: var(--brand-dark);
  outline: none;
}

@media (max-width: 700px) {
  .ps-suggestions {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
