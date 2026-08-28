# Polish round 2 — cumulative finding resolution

Repaired from review base `aac8cbd1f419bec84e84e73d05bc7d5478d494db`.
Application repair commits are `7788661`, `47abfab`, and `b7e7e87`.
Production deployment `47c16cd2-a938-4383-a1c6-83c859199673` is at
<https://wordlist-arcade.sociobot.in/>.

Evidence paths used below:

- Cold local screens: `.factory/evidence/polish-2/local/screenshot-mobile.png`
  and `screenshot-desktop.png`.
- Local demo screen: `.factory/evidence/polish-2/local/demo-mobile.png`.
- Cold live screens: `.factory/evidence/polish-2/live/screenshot-mobile.png`,
  `screenshot-desktop.png`, `demo-mobile.png`, and `404-desktop.png`.
- Machine reports: `.factory/evidence/polish-2/local/verify.json`, local
  `lighthouse.json`, live `verify.json`, and live `lighthouse.json`.

## Review 1 and inherited findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-01 | Kept the approved job-first headline, named language/ESL/primary teachers, placed sample and real actions together, and retained three separate facts. | `landing page is accessible and has no console errors`; cold mobile screenshots; live `/` check. |
| F-02 | Rewrote every flagged metaphor, heading, separator instruction, and README heading; removed implementation jargon from teacher instructions. | `.factory/copy-audit.md`; cold screenshots; live `/` check. |
| F-03 | Fixed Reset’s double-prefix bug, clears every demo key on exit, protects seeded real keys, and clears the sandbox when any demo link leaves it. | `@claim:demo-discard`, `@claim:sample-demo`, `@claim:local-device`, `@claim:offline-demo`; live `/?demo=1`; demo screenshot. |
| F-04 | Maintained `.factory/claims.json` and expanded it to 14 uniquely tagged claims. | All 14 exact claim commands passed in a clean clone; all 28 desktop/mobile claim runs passed live. |
| F-04.01 | Six modes are generated from the sample list. | `@claim:six-games`; live demo. |
| F-04.02 | Split the old compound promise into independently checked six-game, free, and no-account facts. | `@claim:six-games`, `@claim:free-to-use`, `@claim:no-account`. |
| F-04.03 | Uses the precise device-storage fact. | `@claim:local-device`. |
| F-04.04 | Same-origin-only runtime behavior is asserted through a complete demo flow. | `@claim:no-tracking`, `@claim:local-device`. |
| F-04.05 | Live list validation is declared and checks the announced error. | `@claim:list-check`. |
| F-04.06 | Lesson download/import restores exact content in a fresh context. | `@claim:lesson-file`. |
| F-04.07 | The 3–30 boundary rejects row 31 while retaining 30 rows. | `@claim:pair-limit`. |
| F-04.08 | All six game buttons enable from the same list. | `@claim:six-games`. |
| F-04.09 | A copied class link opens the encoded game in a fresh context. | `@claim:class-link`. |
| F-04.10 | Free use and no account are separate registered facts. | `@claim:free-to-use`, `@claim:no-account`. |
| F-04.11 | Seeded real drafts remain byte-for-byte unchanged during demo use. | `@claim:local-device`, `@claim:demo-discard`. |
| F-04.12 | README uses the same six-game teacher wording as the product. | README audit; `@claim:six-games`. |
| F-04.13 | README pair-range wording maps to the registered boundary test. | `@claim:pair-limit`. |
| F-04.14 | README class-link wording maps to fresh-context link restoration. | `@claim:class-link`. |
| F-04.15 | Added the missing maximum 30-pair claim and exact-title/all-30-row round trip. | `@claim:long-class-link`, `@claim:lesson-file`; both passed live. |
| F-04.16 | Fullscreen control invokes the browser API. | `@claim:fullscreen`. |
| F-04.17 | Real draft persistence and isolation are asserted directly. | `@claim:local-device`. |
| F-04.18 | Offline behavior is limited to after-first-visit wording and tested inside demo. | `@claim:offline-demo`; live run passed. |
| F-04.19 | No-account and no-tracking privacy statements have dedicated tests. | `@claim:no-account`, `@claim:no-tracking`. |
| F-04.20 | Reset and exit now use one demo prefix and leave no demo key behind. | `@claim:demo-discard`. |
| F-04.21 | Shared state stays in the link fragment and opens in a fresh context. | `@claim:class-link`. |
| F-05 | Unknown production routes return the designed 404 and a home action. | `demo reset, titles, focus, metadata, and the designed 404 route work`; live unknown URL returned 404; 404 screenshot. |
| F-06 | Demo/game routes set titles, canonical/OG URLs, announce navigation, focus the h1, and restore focus on Back. | `demo reset, titles, focus, metadata, and the designed 404 route work`; live `/demo` and `/play/*` checks. |
| F-07 | All routes retain canonical/social metadata; 404 now includes the missing `og:url`. | Metadata test checks unknown route and `/404.html`; live HTML contains `https://wordlist-arcade.sociobot.in/404`. |
| F-08 | Root, legal, 404, and game screens expose wordmark/navigation/footer/legal links and the current build id. | `legal pages and the static 404 page keep the accessible site shell`; `demo shell has zero axe violations and games include site navigation`. |

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 / F-03 | Reset now passes raw storage names to the one prefixing function; exit removes all demo-prefixed keys after the exact Reset → play → Back flow. | `@claim:demo-discard` preserves seeded real keys and asserts zero `demo:` keys; passed desktop/mobile locally and live. |
| F-2-2 / F-04.15 | Registered `long-class-link` and tagged the maximum low-compressibility 30-pair test. | `@claim:long-class-link` asserts exact title, exact textarea, 30 rows, and successful fresh-context open. |
| F-2-3 / F-07 | Added `og:url` to the static 404. | Metadata test plus live 404 status/HTML check; `live/404-desktop.png`. |
| F-2-4 | Raised wordmark, demo actions, nav/footer links, legal links, and static-404 links to at least 44×44 CSS pixels. | `mobile controls meet the 44 pixel target on every site shell`; live mobile run passed. |
| F-2-5 | Removed `role=status` from the `aside`; only the banner message is a nested status region. | `demo shell has zero axe violations and games include site navigation`; zero axe violations across all six demo games. |
| F-2-6 | Added the compact Wordlist Arcade home link and Privacy link above game controls. | Game-shell test; live demo screenshot. |
| F-2-7 | Removed generated/original artwork claims from live footer and README; provenance stays in the required design record. | Copy audit and source search; live footer screenshot. |
| F-2-8 | Replaced “game room” with “Shown at the top of each game.” | `.factory/copy-audit.md`; live maker check. |
| F-2-9 | Replaced separator jargon with “Use a dash or colon between each word and meaning.” | `.factory/copy-audit.md`; live maker check. |
| F-2-10 | Split README demo behavior into three short sentences. | README and copy audit; `@claim:demo-discard`. |
| F-2-11 | README now says the class link contains the list, without raw hash syntax. | README audit; `@claim:class-link`. |
| F-2-12 | README says demo drafts use separate browser storage. | README audit; `@claim:demo-discard`. |
| F-2-13 | README privacy text says a class link contains the shared list. | README audit; `@claim:class-link`. |
| F-2-14 | Renamed “Use it” to “Make a vocabulary game.” | README heading audit. |
| F-2-15 | Renamed “Develop” to “Run Wordlist Arcade locally.” | README heading audit. |
| F-2-16 | Renamed “Verify” to “Run the tests.” | README heading audit. |

