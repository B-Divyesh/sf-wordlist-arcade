# Adversarial first-read review 7

**Product:** Wordlist Arcade  
**Reviewed:** 2026-08-29  
**Candidate:** `3d8ace4a39e77dd21806f1d19fe9f6640272efc0`  
**Live target:** <https://wordlist-arcade.sociobot.in>  
**Verdict:** **FAIL**

One minor finding remains. The application is clear, immediately playable,
sandboxed, and fully green in clean-clone and live checks. However, the
README's Privacy and Terms links resolve to GitHub's policies when the README
is read on GitHub. This review requires zero findings for PASS.

## Finding

### F-7-1 — Minor — README legal links lead to GitHub's policies

- **Exact quote/location:** `README.md:58-59`: “Read the [privacy
  notice](/privacy/) and [terms](/terms/).”
- **Observed:** From the repository README, `/privacy/` resolves to
  `https://github.com/privacy/`. `/terms/` resolves to GitHub's Terms of
  Service. Both return 200, but neither is Wordlist Arcade's notice.
- **Why:** A reader trying to verify this product's storage and use terms is
  silently sent to unrelated legal documents. Status-only crawling would miss
  this semantic destination error.
- **Concrete fix:** Use the product URLs:
  `Read the [privacy notice](https://wordlist-arcade.sociobot.in/privacy/) and
  [terms](https://wordlist-arcade.sociobot.in/terms/).`

## Cold first read

I opened production in separate fresh Chromium contexts at 390×844 and
1440×900. I recorded the first viewport before scrolling or interacting.

| Question | First-read answer | Exact supporting text |
| --- | --- | --- |
| What does this do? | It makes six vocabulary games. | “Make six vocabulary games” |
| For whom? | Language, ESL, and primary teachers who need a quick activity. | “For language, ESL, and primary teachers who need a quick activity from this week’s words.” |
| What should I click first? | Paste real pairs, or open the sample to try it. | “Paste your word pairs”; “Try it with sample data”; “Open a ready-to-play photosynthesis game.” |

All three answers and the facts “Free to use,” “No account,” and “Lists stay
on this device” were visible without scrolling at 390 px. Both cold loads
returned 200 and logged no console error. The first screen passes.

The mobile first screen uses the same classroom-paper palette, marker outlines,
offset shadows, and geometric machine art as desktop. It is visually distinct
from a generic centered-gradient or three-card SaaS template.

## Copy audit

Counts treat a URL, version, or hyphenated expression as one word. Punctuation
does not count. Headings, labels, actions, and meaningful alt text are included
because they must also make sense out of context. Repeated navigation labels
are listed once per role. Decorative card numbers are excluded.

No item exceeds 22 words. No banned marketing adjective, metaphor heading,
unexplained audience-facing jargon, or inconsistent product term was found.
Every button names an action or includes an adjacent result sentence. The only
flag is the README destination error in F-7-1.

### Landing page

