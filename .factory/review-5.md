# Adversarial first-read review 5

**Product:** Wordlist Arcade  
**Reviewed:** 2026-08-28  
**Candidate:** `9a3696c27d189dcad8400085d93dcc29baa93dae`  
**Verdict: FAIL**

The product is clear, immediately playable, visually specific, and functionally
healthy. However, two earlier privacy/storage claim findings are only
half-fixed at the test-contract level. Six additional claim, copy, and
structure findings remain. PASS requires zero findings and no untested claim.

## Findings

### F-5-1 / F-04.17 — BLOCKING — the local-draft claim test does not prove that the app saves or restores a draft

- **Exact claims:** landing, “Lists stay on this device”; README, “Real drafts
  use browser local storage”; Privacy, “The vocabulary draft you type is saved
  in your browser’s local storage so it is there when you return” and “You can
  remove it at any time with ‘Clear list’…”
- **Location:** `.factory/claims.json` entry `local-device` and
  `tests/app.spec.ts`, `@claim:local-device`.
- **Evidence:** the tagged test calls `localStorage.setItem(...)` itself. It
  then checks that demo entry did not alter those seeded values. It never types
  a real draft through the product, reloads, and verifies that the product
  restores the exact title and rows. It also never uses Clear list and checks
  that the stored draft is gone. `@claim:demo-discard` repeats the same direct
  seeding. Save/restore works in a separate live manual check: a title and
  three rows survived reload exactly. That does not repair the declared test
  gap.
- **Why this blocks:** F-04.17 required the real draft-storage promise to be
  exercised. A passing test that creates the expected storage state itself
  cannot prove the product created or restored it. The claim is still untested
  from the user action that makes it observable.
- **Concrete fix:** change `@claim:local-device` to type a title and at least
  three pairs in normal mode, assert the exact app-created keys, reload, and
  assert the exact values in the form. Click Clear list and assert that the
  form and real keys are cleared. Then recreate the draft, enter/reset/leave
  demo mode, and confirm the real values remain exact and no request contains
  the draft.

### F-5-2 / F-04.21 — BLOCKING — the “hash is not sent” privacy claim has no request-level test

- **Exact quote:** Privacy, “Browsers do not send that hash fragment to our web
  server.”
- **Location:** `privacy/index.html`; nearest entries are `class-link` and
  `no-tracking`.
- **Evidence:** `@claim:class-link` confirms that copied state appears after
  `#` and that the link opens. It does not record the fresh-context navigation
  request. `@claim:no-tracking` records a direct demo flow, not a copied class
  link. No registered claim states or tests the quoted server-disclosure
  promise.
- **Why this blocks:** this was the substance of F-04.21. The URL shape is now
  tested, but the privacy outcome stated on the live site is not. The claims
  contract requires an observable request assertion, not an inference from
  string parsing.
- **Concrete fix:** register a `fragment-not-sent` claim. Open a copied class
  link in a fresh context while recording the navigation request; assert that
  the request URL and body contain neither `#d=` nor any sample word or
  meaning, while the client still restores every pair.

### F-5-3 — Major — lesson-file privacy promises are not covered by the lesson-file claim

- **Exact quotes:** Privacy, “It stays on your device until you choose a person,
  app, or location to send it to.” and “Importing a lesson file reads it in
  this browser only.”
- **Location:** `privacy/index.html`, “Lesson files.”
- **Evidence:** `@claim:lesson-file` proves exact download/import restoration,
  but it does not intercept requests during either action. `@claim:no-tracking`
  does not download or import a file.
- **Why:** a teacher can rely on these as data-handling promises. The existing
  result test does not prove either privacy sentence.
- **Concrete fix:** add one registered `lesson-file-local` test that records all
  requests while downloading and importing a uniquely identifiable list. It
  must assert that neither action causes a non-GET request or any additional
  network request carrying the list, and that only expected same-origin static
  resources are requested.

### F-5-4 — Major — the child-data statement is an unlisted claim

- **Exact quote:** Privacy, “The product does not ask children for personal
  information.”
