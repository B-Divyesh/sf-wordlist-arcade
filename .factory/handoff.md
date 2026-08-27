# Wordlist Arcade — repair handoff

## Status: ready for deployment

This repair addresses the independent verifier findings from
`9e9b8cffe8e14510aa356d2f4f7b10df6289a54d` without changing the six-game
product scope or its local-only privacy model.

## What changed

- Removed the two serious `aria-prohibited-attr` failures. Word Reveal now has
  a semantic text alternative for its visual word rail, and Quiz Race exposes
  its race track as a named `progressbar` with complete value information.
  Other named game groupings now use explicit `group` roles as well.
- Added Playwright + axe regression coverage for every populated game state:
  Match up, Word strike, Anagram lab, Word reveal, Memory grid, and Quiz race.
  The check runs on desktop and the 390px mobile project.
- Added a 1,900-character class-link safety limit. Oversized lists remain fully
  playable and private in the current browser, but copy/share is disabled with
  a plain-language warning about common LMS/email URL limits.
- Completed PWA install/update behavior: 192px, 512px, and 512px maskable PNG
  icons; a versioned manifest start URL; a generated versioned precache worker;
  offline fallback; and an in-app update prompt. Updates wait until the teacher
  selects **Update now**, then reload under the new worker.
- The Vite build writes `dist/sw.js` with the actual hashed CSS/JS shell in its
  precache list. `dist/staticwebapp.config.json` is present at the built root
  with CSP, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, no-cache worker
  handling, and immutable caching for `/assets/*`.
- Added original PWA icon sources/raster derivatives. Their provenance is
  recorded in `.factory/design.md`; no third-party artwork or runtime service
  was added.

## Verification run

```sh
npm ci
npx playwright install chromium
npm test
npm run build
```

Results on 2026-08-27:

- `npm test`: 8/8 unit tests passed; 17 browser checks passed across desktop
  and mobile, with one intentional desktop-only skip.
- Axe found no serious or critical violations on the home screen and all six
  populated game screens.
- The browser suite verified the six game routes, a complete Match-up round,
  malformed/damaged link recovery, 390px overflow, local share-length warning,
  offline reload after first visit, manifest/config output, and a byte-changed
  waiting-worker update prompt that applies successfully.
- `npm run build` passed and produced `dist/`. Final initial bundle: JS 28.76
  KB raw / 9.93 KB gzip; CSS 13.89 KB raw / 3.90 KB gzip.

## Deployment follow-up

The factory owns deployment, so this worker did not alter production. A header
inspection of `https://wordlist-arcade.sociobot.in/` before deployment still
returned the previous response (no CSP or frame header and 30-second cache),
as expected. After deploying this commit, verify the live root and a hashed
`/assets/*` response with:

```sh
curl -sSI https://wordlist-arcade.sociobot.in/
curl -sSI https://wordlist-arcade.sociobot.in/assets/<hashed-file>.js
```

Expected: CSP containing `frame-ancestors 'none'`, `X-Frame-Options: DENY`,
and `Cache-Control: public, max-age=31536000, immutable` for the hashed asset.
Then perform one installed-PWA update confirmation on a device/browser against
the deployed build.
