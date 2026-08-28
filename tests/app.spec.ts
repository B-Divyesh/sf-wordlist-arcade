import AxeBuilder from '@axe-core/playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const list = `photosynthesis — how plants use light to make food
habitat — the natural home of a plant or animal
nocturnal — active during the night
adaptation — a feature that helps a living thing survive
predator — an animal that hunts other animals
camouflage — colors or shapes that help something hide`;

const samplePairs = [
  ['photosynthesis', 'how plants use light to make food'],
  ['habitat', 'the natural home of a plant or animal'],
  ['nocturnal', 'active during the night'],
  ['adaptation', 'a feature that helps a living thing survive'],
  ['predator', 'an animal that hunts other animals'],
  ['camouflage', 'colors or shapes that help something hide']
] as const;

function answerForPrompt(prompt: string, pairs: ReadonlyArray<readonly [string, string]> = samplePairs): string {
  const pair = pairs.find(([, meaning]) => prompt.includes(meaning));
  if (!pair) throw new Error(`Could not find an answer for: ${prompt}`);
  return pair[0];
}

function maximumLowCompressibilityList(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let seed = 2463534242;
  const gibberish = (length: number) => Array.from({ length }, () => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return alphabet[(seed >>> 0) % alphabet.length];
  }).join('');
  return Array.from({ length: 30 }, () => `${gibberish(60)} — ${gibberish(180)}`).join('\n');
}

async function expectNoSeriousAxe(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
}

async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

async function expectTouchTargets(page: Page, selector = 'a:not(.skip):not(.skip-link), button'): Promise<void> {
  const failures = await page.locator(selector).evaluateAll(elements => elements
    .filter(element => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
    })
    .map(element => {
      const box = element.getBoundingClientRect();
      return { label: element.getAttribute('aria-label') || element.textContent?.trim(), width: box.width, height: box.height };
    })
    .filter(box => box.width < 44 || box.height < 44));
  expect(failures).toEqual([]);
}

test('landing page is accessible and has no console errors', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Wordlist Arcade/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('img')).toHaveAttribute('alt', /geometric machine/);
  await expect(page.getByRole('button', { name: 'Match up' })).toBeDisabled();
  await expectNoSeriousAxe(page);
  expect(errors, `console errors in ${testInfo.project.name}`).toEqual([]);
});

test('legal pages and the static 404 page keep the accessible site shell', async ({ page }) => {
  for (const [path, title, heading] of [
    ['/privacy/', 'Privacy — Wordlist Arcade', 'Privacy for Wordlist Arcade'],
    ['/terms/', 'Terms — Wordlist Arcade', 'Terms for using Wordlist Arcade'],
    ['/404.html', 'Page not found — Wordlist Arcade', 'This page was not found']
  ]) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Privacy' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms' }).first()).toBeVisible();
    await expectTouchTargets(page);
    await expectNoSeriousAxe(page);
  }
});

test('root, demo, legal, and 404 routes share one navigation and footer skeleton', async ({ page }) => {
  const normalize = (value: string | null) => (value || '').replace(/\s+/g, '');
  const expectedHeader = 'WordlistArcadeDemoMakeagamePrivacy';
  const expectedFooter = 'WordlistArcademakesclassroomvocabularygames.BuiltbyParamFactory·20260828-polish3-r3DemoPrivacyTerms';
  for (const path of ['/', '/?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    expect(normalize(await page.locator('header nav[aria-label="Main navigation"]').textContent())).toBe(expectedHeader);
    expect(normalize(await page.locator('footer.site-footer').textContent())).toBe(expectedFooter);
  }
  await page.goto('/?demo=1');
  expect(normalize(await page.locator('header nav[aria-label="Main navigation"]').textContent())).toBe(expectedHeader);
});

test('mobile controls meet the 44 pixel target on every site shell', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile target-size check');
  for (const path of ['/', '/?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expectTouchTargets(page);
  }
});

test('all six populated game states have no serious or critical axe findings', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('List name').fill('Living things');
  await page.getByLabel('Words and meanings').fill(list);
  await expect(page.getByText('6 pairs ready. Choose any game.')).toBeVisible();

  for (const name of ['Match up', 'Word strike', 'Anagram', 'Word reveal', 'Memory grid', 'Quiz race']) {
    await page.getByRole('button', { name }).click();
    await expect(page.locator('.game-title h1')).toHaveText(name);
    await expect(page.locator('#game-stage')).toBeVisible();
    expect(new URL(page.url()).pathname).toMatch(/^\/play\//);
    expect(new URL(page.url()).hash).toContain('d=');
    await expectNoSeriousAxe(page);
    await page.getByRole('button', { name: /Games/ }).click();
    await expect(page.getByText('6 pairs ready. Choose any game.')).toBeVisible();
  }
});

test('a match-up round can be completed end to end', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Words and meanings').fill(list);
  await page.getByRole('button', { name: 'Match up' }).click();
  const pairs = [
    ['photosynthesis', 'how plants use light to make food'],
    ['habitat', 'the natural home of a plant or animal'],
    ['nocturnal', 'active during the night'],
    ['adaptation', 'a feature that helps a living thing survive'],
    ['predator', 'an animal that hunts other animals'],
    ['camouflage', 'colors or shapes that help something hide']
  ];
  for (const [term, definition] of pairs) {
    await page.getByRole('button', { name: term, exact: true }).click();
    await page.getByRole('button', { name: definition, exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: 'Round complete!' })).toBeVisible();
  await expect(page.getByText(/Every pair found/)).toBeVisible();
});

test('input errors are announced and a damaged link recovers', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Words and meanings').fill('good — valid\nthis line is broken');
  await expect(page.locator('#parse-status')).toContainText('Line 2');
  await page.goto('/play/match#d=broken');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make six vocabulary games');
  await expect(page.locator('#toast')).toContainText('incomplete or damaged');
});

test('mobile layout does not overflow horizontally', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only layout check');
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page.locator('#share-game span')).toHaveText('Copy link');
  await expect(page.locator('#share-game span')).toBeVisible();
  await expect(page.locator('#fullscreen span')).toHaveText('Fullscreen');
  await expect(page.locator('#fullscreen span')).toBeVisible();
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Memory grid' }).click();
  await expect(page.locator('.memory-grid')).toBeVisible();
  const gameOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(gameOverflow).toBeLessThanOrEqual(1);
  await expectNoSeriousAxe(page);
});

test('the production shell works offline after the first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make six vocabulary games');
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.locator('#offline-banner')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:long-class-link keeps the exact 30-pair boundary copyable and restores every row', async ({ page, browser }) => {
  const longList = maximumLowCompressibilityList();
  await page.goto('/');
  await page.getByLabel('List name').fill('Maximum boundary lesson');
  await page.getByLabel('Words and meanings').fill(longList);
  await expect(page.getByText('30 pairs ready. Choose any game.')).toBeVisible();
  await expect(page.getByText(/complete class link is .*characters/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy class link' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Download lesson file' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Quiz race' })).toBeEnabled();

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy class link' }).click();
  const classLink = await page.evaluate(() => navigator.clipboard.readText());
  expect(classLink.length).toBeGreaterThan(1900);

  const linkedContext = await browser.newContext();
  const linkedPage = await linkedContext.newPage();
  try {
    await linkedPage.goto(classLink);
    await expect(linkedPage.locator('.game-title h1')).toHaveText('Match up');
    await linkedPage.getByRole('button', { name: /Games/ }).click();
    await expect(linkedPage.getByLabel('List name')).toHaveValue('Maximum boundary lesson');
    await expect(linkedPage.getByLabel('Words and meanings')).toHaveValue(longList);
    expect((await linkedPage.getByLabel('Words and meanings').inputValue()).split('\n')).toHaveLength(30);
  } finally {
    await linkedContext.close();
  }

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download lesson file' }).click();
  const download = await downloadPromise;
  const artifactPath = await download.path();
  expect(artifactPath).not.toBeNull();

  const importedContext = await browser.newContext();
  const importedPage = await importedContext.newPage();
  try {
    await importedPage.goto('/');
    await importedPage.locator('#lesson-file').setInputFiles(artifactPath!);
    await expect(importedPage.getByText('Lesson imported: 30 pairs are ready to play.')).toBeVisible();
    await expect(importedPage.getByLabel('List name')).toHaveValue('Maximum boundary lesson');
    await expect(importedPage.getByLabel('Words and meanings')).toHaveValue(longList);
  } finally {
    await importedContext.close();
  }
});

test('built PWA files declare install icons, versioned startup, update control, and deployment headers', async ({ page }) => {
  await page.goto('/');
  const manifest = await (await page.request.get('/manifest.webmanifest')).json();
  expect(manifest.start_url).toContain('?v=20260828-polish3-r3');
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: '192x192', purpose: 'any' }),
    expect.objectContaining({ sizes: '512x512', purpose: 'any' }),
    expect.objectContaining({ sizes: '512x512', purpose: 'maskable' })
  ]));
  const worker = await (await page.request.get('/sw.js')).text();
  expect(worker).toContain("event.data?.type === 'SKIP_WAITING'");
  expect(worker).toContain("const VERSION = '20260828-polish3-r3'");
  const config = await (await page.request.get('/staticwebapp.config.json')).json();
  expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
  expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  expect(config.routes).toEqual(expect.arrayContaining([
    expect.objectContaining({ route: '/assets/*', headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } })
  ]));
});

test('a waiting service-worker update is offered and can be applied', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  const workerPath = resolve(process.cwd(), 'dist/sw.js');
  const worker = readFileSync(workerPath, 'utf8');
  try {
    writeFileSync(workerPath, `${worker}\n// Playwright forces a byte-different update.`);
    await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration())?.update(); });
    await expect(page.getByRole('button', { name: 'Update now' })).toBeVisible();
    await page.getByRole('button', { name: 'Update now' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Make six vocabulary games');
  } finally {
    writeFileSync(workerPath, worker);
  }
});