- **Location:** `privacy/index.html`, “Children.”
- **Why:** neither `no-account` nor `no-tracking` states or tests this promise.
  `no-account` checks only for email/password-style account fields on the first
  demo screen.
- **Concrete fix:** add a `no-student-data-fields` claim and a demo test that
  traverses the maker and all six games, checking form labels, controls,
  storage, and requests. Use the narrower tested sentence “There are no fields
  for student names or contact details.” if that is the intended promise.

### F-5-5 — Major — the no-grading statement is an unlisted claim

- **Exact quote:** Terms, “They do not grade, assess, or make decisions about
  students.”
- **Location:** `terms/index.html`, “Classroom decisions.”
- **Why:** this is a meaningful product-scope promise for teachers, but no
  `claims.json` entry or tagged demo test covers it.
- **Concrete fix:** register `no-grading` and test all six demo modes for the
  absence of grade, roster, student-record, and decision output or storage.
  Keep the sentence only as broad as that observable test.

### F-5-6 — Minor — the README’s Node version is an unlisted compatibility claim

- **Exact quote:** README, “Requires Node.js 20 or later.”
- **Location:** `README.md`, “Run Wordlist Arcade locally.”
- **Why:** a contributor can rely on this minimum, but it has no claims entry
  or lowest-version test. The current Vite package declares `^20.19.0 ||
  >=22.12.0`; a manual Node 20.0.0 build completed but emitted an unsupported
  version warning.
- **Concrete fix:** state the dependency’s precise supported floor (“Node.js
  20.19.x or Node.js 22.12+”), declare it in `package.json#engines`, and test
  the lowest supported version in a registered compatibility check.

### F-5-7 — Minor — two demo toolbar buttons do not use result-naming verbs

- **Exact controls:** “Games” and “Fullscreen.”
- **Location:** the first demo game toolbar at 390 px and desktop.
- **Why:** “Games” does not say that it returns to game choice, and
  “Fullscreen” names a state rather than the action. Their accessible names do
  not repair the visible first-read wording; “Games” has no fuller accessible
  name.
- **Concrete fix:** show “Choose a game” and “Enter fullscreen”; change the
  latter to “Exit fullscreen” while active. Keep the accessible names identical
  to the visible result.

### F-5-8 — Minor — external contact links are not identified as external

- **Exact quote:** “Sociobot.”
- **Location:** the contact sentence on both `/privacy/` and `/terms/` links to
  `https://sociobot.in` without an external-site cue.
- **Why:** the required route skeleton says external links must say so. A
  visitor cannot tell that this link leaves Wordlist Arcade before activating
  it.
- **Concrete fix:** label it “Sociobot (external site)” in visible text and the
  accessible name. An original external-link mark may supplement, but not
  replace, that wording.

## Cold first screen

I opened production cold in separate fresh Chromium contexts at 390×844 and
1440×1000. I did not scroll before recording the answers.

- **What it does:** makes six vocabulary games from word pairs.
- **For whom:** language, ESL, and primary teachers needing a quick activity
  from the current week’s words.
- **What to click first:** “Paste your word pairs” for real work, or “Try it
  with sample data” to inspect a ready game.

The decisive text was “Make six vocabulary games,” followed by “For language,
ESL, and primary teachers who need a quick activity from this week’s words.”
Both actions and “Open a ready-to-play photosynthesis game” were visible before
scrolling. The three facts—“Free to use,” “No account,” and “Lists stay on this
device”—were also visible. Mobile width was exactly 390 px with no horizontal
overflow; neither viewport logged a console error. This part passes.

## Copy audit

Counts exclude standalone punctuation, count URLs as one word, and count
hyphenated terms as one word. Headings, labels, links, and controls are listed
because they must also make sense out of context. No landing or README line
exceeds 22 words. No banned marketing adjective appears. F-5-6 and F-5-7 are
the only copy-related flags.

