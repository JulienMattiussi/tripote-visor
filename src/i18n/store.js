import { ref } from 'vue';
import { translations } from './translations.js';
import advicesData from '../data/advices.json';

const STORAGE_LOCALE = 'tv_locale';
const STORAGE_CURRENCY = 'tv_currency';

const readStorage = (key) => {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
};

export const AVAILABLE_LOCALES = ['en', 'fr'];
export const AVAILABLE_CURRENCIES = ['USD', 'EUR'];

export function detectBrowserDefaults(nav) {
  const source = nav ?? (typeof navigator !== 'undefined' ? navigator : null);
  if (!source) return { locale: 'en', currency: 'USD' };
  const candidates = [
    ...(Array.isArray(source.languages) ? source.languages : []),
    source.language,
  ].filter(Boolean);
  for (const candidate of candidates) {
    const primary = String(candidate).toLowerCase().split('-')[0];
    if (primary === 'fr') return { locale: 'fr', currency: 'EUR' };
    if (primary === 'en') return { locale: 'en', currency: 'USD' };
  }
  return { locale: 'en', currency: 'USD' };
}

const browserDefaults = detectBrowserDefaults();

const storedLocale = readStorage(STORAGE_LOCALE);
const storedCurrency = readStorage(STORAGE_CURRENCY);
const initialLocale = AVAILABLE_LOCALES.includes(storedLocale)
  ? storedLocale
  : browserDefaults.locale;
const initialCurrency = AVAILABLE_CURRENCIES.includes(storedCurrency)
  ? storedCurrency
  : browserDefaults.currency;

export const locale = ref(initialLocale);
export const currency = ref(initialCurrency);
export const modalOpen = ref(false);
export const modalTab = ref('region');
export const signinOpen = ref(false);
export const signinScreen = ref('initial');
export const cookieModalOpen = ref(false);
export const loginRequiredOpen = ref(false);
export const loginRequiredContext = ref({ target: null, name: null });

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale.value;
}

export function t(key, params) {
  const path = key.split('.');
  const pick = (dict) => path.reduce((acc, seg) => (acc ? acc[seg] : undefined), dict);
  const raw = pick(translations[locale.value]) ?? pick(translations.en) ?? key;
  if (!params || typeof raw !== 'string') return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) => (name in params ? params[name] : `{${name}}`));
}

export function setLocale(code) {
  if (!AVAILABLE_LOCALES.includes(code)) return;
  locale.value = code;
  writeStorage(STORAGE_LOCALE, code);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
  }
}

export function setCurrency(code) {
  if (!AVAILABLE_CURRENCIES.includes(code)) return;
  currency.value = code;
  writeStorage(STORAGE_CURRENCY, code);
}

export function openPreferences(tab = 'region') {
  modalTab.value = tab;
  modalOpen.value = true;
}

export function closePreferences() {
  modalOpen.value = false;
}

export function openSignin() {
  signinScreen.value = 'initial';
  signinOpen.value = true;
}

export function closeSignin() {
  signinOpen.value = false;
  signinScreen.value = 'initial';
}

export function goToSigninEmail() {
  signinScreen.value = 'email';
}

export function goBackToSigninInitial() {
  signinScreen.value = 'initial';
}

export function openCookieModal() {
  cookieModalOpen.value = true;
}

export function closeCookieModal() {
  cookieModalOpen.value = false;
}

export function openLoginRequired({ target, name }) {
  loginRequiredContext.value = { target, name };
  loginRequiredOpen.value = true;
}

export function closeLoginRequired() {
  loginRequiredOpen.value = false;
  loginRequiredContext.value = { target: null, name: null };
}

const CURRENCY_META = {
  USD: { symbol: '$', position: 'prefix', flag: '🇺🇸' },
  EUR: { symbol: '€', position: 'suffix', flag: '🇫🇷' },
};

const LOCALE_META = {
  en: { flag: '🇺🇸' },
  fr: { flag: '🇫🇷' },
};

const USD_TO_EUR = 0.92;

export function currencySymbol() {
  return CURRENCY_META[currency.value].symbol;
}

export function currencyFlag() {
  return CURRENCY_META[currency.value].flag;
}

export function localeFlag() {
  return LOCALE_META[locale.value].flag;
}

export function reviewCountFor(id) {
  const list = advicesData[id];
  return Array.isArray(list) ? list.length : 0;
}

export function reviewAverageFor(id) {
  const list = advicesData[id];
  if (!Array.isArray(list) || !list.length) return 0;
  return list.reduce((acc, r) => acc + r.rating, 0) / list.length;
}

export function formatReviewDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const tag = locale.value === 'fr' ? 'fr-FR' : 'en-US';
  return d.toLocaleDateString(tag, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatLieu(fiche) {
  if (!fiche) return '';
  const ville = fiche.ville ?? '';
  const lieu = fiche.lieu ?? '';
  if (ville && lieu) return `${ville} (${lieu})`;
  return ville || lieu;
}

export function formatAmount(usdAmount) {
  const isEuro = currency.value === 'EUR';
  const value = isEuro ? Math.round(usdAmount * USD_TO_EUR) : usdAmount;
  const meta = CURRENCY_META[currency.value];
  const formatted = value.toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US');
  return meta.position === 'prefix' ? `${meta.symbol}${formatted}` : `${formatted} ${meta.symbol}`;
}
