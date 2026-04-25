# Tripote-visor

Multi-page Vue 3 front simulation of a major review platform. Pure visual mockup - placeholder copy, placeholder imagery, no backend, no real bookings. Theme is pink/mauve. The site's premise is deliberately uncomfortable: it imagines a polished review platform applied to sex work, and uses the gap between the polished UI and that subject as a critique. A `SeriousNote` callout (see below) carries the moral weight wherever the parody's substantive subject is acknowledged.

## Product

The site has a home page plus a small constellation of secondary pages reachable from the header dropdowns and the footer.

**Home page** stacks: header (logo, Discover dropdown, Review dropdown, currency pill, Sign-in), tabbed `HeroSearch` (Search All / Hotels / Parks / Alleys), `ThingsToDoBanner`, `CategoryGrid`, `ExperienceCards`, `DestinationsHighlights`, `InspirationCards`, `DestinationsGrid`, `TravelersChoice` promo, `CommunityBlurb`, `AppFooter`. All client-side: `alert()` or local `ref()` for any user action; no network calls.

**Secondary pages** (each reached from header or footer):

- `/encounters` - 4 articles (1 featured + 3)
- `/hotels`, `/parks`, `/alleys` - listings, share `ListingsPage.vue` via `listing-type` prop
- `/write-review`, `/post-photos`, `/add-sex-worker` - parody form pages
- `/how-it-works` - 9-section explainer page
- `/about` - parody premise + shared `SeriousNote`
- `/safety` - integrity policy, ends on a "what we don't do" pivot + shared `SeriousNote`
- `/terms` - 6 numbered sections + shared `SeriousNote` aside
- `/accessibility` - hero with 3 shield SVGs + EAA/WCAG references
- `/resources` - hub of brief policy summaries (no follow-up links)

**Four modals** mounted at the App level: `PreferencesModal` (region/locale + currency), `SignInModal` (initial / email / forgot-password screens), `CookieConsentModal` (4 categories: 1 always-on, 3 "None"), `LoginRequiredModal` (gates fiche actions and the three form-page submits - opens `SignInModal` on confirm). `LoginRequiredModal` recognises 5 targets: `save` and the contact actions (`site`/`menu`/`phone`/`email`) come from `FichePage`; `publish_review`, `publish_photos` and `add_place` come from the form pages on submit (no in-page success card any more).

## Architecture

