# Wordlist Arcade v1 handoff

## What shipped

- A production Vite + vanilla TypeScript static application at `/`.
- One paste-first maker for 3–30 `word — meaning` pairs, with live parsing,
  friendly line-level errors, duplicate detection, a sample list, a local draft,
  and a clear-data action.
- Six complete games from the same list: Match up, Word strike, Anagram lab,
  Word reveal, Memory grid, and Quiz race. Every mode has scoring/progress,
  completion and replay states, native keyboard controls, and responsive play.
- Compressed, versioned list state inside the URL hash using `lz-string`. Links
  open directly in the selected game and never upload their vocabulary payload.
- Projector fullscreen, mobile/per-student play, an explicit malformed-link
  recovery state, and an offline status banner.
- Installable PWA metadata and a versioned service worker that caches the shell
  and same-origin resources after the first online visit.
- Original generative-geometry art direction, responsive AI-generated hero art,
  hand-authored icons/geometry, and documented prompt/provenance in
  `.factory/design.md` and `assets/src/`.
- Plain-language `/privacy/` and `/terms/` pages, Azure Static Web Apps routing
  and security headers, robots/sitemap files, MIT license, and full README.

## How to run and verify

```sh
npm install
npx playwright install chromium
npm test
npm run build
```

The required build command is exactly `npm run build`. It produces
`dist/index.html` plus the legal pages and static assets under `dist/`.

Verification completed on 27 August 2026:

- `npm test`: 8 unit tests passed; 11 browser project cases passed with one
  intentional desktop skip for the mobile-only overflow assertion.
- Browser coverage: desktop Chrome and 390×844 mobile; all six routes; complete
  Match up round; malformed-list and malformed-link recovery; offline reload;
  zero console errors; no horizontal overflow.
- Playwright axe: zero serious or critical violations on the landing and game
  screens.
- Lighthouse mobile: Performance 99, Accessibility 100, Best Practices 100,
  SEO 100. LCP 1.6 s, CLS 0, Total Blocking Time 70 ms in the final local audit.
- Production payload: 27 KB JavaScript / 9.3 KB gzip; 13.5 KB CSS / 3.8 KB
  gzip; 17 KB mobile hero WebP; 49 KB desktop hero WebP. These are well below
  the 200 KB JS, 50 KB CSS, and 300 KB hero budgets.
- `npm audit`: zero known vulnerabilities.

## Operational notes and known gaps

- The product is intentionally serverless. Shared URLs are compressed but are
  not shortened; the 30-pair cap keeps normal classroom links practical. A
  future first-party short-link service can be added if LMS URL limits prove
  restrictive.
- Offline use begins after one successful online load; this is the normal PWA
  installation boundary.
- No analytics were added, so the brief's return/share-rate success measures are
  not observable inside the app. Aggregate, privacy-preserving counts can be
  added at the hosting edge later without introducing student tracking.
- Word reveal offers A–Z letter keys plus a whole-word field, so words in any
  writing system remain solvable even when their letters are not on that grid.

## Suggested next steps

Validate the six modes in two real classrooms, especially projector text size
and LMS link handling. The stated later printable/PDF add-on remains deliberately
out of scope for this free v1.