test('@claim:sample-demo opens a ready-to-play sample game', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveTitle('Demo — Wordlist Arcade');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Match up');
  await expect(page.locator('#game-stage')).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
});

test('@claim:six-games opens and uses all six games for a valid boundary list', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('pageerror', error => consoleErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  const boundaryPairs = [
    ['a'.repeat(60), 'first boundary meaning'],
    ['b'.repeat(60), 'second boundary meaning'],
    ['c'.repeat(60), 'third boundary meaning']
  ] as const;
  const boundaryList = boundaryPairs.map(([term, meaning]) => `${term} — ${meaning}`).join('\n');

  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByLabel('Words and meanings').fill(boundaryList);
  await expect(page.getByText('3 pairs ready. Choose any game.')).toBeVisible();

  for (const name of ['Match up', 'Word strike', 'Anagram', 'Word reveal', 'Memory grid', 'Quiz race'] as const) {
    await page.getByRole('button', { name }).click();
    await expect(page.locator('.game-title h1')).toHaveText(name);
    await expect(page.locator('#game-stage')).toBeVisible();

    if (name === 'Match up') {
      await page.locator('[data-side="term"]').first().click();
      await expect(page.getByText('Now choose from the other side.')).toBeVisible();
    }
    if (name === 'Word strike') {
      await page.locator('.choice').first().click();
      await expect(page.locator('.live-message')).not.toBeEmpty();
    }
    if (name === 'Anagram') {
      const answer = answerForPrompt(await page.locator('.prompt').textContent() || '', boundaryPairs);
      await page.getByLabel('Your answer').fill(answer);
      await page.getByRole('button', { name: 'Check word' }).click();
      await expect(page.getByText('Correct! Next word.')).toBeVisible();
    }
    if (name === 'Word reveal') {
      const answer = answerForPrompt(await page.locator('.prompt').textContent() || '', boundaryPairs);
      await page.getByLabel('Solve the whole word').fill(answer);
      await page.getByRole('button', { name: 'Solve' }).click();
      await expect(page.getByText('You solved the whole word!')).toBeVisible();
    }
    if (name === 'Memory grid') {
      await page.getByRole('button', { name: 'Hidden card' }).first().click();
      await expect(page.getByText('Choose one more card.')).toBeVisible();
    }
    if (name === 'Quiz race') {
      await page.locator('.choice').first().click();
      await expect(page.locator('.live-message')).not.toBeEmpty();
    }
    await page.getByRole('button', { name: /Games/ }).click();
  }

  expect(consoleErrors).toEqual([]);
});

