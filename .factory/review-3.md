# Adversarial first-read review 3

**Product:** Wordlist Arcade  
**Reviewed:** 2026-08-28  
**Base:** `09700294000c880ad43683d12984d6932657e66c`  
**Verdict: FAIL**

Three blocking findings remain. An accepted list can crash Anagram, the earlier
plain-language finding has regressed in a reachable long-list state, and the
site still does not use one consistent header/footer skeleton. Five additional
claim and copy findings also prevent PASS. All declared claim commands pass,
but the passing `six-games` check does not exercise the promised games and did
not detect the production crash.

## Findings

### F-3-1 / F-04.01 / F-04.08 — BLOCKING — an accepted list crashes Anagram

- **Exact live state:** enter three distinct 33-character terms, each with a
  meaning. The maker says **“3 pairs ready. Choose any game.”** and enables
  **Anagram**. Choosing it opens an empty game stage and raises
  `Cannot read properties of undefined (reading 'term')` on mobile and desktop.
- **Code evidence:** `src/core.ts:33` accepts terms through 60 characters.
  `src/main.ts:438` silently removes terms over 32 characters, then
  `src/main.ts:442-444` reads `queue[0].term` even when the queue is empty.
- **Claim evidence:** `@claim:six-games` in `tests/app.spec.ts:255` only checks
  whether six buttons are enabled. It does not open or use any game. The
  registered core claim therefore has a passing test that checks the control,
  not the promised result.
- **Why this blocks:** the UI explicitly accepts the list and promises all six
  games. A teacher can reach a blank, broken game with valid input. Earlier
  findings F-04.01 and F-04.08 were marked fixed, so the history rule makes
  this half-fix blocking again.
- **Concrete fix:** make Anagram support every accepted term, or reject terms
  above its real limit before enabling games with a precise error. Expand the
  single `@claim:six-games` test to open and perform a meaningful interaction
  in all six modes, including 3-pair and maximum-length accepted input, while
  asserting no page or console errors.

### F-3-2 / F-02 — BLOCKING — “LMS” jargon remains in reachable landing copy

- **Exact live quote:** after a low-compressibility 30-pair list, the maker
  says: **“If an LMS or email tool rejects it, download or share the lesson
  file instead; importing it restores every pair.”** The copy confirmation can
  also say **“If an LMS rejects it, send the lesson file instead.”**
- **Code location:** `src/main.ts:219` and `src/main.ts:242`.
- **Why this blocks:** F-02 explicitly identified “LMS” as jargon and required
  “learning platform.” The ordinary sharing paragraph was fixed, but the
  boundary state and toast retain the same term. Under the required cumulative
  history check, the earlier finding is only half-fixed.
- **Concrete rewrite:** “Some learning platforms reject long links. If that
  happens, download or share the lesson file; importing it restores every
  pair.” Use “learning platform” in the confirmation too.

### F-3-3 / F-08 / F-2-6 — BLOCKING — route shells still have different navigation

- **Exact live locations:** root header: **Wordlist Arcade / Demo / Make a game
  / Privacy**; demo/game header: **Wordlist Arcade / Privacy**; Privacy, Terms,
  and 404 headers: **Wordlist Arcade / Demo / Privacy / Terms**.
- **Footer difference:** the app says **“Wordlist Arcade makes classroom
  vocabulary games.”** Legal and 404 pages omit that required product
  one-liner. Static pages also use a text diamond while the app uses the arcade
  mark.
- **Code evidence:** the app header/footer are generated at
  `src/main.ts:81-94`; the game header is separate at `src/main.ts:323-329`;
  `privacy/index.html`, `terms/index.html`, and `public/404.html` each contain a
  third hand-written shell.
- **Why this blocks:** the site-structure contract requires one consistent
  header and footer on every route. Earlier F-08 and F-2-6 were marked fixed,
  but only selected links were added; the route shells are still not the same.
- **Concrete fix:** render one shared wordmark, navigation set, and product
  one-line footer on root, games, Demo, Privacy, Terms, and 404. Keep game
  controls in a second, clearly labelled game toolbar.

### F-3-4 — Major — game behavior claims are not registered or tested

- **Exact landing quotes:** “Connect each word to its meaning”; “Hit the right
  word before moving on”; “Unscramble the word from its clue”; “Reveal letters
  without using six misses”; “Find every hidden word-and-meaning pair”; and
  “Answer five quick multiple-choice clues.”
