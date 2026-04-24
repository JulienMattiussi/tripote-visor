<script setup>
import { ref, computed } from 'vue';
import {
  t,
  currency,
  locale,
  setCurrency,
  setLocale,
  openPreferences,
  openSignin,
} from '../i18n/store.js';

const aboutLinks = computed(() => [
  { key: 'about_1', label: t('footer.col_about_1') },
  { key: 'about_2', label: t('footer.col_about_2') },
  { key: 'about_3', label: t('footer.col_about_3') },
  { key: 'about_4', label: t('footer.col_about_4') },
  { key: 'about_5', label: t('footer.col_about_5') },
  { key: 'about_6', label: t('footer.col_about_6'), to: { name: 'how-it-works' } },
]);

// Several explore items point at real routes; the rest stay as placeholders.
const exploreLinks = computed(() => [
  { key: 'write', label: t('footer.col_explore_1'), to: { name: 'write-review' } },
  { key: 'add', label: t('footer.col_explore_2'), to: { name: 'add-place' } },
  { key: 'join', label: t('footer.col_explore_3'), onClick: openSignin },
  { key: 'tc', label: t('footer.col_explore_4'), to: { name: 'travelers-choice' } },
  { key: 'help', label: t('footer.col_explore_5') },
  { key: 'stories', label: t('footer.col_explore_6'), to: { name: 'travel-stories' } },
]);

const socials = [
  { id: 'fb', label: 'Facebook' },
  { id: 'x', label: 'X' },
  { id: 'pi', label: 'Pinterest' },
  { id: 'ig', label: 'Instagram' },
  { id: 'yt', label: 'YouTube' },
  { id: 'tt', label: 'TikTok' },
];

const readMore = ref(false);

const onCurrencyChange = (e) => {
  const value = e.target.value;
  if (value === 'USD' || value === 'EUR') {
    setCurrency(value);
  } else {
    openPreferences('currency');
    e.target.value = currency.value;
  }
};

const onLocaleChange = (e) => {
  const value = e.target.value;
  if (value === 'en' || value === 'fr') {
    setLocale(value);
  } else {
    openPreferences('region');
    e.target.value = locale.value;
  }
};
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3>{{ t('footer.col_about_title') }}</h3>
          <ul>
            <li v-for="l in aboutLinks" :key="l.key">
              <router-link v-if="l.to" :to="l.to">{{ l.label }}</router-link>
              <a v-else href="#">{{ l.label }}</a>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>{{ t('footer.col_explore_title') }}</h3>
          <ul>
            <li v-for="l in exploreLinks" :key="l.key">
              <router-link v-if="l.to" :to="l.to">{{ l.label }}</router-link>
              <button v-else-if="l.onClick" type="button" class="link-like" @click="l.onClick">
                {{ l.label }}
              </button>
              <a v-else href="#">{{ l.label }}</a>
            </li>
          </ul>
        </div>

        <div class="footer-col settings-col">
          <div class="selects">
            <select
              :value="currency"
              :aria-label="t('footer.currency_aria')"
              @change="onCurrencyChange"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="__more__">…</option>
            </select>
            <select :value="locale" :aria-label="t('footer.country_aria')" @change="onLocaleChange">
              <option value="en">{{ t('footer.country_us') }}</option>
              <option value="fr">{{ t('footer.country_fr') }}</option>
              <option value="__more__">…</option>
            </select>
          </div>

          <div class="socials" :aria-label="t('footer.socials_aria')">
            <a v-for="s in socials" :key="s.id" href="#" :aria-label="s.label" class="social">
              <span class="social-dot">{{ s.label[0] }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="owl-wrap">
          <svg class="owl" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path
              d="M 2,13 C 3,3 13,13 13.5,1"
              fill="none"
              stroke="var(--brand)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M 30,13 C 29,3 19,13 18.5,1"
              fill="none"
              stroke="var(--brand)"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <circle
              cx="9.345"
              cy="17.336"
              r="4.462"
              fill="none"
              stroke="var(--brand)"
              stroke-width="1.5"
            />
            <circle cx="9.345" cy="17.336" r="2.34" fill="var(--brand)" />
            <circle
              cx="22.532"
              cy="17.336"
              r="4.462"
              fill="none"
              stroke="var(--brand)"
              stroke-width="1.5"
            />
            <circle cx="22.532" cy="17.336" r="2.34" fill="var(--brand)" />
            <circle cx="16" cy="29.5" r="0.6" fill="var(--brand)" />
          </svg>
          <span class="copyright">{{ t('footer.copyright', { year: 2026 }) }}</span>
        </div>

        <nav class="legal">
          <a href="#">{{ t('footer.legal_terms') }}</a>
          <a href="#">{{ t('footer.legal_privacy') }}</a>
          <a href="#">{{ t('footer.legal_cookies') }}</a>
          <router-link :to="{ name: 'how-it-works' }">{{ t('footer.legal_how') }}</router-link>
          <a href="#">{{ t('footer.legal_contact') }}</a>
          <a href="#">{{ t('footer.legal_accessibility') }}</a>
        </nav>

        <p class="disclaimer">
          {{ t('footer.disclaimer_short') }}
          <template v-if="readMore"> {{ t('footer.disclaimer_long') }} </template>
          <button class="read-more" @click="readMore = !readMore">
            {{ readMore ? t('footer.read_less') : t('footer.read_more') }}
          </button>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--surface);
  padding: 40px 0 24px;
  margin-top: 40px;
  font-size: 13px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr minmax(220px, 1fr);
  gap: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.link-like {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}

.link-like:hover {
  text-decoration: underline;
}

.footer-col h3 {
  color: var(--brand-dark);
  font-size: 14px;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.footer-col h3.mt {
  margin-top: 22px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-col a {
  color: var(--text);
}

.footer-col a:hover {
  text-decoration: underline;
}

.partner {
  font-weight: 700;
  text-decoration: underline;
}

.settings-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selects {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selects select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
  font-size: 13px;
  font-family: inherit;
}

.socials {
  display: flex;
  gap: 12px;
}

.social {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--brand-dark);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.social-dot {
  color: #fff;
}

.footer-bottom {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.owl-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.owl {
  width: 28px;
  height: 28px;
}

.copyright {
  font-size: 13px;
  color: var(--text);
}

.legal {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 13px;
}

.legal a {
  text-decoration: underline;
}

.disclaimer {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.read-more {
  color: var(--brand-dark);
  font-weight: 700;
  padding: 0 4px;
  font-size: 12px;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
