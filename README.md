# Wordlist Arcade

Wordlist Arcade turns one pasted vocabulary list into six playable classroom
games: Match up, Word strike, Anagram lab, Word reveal, Memory grid, and Quiz
race. It is built for language, ESL, and primary teachers who need a quick
activity without creating an account or running into a creation limit.

Live site: <https://wordlist-arcade.sociobot.in>

## What it does

- Accepts one `word — definition` or `word — translation` pair per line.
- Generates six games immediately from the same 3–30 pairs.
- Encodes the complete list in a compressed URL-hash class link; no list is sent
  to a server.
- Supports a projector-friendly fullscreen mode and individual shared play.
- Saves the current draft locally in the teacher's browser.
- Works as an installable, offline-capable PWA after the first visit.
- Includes responsive layouts, keyboard paths, reduced-motion behavior, and
  clear invalid-list/link and offline states.

There are no accounts, ads, analytics, student records, paid features, or
third-party runtime scripts.

## Develop

Requires Node.js 20 or later.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The production build command required by
the work order is:

```sh
npm run build
```

The deployable static site is written to `dist/`, with `dist/index.html` at its
root. `public/staticwebapp.config.json` supplies Azure Static Web Apps routing
and security headers.

## Test

```sh
npx playwright install chromium  # once per machine
npm test                         # unit + desktop/mobile browser + axe checks
```

Run the suites independently with `npm run test:unit` or `npm run test:e2e`.
The browser tests cover parsing, URL-state recovery, all six game routes, a
complete match-up round, console errors, axe serious/critical findings, and a
390px overflow check.

## Privacy and content

Drafts are stored only in `localStorage`. Shared list data appears after `#` in
the URL, which browsers do not send in HTTP requests, though anyone who receives
the URL can read it. Teachers should not put student names or confidential data
in lists. See `/privacy/` and `/terms/` for the complete plain-language notices.

The hero illustration was generated specifically for this product using the
factory Azure image deployment. Its prompt, source, and provenance are in
`assets/src/` and `.factory/design.md`.

## Project map

- `src/main.ts` — application UI, routing, and six game engines
- `src/core.ts` — parsing, URL compression, and game helpers
- `src/style.css` — responsive product-specific visual system
- `public/sw.js` — offline cache
- `.factory/design.md` — visual thesis and asset provenance
- `.factory/handoff.md` — verification results and operational notes

Licensed under the MIT License.
