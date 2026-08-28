# Adversarial first-read review 2

**Product:** Wordlist Arcade  
**Reviewed:** 2026-08-28  
**Base:** `fcc954caaa950cdf213fc97cf0d007e4e3563460`  
**Verdict: FAIL**

Three blocking findings prevent acceptance. Resetting the demo creates a second
sample-storage namespace that Start for real does not delete; the long-link
promise remains outside the claims register; and the 404 route still lacks an
Open Graph URL. There are also accessibility, shell-consistency, and
plain-language findings. PASS requires zero findings, so passing the declared
tests does not change this verdict.

## Findings

### F-2-1 / F-03 — BLOCKING — Reset leaves demo data behind after Start for real

- **Exact locations:** the live banner says “Demo — sample data, nothing is
  saved.” README says demo data “can be reset or discarded with **Start for
  real**.” `.factory/demo.md` says Start for real “deletes demo keys.”
- **Reproduction:** in a fresh 390×844 context, seed the real draft keys, open
  `/?demo=1`, choose Games, edit the list, choose **Reset demo**, open Match up,
  use Back, then choose **Start for real**.
- **Observed:** the seeded real draft remains byte-for-byte unchanged, which is
  correct. The UI also restores the sample correctly. After exit, however,
  local storage still contains `demo:demo:wordlist-arcade-draft` and
  `demo:demo:wordlist-arcade-title`, including all six photosynthesis pairs.
- **Code evidence:** `src/main.ts:104-105` passes an already-prefixed key from
  `storageKey(...)` into `writeLocal(...)`, which prefixes it again. `clearDemo`
  removes only the single-prefix keys.
- **Why this blocks:** F-03 was marked fixed in polish round 1, but the required
  discard guarantee fails after a normal Reset → play → Back path. The README
  discard sentence is also an unlisted claim: no `claims.json` entry exercises
  this sequence. Existing tests split Reset and Start for real into separate
  cases and assert only the two expected key names are absent.
- **Concrete fix:** call `writeLocal('wordlist-arcade-draft', EXAMPLE)` and
  `writeLocal('wordlist-arcade-title', DEMO_TITLE)` from Reset. Make exit remove
  every product-owned `demo:` key. Register the reset/discard claim and add one
  tagged clean-context test that performs the full sequence, preserves seeded
  real keys, and asserts that no key starts with `demo:` after exit.

### F-2-2 / F-04.15 — BLOCKING — the long-class-link promise is still unlisted

- **Exact live quote:** after entering a low-compressibility 30-pair list, the
  landing page says: “This complete class link is 9,993 characters. You can
  still copy it for browsers and tools that support long links. If an LMS or
  email tool rejects it, download or share the lesson file instead; importing
  it restores every pair.”
- **Why this blocks:** this is the same claim family as earlier finding
  F-04.15. `.factory/claims.json` has generic `class-link` and `lesson-file`
  entries, but their tagged tests use the six-row sample. Neither entry names
  or tests the displayed promise that a maximum-size link remains copyable and
  restores every pair. An untagged general test does cover the boundary, but
  the claims contract requires the sentence to have a registered, tagged test.
- **Concrete fix:** add a `long-class-link` claim entry and tag the existing
  30-pair round-trip test `@claim:long-class-link`, including exact title and all
  30 rows in a fresh context. Alternatively, remove the long-link claim and
  present the lesson-file fallback without promising browser/tool support.

### F-2-3 / F-07 — BLOCKING — the 404 route has incomplete Open Graph metadata

- **Location:** live `/not-a-real-route` and `public/404.html`.
- **Observed:** the route correctly returns HTTP 404 and has a title,
  description, canonical, favicon, `og:title`, `og:description`, `og:image`, and
  Twitter card fields. It has no `<meta property="og:url">`.
- **Why this blocks:** F-07 required per-route canonical and Open Graph
  metadata and was marked fixed. The 404 is still only partly fixed, so the
  history rule makes F-07 blocking again.
- **Concrete fix:** add `og:url` with
  `https://wordlist-arcade.sociobot.in/404` and assert it on both `/404.html`
  and an unknown live route.

