# Polish round 7 — cumulative zero-finding repair

Repair base: candidate `3d8ace4a39e77dd21806f1d19fe9f6640272efc0` and
review `721fc10a58e9606106b211b5e2f171a88a5814d0`. The repair commit is
`17a28c3ac38dc438fe6743f7a1637cd4d6a3e10d`
(`fix: point README legal links to product notices`). It is pushed to `main`
and was deployed as the configured static artifact to
<https://wordlist-arcade.sociobot.in>.

## Round-seven repair

`F-7-1` was the only open finding. `README.md` now uses the full product URLs
for Privacy and Terms. A Playwright regression reads the repository README and
requires both exact absolute targets, so a root-relative GitHub link cannot
return. The rendered GitHub README was fetched after the push; it contains
`href="https://wordlist-arcade.sociobot.in/privacy/"` and
`href="https://wordlist-arcade.sociobot.in/terms/"`. Both destinations return
200. The catalog sentence was also refreshed to the verb-first, 11-word:
“Make six classroom vocabulary games from one pasted word-pair list.”

## Evidence key

- **Clean clone:** `/tmp/wordlist-arcade-polish7-clean.eBHR4S`, created with
  `git clone --no-local /work/repo`; checked out `17a28c3`; `npm ci` reported
  zero vulnerabilities. `claims-round7.log` records every exact command from
  `.factory/claims.json`: all 26 commands passed (25 browser claims × desktop
  and mobile = 50 passes, plus `node-compat`). `full-round7.log` records
  `npm test` (11 Vitest tests; 78 Playwright passes and 2 intended
  desktop-only skips) and `npm run build`.
- **Local artifact:** the Vite build writes `dist/index.html`; JavaScript is
  35.37 kB raw / 11.75 kB gzip and CSS is 15.50 kB raw / 4.27 kB gzip.
- **Live cold checks:** `verify-url.sh` passed
  <https://wordlist-arcade.sociobot.in/> and
  <https://wordlist-arcade.sociobot.in/?demo=1>. Reports and screenshots are
  `evidence/polish-7/live/root/verify.json`,
  `evidence/polish-7/live/root/screenshot-mobile.png`,
  `evidence/polish-7/live/root/screenshot-desktop.png`,
  `evidence/polish-7/live/demo/verify.json`,
  `evidence/polish-7/live/demo/screenshot-mobile.png`, and
  `evidence/polish-7/live/demo/screenshot-desktop.png`.
- **Live regression:** `PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in
  npm run test:claims -- --grep '@claim:'` passed 50/50
  (`evidence/polish-7/live/claims.log`). The live route/mobile/Axe sweep passed
  16 applicable tests with 2 intended desktop-only skips
  (`evidence/polish-7/live/routes-axe.log`).
- **Live performance:** Lighthouse mobile returned Performance 100,
  Accessibility 100, Best Practices 100, and SEO 100; FCP 0.9 s, LCP 1.1 s,
  TBT 40 ms, and CLS 0. Report:
  `evidence/polish-7/live/lighthouse/root.json`.
- **Live routing and security:** Privacy and Terms returned 200; an unknown
  route returned the designed 404. Root and 404 headers are saved as
  `evidence/polish-7/live/headers-root.txt` and
  `evidence/polish-7/live/headers-404.txt`.

## Cumulative finding map

Each identifier below is currently fixed. “Retained” means the earlier repair
is still in the current product and was re-executed in the clean clone and/or
on production during this round.

