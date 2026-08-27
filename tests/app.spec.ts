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

test('all six populated game states have no serious or critical axe findings', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('List name').fill('Living things');
  await page.getByLabel('Words and meanings').fill(list);
  await expect(page.getByText('6 pairs ready. Choose any game.')).toBeVisible();

  for (const name of ['Match up', 'Word strike', 'Anagram lab', 'Word reveal', 'Memory grid', 'Quiz race']) {
    await page.getByRole('button', { name }).click();
    await expect(page.locator('.game-title h1')).toHaveText(name);
    await expect(page.locator('#game-stage')).toBeVisible();
    expect(page.url()).toContain('#play/');
    expect(page.url()).toContain('?d=');
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
  await page.goto('/#play/match?d=broken');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Turn this week');
  await expect(page.locator('#toast')).toContainText('incomplete or damaged');
});

test('mobile layout does not overflow horizontally', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only layout check');
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Try an example' }).click();
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
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Turn this week');
  await page.evaluate(() => window.dispatchEvent(new Event('offline')));
  await expect(page.locator('#offline-banner')).toBeVisible();
  await context.setOffline(false);
});

test('the exact low-compressibility 30-pair boundary stays shareable and round-trips in fresh contexts', async ({ page, browser }) => {
  const longList = maximumLowCompressibilityList();
  await page.goto('/');
  await page.getByLabel('List name').fill('Maximum boundary lesson');
  await page.getByLabel('Words and meanings').fill(longList);
  await expect(page.getByText('30 pairs ready. Choose any game.')).toBeVisible();
  await expect(page.getByText(/complete class link is .*characters/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy class link' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Download lesson' })).toBeEnabled();
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
  } finally {
    await linkedContext.close();
  }

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download lesson' }).click();
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
  expect(manifest.start_url).toContain('?v=');
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: '192x192', purpose: 'any' }),
    expect.objectContaining({ sizes: '512x512', purpose: 'any' }),
    expect.objectContaining({ sizes: '512x512', purpose: 'maskable' })
  ]));
  const worker = await (await page.request.get('/sw.js')).text();
  expect(worker).toContain("event.data?.type === 'SKIP_WAITING'");
  expect(worker).toContain("const VERSION = '20260827-repair2'");
  const config = await (await page.request.get('/staticwebapp.config.json')).json();
  expect(config.globalHeaders['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  expect(config.globalHeaders['X-Frame-Options']).toBe('DENY');
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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Turn this week');
  } finally {
    writeFileSync(workerPath, worker);
  }
});
