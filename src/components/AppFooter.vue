<script setup>
import { ref, computed } from 'vue';
import { t, currency, locale, setCurrency, setLocale } from '../i18n/store.js';
import { openPreferences, openSignin, openCookieModal } from '../state/modals.js';

const aboutLinks = computed(() => [
  { key: 'about_1', label: t('footer.col_about_1'), to: { name: 'about' } },
  { key: 'about_2', label: t('footer.col_about_2'), to: { name: 'resources' } },
  { key: 'about_5', label: t('footer.col_about_5'), to: { name: 'safety' } },
]);

// Several explore items point at real routes; the rest stay as placeholders.
const exploreLinks = computed(() => [
  { key: 'write', label: t('footer.col_explore_1'), to: { name: 'write-review' } },
  { key: 'add', label: t('footer.col_explore_2'), to: { name: 'add-person' } },
  { key: 'join', label: t('footer.col_explore_3'), onClick: openSignin },
  { key: 'tc', label: t('footer.col_explore_4'), to: { name: 'discover' } },
  { key: 'stories', label: t('footer.col_explore_6'), to: { name: 'encounters' } },
]);

const githubUrl = 'https://github.com';
const currentYear = new Date().getFullYear();

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
              <router-link :to="l.to">{{ l.label }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>{{ t('footer.col_explore_title') }}</h3>
          <ul>
            <li v-for="l in exploreLinks" :key="l.key">
              <router-link v-if="l.to" :to="l.to">{{ l.label }}</router-link>
              <button v-else type="button" class="link-like" @click="l.onClick">
                {{ l.label }}
              </button>
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
            <a
              :href="githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="social"
            >
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.17a10.97 10.97 0 0 1 5.76 0c2.2-1.48 3.16-1.17 3.16-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.7 5.36-5.27 5.65.41.35.78 1.05.78 2.12 0 1.53-.02 2.76-.02 3.13 0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"
                />
              </svg>
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
          <span class="copyright">{{ t('footer.copyright', { year: currentYear }) }}</span>
        </div>

        <nav class="legal">
          <router-link :to="{ name: 'terms' }">{{ t('footer.legal_terms') }}</router-link>
          <button type="button" class="link-like legal-link" @click="openCookieModal">
            {{ t('footer.legal_cookies') }}
          </button>
        </nav>

        <p class="disclaimer">
          {{ t('footer.disclaimer_short') }}
          <template v-if="readMore"> {{ t('footer.disclaimer_long') }} </template>
          <button class="read-more" @click="readMore = !readMore">
            {{ readMore ? t('footer.read_less') : t('footer.read_more') }}
          </button>
        </p>

        <p class="signature">{{ t('footer.signature') }}</p>
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
  background: var(--bg);
  font-size: 13px;
  font-family: inherit;
}

.socials {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.social {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--brand-dark);
  color: var(--on-dark);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
}

.social-icon {
  width: 16px;
  height: 16px;
  fill: var(--on-dark);
}

.social:hover {
  background: var(--brand);
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

.signature {
  margin: 16px 0 0;
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
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
