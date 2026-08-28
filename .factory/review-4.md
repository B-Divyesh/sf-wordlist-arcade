# Adversarial first-read review 4

**Product:** Wordlist Arcade  
**Reviewed:** 2026-08-28  
**Base:** `55ece8e08d38063b4c843adc9aef1545effcbd57`  
**Verdict: FAIL**

Two blocking findings remain. Demo data is not discarded when a visitor leaves
the demo with the browser Back button, and the clean-clone `npm test` quality
gate fails in both browser projects. The sample path, visual identity, most
claims, and the previous repair set otherwise verify as described below.

## Findings

### F-4-1 / F-03 — BLOCKING — browser Back leaves demo data after the visitor exits demo

- **Exact location:** the persistent demo banner says, “Demo — sample data,
  nothing is saved.” The demo-sandbox contract also requires that leaving demo
  discards its data.
- **Reproduction:** in a fresh live Chromium context, open `/`, click **Try it
  with sample data**, then invoke browser Back. The normal landing page opens
  with no demo banner. `localStorage` still contains
  `demo:wordlist-arcade-draft` and `demo:wordlist-arcade-title`, including all
  six sample pairs.
- **Why this blocks:** a normal visitor can leave with Back rather than the
  specially labelled exit. The demo is no longer visible but its data remains
  in browser storage, so the required discard-on-exit behavior is only
  partially implemented. This is a regression of the earlier demo-isolation
  finding: **Start for real** clears the namespace correctly, but it is not the
  only exit path.
- **Concrete fix:** clear every `demo:` key when navigation leaves a demo URL,
  including `pagehide`/Back navigation, without clearing real draft keys. Add
  this path to `@claim:demo-discard`: enter demo from `/`, call
  `page.goBack()`, assert no `demo:` key remains, and assert seeded real keys
  are byte-for-byte unchanged. Keep the current Reset and Start-for-real cases.

### F-4-2 — BLOCKING — the required local test suite fails

- **Exact location:** `tests/app.spec.ts:261`, “a waiting service-worker update
  is offered and can be applied.”
- **Reproduction:** from the clean clone used for this review:

  ```sh
  npx playwright test --project=desktop --grep 'waiting service-worker update'
  ```

  It fails at line 271 after five seconds: `getByRole('button', { name:
  'Update now' })` has no element. The same test failed in the mobile project
  in the full `npm test` run. `test-results/.last-run.json` reports `failed`
  with both project entries.
- **Why this blocks:** the product contract requires `npm test` to pass before
  handoff. The current full suite has two failures, even though the app's
  ordinary pages load without console errors.
- **Concrete fix:** make the service-worker update test deterministic against
  Vite preview (for example, wait for the changed worker to reach `installed`
  and a waiting registration, or test the update notification with a controlled
  registration fixture). Then run `npm test` from a new clone and retain the
  passing output for both desktop and mobile. Do not suppress the test or make
  the update button permanently visible.

## Cold first screen

Fresh Chromium contexts at 390×844 and 1440×1000 loaded the root with no
console errors and no horizontal overflow. Before scrolling, I could answer
all three required questions.

| Question | First-read answer | Supporting first-screen copy |
| --- | --- | --- |
| What does this do? | It makes six vocabulary games from word pairs. | “Make six vocabulary games” |
| For whom? | Language, ESL, and primary teachers who need a quick class activity. | “For language, ESL, and primary teachers who need a quick activity from this week’s words.” |
| What should I click first? | Paste real pairs, or try the ready-made sample. | “Paste your word pairs” and “Try it with sample data” |

The sample outcome, “Open a ready-to-play photosynthesis game,” and the three
plain facts fit in the mobile viewport. This check passes.

## Copy audit

Word counts treat a URL and a hyphenated term as one word. Controls, labels,
headings, and dynamic landing states are included because they are visitor
copy. No item exceeds 22 words and no banned marketing adjective or jargon was
found. Buttons name their result. The banner is flagged only through F-4-1
because its storage promise is not true for every exit path.

