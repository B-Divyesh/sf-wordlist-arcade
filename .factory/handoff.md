# Wordlist Arcade — polish round 3 handoff

## Delivered

- Repaired every open finding from reviews 1–3, including the accepted-term
  Anagram crash, stale game timer callbacks, remaining jargon, shell
  inconsistency, unregistered behavior/privacy claims, Web Share dependency,
  empty-state wording, and mobile-only control labels.
- Added seven observable claims: six individual game-behavior claims and a
  complete no-cookie flow claim. The claim register now has 21 unique entries.
- Kept the warm-paper geometric classroom identity while making root, games,
  Privacy, Terms, and 404 use one consistent Wordlist Arcade shell.
- Updated the catalog line to: “Make six classroom vocabulary games from one
  pasted word-pair list.”

The repair is commit `4f514b2dc7dabea9a06a22b2e03a5532ca9f178a`, pushed to
`main`, and deployed as `284232e7-7afa-42c5-ab7c-266dff315bb0` at
<https://wordlist-arcade.sociobot.in/>.

## How to run and verify

```sh
npm ci
npm test
npm run build
npm run test:claims -- --grep @claim:<claim-id>
```

The direct isolated sample is
<https://wordlist-arcade.sociobot.in/?demo=1>. It uses `demo:` browser-storage
keys, shows Reset demo and Start for real, and never reads or writes a real
draft while active.

## Exact verification evidence

- New shallow clean clone: `npm ci`, then all 21 exact test commands listed in
  `.factory/claims.json` passed. Each runs desktop and mobile, for 42 passing
  claim runs.
- In that clean clone, `npm test` passed 10 Vitest tests and 68 Playwright
  tests, with two intentional project-selection skips. `npm run build` passed
  and produced `dist/`.
- Final build bundles: main JavaScript 34.89 kB raw / 11.62 kB gzip; CSS
  15.50 kB raw / 4.27 kB gzip.
- Cold live `verify-url.sh` checks passed for root (757 ms) and direct demo
  (713 ms): title, `lang`, one `h1`, `main`, zero missing image alts, zero
  unlabeled buttons, and zero console errors.
- Live deployed behavior sweep: 12/12 selected repair, privacy, isolation,
  offline, link, and six-game claims passed on desktop. The live route/mobile/
  accessibility sweep passed desktop 2/2 applicable checks (one expected
  mobile-only skip) and mobile 3/3; this includes zero axe violations across
  all demo games.
- Cold live route checks: `/`, `/?demo=1`, `/privacy/`, `/terms/`, and
  `/404.html` returned 200. An unknown route returned the designed 404 with
  the correct title, heading, home link, navigation, footer, and metadata.
- Live headers include CSP, `Referrer-Policy: no-referrer`, and
  `X-Content-Type-Options: nosniff`.
- Live mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; FCP 1.0 s, LCP 1.1 s, TBT 80 ms, CLS 0. The raw report and
  screenshots are in `.factory/evidence/polish-3/live/`.

See `.factory/polish-3.md` for the required finding-by-finding mapping,
specific test names, screenshot paths, and live URLs.

## Known gaps

None. Every blocking, major, minor, and inherited finding is resolved and
verified in the clean clone and on the deployed site.