### F-2-4 — Major — mobile controls do not meet the required 44 px target

- **Locations and measured boxes at 390 px:** root wordmark `170×38`; demo
  **Reset demo** `86×36`; demo **Start for real** `90×36`; legal-page header
  **Demo** `40×23`, **Privacy** `51×23`, and **Terms** `42×23`; legal footer
  links are also 23 px high.
- **Why:** these navigation and demo controls are harder to tap and fail the
  attached accessibility baseline of at least 44×44 px for every target.
- **Concrete fix:** give header/footer links and demo controls an inline-flex
  hit area with `min-width: 44px; min-height: 44px`, retaining visible spacing.
  Add a 390 px test that checks rendered boxes for all visible controls on the
  root, demo, legal, and 404 routes.

### F-2-5 — Minor — the demo banner uses an invalid ARIA role

- **Exact location:** `<aside class="demo-banner" role="status">` on the demo
  and all six demo game screens.
- **Evidence:** axe-core 4.13 reports `aria-allowed-role` because `status` is
  not allowed on `aside`. The existing suite discards minor axe findings.
- **Concrete fix:** keep the `aside` as a labelled complementary region and put
  only the non-interactive message in a nested `<span role="status">`; leave
  Reset and Start for real outside the live region. Assert zero axe violations,
  not only zero serious/critical violations, on the demo shell.

### F-2-6 — Minor — game routes do not use the consistent site header

- **Exact live header on `/?demo=1`:** “Games / Photosynthesis practice / Match
  up / Share / Fullscreen.” It contains no wordmark/home link and no Privacy
  link. Root, legal, and 404 routes use a wordmark plus site navigation.
- **Why:** a student arriving directly through a class link receives a different
  header and must reach the footer to find site/legal navigation.
- **Concrete fix:** retain the game controls but include the same compact
  Wordlist Arcade home link and Privacy navigation used by the shared shell.

### F-2-7 — Minor — generated-art provenance is an unlisted live claim

- **Exact quotes:** landing footer: “Hero artwork was generated for this
  project.” README: “The hero and social image are original generated
  classroom-machine artwork.”
- **Why:** these are factual claims visible to visitors/readers but have no
  `claims.json` entry. “Original” cannot be established by the current tests.
- **Concrete fix:** remove the live provenance sentence while retaining the
  required source and provenance record in `.factory/design.md`, or replace it
  with a narrowly testable statement and register the corresponding artifact
  check.

### F-2-8 — Minor — “game room” names a screen that does not exist

- **Exact quote/location:** landing, List name help: “Shown to students in the
  game room”.
- **Why:** the interface otherwise calls these screens games or game routes;
  “game room” introduces a second term without identifying a place in the UI.
- **Concrete rewrite:** “Shown at the top of each game.”

### F-2-9 — Minor — separator help uses unnecessary jargon

- **Exact quote/location:** landing editor help: “Put a dash, colon, equals
  sign, vertical bar, or tab between each word and meaning.”
- **Why:** “vertical bar” and “tab” ask a phone user to identify input syntax
  that is not needed for the ordinary path. This sentence is also missing from
  the supposedly complete `.factory/copy-audit.md`, which records only the
  preceding “Use 3 to 30 pairs.” sentence.
- **Concrete rewrite:** “Use a dash or colon between each word and meaning.”

### F-2-10 — Minor — the README demo sentence combines three ideas and jargon

- **Exact quote:** “Demo data uses `demo:` local-storage keys, never reads real
  drafts, and can be reset or discarded with **Start for real**.”
- **Why:** it combines isolation, implementation, Reset, and exit behavior in
  one sentence. It also states the currently failing discard claim.
- **Concrete rewrite after fixing F-2-1:** “The demo keeps sample data separate
  from your drafts. Reset restores the sample. Start for real deletes the
  sample data.”

### F-2-11 — Minor — the README explains class links with a raw hash symbol

- **Exact quote:** “It can copy a class link with the list data after `#`.”
- **Why:** a teacher does not need URL-fragment syntax to understand the result.
- **Concrete rewrite:** “It can copy a class link that contains the list.”