```
src/
├── App.vue                       # Header + <router-view> + Footer + 3 modals
├── main.js                       # createApp + router + global CSS
├── router/
│   └── index.js                  # createAppRouter({ history }) factory
├── pages/
│   ├── HomePage.vue
│   ├── TravelStoriesPage.vue
│   ├── ListingsPage.vue          # generic, fed by listing-type prop
│   ├── HotelsPage.vue            # thin wrapper over ListingsPage
│   ├── ParksPage.vue             # thin wrapper over ListingsPage
│   ├── AlleysPage.vue            # thin wrapper over ListingsPage
│   ├── FichePage.vue             # /p/:id - profile page (fiche layout)
│   ├── SearchResultsPage.vue     # /search - global or category-filtered results
│   ├── UserReviewPage.vue        # /write-review
│   ├── PostPhotosPage.vue        # /post-photos
│   ├── CreateListingPage.vue     # /add-sex-worker
│   ├── HowTheSiteWorksPage.vue
│   ├── AboutPage.vue
│   ├── SafetyPage.vue
│   ├── TermsPage.vue
│   ├── AccessibilityPage.vue
│   ├── ResourcesPage.vue
│   └── DiscoverPage.vue          # /discover - top-4 fiches by rating + DestinationsHighlights
├── components/
│   ├── AppHeader.vue             # Sticky nav, scroll-compact mode, Discover/Review dropdowns
│   ├── AppFooter.vue             # 3-col grid + legal nav, GitHub social
│   ├── HeroSearch.vue            # home only
│   ├── ThingsToDoBanner.vue
│   ├── CategoryGrid.vue
│   ├── ExperienceCards.vue
│   ├── DestinationsHighlights.vue # top villes × 3 fiches each (home + discover)
│   ├── InspirationCards.vue
│   ├── DestinationsGrid.vue
│   ├── TravelersChoice.vue       # home promo strip; CTA navigates to /discover
│   ├── CommunityBlurb.vue
│   ├── PlaceSearchSelect.vue     # v-model fiche search-and-select (review / photo forms)
│   ├── PreferencesModal.vue
│   ├── SignInModal.vue
│   ├── CookieConsentModal.vue
│   ├── LoginRequiredModal.vue    # gates fiche actions + form submits behind sign-in
│   └── SeriousNote.vue           # shared callout, optional `collapsed` prop
├── data/
│   ├── travel-stories.js
│   ├── fiches.json               # 100 profile entries (FR descriptif + descriptif_en + ville/lieu)
│   ├── cities.json               # 50 villes ranked by fiche count, with optional photo URL
│   ├── schedules.json            # 15 weekly schedule patterns referenced by fiches
│   └── advices.json              # 1000 seeded reviews keyed by fiche id (rating/title/body/lang/date/author)
├── i18n/
│   ├── store.js                  # locale/currency refs, t(), modal state, formatters (Amount/Lieu/ReviewDate), review helpers (reviewCountFor/reviewAverageFor), detectBrowserDefaults
│   ├── translations.js           # { en: {...}, fr: {...} } - single source of truth
│   ├── regions.js                # only US + FR enabled
│   └── currencies.js             # only USD + EUR enabled
└── styles/
    ├── main.css                  # :root tokens + global base
    └── form-page.css             # imported by the 3 form pages

public/
├── favicon.ico                   # multi-size ICO, white bust on pink
└── favicon.svg                   # SVG bust on transparent

tests/
├── helpers/
│   └── router.js                 # setupRouter('/path'), withRouter(router)
├── App.test.js
├── AppHeader.test.js
├── AppFooter.test.js             # 4-col + legal nav + currency/locale selects + cookie/signin triggers
├── HomeComponents.test.js        # CategoryGrid / ExperienceCards / Inspiration / Destinations / TravelersChoice (promo) / CommunityBlurb / ThingsToDoBanner
├── HeroSearch.test.js
├── DestinationsHighlights.test.js
├── DiscoverPage.test.js
├── PlaceSearchSelect.test.js     # v-model contract + suggestions + clear button
├── PreferencesModal.test.js
├── SignInModal.test.js
├── CookieConsentModal.test.js
├── LoginRequiredModal.test.js    # all 5 message branches, EN+FR
├── TravelStoriesPage.test.js
├── FormPages.test.js             # UserReview / PostPhotos / CreateListing (all submit → LoginRequiredModal)
├── ListingsPages.test.js         # Hotels / Parks / Alleys
├── FichePage.test.js             # /p/:id - profile rendering, schedule, not-found
├── SearchResultsPage.test.js     # /search - grouping, filtering, HeroSearch submit
├── HowTheSiteWorksPage.test.js
├── AboutPage.test.js
├── SafetyPage.test.js
├── TermsPage.test.js
├── AccessibilityPage.test.js
├── ResourcesPage.test.js
├── translations.test.js          # dictionary integrity + locale switching guards
└── i18n.test.js                  # store API + browser default detection
```

The bust glyph in both favicons and in `AppHeader`'s inline SVG is the same shape (shoulder-to-neck S-curves, two ringed breasts with pupils, navel dot). The header version binds colors to CSS variables; favicons carry the literal hex.

## Routing

All routes live in `src/router/index.js`. `createAppRouter({ history })` is a factory so tests can inject `createMemoryHistory()` (see `tests/helpers/router.js`). All internal navigation goes through `<router-link>` or `router.push({ name, params })` - never raw `<a href>` to internal URLs.

| Path              | Name             | Page                                                       |
| ----------------- | ---------------- | ---------------------------------------------------------- |
| `/`               | `home`           | `HomePage.vue`                                             |
| `/encounters`     | `encounters`     | `TravelStoriesPage.vue`                                    |
| `/hotels`         | `hotels`         | `HotelsPage.vue` (wraps `ListingsPage`)                    |
| `/parks`          | `parks`          | `ParksPage.vue` (wraps `ListingsPage`)                     |
| `/alleys`         | `alleys`         | `AlleysPage.vue` (wraps `ListingsPage`)                    |
| `/p/:id`          | `fiche`          | `FichePage.vue` (single profile)                           |
| `/search`         | `search`         | `SearchResultsPage.vue` (`?q=`, `?categorie=`)             |
| `/write-review`   | `write-review`   | `UserReviewPage.vue`                                       |
| `/post-photos`    | `post-photos`    | `PostPhotosPage.vue`                                       |
| `/add-sex-worker` | `add-sex-worker` | `CreateListingPage.vue`                                    |
| `/how-it-works`   | `how-it-works`   | `HowTheSiteWorksPage.vue`                                  |
| `/about`          | `about`          | `AboutPage.vue`                                            |
| `/safety`         | `safety`         | `SafetyPage.vue`                                           |
| `/terms`          | `terms`          | `TermsPage.vue`                                            |
| `/accessibility`  | `accessibility`  | `AccessibilityPage.vue`                                    |
| `/resources`      | `resources`      | `ResourcesPage.vue`                                        |
| `/discover`       | `discover`       | `DiscoverPage.vue` (top-4 fiches + DestinationsHighlights) |

