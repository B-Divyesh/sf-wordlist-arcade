# Wordlist Arcade — review 4 handoff

## Work completed

This was a read-only adversarial review. No product code was changed. The
review is recorded in `.factory/review-4.md`.

## Verification performed

- Fresh live Chromium checks at 390×844 and 1440×1000: cold first screen,
  demo entry, Reset, Start for real, storage isolation, network/cookies,
  offline reload, routes, metadata, links, shell consistency, and 404.
- Fresh no-local clone at `/tmp/wordlist-arcade-review4.6fSuAB`: `npm ci`, all
  21 exact claim commands from `.factory/claims.json`, `npm test`, and
  `npm run build`.
- All declared claim commands completed in desktop and mobile. `npm run build`
  passed and generated `dist/` (34.89 kB raw / 11.62 kB gzip JS; 15.50 kB raw /
  4.27 kB gzip CSS).

## Known gaps / release blockers

1. Browser Back from demo returns to the normal page but leaves `demo:` local
   storage keys. This violates discard-on-demo-exit; Start for real works, but
   it is not the only exit path.
2. `npm test` fails in both desktop and mobile on the service-worker update
   notification test because **Update now** does not appear after changing the
   worker. The focused reproduction is:

   ```sh
   npx playwright test --project=desktop --grep 'waiting service-worker update'
   ```

See `.factory/review-4.md` for exact evidence and required fixes. The current
review verdict is **FAIL**.
