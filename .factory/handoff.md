# Wordlist Arcade — polish round 2 handoff

## Delivered

- Closed all findings in `.factory/review-1.md`, `.factory/polish-1.md`, and
  `.factory/review-2.md`; the one-line mapping is in `.factory/polish-2.md`.
- Fixed the demo Reset double-prefix defect. **Start for real** now clears all
  demo data after Reset/play/Back while preserving real drafts exactly.
- Added registered `demo-discard` and `long-class-link` claims. There are 14
  claims and exactly one `@claim:<id>` test for each.
- Completed 404 `og:url`, 44px mobile targets, valid demo-banner semantics,
  shared game navigation, copy/README rewrites, and manifest MIME handling.
- Preserved the warm-paper, marker-outline, geometric classroom identity.
- Updated `.factory/catalog-description.txt` to a 74-character verb-first line.

## Exact verification

Clean clone of commit `7788661`:

- `npm ci`: 99 packages installed; 0 vulnerabilities.
- Every exact `test` command from `.factory/claims.json`: 14/14 passed;
  28/28 desktop/mobile claim runs.
- `npm test`: 10/10 Vitest tests and 52 Playwright passes; two intentional
  project-selection skips.
- `npm run build`: passed and produced `dist/index.html`.

Final-tree checks after the manifest MIME addition:

- `npm run build`: passed.
- `npx playwright test --grep 'built PWA files'`: 2/2 passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ ...`: passed with no
  console errors, one h1, one main, `lang=en`, complete image alt text, and no
  unnamed buttons.
- Playwright axe: zero violations on the demo shell and all six demo games;
  zero serious/critical violations across the complete game matrix.
- Local Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.6 s, TBT 0 ms, CLS 0.
- Build budgets: JS 35.75 kB raw / 11.74 kB gzip; CSS 15.77 kB raw /
  4.29 kB gzip; mobile hero 17.24 kB.

## Deployment and cold live check

- Pushed repair commits `7788661`, `47abfab`, and `b7e7e87` to `origin/main`.
- Deployed `dist/` through `/opt/fleet/lib/deploy-static.sh`.
- Final Azure deployment id: `47c16cd2-a938-4383-a1c6-83c859199673`.
- Live URL: <https://wordlist-arcade.sociobot.in/>.
- After the final deployment, live claim suite: 28/28 passed.
- Live structure/accessibility suite: 16/16 applicable runs passed, with two
  intentional project-selection skips.
- Root, `/demo`, `/privacy/`, and `/terms/` return 200. An unknown route
  returns 404 and includes `og:url=https://wordlist-arcade.sociobot.in/404`.
- The live manifest returns `application/manifest+json`; hashed assets are
  immutable and `sw.js` is no-store.
- Live Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Live cold verification reports and screenshots are under
  `.factory/evidence/polish-2/live/`.

## How to run

```sh
npm ci
npm run dev
npm test
npm run build
```

Run live checks without starting a local preview:

```sh
PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in npm run test:claims -- --grep '@claim'
```

## Known gaps and next steps

None. No finding of any severity remains unresolved. Physical-projector
fullscreen behavior still depends on the classroom browser, while the browser
API invocation is covered by `@claim:fullscreen`.