## Pages

Every secondary page follows the same anatomy:

1. **Hero** - full-width strip, title + subtitle. Two color conventions:
   - `var(--brand-dark)` background with white text for serious / award pages (Terms, Safety).
   - `var(--surface-alt)` background with brand-dark headings for lighter pages (About, Resources, Listings, How-it-works, Encounter Stories).
2. **Document body** - one or more cards on `var(--bg)` with `var(--shadow)`, each holding an `<h2>` title and paragraphs/bullets.
3. **Optional `<SeriousNote class="page-prefix-serious" />`** - mounted _outside_ the document, after it. Used on About, Safety, Terms. Mandatory on any page that leans into the parody's substantive subject.
4. **Back-to-home button** - `pill-btn pill-btn--brand`, calls `router.push({ name: 'home' })`. Centered or left-aligned per page.

**Section keys pattern** - pages with a list of similar sections use a `SECTION_KEYS` array + a `computed()` that maps each key to `{ title, body }`:

```js
const SECTION_KEYS = ['intro', 'reviews', 'ranking', 'tc', 'revenue' /* ... */];
const sections = computed(() =>
  SECTION_KEYS.map((key) => ({
    key,
    title: t(`page_ns.section_${key}_title`),
    body: t(`page_ns.section_${key}_body`),
  })),
);
```

Translation namespace per page: `<short>_page` (`tc_page`, `ts_page`, `ur_page`, `pp_page`, `cl_page`, `how_page`, `about_page`, `safety_page`, `terms_page`, `acc_page`, `resources_page`, `listings`).

## Modals

Four modals share the same shape:

- **State lives in `i18n/store.js`** as a module-scoped `ref(false)` (`modalOpen`, `signinOpen`, `cookieModalOpen`) plus `openX()` / `closeX()` helpers, plus any sub-state (`modalTab`, `signinScreen`).
- **Mounted once at the App level** (`App.vue`), never inside the component that triggers them. Triggers call `openX()` from anywhere via the store.
- **Escape closes**, **backdrop click closes** (check `event.target === event.currentTarget`).
- **Body scroll is locked** while the modal is open via `watch(modalOpen, open => document.body.style.overflow = open ? 'hidden' : '')`.
- **State is cleaned up on close** via the same watcher (form fields reset, sub-screen reset to initial).

To add a new modal: declare its open ref + actions in `store.js`, create the component using the same skeleton, mount it in `App.vue`, and route any trigger through the store action.

## Footer wiring

`AppFooter.vue` exposes two computed link arrays. Each entry has `{ key, label, to?, onClick? }`:

- `to: { name: 'route' }` renders as `<router-link>`.
- `onClick: fn` renders as `<button class="link-like">` (used for opening modals like Cookie consent or Sign-in).
- Otherwise the entry falls through to a placeholder `<a href="#">`.

Currently:

- **About column**: `About Us → /about`, `Resources and Policies → /resources`, `Trust & Safety → /safety`, `How the site works → /how-it-works`. (Placeholders no longer exist in this column.)
- **Explore column**: `Write a review → /write-review`, `Add a sex worker → /add-sex-worker`, `Join → openSignin()`, `Top destinations → /discover`, `Encounter Stories → /encounters`.
- **Settings column** (rightmost): currency `<select>`, locale `<select>` (both fall back to opening `PreferencesModal` when the user picks the `…` option), and the GitHub social pill, right-aligned.
- **Legal nav** (bottom row): `Terms of Use → /terms`, `Cookie consent → openCookieModal()`, `Accessibility Statement → /accessibility`.

## Theme

All colors live in `src/styles/main.css` under `:root` as CSS custom properties. Components reference them via `var(--token)` only - never hardcode a hex.

```css
--brand          /* #d946ef - primary fuchsia */
--brand-dark     /* #6b1a4f - deep plum, headings + text on white */
--brand-light    /* #f5d0fe - pale lilac, decorative blobs */
--brand-hover    /* #a21caf - darker fuchsia, button hover */
--brand-tint     /* rgba(217, 70, 239, 0.08) - subtle hover overlay */

--bg             /* #ffffff */
--surface        /* #f2f2f2 */
--surface-alt    /* #faf0e4 */
--text           /* #000000 */
--text-muted     /* #5a5a5a */
--border         /* #d9d9d9 */

--accent-yellow  /* #ffe85c - badge / blob */
--danger         /* #d32f2f - filled heart, error states */
```