test('@claim:match-up-play confirms a matching word and meaning', async ({ page }) => {
  await page.goto('/?demo=1');
  const term = await page.locator('[data-side="term"]').first().textContent();
  const definition = samplePairs.find(([word]) => word === term?.trim())?.[1];
  expect(definition).toBeTruthy();
  await page.getByRole('button', { name: term!.trim(), exact: true }).click();
  await page.getByRole('button', { name: definition!, exact: true }).click();
  await expect(page.getByText('That pair fits!')).toBeVisible();
});

test('@claim:word-strike-play confirms the right word before the next turn', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Word strike' }).click();
  const answer = answerForPrompt(await page.locator('.prompt').textContent() || '');
  await page.getByRole('button', { name: answer, exact: true }).click();
  await expect(page.getByText('Yes—that’s the one!')).toBeVisible();
});

test('@claim:anagram-play accepts the word for its displayed clue', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Anagram' }).click();
  const answer = answerForPrompt(await page.locator('.prompt').textContent() || '');
  await page.getByLabel('Your answer').fill(answer);
  await page.getByRole('button', { name: 'Check word' }).click();
  await expect(page.getByText('Correct! Next word.')).toBeVisible();
});

test('@claim:word-reveal-play reveals the solved word before six misses', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Word reveal' }).click();
  const answer = answerForPrompt(await page.locator('.prompt').textContent() || '');
  await page.getByLabel('Solve the whole word').fill(answer);
  await page.getByRole('button', { name: 'Solve' }).click();
  await expect(page.getByText('You solved the whole word!')).toBeVisible();
  await expect(page.getByText('Misses 0/6')).toBeVisible();
});

