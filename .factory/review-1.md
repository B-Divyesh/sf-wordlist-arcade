# Adversarial first-read review 1

**Product:** Wordlist Arcade
**Reviewed:** 2026-08-28
**Verdict: FAIL**

Four blocking findings prevent acceptance: the cold mobile screen does not name
the intended user, the example is not a sandboxed demo, the claims register is
missing, and unknown routes silently render the landing page rather than a 404.

## Cold first screen

I opened `https://wordlist-arcade.sociobot.in` in fresh Chromium contexts at
390×844 and 1440×1000 without scrolling. Both loaded without console errors;
the mobile page had 0px horizontal overflow. On first read, this appears to turn
vocabulary pairs into games, and I would click “Make six games” or “Try an
example”. I could not identify who it is for.

The only first-viewport explanation was:

> “Paste vocabulary and meanings. Start a match, memory game, anagram, word
> reveal, quiz race, or word strike—in seconds, with no account and no creation
> limit.”

### F-01 — BLOCKING — first screen omits the intended user

- **Quote:** “Turn this week’s words into play.” / the quoted explanation
  above.
- **Why:** Neither names teachers, a class, ESL, or primary learners. The
  headline is a metaphor, not the job. “Make six games” does not describe its
  result, and “Try an example” does not say what sample result opens.
- **Fix:** Use headline **“Make six vocabulary games”** and support line
  **“For language and primary teachers who need a quick activity from this
  week’s words.”** Use **“Try it with sample data”** with **“Open a ready-to-
  play photosynthesis game”** beside it. Keep **“Paste your word pairs”** as
  the real first step. State “Free to use”, “No account”, and “Lists stay on
  this device” as separate facts.

## Copy audit

Counts treat contractions and hyphenated terms as one word. `*` means a
finding: a metaphor/contextless heading, jargon, an inconsistent term, a
marketing adjective, a claim requiring evidence, or a sentence over 22 words.
`†` means a button that is not a result-naming verb. This lists all visible
landing sentences and standalone copy; nested label text is listed once.

### Landing copy

| ID | Words | Copy |
| --- | ---: | --- |
| L01 | 4 | Skip to main content |
| L02 | 2 | Wordlist Arcade |
| L03 | 3 | Make a game |
| L04 | 3 | How it works |
| L05 | 2 | One list. |
| L06 | 4 | Six ways to play. |
| L07 | 6 | Turn this week’s words into play. * |
| L08 | 4 | Paste vocabulary and meanings. |
| L09 | 22 | Start a match, memory game, anagram, word reveal, quiz race, or word strike—in seconds, with no account and no creation limit. * |
| L10 | 3 | Make six games † |
| L11 | 3 | Try an example † |
| L12 | 3 | Private by default. * |
| L13 | 3 | Nothing is uploaded. |
| L14 | 3 | Build your arcade * |
| L15 | 2 | Paste once. |
| L16 | 3 | Pick a game. |
| L17 | 5 | Use one pair per line. |
| L18 | 6 | We’ll check it as you type. |
| L19 | 2 | List name |
| L20 | 6 | Shown to students in the game room. * |
| L21 | 3 | Words and meanings |
| L22 | 6 | Example: nocturnal — active during the night. |
| L23 | 2 | Load example † |
| L24 | 2 | Clear list |
| L25 | 3 | Copy class link |
| L26 | 3 | Share every list * |
| L27 | 19 | Copy the class link, or send a lesson file when an LMS or email tool has a link-length limit. * |
| L28 | 11 | Importing the file restores every pair without an account or server. |
| L29 | 2 | Download lesson |
| L30 | 2 | Share lesson |
| L31 | 2 | Import lesson |
| L32 | 4 | Up to 30 pairs. |
| L33 | 17 | Separate each word and meaning with an em dash, hyphen, colon, equals sign, vertical bar, or tab. * |
| L34 | 3 | Your game shelf * |
| L35 | 3 | Match up |
| L36 | 6 | Connect each word to its meaning. |
| L37 | 3 | Word strike |
| L38 | 7 | Hit the right word before moving on. |
| L39 | 3 | Anagram lab * |
| L40 | 6 | Unscramble the word from its clue. |
| L41 | 3 | Word reveal |
| L42 | 7 | Reveal letters without using six misses. |
| L43 | 2 | Memory grid |
| L44 | 6 | Find every hidden word-and-meaning pair. |
| L45 | 2 | Quiz race |
| L46 | 6 | Answer five quick multiple-choice clues. |
| L47 | 3 | No setup maze * |
| L48 | 7 | From notes to game in three moves. |
| L49 | 3 | Paste your pairs |
| L50 | 12 | Words, translations, definitions, facts—if they come in pairs, they can play. * |
| L51 | 3 | Choose a mode |
| L52 | 9 | All six games are ready from the same list. |
| L53 | 7 | Switch whenever your class needs a change. |
| L54 | 3 | Project or share |
| L55 | 9 | Go fullscreen together or copy the link for students. |
| L56 | 7 | The list travels safely inside the URL. * |
| L57 | 9 | Wordlist Arcade is free, account-free, and made for teachers. |
| L58 | 13 | Your list stays in this browser and inside links you choose to share. * |
| L59 | 9 | Hero artwork was generated with AI for this project. |
| L60 | 1 | Privacy |
| L61 | 1 | Terms |