| Location | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| Skip link | 4 | Skip to main content | Pass |
| Wordmark | 2 | Wordlist Arcade | Pass |
| Header link | 1 | Demo | Pass |
| Header link | 3 | Make a game | Pass |
| Header link | 1 | Privacy | Pass |
| Hero eyebrow | 4 | Vocabulary games for class | Pass |
| H1 | 4 | Make six vocabulary games | Pass; `six-games` |
| Hero sentence | 15 | For language, ESL, and primary teachers who need a quick activity from this week’s words. | Pass |
| Hero action | 4 | Paste your word pairs | Pass |
| Hero action | 5 | Try it with sample data | Pass; `sample-demo` |
| Action result | 5 | Open a ready-to-play photosynthesis game. | Pass; `sample-demo` |
| Hero fact | 3 | Free to use | Pass; `free-to-use` |
| Hero fact | 2 | No account | Pass; `no-account` |
| Hero fact | 5 | Lists stay on this device | Pass; `local-device` |
| Hero image alt | 13 | A handmade geometric machine turning blank word cards into six colorful game paths | Pass |
| Maker eyebrow | 3 | Make vocabulary games | Pass |
| Maker heading | 3 | Paste word pairs | Pass |
| Maker instruction | 8 | Put one word and meaning on each line. | Pass |
| Maker instruction | 7 | We check the list as you type. | Pass; `list-check` |
| Field label | 2 | List name | Pass |
| Default value | 2 | My vocabulary | Pass |
| Field help | 7 | Shown at the top of each game | Pass |
| Field label | 3 | Words and meanings | Pass |
| Field help | 6 | Example: nocturnal — active during the night | Pass |
| Action | 3 | Load sample list | Pass |
| Action | 2 | Clear list | Pass |
| Action | 3 | Copy class link | Pass; `class-link` |
| Empty state | 7 | Add 3 pairs to choose a game. | Pass |
| Sharing heading | 6 | Share a game with your class | Pass |
| Sharing sentence | 4 | Copy a class link. | Pass; `class-link` |
| Sharing sentence | 12 | If your learning platform rejects a long link, download a lesson file. | Pass; `lesson-file` |
| Action | 3 | Download lesson file | Pass; `lesson-file` |
| Action | 2 | Import lesson | Pass; `lesson-file` |
| File-input label | 6 | Choose a Wordlist Arcade lesson file | Pass |
| Limit sentence | 5 | Use 3 to 30 pairs. | Pass; `pair-limit` |
| Input instruction | 10 | Use a dash or colon between each word and meaning. | Pass |
| Shelf heading | 3 | Choose a game | Pass |
| Shelf count | 2 | 0 pairs | Pass |
| Game name | 2 | Match up | Pass |
| Game sentence | 6 | Connect each word to its meaning. | Pass; `match-up-play` |
| Game name | 2 | Word strike | Pass |
| Game sentence | 7 | Hit the right word before moving on. | Pass; `word-strike-play` |
| Game name | 1 | Anagram | Pass |
| Game sentence | 6 | Unscramble the word from its clue. | Pass; `anagram-play` |
| Game name | 2 | Word reveal | Pass |
| Game sentence | 6 | Reveal letters without using six misses. | Pass; `word-reveal-play` |
| Game name | 2 | Memory grid | Pass |
| Game sentence | 5 | Find every hidden word-and-meaning pair. | Pass; `memory-play` |
| Game name | 2 | Quiz race | Pass |
| Game sentence | 6 | Answer up to five multiple-choice clues. | Pass; `quiz-race-play` |
| How-to eyebrow | 5 | How to make a game | Pass |
| How-to heading | 6 | Make a game in three steps | Pass |
| Step heading | 3 | Paste word pairs | Pass |
| Step sentence | 5 | Add words, translations, or definitions. | Pass |
| Step heading | 3 | Choose a game | Pass |
| Step sentence | 8 | Pick any of six games from your list. | Pass; `six-games` |
| Step heading | 3 | Play or share | Pass |
| Step sentence | 7 | Play together or copy a class link. | Pass; `class-link` |
| Footer sentence | 6 | Wordlist Arcade makes classroom vocabulary games. | Pass |
| Footer attribution | 5 | Built by Param Factory · 20260828-polish6-r6 | Pass |
| Footer link | 1 | Terms | Pass |

The reachable demo and maximum-link states add the following copy:

| Location | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| Demo banner | 6 | Demo — sample data, nothing is saved. | Pass; `demo-discard` |
| Demo action | 2 | Reset demo | Pass; `demo-discard` |
| Demo action | 3 | Start for real | Pass; `demo-discard` |
| Game action | 3 | Choose a game | Pass |
| Game action | 2 | Copy link | Pass; `class-link` |
| Game action | 2 | Enter fullscreen | Pass; `fullscreen` |
| Game action state | 2 | Exit fullscreen | Pass; `fullscreen` |
| Long-link sentence | 7 | This complete class link is N characters. | Pass; `long-class-link` |
| Long-link sentence | 7 | Copy it where long links are accepted. | Pass; `long-class-link` |
| Long-link sentence | 6 | Some learning platforms reject long links. | Pass |
| Long-link sentence | 7 | If that happens, download the lesson file. | Pass; `lesson-file` |
| Long-link sentence | 5 | Importing it restores every pair. | Pass; `lesson-file` |
| Confirmation | 4 | Complete class link copied. | Pass; `long-class-link` |