test('@claim:memory-play keeps a found word-and-meaning pair visible', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Memory grid' }).click();
  const first = page.getByRole('button', { name: 'Hidden card' }).first();
  const firstIndex = await first.getAttribute('data-index');
  await first.click();
  const visibleText = await page.locator(`.memory-card[data-index="${firstIndex}"]`).textContent();
  const matchedText = samplePairs.find(([term, meaning]) => visibleText?.includes(term) || visibleText?.includes(meaning));
  expect(matchedText).toBeTruthy();

  const cardIndexes = await page.locator('.memory-card').evaluateAll(cards => cards.map(card => card.getAttribute('data-index')));
  let found = false;
  for (const index of cardIndexes) {
    if (!index || index === firstIndex) continue;
    await page.locator(`.memory-card[data-index="${index}"]`).click();
    if (await page.getByText('A match! Those cards stay open.').isVisible().catch(() => false)) {
      found = true;
      break;
    }
    await page.waitForTimeout(850);
    await page.locator(`.memory-card[data-index="${firstIndex}"]`).click();
  }
  expect(found).toBe(true);
  await expect(page.locator('.memory-card.matched')).toHaveCount(2);
});

test('@claim:quiz-race-play has up to five questions and advances after an answer', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Quiz race' }).click();
  await expect(page.locator('.race-step')).toHaveCount(5);
  const answer = answerForPrompt(await page.locator('.prompt').textContent() || '');
  await page.getByRole('button', { name: answer, exact: true }).click();
  await expect(page.getByText('Correct—move one step!')).toBeVisible();
});

test('@claim:free-to-use has no paywall in the sample flow', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByText('Free to use')).toHaveCount(0);
  await expect(page.locator('[data-price], [data-paywall], iframe')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Match up');
});

