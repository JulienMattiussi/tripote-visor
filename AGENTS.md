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
├── App.vue                 # Root — composes every section in order
├── main.js                 # createApp + global CSS import
├── components/             # 11 single-file components, one per section
│   ├── AppHeader.vue           # Sticky nav + inline-SVG bust logo
│   ├── HeroSearch.vue          # Tabbed search
│   ├── ThingsToDoBanner.vue
│   ├── CategoryGrid.vue
│   ├── ExperienceCards.vue
│   ├── KivaBanner.vue
│   ├── InspirationCards.vue
│   ├── DestinationsGrid.vue
│   ├── TravelersChoice.vue
│   ├── CommunityBlurb.vue
│   └── AppFooter.vue
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

## Stack

- **Vue 3** (`<script setup>` SFCs, Composition API)
- **Vite 5** — dev server + static build
- **Vitest** + **@vue/test-utils** + **jsdom** — unit tests
- **Prettier** — formatting
- No TypeScript, no router, no state library, no CSS framework

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

- **UI copy in English.** The site mimics Tripadvisor; strings match that tone. Code, comments, and commit messages are also in English.
- **Theme values live in `main.css` only.** Components must use `var(--token)` — no hex or rgb in component `<style>` blocks. Inline SVGs inside Vue components (e.g. `AppHeader`) must bind `fill`/`stroke` to `var(--brand)` etc., not raw hex.
- **Favicons (`public/favicon.*`) are the sole exception** — they are standalone assets and may embed the literal brand hex. Update them in sync with `main.css` when the brand color changes.
- **No real network, no backend.** Placeholder interactions use `alert()` or local `ref()` state. External image URLs are fine (Unsplash).
- **No new top-level dependencies** without a clear need. The point of the project is to stay a small, readable Vue 3 showcase.
- **Keep each section a single `.vue` file** under `components/`. If a component grows past ~200 lines, split it by visual block (header strip, card list, etc.) rather than by abstraction layer.
- **Tests cover behaviour, not markup churn.** Assert on landmark roles, visible text, tab counts, and the no-hardcoded-hex contract. Don't snapshot entire `<template>` trees — cosmetic edits would break every test.
- **Run `make check` before committing.** Prettier + Vitest must both pass.
