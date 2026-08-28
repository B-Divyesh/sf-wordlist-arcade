# Polish round 3 — complete finding resolution

Repair base: `09700294000c880ad43683d12984d6932657e66c` / review commit
`52f66db194d276eb6eb740a5ff584b237114e363`. Application repair commit:
`4f514b2dc7dabea9a06a22b2e03a5532ca9f178a`. It is deployed as Static Web
Apps deployment `284232e7-7afa-42c5-ab7c-266dff315bb0` at
<https://wordlist-arcade.sociobot.in/>.

## Evidence key

- **Clean clone:** every one of the 21 exact commands in `claims.json` passed
  from a new shallow clone (42 desktop/mobile claim runs); `npm test` passed
  10 unit tests and 68 browser tests (two intentional project-selection
  skips); `npm run build` produced `dist/`.
- **Live claims:** `PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in
  npx playwright test --project=desktop --workers=2 --grep
  '@claim:(six-games|match-up-play|word-strike-play|anagram-play|word-reveal-play|memory-play|quiz-race-play|no-cookies|no-tracking|demo-discard|offline-demo|long-class-link)'`
  passed 12/12.
- **Live structure/a11y:** the desktop and mobile route/mobile-layout/axe
  sweep passed. The desktop run passed 2 with one expected mobile-only skip;
  the mobile run passed 3/3. `demo shell has zero axe violations and games
  include site navigation` is the axe integration check.