### README

Shell commands are executable examples, not prose sentences, and are excluded.

| Location | Words | Exact copy | Result |
| --- | ---: | --- | --- |
| Title | 2 | Wordlist Arcade | Pass |
| Introduction | 4 | Paste a vocabulary list. | Pass |
| Introduction | 4 | Make six classroom games. | Pass; `six-games` |
| Audience | 6 | For language, ESL, and primary teachers. | Pass |
| Audience | 7 | Make a quick activity without an account. | Pass; `no-account` |
| Link label | 3 | Live site: URL | Pass |
| Heading | 4 | Make a vocabulary game | Pass |
| Step | 8 | Paste one word and meaning on each line. | Pass |
| Step | 13 | Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race. | Pass; `six-games` |
| Step | 7 | Play together or copy a class link. | Pass; `class-link` |
| Demo sentence | 5 | Use the sample at URL. | Pass |
| Demo sentence | 6 | It opens a ready-to-play photosynthesis game. | Pass; `sample-demo` |
| Demo sentence | 9 | The demo keeps sample data separate from your drafts. | Pass; `demo-discard` |
| Demo sentence | 4 | Reset restores the sample. | Pass; `demo-discard` |
| Demo sentence | 7 | Leaving the demo deletes the sample data. | Pass; `demo-discard` |
| Feature sentence | 7 | Wordlist Arcade accepts 3 to 30 pairs. | Pass; `pair-limit` |
| Feature sentence | 7 | It checks each row while you type. | Pass; `list-check` |
| Feature sentence | 10 | It can copy a class link that contains the list. | Pass; `class-link` |
| Feature sentence | 8 | The app works offline after the first visit. | Pass; `offline-demo` |
| Evidence sentence | 8 | These claims are declared and tested in `.factory/claims.json`. | Pass |
| Heading | 4 | Run Wordlist Arcade locally | Pass |
| Requirement | 6 | Use Node.js 20.19.x or Node.js 22.12+. | Pass; `node-compat` |
| Heading | 3 | Run the tests | Pass |
| Test instruction | 9 | Run every declared claim check from a clean clone. | Pass |
| Test instruction | 5 | Then run each printed command. | Pass |
| Test sentence | 14 | The browser tests build the static site and use the isolated `/?demo=1` entry point. | Pass |
| Build sentence | 12 | The deployable static site is in `dist/`, with `dist/index.html` at its root. | Pass |
| Deployment sentence | 8 | Azure Static Web Apps settings live in `public/staticwebapp.config.json`. | Pass; contributor context |
| Heading | 1 | Privacy | Pass |
| Privacy sentence | 6 | Real drafts use browser local storage. | Pass; `local-device` |
| Privacy sentence | 6 | Demo drafts use separate browser storage. | Pass; `demo-discard` |
| Privacy sentence | 7 | A class link contains the shared list. | Pass; `class-link` |
| Safety sentence | 11 | Do not put student names or confidential content in a list. | Pass |
| Link sentence | 6 | Read the privacy notice and terms. | **Flag F-7-1: links reach unrelated GitHub policies** |
| Documentation sentence | 8 | Asset sources and provenance are documented in `.factory/design.md`. | Pass |
| License sentence | 5 | Licensed under the MIT License. | Pass |

Terminology remains consistent: **word pair** is one input row, **list** is the
saved input, **demo** is the sandbox, **class link** is the playable URL,
**lesson file** is the download/import format, **game** is a play screen, and
**learning platform** is school software.

## Demo and sandbox

The one-click demo passes.

- The above-fold **Try it with sample data** link opens `/?demo=1` in one click.
- The first resulting screen is a populated Match up game with six realistic
  photosynthesis terms and meanings.
- The banner remains visible and says “Demo — sample data, nothing is saved.”
  **Reset demo** and **Start for real** are present.
- Reset restores the exact sample. Browser Back and Start for real remove every
  `demo:` key. A real draft remains byte-for-byte unchanged.
