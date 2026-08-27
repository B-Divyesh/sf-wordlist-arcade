import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const list = `photosynthesis — how plants use light to make food
habitat — the natural home of a plant or animal
nocturnal — active during the night
adaptation — a feature that helps a living thing survive
predator — an animal that hunts other animals
camouflage — colors or shapes that help something hide`;

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
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
  expect(errors, `console errors in ${testInfo.project.name}`).toEqual([]);
});

test('a pasted list unlocks and opens all six games', async ({ page }) => {
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
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
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
