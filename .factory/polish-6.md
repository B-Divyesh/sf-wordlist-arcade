# Polish round 6 — cumulative zero-finding repair

Repair commits `89d4c6b` (`fix: prove offline drafts and shared games`) and
`6d92774` (`test: isolate service worker fixture`) are pushed to `main` and
deployed to <https://wordlist-arcade.sociobot.in>.

## Round-six repair

F-6-1 found that the offline claim was broader than its proof. The single
`@claim:offline-demo` test now creates a real three-pair draft through the
maker, copies and opens its Match up link online, disables the network, reloads
the exact saved draft, opens the exact copied game link, verifies a playable
word button, and asserts no request bypasses the service worker. The claim
register, demo documentation, copy audit, cache version, and build ids now
match this proof. The worker-update fixture temporarily swaps `dist/sw.js`, so
the one-file Playwright suite is serial to eliminate its concurrency race while
continuing to execute the regression.

## Cumulative finding map

Every comma-separated identifier below is individually resolved by its row.
Clean evidence is from `/tmp/wordlist-arcade-polish6-final.zXWChd` at
`6d92774`. `Live claims` is the 50/50 deployed claim sweep. Cold root/demo
screens and reports are in `evidence/polish-6/{local,live}/{root,demo}/`.

| Finding IDs | Change | Evidence |
| --- | --- | --- |
| F-01 | Job-first heading, teacher audience, real/sample actions, and facts remain above the fold. | Live root report and `live/root/screenshot-mobile.png`. |
| F-02, F-2-7–F-2-16, F-3-2, F-3-7 | Plain, consistent teacher copy, external label, and task-named controls/headings remain. | `.factory/copy-audit.md`; cold live screens. |
| F-03, F-2-1, F-4-1 | One-click isolated demo, reset, Start for real, Back/pagehide disposal, and real-draft preservation remain. | `@claim:sample-demo`, `@claim:demo-discard`; live demo screen. |
| F-04 | `claims.json` contains one tagged observable test per current claim. | Clean 50/50 claim runs; tag audit. |
| F-04.01, F-04.08, F-3-1 | All six games, including Anagram, accept valid 60-character terms. | `@claim:six-games`; Live claims. |
| F-04.02, F-04.10 | Six-game, free-use, and no-account facts are separate claims. | `@claim:six-games`, `@claim:free-to-use`, `@claim:no-account`. |
| F-04.03, F-04.11, F-04.17, F-5-1 | Typed real draft saves, reloads, clears, and stays isolated from demo data. | `@claim:local-device`. |
| F-04.04 | Full demo runtime traffic is first-party only. | `@claim:no-tracking`. |
| F-04.05 | Invalid rows announce a useful parse error as typed. | `@claim:list-check`. |
| F-04.06, F-3-6, F-5-3 | Lesson download/import restores exact rows without list-bearing action requests. | `@claim:lesson-file`, `@claim:lesson-file-local`. |
| F-04.07, F-04.13 | 31st pair is rejected while 30 valid pairs remain usable. | `@claim:pair-limit`. |
| F-04.09, F-04.14, F-04.21, F-5-2 | Class links restore fresh-context state and omit their fragment from navigation traffic. | `@claim:class-link`, `@claim:fragment-not-sent`. |
| F-04.12 | README retains the same tested six-game wording. | README audit; `@claim:six-games`. |
| F-04.15, F-2-2 | Maximum 30-pair link round-trips; lesson-file fallback is deterministic. | `@claim:long-class-link`, `@claim:lesson-file`. |
| F-04.16, F-3-8, F-5-7 | Mobile controls visibly name their result; fullscreen calls the browser API. | `@claim:fullscreen`; live demo mobile screen. |
| F-04.18, F-6-1 | Offline proof now covers exact saved real drafts and copied game links with no network request. | `@claim:offline-demo`; Clean and Live claims. |
| F-04.19, F-3-5, F-5-4, F-5-5 | Precise account, tracking, cookie, student-data, and no-grading coverage remains. | `@claim:no-account`, `no-tracking`, `no-cookies`, `no-student-data-fields`, `no-grading`. |
| F-04.20 | All demo exits remove all `demo:` keys only. | `@claim:demo-discard`. |
| F-05, F-2-3 | Unknown URLs serve the designed 404 with recovery and metadata. | Live `/not-a-real-route` returned HTTP 404. |
| F-06 | Demo/game title, metadata, focus, announcement, and Back work. | Live `demo reset, titles, focus, metadata, and the designed 404 route work`. |
| F-07 | Root, demo, games, legal pages, and 404 retain route metadata. | Live route sweep; cold reports. |
| F-08, F-2-6, F-3-3 | One shared wordmark, navigation, footer, legal links, and build id across shells. | Live shared-shell test. |
| F-2-4, F-2-5 | Mobile targets are 44px and demo status semantics have zero Axe violations. | Live mobile-target and demo-Axe tests. |
| F-3-4 | Every game description has its own observable fresh-demo claim. | Six `@claim:*-play` tests. |
| F-4-2 | Service-worker update regression remains active without fixture races. | Clean-clone `npm test`. |
| F-5-6 | Exact Node support floor is declared and checked at Node 20.19. | `@claim:node-compat`. |
| F-5-8 | Sociobot legal links visibly identify an external site. | Live legal-shell test. |
| verification-1 high, verification-3 | Keyboard/mobile/game Axe coverage remains complete. | Live route/Axe sweep: 22 passed, 2 intended skips. |
| verification-1 medium (URL, PWA, security/cache), verification-1 low, verification-2 high, verification-2 low | Long links, lesson recovery, worker update, headers, manifest MIME, and fullscreen remain tested. | Clean `npm test`/build; live manifest MIME and claims. |

## Final evidence

- Final fresh clone: `npm ci`, `npm run build`, all browser claim tags
  (50/50), `npm run test:node-compat`, and `npm test` all passed. The full
  suite reports 11/11 unit tests and 76 browser passes with two intended
  project-specific skips.
- Bundle: `main-BHotmWrz.js` is 35.37 kB raw / 11.75 kB gzip; CSS is 15.50 kB
  raw / 4.27 kB gzip.
- Cold local and live root/demo checks report zero console errors, `lang=en`,
  one h1, main landmark, alt text, and named controls.
- Live claims: 50/50 passed. Live route/mobile/Axe sweep: 22 passed and two
  intended skips. Root/demo are 200; the unknown route is 404; manifest MIME
  is `application/manifest+json`.

No finding of any severity remains open.
