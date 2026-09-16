import { test, expect } from '@playwright/test';

test('hero shows the whole portrait frame on common desktop and tablet viewports', async ({ page }) => {
  for (const [width, height] of [[1920,1080],[2560,1440],[1440,900],[1366,768],[1280,720],[1024,768],[768,1024]]) {
    await page.setViewportSize({ width, height }); await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.hero-portrait img').evaluate((img: HTMLImageElement) => img.decode());
    const geometry = await page.locator('.hero-portrait img').evaluate((img: HTMLImageElement) => {
      const r = img.getBoundingClientRect(), hero = document.querySelector('.hero')!.getBoundingClientRect();
      return {top:r.top,bottom:r.bottom,height:r.height,width:r.width,ratio:img.naturalWidth/img.naturalHeight,heroBottom:hero.bottom};
    });
    expect(geometry.bottom, `complete portrait at ${width}×${height}`).toBeLessThanOrEqual(height+1);
    expect(geometry.top).toBeGreaterThan(100);
    expect(geometry.height).toBeGreaterThan(height*.34);
    expect(Math.abs(geometry.width/geometry.height-geometry.ratio)).toBeLessThan(.01);
    expect(geometry.heroBottom).toBeLessThanOrEqual(height+1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({path:`docs/qa/hero-${width}x${height}.png`});
  }
});

test('narrow and short screens preserve content and usable controls', async ({ page }) => {
  for (const [width,height] of [[320,568],[390,844],[430,932],[844,390]]) {
    await page.setViewportSize({width,height}); await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('.hero-cta')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const text=await page.locator('h1').boundingBox();
    expect(text!.x+text!.width).toBeLessThanOrEqual(width);
    await page.locator('.hero-portrait').scrollIntoViewIfNeeded();
    await expect(page.locator('.hero-portrait img')).toBeInViewport({ratio:.995});
    await page.screenshot({path:`docs/qa/hero-${width}x${height}.png`});
  }
});
