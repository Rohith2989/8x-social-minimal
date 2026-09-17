import { test, expect } from '@playwright/test';

test('merged surface moves one light across real footage, limits playback, preserves manual pause', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/#showcase');
  const surface = page.locator('.video-surface');
  await expect(surface).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.day-grid, .reach-grid')).toHaveCount(0);
  await expect(surface.locator('video')).toHaveCount(18);
  await expect.poll(() => surface.locator('video').evaluateAll(vs => vs.filter(v => !(v as HTMLVideoElement).paused).length)).toBeGreaterThan(0);
  expect(await surface.locator('video').evaluateAll(vs => vs.filter(v => !(v as HTMLVideoElement).paused).length)).toBeLessThanOrEqual(4);
  expect(await surface.locator('video').evaluateAll(vs => vs.every(v => (v as HTMLVideoElement).muted))).toBe(true);
  const before = await surface.boundingBox();
  const oldX = Number(await surface.getAttribute('data-light-x'));
  await surface.hover({ position: { x: before!.width * .83, y: before!.height * .45 } });
  await expect.poll(async () => Number(await surface.getAttribute('data-light-x'))).toBeGreaterThan(oldX + .1);
  const after = await surface.boundingBox(); expect(after).toEqual(before);
  const running = surface.locator('.surface-cell[data-playing=true]').first();
  const label = await running.getAttribute('aria-label');
  // Keep one clip identity while the moving light changes which clips are playing.
  const clipIndex = Number(label!.match(/\d+$/)![0]) - 1;
  const selected = surface.locator('.surface-cell').nth(clipIndex);
  await selected.focus();
  await expect(selected).toHaveAttribute('data-playing', 'true');
  await selected.press('Enter');
  await expect(surface.getByRole('button', { name: label!.replace('Pause', 'Play'), exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/qa/video-surface-1920.png' });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => surface.locator('video').evaluateAll(vs => vs.every(v => (v as HTMLVideoElement).paused))).toBe(true);
  await surface.scrollIntoViewIfNeeded();
  await expect(surface.getByRole('button', { name: label!.replace('Pause', 'Play'), exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('reduced motion is static, deliberate play works, failed footage has an original link', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/media/showcase/5.mp4', route => route.abort());
  await page.goto('/#showcase');
  const surface = page.locator('.video-surface');
  await expect(surface).toHaveAttribute('data-ready', 'true');
  await expect.poll(() => surface.locator('.surface-poster').first().evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  expect(await surface.locator('video').evaluateAll(vs => vs.every(v => v.getAttribute('src') === null))).toBe(true);
  const x = await surface.getAttribute('data-light-x');
  await page.waitForTimeout(250);
  expect(await surface.getAttribute('data-light-x')).toBe(x);
  await surface.getByRole('button', { name: 'Play showcase clip 1', exact: true }).click();
  await expect(surface.getByRole('link', { name: 'Watch original clip 1', exact: true })).toBeVisible();
  await surface.getByRole('button', { name: 'Play showcase clip 2', exact: true }).click();
  await expect.poll(() => surface.locator('video').nth(1).evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0);
  await surface.locator('.surface-pause').focus();
  await page.keyboard.press('Enter');
  await expect.poll(() => surface.locator('video').evaluateAll(vs => vs.every(v => (v as HTMLVideoElement).paused))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('surface scales without clipping at phone, tablet, 1080p and 2K sizes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[320, 568], [390, 844], [768, 1024], [1920, 1080], [2560, 1440]]) {
    await page.setViewportSize({ width, height }); await page.goto('/#showcase');
    const surface = page.locator('.video-surface'); await expect(surface).toHaveAttribute('data-ready', 'true');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const box = await surface.boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    if (width === 390 || width === 2560) await page.screenshot({ path: `docs/qa/video-surface-${width}.png` });
  }
});
