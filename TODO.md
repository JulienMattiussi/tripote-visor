# TODO

## Audit links / alerts / external (snapshot)

### Dead links (`href="#"`)

None. All internal navigation goes through `<router-link>` or `router.push({ name })`.

### Buttons with `alert()` (front-only placeholders)

- [x] [src/components/ThingsToDoBanner.vue:4](src/components/ThingsToDoBanner.vue#L4) — CTA wired to the new `/discover` page.
- [ ] [src/components/KivaBanner.vue:4](src/components/KivaBanner.vue#L4) — "Donate" CTA. No donation page yet.
- [ ] [src/pages/TravelStoriesPage.vue:19](src/pages/TravelStoriesPage.vue#L19) — clicking a story alerts. No story-detail page yet.
- [ ] [src/pages/FichePage.vue:142](src/pages/FichePage.vue#L142) — `onPlaceholder('add_review')`. Could route to `/write-review?fiche=:id` instead.
- [ ] [src/components/AppHeader.vue:46-53](src/components/AppHeader.vue#L46-L53) — `onMenuItemClick` keeps an `alert()` fallback for menu items without `to`. All current entries have `to`, so the branch is dead code; either remove the fallback or keep it as a safety net.

### External links

All three are legitimate, with `target="_blank"` + `rel="noopener noreferrer"`:

- [src/components/AppFooter.vue:101](src/components/AppFooter.vue#L101) — `https://github.com` (footer social).
- [src/pages/AccessibilityPage.vue:70](src/pages/AccessibilityPage.vue#L70) — `eur-lex.europa.eu` (EAA legal text).
- [src/pages/AccessibilityPage.vue:78](src/pages/AccessibilityPage.vue#L78) — `w3.org/TR/WCAG21/` (WCAG 2.1 reference).