- Demo storage uses only `demo:wordlist-arcade-draft` and
  `demo:wordlist-arcade-title`; source inspection confirms `storageKey`,
  `clearDemo`, `leaveDemo`, route-exit, and `pagehide` handling.
- The live `no-tracking`, `no-cookies`, `lesson-file-local`,
  `fragment-not-sent`, `offline-demo`, and `demo-discard` runs confirm
  same-origin-only requests, no cookies, no list-bearing action request,
  offline saved drafts and game links, and sandbox cleanup.

## Claims

I made a new no-local clone at
`/tmp/wordlist-arcade-review7-clean.w8Vvdp`, installed its locked dependencies,
and ran every exact `test` command in `.factory/claims.json` independently.
Each browser command ran in desktop and 390 px mobile projects.

| Claim ID | Exact command result | Observable evidence |
| --- | --- | --- |
| `sample-demo` | PASS, 2/2 | Populated Match up demo |
| `six-games` | PASS, 2/2 | Every game opened and accepted an interaction with valid 60-character terms |
| `match-up-play` | PASS, 2/2 | A matching pair remained confirmed |
| `word-strike-play` | PASS, 2/2 | The correct displayed word was confirmed |
| `anagram-play` | PASS, 2/2 | A correct answer advanced the round |
| `word-reveal-play` | PASS, 2/2 | A correct letter appeared before six misses |
| `memory-play` | PASS, 2/2 | A found pair remained visible |
| `quiz-race-play` | PASS, 2/2 | Five-question maximum and correct-answer advance |
| `free-to-use` | PASS, 2/2 | No price, payment frame, or paywall before play |
| `no-account` | PASS, 2/2 | No account fields before play |
| `no-student-data-fields` | PASS, 2/2 | Maker and all games have no student/contact collection |
| `no-grading` | PASS, 2/2 | All games have no grade, roster, record, or decision output |
| `local-device` | PASS, 2/2 | App-created draft saved, restored, cleared, and survived isolated demo use |
| `pair-limit` | PASS, 2/2 | Thirty rows accepted and row 31 rejected with a precise message |
| `list-check` | PASS, 2/2 | Invalid input produced an announced line error |
| `class-link` | PASS, 2/2 | Copied hash link restored the sample in a fresh context |
| `fragment-not-sent` | PASS, 2/2 | Navigation omitted fragment and unique list text while restoring client-side |
| `long-class-link` | PASS, 2/2 | Low-compressibility 30-pair link copied and restored exactly |
| `lesson-file` | PASS, 2/2 | Download/import restored every sample row |
| `lesson-file-local` | PASS, 2/2 | Download/import made no list-bearing action request |
| `fullscreen` | PASS, 2/2 | Labelled control invoked the browser Fullscreen API |
| `no-tracking` | PASS, 2/2 | Complete sample flow requested only first-party resources |
| `no-cookies` | PASS, 2/2 | Cookie jar and `Set-Cookie` capture remained empty |
| `offline-demo` | PASS, 2/2 | Exact saved draft and copied game link remained playable offline |
| `demo-discard` | PASS, 2/2 | Reset, Back, and Start for real isolated and deleted demo keys |
| `node-compat` | PASS | Declared floors checked; Node 20.19 build completed |

Result: **26/26 exact commands passed**. The 25 browser claims produced
**50/50 project passes**. The full aggregate claim sweep also passed **50/50
against production**. Cross-checking the landing, README, Privacy, and Terms
copy found no unlisted observable product claim.

## Historical finding verification

I read all six earlier reviews, all six polish records, and the previous
handoff. “Fixed” below means the current production behavior and current code
or tagged test were both checked; it is not copied from a prior status label.