### Landing page

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | Pass |
| L02 | 2 | Wordlist Arcade | Pass |
| L03 | 1 | Demo | Pass, navigation |
| L04 | 3 | Make a game | Pass |
| L05 | 1 | Privacy | Pass, navigation |
| L06 | 4 | Vocabulary games for class | Pass |
| L07 | 4 | Make six vocabulary games | Pass; `six-games` |
| L08 | 15 | For language, ESL, and primary teachers who need a quick activity from this week’s words. | Pass |
| L09 | 4 | Paste your word pairs | Pass |
| L10 | 5 | Try it with sample data | Pass; `sample-demo` |
| L11 | 5 | Open a ready-to-play photosynthesis game. | Pass; `sample-demo` |
| L12 | 3 | Free to use | Pass; `free-to-use` |
| L13 | 2 | No account | Pass; `no-account` |
| L14 | 5 | Lists stay on this device | **Flag: F-5-1** |
| L15 | 3 | Make vocabulary games | Pass |
| L16 | 3 | Paste word pairs | Pass |
| L17 | 8 | Put one word and meaning on each line. | Pass |
| L18 | 7 | We check the list as you type. | Pass; `list-check` |
| L19 | 2 | List name | Pass |
| L20 | 7 | Shown at the top of each game | Pass |
| L21 | 3 | Words and meanings | Pass |
| L22 | 6 | Example: nocturnal — active during the night | Pass |
| L23 | 3 | Load sample list | Pass, result-naming verb |
| L24 | 2 | Clear list | Pass, result-naming verb |
| L25 | 3 | Copy class link | Pass; `class-link` |
| L26 | 7 | Add 3 pairs to choose a game. | Pass, useful empty state |
| L27 | 6 | Share a game with your class | Pass |
| L28 | 4 | Copy a class link. | Pass; `class-link` |
| L29 | 12 | If your learning platform rejects a long link, download a lesson file. | Pass; `lesson-file` |
| L30 | 3 | Download lesson file | Pass; `lesson-file` |
| L31 | 2 | Import lesson | Pass; `lesson-file` |
| L32 | 5 | Use 3 to 30 pairs. | Pass; `pair-limit` |
| L33 | 10 | Use a dash or colon between each word and meaning. | Pass |
| L34 | 3 | Choose a game | Pass |
| L35 | 2 | 0 pairs | Pass |
| L36 | 2 | Match up | Pass |
| L37 | 6 | Connect each word to its meaning. | Pass; `match-up-play` |
| L38 | 2 | Word strike | Pass |
| L39 | 7 | Hit the right word before moving on. | Pass; `word-strike-play` |
| L40 | 1 | Anagram | Pass |
| L41 | 6 | Unscramble the word from its clue. | Pass; `anagram-play` |
| L42 | 2 | Word reveal | Pass |
| L43 | 6 | Reveal letters without using six misses. | Pass; `word-reveal-play` |
| L44 | 2 | Memory grid | Pass |
| L45 | 5 | Find every hidden word-and-meaning pair. | Pass; `memory-play` |
| L46 | 2 | Quiz race | Pass |
| L47 | 6 | Answer up to five multiple-choice clues. | Pass; `quiz-race-play` |
| L48 | 5 | How to make a game | Pass |
| L49 | 6 | Make a game in three steps | Pass |
| L50 | 3 | Paste word pairs | Pass |
| L51 | 5 | Add words, translations, or definitions. | Pass |
| L52 | 3 | Choose a game | Pass |
| L53 | 8 | Pick any of six games from your list. | Pass; `six-games` |
| L54 | 3 | Play or share | Pass |
| L55 | 7 | Play together or copy a class link. | Pass; `class-link` |
| L56 | 6 | Wordlist Arcade makes classroom vocabulary games. | Pass |
| L57 | 5 | Built by Param Factory · 20260828-polish4-r4 | Pass |
| L58 | 1 | Demo | Pass, footer link |
| L59 | 1 | Privacy | Pass, footer link |
| L60 | 1 | Terms | Pass, footer link |

