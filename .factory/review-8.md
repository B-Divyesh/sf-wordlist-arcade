# Adversarial first-read review 8

**Verdict: PASS.** No blocking, major, minor, or informational finding
remains. Review run on 2026-08-29 against the deployed site and clean clone
`b5b21bfdd2422a182df9858243e8f8079176da4c`.

## Cold first read

Fresh 390px and desktop contexts opened `/` with no stored state. Before
scrolling, the answer was unambiguous:

| Check | Result |
| --- | --- |
| What it does | “Make six vocabulary games” from pasted word pairs. |
| Who it is for | “Language, ESL, and primary teachers” who need a quick activity. |
| First click | “Try it with sample data” opens “a ready-to-play photosynthesis game”; “Paste your word pairs” starts real use. |

The job, audience, action, and three concrete facts are visible in the first
390px screen. The visual treatment is product-specific: warm paper, outlined
classroom cards, geometric word-machine art, and non-generic game tiles; it is
not a stock SaaS hero. Both cold loads returned 200 with no console errors.

## Copy audit

All landing and README sentences/labels were counted. No item exceeds 22
words, uses banned marketing language, relies on a mood/metaphor heading, or
uses inconsistent terminology. Actions name their outcome. Claim references
are the matching entries in `.factory/claims.json`; unlabelled rows are
instructions, labels, navigation, or attribution rather than promises.

### Landing and playable-shell copy

| Copy | Words | Check |
| --- | ---: | --- |
| Make six vocabulary games | 4 | `six-games` |
| For language, ESL, and primary teachers who need a quick activity from this week’s words. | 15 | audience |
| Paste your word pairs | 4 | action |
| Try it with sample data | 5 | action |
| Open a ready-to-play photosynthesis game. | 5 | `sample-demo` |
| Free to use | 3 | `free-to-use` |
| No account | 2 | `no-account` |
| Lists stay on this device | 5 | `local-device` |
| Put one word and meaning on each line. | 8 | instruction |
| We check the list as you type. | 7 | `list-check` |
| Shown at the top of each game | 7 | help |
| Example: nocturnal — active during the night | 6 | help |
| Load sample list | 3 | action |
| Clear list | 2 | action |
| Copy class link | 3 | `class-link` |
| Add 3 pairs to choose a game. | 7 | empty state |
| Copy a class link. | 4 | `class-link` |
| If your learning platform rejects a long link, download a lesson file. | 12 | `lesson-file` |
| Download lesson file | 3 | `lesson-file` |
| Import lesson | 2 | action |
| Use 3 to 30 pairs. | 5 | `pair-limit` |
| Use a dash or colon between each word and meaning. | 10 | instruction |
| Connect each word to its meaning. | 6 | `match-up-play` |
| Hit the right word before moving on. | 7 | `word-strike-play` |
| Unscramble the word from its clue. | 6 | `anagram-play` |
| Reveal letters without using six misses. | 7 | `word-reveal-play` |
| Find every hidden word-and-meaning pair. | 6 | `memory-play` |
| Answer up to five multiple-choice clues. | 6 | `quiz-race-play` |
| Add words, translations, or definitions. | 5 | instruction |
| Pick any of six games from your list. | 8 | `six-games` |
| Play together or copy a class link. | 7 | `class-link` |
| Wordlist Arcade makes classroom vocabulary games. | 6 | footer description |
| Built by Param Factory | 4 | attribution |
| Demo — sample data, nothing is saved. | 6 | `demo-discard` |
| Reset demo | 2 | `demo-discard` |
| Start for real | 3 | `demo-discard` |
| Choose a game | 4 | action |
| Copy link | 2 | `class-link` |
| Enter fullscreen / Exit fullscreen | 2 / 2 | `fullscreen` |
| You’re offline. Saved lists and opened game links still work. | 10 | `offline-demo` |
| This complete class link is N characters. | 7 | `long-class-link` |
| Copy it where long links are accepted. | 8 | `long-class-link` |
| Some learning platforms reject long links. | 6 | fallback context |
| If that happens, download the lesson file. | 7 | `lesson-file` |
| Importing it restores every pair. | 5 | `lesson-file` |
| Complete class link copied. | 4 | `long-class-link` |

