import { test, expect } from '@playwright/test';

test('hero edge breathes gently without moving the photo and pauses offscreen', async ({ page }) => {
  await page.goto('/');
  const edge = page.locator('.hero-raster-edge');
  await expect(edge).toHaveAttribute('data-ready', 'true');
  await expect(edge).toHaveAttribute('data-active', 'true');
  const image = page.locator('.hero-portrait img');
  const before = await image.boundingBox();
  const layers = edge.locator('path');
  await expect(layers.first()).toHaveCSS('animation-play-state', 'running');
  const start = await layers.first().evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(900);
  const finish = await layers.first().evaluate(el => {
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return { transform: getComputedStyle(el).transform, displacement: Math.hypot(m.m41,m.m42) };
  });
  expect(finish.transform).not.toBe(start);
  expect(finish.displacement).toBeLessThan(1);
  expect(await image.boundingBox()).toEqual(before);
  await page.locator('#comparison').scrollIntoViewIfNeeded();
  await expect(edge).toHaveAttribute('data-active', 'false');
  await expect(layers.first()).toHaveCSS('animation-play-state', 'paused');
  await image.scrollIntoViewIfNeeded();
  await expect(edge).toHaveAttribute('data-active', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(edge).toHaveAttribute('data-active', 'false');
  await expect(layers.first()).toHaveCSS('animation-name', 'none');
  await expect(layers.first()).toHaveCSS('transform', 'none');
  expect(await layers.first().getAttribute('d')).toContain('a');
});