### Review 1

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-01 | Fixed | Both cold viewports name the job, teachers, and first actions above the fold. |
| F-02 | Fixed | Old metaphor/jargon copy is absent; current copy audit has no such flag. |
| F-03 | Fixed | Direct and one-click demo are playable, namespaced, resettable, and discarded on exit. |
| F-04 | Fixed | Registry exists; all 26 commands pass; public claim cross-check is complete. |
| F-04.01 | Fixed | `six-games` opens and uses every mode with parser-boundary terms. |
| F-04.02 | Fixed | Six-game, free-use, and no-account facts have separate tests. |
| F-04.03 | Fixed | Device-storage wording is precise and app-created storage is exercised. |
| F-04.04 | Fixed | Full demo request capture is first-party only. |
| F-04.05 | Fixed | Invalid rows are checked and announced while typing. |
| F-04.06 | Fixed | Lesson-file download/import restores exact rows. |
| F-04.07 | Fixed | The 3–30 boundary is exercised at 31 rows. |
| F-04.08 | Fixed | One accepted list produces six usable games. |
| F-04.09 | Fixed | Copied class links restore in a fresh context. |
| F-04.10 | Fixed | Free use and no account are independently exercised. |
| F-04.11 | Fixed | Demo use leaves a real draft byte-for-byte unchanged. |
| F-04.12 | Fixed | README and landing six-game wording maps to `six-games`. |
| F-04.13 | Fixed | README pair range maps to `pair-limit`. |
| F-04.14 | Fixed | README class-link wording maps to fresh-context restoration. |
| F-04.15 | Fixed | Maximum 30-pair link and lesson fallback round-trip exactly. |
| F-04.16 | Fixed | Fullscreen control calls the browser API. |
| F-04.17 | Fixed | A typed real draft is saved, reloaded, and cleared through the UI. |
| F-04.18 | Fixed | Saved drafts and opened game links reload offline after first visit. |
| F-04.19 | Fixed | Account, tracking, cookie, student-field, and grading claims are separately tested. |
| F-04.20 | Fixed | Reset and every tested exit remove demo keys without touching real keys. |
| F-04.21 | Fixed | A recorded navigation omits the URL fragment and list text. |
| F-05 | Fixed | Unknown production URL returns the designed recovery page with HTTP 404. |
| F-06 | Fixed | Route titles, announcements, h1 focus, Back, and deep links pass live. |
| F-07 | Fixed | Canonical, OG/Twitter, favicon, and Apple icon metadata is complete by route. |
| F-08 | Fixed | Root, games, legal pages, and 404 share header/footer content. |

### Review 2

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-2-1 / F-03 | Fixed | Reset creates no double prefix; all `demo:` keys are removed on exit. |
| F-2-2 / F-04.15 | Fixed | `long-class-link` is registered and restores all 30 rows. |
| F-2-3 / F-07 | Fixed | 404 canonical and `og:url` both use the product 404 URL. |
| F-2-4 | Fixed | Live 390 px target test passes every visible shell control. |
| F-2-5 | Fixed | Demo banner structure has zero Axe violations. |
| F-2-6 | Fixed | Game routes retain the shared site header and footer. |
| F-2-7 | Fixed | Untestable generated-art claim is absent from public copy. |
| F-2-8 | Fixed | “game room” is replaced by “top of each game.” |
| F-2-9 | Fixed | Separator help uses the plain “dash or colon.” |
| F-2-10 | Fixed | README demo behavior is split into short sentences. |
| F-2-11 | Fixed | README uses “class link,” not raw hash syntax. |
| F-2-12 | Fixed | README says “separate browser storage,” not namespace jargon. |
| F-2-13 | Fixed | README plainly says a class link contains the shared list. |
| F-2-14 | Fixed | Heading names “Make a vocabulary game.” |
| F-2-15 | Fixed | Heading names “Run Wordlist Arcade locally.” |
| F-2-16 | Fixed | Heading names “Run the tests.” |

### Review 3

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-3-1 / F-04.01 / F-04.08 | Fixed | Anagram and all modes accept and use valid 60-character terms. |
| F-3-2 / F-02 | Fixed | Reachable copy says “learning platform”; “LMS” is absent. |
| F-3-3 / F-08 / F-2-6 | Fixed | Header/footer text is identical across checked shells. |
| F-3-4 | Fixed | Each game behavior has one registered observable test. |
| F-3-5 | Fixed | Cookie jar and response headers are checked over a full flow. |
| F-3-6 | Fixed | Environment-dependent sharing is replaced by deterministic lesson files. |
| F-3-7 | Fixed | “unlock” is absent; empty state states the input needed. |
| F-3-8 | Fixed | Copy link and Enter fullscreen labels remain visible at 390 px. |

