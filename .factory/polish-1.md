# Polish round 1 — finding resolution

Candidate repaired from `e92c15347059a21c75c013e467b0797306b96489`.
Local visual evidence: `.factory/evidence/local/screenshot-desktop.png` and
`.factory/evidence/local/screenshot-mobile.png`. Local cold-shell evidence is
`.factory/evidence/local/verify.json`; Lighthouse evidence is
`.factory/evidence/local/lighthouse.json`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-01 | Replaced the metaphor headline with “Make six vocabulary games”; named language, ESL, and primary teachers; named both paste and sample actions; kept the three facts as separate lines. | `landing page is accessible and has no console errors`; local mobile screenshot; live root check after deployment. |
| F-02 | Removed “Anagram lab,” “game shelf,” and other contextless/metaphoric language. Rewrote README and completed the landing copy audit with counts and terminology. | `.factory/copy-audit.md`; `npm test`; local screenshots. |
| F-03 | `?demo=1` and `/demo` immediately open a photosynthesis Match up game. Demo writes only `demo:` keys, has Reset demo and Start for real, and Start for real clears both persisted and in-memory sample state. | `@claim:sample-demo`, `@claim:local-device`, `@claim:offline-demo`, `starting for real discards sample state`; `.factory/demo.md`; live demo check. |
| F-04 | Added the claims register and one uniquely tagged demo-path assertion per current visitor-facing claim. Unsupported old copy was removed rather than left as an untestable promise. | Every command in `.factory/claims.json`; `npm run test:claims -- --grep @claim`. |
| F-04.01 | “Six games” is now the tested `six-games` claim. | `@claim:six-games`. |
| F-04.02 | Removed the bundled speed/limit promise; separate tested free, account, and six-game facts remain. | `@claim:free-to-use`, `@claim:no-account`, `@claim:six-games`. |
| F-04.03 | Replaced “Private by default” with the precise tested device-storage fact. | `@claim:local-device`. |
| F-04.04 | The no-upload/no-third-party promise is tested as same-origin-only demo traffic. | `@claim:no-tracking`. |
| F-04.05 | Kept live list checking as a named, tested claim. | `@claim:list-check`. |
| F-04.06 | Lesson-file restoration is now a named, tested claim. | `@claim:lesson-file`. |
| F-04.07 | The 3–30-pair limit is named and tested at 31 pairs. | `@claim:pair-limit`. |
| F-04.08 | One list producing all six modes is tested from the demo list. | `@claim:six-games`. |
| F-04.09 | The class-link promise is precise: test asserts encoded state is after `#` and opens in a fresh context. | `@claim:class-link`. |
| F-04.10 | “Free to use” and “No account” are separate tested facts. | `@claim:free-to-use`, `@claim:no-account`. |
| F-04.11 | Local-only storage is tested with seeded real data plus the isolated demo. | `@claim:local-device`. |
| F-04.12 | README now uses the same six-game, teacher-facing wording as the product. | `@claim:six-games`; README review. |
| F-04.13 | README’s 3–30 feature statement maps to the pair-limit claim. | `@claim:pair-limit`. |
| F-04.14 | README’s class-link statement maps to hash-only and fresh-context link checks. | `@claim:class-link`. |
| F-04.15 | README/link-limit wording now names the downloadable lesson-file fallback and has a round-trip assertion. | `@claim:lesson-file`; `exact low-compressibility 30-pair boundary stays shareable and round-trips in fresh contexts`. |
| F-04.16 | Fullscreen is a separately declared, browser-API-verified claim. | `@claim:fullscreen`. |
| F-04.17 | Local draft behavior is covered by the storage-isolation claim. | `@claim:local-device`. |
| F-04.18 | Offline wording is limited to first-visit behavior and tested through demo offline reload. | `@claim:offline-demo`. |
| F-04.19 | The privacy notice’s no-account/no-tracker statements map to the account and no-tracking checks. | `@claim:no-account`, `@claim:no-tracking`. |
| F-04.20 | Demo and real draft key namespaces are tested directly. | `@claim:local-device`. |
| F-04.21 | Hash-only shared state is asserted from the copied class link. | `@claim:class-link`. |
| F-05 | Replaced broad static fallback with explicit `/demo` and `/play/*` rewrites so all other unknown paths use the Azure 404 override. Expanded the styled static 404 shell. | `demo reset, titles, focus, metadata, and the designed 404 route work`; `legal pages and the static 404 page keep the accessible site shell`; live `/not-a-real-route` status check. |
| F-06 | Route-specific titles, canonical/OG URLs, polite announcements, and h1 focus are tested. Demo canonical is `/demo`; game canonical is its game route. | `demo reset, titles, focus, metadata, and the designed 404 route work`; `starting for real discards sample state and game metadata has the matching canonical URL`. |
| F-07 | Added/verified per-route canonical, Open Graph URL/image, Twitter image, Apple touch icon, and 404 metadata. | legal/404 shell test; local `verify.json`; live route metadata check. |
| F-08 | Legal and 404 pages now carry the shared wordmark/nav/footer information, Privacy and Terms links, Param Factory attribution, and build id. | `legal pages and the static 404 page keep the accessible site shell`; local screenshots. |
| verification-1 high | Word Reveal uses valid hidden text and Quiz Race uses a real progressbar; axe is run on all six games at desktop and mobile. | `all six populated game states have no serious or critical axe findings`. |
| verification-1 medium | The PWA has raster any/maskable icons, a versioned start URL, update control, CSP, frame protection, and immutable assets. | `built PWA files declare install icons, versioned startup, update control, and deployment headers`; `a waiting service-worker update is offered and can be applied`. |
| verification-1 low | Fullscreen has a direct browser-API regression assertion. | `@claim:fullscreen`. |
| verification-2 high / verification-3 note | A valid low-compressibility 30-pair link remains copyable and opens exactly; the lesson-file download/import fallback restores it exactly. | `the exact low-compressibility 30-pair boundary stays shareable and round-trips in fresh contexts`. |

