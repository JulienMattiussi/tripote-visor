# Tripote-visor

Single-page Vue 3 front simulation of a Tripadvisor-like home page. Pure visual mockup — placeholder copy, placeholder imagery, no backend, no real bookings. Theme is pink/mauve.

## Product

One route: the home page. It stacks the sections a typical Tripadvisor visitor sees on first load:

1. **Header** — sticky top bar: bust-icon logo, primary nav (Plan with AI, Rewards, Discover, Review, Forums), currency pill, Sign-in.
2. **Hero search** — tabbed search (Search All / Hotels / Things to Do / Restaurants / Cruises) with a single text input. Submit triggers an `alert()` — there is no real search.
3. **Section stack** (inside the page container):
   - `ThingsToDoBanner` — pink-light promo banner
   - `CategoryGrid` — 4 interest tiles
   - `ExperienceCards` — carousel of experience cards with fav toggle + rating dots
   - `KivaBanner` — editorial strip
   - `InspirationCards` — article teasers with heart-fav toggle
   - `DestinationsGrid` — destination thumbnails
4. **TravelersChoice** — full-bleed award section (mauve background, yellow + pink decorative blobs)
5. **CommunityBlurb** — short community pitch
6. **Footer** — 3-column link matrix, partner sites, legal, placeholder disclaimer

All user actions (fav toggles, tab switches, currency pill, Sign in, Search) are front-only: `alert()` or local `ref()` state. No network calls.

## Architecture

```
src/
├── App.vue                 # Root chrome — header, <router-view>, footer, modals
├── main.js                 # createApp + router + global CSS import
├── router/
│   └── index.js            # Vue Router config — routes + factory (history is injected for tests)
├── pages/
│   ├── HomePage.vue            # /              — composes every home section
│   └── TravelersChoicePage.vue # /travelers-choice[/:category] — awards landing page
├── components/             # Shared UI components
│   ├── AppHeader.vue           # Sticky nav, inline-SVG bust logo, scroll-compact mode, Discover/Review dropdowns
│   ├── HeroSearch.vue          # Tabbed search (home only)
│   ├── ThingsToDoBanner.vue
│   ├── CategoryGrid.vue
│   ├── ExperienceCards.vue
│   ├── KivaBanner.vue
│   ├── InspirationCards.vue
│   ├── DestinationsGrid.vue
│   ├── TravelersChoice.vue     # Home-page promo strip — its CTA navigates to the page
│   ├── CommunityBlurb.vue
│   ├── AppFooter.vue
│   ├── PreferencesModal.vue    # Region/Language + Currency modal (Tripadvisor-style)
│   └── SignInModal.vue         # Three-screen auth modal (initial / email / forgot password)
├── data/
│   └── travelers-choice.js # Categories + winners shown on the TC page
├── i18n/
│   ├── store.js            # Reactive `locale`/`currency` refs, `t(key, params?)`, modal controls
│   ├── translations.js     # `{ en: {...}, fr: {...} }` — full site copy
│   ├── regions.js          # Country list for the modal (only US + FR enabled)
│   └── currencies.js       # Currency list for the modal (only USD + EUR enabled)
└── styles/
    └── main.css            # :root theme tokens + global base styles

public/
├── favicon.ico             # Multi-size ICO (16/32/48) — inverted (white on pink)
└── favicon.svg             # SVG favicon — pink glyph on transparent

tests/                      # Vitest + @vue/test-utils (jsdom)
├── App.test.js             # Landmarks + key section titles
├── AppHeader.test.js       # Logo, nav, no hardcoded hex
└── HeroSearch.test.js      # Tab count, placeholder switch, empty-submit guard
```

The bust glyph in both favicons and in `AppHeader`'s inline SVG is the same shape: shoulder-to-neck S-curves, two ringed breasts with pupils, and a small navel dot. The header version binds colors to CSS variables; the favicon files are static assets and carry the hex inline.

## Theme

All colors live in `src/styles/main.css` under `:root` as CSS custom properties. Components must only reference them via `var(--token)` — never hardcode a hex.

```css
--brand          /* #d946ef — primary fuchsia */
--brand-dark     /* #6b1a4f — deep plum, for headings and text on white */
--brand-light    /* #f5d0fe — pale lilac, for decorative blobs */
--brand-hover    /* #a21caf — darker fuchsia, for button hover */
--brand-tint     /* rgba(217, 70, 239, 0.08) — subtle hover overlay */

--bg             /* #ffffff */
--surface        /* #f2f2f2 */
--surface-alt    /* #faf0e4 */
--text           /* #000000 */
--text-muted     /* #5a5a5a */
--border         /* #d9d9d9 */

--accent-yellow  /* #ffe85c — Travelers' Choice badge / blob */
--danger         /* #d32f2f — filled heart color */
```

