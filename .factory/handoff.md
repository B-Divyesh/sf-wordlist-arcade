# Wordlist Arcade — review 7 handoff

## Outcome

Adversarial review 7 is complete with a **FAIL** verdict and one minor finding.
The deployed product is clear, playable, sandboxed, and green in all claim and
quality checks. `README.md` lines 58–59 use root-relative Privacy and Terms
links which lead to GitHub's own policies from the rendered repository README.

No product code was modified. The full review is in `.factory/review-7.md`.

## How to verify

```sh
npm ci
npm test
npm run build
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
```

Run every printed claim command independently from a clean clone. For deployed
checks, set `PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in` before a
Playwright command.

## Verification completed

- Fresh no-local clone at candidate `3d8ace4`: all 26 exact claim commands
  passed. The browser claims passed 50/50 desktop/mobile runs; Node compatibility
  also passed.
- Fresh-clone `npm test`: 11 unit tests and 76 browser tests passed, with two
  intended project-specific skips.
- Fresh-clone `npm run build`: passed and produced `dist/`; entry JavaScript is
  11.75 kB gzip.
- Production aggregate claims: 50/50 passed.
- Production route/mobile/Axe regression: 22 applicable tests passed with two
  intended skips.
- Cold production checks passed at 390×844 and 1440×900. The first screen names
  the job, audience, real action, sample action, and three facts.
- The one-click sample opens a populated photosynthesis Match up game. Reset,
  Back, and Start for real isolate and discard demo data while preserving real
  data.
- Root/demo verifier checks reported no console errors, one h1, `lang=en`, one
  main landmark, complete alt text, and labelled buttons.
- Site links, metadata, deep links, back/focus behavior, 404, security headers,
  manifest MIME, offline saved drafts/game links, and the distinct visual
  identity were rechecked live.

## Known gap and next step

Fix F-7-1 by changing the README's `/privacy/` and `/terms/` targets to:

- `https://wordlist-arcade.sociobot.in/privacy/`
- `https://wordlist-arcade.sociobot.in/terms/`

Then verify the destinations from the rendered GitHub README and rerun the
review. No other gap was found.
