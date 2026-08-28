# Wordlist Arcade — adversarial review 5 handoff

## Outcome

Review 5 is complete at candidate
`9a3696c27d189dcad8400085d93dcc29baa93dae`.

**Verdict: FAIL.** The full report is in `.factory/review-5.md`. No product code
was changed.

Two findings are blocking:

- `F-5-1 / F-04.17`: the local-device test seeds storage itself instead of
  proving that a typed real draft is saved and restored.
- `F-5-2 / F-04.21`: the privacy statement that URL fragments are not sent to
  the server lacks a registered request-level assertion.

Six additional findings cover lesson-file privacy, child-data and no-grading
claims, the README Node-version claim, two noun-only toolbar buttons, and
unlabelled external contact links.

## Verification performed

- Cold production reads in fresh 390×844 and 1440×1000 Chromium contexts.
- One-click demo, realistic sample, banner, Reset, Start for real, browser Back,
  real/demo storage isolation, keyboard entry, reduced motion, 200% text, and
  offline reload checks.
- Every exact command in `.factory/claims.json` from no-local clone
  `/tmp/wordlist-arcade-review5.zRp5IU`: 21/21 commands and 42/42 desktop/mobile
  executions returned success.
- `npm test` in that clone: 10 unit tests and 68 applicable browser tests
  passed; two intended project skips.
- `npm run build`: passed and produced `dist/`; entry JavaScript is 34,998
  bytes raw and 11.66 kB gzip.
- Production claim sweep: 42/42 passed.
- Production non-claim route/accessibility sweep: 22 passed, two intended
  desktop-only skips.
- `/opt/fleet/lib/verify-url.sh` passed root and demo with no console errors,
  missing alt text, or unnamed buttons.
- Route metadata, unknown-route 404, internal/external destinations, security
  headers, manifest MIME, and exact live/build asset hashes were checked.
- All earlier reviews, polish reports, verification reports, and the previous
  handoff were rechecked finding by finding.

## How to repeat

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in npx playwright test --grep '@claim:' --workers=2
```

Run each `test` string in `.factory/claims.json` separately from a no-local
clone to repeat the strict claim audit.

## Work left

Implement and register the concrete fixes in `F-5-1` through `F-5-8`, then
repeat the entire review from fresh browser contexts and a new clean clone.
