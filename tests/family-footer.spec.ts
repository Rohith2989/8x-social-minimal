import { test, expect, type Page } from '@playwright/test';

async function position(page: Page, p: number) {
  await page.locator('#family').evaluate((el, progress) => {
    const style = getComputedStyle(el), top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top - parseFloat(style.getPropertyValue('--family-top')) + parseFloat(style.getPropertyValue('--family-distance')) * progress, behavior: 'instant' });
  }, p);
  await expect.poll(async () => Math.abs(Number(await page.locator('#family').getAttribute('data-progress')) - p)).toBeLessThan(.005);
  await expect(page.locator('#family')).toHaveAttribute('data-running', 'false');
}

test('scroll reveals a real transformation, stable products and a separate stone footer', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#family');
  const journey = page.locator('#family');
  await expect(journey).toHaveAttribute('data-pinned', 'true');
  await expect(page.locator('.family-ending')).toHaveCSS('background-color', 'rgb(233, 229, 220)');
  const images: string[] = [];
  let productY = 0;
  for (const [name, progress] of [['original', 0], ['lift', .24], ['turn', .5], ['impression', .735], ['infinity', .94]] as const) {
    await position(page, progress);
    const bounds = await page.locator('.family-directory').boundingBox();
    if (name === 'original') productY = bounds!.y;
    else expect(Math.abs(bounds!.y - productY)).toBeLessThan(1);
    images.push(await page.locator('.family-art>svg').evaluate(el => el.outerHTML));
    await page.screenshot({ path: `docs/qa/footer-v3-${name}.png` });
  }
  expect(new Set(images).size).toBe(5);
  await expect(journey).toHaveAttribute('data-running', 'false');
  await position(page, .5);
  expect(await page.locator('.family-art>svg').evaluate(el => el.outerHTML)).toBe(images[2]);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.getByRole('contentinfo', { name: '8x Social footer' })).toBeVisible();
  await expect(page.locator('#contact').getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', 'https://www.8x.social/en/book-call');
  await expect(page.locator('.site-header')).toHaveAttribute('data-ending', 'true');
  await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(233, 229, 220)');
  expect(await page.locator('.family-directory li').count()).toBe(5);
  expect(await page.locator('.family-directory a').count()).toBe(2);
  await expect(journey).toHaveAttribute('data-running', 'false');
  await page.screenshot({ path: 'docs/qa/footer-v3-contact.png' });
  expect(errors).toEqual([]);
});

test('scroll animation waits at rest and returns to the original mark when scrolling back', async ({ page }) => {
  await page.goto('/#family');
  const root = page.locator('#family');
  await expect(root).toHaveAttribute('data-ready', 'true');
  await position(page, .25);
  await expect(root).toHaveAttribute('data-running', 'false');
  const frame = await page.locator('.family-art>svg').evaluate(el => el.outerHTML);
  await page.waitForTimeout(500);
  expect(await page.locator('.family-art>svg').evaluate(el => el.outerHTML)).toBe(frame);
  await position(page, .84); await expect(root).toHaveAttribute('data-phase', 'settled');
  const settled = await page.locator('.family-art>svg').evaluate(el => el.outerHTML);
  await position(page, 1); await expect(root).toHaveAttribute('data-phase', 'settled');
  // The last reading interval holds the approved print, without late sinking.
  expect(await page.locator('.family-art>svg').evaluate(el => el.outerHTML)).toBe(settled);
  await position(page, 0); await expect(root).toHaveAttribute('data-phase', 'original');
});

test('layered print keeps every dot fixed and finishes at the bottom of a tall window', async ({ page }) => {
  await page.setViewportSize({width:1226,height:1302}); await page.goto('/#family');
  const root=page.locator('#family'); await expect(root).toHaveAttribute('data-ready','true');
  const dots=page.locator('.family-print-layer');
  const geometry=await dots.innerHTML();
  await position(page,.74);
  expect(await dots.innerHTML()).toBe(geometry);
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
  await expect(root).toHaveAttribute('data-phase','settled');
  await expect(root).toHaveAttribute('data-running','false');
  await expect(page.locator('#contact').getByRole('link',{name:'Privacy'})).toBeInViewport();
  expect(await dots.innerHTML()).toBe(geometry);
});

test('footer remains readable on phones, reduced motion and without scripts', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#family');
  await expect(page.locator('#family')).toHaveAttribute('data-pinned', 'false');
  await expect(page.locator('#family')).toHaveAttribute('data-phase', 'settled');
  await expect(page.locator('#family')).toHaveAttribute('data-running', 'false');
  await page.screenshot({ path: 'docs/qa/footer-v3-mobile.png' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact').getByRole('link', { name: 'Privacy' })).toBeVisible();
  await page.screenshot({ path: 'docs/qa/footer-v3-mobile-contact.png' });
  for (const width of [320, 768, 1024, 1920, 2558]) {
    await page.setViewportSize({ width, height: 1080 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await context.newPage(); await fallback.goto('http://127.0.0.1:3091/#family');
  await expect(fallback.locator('.family-fallback')).toBeVisible();
  await expect(fallback.getByRole('link', { name: '8x Careers', exact: true })).toBeVisible();
  await context.close();
});
