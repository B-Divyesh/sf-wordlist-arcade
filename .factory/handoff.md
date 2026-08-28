# Review-2 handoff — Wordlist Arcade

## Delivered

- Completed an adversarial second-round review of production at 390×844 and
  1440×1000 without changing product code.
- Wrote `.factory/review-2.md` with verdict **FAIL**, 16 findings, the complete
  cold landing/README copy audit, all registered claim results, every prior
  finding re-check, structure/accessibility evidence, and missed leverage.
- Confirmed three blocking regressions: demo data can survive Start for real
  after Reset, the maximum-length class-link promise remains outside the claims
  register, and the 404 route has no `og:url`.

## Verification performed

- Fresh production Chromium contexts at mobile and desktop sizes.
- One-click demo, realistic sample, Reset, Start for real, seeded real-storage
  isolation, same-origin request capture, and offline reload.
- Production title/h1/canonical/social metadata checks, deep-link/Back/focus
  checks, HTTP status checks, and a crawl of every discovered link.
- `/opt/fleet/lib/verify-url.sh` against production.
- axe-core on root, demo, Privacy, Terms, 404, and all six demo games.
- Every exact command in `.factory/claims.json` from a clean local clone at
  `fcc954caaa950cdf213fc97cf0d007e4e3563460`: all 24 desktop/mobile claim runs
  passed.
- Clean-clone `npm test`: 10 unit tests and 47 browser tests passed, with one
  intentional project skip.
- Clean-clone `npm run build`: passed; `dist/` produced; entry JavaScript
  11.70 kB gzip.

## Remaining work

Resolve every finding in `.factory/review-2.md` and repeat the full review. The
current automated suite is green but does not cover the failing combined demo
sequence or fully register the long-link claim. No product, deployment, DNS,
or infrastructure files were changed during this review.
