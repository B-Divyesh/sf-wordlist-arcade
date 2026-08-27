# Independent verification 2 — FAIL

**Verifier:** `wordlist-arcade-verify-2`  
**Candidate commit:** `dcce8de41c72a54ac790f93f85486e305797311f`  
**Live URL:** <https://wordlist-arcade.sociobot.in>  
**Date:** 2026-08-27  
**Verdict:** **FAIL — do not release this candidate as satisfying the researched brief.** The deployed site exactly matches the candidate and is otherwise healthy, but a supported valid list can become unshareable with no required short-link fallback.

No product code was changed during this verification.

## Release blocker

### High — valid maximum list cannot be shared

The UI documents and accepts 3–30 pairs, while the product promise and brief require complete game state in a shareable URL (with compression and a short-link fallback for URL limits). A representative 30-pair low-compressibility list with each term/meaning within the app's accepted 60/180-character limits:

- parsed as 30 pairs and opened **Quiz race** successfully;
- produced a 2,055-character class URL;
- disabled **Copy class link** and displayed: “too long for many LMS and email tools”; and
- has no short-link store/fallback in the code or live app.

This is not merely a warning: the accepted list cannot be pasted into an LMS or shared with students, which defeats a core classroom job-to-be-done at the advertised boundary. `src/main.ts` deliberately enforces a 1,900-character limit. Either provide a privacy-preserving short-link fallback, reduce/document the accepted input budget before entry, or otherwise make every advertised supported list shareable.

## What passed

### Clean checkout and build

- Started from a clean checkout at the exact candidate SHA.
- `npm ci` completed: 99 audited packages, 0 vulnerabilities.
- Installed declared Playwright Chromium.
- `npm test` passed: Vitest **8/8** unit tests and Playwright **17 passed, 1 intentional desktop-only skip** (the stored last-run status is `passed`). This includes the candidate's PWA offline/update regression coverage.
- `npm run build` passed (`tsc --noEmit && vite build`) and produced `dist/`.
- Production entry budgets: JS **28,758 B raw / 9,885 B gzip** (limit 200 KB); CSS **13,889 B raw / 3,935 B gzip** (limit 50 KB); mobile hero WebP **17,240 B** (limit 300 KB). No fonts are downloaded.

### End-to-end behavior

- Independently completed each of the six games from a normal three-pair `word — translation` list: Match up, Word strike, Anagram lab, Word reveal, Memory grid, and Quiz race. Each reached **“Round complete!”**.
- Normal six-pair input with Unicode (`pájaro`, `árbol`, `مرحبا`, `猫`) made every game route available. A malformed line and duplicate term reported the line error while retaining the three valid pairs. `/#play/not-a-game?d=bad` recovered to the maker with the damaged-link notice.
- Desktop axe scans of the landing page and every populated game found **0 serious/critical** violations. The repository suite repeats this coverage for desktop and 390px mobile.
- At 390×844, all six game starts had **0 px horizontal overflow**. Under reduced motion, transition duration was `1e-05s`. Keyboard Tab exposes the skip link and a visible 4px focus ring; Enter opened Match up from its game card.
- Live service worker registered as `wordlist-arcade-20260827-repair1`; after an online visit, offline reload retained the home page and showed the offline banner with no console/page errors.

### Live deployment parity, privacy, and hardening

- Byte-for-byte local/live SHA-256 matches were verified for `index.html`, hashed JS/CSS, `sw.js`, manifest, offline page, privacy/terms pages, and the mobile hero image. The live deployment is this candidate, not an older build.
- Browser request instrumentation found no request URL/payload containing the sentinel list title and no non-GET application request. Source audit finds only same-origin service-worker fetches; there are no analytics, ad, or third-party runtime scripts. Draft storage is limited to localStorage and shared data is after `#`.
- Live root, legal pages, and assets return CSP with `frame-ancestors 'none'`, `X-Frame-Options: DENY`, HSTS, `nosniff`, `Referrer-Policy: no-referrer`, and the declared Permissions Policy. Hashed JS is `Cache-Control: public, max-age=31536000, immutable`; `sw.js` is no-cache/no-store.
- `/privacy/` and `/terms/` have title, language, main landmark, one h1, skip link, and no serious/critical axe findings in the candidate suite.
- Lighthouse mobile report written before Chrome's known post-report tab-crash warning: Performance **100**, Accessibility **100**, FCP **0.9 s**, LCP **1.1 s**, CLS **0**, TBT **20 ms**. The complete JSON was present at `/tmp/wordlist-lighthouse.json`; the crash warning does not change the captured report, but the metric should be rerun in CI/a stable Chrome environment.

## Other observations

- The live manifest is served as `application/octet-stream`, although Chromium accepts it and the PWA registration/offline behavior passed. Serve it as `application/manifest+json` or `application/json` for standards compatibility. **Low**.

## Required disposition

**FAIL.** Fix the URL-boundary sharing failure, add a regression that copies/opens an oversized valid 30-pair list through the fallback, then rerun clean tests, build, live parity, and PWA verification.
