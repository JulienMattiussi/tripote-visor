import { ref } from 'vue';
import { translations } from './translations.js';

const STORAGE_LOCALE = 'tv_locale';
const STORAGE_CURRENCY = 'tv_currency';

const readStorage = (key) => {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
};

const writeStorage = (key, value) => {
  try {
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, value);
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

const CURRENCY_META = {
  USD: { symbol: '$', position: 'prefix', flag: '🇺🇸' },
  EUR: { symbol: '€', position: 'suffix', flag: '🇫🇷' },
};

const USD_TO_EUR = 0.92;

export function currencyFlag() {
  return CURRENCY_META[currency.value].flag;
}

export function formatReviewDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const tag = locale.value === 'fr' ? 'fr-FR' : 'en-US';
  return d.toLocaleDateString(tag, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatAmount(usdAmount) {
  const isEuro = currency.value === 'EUR';
  const value = isEuro ? Math.round(usdAmount * USD_TO_EUR) : usdAmount;
  const meta = CURRENCY_META[currency.value];
  const formatted = value.toLocaleString(locale.value === 'fr' ? 'fr-FR' : 'en-US');
  return meta.position === 'prefix' ? `${meta.symbol}${formatted}` : `${formatted} ${meta.symbol}`;
}