test('@claim:no-account starts the sample with no account form', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.locator('input[type="email"], input[type="password"], [autocomplete="username"], [autocomplete="current-password"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Match up');
});

test('@claim:local-device keeps demo separate and makes no cross-origin requests', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('wordlist-arcade-draft', 'real — private');
    localStorage.setItem('wordlist-arcade-title', 'Private draft');
  });
  const before = await page.evaluate(() => ({ draft: localStorage.getItem('wordlist-arcade-draft'), title: localStorage.getItem('wordlist-arcade-title') }));
  await page.goto('/?demo=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Match up');
  const after = await page.evaluate(() => ({
    draft: localStorage.getItem('wordlist-arcade-draft'),
    title: localStorage.getItem('wordlist-arcade-title'),
    demoDraft: localStorage.getItem('demo:wordlist-arcade-draft')
  }));
  expect(after.draft).toBe(before.draft);
  expect(after.title).toBe(before.title);
  expect(after.demoDraft).toContain('photosynthesis');
  expect(requests.every(url => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test('@claim:pair-limit accepts up to 30 word pairs', async ({ page }) => {
  const thirtyOne = Array.from({ length: 31 }, (_, index) => `word${index + 1} — meaning${index + 1}`).join('\n');
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByLabel('Words and meanings').fill(thirtyOne);
  await expect(page.locator('#parse-status')).toContainText('Line 31 is beyond the 30-pair limit. 30 valid pairs found.');
  await expect(page.getByRole('button', { name: 'Quiz race' })).toBeEnabled();
});

test('@claim:list-check checks word pairs while they are typed', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByLabel('Words and meanings').fill('good — valid\nbroken row');
  await expect(page.locator('#parse-status')).toContainText('Line 2 needs a word and meaning');
});

test('@claim:class-link copies a playable class link with data after the hash', async ({ page, browser }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy class link' }).click();
  const link = await page.evaluate(() => navigator.clipboard.readText());
  const parsed = new URL(link);
  expect(parsed.pathname).toBe('/play/match');
  expect(parsed.hash).toMatch(/^#d=/);
  expect(parsed.search).toBe('?demo=1');
  const fresh = await browser.newContext();
  try {
    const linked = await fresh.newPage();
    await linked.goto(link);
    await expect(linked.getByRole('heading', { level: 1 })).toHaveText('Match up');
  } finally {
    await fresh.close();
  }
});

test('@claim:lesson-file restores every sample pair in a fresh context', async ({ page, browser }) => {
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download lesson file' }).click();
  const artifact = await downloadPromise;
  const artifactPath = await artifact.path();
  expect(artifactPath).not.toBeNull();
  const fresh = await browser.newContext();
  try {
    const imported = await fresh.newPage();
    await imported.goto('/?demo=1');
    await imported.getByRole('button', { name: /Games/ }).click();
    await imported.locator('#lesson-file').setInputFiles(artifactPath!);
    await expect(imported.getByLabel('Words and meanings')).toHaveValue(list);
    await expect(imported.getByLabel('List name')).toHaveValue('Photosynthesis practice');
  } finally {
    await fresh.close();
  }
});

test('@claim:fullscreen calls the browser fullscreen API from the sample game', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.evaluate(() => {
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: () => { document.documentElement.dataset.fullscreenRequested = 'true'; return Promise.resolve(); }
    });
  });
  await page.getByRole('button', { name: 'Enter fullscreen' }).click();
  await expect.poll(() => page.locator('html').getAttribute('data-fullscreen-requested')).toBe('true');
});

test('@claim:no-tracking keeps the whole sample flow first-party', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Quiz race' }).click();
  const origin = new URL(page.url()).origin;
  expect(requests.every(url => new URL(url).origin === origin)).toBe(true);
  await expect(page.locator('script[src^="http"], iframe, [src^="http"]')).toHaveCount(0);
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.every(key => key.startsWith('demo:'))).toBe(true);
});