### Reviews 4–6

| Earlier ID | Current result | Current evidence |
| --- | --- | --- |
| F-4-1 / F-03 | Fixed | Browser Back deletes demo keys and preserves the real draft. |
| F-4-2 | Fixed | Waiting-service-worker regression and full clean-clone suite pass. |
| F-5-1 / F-04.17 | Fixed | `local-device` uses UI input, reload, UI clear, and isolation checks. |
| F-5-2 / F-04.21 | Fixed | `fragment-not-sent` records the actual fresh navigation request. |
| F-5-3 | Fixed | Lesson download/import request capture contains no list-bearing action request. |
| F-5-4 | Fixed | Student/contact-field claim traverses maker and every game. |
| F-5-5 | Fixed | No-grading claim checks output, storage, and requests in every game. |
| F-5-6 | Fixed | Exact Node floors are declared and Node 20.19 builds in the claim check. |
| F-5-7 | Fixed | Controls visibly say “Choose a game” and “Enter/Exit fullscreen.” |
| F-5-8 | Fixed | Legal-page links visibly identify Sociobot as an external site. |
| F-6-1 | Fixed | Offline claim now proves an exact real draft and copied game link without network requests. |

The six polish records' stated repairs were also compared with `src/main.ts`,
`src/style.css`, `tests/app.spec.ts`, static legal/404 pages, and production.
The previous handoff's zero-gap statement is accurate for product behavior;
F-7-1 is a newly identified README destination issue.

## Structure, accessibility, privacy, and quality gates

- Root, direct `/demo`, query demo, Privacy, Terms, every tested game, static
  404, and an unknown route have one h1, one main, `lang=en`, route-specific
  titles, descriptions, canonical/OG/Twitter metadata, SVG favicon, and Apple
  touch icon. Titles follow the route pattern and stay under 60 characters.
- The unknown URL returns HTTP 404 with the designed Wordlist Arcade recovery
  page. Direct demo and game links work. History navigation restores state,
  title, announcement, and h1 focus.
- The live site-link crawl returned 200 for every intended internal link and
  for the visibly labelled external Sociobot destination. F-7-1 concerns the
  repository README, not a deployed-site dead link.
- `robots.txt`, `sitemap.xml`, the web manifest, icons, and social image return
  successfully. The manifest uses `application/manifest+json`.
- Live response headers include CSP, frame denial, nosniff, no-referrer, and a
  restrictive permissions policy. Runtime requests in the claim flow are
  same-origin.
- `/opt/fleet/lib/verify-url.sh` passed root and demo with no console errors,
  one h1, a main landmark, `lang=en`, complete alt text, and labelled buttons.
- The live Axe/route/mobile sweep passed 22 applicable tests with two intended
  project-specific skips. At 320 CSS px, root, demo, Privacy, and Terms have no
  horizontal overflow. Reduced-motion rules remove movement and long
  transitions.
- Fresh-clone `npm test` passed 11 unit tests and 76 browser tests, with two
  intentional project-specific skips. `npm run build` produced `dist/`.
  Entry JavaScript is 35.37 kB raw / 11.75 kB gzip; CSS is 15.50 kB raw /
  4.27 kB gzip.

## Missed leverage

No product feature finding. The brief explicitly excludes AI-generated
content, so a model-assisted step would add cost and data handling without
serving the stated job. Lesson-file import/export and class-link sharing cover
the obvious portability need. Account sync would conflict with the
account-free, local-first scope.

## What would make this perfect

Replace the two root-relative README legal links with the full Wordlist Arcade
Privacy and Terms URLs, then verify those destinations from the rendered GitHub
README. No product-code, demo, claim, accessibility, routing, visual, AI,
import/export, or sync change is otherwise indicated. A new review can PASS
only after that final documentation finding is gone.
