import { test, expect } from '@playwright/test';

test('automatic dot pressure and central ink bloom settle without input and do not replay', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const art = page.locator('.feedback-dot-art'), quote = page.locator('.feedback-quote');
  await expect(art).toHaveAttribute('data-phase', 'waiting');
  await expect(quote).toHaveAttribute('data-phase', 'waiting');
  await page.evaluate(() => document.getElementById('partner-feedback')!.scrollIntoView());
  await expect(art).toHaveAttribute('data-phase', 'playing');
  await expect(quote).toHaveAttribute('data-phase', 'playing');
  const first = await art.locator('canvas').evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await expect.poll(() => art.locator('canvas').evaluate((el: HTMLCanvasElement) => el.toDataURL())).not.toBe(first);
  const ink = quote.locator('.feedback-ink');
  expect(await ink.evaluate(el => getComputedStyle(el).clipPath)).toContain('polygon');
  const difference = await quote.evaluate(el => {
    const a=el.querySelector(':scope > .feedback-words blockquote')!.getBoundingClientRect();
    const b=el.querySelector('.feedback-ink blockquote')!.getBoundingClientRect();
    return Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y),Math.abs(a.width-b.width),Math.abs(a.height-b.height));
  });
  expect(difference).toBeLessThan(.1);
  await expect(ink).toHaveAttribute('inert', '');
  await expect(quote.getByRole('blockquote')).toHaveCount(1);
  await page.screenshot({ path: 'docs/qa/feedback-bloom.png' });
  await expect(quote).toHaveAttribute('data-phase', 'settled');
  await expect(art).toHaveAttribute('data-phase', 'settled');
  await expect(ink).toHaveCSS('clip-path', 'none');
  const still = await art.locator('canvas').evaluate((el: HTMLCanvasElement) => el.toDataURL());
  await page.screenshot({ path: 'docs/qa/feedback-1920.png' });
  await page.evaluate(() => scrollTo(0,0));
  await page.evaluate(() => document.getElementById('partner-feedback')!.scrollIntoView());
  await expect(art).toHaveAttribute('data-phase', 'settled');
  expect(await art.locator('canvas').evaluate((el: HTMLCanvasElement) => el.toDataURL())).toBe(still);
});

test('stacked mobile quote starts independently and all supported viewports fit', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.evaluate(() => document.getElementById('partner-feedback')!.scrollIntoView());
  await expect(page.locator('.feedback-dot-art')).toHaveAttribute('data-phase', 'settled');
  await page.locator('.feedback-quote').scrollIntoViewIfNeeded();
  await expect(page.locator('.feedback-quote')).toHaveAttribute('data-phase', 'settled');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width,height] of [[320,568],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[2560,1440]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(() => document.getElementById('partner-feedback')!.scrollIntoView());
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const bounds = await page.locator('.feedback-quote').boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(width);
    if ([390,2560].includes(width)) await page.locator('#partner-feedback').screenshot({path:`docs/qa/feedback-${width}.png`});
  }
});

test('reduced motion and no JavaScript retain complete readable result and quote', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#partner-feedback');
  await expect(page.locator('.feedback-quote')).toHaveAttribute('data-phase', 'settled');
  await expect(page.locator('.feedback-dot-art')).toHaveAttribute('data-phase', 'settled');
  await expect(page.locator('.feedback-ink')).toHaveCSS('clip-path', 'none');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const nojs = await context.newPage();
  await nojs.goto('http://127.0.0.1:3091/#partner-feedback');
  await expect(nojs.locator('.feedback-dot-fallback')).toBeVisible();
  await expect(nojs.locator('.feedback-ink')).toHaveCSS('clip-path', 'none');
  await expect(nojs.getByRole('img', {name:'2.2 million campaign reach'})).toHaveCount(1);
  await expect(nojs.locator('.feedback-quote').getByRole('blockquote')).toHaveCount(1);
  await context.close();
});