## Local verification

- `npm test`: 10 Vitest tests and 48 Playwright project runs passed.
- `npm run build`: passed; `dist/index.html` exists. Entry JS is 35.29 kB raw
  (11.70 kB gzip), CSS is 15.08 kB raw (4.18 kB gzip), and the mobile hero is
  20 kB.
- `npm run test:claims -- --grep @claim`: 24 desktop/mobile claim runs passed.
- `verify-url.sh http://127.0.0.1:4173/`: title, lang, landmark, image-alt,
  labels, and console all passed; screenshots are recorded above.
- Playwright Axe scans cover landing, legal pages, static 404, and all game
  modes at desktop/mobile with no serious or critical violations.
- Local Lighthouse: Performance 100, Accessibility 100, SEO 100; LCP 1.5 s,
  CLS 0, TBT 0 ms.

## Live verification

Repair commit `91818d498ec1248608658b028d1b5cdc71a0f072` was pushed and deployed
with `/opt/fleet/lib/deploy-static.sh wordlist-arcade /work/repo/dist`
(Azure deployment `1bfb4d84-aace-4774-a9f6-17593e888ab6`). Cold live evidence
is in `.factory/evidence/live/`.

- Root: HTTP 200, title `Wordlist Arcade — vocabulary games for class`, h1
  `Make six vocabulary games`, exact first-screen facts, no console errors,
  and zero mobile horizontal overflow.
- `/?demo=1`: title `Demo — Wordlist Arcade`, a playable Match up h1,
  persistent sandbox banner, `/demo` canonical, and sample-only demo keys.
  A seeded real draft was byte-for-byte unchanged through demo entry and was
  retained after Start for real, while the demo key was discarded.
- `/not-a-real-route`: HTTP 404, `Page not found — Wordlist Arcade`, and
  `This page was not found` h1.
- `/privacy/` and `/terms/`: both HTTP 200 with their route-specific title,
  h1, and canonical URL.
- Live AxeBuilder scans of root, demo, Privacy, Terms, and 404 found zero
  serious or critical violations. See
  `.factory/evidence/live/live-axe-and-demo.json` and
  `.factory/evidence/live/live-check.json`; screenshots are
  `landing-desktop.png`, `landing-mobile.png`, and `demo-desktop.png`.
