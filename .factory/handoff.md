# Wordlist Arcade — adversarial review 3 handoff

## Delivered

- Added `.factory/review-3.md` with the cold mobile/desktop read, full landing
  and README copy counts, demo/privacy checks, complete claim results,
  cumulative history verification, structure crawl, missed-leverage decision,
  and FAIL verdict.
- Did not modify product code, configuration, tests, or production.

## Verification

- Reviewed live production in fresh Chromium contexts at 390×844 and
  1440×1000.
- Cloned base `09700294000c880ad43683d12984d6932657e66c` into a new temporary
  directory and ran all 14 exact commands from `.factory/claims.json`: 14/14
  passed, covering 28 desktop/mobile runs.
- In the fresh clone, `npm test` passed 10 Vitest tests and 52 Playwright tests
  with two intentional project-selection skips.
- In the fresh clone, `npm run build` passed and produced `dist/`; main JS is
  11.74 kB gzip.
- Against production, the selected claim, route, touch-target, and Axe suite
  passed 42 tests with two intentional project-selection skips.
- Crawled all discovered links and checked metadata on root, demo, Privacy,
  Terms, 404, and an unknown route. Ordinary destinations resolved; the
  intentional unknown route returned 404.
- Exercised live Reset/play/Back/Start-for-real isolation, same-origin network
  behavior, offline reload, and cookie state.

## Known gaps and next steps

Verdict is **FAIL**. The blocking findings are:

1. Valid accepted terms over 32 characters can crash Anagram even though the
   UI says all games are ready.
2. The earlier “LMS” jargon finding remains in long-link copy.
3. Root, game/demo, legal, and 404 routes still use different header/footer
   contents.

Major findings cover unregistered game-behavior and cookie claims and the
environment-dependent **Share lesson** action. Minor findings cover “unlock”
copy and hidden mobile control labels. Exact reproductions and fixes are in
`.factory/review-3.md`.
