<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { t, locale, formatReviewDate } from '../i18n/store.js';
import articlesData from '../data/articles.json';

const route = useRoute();
const router = useRouter();

const article = computed(() => articlesData.find((a) => a.key === route.params.key));
const localized = (field) => article.value?.[field][locale.value] ?? article.value?.[field].en;

// Split a paragraph into text/quote segments so the press-style citations
// wrapped in “ … ” can be lifted onto their own line. Single-word references
// kept inside « … » (van names, etc.) stay inline.
const splitParagraph = (text) => {
  const re = /“\s*([^”]*?)\s*”/g;
  const parts = [];
  let lastIndex = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ kind: 'text', text: text.slice(lastIndex, m.index) });
    }
    parts.push({ kind: 'quote', text: m[1] });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ kind: 'text', text: text.slice(lastIndex) });
  }
  return parts;
};

const goBack = () => router.push({ name: 'encounters' });
</script>

<template>
  <section v-if="!article" class="article-not-found container">
    <p>{{ t('article_page.not_found') }}</p>
    <button type="button" class="pill-btn pill-btn--brand" @click="goBack">
      {{ t('article_page.back_to_encounters') }}
    </button>
  </section>

  <article v-else class="article">
    <figure class="article-hero">
      <img :src="article.image" :alt="localized('title')" />
    </figure>

    <div class="container article-body">
      <button type="button" class="article-back" @click="goBack">
        ← {{ t('article_page.back_to_encounters') }}
      </button>

      <span class="article-cat">{{ t(`ts_page.cat_${article.category}`) }}</span>
      <h1 class="article-title">{{ localized('title') }}</h1>
      <p class="article-lead">{{ localized('lead') }}</p>

      <div class="article-meta">
        <span class="article-author">{{ article.author }}</span>
        <span class="article-meta-sep" aria-hidden="true">·</span>
        <time :datetime="article.date">{{ formatReviewDate(article.date) }}</time>
        <span class="article-meta-sep" aria-hidden="true">·</span>
        <span>{{ t('ts_page.read_time', { minutes: article.read_minutes }) }}</span>
      </div>

      <div class="article-content">
        <p v-for="(paragraph, i) in localized('body')" :key="i">
          <template v-for="(seg, j) in splitParagraph(paragraph)" :key="j">
            <span v-if="seg.kind === 'quote'" class="article-q">- {{ seg.text }}</span>
            <template v-else>{{ seg.text }}</template>
          </template>
        </p>
      </div>

      <footer class="article-footer">
        <button type="button" class="pill-btn pill-btn--brand" @click="goBack">
          {{ t('article_page.back_to_encounters') }}
        </button>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.article-not-found {
  padding: 80px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.article-hero {
  margin: 0;
  aspect-ratio: 16 / 6;
  overflow: hidden;
  background: var(--surface);
}

.article-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-body {
  max-width: 720px;
  padding-top: 32px;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-back {
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-dark);
  cursor: pointer;
  font-family: inherit;
  margin-bottom: 8px;
}

.article-back:hover {
  text-decoration: underline;
}

.article-cat {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--brand);
}

.article-title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 38px;
  line-height: 1.15;
  letter-spacing: -0.01em;
  font-weight: 800;
  color: var(--brand-dark);
  margin: 0;
}

.article-lead {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 19px;
  line-height: 1.55;
  font-style: italic;
  color: var(--text);
  margin: 8px 0 0 0;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 14px 0;
  margin-top: 8px;
}

.article-author {
  font-weight: 700;
  color: var(--brand-dark);
}

.article-meta-sep {
  color: var(--text-muted);
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
}

.article-content p {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 17px;
  line-height: 1.7;
  color: var(--text);
  margin: 0;
}

.article-content > p:first-child::first-letter {
  font-size: 56px;
  font-weight: 800;
  float: left;
  line-height: 0.85;
  margin: 6px 10px 0 0;
  color: var(--brand-dark);
}

.article-q {
  display: block;
  margin: 14px 0;
  padding: 4px 0 4px 16px;
  border-left: 3px solid var(--brand);
  font-style: italic;
  font-weight: 500;
  color: var(--brand-dark);
}

.article-footer {
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
}

@media (max-width: 700px) {
  .article-title {
    font-size: 28px;
  }
  .article-lead {
    font-size: 16px;
  }
  .article-content p {
    font-size: 16px;
  }
  .article-hero {
    aspect-ratio: 16 / 9;
  }
}
</style>
