# Polish round 4 — complete cumulative resolution

Repair base: `55ece8e08d38063b4c843adc9aef1545effcbd57`. Review record:
`9939a97076ce1d2a8f6a75f190f3aee356e1620c`. Repair commit:
`c1d9892d0cc43775dc68eb628a1f2940487c9373` (`fix: discard demo data on every
exit`), pushed to `main` and deployed with
`/opt/fleet/lib/deploy-static.sh wordlist-arcade /work/repo/dist`.

## Evidence key

- **Clean clone:** `/tmp/wordlist-arcade-polish4.pcBnVe` was created with
  `git clone --no-local`, then `npm ci` passed. Every one of the 21 exact
  `claims.json` commands passed in both projects (42 runs). `npm test` passed
  10 Vitest tests and 68 Playwright runs, with two intended desktop-only
  mobile-layout skips. A separate `npm run build` produced `dist/`.
- **Live claims:**
  `PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in npx playwright test
  --grep '@claim:' --workers=2` passed 42/42. This includes the one-click demo
  → browser Back → storage assertion in `@claim:demo-discard`.
- **Live shell/a11y:** the applicable 18 desktop/mobile route, 44px target,
  offline, Axe, mobile-overflow, 404, and metadata tests passed. The local-only
  deployment-configuration fixture was checked in the clean-clone suite; Azure
  does not expose `staticwebapp.config.json` as a public JSON route.
