# Wordlist Arcade

Paste a vocabulary list. Make six classroom games.

For language, ESL, and primary teachers. Make a quick activity without an
account.

Live site: <https://wordlist-arcade.sociobot.in>

## Use it

1. Paste one word and meaning on each line.
2. Choose Match up, Word strike, Anagram, Word reveal, Memory grid, or Quiz race.
3. Play together or copy a class link.

Use the sample at <https://wordlist-arcade.sociobot.in/?demo=1>. It opens a
ready-to-play photosynthesis game. Demo data uses `demo:` local-storage keys,
never reads real drafts, and can be reset or discarded with **Start for real**.

Wordlist Arcade accepts 3 to 30 pairs. It checks each row while you type. It
can copy a class link with the list data after `#`. The app works offline after
the first visit. These claims are declared and tested in
[`.factory/claims.json`](.factory/claims.json).

## Develop

Requires Node.js 20 or later.

```sh
npm ci
npm run dev
```

## Verify

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

Real drafts use browser local storage. Demo drafts use a separate `demo:`
namespace. Shared list data is after `#` in a class link. Do not put student
names or confidential content in a list. Read the [privacy notice](/privacy/)
and [terms](/terms/).

The hero and social image are original generated classroom-machine artwork.
Their source prompt and provenance are in `.factory/design.md`.

Licensed under the MIT License.