The demo adds “Demo — sample data, nothing is saved” (6), “Reset demo” (2),
“Start for real” (3), “Games” (1), “Copy link” (2), and “Fullscreen” (1).
“Games” and “Fullscreen” are flagged in F-5-7.

### README

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| R01 | 2 | Wordlist Arcade | Pass |
| R02 | 4 | Paste a vocabulary list. | Pass |
| R03 | 4 | Make six classroom games. | Pass; `six-games` |
| R04 | 6 | For language, ESL, and primary teachers. | Pass |
| R05 | 7 | Make a quick activity without an account. | Pass; `no-account` |
| R06 | 3 | Live site: https://wordlist-arcade.sociobot.in | Pass |
| R07 | 4 | Make a vocabulary game | Pass |
| R08 | 8 | Paste one word and meaning on each line. | Pass |
| R09 | 13 | Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race. | Pass; `six-games` |
| R10 | 7 | Play together or copy a class link. | Pass; `class-link` |
| R11 | 5 | Use the sample at https://wordlist-arcade.sociobot.in/?demo=1. | Pass |
| R12 | 6 | It opens a ready-to-play photosynthesis game. | Pass; `sample-demo` |
| R13 | 9 | The demo keeps sample data separate from your drafts. | Pass; `demo-discard` |
| R14 | 4 | Reset restores the sample. | Pass; `demo-discard` |
| R15 | 7 | Leaving the demo deletes the sample data. | Pass; `demo-discard` |
| R16 | 7 | Wordlist Arcade accepts 3 to 30 pairs. | Pass; `pair-limit` |
| R17 | 7 | It checks each row while you type. | Pass; `list-check` |
| R18 | 10 | It can copy a class link that contains the list. | Pass; `class-link` |
| R19 | 8 | The app works offline after the first visit. | Pass; `offline-demo` |
| R20 | 8 | These claims are declared and tested in `.factory/claims.json`. | **Flag through F-5-1 to F-5-6** |
| R21 | 4 | Run Wordlist Arcade locally | Pass |
| R22 | 5 | Requires Node.js 20 or later. | **Flag: F-5-6** |
| R23 | 3 | Run the tests | Pass |
| R24 | 9 | Run every declared claim check from a clean clone: | Pass |
| R25 | 5 | Then run each printed command. | Pass |
| R26 | 14 | The browser tests build the static site and use the isolated `/?demo=1` entry point. | Pass |
| R27 | 12 | The deployable static site is in `dist/`, with `dist/index.html` at its root. | Pass; build verified |
| R28 | 8 | Azure Static Web Apps settings live in `public/staticwebapp.config.json`. | Pass |
| R29 | 1 | Privacy | Pass |
| R30 | 6 | Real drafts use browser local storage. | **Flag: F-5-1** |
| R31 | 6 | Demo drafts use separate browser storage. | Pass; `demo-discard` |
| R32 | 7 | A class link contains the shared list. | Pass; `class-link` |
| R33 | 11 | Do not put student names or confidential content in a list. | Pass, safety instruction |
| R34 | 6 | Read the privacy notice and terms. | Pass |
| R35 | 8 | Asset sources and provenance are documented in `.factory/design.md`. | Pass, repository pointer verified |
| R36 | 5 | Licensed under the MIT License. | Pass; `LICENSE` exists |

Terminology is otherwise consistent: **word pair** for an input row, **list**
for saved input, **demo** for the sandbox, **class link** for the recipient URL,
**lesson file** for download/import, **game** for a playable screen, and
**learning platform** for school software.

## Demo and sandbox

The one-click demo itself passes.

- The first-screen “Try it with sample data” link opens `/?demo=1` directly.
- The first resulting screen is Match up with six realistic photosynthesis
  terms and meanings; it is not an editor or empty state.
- The persistent demo chrome says “Demo — sample data, nothing is saved” and
  provides Reset demo and Start for real.
- Reset restores the exact six-pair sample. Start for real and browser Back
  remove every `demo:` key while preserving seeded real keys.
- Direct `/demo` works and has the canonical demo metadata.
- The live claim sweep confirmed same-origin-only runtime requests, no cookies,
  and an offline reload after the first controlled visit.
