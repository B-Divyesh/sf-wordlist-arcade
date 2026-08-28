# Wordlist Arcade — adversarial review 6 handoff

## Outcome

No product code was changed. Review and handoff documentation were added for
the live production audit. The review verdict is **FAIL** because F-6-1 finds
that the offline claim promises saved-list and copied-game-link behaviour while
its registered test proves only an offline reload of the shipped demo.

See `.factory/review-6.md` for the exact evidence and concrete test/copy fix.

## Verification completed

- Cold live Chromium checks at 390px and desktop: clear job/audience/actions,
  no console errors, and a distinct classroom-game visual identity.
- Live demo: one-click playable photosynthesis Match up; persistent demo
  controls; Reset; Start for real; isolated `demo:` local-storage keys; real
  draft unchanged; same-origin-only requests; warmed demo offline reload.
- Live route/crawl check: root, query demo, `/demo`, game route, Privacy,
  Terms, 404, metadata, canonical/OG/favicons, robots, sitemap, manifest,
  header/footer, h1 focus, route announcements, and Back navigation.
- Fresh clone at `/tmp/wordlist-arcade-review6-clean`: `npm ci` and every exact
  command from `.factory/claims.json` passed. The offline command's inadequate
  scope is documented as F-6-1, so it does not satisfy the no-untested-claim
  acceptance condition.
- The same clean clone passed `npm test` (11 unit tests and the 78-test
  Playwright run, including two intended mobile/desktop skips) and `npm run
  build`. The built entry JavaScript is 11.75 kB gzip and CSS is 4.27 kB gzip.

## Remaining work

Expand `@claim:offline-demo` to test a real saved draft and copied game link
while offline, or narrow the public offline wording to the tested demo case.
Then repeat the fresh-clone claim audit and a live offline check.
