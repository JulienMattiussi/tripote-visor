<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { t } from '../i18n/store.js';
import { openLoginRequired } from '../state/modals.js';
import fichesData from '../data/fiches.json';
import PlaceSearchSelect from '../components/PlaceSearchSelect.vue';

const route = useRoute();

const initialFiche = (() => {
  const id = (route.query.fiche ?? '').toString();
  return id ? (fichesData.find((f) => f.id === id) ?? null) : null;
})();

const selectedFiche = ref(initialFiche);
const files = ref([]); // local-only File[]; never uploaded
const caption = ref('');
const consent = ref(false);
const dragOver = ref(false);
const showError = ref(false);

const isValid = computed(() => selectedFiche.value && files.value.length > 0 && consent.value);

const acceptFiles = (list) => {
  const incoming = Array.from(list ?? []).filter((f) => /^image\//.test(f.type));
  files.value = [...files.value, ...incoming].slice(0, 5);
};

const onPick = (e) => {
  acceptFiles(e.target.files);
  e.target.value = '';
};

const onDrop = (e) => {
  e.preventDefault();
  dragOver.value = false;
  acceptFiles(e.dataTransfer?.files);
};

const onDragOver = (e) => {
  e.preventDefault();
  dragOver.value = true;
};

const onDragLeave = () => {
  dragOver.value = false;
};

const removeFile = (index) => {
  files.value = files.value.filter((_, i) => i !== index);
};

const onSubmit = (e) => {
  e.preventDefault();
  if (!isValid.value) {
    showError.value = true;
    return;
  }
  showError.value = false;
  openLoginRequired({ target: 'publish_photos', name: selectedFiche.value.nom });
};
</script>

<template>
  <section class="form-hero">
    <div class="container">
      <h1 class="form-hero-title">{{ t('pp_page.hero_title') }}</h1>
      <p class="form-hero-subtitle">{{ t('pp_page.hero_subtitle') }}</p>
    </div>
  </section>

  <main class="container form-main">
    <div class="form-card">
      <form @submit="onSubmit">
        <div class="field">
          <span class="field-label">{{ t('pp_page.place_label') }} <em>*</em></span>
          <PlaceSearchSelect
            v-model="selectedFiche"
            :placeholder="t('pp_page.place_placeholder')"
          />
        </div>

        <div class="field">
          <span class="field-label">{{ t('pp_page.drop_title') }} <em>*</em></span>
          <label
            :class="['drop-zone', { 'drop-zone--over': dragOver }]"
            @drop="onDrop"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
          >
            <input type="file" accept="image/*" multiple class="drop-input" @change="onPick" />
            <span class="drop-icon" aria-hidden="true">📷</span>
            <span class="drop-title">{{ t('pp_page.drop_title') }}</span>
            <span class="drop-hint">{{ t('pp_page.drop_hint') }}</span>
            <span class="drop-browse">{{ t('pp_page.browse') }}</span>
          </label>

          <ul v-if="files.length" class="file-list">
            <li v-for="(file, i) in files" :key="i" class="file-row">
              <span class="file-name">{{ file.name }}</span>
              <button type="button" class="file-remove" @click="removeFile(i)">
                {{ t('pp_page.remove') }}
              </button>
            </li>
          </ul>
          <p v-if="files.length" class="file-count">
            {{ t('pp_page.file_count', { count: files.length }) }}
          </p>
        </div>

        <label class="field">
          <span class="field-label">{{ t('pp_page.caption_label') }}</span>
          <textarea
            v-model="caption"
            rows="3"
            :placeholder="t('pp_page.caption_placeholder')"
          ></textarea>
        </label>

        <label class="consent">
          <input v-model="consent" type="checkbox" />
          <span>{{ t('pp_page.consent_label') }}</span>
        </label>

        <div v-if="showError" class="form-error" role="alert">
          {{ t('pp_page.error_required') }}
        </div>

        <button type="submit" class="pill-btn pill-btn--brand form-submit">
          {{ t('pp_page.submit') }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
@import '../styles/form-page.css';

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 24px;
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  text-align: center;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
  position: relative;
}

.drop-zone--over {
  border-color: var(--brand);
  background: var(--brand-tint);
}

.drop-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.drop-icon {
  font-size: 32px;
  line-height: 1;
}

.drop-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--brand-dark);
}

.drop-hint {
  font-size: 13px;
  color: var(--text-muted);
}

.drop-browse {
  margin-top: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--brand);
  text-decoration: underline;
}

.file-list {
  list-style: none;
  margin: 12px 0 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
}

.file-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-remove {
  background: none;
  border: none;
  color: var(--brand-dark);
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
}

.file-count {
  font-size: 13px;
  color: var(--text-muted);
  margin: 8px 0 0 0;
}

.consent {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.45;
  color: var(--text);
  cursor: pointer;
}

.consent input {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  accent-color: var(--brand);
}
</style>