To re-skin the site, edit only `main.css`. There is no other source of truth for color.

## i18n

Two locales (`en`, `fr`) and two currencies (`USD`, `EUR`). Everything else in the Preferences modal is grayed out with an "Unavailable now" / "Indisponible actuellement" sub-label.

- **State** - `src/i18n/store.js` exports module-scoped `locale` and `currency` refs. Both persist to `localStorage` (`tv_locale`, `tv_currency`) and are restored on load. `setLocale`/`setCurrency` reject unknown values.
- **Browser detection** - `detectBrowserDefaults()` returns `fr/EUR` when `navigator.language` starts with `fr`, `en/USD` for English, falls back to `en/USD` otherwise. Stored prefs always win.
- **Translation** - `t('section.key', params?)` walks the dotted key in `translations[locale.value]`, falls back to `translations.en`, finally returns the raw key. `{name}` tokens are replaced from `params`. Because `t()` reads `locale.value`, any template or `computed()` calling it re-evaluates automatically when the locale changes.
- **Currency formatting** - `formatAmount(usdAmount)` converts to EUR when needed (fixed 0.92 rate), formats with `toLocaleString(locale)`, places the symbol correctly (`$` prefix / `€` suffix). Components hand in a canonical USD figure.
- **Enabled options** - `regions.js` and `currencies.js` flag entries with `enabled: true`. Others render disabled with the translated "unavailable" copy. Expanding coverage = flipping flags, not touching the modal.

When adding a new visible string: add its key under the right namespace in **both** `en` and `fr`. Templates call `{{ t('section.key') }}`. The "no hardcoded hex" rule has a twin for strings: never bake English (or French) text into a template.

## Tests

Vitest + @vue/test-utils + jsdom. Each page or modal has its own test file at `tests/<Name>.test.js`. Cross-cutting guards live in:

- `tests/translations.test.js` - dictionary integrity (locale list, key parity, non-empty values, em-dash ban, placeholder parity, must-differ list) + locale-switching across the full App with EN_SAMPLES / FR_SAMPLES strings.
- `tests/i18n.test.js` - `t()`, `setLocale`/`setCurrency`, `formatAmount`, `detectBrowserDefaults`, AppHeader reactive locale switch.

**Helpers** (`tests/helpers/router.js`):

- `setupRouter(initialPath = '/')` - async, creates a router with `createMemoryHistory()`, pushes the initial path, awaits `router.isReady()`. Stubs `window.scrollTo` once to silence jsdom warnings.
- `withRouter(router)` - returns the `{ global: { plugins: [router] } }` object to spread into `mount()`.

**Patterns**:

- Tests that mount `App` or anything containing `<router-link>` / `useRouter()` must install the router via `setupRouter` + `withRouter`.
- After a click that triggers `router.push`, await `flushPromises()` before asserting on `router.currentRoute.value.name`.
- Reset `setLocale('en')` / `setCurrency('USD')` (and any open modal state) in `beforeEach` for tests that don't explicitly need other state.
- Locale-switching coverage uses substring assertions, not snapshots. Pick distinctive samples that are not substrings of each other across locales (lesson learned: "Explore" ⊂ "Explorez").
- The `mustDiffer` array in `translations.test.js` lists keys that _must_ have different EN/FR values. Add new keys here when their content can't be the same across locales (titles, CTAs, labels). Brand names and shared cognates legitimately stay identical.

## Recipes

### Adding a new page

1. Translation keys: add a new `<short>_page` namespace to **both** EN and FR in `src/i18n/translations.js` (hero title/subtitle, body sections, back-to-home label).
2. Component: create `src/pages/<Name>Page.vue` following the page anatomy (hero + body + optional `<SeriousNote />` + back-to-home button). Use a `SECTION_KEYS`-style array if there are several similar sections.
3. Route: import the component in `src/router/index.js` and add an entry to the `routes` array.
4. Wire entrypoint: add `to: { name: 'new-page' }` on the relevant entry in `aboutLinks` / `exploreLinks` (footer) or in a header dropdown items array.
5. Tests: create `tests/<Name>Page.test.js`. Cover hero text, structural sections (titles in order, expected counts), back-to-home navigation, and an FR-locale rendering. If the link sits in the footer, add a footer-wiring test that asserts the correct `href` on the matching anchor.
6. Run `make check`. The dictionary integrity test will fail if EN and FR drift; fix by adding the missing translation.

### Adding a new translation key

1. Add the key under the right namespace in **both** `en` and `fr` blocks of `translations.js`.
2. If the value should differ between locales (typical for any user-facing text), append the key to the `mustDiffer` array in `tests/translations.test.js`.
3. Replace any literal in templates with `{{ t('namespace.key') }}` (or `:attribute="t('namespace.key')"` for attributes).