- **Why:** these are observable promises, including numeric behavior. The only
  related entry is `six-games`, whose claim is merely “Make six vocabulary
  games” and whose tagged test checks enabled buttons. The last quote is also
  false for an accepted 3- or 4-pair list: `src/main.ts:542` creates only
  `min(5, pair count)` questions.
- **Concrete fix:** register and uniquely test each retained game-behavior
  claim through the demo. Change the Quiz race copy to “Answer up to five
  multiple-choice clues,” or always produce five questions and test that
  number at both list boundaries.

### F-3-5 — Major — the privacy page’s cookie claim is unlisted

- **Exact live quote:** **“No account, cookies, advertising trackers,
  analytics scripts, or third-party runtime services are used.”**
- **Why:** `no-tracking` does not mention cookies, and its test does not inspect
  browser cookies or `Set-Cookie` response headers. A manual live pass found
  neither, but an unregistered claim
  is still untested by the claims contract.
- **Concrete fix:** add a `no-cookies` entry and a tagged full-flow test that
  asserts an empty cookie jar and no `Set-Cookie` header, or remove “cookies”
  from the sentence.

### F-3-6 — Major — “Share lesson” is an unlisted, environment-dependent result

- **Exact location:** landing maker button **“Share lesson.”**
- **Code evidence:** `src/main.ts:267-275` uses Web Share when available but
  silently downloads the file when it is not. `lesson-file` promises and tests
  download/import only; no claim or tagged test exercises sharing.
- **Why:** on a desktop without file sharing, a visitor chooses Share and gets
  a download. The button names a result the register does not prove.
- **Concrete fix:** feature-detect before rendering: show **“Share lesson
  file”** only when file sharing is available and otherwise show one
  **“Download lesson file”** action. If sharing remains a claim, register it and
  test the exact file passed to a mocked `navigator.share`.

### F-3-7 — Minor — the empty state uses a banned marketing verb

- **Exact live quote:** **“Add 3 more pairs to unlock the games.”**
- **Why:** “unlock” is banned by the plain-words rubric and suggests an
  artificial gate rather than the input requirement.
- **Concrete rewrite:** **“Add 3 pairs to choose a game.”** Use the same form
  for the one- and two-pair states.

### F-3-8 — Minor — mobile hides the result names of game controls

- **Exact location:** on the 390 px demo game screen, the **Share** and
  **Fullscreen** text is hidden; only two icons remain. On desktop, “Share”
  actually copies a game link.
- **Why:** accessible names exist, but a sighted first-time phone visitor does
  not get the plain result-naming labels required for buttons.
- **Concrete fix:** keep compact visible labels **“Copy link”** and
  **“Fullscreen”** at 390 px, or expose the labels in an overflow menu with a
  visible name.

## Cold first screen

I opened production in new Chromium contexts at 390×844 and 1440×1000 without
scrolling. Both returned 200, had no console errors, and had no horizontal
overflow.

- **What it does:** makes six vocabulary games from word pairs.
- **For whom:** language, ESL, and primary teachers making a quick activity
  from the current week’s words.
- **What to click first:** **Paste your word pairs** for real work, or **Try it
  with sample data** to evaluate it first.

The exact supporting copy is “Make six vocabulary games,” “For language, ESL,
and primary teachers who need a quick activity from this week’s words,” and the
two actions above. “Open a ready-to-play photosynthesis game” and all three
plain facts also fit in the first mobile viewport. The cold first screen passes.

## Copy audit

Counts treat a URL or hyphenated expression as one word. Controls, headings,
labels, alt text, and standalone navigation are included because they are part
of the product’s words. No item exceeds 22 words. `FLAG` identifies a finding.