test('@claim:no-cookies keeps the complete demo flow free of cookies and Set-Cookie headers', async ({ page, context }) => {
  const setCookieHeaders: string[] = [];
  page.on('response', response => {
    const setCookie = response.headers()['set-cookie'];
    if (setCookie) setCookieHeaders.push(setCookie);
  });
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('button', { name: 'Quiz race' }).click();
  const answer = answerForPrompt(await page.locator('.prompt').textContent() || '');
  await page.getByRole('button', { name: answer, exact: true }).click();
  expect(await context.cookies()).toEqual([]);
  expect(setCookieHeaders).toEqual([]);
});

test('@claim:offline-demo reloads after the first demo visit', async ({ page, context }) => {
  await page.goto('/?demo=1');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Match up');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await context.setOffline(false);
});

test('@claim:demo-discard reset stays isolated and Start for real removes every demo key', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('wordlist-arcade-draft', 'real — private');
    localStorage.setItem('wordlist-arcade-title', 'Private draft');
  });
  await page.goto('/?demo=1');
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByLabel('Words and meanings').fill('changed — value\nsecond — value\nthird — value');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Words and meanings')).toHaveValue(list);
  await page.getByRole('button', { name: 'Match up' }).click();
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  const storage = await page.evaluate(() => ({
    draft: localStorage.getItem('wordlist-arcade-draft'),
    title: localStorage.getItem('wordlist-arcade-title'),
    demoKeys: Object.keys(localStorage).filter(key => key.startsWith('demo:'))
  }));
  expect(storage.draft).toBe('real — private');
  expect(storage.title).toBe('Private draft');
  expect(storage.demoKeys).toEqual([]);
});

test('demo shell has zero axe violations and games include site navigation', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByRole('link', { name: 'Wordlist Arcade home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy' }).first()).toBeVisible();
  await expectNoAxeViolations(page);
  await page.getByRole('button', { name: /Games/ }).click();
  for (const name of ['Match up', 'Word strike', 'Anagram', 'Word reveal', 'Memory grid', 'Quiz race']) {
    await page.getByRole('button', { name }).click();
    await expectNoAxeViolations(page);
    await page.getByRole('button', { name: /Games/ }).click();
  }
});

test('demo reset, titles, focus, metadata, and the designed 404 route work', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/demo$/);
  await page.getByRole('button', { name: /Games/ }).click();
  await page.getByLabel('Words and meanings').fill('changed — value\nsecond — value\nthird — value');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Words and meanings')).toHaveValue(list);
  await page.getByRole('button', { name: 'Match up' }).click();
  await expect(page).toHaveTitle('Match up — Wordlist Arcade');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make six vocabulary games');
  await expect(page.locator('h1')).toBeFocused();
  const notFoundResponse = await page.goto('/not-a-real-route');
  await expect(page).toHaveTitle('Page not found — Wordlist Arcade');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page was not found');
  await expect(page.getByRole('link', { name: 'Go to Wordlist Arcade' })).toBeVisible();
  const expectedNotFoundOg = notFoundResponse?.status() === 404
    ? 'https://wordlist-arcade.sociobot.in/404'
    : `${new URL(page.url()).origin}/not-a-real-route`;
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', expectedNotFoundOg);
  await page.goto('/404.html');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://wordlist-arcade.sociobot.in/404');
});

test('starting for real discards sample state and game metadata has the matching canonical URL', async ({ page }) => {
  await page.goto('/?demo=1');
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByLabel('List name')).toHaveValue('My vocabulary');
  await expect(page.getByLabel('Words and meanings')).toHaveValue('');
  const storage = await page.evaluate(() => ({
    demoDraft: localStorage.getItem('demo:wordlist-arcade-draft'),
    demoTitle: localStorage.getItem('demo:wordlist-arcade-title')
  }));
  expect(storage.demoDraft).toBeNull();
  expect(storage.demoTitle).toBeNull();

  await page.getByLabel('Words and meanings').fill(list);
  await page.getByRole('button', { name: 'Match up' }).click();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/play\/match$/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /\/play\/match$/);
});