### F-2-12 — Minor — the README privacy section uses namespace jargon

- **Exact quote:** “Demo drafts use a separate `demo:` namespace.”
- **Why:** “namespace” describes the implementation, not the privacy outcome.
- **Concrete rewrite:** “Demo drafts use separate browser storage.”

### F-2-13 — Minor — the README repeats raw URL-fragment syntax

- **Exact quote:** “Shared list data is after `#` in a class link.”
- **Why:** the symbol does not explain the user-facing privacy boundary.
- **Concrete rewrite:** “A class link contains the shared list.” Follow it with
  the existing warning not to include confidential content.

### F-2-14 — Minor — README heading “Use it” is context-dependent

- **Exact location:** README heading `## Use it`.
- **Why:** heard alone in a heading list, “it” has no referent.
- **Concrete rewrite:** `## Make a vocabulary game`.

### F-2-15 — Minor — README heading “Develop” does not name the task

- **Exact location:** README heading `## Develop`.
- **Why:** it does not say whether the section covers setup, contribution, or
  deployment.
- **Concrete rewrite:** `## Run Wordlist Arcade locally`.

### F-2-16 — Minor — README heading “Verify” does not name what is verified

- **Exact location:** README heading `## Verify`.
- **Why:** the heading is unclear outside the README outline.
- **Concrete rewrite:** `## Run the tests`.

## Cold first screen

I opened production in fresh Chromium contexts at 390×844 and 1440×1000 and
recorded the first viewport before scrolling.

- **What it does:** turns word-and-meaning pairs into six vocabulary games.
- **For whom:** language, ESL, and primary teachers making an activity from the
  current week’s words.
- **What to click first:** **Try it with sample data** for a first try, or
  **Paste your word pairs** to begin real work.

The exact first-screen copy supports all three answers: “Make six vocabulary
games”; “For language, ESL, and primary teachers who need a quick activity from
this week’s words”; “Paste your word pairs”; and “Try it with sample data.” All
of this, including “Open a ready-to-play photosynthesis game” and the three
facts, fits in the cold mobile viewport. There was no horizontal overflow or
console error. The first screen passes.

## Copy audit

Counts use lexical words; hyphenated terms count as one and standalone symbols
do not count. Controls, headings, labels, and standalone navigation text are
included because the plain-words check explicitly covers them. Hidden
route-announcer duplication and decorative card numbers are excluded. `FLAG`
points to a finding above.

