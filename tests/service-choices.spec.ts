import { test, expect, type Page } from '@playwright/test';

async function load(page: Page) {
  await page.goto('/#services');
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator('[data-hand=self]')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-ready', 'true');
}
async function arrive(page: Page, index?: number) {
  await page.evaluate(index => {
    const root = document.querySelector<HTMLElement>('#services')!;
    const target = index === undefined ? root : root.querySelectorAll('.service-option-track')[index];
    const top = parseFloat(root.style.getPropertyValue('--service-top'));
    scrollTo({ top: scrollY + target.getBoundingClientRect().top - top, behavior: 'instant' });
  }, index);
}

test('hands loop offscreen and on return without restarting or holding navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await load(page);
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  const root = page.locator('#services');
  await expect(root).toHaveAttribute('data-playback', 'looping');
  // Both canvases must actually change through a whole cycle while offscreen.
  const samples = await page.evaluate(async () => {
    const seen = [new Set<string>(), new Set<string>()];
    const images = [new Set<string>(), new Set<string>()];
    const sample = document.createElement('canvas'); sample.width = 32; sample.height = 20;
    const context = sample.getContext('2d')!;
    const end = performance.now() + 9000;
    while (performance.now() < end) {
      document.querySelectorAll<HTMLElement>('.service-stage').forEach((el, index) => {
        seen[index].add(el.dataset.pose!);
        context.clearRect(0, 0, 32, 20);
        context.drawImage(el.querySelector('canvas')!, 0, 0, 32, 20);
        images[index].add(sample.toDataURL());
      });
      await new Promise(requestAnimationFrame);
    }
    return { poses: seen.map(s => s.size), images: images.map(s => s.size) };
  });
  expect(samples.poses.every(n => n === 8)).toBe(true);
  expect(samples.images.every(n => n >= 8)).toBe(true);
  // Entry/exit must not reset either frame within the same animation task.
  expect(await page.evaluate(() => {
    const poses = () => [...document.querySelectorAll<HTMLElement>('.service-stage')].map(el => el.dataset.pose).join(',');
    const before = poses();
    document.querySelector('#services')!.scrollIntoView();
    dispatchEvent(new Event('scroll'));
    return before === poses();
  })).toBe(true);
  await arrive(page);
  const y = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 450);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 200);
  await page.keyboard.press('PageUp');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(y + 200);
  await expect(root).toHaveAttribute('data-playback', 'looping');
  expect(errors).toEqual([]);
});

test('desktop and mobile compositions keep content and CTAs inside the viewport', async ({ page }) => {
  await load(page);
  for (const [width, height] of [[320,568],[390,844],[700,900],[768,1024],[1366,768],[1920,1080],[2560,1440]]) {
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width, height });
    const stacked = width < 760;
    await expect(page.locator('#services')).toHaveAttribute('data-layout', stacked ? 'stacked' : 'desktop');
    for (const index of stacked ? [0,1] : [0]) {
      await page.keyboard.press('Escape');
      await arrive(page, stacked ? index : undefined);
      const panel = page.locator(stacked ? '.service-option' : '.service-inner').nth(index);
      const box = await panel.boundingBox();
      const nav = await page.locator('.site-header').boundingBox();
      expect(box!.y).toBeGreaterThanOrEqual(nav!.height - 1);
      expect(box!.y + box!.height).toBeLessThanOrEqual(height + 1);
      const ctas = stacked ? panel.locator('.service-details a') : page.locator('.service-details a');
      for (const cta of await ctas.all()) {
        const bounds = await cta.boundingBox();
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(height + 1);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([390,1920,2560].includes(width)) await page.screenshot({ path: 'docs/qa/services-auto-' + width + '.png' });
  }
});

test('reduced motion, unavailable artwork and no JavaScript never trap scrolling', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await load(page);
  await expect(page.locator('#services')).toHaveAttribute('data-playback', 'static');
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-pose', '7');
  const still = await page.locator('[data-hand=full] canvas').evaluate(el => (el as HTMLCanvasElement).toDataURL());
  await page.waitForTimeout(250);
  expect(await page.locator('[data-hand=full] canvas').evaluate(el => (el as HTMLCanvasElement).toDataURL())).toBe(still);
  await expect(page.locator('.service-inner')).toHaveCSS('position', 'static');
  expect(await page.locator('#services').evaluate(el => (el as HTMLElement).style.height)).toBe('');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.route('**/media/service-hands/*.webp', route => route.abort());
  await page.reload(); await arrive(page);
  await expect(page.locator('#services')).not.toHaveAttribute('data-ready', 'true');
  const y = await page.evaluate(() => scrollY); await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 200);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage(); await staticPage.goto('/#services');
  await expect(staticPage.locator('.service-still')).toHaveCount(2);
  await expect(staticPage.locator('.service-still').first()).toBeVisible();
  await expect(staticPage.locator('.service-inner')).toHaveCSS('position', 'static');
  await context.close();
});
