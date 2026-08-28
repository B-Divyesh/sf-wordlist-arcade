# Polish round 5 — zero-finding repair record

Repair base: `33af34a625ef15796e1390e0b269cfabc9153fcb` (review candidate
`9a3696c27d189dcad8400085d93dcc29baa93dae`). Product repair commit:
`6766cf691e879d0e39d7b0cb01d84af5ef47eec8` (`fix: complete round five
claims and controls`). It was pushed to `main`, then deployed with
`/opt/fleet/lib/deploy-static.sh wordlist-arcade /work/repo/dist` (Azure
deployment `302146b2-0297-43a1-9d38-073ff25b1148`).

## Evidence key

- **Fresh clone:** `/tmp/wordlist-arcade-polish5-final.c0dNgW`, made with
  `git clone --no-local`, ran `npm ci`, then each exact command in
  `.factory/claims.json`. All 26 declarations passed: 25 browser claims ran
  in desktop and 390px mobile projects (50 passes); `node-compat` also
  type-checked and built with Node.js 20.19.0. The same clone passed `npm test`
  (11 Vitest tests; 76 Playwright passes, 2 intended desktop-only skips) and
  `npm run build`.
- **Local cold checks:** `verify-url.sh` passed root and `?demo=1` with zero
  console errors, one `h1`, `lang=en`, a main landmark, alt text, and named
  buttons. Evidence: `evidence/polish-5/local/root/verify.json` and
  `evidence/polish-5/local/demo/verify.json`. Local Lighthouse: Performance
  100, Accessibility 100, Best Practices 100, SEO 100; FCP 1.0s, LCP 1.6s,
  TBT 0ms, CLS 0 (`evidence/polish-5/local/lighthouse`).
- **Live cold checks:** the same script passed
  <https://wordlist-arcade.sociobot.in/> and
  <https://wordlist-arcade.sociobot.in/?demo=1>. Screenshots are
  `evidence/polish-5/live/root/screenshot-mobile.png`,
  `evidence/polish-5/live/root/screenshot-desktop.png`,
  `evidence/polish-5/live/demo/screenshot-mobile.png`, and
  `evidence/polish-5/live/demo/screenshot-desktop.png`.
- **Live regression:** `PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in
  npm run test:claims -- --grep '@claim:' --workers=2` passed 50/50.
  The live route/mobile/all-game-Axe sweep passed 20/20, with two intended
  desktop-only skips. The existing Playwright Axe integration is the
  accessibility evidence; it reports zero violations for the demo shell and
  serious/critical-free populated game screens.
- **Live structure and performance:** root/demo/Privacy/Terms/404/manifest,
  robots, and sitemap returned 200 except the deliberate unknown route, which
  returned 404. Headers in `evidence/polish-5/live/headers-root.txt` and
  `headers-404.txt` include CSP, `X-Frame-Options: DENY`, nosniff, and
  no-referrer. Live Lighthouse: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 1.0s, LCP 1.1s, TBT 10ms, CLS 0
  (`evidence/polish-5/live/lighthouse`).

## Current review 5 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 / F-04.17 | `updateMaker` now removes both real keys when a list is cleared. `@claim:local-device` types a real title and three pairs, proves app-written storage, reloads, clears through the UI, then enters demo and proves exact real-draft isolation. | Clean clone command for `local-device`; live `@claim:local-device` 2/2; root and demo cold checks. |
| F-5-2 / F-04.21 | Added `fragment-not-sent`. Its fresh-context navigation records the actual request and asserts neither `#d=` nor unique pair text reaches the request URL/body while the client restores the complete list. A decoded demo class link is retained only in `demo:` storage when returning to the chooser. | Clean clone and live `@claim:fragment-not-sent` 2/2. |
| F-5-3 | Added `lesson-file-local`. It downloads and imports a uniquely identifiable lesson and allows only the expected same-origin static hero asset after import; no request body or action request contains the list. | Clean clone and live `@claim:lesson-file-local` 2/2. |
| F-5-4 | Narrowed the child-data statement to “There are no fields for student names or contact details” and registered it. The test traverses maker plus all six games, checks form controls, storage, and request methods/bodies. | Clean clone and live `@claim:no-student-data-fields` 2/2; live Privacy check. |
| F-5-5 | Narrowed the Terms promise to “Games do not create student grades, records, or decisions” and registered it. The test opens every game and checks output, storage, and requests for gradebook/roster/record/decision output. | Clean clone and live `@claim:no-grading` 2/2; live Terms check. |
| F-5-6 | README now says “Use Node.js 20.19.x or Node.js 22.12+.” `package.json` and lockfile declare the exact Vite-supported engine range; `test:node-compat` runs the tagged unit assertion and a real Node 20.19.0 type-check/build. | Clean clone `npm run test:node-compat`; exact `node-compat` claim command passed. |
| F-5-7 | Replaced “Games” with “Choose a game.” Fullscreen now visibly and accessibly says “Enter fullscreen” or “Exit fullscreen” as state changes. | `@claim:fullscreen`; live 390px layout and demo screenshots. |
| F-5-8 | Privacy and Terms now visibly name “Sociobot (external site).” The shared legal-shell regression asserts that exact accessible link name and destination. | Live legal-shell route test and live Privacy/Terms HTML checks. |

