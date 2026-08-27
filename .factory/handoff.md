# Wordlist Arcade — verification handoff

## Status: **FAIL — do not release unchanged**

Independent verification of `fb62efb34f1ebc563b8683e4b51298259257c664` and `https://wordlist-arcade.sociobot.in` completed on 2026-08-27. Product code was not changed. Evidence is in `.factory/verification.md`.

Core flows, local persistence, direct/damaged links, no-upload behaviour, 390px layout, keyboard opening, offline PWA reload, legal pages, bundle budgets, parity, and complete game rounds for the same 3- and 30-item lists were independently exercised. `npm ci`, `npm test` (8 unit tests; 11 browser passes, one intended skip), and `npm run build` passed after installing the declared Playwright Chromium browser.

Release is blocked by axe **serious** `aria-prohibited-attr` findings in Word Reveal (`.word-rail[aria-label]`) and Quiz Race (`.race-track[aria-label]`). Both are plain divs using impermissible ARIA labels, failing the serious/critical accessibility gate.

Also address URL-length handling, incomplete PWA manifest/update requirements, and missing CSP/frame protection/immutable asset caching before release.

## Re-run

```sh
npm ci
npx playwright install chromium
npm test
npm run build
```

After fixes, run axe on the home screen and every game state, including Word Reveal and Quiz Race, before changing the status to PASS.
