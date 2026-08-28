# Adversarial first-read review 6

**Date:** 2026-08-28  
**Live target:** <https://wordlist-arcade.sociobot.in>  
**Verdict:** **FAIL**

There is one blocking verification gap. The live offline behaviour worked in a
manual warmed-demo check, but its declared claim promises more than its tagged
test proves. A PASS requires no untested claim.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×960 both loaded without console
errors. Before scrolling, the product is clear:

- **What it does:** it turns one vocabulary list into six classroom games.
- **Who it is for:** language, ESL, and primary teachers making an activity
  from this week's words.
- **What to click first:** either **Paste your word pairs** to make a real
  game, or **Try it with sample data** to open a ready-to-play photosynthesis
  game.

The exact above-fold text that establishes this is “Make six vocabulary games,”
“For language, ESL, and primary teachers who need a quick activity from this
week’s words,” and “Open a ready-to-play photosynthesis game.” The first-screen
requirement passes at both sizes.

The visual system is distinct rather than a generic SaaS template: the warm
paper ground, black outlined word tiles, offset shadows, grid, and original
word-machine illustration consistently express a classroom game-maker.

## Finding

### F-6-1 — BLOCKING — offline claim is broader than its tagged test

- **Exact claim/location:** `.factory/claims.json`, `offline-demo`: “Saved
  lists and opened game links still work offline”; live offline banner: “You’re
  offline. Saved lists and opened game links still work.” README: “The app
  works offline after the first visit.”
- **Test/location:** the registered command is `npm run test:claims -- --grep
  @claim:offline-demo`. Its only tagged test is
  `tests/app.spec.ts:723-731`, which opens `/?demo=1`, warms its service worker,
  turns the context offline, reloads the same demo URL, and asserts only the
  sample Match up heading and demo banner.
- **Why this fails review:** that proves the shipped demo reloads from cache. It
  does not prove a normally saved draft reloads offline, and it does not open a
  copied `/play/...#d=...` class link offline. Those are the two concrete
  outcomes visitors are told they can rely on. The claim therefore remains
  partially untested even though the current narrow test passes.
- **Concrete fix:** expand `@claim:offline-demo` (or split it into two
  registered claims) to create and save a normal three-pair draft, copy a class
  link, visit both routes while online so their shell is cached, set the fresh
  context offline, reload the maker and open the copied game link, then assert
  the exact draft rows and playable game heading. Intercept requests for the
  offline actions and assert no network request is attempted. Alternatively,
  narrow all three public sentences to “The sample demo works offline after the
  first visit.”

## Demo and sandbox check

The visible first-screen **Try it with sample data** link reaches `/?demo=1` in
one click. Its first rendered screen is a populated, playable Match up round
using six realistic photosynthesis pairs. The persistent banner reads “Demo —
sample data, nothing is saved.” and supplies **Reset demo** and **Start for
real**.

In a fresh 390px context I created a real three-pair draft, entered demo,
Reset demo, then selected Start for real. The real keys and values remained
unchanged; only `demo:wordlist-arcade-draft` and
`demo:wordlist-arcade-title` existed during demo; no `demo:` key remained on
exit. Recorded requests were same-origin only. After a first visit, the demo
also reloaded offline. This confirms the sandbox behaviour; F-6-1 is solely
the claim-test coverage mismatch described above.

## Copy audit

Word counts use whitespace-delimited visitor words; headings, labels, and
actions are included so their out-of-context wording and button verbs are
checked too. No landing or README unit exceeds 22 words. No banned marketing
word, unexplained jargon, inconsistent product term, contextless heading, or
non-result-naming button was found.

### Landing page and demo shell