### Landing page

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L01 | 4 | Skip to main content | Pass |
| L02 | 2 | Wordlist Arcade | Pass |
| L03 | 1 | Demo | Pass |
| L04 | 3 | Make a game | Pass |
| L05 | 1 | Privacy | Pass |
| L06 | 4 | Vocabulary games for class | Pass |
| L07 | 4 | Make six vocabulary games | Claim; coverage fails in F-3-1 |
| L08 | 15 | For language, ESL, and primary teachers who need a quick activity from this week’s words. | Pass |
| L09 | 4 | Paste your word pairs | Pass |
| L10 | 5 | Try it with sample data | Pass |
| L11 | 5 | Open a ready-to-play photosynthesis game. | `sample-demo` |
| L12 | 3 | Free to use | `free-to-use` |
| L13 | 2 | No account | `no-account` |
| L14 | 5 | Lists stay on this device | `local-device` |
| L14a | 2 | 6 games | Decorative badge; `six-games` |
| L15 | 13 | A handmade geometric machine turning blank word cards into six colorful game paths | Alt text; pass |
| L16 | 3 | Make vocabulary games | Pass |
| L17 | 3 | Paste word pairs | Pass |
| L18 | 8 | Put one word and meaning on each line. | Pass |
| L19 | 7 | We check the list as you type. | `list-check` |
| L20 | 2 | List name | Pass |
| L20a | 2 | My vocabulary | Default field value; pass |
| L21 | 7 | Shown at the top of each game | Pass |
| L22 | 3 | Words and meanings | Pass |
| L23 | 6 | Example: nocturnal — active during the night | Pass |
| L24 | 3 | Load sample list | Pass |
| L25 | 2 | Clear list | Pass |
| L26 | 3 | Copy class link | `class-link` |
| L27 | 8 | Add 3 more pairs to unlock the games. | **FLAG F-3-7** |
| L28 | 6 | Share a game with your class | Pass |
| L29 | 4 | Copy a class link. | `class-link` |
| L30 | 12 | If your learning platform rejects a long link, download a lesson file. | `lesson-file` |
| L31 | 2 | Download lesson | `lesson-file` |
| L32 | 2 | Share lesson | **FLAG F-3-6** |
| L33 | 2 | Import lesson | `lesson-file` |
| L34 | 5 | Use 3 to 30 pairs. | `pair-limit` |
| L35 | 10 | Use a dash or colon between each word and meaning. | Pass |
| L36 | 3 | Choose a game | Pass |
| L37 | 2 | 0 pairs | Pass |
| L38 | 2 | Match up | `six-games` label |
| L39 | 6 | Connect each word to its meaning. | **FLAG F-3-4** |
| L40 | 2 | Word strike | `six-games` label |
| L41 | 7 | Hit the right word before moving on. | **FLAG F-3-4** |
| L42 | 1 | Anagram | `six-games` label |
| L43 | 6 | Unscramble the word from its clue. | **FLAG F-3-1, F-3-4** |
| L44 | 2 | Word reveal | `six-games` label |
| L45 | 7 | Reveal letters without using six misses. | **FLAG F-3-4** |
| L46 | 2 | Memory grid | `six-games` label |
| L47 | 6 | Find every hidden word-and-meaning pair. | **FLAG F-3-4** |
| L48 | 2 | Quiz race | `six-games` label |
| L49 | 6 | Answer five quick multiple-choice clues. | **FLAG F-3-4** |
| L50 | 5 | How to make a game | Pass |
| L51 | 6 | Make a game in three steps | Pass |
| L52 | 3 | Paste word pairs | Pass |
| L53 | 5 | Add words, translations, or definitions. | Pass |
| L54 | 3 | Choose a game | Pass |
| L55 | 8 | Pick any of six games from your list. | Claim; coverage fails in F-3-1 |
| L56 | 3 | Play or share | Pass |
| L57 | 7 | Play together or copy a class link. | `class-link` |
| L58 | 6 | Wordlist Arcade makes classroom vocabulary games. | Pass |
| L59 | 4 | Built by Param Factory | Pass |
| L60 | 1 | Terms | Pass |

The reachable maximum-list state adds:

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| L61 | 7 | This complete class link is 9,993 characters. | `long-class-link` |
| L62 | 13 | You can still copy it for browsers and tools that support long links. | `long-class-link`; “tools” is vague |
| L63 | 20 | If an LMS or email tool rejects it, download or share the lesson file instead; importing it restores every pair. | **FLAG F-3-2** |
| L64 | 4 | Complete class link copied. | `long-class-link` |
| L65 | 10 | If an LMS rejects it, send the lesson file instead. | **FLAG F-3-2** |

### README

