# Wordlist Arcade

Paste a vocabulary list. Make six classroom games.

For language, ESL, and primary teachers. Make a quick activity without an
account.

Live site: <https://wordlist-arcade.sociobot.in>

## Make a vocabulary game

1. Paste one word and meaning on each line.
2. Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race.
3. Play together or copy a class link.

Use the sample at <https://wordlist-arcade.sociobot.in/?demo=1>. It opens a
ready-to-play photosynthesis game. The demo keeps sample data separate from
your drafts. Reset restores the sample. Leaving the demo deletes the sample
data.

Wordlist Arcade accepts 3 to 30 pairs. It checks each row while you type. It
can copy a class link that contains the list. The app works offline after
the first visit. These claims are declared and tested in
[`.factory/claims.json`](.factory/claims.json).

## Run Wordlist Arcade locally

Requires Node.js 20 or later.

```sh
npm ci
npm run dev
```

## Run the tests

```sh
npm test
npm run build
```

Run every declared claim check from a clean clone:

```sh
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
```

Then run each printed command. The browser tests build the static site and use
the isolated `/?demo=1` entry point.

The deployable static site is in `dist/`, with `dist/index.html` at its root.
Azure Static Web Apps settings live in `public/staticwebapp.config.json`.

## Privacy

Real drafts use browser local storage. Demo drafts use separate browser
storage. A class link contains the shared list. Do not put student names or
confidential content in a list. Read the [privacy notice](/privacy/) and
[terms](/terms/).

Asset sources and provenance are documented in `.factory/design.md`.

Licensed under the MIT License.
