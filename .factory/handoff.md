# Wordlist Arcade — polish round 6 handoff

## Outcome

Round 6 repairs are complete and deployed to https://wordlist-arcade.sociobot.in.

The remaining review finding, F-6-1, is now proved end to end: after its first
online visit, a normal saved word list and a copied Match up game link reload
offline without attempting a network request. The offline claim and demo
documentation now describe that exact behavior rather than only a demo-shell
reload.

Product repair commits `89d4c6b` and `6d92774` are pushed to `main`. The latter
keeps the service-worker update regression isolated from unrelated browser
tests; it does not change the shipped app. This handoff record follows in the
documentation commit.

## How to run

```sh
npm ci
npm run build
npm test
npm run test:claims -- --grep '@claim:'
npm run preview
```

Open `http://localhost:4173/?demo=1` to enter the isolated sample-data mode.
See `.factory/demo.md` for its sample, storage namespace, reset behavior, and
offline verification path.

## Verification evidence

- Clean clone of pushed `main` at `6d92774`: `npm ci && npm run build` passed.
  The static output is `dist/`, with `index.html` at its root. Main JavaScript
  is 11.75 KB gzip; CSS is 4.27 KB gzip.
- Clean-clone claims: `PLAYWRIGHT_BASE_URL=http://127.0.0.1:4181 npm run
  test:claims -- --grep '@claim:'` passed all 50 projects/tests, including all
  26 uniquely tagged claim tests.
- Clean-clone full suite: `npm run test:node-compat` passed; `npm test` passed
  11 Vitest tests and 76 Playwright tests, with 2 intentional
  project-specific skips.
- Local shell checks passed for `/` and `/?demo=1` with
  `/opt/fleet/lib/verify-url.sh`; its title, language, main landmark, image
  alt handling, named controls, and console-error checks all passed.
- Static deployment used `/opt/fleet/lib/deploy-static.sh wordlist-arcade
  /work/repo/dist`.
- Cold live checks passed at https://wordlist-arcade.sociobot.in/ and
  https://wordlist-arcade.sociobot.in/?demo=1. The deployed root served the
  round-6 hashed bundle; unknown routes served the designed 404 with HTTP 404;
  the manifest and required security headers were present.
- Live claims: `PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in npm
  run test:claims -- --grep '@claim:'` passed all 50 projects/tests.
- Live route, keyboard/focus, mobile, game, input-error, offline, and axe
  regression sweep passed 22 tests with 2 intentional mobile/desktop skips.
  Evidence is retained in `.factory/evidence/polish-6/`, including cold live
  root and demo mobile screenshots and verifier reports.

## Documentation

- `.factory/polish-6.md` maps every historical review finding to its repair and
  evidence.
- `.factory/claims.json` has one observable claim test per public claim.
- `.factory/catalog-description.txt` is now a verb-first, plain-language
  one-line description.

## Known gaps and next steps

None. All review findings, including minor and historical items, were checked
against the deployed site in this round.