### Landing page

| Words | Copy |
| ---: | --- |
| 4 | Skip to main content |
| 2 | Wordlist Arcade |
| 1 | Demo |
| 3 | Make a game |
| 1 | Privacy |
| 4 | Vocabulary games for class |
| 4 | Make six vocabulary games |
| 15 | For language, ESL, and primary teachers who need a quick activity from this week’s words. |
| 4 | Paste your word pairs |
| 5 | Try it with sample data |
| 5 | Open a ready-to-play photosynthesis game. |
| 3 | Free to use |
| 2 | No account |
| 5 | Lists stay on this device |
| 13 | A handmade geometric machine turning blank word cards into six colorful game paths |
| 3 | Make vocabulary games |
| 3 | Paste word pairs |
| 8 | Put one word and meaning on each line. |
| 7 | We check the list as you type. |
| 2 | List name |
| 7 | Shown at the top of each game |
| 3 | Words and meanings |
| 6 | Example: nocturnal — active during the night |
| 3 | Load sample list |
| 2 | Clear list |
| 3 | Copy class link |
| 8 | Add 3 pairs to choose a game. |
| 6 | Share a game with your class |
| 4 | Copy a class link. |
| 12 | If your learning platform rejects a long link, download a lesson file. |
| 3 | Download lesson file |
| 2 | Import lesson |
| 5 | Use 3 to 30 pairs. |
| 10 | Use a dash or colon between each word and meaning. |
| 3 | Choose a game |
| 2 | 0 pairs |
| 2 / 6 | Match up / Connect each word to its meaning. |
| 2 / 7 | Word strike / Hit the right word before moving on. |
| 1 / 6 | Anagram / Unscramble the word from its clue. |
| 2 / 7 | Word reveal / Reveal letters without using six misses. |
| 2 / 6 | Memory grid / Find every hidden word-and-meaning pair. |
| 2 / 6 | Quiz race / Answer up to five multiple-choice clues. |
| 5 | How to make a game |
| 6 | Make a game in three steps |
| 3 / 5 | Paste word pairs / Add words, translations, or definitions. |
| 3 / 8 | Choose a game / Pick any of six games from your list. |
| 3 / 7 | Play or share / Play together or copy a class link. |
| 6 | Wordlist Arcade makes classroom vocabulary games. |
| 4 | Built by Param Factory |
| 1 | Terms |

The demo-only strings are **6** words for “Demo — sample data, nothing is
saved.”, **2** for “Reset demo”, and **3** for “Start for real.” They are
otherwise clear; F-4-1 covers the false exit behavior.

The maximum-link state adds: “This complete class link is N characters.” (7),
“Copy it where long links are accepted.” (8), “Some learning platforms reject
long links.” (6), “If that happens, download the lesson file.” (7), and
“Importing it restores every pair.” (5). These map to `long-class-link` and
`lesson-file` and are under the limit.

### README