- A keyboard-only cold path reached the sample link by Tab and opened it with
  Enter. At 200% text size the mobile page retained its h1, both actions, and
  no horizontal overflow.

The remaining privacy-test defects are F-5-1 through F-5-5; they do not reflect
a failure of Reset or demo namespace isolation observed in this run.

## Declared claims

A no-local clone at `/tmp/wordlist-arcade-review5.zRp5IU`, commit
`9a3696c27d189dcad8400085d93dcc29baa93dae`, received `npm ci`. Every exact
command in `.factory/claims.json` was then run separately. Each command ran in
both desktop and 390 px mobile projects.

| Claim ID | Declared command result | Observable assertion |
| --- | --- | --- |
| `sample-demo` | PASS, 2/2 | populated Match up demo |
| `six-games` | PASS, 2/2 | all six games interact with accepted 60-character terms |
| `match-up-play` | PASS, 2/2 | exact pair remains confirmed |
| `word-strike-play` | PASS, 2/2 | correct word is confirmed |
| `anagram-play` | PASS, 2/2 | correct typed term advances |
| `word-reveal-play` | PASS, 2/2 | whole word solves before six misses |
| `memory-play` | PASS, 2/2 | found pair remains open |
| `quiz-race-play` | PASS, 2/2 | five-step race advances |
| `free-to-use` | PASS, 2/2 | sample reaches play without payment UI |
| `no-account` | PASS, 2/2 | sample reaches play without account fields |
| `local-device` | PASS command, **insufficient assertion** | seeded real keys unchanged; see F-5-1 |
| `pair-limit` | PASS, 2/2 | 31st row rejected; 30 retained |
| `list-check` | PASS, 2/2 | malformed row announced |
| `class-link` | PASS command, **incomplete privacy assertion** | state after `#` and fresh open; see F-5-2 |
| `long-class-link` | PASS, 2/2 | exact 30-row low-compressibility round trip |
| `lesson-file` | PASS command, **incomplete privacy assertion** | exact download/import; see F-5-3 |
| `fullscreen` | PASS, 2/2 | control calls Fullscreen API |
| `no-tracking` | PASS, 2/2 | direct demo flow is first-party |
| `no-cookies` | PASS, 2/2 | no cookie jar or `Set-Cookie` value |
| `offline-demo` | PASS, 2/2 | demo reloads offline after first visit |
| `demo-discard` | PASS, 2/2 | Reset, Back, and Start for real isolate and delete demo keys |

Result: **21/21 commands and 42/42 project executions returned success.** The
three insufficient assertions and three unlisted claims above mean the claims
gate is not complete despite the green command results.

The full clean-clone suite also passed: 10/10 Vitest tests and 68/68 applicable
Playwright tests, with two intended desktop-only skips. `npm run build` passed
and produced `dist/`; entry JavaScript is 34,998 bytes raw and 11.66 kB gzip.

The same claim grep passed **42/42 on production**. The remaining live
structure/accessibility regression passed 22 applicable tests with two
intended skips. Production JavaScript and CSS SHA-256 hashes exactly match the
clean-clone build.

## Earlier-finding verification

I read all four earlier reviews, all four polish reports, all three independent
verification reports, and the prior handoff. “Fixed” below means rechecked in
current source and production, not copied from a repair report.