### README copy

| ID | Words | Sentence or standalone copy |
| --- | ---: | --- |
| R01 | 25 | Wordlist Arcade turns one pasted vocabulary list into six playable classroom games: Match up, Word strike, Anagram lab, Word reveal, Memory grid, and Quiz race. * |
| R02 | 24 | It is built for language, ESL, and primary teachers who need a quick activity without creating an account or running into a creation limit. * |
| R03 | 3 | Live site: https://wordlist-arcade.sociobot.in |
| R04 | 10 | Accepts one word — definition or word — translation pair per line. |
| R05 | 10 | Generates six games immediately from the same 3–30 pairs. |
| R06 | 17 | Encodes the complete list in a compact, versioned URL-hash class link; no list is sent to a server. * |
| R07 | 20 | Long links remain copyable, and a lossless lesson-file download/import and Web Share option covers LMS or email URL-length limits. * |
| R08 | 9 | Supports a projector-friendly fullscreen mode and individual shared play. |
| R09 | 9 | Saves the current draft locally in the teacher’s browser. |
| R10 | 10 | Works as an installable, offline-capable PWA after the first visit. * |
| R11 | 14 | Includes responsive layouts, keyboard paths, reduced-motion behavior, and clear invalid-list/link and offline states. * |
| R12 | 14 | There are no accounts, ads, analytics, student records, paid features, or third-party runtime scripts. |
| R13 | 5 | Requires Node.js 20 or later. |
| R14 | 7 | Open the local URL printed by Vite. |
| R15 | 9 | The production build command required by the work order is: |
| R16 | 14 | The deployable static site is written to dist/, with dist/index.html at its root. |
| R17 | 10 | public/staticwebapp.config.json supplies Azure Static Web Apps routing and security headers. * |
| R18 | 14 | Run the suites independently with npm run test:unit or npm run test:e2e. |
| R19 | 39 | The browser tests cover parsing, URL-state recovery, a maximum-size low-compressibility 30-pair link and lesson-file round trip in fresh browser contexts, all six game routes, a complete match-up round, console errors, axe serious/critical findings, and a 390px overflow check. * |
| R20 | 6 | Drafts are stored only in localStorage. * |
| R21 | 24 | Shared list data appears after # in the URL, which browsers do not send in HTTP requests, though anyone who receives the URL can read it. * |
| R22 | 16 | A downloaded wordlist-arcade-lesson.json file contains the same complete list and is only sent where a teacher chooses to share it. * |
| R23 | 11 | Teachers should not put student names or confidential data in lists. |
| R24 | 8 | See /privacy/ and /terms/ for the complete plain-language notices. |
| R25 | 14 | The hero illustration was generated specifically for this product using the factory Azure image deployment. * |
| R26 | 13 | Its prompt, source, and provenance are in assets/src/ and .factory/design.md. * |
| R27 | 8 | src/main.ts — application UI, routing, and six game engines. |
| R28 | 7 | src/core.ts — parsing, URL compression, and game helpers. * |
| R29 | 5 | src/style.css — responsive product-specific visual system. * |
| R30 | 6 | src/sw-template.js — generated, versioned offline cache worker. * |
| R31 | 6 | .factory/design.md — visual thesis and asset provenance. * |
| R32 | 6 | .factory/handoff.md — verification results and operational notes. * |
| R33 | 6 | Licensed under the MIT License. |

