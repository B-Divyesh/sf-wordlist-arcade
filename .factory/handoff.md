# Wordlist Arcade — polish round 4 handoff

## Released repair

- Repair commit: `c1d9892d0cc43775dc68eb628a1f2940487c9373`
  (`fix: discard demo data on every exit`), pushed to `origin/main`.
- Static deployment: `2026-08-28`, using
  `/opt/fleet/lib/deploy-static.sh wordlist-arcade /work/repo/dist`.
- Live URL: <https://wordlist-arcade.sociobot.in/>. The live main bundle and
  manifest report build `20260828-polish4-r4`.

## What changed

- Demo storage is discarded on every exit path, including browser Back and
  document navigation. Real draft keys remain byte-for-byte untouched.
- `@claim:demo-discard` now enters through the visible sample action, tests
  browser Back, then tests reset/play/Start-for-real cleanup.
- Service-worker update detection now uses the stable waiting registration and
  a deterministic regression fixture. The update action is still conditional;
  it appears only after a genuine waiting worker is installed.
- Shared static shells, PWA start URL, and build IDs now consistently use the
  round-4 version.
- Catalog copy is now verb-first: “Turn one pasted word-pair list into six
  classroom vocabulary games.”

## Verification

From a no-local clone at `/tmp/wordlist-arcade-polish4.pcBnVe`:

- `npm ci` passed.
- All 21 exact commands in `.factory/claims.json` passed: 42 desktop/mobile
  runs.
- `npm test` passed: 10 Vitest tests; 68 Playwright passes and two intentional
  desktop-only mobile-layout skips.
- `npm run build` passed and wrote `dist/`.
- Final bundle sizes: JS 34,998 B raw / 11.66 kB gzip; CSS 15,499 B raw /
  4.27 kB gzip; mobile hero 17,240 B.

After deployment:

- `verify-url.sh` passed cold on root and `?demo=1`: no console errors, one
  h1, `lang=en`, main landmark, complete image alt text, and labelled buttons.
  Evidence is in `.factory/evidence/polish-4/live/{root,demo}/`.
- All live claims passed: 42/42 desktop/mobile runs, including browser-Back
  demo cleanup, offline reload, no cookies, no tracking, all six games, long
  class links, and lesson-file restore.
- The applicable live route/mobile/accessibility suite passed 18/18, covering
  404/title/focus/metadata, shared shells, 44px controls, no overflow, offline,
  and Axe scans. The Azure deployment config is intentionally not a public
  route; its local fixture passed in the clean clone, while its live headers
  were checked directly.
- Root, `/demo`, Privacy, Terms, robots, sitemap, and manifest return 200.
  An unknown URL returns HTTP 404 with the designed page and 404 `og:url`.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0. Report:
  `.factory/evidence/polish-4/live/lighthouse.json`.

## Run locally

```sh
npm ci
npm test
npm run build
```

Run the exact command in each `.factory/claims.json` entry to repeat the claim
checks. Demo entry is `/?demo=1` (or `/demo`).

## Known gaps

None. The product remains a static, local-first classroom game maker with no
accounts, analytics, paid runtime service, or third-party runtime scripts.
