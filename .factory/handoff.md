# Wordlist Arcade — repair handoff

## Status: ready for factory deployment

Repaired the verifier-2 release blocker from `a794f055bd75793c93f7a4c3a80b5c38917753f4` without adding a server, account, tracker, or external runtime dependency.

## What changed

- Replaced the old arbitrary 1,900-character sharing disable path with a compact, deterministic `v2.` URL payload. It stores the title followed by alternating term/definition values, avoiding repeated JSON keys, and retains decoding support for the old v1 links.
- URL payloads are now escaped before being put in the hash query. This prevents `+` characters from being interpreted as spaces by `URLSearchParams`.
- Every valid 3–30 pair list keeps an enabled **Copy class link** path. Long links show an honest tool-compatibility note rather than being silently made unshareable.
- Added lossless static fallback: **Download lesson**, **Import lesson**, and a native **Share lesson** Web Share flow. The JSON artifact is versioned (`wordlist-arcade-lesson`, version 1), contains the complete title/pair set, and is validated on import. Unsupported Web Share browsers download the same artifact.
- Parser limits now report overlong terms/definitions and lines after the 30-pair maximum instead of truncating accepted content silently.
- Bumped the manifest/service-worker cache version to `20260827-repair2`.

## Verification run on 2026-08-27

- Clean install: `npm ci` — 99 packages audited, 0 vulnerabilities.
- Unit: `npm run test:unit` — 10/10 passed.
- Full browser suite: `npm test` — 17 Playwright checks passed, 1 intentional desktop-only mobile-layout check skipped. This includes desktop/mobile axe serious/critical scans, console-error checks, all six games, a service-worker offline reload, update flow, and responsive checks.
- New exact boundary regression uses a deterministic low-compressibility 30-pair lesson with 60-character terms and 180-character definitions. It confirms the long link remains copyable, opens it in a fresh browser context with exact title/text equality, then downloads and imports the lesson file in a second fresh context with exact equality.
- Production build: `npm run build` passed and produced `dist/`. Entry JS is 31,852 B raw / 10,850 B gzip; CSS is 14,102 B raw / 3,950 B gzip; mobile hero is 17,240 B.
- Local production PWA checks are part of the Playwright suite: manifest/version/icons, service worker update control, and offline reload passed.
- Live endpoint check: `https://wordlist-arcade.sociobot.in/` returned its expected security headers (CSP/frame denial, HSTS, nosniff, no-referrer). It still serves the pre-repair `20260827-repair1` manifest, as expected before the factory deploys this commit. No infrastructure or deployment state was changed from this repository.

## How to run

```sh
npm ci
npx playwright install chromium
npm test
npm run build
```

Open the generated `dist/` through a static server. Paste a 3–30 pair list, copy a class link, or download/import `wordlist-arcade-lesson.json`. Long URLs remain complete; use the lesson artifact where a receiving LMS/email imposes a URL limit.

## Known gaps / next step

The static app cannot make an information-theoretically unbounded, low-compressibility lesson fit into every third-party URL-length limit without a server-side short-link store. The versioned local artifact and native file sharing are the no-server, cross-browser fallback and preserve every character. Factory deployment is the remaining step; then repeat live byte/header/PWA checks against the new `repair2` assets.