| ID | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| R01 | 2 | Wordlist Arcade | Pass |
| R02 | 4 | Paste a vocabulary list. | Pass |
| R03 | 4 | Make six classroom games. | Claim; coverage fails in F-3-1 |
| R04 | 6 | For language, ESL, and primary teachers. | Pass |
| R05 | 7 | Make a quick activity without an account. | `no-account` |
| R06 | 3 | Live site: https://wordlist-arcade.sociobot.in | Pass |
| R07 | 4 | Make a vocabulary game | Pass |
| R08 | 8 | Paste one word and meaning on each line. | Pass |
| R09 | 13 | Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race. | Claim; coverage fails in F-3-1 |
| R10 | 7 | Play together or copy a class link. | `class-link` |
| R11 | 5 | Use the sample at https://wordlist-arcade.sociobot.in/?demo=1. | Pass |
| R12 | 6 | It opens a ready-to-play photosynthesis game. | `sample-demo` |
| R13 | 9 | The demo keeps sample data separate from your drafts. | `demo-discard` |
| R14 | 4 | Reset restores the sample. | `demo-discard` |
| R15 | 7 | Start for real deletes the sample data. | `demo-discard` |
| R16 | 7 | Wordlist Arcade accepts 3 to 30 pairs. | `pair-limit` |
| R17 | 7 | It checks each row while you type. | `list-check` |
| R18 | 10 | It can copy a class link that contains the list. | `class-link` |
| R19 | 8 | The app works offline after the first visit. | `offline-demo` |
| R20 | 8 | These claims are declared and tested in `.factory/claims.json`. | **Not fully true; F-3-1 and F-3-4 to F-3-6** |
| R21 | 4 | Run Wordlist Arcade locally | Pass |
| R22 | 5 | Requires Node.js 20 or later. | Contributor instruction |
| R23 | 3 | Run the tests | Pass |
| R24 | 9 | Run every declared claim check from a clean clone. | Contributor instruction |
| R25 | 5 | Then run each printed command. | Contributor instruction |
| R26 | 14 | The browser tests build the static site and use the isolated `/?demo=1` entry point. | Contributor instruction |
| R27 | 12 | The deployable static site is in `dist/`, with `dist/index.html` at its root. | Contributor instruction |
| R28 | 8 | Azure Static Web Apps settings live in `public/staticwebapp.config.json`. | Contributor instruction |
| R29 | 1 | Privacy | Pass |
| R30 | 6 | Real drafts use browser local storage. | `local-device` |
| R31 | 6 | Demo drafts use separate browser storage. | `demo-discard` |
| R32 | 7 | A class link contains the shared list. | `class-link` |
| R33 | 11 | Do not put student names or confidential content in a list. | Pass |
| R34 | 6 | Read the privacy notice and terms. | Pass |
| R35 | 8 | Asset sources and provenance are documented in `.factory/design.md`. | Repository pointer |
| R36 | 5 | Licensed under the MIT License. | Pass |

Terminology is otherwise consistent: **word pair**, **list**, **demo**, **class
link**, **lesson file**, and **game** each name one concept.

## Demo and sandbox

The required one-click path passes. **Try it with sample data** immediately
opens a populated Photosynthesis practice Match up game. At 390 px, the first
demo viewport already shows the banner, game title, progress, score, prompt,
and realistic word buttons. `/demo` and `/?demo=1` both enter it.

The live Reset → edit → play → Games → Start for real sequence restores the
sample, preserves seeded real keys exactly, and leaves no `demo:` key. Network
capture during the complete flow contains only the product origin. After the
first visit and service-worker control, `context.setOffline(true)` reloads the
playable demo. No cookie or `Set-Cookie` was observed in the manual live flow;
F-3-5 concerns missing registered coverage, not observed contrary behavior.

The demo’s functional sample passes, but it cannot compensate for the valid
real-list Anagram failure in F-3-1.

## Claims

I cloned base `0970029` with `git clone --no-local` into a new temporary
directory, ran `npm ci`, and then ran every exact command in
`.factory/claims.json` independently.