| Words | Copy |
| ---: | --- |
| 2 | Wordlist Arcade |
| 4 | Paste a vocabulary list. |
| 4 | Make six classroom games. |
| 6 | For language, ESL, and primary teachers. |
| 7 | Make a quick activity without an account. |
| 3 | Live site: https://wordlist-arcade.sociobot.in |
| 4 | Make a vocabulary game |
| 8 | Paste one word and meaning on each line. |
| 13 | Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race. |
| 7 | Play together or copy a class link. |
| 5 | Use the sample at https://wordlist-arcade.sociobot.in/?demo=1. |
| 6 | It opens a ready-to-play photosynthesis game. |
| 9 | The demo keeps sample data separate from your drafts. |
| 4 | Reset restores the sample. |
| 7 | Start for real deletes the sample data. |
| 7 | Wordlist Arcade accepts 3 to 30 pairs. |
| 7 | It checks each row while you type. |
| 10 | It can copy a class link that contains the list. |
| 8 | The app works offline after the first visit. |
| 8 | These claims are declared and tested in `.factory/claims.json`. |
| 4 | Run Wordlist Arcade locally |
| 5 | Requires Node.js 20 or later. |
| 3 | Run the tests |
| 9 | Run every declared claim check from a clean clone. |
| 5 | Then run each printed command. |
| 14 | The browser tests build the static site and use the isolated `/?demo=1` entry point. |
| 12 | The deployable static site is in `dist/`, with `dist/index.html` at its root. |
| 8 | Azure Static Web Apps settings live in `public/staticwebapp.config.json`. |
| 1 | Privacy |
| 6 | Real drafts use browser local storage. |
| 6 | Demo drafts use separate browser storage. |
| 7 | A class link contains the shared list. |
| 11 | Do not put student names or confidential content in a list. |
| 6 | Read the privacy notice and terms. |
| 8 | Asset sources and provenance are documented in `.factory/design.md`. |
| 5 | Licensed under the MIT License. |

## Demo and sandbox

The one-click path passes its entry check. Both `/?demo=1` and `/demo` open a
populated Photosynthesis practice **Match up** game immediately. The first demo
screen includes realistic words and meanings, the persistent banner, **Reset
demo**, and **Start for real**. Reset restores the exact sample. A seeded real
draft and title remained unchanged through Reset, game play, and Start for
real; that explicit exit removed every `demo:` key. Request capture during the
flow was same-origin only, the cookie jar and `Set-Cookie` headers were empty,
and the sample reloaded offline after a first online visit.

F-4-1 is the exception: browser Back exits the sandboxed screen without
discarding its namespace.

## Claims and local checks

I made a new no-local clone at `/tmp/wordlist-arcade-review4.6fSuAB`, ran
`npm ci`, and executed every exact command from `.factory/claims.json` before
the full suite. All 21 declared claim commands completed successfully in both
desktop and mobile projects. Their tested outcomes cover the sample, six game
behaviors, price/account state, storage isolation, limits, class links,
lesson-file restore, fullscreen, tracking/cookies, offline reload, and the
labelled Start-for-real discard flow.

The claim register itself is complete for current landing and README product
claims. `demo-discard` is insufficient because it does not test the Back exit;
this is the coverage gap recorded in F-4-1, not an unlisted-copy finding.

`npm run build` also passed in that clone and produced `dist/` (main JS 34.89
kB raw / 11.62 kB gzip; CSS 15.50 kB raw / 4.27 kB gzip). The full `npm test`
run failed only on the service-worker update test in desktop and mobile, as
recorded in F-4-2.

## Earlier-finding verification

Every prior finding was rechecked on the deployed site and against the current
source. “Fixed” below is an observed result, not a status copied from a prior
handoff.