- **Cold live checks:** `verify-url.sh` reports zero console errors, one `h1`,
  `lang=en`, `main`, no missing image alt text, and no unlabeled buttons for
  both [root](https://wordlist-arcade.sociobot.in/) and
  [demo](https://wordlist-arcade.sociobot.in/?demo=1). `/not-a-real-route`
  returned HTTP 404; root, demo, Privacy, and Terms returned HTTP 200.
- **Screens:**
  `.factory/evidence/polish-3/live/landing-desktop.png`,
  `landing-mobile.png`, and `demo-mobile.png`. Machine reports are in
  `live/root/verify.json`, `live/demo/verify.json`, `headers-root.txt`,
  `headers-404.txt`, and `lighthouse.json`.

## Review 1 and inherited findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-01 | Retained the job-first, verb-first first screen: it says who it is for, gives a real and sample first action, and lists three concrete facts. | Cold root check and `landing-mobile.png`; copy audit. |
| F-02 | Retained the plain teacher wording; updated remaining rejected wording in the current round. | `.factory/copy-audit.md`; cold root/demo checks. |
| F-03 | Demo continues to use its own prefix; Reset reseeds only demo data and Start for real removes demo data without touching real data. | `@claim:demo-discard`, `@claim:local-device`, live demo. |
| F-04 | Expanded the register from 14 to 21 uniquely tagged, observable claims. | Clean-clone 21/21 exact claim commands. |
| F-04.01 | Anagram now accepts every parser-valid term (up to 60 characters), including the former 33-character crash case. | `@claim:six-games` exercises three 60-character terms in all six modes, live pass. |
| F-04.02 | The six-game, free, and account facts remain independent claims. | `@claim:six-games`, `@claim:free-to-use`, `@claim:no-account`. |
| F-04.03 | Device-only storage remains precise and isolated. | `@claim:local-device`; `@claim:demo-discard`. |
| F-04.04 | Complete sample flow remains first-party only. | `@claim:no-tracking`, live pass. |
| F-04.05 | Inline list checking remains announced and observable. | `@claim:list-check`. |
| F-04.06 | Replaced environment-dependent sharing with a deterministic lesson-file download/import that restores all pairs. | `@claim:lesson-file`. |
| F-04.07 | The 3–30 pair boundary remains enforced. | `@claim:pair-limit`. |
| F-04.08 | Every accepted list, including 60-character entries, opens every mode. | `@claim:six-games`, live pass. |
| F-04.09 | Class links still restore a list in a fresh context. | `@claim:class-link`. |
| F-04.10 | Free use and no account remain separately tested. | `@claim:free-to-use`, `@claim:no-account`. |
| F-04.11 | Real drafts remain untouched during demo use. | `@claim:local-device`, `@claim:demo-discard`. |
| F-04.12 | README and product retain the same six-game wording. | README review; `@claim:six-games`. |
| F-04.13 | README’s pair-range wording remains covered by the boundary test. | `@claim:pair-limit`. |
| F-04.14 | README’s class-link wording remains covered by a fresh-context restoration. | `@claim:class-link`. |
| F-04.15 | Maximum 30-pair links remain copyable; the fallback is now only the lesson file. | `@claim:long-class-link`, `@claim:lesson-file`, live long-link pass. |
| F-04.16 | Fullscreen remains a labelled browser API control. | `@claim:fullscreen`; mobile screenshot. |
| F-04.17 | Local persistence remains directly verified. | `@claim:local-device`. |
| F-04.18 | Offline wording remains bounded to after the first visit and is demonstrated in demo mode. | `@claim:offline-demo`, live pass. |
| F-04.19 | No-account, no-tracking, and now no-cookie privacy facts each have a dedicated claim. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-cookies`; live privacy pass. |
| F-04.20 | Reset/exit retain the single demo namespace and discard all demo keys. | `@claim:demo-discard`, live pass. |
| F-04.21 | Shared class state remains in the URL fragment and opens in a fresh browser context. | `@claim:class-link`. |
| F-05 | Unknown routes serve the designed, linked, titled 404 shell. | Cold `/not-a-real-route` HTTP 404; `live/404.html`; route-shell test. |
| F-06 | Demo and game navigation retain title, focus, announcement, and back behavior. | Full browser suite; live route-shell/axe sweep. |
| F-07 | Canonical/social metadata remains present, including 404 metadata. | Cold root/demo checks; `live/404.html`. |
| F-08 | Root, game/demo, legal, and 404 now use exactly the same Wordlist Arcade header/nav/footer content. | `root, demo, legal, and 404 routes share one navigation and footer skeleton`, live desktop/mobile passes. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 / F-03 | Kept the corrected one-prefix Reset/exit isolation path. | `@claim:demo-discard`; live pass. |
| F-2-2 / F-04.15 | Kept lossless 30-pair class-link coverage and the practical lesson-file fallback. | `@claim:long-class-link`, `@claim:lesson-file`; live pass. |
| F-2-3 / F-07 | Kept `og:url` and full metadata on the static 404. | `live/404.html`; route-shell test. |
| F-2-4 | Kept 44px targets across the shared shell and visible game controls. | `mobile layout does not overflow horizontally`, live mobile pass; `demo-mobile.png`. |
| F-2-5 | Kept valid banner/status semantics. | Live axe integration pass. |
| F-2-6 | Replaced the former game-only compact shell with the exact full shared header/footer. | Route-shell test; `demo-mobile.png`. |
| F-2-7 | Kept untestable art/provenance promises out of visitor copy. | Copy audit and cold screenshots. |
| F-2-8 | Kept the teacher-facing list-name wording. | Copy audit. |
| F-2-9 | Kept the plain dash-or-colon separator instruction. | Copy audit. |
| F-2-10 | Kept short README demo instructions. | README review; `@claim:demo-discard`. |
| F-2-11 | Kept plain class-link README wording. | README review; `@claim:class-link`. |
| F-2-12 | Kept accurate separate-browser-storage README wording. | README review; `@claim:demo-discard`. |
| F-2-13 | Kept precise shared-list privacy wording. | README review; `@claim:class-link`. |
| F-2-14 | Kept the task-named README section. | README review. |
| F-2-15 | Kept the plain local-run README section. | README review. |
| F-2-16 | Kept the plain test README section. | README review. |

## Review 3 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 / F-04.01 / F-04.08 | Removed Anagram’s 32-character filter; stale turn callbacks are invalidated on navigation so game changes do not emit console errors. | `@claim:six-games` (three accepted 60-character terms through every mode, console-error assertion), live 12/12 claim sweep. |
| F-3-2 / F-02 | Replaced every customer-facing “LMS” occurrence with “learning platform” in long-link help and the copy toast. | `.factory/copy-audit.md`; live root/demo cold check. |
| F-3-3 / F-08 / F-2-6 | Rebuilt game, Privacy, Terms, and 404 chrome from the same header/nav/footer vocabulary as root. | Live route-shell test on desktop/mobile; `demo-mobile.png`; live 404 response. |
| F-3-4 | Registered one observable claim and fresh-demo test for each individual game; Quiz race now correctly promises “up to five” clues. | `@claim:match-up-play`, `word-strike-play`, `anagram-play`, `word-reveal-play`, `memory-play`, `quiz-race-play`; all pass live. |
| F-3-5 | Registered and tested the no-cookie privacy promise for response headers and the browser cookie jar over a full demo game flow. | `@claim:no-cookies`, live pass. |
| F-3-6 | Removed Share lesson and its Web Share dependency; Download lesson file is the only deterministic offline transfer action. | `@claim:lesson-file`; cold mobile root screenshot. |
| F-3-7 | Replaced the remaining “unlock” empty state with “Add N pair(s) to choose a game.” | Copy audit; cold root screenshot. |
| F-3-8 | Mobile game controls now keep visible “Copy link” and “Fullscreen” labels in a two-row toolbar. | `mobile layout does not overflow horizontally`; `demo-mobile.png`. |

## Earlier verification findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| verification-1 high | Game semantics remain valid, including Word reveal and Quiz race status/progress. | Full clean-clone browser suite and live axe sweep. |
| verification-1 medium: URL | Long links and the lesson-file fallback remain usable. | `@claim:long-class-link`, `@claim:lesson-file`. |
| verification-1 medium: PWA | Versioned manifest/service-worker cache and offline startup remain shipped. | `@claim:offline-demo`; build/PWA tests. |
| verification-1 medium: security/cache | CSP, frame protection, no-referrer, nosniff, and immutable hashed assets remain configured. | `live/headers-root.txt`; config tests. |
| verification-1 low | Fullscreen remains tested rather than implied. | `@claim:fullscreen`. |
| verification-2 high | Exact 30-pair sharing remains lossless. | `@claim:long-class-link`, live pass. |
| verification-2 low | Web manifest MIME mapping remains configured. | Build/PWA tests. |
| verification-3 | No separate defect was recorded; its behavior remains covered by the regression suite. | Clean-clone `npm test`. |

## Final live result

The live root cold-loaded in 757 ms and the direct demo in 713 ms with zero
console errors. Mobile Lighthouse scored 100 Performance, 100 Accessibility,
100 Best Practices, and 100 SEO; FCP 1.0 s, LCP 1.1 s, TBT 80 ms, CLS 0.
No blocking, major, or minor review finding remains open.