| Claim | Clean-clone command result | What the tagged test observed |
| --- | --- | --- |
| `sample-demo` | PASS, desktop + mobile | populated Match up screen |
| `six-games` | PASS, desktop + mobile | only six enabled buttons; inadequate per F-3-1 |
| `free-to-use` | PASS, desktop + mobile | no paywall/price/frame in demo |
| `no-account` | PASS, desktop + mobile | no account fields before play |
| `local-device` | PASS, desktop + mobile | real keys unchanged, demo prefix, same-origin requests |
| `pair-limit` | PASS, desktop + mobile | row 31 rejected and 30 retained |
| `list-check` | PASS, desktop + mobile | invalid row announced |
| `class-link` | PASS, desktop + mobile | hash-contained sample opens in fresh context |
| `long-class-link` | PASS, desktop + mobile | exact 30-row low-compressibility list round-trips |
| `lesson-file` | PASS, desktop + mobile | downloaded sample imports exactly |
| `fullscreen` | PASS, desktop + mobile | labelled control invokes fullscreen API |
| `no-tracking` | PASS, desktop + mobile | demo requests and runtime resources stay first-party |
| `offline-demo` | PASS, desktop + mobile | demo reloads after network is disabled |
| `demo-discard` | PASS, desktop + mobile | Reset/exit clears demo keys and preserves real keys |

Result: **14/14 commands and 28/28 project runs passed.** No declared command
failed. F-3-1 is a test-validity and real-product failure; F-3-4 to F-3-6 are
unlisted-claim findings.

## Earlier-finding verification

Every finding in both earlier reviews and both polish records was checked
against current production and current source rather than accepted from its
status label.

| Earlier ID | Current result | Independent evidence |
| --- | --- | --- |
| F-01 | Fixed | Both cold viewports name job, teachers, and first actions. |
| F-02 | **Half-fixed; BLOCKING** | Static copy is simpler, but reachable long-link copy still says “LMS”; F-3-2. |
| F-03 | Fixed | Live full Reset/play/Back/exit flow leaves no demo key and preserves real keys. |
| F-04 | Register exists, but incomplete | All commands pass; substantive and unlisted gaps are F-3-1 and F-3-4 to F-3-6. |
| F-04.01 | **Half-fixed; BLOCKING** | Six buttons enable, but valid input crashes Anagram; F-3-1. |
| F-04.02 | Fixed | Separate six-game/free/no-account facts exist; free and account checks pass. |
| F-04.03 | Fixed | Precise device-storage wording and isolation check pass. |
| F-04.04 | Fixed | Complete demo request capture is same-origin. |
| F-04.05 | Fixed | Invalid typed row is announced by the tagged test. |
| F-04.06 | Fixed | Download/import restores exact sample pairs. |
| F-04.07 | Fixed | Tagged test confirms the 30-row boundary. |
| F-04.08 | **Half-fixed; BLOCKING** | Same-list buttons enable, but the accepted list does not always yield six usable games; F-3-1. |
| F-04.09 | Fixed | Copied class link opens in a fresh context. |
| F-04.10 | Fixed | Free and no-account claims have passing checks. |
| F-04.11 | Fixed | Seeded real storage remains byte-for-byte unchanged in demo. |
| F-04.12 | Half-fixed through F-3-1 | README still makes the six-game claim that the current edge case breaks. |
| F-04.13 | Fixed | README range maps to the boundary test. |
| F-04.14 | Fixed | README class-link sentence maps to fresh-context restoration. |
| F-04.15 | Fixed | Registered maximum-link test restores exact title and 30 rows. |
| F-04.16 | Fixed | Tagged test directly invokes the fullscreen API. |
| F-04.17 | Fixed | Real draft keys are exercised by isolation tests. |
| F-04.18 | Fixed | Live and clean-clone demo reload offline. |
| F-04.19 | Fixed for listed text | No-account/no-tracking checks pass; the new cookie gap is F-3-5. |
| F-04.20 | Fixed | Reset and exit leave no `demo:` keys. |
| F-04.21 | Fixed | Shared state remains after `#` and opens in a fresh context. |
| F-05 | Fixed | Unknown production route returns designed HTTP 404 with home action. |
| F-06 | Fixed | Game/demo titles, canonical URLs, Back behavior, announcements, and h1 focus pass. |
| F-07 | Fixed | Root, demo, legal, game, and 404 metadata are complete; 404 has `og:url`. |
| F-08 | **Half-fixed; BLOCKING** | All pages have a shell, but headers/footer contents differ; F-3-3. |
| F-2-1 / F-03 | Fixed | The former double-prefix Reset path is clean live and in source. |
| F-2-2 / F-04.15 | Fixed | `long-class-link` is registered and exact. |
| F-2-3 / F-07 | Fixed | Live 404 canonical and `og:url` both use `/404`. |
| F-2-4 | Fixed | 390 px root, demo, legal, and 404 controls meet 44 px test. |
| F-2-5 | Fixed | Demo `aside` no longer has `role=status`; full demo Axe scan is clean. |
| F-2-6 | **Half-fixed; BLOCKING** | Game has wordmark and Privacy, but not the same site navigation; F-3-3. |
| F-2-7 | Fixed | Artwork claim was removed from landing and README. |
| F-2-8 | Fixed | “game room” is now “top of each game.” |
| F-2-9 | Fixed | Ordinary separator help now says “dash or colon.” |
| F-2-10 | Fixed | README demo behavior is three short sentences. |
| F-2-11 | Fixed | README no longer explains links with raw hash jargon. |
| F-2-12 | Fixed | README says “separate browser storage.” |
| F-2-13 | Fixed | Privacy summary says the class link contains the list. |
| F-2-14 | Fixed | Heading is “Make a vocabulary game.” |
| F-2-15 | Fixed | Heading is “Run Wordlist Arcade locally.” |
| F-2-16 | Fixed | Heading is “Run the tests.” |
| verification-1 high | Fixed | Axe checks cover all six populated game screens at both viewports. |
| verification-1 medium, long URL | Fixed | Maximum link and lesson-file round trips pass. |
| verification-1 medium, PWA/security | Fixed | Icons, update path, CSP, headers, manifest MIME, and cache rules pass. |
| verification-1 low | Fixed | Fullscreen API has a direct test. |
| verification-2 high | Fixed | Exact maximum list round-trip passes. |
| verification-2 low | Fixed | Live manifest returns the configured MIME type. |
| verification-3 | No recorded defect | Its covered regression behaviors still pass. |

