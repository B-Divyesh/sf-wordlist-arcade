# Independent verification 3 — PASS

**Work order:** `wordlist-arcade-verify-3`  
**Verified candidate:** `87d4e7e84904978f8a78cb77e54a1f286c31f4f2` (`fix: preserve long lesson sharing`)  
**Verified deployment:** <https://wordlist-arcade.sociobot.in/>  
**Date:** 2026-08-27  
**Verdict:** **PASS — the candidate and live static deployment satisfy the researched small useful product.**

No product code was modified during this verification. The only changes in this
commit are this report and the handoff status.

## Scope and clean environment

The repository began clean on `main` at exactly the candidate SHA. I read
`.factory/brief.json`, `.factory/design.md`, the prior verification reports,
the production source, PWA configuration, and legal pages. `npm ci` installed
the lockfile-resolved 99 packages and reported 0 vulnerabilities. The first
browser-test attempt correctly reported that the disposable container lacked
Playwright Chromium; after installing the repository-documented prerequisite
with `npx playwright install chromium`, the full suite was rerun.

## Automated gates

| Gate | Result |
| --- | --- |
| `npm test` | PASS: Vitest **10/10**; Playwright's recorded last run is `passed` for all 18 desktop/mobile project entries (17 passed and one intentional desktop-only mobile-layout skip). |
| `npm run build` | PASS: `tsc --noEmit && vite build`; generated `dist/`. |
| Production budget | PASS: entry JS **31,852 B raw / 10,850 B gzip** (<200 KB), CSS **14,102 B raw / 3,950 B gzip** (<50 KB), mobile hero WebP **17,240 B** (<300 KB), no downloaded fonts. |
| Lighthouse, live mobile | PASS: Performance **99**, Accessibility **100**, Best Practices **100**, SEO **100**; LCP **1.2 s**, CLS **0**, TBT **130 ms**. |

The repository has no separate lint script or type-check script: the declared
production build performs the available TypeScript check. It is a static PWA,
not a library/CLI/backend, so pack-install, API, persistence, concurrency, and
health-endpoint checks do not apply.

## Product exercise

I independently used the live product at 1440×900 and 390×844 with a normal
three-pair word-to-translation list using each supported separator:

```text
sun — sol
moon -> luna
star : estrella
```

Both viewports reported “3 pairs ready. Choose any game.” and successfully
opened **Match up, Word strike, Anagram lab, Word reveal, Memory grid, and Quiz
race**. Each route rendered its game stage and returned to the maker. The
repository's browser suite additionally completes a Match up round end to end,
checks all six populated game states with axe, and performs the exact
low-compressibility 30-pair boundary round trip in fresh browser contexts.

Boundary, malformed, and recovery checks passed:

- The suite's 30-pair, 60-character-term / 180-character-definition,
  low-compressibility input remains copyable, opens in a fresh context with
  exact content, and download/import restores it exactly.
- A malformed second line left three valid pairs usable and announced the
  precise error: “Line 2 needs a word and meaning separated by —, -, :, |, =,
  or a tab.”
- `#play/match?d=broken` safely returned to the maker and announced that the
  game link was incomplete or damaged.
- A term containing `<img src=x onerror=alert(1)>` created no game-stage image,
  dialog, or page error, confirming escaped rendering on this exercised path.

## Accessibility, responsive behavior, and PWA

- Repository Playwright axe scans found **0 serious/critical** issues on the
  landing page and all six populated game states in desktop and 390px projects.
- Independent 390px live checks found **0 px** horizontal overflow before and
  after entering games. Both widths had no console or page errors.
- Keyboard Tab reached a visibly focused control: computed focus outline was
  **4px `rgb(243, 191, 59)`**. The page includes a skip link, one landing-page
  h1, `lang="en"`, title, main landmark, labelled form controls, and an
  informative hero alt.
- With `prefers-reduced-motion: reduce`, computed document scroll behavior was
  `auto` and a game-card transition duration was `1e-05s`.
- The local production PWA tests passed offline reload and a waiting
  service-worker update. Independently on the live URL, the service worker
  controlled the page; after its first online visit, offline reload displayed
  “Turn this week’s words into play.” with no console errors.

## Deployment parity, privacy, and security

The deployment is the candidate, rather than an older artifact. SHA-256 values
were identical between `dist/` and live responses for `index.html`, hashed JS,
hashed CSS, `sw.js`, manifest, offline page, desktop/mobile WebP assets. The
live root's HTML SHA-256 was
`d850402354f45f2b2889c97603981ae35906f6fdf2d49164e295cf169ec55b5d`.

Browser request instrumentation on both desktop and mobile recorded **no
cross-origin runtime requests** and no console/page errors. Source and runtime
checks agree with the privacy notice: draft data uses browser localStorage;
shared lesson state is after `#` in the URL; there are no accounts, ads,
analytics, third-party scripts, or application network submissions. Privacy
and terms pages are present and match those claims.

Live response headers verify CSP (`default-src 'self'`, `connect-src 'self'`,
`frame-ancestors 'none'`), `X-Frame-Options: DENY`, HSTS, `nosniff`,
`Referrer-Policy: no-referrer`, and a restrictive camera/microphone/geolocation
Permissions Policy. Hashed assets have `public, max-age=31536000, immutable`;
the service worker has `no-cache, no-store, must-revalidate`; HTML has a short
30-second revalidation cache.

## Defects and follow-up

No critical, high, medium, or low release defect was found.

**Informational limitation:** a maximally low-compressibility valid 30-pair
class URL can exceed some third-party LMS/email URL limits. The candidate no
longer disables or truncates that complete URL, and provides a lossless,
versioned download/import/native-share lesson-file fallback. A future optional
short-link service could improve compatibility with receivers that reject long
URLs, but it is not required for the brief's stateless URL-based product and is
not a release blocker.

