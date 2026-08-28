# Copy audit — 2026-08-28, polish round 2

The cold 390px first screen, full landing page, dynamic long-link message, and
README were read aloud and checked. Every sentence has 22 words or fewer. No
sentence uses a banned marketing word. `claim:` entries identify observable
statements covered by `.factory/claims.json`.

## Landing page

| Copy | Words | Review |
| --- | ---: | --- |
| Skip to main content | 4 | navigation |
| Wordlist Arcade | 2 | wordmark |
| Demo | 1 | navigation |
| Make a game | 3 | navigation |
| Privacy | 1 | navigation |
| Vocabulary games for class | 4 | label |
| Make six vocabulary games | 4 | claim:six-games |
| For language, ESL, and primary teachers who need a quick activity from this week’s words. | 15 | audience |
| Paste your word pairs | 4 | action |
| Try it with sample data | 5 | action |
| Open a ready-to-play photosynthesis game. | 5 | claim:sample-demo |
| Free to use | 3 | claim:free-to-use |
| No account | 2 | claim:no-account |
| Lists stay on this device | 5 | claim:local-device |
| Make vocabulary games | 3 | label |
| Paste word pairs | 3 | heading |
| Put one word and meaning on each line. | 8 | instruction |
| We check the list as you type. | 7 | claim:list-check |
| List name | 2 | label |
| Shown at the top of each game | 7 | help |
| Words and meanings | 3 | label |
| Example: nocturnal — active during the night | 6 | help |
| Load sample list | 3 | action |
| Clear list | 2 | action |
| Copy class link | 3 | claim:class-link |
| Add at least 3 pairs to unlock the games. | 9 | empty state |
| Share a game with your class | 6 | heading |
| Copy a class link. | 4 | claim:class-link |
| If your learning platform rejects a long link, download a lesson file. | 12 | claim:lesson-file |
| Download lesson | 2 | claim:lesson-file |
| Share lesson | 2 | claim:lesson-file |
| Import lesson | 2 | claim:lesson-file |
| Use 3 to 30 pairs. | 5 | claim:pair-limit |
| Use a dash or colon between each word and meaning. | 10 | instruction |
| Choose a game | 3 | heading |
| Match up | 2 | claim:six-games |
| Connect each word to its meaning. | 6 | claim:six-games |
| Word strike | 2 | claim:six-games |
| Hit the right word before moving on. | 7 | claim:six-games |
| Anagram | 1 | claim:six-games |
| Unscramble the word from its clue. | 6 | claim:six-games |
| Word reveal | 2 | claim:six-games |
| Reveal letters without using six misses. | 7 | claim:six-games |
| Memory grid | 2 | claim:six-games |
| Find every hidden word-and-meaning pair. | 6 | claim:six-games |
| Quiz race | 2 | claim:six-games |
| Answer five quick multiple-choice clues. | 6 | claim:six-games |
| How to make a game | 5 | label |
| Make a game in three steps | 6 | heading |
| Add words, translations, or definitions. | 5 | instruction |
| Pick any of six games from your list. | 8 | claim:six-games |
| Play together or copy a class link. | 7 | claim:class-link |
| Wordlist Arcade makes classroom vocabulary games. | 6 | summary |
| Built by Param Factory | 4 | attribution |
| Terms | 1 | navigation |

The long-link state adds three sentences. “This complete class link is N
characters” has seven words. “You can still copy it for browsers and tools
that support long links” has twelve. “If an LMS or email tool rejects it,
download or share the lesson file instead; importing it restores every pair”
has nineteen. The full maximum-list behavior is `claim:long-class-link`.

## README

| Copy | Words | Review |
| --- | ---: | --- |
| Paste a vocabulary list. | 4 | job |
| Make six classroom games. | 4 | claim:six-games |
| For language, ESL, and primary teachers. | 6 | audience |
| Make a quick activity without an account. | 7 | claim:no-account |
| Make a vocabulary game | 4 | heading |
| Paste one word and meaning on each line. | 8 | instruction |
| Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race. | 13 | claim:six-games |
| Play together or copy a class link. | 7 | claim:class-link |
| It opens a ready-to-play photosynthesis game. | 6 | claim:sample-demo |
| The demo keeps sample data separate from your drafts. | 9 | claim:demo-discard |
| Reset restores the sample. | 4 | claim:demo-discard |
| Start for real deletes the sample data. | 7 | claim:demo-discard |
| Wordlist Arcade accepts 3 to 30 pairs. | 7 | claim:pair-limit |
| It checks each row while you type. | 7 | claim:list-check |
| It can copy a class link that contains the list. | 10 | claim:class-link |
| The app works offline after the first visit. | 8 | claim:offline-demo |
| Run Wordlist Arcade locally | 4 | heading |
| Requires Node.js 20 or later. | 5 | setup |
| Run the tests | 3 | heading |
| Then run each printed command. | 5 | test instruction |
| Real drafts use browser local storage. | 6 | claim:local-device |
| Demo drafts use separate browser storage. | 6 | claim:demo-discard |
| A class link contains the shared list. | 7 | claim:class-link |
| Do not put student names or confidential content in a list. | 11 | warning |
| Asset sources and provenance are documented in `.factory/design.md`. | 8 | repository pointer |
| Licensed under the MIT License. | 5 | license |

Contributor-only sentences about commands and deployment remain in the README.
They are operational instructions, not landing copy.

## Terminology

| Concept | One term |
| --- | --- |
| input row | word pair |
| saved input | list |
| ready-made sample | demo |
| recipient URL | class link |
| downloadable JSON | lesson file |
| playable screen | game |