### Review 1

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-01 | Fixed | Both cold first screens state job, audience, real action, sample action, and facts. |
| F-02 | Fixed for its quoted copy | Former metaphors, “setup maze,” “LMS,” and contextless headings are absent. New button issue is F-5-7. |
| F-03 | Fixed | One-click populated demo, namespace separation, Reset, Back, Start for real, and offline reload pass live. |
| F-04 | Register exists but claim gate remains incomplete | All commands return success; F-5-1 to F-5-6 document current coverage defects. |
| F-04.01 | Fixed | `six-games` opens and uses every mode with accepted boundary terms. |
| F-04.02 | Fixed | Six-game, free, and no-account statements have separate passing entries. |
| F-04.03 | Fixed for demo isolation | Real seeded keys remain exact; demo keys are separate. Persistence test gap is F-5-1/F-04.17. |
| F-04.04 | Fixed | Full observed demo flow is same-origin. |
| F-04.05 | Fixed | Invalid rows are announced as typed. |
| F-04.06 | Fixed for restoration | Lesson download/import restores exact data. Local-only privacy gap is F-5-3. |
| F-04.07 | Fixed | The 31st row is rejected while 30 rows remain usable. |
| F-04.08 | Fixed | One valid list drives all six functional games. |
| F-04.09 | Fixed | Copied state is after `#` and opens in a fresh context. |
| F-04.10 | Fixed | Free and account-free entry are independently exercised. |
| F-04.11 | Fixed | Demo actions leave seeded real values byte-for-byte unchanged. |
| F-04.12 | Fixed | README six-game wording maps to `six-games`. |
| F-04.13 | Fixed | README pair range maps to the boundary test. |
| F-04.14 | Fixed | README class-link behavior maps to a fresh-context round trip. |
| F-04.15 | Fixed | Maximum 30-pair link and lesson-file fallback round-trip exactly. |
| F-04.16 | Fixed behavior | Fullscreen API invocation passes; visible verb issue is new F-5-7. |
| F-04.17 | **Half-fixed — BLOCKING** | Live persistence works, but its tagged test seeds storage rather than proving app save/restore; F-5-1. |
| F-04.18 | Fixed | Previously opened root and demo shells reload offline. |
| F-04.19 | Fixed for the earlier account/tracking text | No-account, no-tracking, and no-cookie entries pass. New child/no-grade statements are F-5-4/F-5-5. |
| F-04.20 | Fixed | Reset, Back, and Start for real delete all demo keys without changing real keys. |
| F-04.21 | **Half-fixed — BLOCKING** | Hash placement/restoration pass; server-request privacy outcome is unregistered and unasserted; F-5-2. |
| F-05 | Fixed | Unknown production URL returns the designed shell with HTTP 404 and a home action. |
| F-06 | Fixed | Titles, canonical URLs, h1 focus, announcement, and browser Back pass. |
| F-07 | Fixed | Root, demo, games, legal pages, and 404 have complete route metadata. |
| F-08 | Fixed | Root, demo/game, legal, and 404 retain matching header/footer content. |

### Review 2

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-2-1 / F-03 | Fixed | No double prefix; Reset and every tested exit clear demo keys. |
| F-2-2 / F-04.15 | Fixed | Registered maximum-link test restores exact title and 30 rows. |
| F-2-3 / F-07 | Fixed | 404 canonical and `og:url` both use `/404`. |
| F-2-4 | Fixed | All visible mobile shell controls meet 44×44 px. |
| F-2-5 | Fixed | Demo banner semantics have zero Axe violations. |
| F-2-6 | Fixed | Game routes use the same wordmark, navigation, and footer vocabulary. |
| F-2-7 | Fixed | Untestable art promise is absent from visitor copy; provenance remains in design docs. |
| F-2-8 | Fixed | “game room” is absent; label says “top of each game.” |
| F-2-9 | Fixed | Separator help says “dash or colon.” |
| F-2-10 | Fixed | README demo behavior uses separate short sentences. |
| F-2-11 | Fixed | README calls it a class link rather than teaching hash syntax. |
| F-2-12 | Fixed | README says separate browser storage, not namespace. |
| F-2-13 | Fixed | README plainly says the class link contains the shared list. |
| F-2-14 | Fixed | Heading says “Make a vocabulary game.” |
| F-2-15 | Fixed | Heading says “Run Wordlist Arcade locally.” |
| F-2-16 | Fixed | Heading says “Run the tests.” |