### F-02 — Major — plain-language failures

- **Quote:** “Build your arcade”; “No setup maze”; “Share every list”; “Anagram
  lab”; “LMS”; “URL-hash”; “Web Share”; “PWA”; “low-compressibility”; “Azure
  Static Web Apps”.
- **Why:** Headings are metaphors or contextless fragments. README combines
  teacher-facing instructions with implementation jargon. R01, R02, R19, and
  R21 exceed 22 words. L09 is exactly 22 words but combines mode, speed,
  account, and limit claims.
- **Fix:** Use “Make vocabulary games”, “Paste word pairs”, “Share a game with
  your class”, and “How to make a game”. Rewrite L27 as “Copy a class link. If
  your LMS rejects a long link, download a lesson file.” Rewrite L33 as “Put
  one word and meaning on each line. Use a dash or colon between them.” Split
  R01 into “Paste a vocabulary list. Make six classroom games.” Split R02 into
  “For language, ESL, and primary teachers. Make a quick activity without an
  account.” Move deployment/compression jargon to contributor documentation.

## Demo and sandbox

### F-03 — BLOCKING — the example is neither isolated nor ready to play

- **Observed:** In a fresh 390px context, “Try an example” moved to `/#make`,
  filled six realistic biology pairs, and enabled cards. It left the visitor in
  the editor; it did not open a playable game.
- **Storage:** Immediately after the click, `localStorage` contained
  `wordlist-arcade-draft` and `wordlist-arcade-title`, not `demo:` keys. The
  sample writes into the real-draft namespace.
- **Direct entry:** `/demo` and `/?demo=1` both returned the ordinary landing
  screen with empty editor and landing title.
- **Missing:** No persistent “Demo — sample data, nothing is saved” banner,
  Reset demo, Start for real, or `.factory/demo.md` exists.
- **Why:** A one-click demo must immediately show a realistic game being used
  and must not read or write real storage. This flow changes real storage
  before the visitor chooses to start for real.
- **Fix:** Implement `/demo` (or `?demo=1`) with a preseeded sample game,
  `demo:` storage only, persistent banner, Reset demo, Start for real, discard
  on exit, and `.factory/demo.md`. Add tests that seed real data first, exercise
  the full demo, confirm real keys are unchanged, test Reset, and reload offline
  after first visit.

The example flow requested only same-origin HTML/JS/CSS/image resources; no
sample data appeared in a request. This is not a privacy claim test because it
does not use a demo route or assert the complete sandbox flow. Offline behavior
could not be verified through demo because no demo mode exists.

## Claims

### F-04 — BLOCKING — `.factory/claims.json` is absent

- **Evidence:** In a fresh clone at
  `23a4a13c895f4f1514e5da4d716fc25ca459e484`, `test -f
  .factory/claims.json` exited 1. There were no declared claim commands or
  `@claim:<id>` tests to run.
- **Why:** Privacy, storage, sharing, offline, account, quantity, and feature
  statements are visitor-relevant claims. A general suite is not a clean-demo
  claim assertion.
- **Fix:** Add the required manifest and one unique tagged clean-demo test per
  claim. The tests must assert observable behavior, including same-origin-only
  requests for privacy and `context.setOffline(true)` for offline behavior.

Each of these is an individual **unlisted claim finding** (F-04.01–F-04.21):