To re-skin the site, edit only `main.css`. There are no other sources of truth for color.

## i18n

Two locales (`en`, `fr`) and two currencies (`USD`, `EUR`) are supported. Every other option in the Preferences modal is rendered grayed-out with an "Unavailable now" / "Indisponible actuellement" sub-label. The modal is opened from the header currency pill (or the footer selects when the user picks the `…` option).

- **State** — `src/i18n/store.js` exports module-scoped `locale` and `currency` refs. Both persist to `localStorage` (`tv_locale`, `tv_currency`) and are restored on load. Unknown values are rejected by `setLocale`/`setCurrency`.
- **Translation** — `t('section.key', params?)` walks the dotted key in `translations[locale.value]`, falls back to `translations.en`, and finally returns the key itself. Placeholders like `{amount}` are replaced from `params`. Because `t()` reads `locale.value`, any template or `computed()` that calls it re-evaluates automatically when the locale changes.
- **Currency formatting** — `formatAmount(usdAmount)` converts to EUR when needed (fixed 0.92 rate), then formats with `toLocaleString(locale)` and the correct symbol position (`$` prefix / `€` suffix). Components hand in a canonical USD figure; the helper handles both the conversion and the locale-aware number grouping.
- **Enabled vs. disabled options** — `regions.js` and `currencies.js` flag entries with `enabled: true`; the modal disables the others and shows the translated "unavailable" copy. Expanding the site's coverage = flipping the flag, not touching the component.

When adding a new visible string: add its key under the right section in both `en` and `fr`, then replace the literal in the component with `{{ t('section.key') }}`. Never hardcode English copy in a template — the "no hardcoded hex" rule has a twin for strings.

## Routing

Two routes today, both served by `src/router/index.js`:

| Path                          | Name                        | Page                                                                                                       |
| ----------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `/`                           | `home`                      | `HomePage.vue`                                                                                             |
| `/travelers-choice`           | `travelers-choice`          | `TravelersChoicePage.vue` (all categories)                                                                 |
| `/travelers-choice/:category` | `travelers-choice-category` | same page, filtered to one of `hotels` / `restaurants` / `things` / `destinations` / `beaches` / `rentals` |

`createAppRouter({ history })` is a factory so tests can inject `createMemoryHistory()` (see `tests/helpers/router.js`). All route navigation goes through `router.push({ name, params })` — never raw `<a href>` to internal URLs.

## Stack

- **Vue 3** (`<script setup>` SFCs, Composition API)
- **Vue Router 4** — file in `src/router/`, two routes
- **Vite 5** — dev server + static build
- **Vitest** + **@vue/test-utils** + **jsdom** — unit tests
- **Prettier** — formatting
- No TypeScript, no state library, no CSS framework

## Build & Test

```bash
make install       # npm install
make dev           # vite dev server on http://localhost:5173
make build         # static build → dist/
make test          # vitest run
make test-watch    # vitest watch
make format        # prettier --write .
make format-check  # prettier --check .
make check         # format-check + test
```

Every target is also available directly via `npm run <script>` — the Makefile is a thin wrapper so the usual `make` / `make help` flow works.

## Rules

- **UI copy lives in `src/i18n/translations.js`.** Both `en` and `fr` must be filled in. Templates call `t('section.key')` — never hardcode English in the template. Code, comments, and commit messages are in English; user-facing copy follows the active locale.
- **Theme values live in `main.css` only.** Components must use `var(--token)` — no hex or rgb in component `<style>` blocks. Inline SVGs inside Vue components (e.g. `AppHeader`) must bind `fill`/`stroke` to `var(--brand)` etc., not raw hex.
- **Favicons (`public/favicon.*`) are the sole exception** — they are standalone assets and may embed the literal brand hex. Update them in sync with `main.css` when the brand color changes.
- **No real network, no backend.** Placeholder interactions use `alert()` or local `ref()` state. External image URLs are fine (Unsplash).
- **No new top-level dependencies** without a clear need. The point of the project is to stay a small, readable Vue 3 showcase.
- **Keep each section a single `.vue` file** under `components/`. If a component grows past ~200 lines, split it by visual block (header strip, card list, etc.) rather than by abstraction layer.
- **Tests cover behaviour, not markup churn.** Assert on landmark roles, visible text, tab counts, and the no-hardcoded-hex contract. Don't snapshot entire `<template>` trees — cosmetic edits would break every test.
- **Run `make check` before committing.** Prettier + Vitest must both pass.