| Copy | Words | Check |
| --- | ---: | --- |
| Wordlist Arcade | 2 | clear wordmark |
| Demo | 1 | clear navigation |
| Make a game | 3 | clear navigation |
| Privacy | 1 | clear navigation |
| Vocabulary games for class | 4 | clear eyebrow |
| Make six vocabulary games | 4 | clear job-first h1 |
| For language, ESL, and primary teachers who need a quick activity from this week’s words. | 15 | clear audience |
| Paste your word pairs | 4 | result-naming action |
| Try it with sample data | 5 | result-naming action |
| Open a ready-to-play photosynthesis game. | 5 | `sample-demo` |
| Free to use | 3 | `free-to-use` |
| No account | 2 | `no-account` |
| Lists stay on this device | 5 | `local-device` |
| Make vocabulary games | 3 | clear eyebrow |
| Paste word pairs | 3 | clear heading |
| Put one word and meaning on each line. | 8 | clear instruction |
| We check the list as you type. | 7 | `list-check` |
| List name | 2 | clear label |
| Shown at the top of each game | 7 | clear help |
| Words and meanings | 3 | clear label |
| Example: nocturnal — active during the night | 6 | concrete example |
| Load sample list | 3 | result-naming action |
| Clear list | 2 | result-naming action |
| Copy class link | 3 | `class-link` action |
| Add 3 pairs to choose a game. | 7 | clear empty state |
| Share a game with your class | 6 | clear heading |
| Copy a class link. | 4 | `class-link` |
| If your learning platform rejects a long link, download a lesson file. | 12 | `lesson-file` |
| Download lesson file | 3 | `lesson-file` action |
| Import lesson | 2 | result-naming action |
| Use 3 to 30 pairs. | 5 | `pair-limit` |
| Use a dash or colon between each word and meaning. | 10 | plain syntax help |
| Choose a game | 3 | clear heading |
| Match up | 2 | game name |
| Connect each word to its meaning. | 6 | `match-up-play` |
| Word strike | 2 | game name |
| Hit the right word before moving on. | 7 | `word-strike-play` |
| Anagram | 1 | game name |
| Unscramble the word from its clue. | 6 | `anagram-play` |
| Word reveal | 2 | game name |
| Reveal letters without using six misses. | 7 | `word-reveal-play` |
| Memory grid | 2 | game name |
| Find every hidden word-and-meaning pair. | 6 | `memory-play` |
| Quiz race | 2 | game name |
| Answer up to five multiple-choice clues. | 6 | `quiz-race-play` |
| How to make a game | 5 | clear eyebrow |
| Make a game in three steps | 6 | clear heading |
| Add words, translations, or definitions. | 5 | clear step |
| Pick any of six games from your list. | 8 | `six-games` |
| Play or share | 3 | clear step |
| Play together or copy a class link. | 7 | `class-link` |
| Wordlist Arcade makes classroom vocabulary games. | 6 | clear footer |
| Built by Param Factory | 4 | attribution |
| Demo — sample data, nothing is saved. | 6 | `demo-discard` |
| Reset demo | 2 | result-naming action |
| Start for real | 3 | clear exit action |
| Choose a game | 4 | result-naming action |
| Copy link | 2 | `class-link` action |
| Enter fullscreen | 2 | `fullscreen` action |
| Exit fullscreen | 2 | `fullscreen` action |
| This complete class link is N characters. | 7 | `long-class-link` |
| Copy it where long links are accepted. | 8 | `long-class-link` guidance |
| Some learning platforms reject long links. | 6 | clear limitation |
| If that happens, download the lesson file. | 7 | `lesson-file` fallback |
| Importing it restores every pair. | 5 | `lesson-file` |
| Complete class link copied. | 4 | clear confirmation |

### README

| Copy | Words | Check |
| --- | ---: | --- |
| Wordlist Arcade | 2 | clear title |
| Paste a vocabulary list. | 4 | clear job |
| Make six classroom games. | 4 | `six-games` |
| For language, ESL, and primary teachers. | 6 | clear audience |
| Make a quick activity without an account. | 7 | `no-account` |
| Live site: URL | 3 | clear link label |
| Make a vocabulary game | 5 | clear heading |
| Paste one word and meaning on each line. | 8 | clear step |
| Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race. | 13 | clear step |
| Play together or copy a class link. | 7 | `class-link` |
| Use the sample at URL. | 5 | clear demo link |
| It opens a ready-to-play photosynthesis game. | 6 | `sample-demo` |
| The demo keeps sample data separate from your drafts. | 9 | `demo-discard` |
| Reset restores the sample. | 4 | `demo-discard` |
| Leaving the demo deletes the sample data. | 7 | `demo-discard` |
| Wordlist Arcade accepts 3 to 30 pairs. | 7 | `pair-limit` |
| It checks each row while you type. | 7 | `list-check` |
| It can copy a class link that contains the list. | 10 | `class-link` |
| The app works offline after the first visit. | 8 | F-6-1 |
| These claims are declared and tested in `.factory/claims.json`. | 7 | accurate pointer |
| Run Wordlist Arcade locally | 4 | clear heading |
| Use Node.js 20.19.x or Node.js 22.12+. | 6 | `node-compat` |
| Run the tests | 3 | clear heading |
| Run every declared claim check from a clean clone. | 9 | clear instruction |
| Then run each printed command. | 5 | clear instruction |
| The browser tests build the static site and use the isolated `/?demo=1` entry point. | 13 | clear instruction |
| The deployable static site is in `dist/`, with `dist/index.html` at its root. | 12 | clear deployment note |
| Azure Static Web Apps settings live in `public/staticwebapp.config.json`. | 8 | clear deployment note |
| Privacy | 1 | clear heading |
| Real drafts use browser local storage. | 6 | `local-device` |
| Demo drafts use separate browser storage. | 6 | `demo-discard` |
| A class link contains the shared list. | 7 | `class-link` |
| Do not put student names or confidential content in a list. | 10 | clear precaution |
| Read the privacy notice and terms. | 6 | clear action |
| Asset sources and provenance are documented in `.factory/design.md`. | 8 | clear repository note |
| Licensed under the MIT License. | 5 | clear license note |

