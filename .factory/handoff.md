# Wordlist Arcade — review 8 handoff

## Outcome

Adversarial review 8 passed with zero findings. No product code was changed.
The committed changes add only `.factory/review-8.md` and this handoff.

## Verification

- Opened the deployed root in fresh 390px and desktop browser contexts; both
  clearly presented the job, audience, first actions, and three plain facts,
  with no console errors.
- Opened the live demo, played the populated sample, confirmed banner/reset/
  exit storage isolation, and recorded no external runtime request.
- Loaded direct demo, game, Privacy, Terms, and 404 routes; checked titles,
  one h1, metadata, focus/announcement behaviour, shared header/footer,
  response headers, and crawled links.
- Created clean clone `/tmp/wordlist-arcade-review8-clean.Oprn1e` at
  `b5b21bf`, installed with `npm ci`, then ran every exact command declared in
  `.factory/claims.json` independently. All 26 passed. Log:
  `/tmp/review8-claims.log`.
- The same clone passed `npm test` (11 Vitest tests and 80 Playwright tests)
  and `npm run build`, which produced `dist/index.html`.

To repeat locally:

```sh
npm ci
npm test
npm run build
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
```

Run each printed claim command from a clean clone. The demo entry point is
`https://wordlist-arcade.sociobot.in/?demo=1`.

## Known gaps and next steps

None identified in this review. Keep the clean-clone claim run and cold live
checks in future rounds, especially after changes to copy, storage, offline
behaviour, or routing.