## Earlier verification findings carried through polish 1

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| verification-1 high | Word Reveal hidden text and Quiz Race progressbar retain valid semantics. | Full game axe tests at desktop/mobile; demo shell has zero violations. |
| verification-1 medium: URL | Maximum links remain copyable with a complete lesson-file fallback. | `@claim:long-class-link`, `@claim:lesson-file`. |
| verification-1 medium: PWA | Raster any/maskable icons, versioned startup, update prompt, and offline cache remain present. | `built PWA files declare install icons, versioned startup, update control, and deployment headers`; offline claim. |
| verification-1 medium: security/cache | CSP/frame protection and immutable hashed assets remain configured. | PWA/config test; live response headers. |
| verification-1 low | Fullscreen API path remains directly tested. | `@claim:fullscreen`. |
| verification-2 high | The exact 30-pair boundary remains shareable and losslessly restorable. | `@claim:long-class-link`; live desktop/mobile pass. |
| verification-2 low | Added Azure MIME mapping for `.webmanifest`. | PWA/config test; live response is `content-type: application/manifest+json`. |
| verification-3 | No defect was recorded; its passing behaviors remain in the full regression suite. | Clean-clone `npm test` and live claim/structure runs. |

## Verification summary

- Clean clone of repair commit: `npm ci`; every exact command in
  `.factory/claims.json`; `npm test`; `npm run build` — all passed.
- Full suite: 10/10 unit tests; 52 browser passes; two intentional project
  skips. Claim commands: 14/14 commands and 28/28 desktop/mobile runs.
- Live after final deployment: 28/28 claim runs and 16/16 applicable
  structure/accessibility runs passed; two project-selection skips.
- Live unknown route: HTTP 404 with title, h1, canonical, social image, and
  `og:url`. Root, `/demo`, Privacy, and Terms return HTTP 200.
- Live Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 0 ms, CLS 0.
- Bundles: entry JS 35.75 kB raw / 11.74 kB gzip; CSS 15.77 kB raw /
  4.29 kB gzip; mobile hero 17.24 kB.

No review or verification finding remains open.
