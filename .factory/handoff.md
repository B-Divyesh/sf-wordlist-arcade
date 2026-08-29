# Wordlist Arcade — polish round 7 handoff

## Outcome

Round 7 is complete with no open findings. Repair commit
`17a28c3ac38dc438fe6743f7a1637cd4d6a3e10d` is pushed to `main` and the static
artifact is deployed at <https://wordlist-arcade.sociobot.in>.

The only review-seven defect was semantic: root-relative README legal links
sent GitHub readers to GitHub’s notices. The README now uses direct Wordlist
Arcade Privacy and Terms URLs. A browser regression checks both exact targets.
The rendered GitHub README was fetched after pushing and contains both
absolute `href` values. The catalog description is also a current verb-first,
11-word sentence.

## How to run and verify

```sh
npm ci
npm test
npm run build
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
```

Run every printed claim command independently from a clean clone. For the
deployed browser suite, set:

```sh
PLAYWRIGHT_BASE_URL=https://wordlist-arcade.sociobot.in npm run test:claims -- --grep '@claim:'
```

The demo entry point is
<https://wordlist-arcade.sociobot.in/?demo=1>. It is isolated from real drafts;
the banner provides **Reset demo** and **Start for real**.

## Exact verification evidence

- A no-local clone at `/tmp/wordlist-arcade-polish7-clean.eBHR4S` checked out
  `17a28c3`, ran `npm ci`, and then ran every exact command in
  `.factory/claims.json` independently. All 26 commands passed: 25 browser
  claims passed in desktop and mobile projects (50/50); `node-compat` passed
  its tagged assertion and Node 20.19 build. Log:
  `claims-round7.log` in that clone.
- The same clone passed `npm test`: 11/11 Vitest tests and 78 Playwright passes
  with 2 intentional desktop-only skips. `npm run build` passed and produced
  `dist/index.html`. Log: `full-round7.log` in that clone.
- Build output: `main-BHotmWrz.js` is 35.37 kB raw / 11.75 kB gzip; CSS is
  15.50 kB raw / 4.27 kB gzip.
- The work-order static build was deployed with
  `/opt/fleet/lib/deploy-static.sh wordlist-arcade /work/repo/dist`. Cold live
  checks passed for root and demo: no console errors, correct title, `lang=en`,
  one h1, one main, complete alt text, and labelled buttons. Reports and
  screenshots: `evidence/polish-7/live/{root,demo}/verify.json` and
  `screenshot-{desktop,mobile}.png`.
- Production claims passed 50/50. The live route/mobile/Axe sweep passed 16
  applicable checks with 2 intentional desktop-only skips. Logs:
  `evidence/polish-7/live/claims.log` and
  `evidence/polish-7/live/routes-axe.log`.
- Live root Lighthouse mobile: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; FCP 0.9 s, LCP 1.1 s, TBT 40 ms, CLS 0. Report:
  `evidence/polish-7/live/lighthouse/root.json`.
- Production Privacy and Terms returned 200; an unknown route returned the
  designed 404. CSP, frame denial, nosniff, no-referrer, and permissions
  headers are in `evidence/polish-7/live/headers-root.txt` and
  `evidence/polish-7/live/headers-404.txt`.
- The pushed GitHub README render includes
  `https://wordlist-arcade.sociobot.in/privacy/` and
  `https://wordlist-arcade.sociobot.in/terms/`; both targets returned 200.

## Known gaps and next steps

None. The product remains a static, local-first, account-free classroom game
maker. No AI feature was added because the researched scope explicitly excludes
AI-generated content.