### Review 3

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-3-1 / F-04.01 / F-04.08 | Fixed | 60-character accepted terms work in Anagram and all other modes without console errors. |
| F-3-2 / F-02 | Fixed | Reachable copy uses “learning platform”; “LMS” is absent. |
| F-3-3 / F-08 / F-2-6 | Fixed | Shared shell text is exact across root, demo/game, legal, and 404 routes. |
| F-3-4 | Fixed | Each game has one tagged behavior claim and passing test. |
| F-3-5 | Fixed | Cookie jar and response-header checks pass through a complete demo game action. |
| F-3-6 | Fixed | Environment-dependent Share lesson is absent; deterministic lesson-file transfer passes. |
| F-3-7 | Fixed | “unlock” is absent; empty state says how many pairs to add. |
| F-3-8 | Fixed for visibility | Copy link and Fullscreen text is visible at 390 px; verb-quality issue is new F-5-7. |

### Review 4 and independent verification

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-4-1 / F-03 | Fixed | Browser Back now removes every demo key and preserves real data. |
| F-4-2 | Fixed | Service-worker update test and full clean-clone suite pass. |
| Verification 1 high | Fixed | All populated games pass the current Axe sweep; demo shell has zero violations. |
| Verification 1 medium: URL | Fixed | Maximum class link and lesson fallback are exact and usable. |
| Verification 1 medium: PWA | Fixed | Versioned manifest, icons, offline startup, and update behavior pass locally. |
| Verification 1 medium: security/cache | Fixed | CSP, frame denial, no-referrer, nosniff, and immutable asset rules are present live/local. |
| Verification 1 low | Fixed | Fullscreen control directly invokes the browser API. |
| Verification 2 high | Fixed | Exact 30-pair low-compressibility list round-trips. |
| Verification 2 low | Fixed | Live manifest is served as `application/manifest+json`. |
| Verification 3 | No defect recorded; retained | Its covered end-to-end behaviors pass in the current regression run. |

## Structure, accessibility, and visual identity

- Root title is “Wordlist Arcade — vocabulary games for class.” Demo, Privacy,
  Terms, every game, and 404 use the required route-first pattern. All checked
  titles are under 60 characters.
- Root, direct `/demo`, `/?demo=1`, Privacy, Terms, games, `/404.html`, and an
  unknown route have `lang=en`, exactly one h1, one main landmark, descriptions,
  canonical URLs, Open Graph/Twitter metadata, the 1200×630 social image, SVG
  favicon, and Apple touch icon. Unknown routes return HTTP 404.
- `robots.txt`, `sitemap.xml`, PWA manifest, service worker, and deep-link
  rewrites are present. The sitemap lists root, demo, Privacy, and Terms.
- Every discovered intended destination returned 200, including external
  Sociobot. The deliberate unknown URL returned 404. F-5-8 is a labeling issue,
  not a dead link.
- Route navigation uses history state; Back restores the maker and focuses its
  h1. Route changes focus the h1 and update the polite announcer.
- `/opt/fleet/lib/verify-url.sh` passed root and demo: load times 659 ms and
  758 ms, no console errors, one h1, `lang=en`, main present, no missing alt,
  and no unnamed button.
- Current Axe integration reports zero demo violations and no serious/critical
  issue in any populated game. Keyboard entry, focus ring, 44 px targets,
  reduced-motion duration, 200% text, and 390 px overflow checks pass.
- The warm-paper palette, marker outlines, offset shadows, word-machine art,
  geometric game shapes, and restrained tile motion form a recognizable
  classroom identity. It is not the centered gradient/three-card SaaS pattern.
  Asset provenance is documented and source assets are present.

## Missed leverage

No missed-leverage finding. The researched scope explicitly excludes
AI-generated content; adding model calls would introduce cost and privacy
friction to a deterministic word-pair task. Lesson-file import/export and
class-link sharing already cover the obvious transfer need. Account-based sync
would contradict the account-free, local-first contract.

## What would make this perfect

Close all eight findings: make the storage, fragment, lesson-file privacy,
child-data, no-grading, and Node-support promises fully registered and
observable; rename the two noun-only game controls; and identify external
links before activation. Then rerun every exact claim command from another
clean clone and repeat the full live mobile/desktop checklist. Nothing else is
needed for a zero-finding PASS.