| Earlier finding | Current result and evidence |
| --- | --- |
| F-01 | Fixed: cold mobile and desktop screens name the job, teachers, and first actions. |
| F-02 | Fixed: current landing/README audit has no banned word, jargon, unclear heading, or over-22-word sentence. |
| F-03 | **Regressed through F-4-1:** Reset and Start for real isolate/delete correctly, but browser Back leaves `demo:` keys. |
| F-04.01, F-04.08 | Fixed: three valid 60-character terms open and accept an interaction in all six games under `@claim:six-games`. |
| F-04.02 | Fixed: six-game, free, and no-account facts have separate declared tests. |
| F-04.03, F-04.11, F-04.17 | Fixed for active demo use: seeded real storage remains unchanged and demo uses `demo:` keys. |
| F-04.04, F-04.19 | Fixed: complete demo request capture is first-party; no-account, no-tracking, and no-cookie claims are declared. |
| F-04.05 | Fixed: an invalid typed row reports the line error. |
| F-04.06, F-04.15 | Fixed: lesson download/import restores exact rows; the maximum 30-pair link remains copyable and restores exactly. |
| F-04.07, F-04.13 | Fixed: 31st row is rejected and 30 valid rows remain usable. |
| F-04.09, F-04.14, F-04.21 | Fixed: the class link carries state after `#` and opens in a fresh context. |
| F-04.10 | Fixed: free and account-free entry are independently tested. |
| F-04.12 | Fixed: README and landing retain the six-game claim and the test exercises actual play states. |
| F-04.16 | Fixed: fullscreen invokes the labelled browser API control. |
| F-04.18 | Fixed: a previously opened demo reloads offline. |
| F-04.20 | Fixed only for the explicit Reset → Start-for-real route; F-4-1 identifies the untested Back route. |
| F-05 | Fixed: an unknown live URL returns HTTP 404 with the designed recovery page. |
| F-06 | Fixed: demo/game navigation updates title, canonical metadata, route announcement, h1 focus, and Back behavior. |
| F-07 | Fixed: root, demo, games, legal pages, and 404 expose description, canonical, OG/Twitter fields, favicon, and route title. |
| F-08, F-2-6, F-3-3 | Fixed: root, demo/game, legal, and 404 use the same wordmark/nav/footer text. |
| F-2-2 | Fixed: maximum-link claim has its own tagged exact-row test. |
| F-2-3 | Fixed: 404 includes `og:url` for `/404`. |
| F-2-4 | Fixed: visible root/demo/legal/404 controls meet 44px in the mobile suite. |
| F-2-5 | Fixed: the demo banner now uses valid nested status semantics and the demo axe sweep has zero violations. |
| F-2-7 to F-2-16 | Fixed: untestable art claim removed; teacher terminology, separator wording, README privacy/demo text, and headings are plain and consistent. |
| F-3-2, F-3-7, F-3-8 | Fixed: no reachable “LMS”/“unlock” wording; mobile game controls visibly say Copy link and Fullscreen. |
| F-3-4 to F-3-6 | Fixed: six individual game claims, no-cookie coverage, and deterministic lesson-file download are present. |
| Verification 1–3 findings | Fixed/retained: game axe semantics, long-link fallback, PWA icons/headers/MIME, cache/security settings, and fullscreen path all verify, subject to F-4-2’s failing update-notification test. |

## Structure, routing, links, accessibility, and identity

- Root, direct demo, Privacy, Terms, game, and static 404 have one h1 and one
  main landmark. The root title is “Wordlist Arcade — vocabulary games for
  class”; route titles follow the required route-first pattern.
- Root, demo, Privacy, Terms, 404, robots, sitemap, manifest, favicon, and the
  external Sociobot contact link returned HTTP 200. The intentional unknown
  route returned HTTP 404. No dead link was found.
- Root/demo/404 metadata, canonical URLs, social image, favicon, apple touch
  icon, `lang`, security headers, and same shared shell verify. The 404 gives a
  home action. Dynamic game navigation moves focus to the h1 and announces the
  route; browser Back returns focus appropriately.
- The warm-paper, marker-outline, offset-shadow, geometric classroom-machine
  system is visibly product-specific rather than a generic SaaS template.
- The live root and demo had no console errors. Existing axe coverage reports
  no demo-shell violation and no serious/critical game violation. The failed
  update test prevents a quality-gate pass, regardless of those positive checks.

## Missed leverage

No additional AI feature is expected. The brief explicitly excludes
AI-generated content, and optional AI parsing would add cost and privacy
friction to a simple word-pair workflow. Import/export is already provided by
lesson files, and account sync conflicts with the account-free local-first
scope.

## What would make this perfect

Discard the demo namespace on every exit path, especially browser Back, and
add that scenario to the declared discard claim. Repair the deterministic
service-worker-update test so `npm test` passes in a brand-new clone. Then
repeat this full live and clean-clone review with zero test failures and zero
remaining findings.
