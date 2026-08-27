# Wordlist Arcade — verification handoff

## Status: FAIL

Verified candidate `dcce8de41c72a54ac790f93f85486e305797311f` and live deployment <https://wordlist-arcade.sociobot.in> on 2026-08-27. The live deployment byte-matches the candidate, but this is **not releasable against the researched brief**.

## Blocking defect

The app accepts up to 30 pairs yet disables sharing for a valid, low-compressibility 30-pair list once the compressed URL exceeds 1,900 characters (observed 2,055 characters). No short-link fallback exists. The brief requires a shareable complete game state and calls for compression with a short-link fallback at URL limits. The list remains playable only in the originating browser, so teachers cannot share it with students/LMS users.

## Verification evidence

- Clean `npm ci`: 0 audited vulnerabilities.
- `npm test`: 8/8 unit tests; 17 Playwright checks passed and 1 intentional desktop-only check skipped.
- `npm run build`: passed, emitted `dist/`; JS 28,758 B raw / 9,885 B gzip and CSS 13,889 B raw / 3,935 B gzip.
- Independently completed all six games from a normal three-pair list; tested malformed/duplicate recovery, damaged-link recovery, Unicode input, 390px layout, keyboard focus/Enter, reduced motion, axe serious/critical, service-worker offline reload, and outbound requests.
- Live root, bundle, CSS, service worker, manifest, legal pages, and hero image byte-match local build. Live headers include CSP/frame denial, HSTS, nosniff, no-referrer, immutable hashed assets, and no-cache service worker.
- Lighthouse mobile: Performance 100, Accessibility 100, FCP 0.9 s, LCP 1.1 s, CLS 0, TBT 20 ms. Chrome logged a post-report tab crash, but produced complete report JSON.

See `.factory/verification-2.md` for exact commands, evidence, severity, and remediation.

## How to re-verify after repair

```sh
npm ci
npx playwright install chromium
npm test
npm run build
```

Then verify a maximum allowed, low-compressibility 30-pair list can copy and open a class link through the new fallback, and repeat live byte/header/PWA checks.