The remaining displayed landing strings are product/game names, field labels,
navigation labels, or headings that name their section: “Wordlist Arcade,”
“Demo,” “Make a game,” “Privacy,” “Paste word pairs,” “Share a game with your
class,” “Choose a game,” “Match up,” “Word strike,” “Anagram,” “Word reveal,”
“Memory grid,” “Quiz race,” “How to make a game,” “Make a game in three
steps,” and “Play or share.” Each is intelligible out of context.

### README copy

| Sentence | Words | Check |
| --- | ---: | --- |
| Paste a vocabulary list. | 4 | job |
| Make six classroom games. | 4 | `six-games` |
| For language, ESL, and primary teachers. | 6 | audience |
| Make a quick activity without an account. | 7 | `no-account` |
| It opens a ready-to-play photosynthesis game. | 6 | `sample-demo` |
| The demo keeps sample data separate from your drafts. | 9 | `demo-discard` |
| Reset restores the sample. | 4 | `demo-discard` |
| Leaving the demo deletes the sample data. | 7 | `demo-discard` |
| Wordlist Arcade accepts 3 to 30 pairs. | 7 | `pair-limit` |
| It checks each row while you type. | 7 | `list-check` |
| It can copy a class link that contains the list. | 10 | `class-link` |
| The app works offline after the first visit. | 8 | `offline-demo` |
| Real drafts use browser local storage. | 6 | `local-device` |
| Demo drafts use separate browser storage. | 6 | `demo-discard` |
| A class link contains the shared list. | 7 | `class-link` |
| Use Node.js 20.19.x or Node.js 22.12+. | 6 | `node-compat` |
| Read the privacy notice and terms. | 6 | direct product URLs |

README headings (“Make a vocabulary game,” “Run Wordlist Arcade locally,” and
“Run the tests”) name their sections. Imperative steps and code commands are
instructions rather than unlisted product claims. The current
`.factory/copy-audit.md` independently records the same complete audit and
terminology table.

## Demo, privacy, and claims

`/?demo=1` opened directly to a populated Match up game with six realistic
photosynthesis pairs. The first demo screen showed word and meaning controls,
the persistent “Demo — sample data, nothing is saved.” banner, **Reset demo**,
and **Start for real**. Reset re-seeded only `demo:wordlist-arcade-*`; Start
for real removed those keys and left the normal maker empty. There were no
external requests during the observed demo flow. The local storage namespace,
reset/exit behaviour, and service-worker/offline evidence match
`.factory/demo.md` and the `demo-discard`, `local-device`, `no-tracking`, and
`offline-demo` claim tests.

All 26 claim entries have one purpose-specific test (the Node compatibility
entry is in the unit/Node check). Every exact command in `.factory/claims.json`
was run independently from the clean clone; all passed. The register covers
the visitor-facing claims above, including sample play, each game, free/no
account, local-only storage, privacy, links, lesson files, fullscreen,
offline, demo disposal, and Node support. No unlisted claim was found.

## Structure, routes, accessibility, and links

- Root, demo, game, Privacy, Terms, and 404 routes have route-specific titles,
  one h1, description, canonical, Open Graph/Twitter metadata, favicon, and
  a main landmark. Root title is “Wordlist Arcade — vocabulary games for
  class”; the title pattern is correct per route.
- `/demo`, `/?demo=1`, the populated `/play/strike?demo=1#…` route, Privacy,
  Terms, and the designed 404 were loaded directly. Browser navigation updated
  title, canonical, polite announcement, and h1 focus. Unknown paths returned
  HTTP 404 with a recovery action.
- All crawled internal links returned 200 (or were same-page anchors); the
  labelled external Sociobot link returned 200. Header, skip link, and footer
  links are consistent across all checked shells.
