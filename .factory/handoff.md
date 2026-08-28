# Polish-1 handoff — Wordlist Arcade

## What changed

- Replaced the first-screen copy with the required teacher-facing job,
  sample action, and three plain facts.
- Added `/demo` and `/?demo=1`. They open a playable photosynthesis Match up
  game, use only `demo:wordlist-arcade-*` storage, show a persistent sandbox
  banner, and provide Reset demo and Start for real.
- Added nine declared, unique claim checks in `.factory/claims.json` and
  `tests/app.spec.ts`. They exercise the demo path, storage isolation,
  same-origin requests, the 30-pair limit, class links, and offline reload.
- Moved game navigation to real `/play/<game>#d=...` URLs. Titles, canonical
  metadata, live announcements, focus restoration, browser Back, and the
  designed unknown-route page are covered by browser tests.
- Added per-route social/canonical metadata, Apple touch icon, a 1200×630
  social preview derived from the original project artwork, sitemap demo URL,
  legal-page shell links, build attribution, and Azure 404 override.
- Preserved the paper-and-marker geometric classroom system. Mobile keeps the
  demo action visible, stacks facts/actions intentionally, and has no tested
  horizontal overflow.

## Verify

From a clean install on 2026-08-28:

```sh
npm ci
npm run build
npm run test:claims -- --grep @claim
npm test
```

Evidence:

- `npm ci`: installed 99 packages; audit reported 0 vulnerabilities.
- `npm run build`: passed; wrote `dist/` with `dist/index.html` at its root.
  Main JS is 35,096 B raw and CSS is 15,075 B raw. The 390px hero is 17,240 B.
- Clean-install claim run: 18 passed (nine claims in desktop and mobile).
  The manifest has one `@claim:<id>` test tag for each of its nine entries.
- Full `npm test`: Vitest 10/10 passed; Playwright 37 passed with one expected
  desktop-only mobile-overflow skip. Axe scans in that suite reported no
  serious or critical findings on the landing page and all six populated games.
- The route/focus/metadata/404 test passed in desktop and mobile. The complete
  browser suite also covers console errors, class-link recovery, offline PWA
  reload, reduced motion, and 390px overflow.
- A Lighthouse CLI attempt could not connect to the preinstalled Playwright
  Chromium in this container. Asset budgets and automated Axe coverage passed;
  no product behavior is blocked by that environment limitation.

## Demo and deployment

Use `/?demo=1` or `/demo`. See `.factory/demo.md` for sample data, reset, and
storage details. Static deployment remains Azure Static Web Apps; the generated
`dist/` and `public/staticwebapp.config.json` are the deployment inputs.

## Known gaps

No known blocking review findings remain. The only verification limitation is
the container-specific Lighthouse browser connection noted above.
