import { test, expect } from '@playwright/test';

for (const [width, height] of [[1920, 1080], [1440, 720], [390, 844]]) test(`compact export fits without internal scrolling at ${width}x${height}`, async ({ page }) => {
  await page.setViewportSize({ width, height });
  await page.goto('/dashboard');
  expect(await page.locator('html').evaluate(el => getComputedStyle(el, '::-webkit-scrollbar-thumb').backgroundColor)).toBe('rgb(50, 88, 223)');
  await page.getByRole('button', { name: 'Export report', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('[data-raster-layout=dialog]')).toHaveAttribute('data-raster-phase', 'ready');
  expect(await dialog.evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: `docs/qa/scroll-export-${width}.png` });
});

test('short-window activity list scrolls while its heading and action stay visible', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 500 });
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Notifications', exact: true }).click();
  const panel = page.locator('#notifications-panel'), list = panel.locator('.ds-activity-list');
  await expect.poll(() => panel.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  const box = await panel.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(500);
  expect(await list.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await list.hover(); await page.mouse.wheel(0, 240);
  await expect.poll(() => list.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await expect(panel.getByRole('heading', { name: 'Activity', exact: true })).toBeVisible();
  await expect(panel.getByRole('button', { name: 'View all activity' })).toBeInViewport();
  await page.screenshot({ path: 'docs/qa/scroll-activity-short.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Notifications', exact: true })).toBeFocused();
});

for (const [tab, selector] of [['creators', '.ds-ledger-scroll'], ['posts', '.ds-table-scroll']]) test(`${tab} table uses native horizontal keyboard scrolling`, async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 850 });
  await page.goto(`/dashboard?tab=${tab}`);
  const scroll = page.locator(selector);
  await scroll.focus(); await page.keyboard.press('ArrowRight');
  await expect.poll(() => scroll.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await scroll.evaluate(el => getComputedStyle(el, '::-webkit-scrollbar').height)).toBe('14px');
  await page.screenshot({ path: `docs/qa/scroll-table-${tab}.png` });
});

test('long dialog keeps its close control reachable in a short phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 520 });
  await page.goto('/dashboard?tab=plan');
  await page.getByRole('button', { name: 'Read the full brief' }).click();
  const dialog = page.getByRole('dialog');
  expect(await dialog.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await dialog.evaluate(el => { el.scrollTop = el.scrollHeight; });
  await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeInViewport();
  await expect(dialog.getByRole('button', { name: 'Back to the workspace' })).toBeInViewport();
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  await expect(dialog).toHaveCount(0);
});