### Landing page

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | Pass |
| L02 | 2 | Wordlist Arcade | Pass |
| L03 | 1 | Demo | Pass |
| L04 | 3 | Make a game | Pass |
| L05 | 1 | Privacy | Pass |
| L06 | 4 | Vocabulary games for class | Pass |
| L07 | 4 | Make six vocabulary games | Pass |
| L08 | 15 | For language, ESL, and primary teachers who need a quick activity from this week’s words. | Pass |
| L09 | 4 | Paste your word pairs | Pass |
| L10 | 5 | Try it with sample data | Pass |
| L11 | 5 | Open a ready-to-play photosynthesis game. | Pass |
| L12 | 3 | Free to use | Pass |
| L13 | 2 | No account | Pass |
| L14 | 5 | Lists stay on this device | Pass; `local-device` claim |
| L15 | 3 | Make vocabulary games | Pass |
| L16 | 3 | Paste word pairs | Pass |
| L17 | 8 | Put one word and meaning on each line. | Pass |
| L18 | 7 | We check the list as you type. | Pass |
| L19 | 2 | List name | Pass |
| L20 | 7 | Shown to students in the game room | **FLAG F-2-8** |
| L21 | 3 | Words and meanings | Pass |
| L22 | 6 | Example: nocturnal — active during the night | Pass |
| L23 | 3 | Load sample list | Pass |
| L24 | 2 | Clear list | Pass |
| L25 | 3 | Copy class link | Pass |
| L26 | 8 | Add 3 more pairs to unlock the games. | Pass |
| L27 | 6 | Share a game with your class | Pass |
| L28 | 4 | Copy a class link. | Pass |
| L29 | 12 | If your learning platform rejects a long link, download a lesson file. | Pass |
| L30 | 2 | Download lesson | Pass |
| L31 | 2 | Share lesson | Pass |
| L32 | 2 | Import lesson | Pass |
| L33 | 5 | Use 3 to 30 pairs. | Pass |
| L34 | 15 | Put a dash, colon, equals sign, vertical bar, or tab between each word and meaning. | **FLAG F-2-9** |
| L35 | 3 | Choose a game | Pass |
| L36 | 2 | 0 pairs | Pass |
| L37 | 2 | Match up | Pass |
| L38 | 6 | Connect each word to its meaning. | Pass |
| L39 | 2 | Word strike | Pass |
| L40 | 7 | Hit the right word before moving on. | Pass |
| L41 | 1 | Anagram | Pass |
| L42 | 6 | Unscramble the word from its clue. | Pass |
| L43 | 2 | Word reveal | Pass |
| L44 | 6 | Reveal letters without using six misses. | Pass |
| L45 | 2 | Memory grid | Pass |
| L46 | 5 | Find every hidden word-and-meaning pair. | Pass |
| L47 | 2 | Quiz race | Pass |
| L48 | 5 | Answer five quick multiple-choice clues. | Pass |
| L49 | 5 | How to make a game | Pass |
| L50 | 6 | Make a game in three steps | Pass |
| L51 | 3 | Paste word pairs | Pass |
| L52 | 5 | Add words, translations, or definitions. | Pass |
| L53 | 3 | Choose a game | Pass |
| L54 | 8 | Pick any of six games from your list. | Pass |
| L55 | 3 | Play or share | Pass |
| L56 | 7 | Play together or copy a class link. | Pass |
| L57 | 6 | Wordlist Arcade makes classroom vocabulary games. | Pass |
| L58 | 7 | Hero artwork was generated for this project. | **FLAG F-2-7** |
| L59 | 5 | Built by Param Factory · 20260828-polish1-r1 | Pass |
| L60 | 1 | Demo | Pass |
| L61 | 1 | Privacy | Pass |
| L62 | 1 | Terms | Pass |

No cold landing sentence exceeds 22 words, and no banned marketing adjective
appears. Landing action labels name their result. The state-dependent 9,993-
character link copy is audited separately in F-2-2.

### README

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| R01 | 2 | Wordlist Arcade | Pass |
| R02 | 4 | Paste a vocabulary list. | Pass |
| R03 | 4 | Make six classroom games. | Pass |
| R04 | 6 | For language, ESL, and primary teachers. | Pass |
| R05 | 7 | Make a quick activity without an account. | Pass |
| R06 | 3 | Live site: https://wordlist-arcade.sociobot.in | Pass |
| R07 | 2 | Use it | **FLAG F-2-14** |
| R08 | 8 | Paste one word and meaning on each line. | Pass |
| R09 | 13 | Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race. | Pass |
| R10 | 7 | Play together or copy a class link. | Pass |
| R11 | 5 | Use the sample at https://wordlist-arcade.sociobot.in/?demo=1. | Pass |
| R12 | 6 | It opens a ready-to-play photosynthesis game. | Pass |
| R13 | 20 | Demo data uses `demo:` local-storage keys, never reads real drafts, and can be reset or discarded with Start for real. | **FLAG F-2-1, F-2-10** |
| R14 | 7 | Wordlist Arcade accepts 3 to 30 pairs. | Pass |
| R15 | 7 | It checks each row while you type. | Pass |
| R16 | 11 | It can copy a class link with the list data after `#`. | **FLAG F-2-11** |
| R17 | 8 | The app works offline after the first visit. | Pass |
| R18 | 8 | These claims are declared and tested in `.factory/claims.json`. | Pass for the listed claims; contradicted by F-2-1 and F-2-2 |
| R19 | 1 | Develop | **FLAG F-2-15** |
| R20 | 5 | Requires Node.js 20 or later. | Pass |
| R21 | 1 | Verify | **FLAG F-2-16** |
| R22 | 9 | Run every declared claim check from a clean clone: | Pass |
| R23 | 5 | Then run each printed command. | Pass |
| R24 | 14 | The browser tests build the static site and use the isolated `/?demo=1` entry point. | Pass |
| R25 | 12 | The deployable static site is in `dist/`, with `dist/index.html` at its root. | Pass |
| R26 | 8 | Azure Static Web Apps settings live in `public/staticwebapp.config.json`. | Pass in contributor context |
| R27 | 1 | Privacy | Pass |
| R28 | 6 | Real drafts use browser local storage. | Pass |
| R29 | 7 | Demo drafts use a separate `demo:` namespace. | **FLAG F-2-12** |
| R30 | 9 | Shared list data is after `#` in a class link. | **FLAG F-2-13** |
| R31 | 11 | Do not put student names or confidential content in a list. | Pass |
| R32 | 6 | Read the privacy notice and terms. | Pass |
| R33 | 10 | The hero and social image are original generated classroom-machine artwork. | **FLAG F-2-7** |
| R34 | 8 | Their source prompt and provenance are in `.factory/design.md`. | Pass as a repository pointer |
| R35 | 5 | Licensed under the MIT License. | Pass |

