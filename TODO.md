# TODO

## Audit links / alerts / external (snapshot)

### Dead links (`href="#"`)

None. All internal navigation goes through `<router-link>` or `router.push({ name })`.

### Buttons with `alert()` (front-only placeholders)

- [x] `ThingsToDoBanner` — CTA navigates to `/discover` (was an `alert()`).
- [x] `KivaBanner` — component removed entirely.
- [x] `FichePage` "+ Add a review" buttons — route to `/write-review?fiche=:id` (was `onPlaceholder('add_review')`).
- [x] `AppHeader.onMenuItemClick` — dead alert fallback removed; menu items always have a `to`.
- [ ] [src/pages/TravelStoriesPage.vue:19](src/pages/TravelStoriesPage.vue#L19) — clicking a story still alerts. No story-detail page yet.

### By design (do not "fix")

The parody premise is that **nothing user-generated can ever be persisted, and the site sets no cookies**. The following behaviors are intentional and should stay as is:

- `SignInModal.onSubmit` always sets `error.value = true`. No real auth, no mock auth, no local-storage shortcut.
- The three form pages (`/write-review`, `/post-photos`, `/add-sex-worker`) open `LoginRequiredModal` on a valid submit and never persist:
  - `/write-review` → target `publish_review`
  - `/post-photos` → target `publish_photos`
  - `/add-sex-worker` → target `add_place`
- Pre-fill via `?fiche=:id` works on `/write-review` and `/post-photos` (consumed by `PlaceSearchSelect`), purely to ergonomically open the modal with the right context.
- `CookieConsentModal`'s Allow / Reject / Confirm only close the modal. There are no cookies to accept or refuse — the site sets none. The modal is the cosmetic mirror of mainstream review platforms' consent banner.

### Other minor placeholders (low priority)

- [ ] Favorite hearts in `ExperienceCards.vue` and `InspirationCards.vue` — local `ref({})` state, lost on refresh. The fiche/search "save" hearts already trigger `LoginRequiredModal` so they are not placeholders any more.

### External links

All three are legitimate, with `target="_blank"` + `rel="noopener noreferrer"`:

- [src/components/AppFooter.vue](src/components/AppFooter.vue) — `https://github.com` (footer social).
- [src/pages/AccessibilityPage.vue](src/pages/AccessibilityPage.vue) — `eur-lex.europa.eu` (EAA legal text).
- [src/pages/AccessibilityPage.vue](src/pages/AccessibilityPage.vue) — `w3.org/TR/WCAG21/` (WCAG 2.1 reference).