- Cold root/demo loads had no console errors. CSS supplies a visible focus
  ring and reduced-motion path. The test suite contains the route, keyboard,
  target-size, and Axe checks; its clean-clone run passed.
- Response headers supply CSP, `frame-ancestors`, referrer policy, no-sniff,
  and permissions policy. The request log contained only the product origin;
  no CDN, analytics, or runtime third party appeared.

## Earlier findings recheck

Every prior review, polish record, and handoff was read. The following mapping
confirms the current live behaviour and source, rather than relying on an old
“fixed” label.

| Earlier IDs | Current confirmation |
| --- | --- |
| F-01 | Cold mobile and desktop identify job, teachers, and both first actions above the fold. |
| F-02; F-2-7–F-2-16; F-3-2; F-3-7 | Current copy audit confirms plain, consistent terms, useful headings, no jargon/metaphor, and result-naming controls. |
| F-03; F-2-1; F-4-1 | Direct demo, Reset, Start for real, Back/pagehide cleanup, and real/demo storage isolation are implemented and exercised. |
| F-04 | The register is present and all exact claim commands pass from a clean clone. |
| F-04.01; F-04.08; F-3-1 | `six-games` passes all six playable games, including accepted 60-character Anagram terms. |
| F-04.02; F-04.10 | Six games, free use, and no-account have separate observable checks. |
| F-04.03; F-04.11; F-04.17; F-5-1 | A typed real draft saves/reloads/clears and remains isolated from demo storage. |
| F-04.04 | Complete demo request capture is first-party only. |
| F-04.05 | Invalid rows announce a useful parse error while typing. |
| F-04.06; F-3-6; F-5-3 | Lesson-file export/import restores exact rows without list-bearing network traffic. |
| F-04.07; F-04.13 | The 3–30 pair boundary is enforced and tested. |
| F-04.09; F-04.14; F-04.21; F-5-2 | Fresh-context class-link restore and request-level fragment privacy both pass. |
| F-04.12 | README six-game wording maps to the tested game behaviour. |
| F-04.15; F-2-2 | A maximum 30-pair link restores exactly; lesson-file fallback is available. |
| F-04.16; F-3-8; F-5-7 | Mobile controls visibly name outcomes and the fullscreen control invokes the API. |
| F-04.18; F-6-1 | Offline proof includes an exact saved real draft and copied shared-game route. |
| F-04.19; F-3-5; F-5-4; F-5-5 | Account, tracker, cookie, student-field, and no-grading statements have separate checks. |
| F-04.20 | Every tested demo exit removes all `demo:` keys without changing real data. |
| F-05; F-2-3 | Unknown routes return the designed 404 with status, recovery, canonical, and `og:url`. |
| F-06 | History, titles, focus, announcements, and direct routes work. |
| F-07 | Route metadata, favicon, Apple icon, robots, sitemap, and PWA metadata remain complete. |
| F-08; F-2-6; F-3-3 | Maker, game, legal, and 404 shells share wordmark, navigation, footer, legal links, attribution, and build id. |
| F-2-4; F-2-5 | Mobile targets meet the 44px requirement and the demo banner has valid status/region semantics. |
| F-3-4 | Each game description has a dedicated fresh-demo interaction claim. |
| F-4-2 | The clean-clone local suite passes, including the worker-update regression. |
| F-5-6 | Declared Node floors have a dedicated compatibility check. |
| F-5-8 | The Sociobot link is visibly marked as external. |
| F-7-1 | README Privacy and Terms links are absolute Wordlist Arcade URLs, not GitHub-root-relative links. |

## Missed leverage

No finding. The brief explicitly excludes AI-generated content, so an AI
feature would be decorative rather than useful. The implied sharing/import
need is already fulfilled by class links and local lesson-file export/import.
No provider key is embedded.

## What would make this perfect

No product change is identified. Preserve the claim-by-claim clean-clone run
and live cold-context checks whenever the copy, storage, service worker, or
routing changes.