1. “One list. Six ways to play.”
2. “Start a match, memory game, anagram, word reveal, quiz race, or word strike—in seconds, with no account and no creation limit.”
3. “Private by default.”
4. “Nothing is uploaded.”
5. “We’ll check it as you type.”
6. “Importing the file restores every pair without an account or server.”
7. “Up to 30 pairs.”
8. “All six games are ready from the same list.”
9. “The list travels safely inside the URL.”
10. “Wordlist Arcade is free, account-free, and made for teachers.”
11. “Your list stays in this browser and inside links you choose to share.”
12. “Wordlist Arcade turns one pasted vocabulary list into six playable classroom games…”
13. “Generates six games immediately from the same 3–30 pairs.”
14. “Encodes the complete list in a compact, versioned URL-hash class link; no list is sent to a server.”
15. “Long links remain copyable, and a lossless lesson-file download/import and Web Share option covers LMS or email URL-length limits.”
16. “Supports a projector-friendly fullscreen mode and individual shared play.”
17. “Saves the current draft locally in the teacher’s browser.”
18. “Works as an installable, offline-capable PWA after the first visit.”
19. “There are no accounts, ads, analytics, student records, paid features, or third-party runtime scripts.”
20. “Drafts are stored only in localStorage.”
21. “Shared list data appears after # in the URL, which browsers do not send in HTTP requests…”

`npm test` and `npm run build` did pass in that clone. This is general quality
evidence only and cannot clear F-04 until the manifest exists and its declared
commands pass.

## Structure, metadata, and routes

### F-05 — BLOCKING — invalid URLs do not get a designed 404

- **Evidence:** `GET /not-a-real-route` returned HTTP 200 and the normal
  landing title/h1.
- **Why:** A visitor with a bad shared link has no indication that it is wrong.
- **Fix:** Add a styled “This page was not found” route with a home action and,
  where supported, a 404 response. Test a bad deep link.

### F-06 — Major — route changes do not update title or focus

- **Evidence:** Opening sample Match up changed the h1 but retained
  “Wordlist Arcade — six free vocabulary games from one list” and left
  `document.activeElement` as `BODY`. Browser Back to `/#make` also left focus
  on `BODY`. `/demo` retained the landing title, not “Demo — Wordlist Arcade”.
- **Why:** Screen-reader visitors are not told where navigation went.
- **Fix:** Use real demo/game routes where practical; set route-specific title,
  focus the new h1, announce in a polite live region, and test direct load and
  browser Back.

### F-07 — Major — required metadata is missing

- **Evidence:** Landing has `lang`, one h1, 59-character title, description,
  and SVG favicon. It has no canonical, Open Graph, Twitter card, or apple-touch
  icon. Privacy and Terms have titles but no description, canonical, or social
  metadata.
- **Why:** Shared links lack controlled previews/canonical discovery.
- **Fix:** Add per-route canonical URLs, descriptions, OG/Twitter tags and a
  self-hosted 1200×630 product image; add an 180px apple-touch icon and tests.

### F-08 — Minor — legal-page shell is inconsistent

- **Evidence:** Landing footer lacks “Built by Param Factory” and build id.
  Privacy/Terms have only a wordmark header and footer, without the landing nav
  or Privacy/Terms footer links.
- **Fix:** Reuse one compact header/footer with wordmark, Demo, Privacy, Terms,
  Param Factory attribution, and build/version.

## Checks that passed

- The site has a distinct classroom identity: warm paper palette, custom
  outlined word tiles, and original geometric-machine art. It does not look
  like a generic SaaS template.
- Landing has one h1, `lang="en"`, `<main>`, image alt text, skip link, and no
  console errors in both cold contexts.
- Landing, Privacy, Terms, favicon, robots, sitemap, `/demo`, and the bad URL
  returned 200. Privacy/Terms links and the external Sociobot link resolved.
  The 200 on `/demo` and unknown URL is a finding, not a pass.

## Verification record

1. Live fresh Chromium at 390×844 and 1440×1000, plus storage, network,
   metadata, focus, Back-navigation, and route checks.
2. Fresh remote clone at `23a4a13c895f4f1514e5da4d716fc25ca459e484`.
3. `npm ci`, `npm test` — **passed**: 10 Vitest tests and 18 Playwright tests.
4. `npm run build` — **passed**, produced `dist/`; Vite reported main JS
   10.85 kB gzip and CSS 3.95 kB gzip.

PASS requires all blocking fixes, a clean-clone pass of every declared claim
test through the isolated demo entry point, and no more than three minor
findings.
