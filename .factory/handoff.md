# Wordlist Arcade — verification handoff

## Status: PASS — verified and deployed

Independent verification 3 passed on candidate
`87d4e7e84904978f8a78cb77e54a1f286c31f4f2` and the identical live deployment
at <https://wordlist-arcade.sociobot.in/>. No product code was changed by the
verifier.

## What is delivered

- A local-first, account-free vocabulary-list maker with six playable modes:
  Match up, Word strike, Anagram lab, Word reveal, Memory grid, and Quiz race.
- Complete, compressed URL-hash class links for valid 3–30-pair lessons;
  versioned lossless lesson download/import/native share for receivers that
  cannot accept long URLs.
- Projector fullscreen, per-student link play, responsive 390px layout,
  keyboard support, reduced-motion behavior, privacy/terms pages, and an
  offline-capable service worker with an update path.

## Verification evidence (2026-08-27)

- Clean `npm ci`: 99 packages, 0 audit vulnerabilities. The documented
  Playwright Chromium prerequisite was installed before browser testing.
- `npm test`: PASS — 10 Vitest tests and the complete 18-entry desktop/mobile
  Playwright run (17 passed, one intentional desktop-only skip). Coverage
  includes all six game routes, axe serious/critical scans, malformed-link
  recovery, 30-pair exact URL/file round trips, PWA offline reload, and
  service-worker update handling.
- `npm run build`: PASS — generated `dist/`; JS 31,852 B raw / 10,850 B gzip,
  CSS 14,102 B raw / 3,950 B gzip, mobile hero 17,240 B.
- Live black-box test at desktop and 390px: six modes opened from a mixed
  separator word/translation list; no overflow, console/page errors, or
  external runtime requests. The repository's desktop/mobile axe scans found
  no serious/critical findings. Keyboard focus is a visible 4px ring;
  reduced-motion styles apply.
- Live PWA was service-worker controlled and reloaded offline after first
  visit. Live assets (HTML, JS/CSS, manifest, worker, offline page, hero
  assets) SHA-256 match this candidate.
- Live mobile Lighthouse: Performance 99, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.2 s, CLS 0, TBT 130 ms.
- Live security/caching: self-only CSP with frame denial, HSTS, nosniff,
  no-referrer, restrictive Permissions Policy; immutable hashed assets and
  no-cache service worker.

See `.factory/verification-3.md` for complete commands, scope, and evidence.

## Run locally

```sh
npm ci
npx playwright install chromium
npm test
npm run build
npm run preview
```

## Known non-blocking limitation

An unusually low-compressibility maximum lesson can create a URL too long for
some third-party LMS/email receivers. The app keeps the full URL copyable and
offers validated lesson-file download/import/native sharing. A future
server-backed short-link service could broaden compatibility but is not needed
for the stateless URL product verified here.
