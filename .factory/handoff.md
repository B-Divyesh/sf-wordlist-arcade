# Wordlist Arcade — polish round 5 handoff

## Outcome

All round-5 findings are fixed and verified. The repair commit is
`6766cf691e879d0e39d7b0cb01d84af5ef47eec8`, pushed to `main` and deployed to
<https://wordlist-arcade.sociobot.in/> through the static work order (Azure
deployment `302146b2-0297-43a1-9d38-073ff25b1148`).

The app now proves real draft save/reload/clear behavior, hash-fragment privacy,
lesson-file locality, absence of student-data fields and grading records, and
the exact supported Node floor. Demo toolbar controls name their result, legal
contact links identify their external destination, and demo class links remain
inside `demo:` storage when returning to the chooser.

## Verification

- Fresh no-local clone: `/tmp/wordlist-arcade-polish5-final.c0dNgW`.
  `npm ci` passed. Every one of the 26 exact `.factory/claims.json` commands
  passed. Browser claims produced 50 desktop/mobile passes; `node-compat`
  type-checked and built with Node.js 20.19.0.
- Fresh-clone `npm test`: 11 Vitest tests and 76 Playwright passes, with two
  intended desktop-only skips. `npm run build` produced `dist/` with 35.37 kB
  raw / 11.75 kB gzip entry JS and 15.50 kB raw / 4.27 kB gzip CSS.
- Live claims: 50/50 passed with `PLAYWRIGHT_BASE_URL` set to the production
  URL. Live route/mobile/Axe sweep: 20/20 passed, with two intended skips.
- `verify-url.sh` cold-loaded root and demo with zero console errors, one h1,
  `lang=en`, main landmarks, alt text, and named buttons. Screenshots and JSON
  reports are in `.factory/evidence/polish-5/live/`.
- Live `/not-a-real-route` returns 404 with designed recovery UI and complete
  Open Graph URL. The manifest has `application/manifest+json`; live headers
  contain CSP, frame denial, nosniff, and no-referrer.
- Lighthouse mobile-style run on production: Performance 100, Accessibility
  100, Best Practices 100, SEO 100; FCP 1.0s, LCP 1.1s, TBT 10ms, CLS 0.

## Repeat locally

```sh
npm ci
npm test
npm run build
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
```

Run each printed claim command separately from a fresh clone. For production:

```sh
PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in npm run test:claims -- --grep '@claim:' --workers=2
```

## Remaining work

None. The artifact remains a Vite + TypeScript static web app deployed from
`dist/`.
