# Polish-1 handoff — Wordlist Arcade

## Delivered

- Made the first screen direct for language, ESL, and primary teachers.
- Shipped a real `?demo=1` / `/demo` sandbox with sample game, banner, reset,
  isolated `demo:` storage, offline reload, and a true discard-on-exit path.
- Registered and tested every current product claim in `.factory/claims.json`.
- Completed real game/demo routes, route focus and announcements, per-route
  metadata, a server-owned 404 configuration, and consistent legal/404 shells.
- Kept the original warm-paper geometric classroom identity and improved its
  mobile and plain-language details.

## Verify locally

```sh
npm ci
npm run build
npm test
node -e "for (const c of require('./.factory/claims.json')) console.log(c.test)"
```

Run each printed claim command. The full suite records 10 Vitest tests and 48
Playwright project runs. The combined claim run records 24 project runs.

Evidence in this checkout:

- `.factory/evidence/local/verify.json`: `verify-url.sh` passed with no console
  errors, `lang=en`, one h1, main landmark, and no missing image alt text.
- `.factory/evidence/local/screenshot-desktop.png` and
  `.factory/evidence/local/screenshot-mobile.png`: cold local preview.
- `.factory/evidence/local/lighthouse.json`: Performance 100, Accessibility
  100, SEO 100; LCP 1.5 s, CLS 0, TBT 0 ms.
- Playwright Axe integration found no serious/critical issues on landing,
  legal, static 404, or all six games at desktop and mobile.

The production build is `dist/`; the artifact remains a Vite static site for
Azure Static Web Apps. Its entry JS is 35.29 kB raw / 11.70 kB gzip, CSS is
15.08 kB raw / 4.18 kB gzip, and the mobile hero is 20 kB.

## Deployment and live check

Repair commit `91818d498ec1248608658b028d1b5cdc71a0f072` was pushed to
`origin/main` and deployed through the factory static work order (Azure
deployment `1bfb4d84-aace-4774-a9f6-17593e888ab6`).

Cold production checks passed at <https://wordlist-arcade.sociobot.in>:

- root: HTTP 200, exact teacher-facing h1/facts, no console errors, zero
  390px overflow;
- `/?demo=1`: playable Match up, persistent banner, `/demo` canonical, and
  isolated demo keys; seeded real data stayed unchanged and Start for real
  discarded demo data;
- `/not-a-real-route`: HTTP 404 with the designed not-found page;
- `/privacy/` and `/terms/`: HTTP 200 with route metadata and consistent
  shell;
- live AxeBuilder scans of root, demo, both legal pages, and 404: zero
  serious/critical violations.

Live reports and screenshots are in `.factory/evidence/live/`. No known
product gaps are intentionally deferred.
