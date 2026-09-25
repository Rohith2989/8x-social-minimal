import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

if (process.env.DASHBOARD_TEST_URL) test.use({ baseURL: process.env.DASHBOARD_TEST_URL });

test('overview filters, keyboard chart, custom dates and refresh keep one reporting context', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/dashboard');
  await expect(page.getByTestId('total-views')).toHaveText('2.40M');
  await page.locator('#chart-platform-panel').count();
  await page.getByRole('button', { name: 'All platforms', exact: true }).click();
  await page.locator('#chart-platform-panel').getByRole('checkbox', { name: 'Instagram', exact: true }).uncheck();
  await expect(page.getByTestId('total-views')).toHaveText('1.50M');
  await page.getByRole('button', { name: 'Daily', exact: true }).click();
  await page.getByRole('button', { name: 'Cumulative', exact: true }).click();
  const chart = page.getByRole('group', { name: /Cumulative views chart/ });
  await chart.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.ds-chart-wrap .ds-sr')).toContainText('1.50M');
  await page.getByRole('button', { name: 'Choose reporting dates' }).click();
  await page.getByRole('button', { name: 'September 11', exact: true }).click();
  await page.getByRole('button', { name: 'September 18', exact: true }).click();
  await page.getByRole('button', { name: 'Apply dates' }).click();
  await expect(page).toHaveURL(/from=11&to=18/);
  const value = await page.getByTestId('total-views').textContent();
  await page.reload();
  await expect(page.getByTestId('total-views')).toHaveText(value!);
  await expect(page.getByRole('button', { name: 'Custom', exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('post search retains focus and CSV contains every filtered record, not only the current page', async ({ page }) => {
  await page.goto('/dashboard?tab=posts');
  const search = page.getByRole('searchbox', { name: 'Search posts' });
  await search.pressSequentially('lena', { delay: 20 });
  await expect(search).toBeFocused();
  await expect(page.locator('.ds-table tbody tr')).toHaveCount(11);
  await search.fill('');
  await page.getByRole('button', { name: 'All platforms', exact: true }).click();
  await page.locator('#list-platform-panel').getByRole('checkbox', { name: 'TikTok', exact: true }).uncheck();
  await expect(page.locator('.ds-pagination')).toContainText('of 88 posts');
  await page.getByRole('button', { name: 'Export report' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  const file = await download;
  const csv = await readFile((await file.path())!, 'utf8');
  const rows = csv.split('\r\n').slice(2);
  expect(rows).toHaveLength(88);
  expect(rows.every(row => row.includes('"Instagram"'))).toBeTruthy();
  const views = rows.reduce((sum, row) => sum + Number(row.split(',')[4].replaceAll('"', '')), 0);
  expect(views).toBe(900000);
});

test('real local video plays and dialogs return keyboard focus', async ({ page }) => {
  await page.goto('/dashboard');
  const card = page.locator('.ds-post-card').first();
  await card.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const video = dialog.locator('video');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 12000 }).toBeGreaterThan(.1);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(card).toBeFocused();
  await page.goto('/dashboard?post=MX-0001');
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('all dashboard destinations are populated and local team interactions work', async ({ page }) => {
  await page.goto('/dashboard');
  const nav = page.getByRole('navigation', { name: 'Dashboard sections' });
  await expect(nav.locator('a:not(.ds-raster-button)')).toHaveCount(0);
  for (const name of ['Creators', 'Posts', 'Feed', 'Content plan', 'Analytics', 'Team']) {
    await nav.getByRole('link', { name: new RegExp(name) }).click();
    await expect(page.getByRole('heading', { name, exact: true, level: 1 })).toBeVisible();
    await expect(page.locator('.ds-app button:not(.ds-raster-button):not(.ds-current-button)')).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Invite member' }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Demo Reviewer');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('reviewer@example.com');
  await page.getByRole('button', { name: 'Add demo invitation' }).click();
  await expect(page.locator('.ds-member').filter({ hasText: 'Demo Reviewer' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Analytics', exact: true, level: 1 })).toBeVisible();
});

test('current buttons preserve geometry, finish export, and respect reduced motion', async ({ page }) => {
  await page.goto('/dashboard');
  const action = page.getByRole('button', { name: 'Export report', exact: true });
  const before = await action.boundingBox();
  expect(await action.locator('.ds-raster-motion').evaluate(el => getComputedStyle(el).transitionDuration)).toBe('1.15s');
  await action.hover();
  await expect.poll(() => action.locator('.ds-raster-motion').evaluate(el => new DOMMatrix(getComputedStyle(el).transform).m41)).toBeLessThan(0);
  expect(await action.boundingBox()).toEqual(before);
  await action.focus();
  await page.keyboard.press('Enter');
  const downloadButton = page.getByRole('button', { name: 'Download CSV', exact: true });
  // Measure layout dimensions, independent of the dialog's entrance transform.
  const initialSize = await downloadButton.evaluate(el => [el.clientWidth, el.clientHeight]);
  const download = page.waitForEvent('download');
  await downloadButton.click();
  await download;
  const ready = page.getByRole('button', { name: /Report ready/ });
  await expect(ready).toHaveAttribute('data-phase', 'ready');
  const readySize = await ready.evaluate(el => [el.clientWidth, el.clientHeight]);
  expect(readySize).toEqual(initialSize);
  await page.keyboard.press('Escape');
  await expect(action).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const transition = await action.locator('.ds-raster-motion').evaluate(el => getComputedStyle(el).transitionDuration);
  expect(transition).toBe('0s');
});

for (const [width, height] of [[1920, 1080], [1440, 900], [2560, 1440], [768, 1024], [390, 844]]) {
  test(`responsive overview ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/dashboard');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('.ds-post-card')).toHaveCount(8);
    await expect.poll(() => page.evaluate(() => [...document.images].every(img => img.complete && img.naturalWidth > 0))).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width <= 850) {
      await expect(page.locator('.ds-sidebar')).toBeHidden();
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(page.locator('.ds-sidebar')).toBeVisible();
      await page.getByRole('navigation', { name: 'Dashboard sections' }).getByRole('link', { name: /Creators/ }).click();
      await expect(page.getByRole('heading', { name: 'Creators', exact: true })).toBeVisible();
      await page.goto('/dashboard');
    }
    await page.screenshot({ path: `docs/qa/dashboard-${width}.png`, fullPage: true });
  });
}