The em-dash test catches `—` characters; the placeholder-parity test catches `{name}` token mismatches; the non-empty test catches forgotten values.

### Adding a new dropdown to the header

The Discover and Review menus share the same machinery in `AppHeader.vue`. To add a third:

1. Add a `<key>MenuItems` `computed()` array next to the existing two (`{ key, label, to? }` shape - if `to` is set the click navigates, otherwise it triggers `alert(...)` via `onMenuItemClick`).
2. Declare a template ref `<key>MenuRef` and add it to `refMap` inside `onDocClick`.
3. Add an `<li ref="...">` block in the `<ul>` mirroring the existing two: trigger button + `<div v-if="openMenu === '<key>'" class="nav-dropdown" role="menu" :aria-label="...">` with the items loop.
4. The `openMenu` ref already supports any string key; `toggleMenu(key)` and the document click/keydown listeners work as-is.

### Adding a new locale or currency

1. Add the locale or currency code to `AVAILABLE_LOCALES` / `AVAILABLE_CURRENCIES` in `store.js`.
2. Mirror the full key tree in `translations.js` for the new locale.
3. Flip `enabled: true` on the matching entry in `regions.js` / `currencies.js`.
4. If currency: add an entry to `CURRENCY_META` in `store.js` (`symbol`, `position`, `flag`) and possibly to `LOCALE_META`.
5. Add the locale to `detectBrowserDefaults()` if you want auto-detection.

## Stack

- **Vue 3** (`<script setup>` SFCs, Composition API)
- **Vue Router 4** - all internal navigation
- **Vite 5** - dev server + static build
- **Vitest** + **@vue/test-utils** + **jsdom** - unit tests
- **Prettier** - formatting
- No TypeScript, no state library beyond the i18n store, no CSS framework, no backend.

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

Every target is also available directly via `npm run <script>` - the Makefile is a thin wrapper so the usual `make` / `make help` flow works.

## Rules

- **UI copy lives in `src/i18n/translations.js`.** Both `en` and `fr` must be filled in. Templates call `t('section.key')` - never hardcode English (or French) in a template. Code, comments, and commit messages are in English.
- **No real-world brand or site names in shipped code.** This is a parody - translations, components, page copy, comments and commit messages must not name actual travel platforms (Tripadvisor, Booking, Airbnb, Expedia, Hotels.com, Trivago, Viator, etc.) or any other real third-party brand. Refer to them generically (« well-known travel review platforms », « major review platform », « partner sites »). The only allowed exceptions are the `public/favicon.*` static assets (legacy) and unavoidable real references in legal helplines (e.g. Ac.Sé, EU 116 006) where the number itself is the information. Do **not** add a test that asserts the absence of a specific brand name - that would itself bake the brand into the codebase.
- **No mobile app references.** This is a website only. Translations, components, comments and tests must not mention a companion app, mobile build, app stores, or app-specific platforms ("on our site or in the app", "Mobile licences", iPhone/Android entries, etc.). Use "the site" or "the platform" generically.
- **Em-dash (`—`, U+2014) is banned in shipped text.** Use a regular hyphen, a comma, a colon, or parentheses depending on context. The dictionary integrity test guards `translations.js`.
- **Internal navigation uses `<router-link>` or `router.push({ name })`.** Do not introduce new `<a href="#">` placeholders for internal pages; if a target route does not exist yet, build the route first.
- **Theme values live in `main.css` only.** Components must use `var(--token)` - no hex or rgb in component `<style>` blocks. Inline SVGs inside Vue components must bind `fill`/`stroke` to `var(--brand)` etc., not raw hex.
- **Favicons (`public/favicon.*`) are the sole hex exception** - they are standalone assets and embed the literal brand hex. Update them in sync with `main.css` when the brand color changes.
- **No real network, no backend.** Placeholder interactions use `alert()`, local `ref()` state, or open `LoginRequiredModal` on form submit. External image URLs (Unsplash) are fine.
- **`SeriousNote` is mandatory on any page that leans into the parody's substantive subject.** Mount `<SeriousNote />` outside the document card, near the bottom. The component is the moral counterweight to the polished UI.
- **No new top-level dependencies** without a clear need. The point of the project is to stay a small, readable Vue 3 showcase.
- **Tests cover behaviour, not markup churn.** Assert on landmark roles, visible text, link counts, route names, and the dictionary integrity contracts. Don't snapshot entire `<template>` trees - cosmetic edits would break every test.
- **Run `make check` before committing.** Prettier + Vitest must both pass.
