# Review-1 handoff — Wordlist Arcade

## What was done

Completed the requested independent, non-mutating adversarial first-read review
of the live site and supplied `main` commit. The detailed report is in
`.factory/review-1.md`. No product code was changed.

## How to verify

The review used fresh Chromium contexts at 390×844 and desktop, then checked
the example flow, direct demo URLs, localStorage, request destinations,
metadata, links, focus, Back navigation, and unknown-route behavior.

A fresh clone of the supplied remote at
`23a4a13c895f4f1514e5da4d716fc25ca459e484` was installed and verified with:

```sh
npm ci
npm test
npm run build
```

All commands passed. `npm test` reported 10 unit tests and 18 Playwright tests;
the build produced `dist/`.

## Result and remaining work

Verdict: **FAIL**. Blocking findings are:

- the first mobile screen does not identify the intended audience;
- “Try an example” writes to the real storage namespace and is not an isolated,
  ready-to-play demo;
- `.factory/claims.json` and all required claim tests are absent; and
- bad routes render the landing page instead of a designed 404.

The review also records exact copy audit results, unlisted claims, route
title/focus, metadata, and site-shell findings with concrete fixes. After the
fixes, add and run every claims-manifest command from a fresh clone through the
isolated `/demo` entry point, then repeat the live review.