The public privacy/terms statements were also cross-checked against the claim
register. The observable product promises map to declared claims; the hosting
log disclosure and legal permissions are policy/contract language rather than
testable app-function promises. The one incomplete observable mapping is
F-6-1.

## Claim execution

I cloned `https://github.com/B-Divyesh/sf-wordlist-arcade.git` into
`/tmp/wordlist-arcade-review6-clean`, ran `npm ci`, and ran every exact command
declared in `.factory/claims.json`. All commands passed in both desktop and
390px Playwright projects where applicable:

`sample-demo`, `six-games`, `match-up-play`, `word-strike-play`,
`anagram-play`, `word-reveal-play`, `memory-play`, `quiz-race-play`,
`free-to-use`, `no-account`, `no-student-data-fields`, `no-grading`,
`local-device`, `pair-limit`, `list-check`, `class-link`,
`fragment-not-sent`, `long-class-link`, `lesson-file`, `lesson-file-local`,
`fullscreen`, `no-tracking`, `no-cookies`, `offline-demo`, `demo-discard`, and
`node-compat`.

This is not a passing claim audit because `offline-demo` has the coverage gap
recorded in F-6-1; command success alone does not make the full sentence
tested.

## Earlier findings recheck

Every earlier review and polish record was read. The following earlier findings
are confirmed fixed in live code and behaviour: cold clarity (F-01), plain
copy (F-02), first-click sandbox/exit cleanup (F-03, F-2-1, F-4-1), all six
games and their individual claim tests (F-04.01/F-04.08, F-3-1, F-3-4), list
parsing/storage/link/lesson boundaries (F-04.03–.07, .09, .13–.17, .20–.21,
F-2-2, F-3-6, F-5-1–3), privacy/account/cookie/child/grading coverage
(F-04.04, .10–.12, .18–.19, F-3-5, F-5-4–6), mobile controls and banner
semantics (F-2-4–5, F-3-8, F-5-7), terminology and README headings
(F-2-7–16, F-3-2, F-3-7), the designed 404 and metadata (F-05, F-07,
F-2-3), route titles/focus/history (F-06), shared shell (F-08, F-2-6,
F-3-3), and the service-worker regression suite (F-4-2).

The live recheck included the root, query demo, `/demo`, a real game route,
Privacy, Terms, and an unknown route. Root/demo/game navigation updated title,
description, canonical/OG URL, announcement, and h1 focus; browser Back
returned to the demo chooser. The unknown route returned HTTP 404 with the
designed recovery page. Robots, sitemap, manifest, SVG favicon, Apple touch
icon, and social image all returned 200. Crawled live links returned 200 (the
404 page's own fragment-only skip link intentionally remains on its 404
document). Header and footer wording is consistent across the checked shells.

## What would make this perfect

Add the missing offline saved-draft and shared-link assertions (or narrow the
offline copy), then re-run the exact claim command from a fresh clone. No other
product, AI, import/export, sync, visual-identity, copy, routing, or demo
change is indicated: the brief explicitly excludes AI and the product already
has the valuable local lesson-file import/export fallback.