## Cumulative earlier-review mapping

| Finding IDs | Retained or rechecked change | Current evidence |
| --- | --- | --- |
| F-01 | Job-first “Make six vocabulary games” headline, teacher audience, real/sample actions, and three short facts remain above the fold. | Live root cold screenshots and `landing page is accessible`. |
| F-02, F-2-7, F-2-8, F-2-9, F-2-10, F-2-11, F-2-12, F-2-13, F-2-14, F-2-15, F-2-16, F-3-2, F-3-7 | Plain-word terminology, short copy, plain separator help, task-named headings, and no untestable art promise remain. Copy audit now includes current controls, legal wording, and Node wording. | `.factory/copy-audit.md`; cold root/demo screenshots. |
| F-03, F-2-1, F-4-1 | The one-click sample is immediately playable and namespaced. Reset, Start for real, browser Back, and document exit clear every `demo:` key while preserving real data. | `@claim:sample-demo`, `@claim:demo-discard`, and expanded `@claim:local-device`, clean clone and live. |
| F-04.01 / F-04.08 / F-3-1 / F-3-4 | All six real games work from one valid list, including accepted 60-character terms; each behavior has a dedicated fresh-demo test. | `@claim:six-games`, `@claim:match-up-play`, `@claim:word-strike-play`, `@claim:anagram-play`, `@claim:word-reveal-play`, `@claim:memory-play`, `@claim:quiz-race-play`. |
| F-04.02 / F-04.10 | Free use and no-account entry remain independent, observable claims. | `@claim:free-to-use`, `@claim:no-account`. |
| F-04.03 / F-04.11 | Real and demo storage are isolated, and a real typed draft now has save/reload/clear proof. | `@claim:local-device`, `@claim:demo-discard`. |
| F-04.04 / F-3-5 | Whole demo flows remain first-party only and set no cookies. | `@claim:no-tracking`, `@claim:no-cookies`. |
| F-04.05 | Invalid rows are checked and announced while typing. | `@claim:list-check`. |
| F-04.06 / F-3-6 | Lesson download/import restores exactly and has no list-bearing network transfer. | `@claim:lesson-file`, `@claim:lesson-file-local`. |
| F-04.07 / F-04.13 | The 3–30 pair boundary is enforced. | `@claim:pair-limit`. |
| F-04.09 / F-04.14 / F-04.21 | Class links restore in fresh contexts with data after `#`; the hash-not-sent result now has request-level proof. | `@claim:class-link`, `@claim:fragment-not-sent`. |
| F-04.12 | README six-game text remains aligned with the tested behavior. | README audit; `@claim:six-games`. |
| F-04.15 / F-2-2 | A low-compressibility 30-pair link copies and restores exactly, with lesson-file fallback. | `@claim:long-class-link`, `@claim:lesson-file`. |
| F-04.16 / F-3-8 | Visible mobile controls name their outcomes and fullscreen invokes the API. | `@claim:fullscreen`; live mobile screenshot. |
| F-04.18 | Offline reload remains demonstrated through the first-visited demo. | `@claim:offline-demo`, clean clone and live. |
| F-04.19 | Account/tracking/cookie privacy claims remain separately exercised; child-data scope now has its own claim. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-cookies`, `@claim:no-student-data-fields`. |
| F-04.20 | Demo exits delete every demo key without touching real storage. | `@claim:demo-discard`. |
| F-05 / F-2-3 | Unknown paths return the designed 404 with 404 status, recovery action, canonical, and `og:url`. | Live `/not-a-real-route`; headers and `live/404.html`. |
| F-06 | History, title, focus, announcement, canonical, and direct demo/game routes remain real and tested. | Live `demo reset, titles, focus, metadata, and the designed 404 route work`. |
| F-07 | Root, demo, game, legal, and 404 metadata remain complete. | Live route sweep and 404 HTML evidence. |
| F-08 / F-2-6 / F-3-3 | Header/footer identity remains consistent across maker, game, legal, and 404 pages. | Live shared-shell route test and screenshots. |
| F-2-4 | Every visible mobile shell target is at least 44×44px. | Live `mobile controls meet the 44 pixel target` test. |
| F-2-5 | Demo banner uses valid labelled-region/status semantics. | Live zero-violation demo Axe sweep. |
| F-3-5 | Cookie and response-header privacy remains checked through a complete game action. | `@claim:no-cookies`. |
| F-4-2 | Waiting service-worker update control remains regression-tested locally. | Clean-clone `npm test`. |
| Verification 1 high / Verification 3 | All populated games and the demo shell are Axe-scanned; keyboard, focus, 200% text, overflow, and error-free cold loads remain covered. | Clean-clone `npm test`; live 20-route/mobile/Axe sweep; `verify-url.sh`. |
| Verification 1 medium (URL, PWA, security/cache) / Verification 2 high / Verification 2 low | Exact links, lesson fallback, PWA assets/update, manifest MIME, response security headers, and 30-row round-trip remain in the built product. | Clean-clone suite; live `headers-root.txt`, `headers-manifest.txt`, `@claim:long-class-link`. |

No blocking, major, minor, or informational finding remains open.