No README sentence exceeds 22 words and no banned marketing adjective appears.

## Demo and sandbox

The one-click path itself passes. **Try it with sample data** immediately opens
a realistic six-pair photosynthesis Match up game. The banner, Reset demo, and
Start for real remain visible. `/demo` and `/?demo=1` both enter demo mode. The
first game screen already shows terms and meanings, so it demonstrates the
product instead of leaving the visitor in an editor.

Reset restores the sample in the UI. Seeded real draft/title keys remain
unchanged through the flow. All observed network requests were same-origin.
After a first online visit and service-worker control, a network-intercepted
offline reload still showed the playable demo and banner. The discard defect
is the separate blocking failure in F-2-1.

## Claims

I cloned the repository locally into a new temporary directory at base
`fcc954caaa950cdf213fc97cf0d007e4e3563460`, ran `npm ci`, and ran every exact
`test` command from `.factory/claims.json` separately.

| Claim ID | Result | Evidence checked by its tagged command |
| --- | --- | --- |
| `sample-demo` | PASS | ready-to-play sample Match up |
| `six-games` | PASS | all six modes enabled from the sample |
| `free-to-use` | PASS | no price, payment frame, or paywall in sample flow |
| `no-account` | PASS | no account fields before play |
| `local-device` | PASS | seeded real keys unchanged; demo-prefixed keys; same-origin requests |
| `pair-limit` | PASS | 31st row rejected with 30 valid rows retained |
| `list-check` | PASS | invalid row announced while typing |
| `class-link` | PASS | sample data after `#` and fresh-context open |
| `lesson-file` | PASS | six sample rows restored in a fresh context |
| `fullscreen` | PASS | labelled control invokes the browser fullscreen API |
| `no-tracking` | PASS | sample flow uses only first-party runtime resources/storage |
| `offline-demo` | PASS | demo reloads offline after first visit |

Each command passed in desktop and mobile projects: 24/24 claim runs. The full
clean-clone `npm test` also passed with 10 Vitest tests, 47 Playwright tests,
and one intentional project skip. `npm run build` passed and produced `dist/`;
entry JavaScript is 35.29 kB raw and 11.70 kB gzip.

The passing list is not complete claim coverage. F-2-1 identifies the unlisted
and failing reset/discard claim. F-2-2 identifies the unlisted maximum-length
class-link claim. F-2-7 identifies the unlisted live artwork claim.

## Earlier-findings verification

Every earlier review finding was checked again against production and source.