| Finding ID | Change in the current product | Evidence |
| --- | --- | --- |
| F-01 | Retained the job-first headline, teacher audience, real action, sample action, and three facts above the fold. | Cold live root screenshot and `landing page is accessible and has no console errors`. |
| F-02, F-2-7, F-2-8, F-2-9, F-2-10, F-2-11, F-2-12, F-2-13, F-2-14, F-2-15, F-2-16, F-3-2, F-3-7 | Retained plain, consistent teacher language, exact screen names, plain separator help, and no untestable artwork promise. | Updated `.factory/copy-audit.md`; live root/demo screenshots. |
| F-03, F-2-1, F-4-1 | Retained the one-click, namespaced demo; Reset, Back, and Start for real discard only demo data. | `@claim:sample-demo`, `@claim:demo-discard`, and live demo screenshot. |
| F-04 | Retained `.factory/claims.json` with one tagged observable test for every public claim. | All 26 exact clean-clone claim commands passed; live claim sweep 50/50. |
| F-04.01, F-04.08, F-3-1 | Retained all six functioning games, including valid 60-character Anagram terms. | `@claim:six-games`; live all-game Axe sweep. |
| F-04.02, F-04.10 | Retained separate tested six-games, free-use, and no-account facts. | `@claim:six-games`, `@claim:free-to-use`, `@claim:no-account`. |
| F-04.03, F-04.11, F-04.17, F-5-1 | Retained app-written draft save/reload/clear behavior and isolation from the demo namespace. | `@claim:local-device`. |
| F-04.04 | Retained first-party-only demo traffic. | `@claim:no-tracking`. |
| F-04.05 | Retained typed-row validation and live announced error. | `@claim:list-check`. |
| F-04.06, F-3-6, F-5-3 | Retained deterministic local lesson download/import and no list-bearing action request. | `@claim:lesson-file`, `@claim:lesson-file-local`. |
| F-04.07, F-04.13 | Retained the tested 3–30 word-pair boundary. | `@claim:pair-limit`. |
| F-04.09, F-04.14, F-04.21, F-5-2 | Retained fresh-context class-link recovery and request-level proof that the fragment is not sent. | `@claim:class-link`, `@claim:fragment-not-sent`. |
| F-04.12 | Retained README wording that maps to the tested six-game behavior. | README audit and `@claim:six-games`. |
| F-04.15, F-2-2 | Retained exact maximum-length link recovery plus lesson-file fallback. | `@claim:long-class-link`, `@claim:lesson-file`. |
| F-04.16, F-3-8, F-5-7 | Retained visible 390px result-naming controls and Fullscreen API behavior. | `@claim:fullscreen`, mobile layout test, demo screenshot. |
| F-04.18, F-6-1 | Retained offline reload for an exact saved list and copied game route after the first visit. | `@claim:offline-demo`. |
| F-04.19, F-3-5, F-5-4, F-5-5 | Retained separate account, tracking, cookie, student-field, and no-grading proofs. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-cookies`, `@claim:no-student-data-fields`, `@claim:no-grading`. |
| F-04.20 | Retained deletion of every demo key on every exit without changing a real draft. | `@claim:demo-discard`. |
| F-05, F-2-3 | Retained the designed static 404, status 404, recovery link, canonical, and Open Graph URL. | Live unknown-route 404 and `demo reset, titles, focus, metadata, and the designed 404 route work`. |
| F-06 | Retained History API navigation, route titles, focus move, live announcement, and direct routes. | Live route/meta test. |
| F-07 | Retained complete route metadata on root, demo, games, legal pages, and 404. | Live route/meta test and cold reports. |
| F-08, F-2-6, F-3-3 | Retained one Wordlist Arcade header/footer shell across maker, play, legal, and 404 routes. | Live shared-shell test. |
| F-2-4 | Retained at least 44px interactive targets on mobile. | Live mobile target-size test. |
| F-2-5 | Retained valid labelled demo controls/status semantics. | Live zero-violation demo Axe test. |
| F-3-4 | Retained one observable fresh-demo claim for each game behavior. | Six individual `@claim:*-play` tests. |
| F-4-2 | Retained a passing local suite and isolated service-worker-update fixture. | Clean-clone `npm test`: 78 passed, 2 expected skips. |
| F-5-6 | Retained exact declared Node floors and real Node 20.19 build. | `npm run test:node-compat`. |
| F-5-8 | Retained visible, labelled external Sociobot legal links. | Live legal-shell test. |
| F-7-1 | Replaced README root-relative legal links with absolute Wordlist Arcade URLs and added a regression test. | `README legal links point to Wordlist Arcade notices when rendered on GitHub`; rendered GitHub README check; both live legal URLs return 200. |
| Verification 1 (high/medium/low), Verification 2 (high/low), Verification 3 | Retained game semantics, exact link/lesson recovery, PWA cache/update behavior, headers, manifest MIME, fullscreen, and mobile accessibility. | Clean-clone full suite, live claims 50/50, live route/Axe sweep, cold reports, headers, and Lighthouse report. |

No blocking, major, minor, or informational finding remains open.
