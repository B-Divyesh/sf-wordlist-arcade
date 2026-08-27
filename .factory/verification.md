# Independent verification — FAIL

**Verifier:** `wordlist-arcade-verify-1`  
**Candidate:** `fb62efb34f1ebc563b8683e4b51298259257c664` on `main`  
**Date:** 2026-08-27  
**Verdict:** **FAIL — do not release unchanged.** Two playable game screens have axe **serious** violations, failing the non-negotiable accessibility gate.

This was independently tested against the checked-out candidate and live deployment; the prior handoff was not used as evidence. No product code was changed.

## Evidence

- Ran `npm ci` (99 packages; audit: 0 vulnerabilities), installed the declared Playwright Chromium browser, then ran `npm test` and `npm run build`. Unit suite: **8/8 passed**. Browser suite: **11 passed, 1 intentional desktop-only skip**, 42.2 s. `dist/` was produced.
- Independent Playwright completion runs reached **“Round complete!”** in every game from the same 3-pair list (Match up, Word strike, Anagram lab, Word reveal, Memory grid, Quiz race), and from the same 30-pair list (Match up: 8 displayed pairs; Word strike: 30 turns; Anagram: 30; Reveal: 30; Memory: 6 displayed pairs; Race: 5).
- Live/candidate parity: root SHA-256 `7f4b7352…deece`; JS `52e89af4…15663b3d`; CSS `f8c9e856…a84ddb9`; mobile hero `d86df246…e1c53d393`; `sw.js` and manifest also byte-match the local build.
- Budgets: JS 27,001 B raw / 9,276 B gzip; CSS 13,494 B raw / 3,820 B gzip; mobile hero 17,240 B. All pass stated size budgets. Lighthouse mobile live root: Performance **99**, Accessibility **100**, FCP 0.9 s, LCP 1.2 s, CLS 0, TBT 110 ms. Lighthouse emitted a post-report Chrome-tab crash but wrote complete JSON; it is not used to override axe.
- Parsing: malformed and duplicate input yielded `Line 2 repeats “CAT”. 3 valid pairs found.` Valid `猫`, `árbol`, and `مرحبا` pairs played. Local draft survived reload. Compressed direct game links reload; `d=bad` returns to maker with damaged-link toast.
- Instrumented live browser: no request URL or payload contained a sentinel vocabulary value, and no non-GET app request occurred. Hash data is not sent over HTTP.
- Keyboard: focused Quiz Race opens with Enter. Fullscreen handler invoked `documentElement.requestFullscreen()` (stub verified); headless Chromium does not grant actual fullscreen. At 390×844 all six game starts had 0 px horizontal overflow; reduced-motion transition duration was `1e-05s`.
- Live PWA: after online visit, service worker registration and `wordlist-arcade-v1` cache existed. With context offline, reload retained page/h1 and displayed offline banner; console errors were empty.
- `/privacy/` and `/terms/`: 200, title, one h1, main landmark, no console errors, and no axe serious/critical findings. Live root/assets have HSTS, nosniff, no-referrer, and declared Permissions-Policy.

## Defects

### High — release blocker

1. **Axe serious ARIA errors in two game screens.**
   - Word Reveal: `.word-rail` is a plain `div` with `aria-label="Word: partly hidden"`.
   - Quiz Race: `.race-track` is a plain `div` with `aria-label="Race progress: 0 of 3"`.
   Axe 4.13 reports `aria-prohibited-attr` / serious: an `aria-label` is not permitted on a div with no valid role. This fails the explicit serious/critical gate.

### Medium

1. **URL limit risk.** A valid 30-pair, max-length low-compressibility list produced a 5,922-character encoded payload / 5,972-character full URL. No budget/warning/fallback exists; this exceeds common 2,048-character LMS/email limits.
2. **PWA contract incomplete.** Manifest has only an SVG favicon rather than 192/512 raster maskable icons, `start_url` is `/` rather than versioned query URL, and service worker has no update-available toast. Offline reload passes.
3. **Security/cache hardening incomplete.** Live responses lack `Content-Security-Policy` and `X-Frame-Options`/`frame-ancestors`; hashed JS has `Cache-Control: public, must-revalidate, max-age=30`, not immutable caching.

### Low

1. Actual fullscreen/projector display could not be confirmed in headless Chromium; test it on physical classroom hardware.

## Required disposition

Fix the two high-severity ARIA violations and rerun axe across every game state. Reassess the medium issues. Until then the candidate is **FAIL**.