| Earlier ID | Result now | Independent check |
| --- | --- | --- |
| F-01 | Fixed | mobile and desktop first screens name the job, teachers, and both first actions |
| F-02 | Fixed for the quoted old copy | old metaphors/jargon are gone and all current sentences are under 22 words; new residual flags are F-2-8 through F-2-16 |
| F-03 | **Regressed — BLOCKING** | Reset creates double-prefixed demo keys that Start for real leaves behind; see F-2-1 |
| F-04 | Fixed at register level | `claims.json` exists and all 12 commands pass; current uncovered claims are called out separately |
| F-04.01 | Fixed | `six-games` passes |
| F-04.02 | Fixed | separate six-games/free/no-account claims pass |
| F-04.03 | Fixed | landing uses the precise device-storage fact and `local-device` passes |
| F-04.04 | Fixed | `no-tracking` same-origin flow passes |
| F-04.05 | Fixed | `list-check` passes |
| F-04.06 | Fixed | `lesson-file` restores the sample exactly |
| F-04.07 | Fixed | `pair-limit` proves the 30-pair boundary |
| F-04.08 | Fixed | all six modes are enabled from one list |
| F-04.09 | Fixed | `class-link` proves hash-contained sample state and fresh-context play |
| F-04.10 | Fixed | free and no-account facts have separate passing checks |
| F-04.11 | Fixed | seeded real storage remains unchanged in demo |
| F-04.12 | Fixed | README uses the same six-game teacher wording |
| F-04.13 | Fixed | README pair range maps to `pair-limit` |
| F-04.14 | Fixed | README class-link statement maps to `class-link` for sample data |
| F-04.15 | **Half-fixed — BLOCKING** | maximum-length behavior has an untagged test but no registered claim; see F-2-2 |
| F-04.16 | Fixed | `fullscreen` passes |
| F-04.17 | Fixed | real draft storage is exercised by `local-device` |
| F-04.18 | Fixed | live and local demo both reload offline |
| F-04.19 | Fixed | no-account and no-tracking checks pass |
| F-04.20 | Fixed for real/demo separation | normal demo uses its own prefix; the Reset-created second prefix is F-03/F-2-1 |
| F-04.21 | Fixed | copied sample state remains after `#` and opens in a fresh context |
| F-05 | Fixed | unknown live route returns HTTP 404 with a designed page and home action |
| F-06 | Fixed | demo/game titles update; h1 receives focus; Back restores route, title, and h1 focus |
| F-07 | **Half-fixed — BLOCKING** | all checked routes except 404 have `og:url`; see F-2-3 |
| F-08 | Fixed for the cited legal shell | legal/404 routes have shared nav, footer links, attribution, and build id; game-header inconsistency is F-2-6 |

## Structure, links, identity, and accessibility

- Root, demo, Privacy, Terms, and 404 have route-specific titles, descriptions,
  canonicals, one h1, one main landmark, `lang=en`, favicons, and social images.
  The 404 Open Graph URL exception is F-2-3.
- Unknown routes return a designed HTTP 404. `/demo` and `/play/*` deep links
  reach the application shell. Game history and Back restore state and focus.
- Every discovered destination was crawled. Root, demo, Privacy, Terms, and
  Sociobot returned 200; the deliberate unknown route returned 404. No dead
  product link was found.
- `verify-url.sh` passed production with no console errors, one h1, one main,
  `lang=en`, complete image alt text, and no unnamed button.
- Axe found no violations on root, Privacy, Terms, or 404, and no serious or
  critical violations in any game. The repeated minor demo-banner violation is
  F-2-5.
- Contrast checks exposed no axe violation. Focus styles and reduced-motion
  rules exist. The mobile target-size failure is F-2-4.
- The warm paper, marker outlines, offset card shadows, geometric game shapes,
  and classroom-machine art are distinct. This is not a generic SaaS template.

## Missed leverage

No missed-leverage finding. The brief explicitly excludes AI-generated lesson
content, and a model would add cost and privacy friction to a deterministic
word-pair parser. Import/export already exists through lesson files, and class
links provide account-free sharing. Account-based sync would conflict with the
local-first, no-account scope.

## What would make this perfect

Nothing beyond closing every finding above is needed. A perfect next candidate
would leave no `demo:` key after every Reset/exit sequence, register every
displayed behavioral claim, complete 404 metadata, meet 44 px mobile targets,
produce zero axe violations, use the shared header on game routes, and contain
no flagged copy. Re-run this entire checklist from a fresh context and clone;
do not accept only the existing passing suites as proof.
