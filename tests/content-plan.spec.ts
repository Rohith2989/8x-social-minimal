import { test, expect } from '@playwright/test';

test('creative directions retain their reference identity through filtering and review', async ({ page }) => {
  await page.goto('/dashboard?tab=plan');
  await expect(page.locator('.ds-direction-card')).toHaveCount(3);
  const third = page.locator('.ds-direction-card').filter({ hasText: 'A fresh perspective' });
  const poster = await third.locator('img').first().getAttribute('src');
  await third.getByRole('button', { name: 'Flag A fresh perspective', exact: true }).click();
  await page.getByRole('button', { name: 'Active', exact: true }).click();
  await page.locator('#plan-filter-panel').getByRole('button', { name: 'Flagged', exact: true }).click();
  await expect(page.locator('.ds-direction-card')).toHaveCount(1);
  await expect(third.locator('img').first()).toHaveAttribute('src', poster!);
  const play = third.getByRole('button', { name: 'Play reference for A fresh perspective' });
  await play.click();
  const video = page.getByRole('dialog').locator('video');
  await expect(video).toHaveAttribute('poster', poster!);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 12000 }).toBeGreaterThan(.1);
  await page.keyboard.press('Escape');
  await expect(play).toBeFocused();
  await third.getByRole('button', { name: 'Unflag A fresh perspective', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'All clear.' })).toBeVisible();
  await page.getByRole('button', { name: 'Flagged', exact: true }).click();
  await page.locator('#plan-filter-panel').getByRole('button', { name: 'Upcoming', exact: true }).click();
  await expect(page.locator('.ds-direction-card')).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'The follow-up', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Upcoming', exact: true }).click();
  await page.locator('#plan-filter-panel').getByRole('button', { name: 'Past', exact: true }).click();
  await expect(page.locator('.ds-direction-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'First impressions', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Read the full brief' }).click();
  await expect(page.getByRole('dialog')).toContainText('Vertical video, 15–45 seconds.');
});

for (const width of [2560, 1920, 1440, 768, 390]) {
  test(`creative board keeps full portraits and contained controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1080 });
    await page.goto('/dashboard?tab=plan');
    await expect(page.locator('.ds-direction-card')).toHaveCount(3);
    for (const img of await page.locator('.ds-direction-portrait>img').all()) {
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const box = await img.boundingBox();
      expect(box!.width / box!.height).toBeCloseTo(9 / 16, 2);
      expect(await img.evaluate(el => getComputedStyle(el).objectFit)).toBe('contain');
      expect(box!.width).toBeLessThanOrEqual(135);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await expect(page.locator('.ds-creative-plan button:not(.ds-raster-button):not(.ds-current-button)')).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.locator('.ds-brief-banner').evaluate(el => getComputedStyle(el, '::after').animationName)).toBe('none');
    await page.screenshot({ path: `docs/qa/content-plan-${width}.png`, fullPage: true });
  });
}
