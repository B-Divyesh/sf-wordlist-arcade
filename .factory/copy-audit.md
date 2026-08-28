# Copy audit — 2026-08-28, polish round 6

The cold 390px first screen, every landing label and sentence, the demo game
toolbar, offline state, dynamic long-link state, and README were read aloud. Every
visitor-facing sentence has 22 words or fewer. No sentence uses a banned
marketing word. Each observable promise names its `.factory/claims.json`
entry.

## Landing and game copy

| Copy | Words | Review |
| --- | ---: | --- |
| Make six vocabulary games | 4 | `six-games` |
| For language, ESL, and primary teachers who need a quick activity from this week’s words. | 15 | audience |
| Paste your word pairs | 4 | action |
| Try it with sample data | 5 | action |
| Open a ready-to-play photosynthesis game. | 5 | `sample-demo` |
| Free to use | 3 | `free-to-use` |
| No account | 2 | `no-account` |
| Lists stay on this device | 5 | `local-device` |
| Wordlist Arcade | 2 | product name |
| Demo | 1 | navigation |
| Make a game | 3 | navigation |
| Privacy | 1 | navigation |
| Make vocabulary games | 3 | section eyebrow |
| Paste word pairs | 3 | section heading |
| Put one word and meaning on each line. | 8 | instruction |
| We check the list as you type. | 7 | `list-check` |
| List name | 2 | field label |
| Shown at the top of each game | 7 | help |
| Words and meanings | 3 | field label |
| Example: nocturnal — active during the night | 6 | field help |
| Load sample list | 3 | action |
| Clear list | 2 | action |
| Copy class link | 3 | `class-link` |
| Add 3 pairs to choose a game. | 7 | empty state |
| Share a game with your class | 6 | section heading |
| Copy a class link. | 4 | `class-link` |
| If your learning platform rejects a long link, download a lesson file. | 12 | `lesson-file` |
| Download lesson file | 3 | `lesson-file` |
| Import lesson | 2 | action |
| Use 3 to 30 pairs. | 5 | `pair-limit` |
| Use a dash or colon between each word and meaning. | 10 | instruction |
| Choose a game | 3 | section heading |
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
| How to make a game | 5 | section eyebrow |
| Make a game in three steps | 6 | section heading |
| Add words, translations, or definitions. | 5 | how-to copy |
| Pick any of six games from your list. | 8 | `six-games` |
| Play or share | 3 | how-to heading |
| Play together or copy a class link. | 7 | `class-link` |
| Wordlist Arcade makes classroom vocabulary games. | 6 | footer |
| Built by Param Factory | 4 | attribution |
| Demo — sample data, nothing is saved. | 6 | `local-device`, `demo-discard` |
| Reset demo | 2 | `demo-discard` |
| Start for real | 3 | `demo-discard` |
| Choose a game | 4 | result-naming action |
| Copy link | 2 | `class-link` |
| Enter fullscreen | 2 | `fullscreen` |
| Exit fullscreen | 2 | `fullscreen` |
| You’re offline. Saved lists and opened game links still work. | 10 | `offline-demo` |

The dynamic long-link state adds these sentences:

| Copy | Words | Review |
| --- | ---: | --- |
| This complete class link is N characters. | 7 | `long-class-link` |
| Copy it where long links are accepted. | 8 | `long-class-link` |
| Some learning platforms reject long links. | 6 | fallback context |
| If that happens, download the lesson file. | 7 | `lesson-file` |
| Importing it restores every pair. | 5 | `lesson-file` |
| Complete class link copied. | 4 | `long-class-link` |

## README

| Copy | Words | Review |
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

## Privacy and terms additions

| Copy | Words | Review |
| --- | ---: | --- |
| Browsers do not send that hash fragment to our web server. | 10 | `fragment-not-sent` |
| It stays on your device until you choose a person, app, or location to send it to. | 17 | `lesson-file-local` |
| Importing a lesson file reads it in this browser only. | 10 | `lesson-file-local` |
| There are no fields for student names or contact details. | 10 | `no-student-data-fields` |
| Games do not create student grades, records, or decisions. | 10 | `no-grading` |
| Sociobot (external site) | 3 | external destination is named before activation |

## Terminology

| Concept | One term |
| --- | --- |
| input row | word pair |
| saved input | list |
| ready-made sample | demo |
| recipient URL | class link |
| downloadable JSON | lesson file |
| playable screen | game |
| school software | learning platform |

No flags remain. Historical review quotations are retained only in review
records and are not product copy.