- **Cold live evidence:**
  [root desktop screenshot](evidence/polish-4/live/root/screenshot-desktop.png),
  [root mobile screenshot](evidence/polish-4/live/root/screenshot-mobile.png),
  [demo desktop screenshot](evidence/polish-4/live/demo/screenshot-desktop.png),
  [demo mobile screenshot](evidence/polish-4/live/demo/screenshot-mobile.png),
  and their `verify.json` reports. `verify-url.sh` found zero console errors,
  one h1, `lang=en`, a main landmark, no missing alt text, and no unlabelled
  buttons on both [root](https://wordlist-arcade.sociobot.in/) and
  [demo](https://wordlist-arcade.sociobot.in/?demo=1).
- **Live URL checks:** root, `/demo`, Privacy, Terms, robots, sitemap, and the
  manifest return 200. `/not-a-real-route` returns 404 with
  `og:url=https://wordlist-arcade.sociobot.in/404`. The live manifest has
  `application/manifest+json`, and response headers include CSP,
  `X-Frame-Options: DENY`, `nosniff`, and `no-referrer`.
- **Lighthouse mobile:** 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; FCP 0.9 s, LCP 1.1 s, TBT 20 ms, CLS 0. Report:
  [lighthouse.json](evidence/polish-4/live/lighthouse.json).

## Current review findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-4-1 / F-03 | Track whether the prior route was demo; clear all `demo:` storage and in-memory demo state on a route exit. A `pagehide` handler also covers document navigation and browser Back. | Clean and live `@claim:demo-discard`; live demo screenshot; direct [demo](https://wordlist-arcade.sociobot.in/?demo=1) check. |
| F-4-2 | Made update detection use the pre-existing controller state and the stable `registration.waiting` worker. The regression waits for a real installed worker, serializes its temporary worker-file fixture, confirms the conditional prompt, and confirms the update reload. | Clean-clone `npm test` (68 browser passes, 2 expected skips); focused desktop/mobile regression passed before the full run. |

## Review 1 findings

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-01 | Retained the job-first headline, named teachers, adjacent real/sample actions, and three plain facts. | Cold root screenshots and `landing page is accessible and has no console errors` live. |
| F-02 | Retained short teacher language and audited README/landing terminology; no banned or overlong current copy remains. | `.factory/copy-audit.md`; cold root/demo checks. |
| F-03 | Demo is one-click, namespaced, immediately playable, resettable, and now discarded on every exit path. | `@claim:sample-demo`, `@claim:local-device`, `@claim:demo-discard`, and live demo. |
| F-04 | Retained the complete claims register: every visitor-facing measurable promise has one tagged test. | Clean-clone 21/21 exact commands; live 42/42 claim runs. |
| F-04.01 | Six actual games, including 60-character accepted terms, are opened and interacted with. | `@claim:six-games`. |
| F-04.02 | Six-game, free-use, and no-account facts remain independent, tested claims. | `@claim:six-games`, `@claim:free-to-use`, `@claim:no-account`. |
| F-04.03 | Device-only storage is isolated from demo storage and real drafts survive demo use. | `@claim:local-device`, `@claim:demo-discard`. |
| F-04.04 | The complete demo flow remains same-origin only. | `@claim:no-tracking`. |
| F-04.05 | Inline row validation remains announced while typing. | `@claim:list-check`. |
| F-04.06 | Lesson-file download/import restores the pairs exactly. | `@claim:lesson-file`. |
| F-04.07 | The parser enforces the 3–30-pair boundary. | `@claim:pair-limit`. |
| F-04.08 | One valid list opens and supports every game. | `@claim:six-games`. |
| F-04.09 | Class links retain their state after `#` and open in a fresh context. | `@claim:class-link`. |
| F-04.10 | Free use and no account remain separately observable. | `@claim:free-to-use`, `@claim:no-account`. |
| F-04.11 | Demo never changes the seeded real draft. | `@claim:local-device`, `@claim:demo-discard`. |
| F-04.12 | README retains the same tested six-game promise. | `@claim:six-games`; README audit. |
| F-04.13 | README's pair range is tested at the boundary. | `@claim:pair-limit`. |
| F-04.14 | README's class-link statement is tested in a fresh context. | `@claim:class-link`. |
| F-04.15 | A 30-pair maximum link is copyable and restores exact data; lesson-file fallback is deterministic. | `@claim:long-class-link`, `@claim:lesson-file`. |
| F-04.16 | The labelled fullscreen control calls the browser API. | `@claim:fullscreen`. |
| F-04.17 | Local draft persistence is directly exercised. | `@claim:local-device`. |
| F-04.18 | Offline behavior remains limited to a first-visited demo and is demonstrated there. | `@claim:offline-demo`; live offline test. |
| F-04.19 | Account, tracking, and cookie privacy wording each has coverage. | `@claim:no-account`, `@claim:no-tracking`, `@claim:no-cookies`. |
| F-04.20 | Reset, Start for real, browser Back, and document navigation clear every demo key only. | `@claim:demo-discard`. |
| F-04.21 | Hash-contained shared state opens from a copied URL without server storage. | `@claim:class-link`. |
| F-05 | Unknown paths retain the designed recovery page and real 404 status. | Live `/not-a-real-route` 404 and `demo reset, titles, focus, metadata, and the designed 404 route work`. |
| F-06 | Routes retain title, canonical/social URL, announcement, h1 focus, and history behavior. | Live route/metadata test. |
| F-07 | Root, demo, game, legal, and 404 metadata remain complete. | Live route/metadata test; 404 `og:url` check. |
| F-08 | Root, demo/game, legal, and 404 retain the one shared header/footer vocabulary and current build id. | Live shared-shell test and screenshots. |

## Review 2 findings

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-2-1 / F-03 | Prevented the former double-prefix reset bug and expanded exit cleanup to all demo exits. | `@claim:demo-discard` locally and live. |
| F-2-2 / F-04.15 | Kept the dedicated maximum-length class-link claim. | `@claim:long-class-link`. |
| F-2-3 / F-07 | Kept static 404 `og:url`. | Live 404 HTML check. |
| F-2-4 | Kept ≥44px targets in root, demo, legal, and 404 shells. | Live mobile target test. |
| F-2-5 | Kept valid banner/status semantics and zero demo-shell Axe violations. | `demo shell has zero axe violations and games include site navigation`. |
| F-2-6 | Kept the shared Wordlist Arcade navigation on game screens. | Live shared-shell/Axe test. |
| F-2-7 | Kept untestable generated-art promises out of customer copy. | Copy audit and cold screenshots. |
| F-2-8 | Retained “Shown at the top of each game.” | Copy audit. |
| F-2-9 | Retained the plain dash-or-colon instruction. | Copy audit. |
| F-2-10 | README now explains demo behavior in short, plain sentences. | README and `@claim:demo-discard`. |
| F-2-11 | README calls it a class link, not a hash fragment. | README and `@claim:class-link`. |
| F-2-12 | README explains separate browser storage without namespace jargon. | README and `@claim:demo-discard`. |
| F-2-13 | README says a class link contains the shared list. | README and `@claim:class-link`. |
| F-2-14 | README uses the task-named game heading. | README audit. |
| F-2-15 | README uses the task-named local-run heading. | README audit. |
| F-2-16 | README uses the task-named test heading. | README audit. |

## Review 3 findings

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| F-3-1 / F-04.01 / F-04.08 | Anagram supports every parser-valid term and stale timers cannot update a later route. | `@claim:six-games`; live all-game Axe sweep. |
| F-3-2 / F-02 | Retained “learning platform” in all dynamic long-link copy. | Copy audit; `@claim:long-class-link`. |
| F-3-3 / F-08 / F-2-6 | Kept one wordmark/nav/footer shell across app, game, legal, and 404 routes. | Live shared-shell test. |
| F-3-4 | Kept one observable fresh-demo claim for each game. | Six `@claim:*-play` tests. |
| F-3-5 | Kept browser-cookie and `Set-Cookie` coverage. | `@claim:no-cookies`. |
| F-3-6 | Retained deterministic lesson-file download/import rather than environment-dependent sharing. | `@claim:lesson-file`. |
| F-3-7 | Retained the plain input-requirement empty state. | Copy audit. |
| F-3-8 | Kept visible mobile labels for Copy link and Fullscreen. | Live mobile layout test and demo mobile screenshot. |

## Independent verification findings

| Finding | Change retained or made | Evidence |
| --- | --- | --- |
| verification-1 high | Word Reveal and Quiz Race use valid accessible semantics; all game modes are scanned. | Live all-game Axe sweep. |
| verification-1 medium: URL | Maximum URLs remain copyable with a lossless lesson-file fallback. | `@claim:long-class-link`, `@claim:lesson-file`. |
| verification-1 medium: PWA | Manifest icons/version, update behavior, and offline cache remain tested. | Clean `built PWA files…`, update regression, and `@claim:offline-demo`. |
| verification-1 medium: security/cache | CSP, frame protection, referrer policy, nosniff, and asset caching remain configured. | Clean deployment-config test; live response headers. |
| verification-1 low | Fullscreen remains an API-verified labelled action. | `@claim:fullscreen`. |
| verification-2 high | Exact 30-pair sharing and lesson recovery remain lossless. | `@claim:long-class-link`, `@claim:lesson-file`. |
| verification-2 low | The manifest retains its configured standard MIME type. | Live manifest header check. |
| verification-3 | No separate defect was recorded; its verified behavior is covered by this regression pass. | Clean `npm test`, build, and live claim/structure checks. |

No blocking, major, minor, or informational review finding remains open.
