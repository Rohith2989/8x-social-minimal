import { test, expect } from '@playwright/test';

test('archived day-to-day concept keeps media geometry fixed while details change', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/concepts/day-to-day/');
  await expect(page.locator('#day-to-day')).toHaveCount(1);
  await expect(page.locator('#day-to-day')).toHaveCSS('background-color', 'rgb(244, 246, 250)');
  const image = page.locator('.day-film');
  await image.scrollIntoViewIfNeeded();
  const before = await image.boundingBox();
  const canvas = page.locator('.raster-rim');
  await image.hover();
  const frame = await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await page.waitForTimeout(300);
  expect(await canvas.evaluate((el: HTMLCanvasElement) => el.toDataURL())).toBe(frame);
  await page.getByRole('button', { name: 'Keep content moving.' }).click();
  await expect(page.getByText('Briefs, reviews and publishing. Kept moving by 8x.')).toBeVisible();
  const after = await image.boundingBox();
  expect(after?.width).toBe(before?.width);
  expect(after?.height).toBe(before?.height);
  expect(after?.x).toBe(before?.x);
  await page.getByRole('button', { name: 'Play creator example', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause creator example', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Pause creator example', exact: true }).click();
  await page.screenshot({ path: 'docs/qa/day-to-day-desktop.png' });
  expect(errors).toEqual([]);
});

test('stone concept supports reduced motion and narrow screens', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/concepts/day-to-day/#day-to-day');
  await page.locator('.day-film').scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.raster-rim').evaluate((el: HTMLCanvasElement) => el.width)).toBeGreaterThan(0);
  const frame = await page.locator('.raster-rim').evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await page.getByRole('button', { name: 'See what works.' }).click();
  await expect(page.getByText('Content tracking and performance reporting, brought together.')).toBeVisible();
  expect(await page.locator('.raster-rim').evaluate((el: HTMLCanvasElement) => el.toDataURL())).toBe(frame);
  expect(await page.locator('.day-film video').evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'docs/qa/day-to-day-mobile.png' });
});