## Structure, links, accessibility, and identity

- Title pattern, one h1, descriptions, canonicals, Open Graph/Twitter fields,
  SVG favicon, Apple touch icon, `lang`, and one main landmark pass on root,
  demo, Privacy, Terms, game, and 404 routes.
- `/not-a-real-route` returns HTTP 404 and the designed product-style page.
  `/demo` and `/play/*` deep links work. Game Back restores the maker and h1
  focus. The app announces route changes.
- The crawl found no dead ordinary link. Root, Demo, Privacy, Terms, assets,
  and Sociobot returned 200. The intentional unknown route returned 404.
- Live Axe integration found zero violations on the demo shell and all six demo
  games, and no serious/critical issue on the remaining checked routes. Touch
  target and 390 px overflow checks pass. F-3-8 is a visible-label issue, not a
  missing accessible name.
- The warm paper, marker outlines, offset shadows, geometric game surfaces,
  and classroom-machine art are distinct. This is not a generic SaaS template.
- The navigation/footer inconsistency is isolated as blocking F-3-3.

## Missed leverage

No additional AI feature is justified. The brief explicitly excludes
AI-generated content, and deterministic word-pair parsing avoids cost and
privacy friction. Lesson-file import/export and class-link sharing already
cover the obvious portability needs. Account-based sync would conflict with
the account-free, local-first scope.

## Verification record

- Fresh live Chromium at 390×844 and 1440×1000 for cold first screen, demo,
  long-word Anagram failure, storage, network, cookies, metadata, focus, Back,
  and link crawl.
- Fresh local clone: 14/14 exact claim commands passed; 28/28 desktop/mobile
  claim runs.
- Fresh local clone `npm test`: 10/10 Vitest and 52 Playwright passes, with two
  intentional project-selection skips.
- Fresh local clone `npm run build`: passed and produced `dist/`. Main JS is
  35.75 kB raw / 11.74 kB gzip; CSS is 15.77 kB raw / 4.29 kB gzip.
- Selected live claim, route, touch-target, and Axe suite: 42 passed and two
  intentional project-selection skips.

## What would make this perfect

Support every accepted list in every promised game; make the six-game claim
test exercise outcomes rather than enabled controls; register every retained
game, cookie, and sharing claim; remove “LMS” and “unlock”; keep result labels
visible on mobile; and render one genuinely shared header/footer on every
route. Then rerun this entire review from fresh browser contexts and a fresh
clone. PASS requires zero remaining findings.
