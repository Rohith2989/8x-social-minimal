import { test, expect, type Page } from '@playwright/test';

async function load(page: Page) {
  await page.goto('/#services');
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator('[data-hand=self]')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-ready', 'true');
}
async function seek(page: Page, progress: number, track?: number) {
  await page.evaluate(({ progress, track }) => {
    const root = document.querySelector<HTMLElement>('#services')!;
    const desktop = root.dataset.pin === 'desktop';
    const target = desktop ? root : root.querySelectorAll<HTMLElement>('.service-option-track')[track ?? 0];
    const panel = target.querySelector<HTMLElement>(desktop ? '.service-inner' : '.service-option')!;
    const top = parseFloat(root.style.getPropertyValue('--service-top'));
    const distance = target.offsetHeight - panel.offsetHeight;
    scrollTo({ top: scrollY + target.getBoundingClientRect().top - top + distance * progress, behavior: 'instant' });
  }, { progress, track });
  await expect.poll(async () => Number(await page.locator(track === undefined ? '#services' : '.service-option-track').nth(track ?? 0).getAttribute('data-progress'))).toBeCloseTo(Math.max(0, Math.min(1, progress)), 2);
}

test('desktop pins both choices, scrubs sequentially, holds, releases and reverses', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await load(page); await expect(page.locator('#services')).toHaveAttribute('data-pin', 'desktop');
  await seek(page, .1);
  const start = await page.locator('.service-inner').boundingBox();
  await seek(page, .2);
  await expect(page.locator('[data-hand=self]')).toHaveAttribute('data-pose', '3');
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-state', 'waiting');
  await page.screenshot({ path: 'docs/qa/services-pinned-tap.png' });
  await page.waitForTimeout(450);
  await expect(page.locator('[data-hand=self]')).toHaveAttribute('data-pose', '3');
  await seek(page, .44);
  await expect(page.locator('[data-hand=self]')).toHaveAttribute('data-state', 'held');
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-state', 'waiting');
  await seek(page, .62);
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-pose', '3');
  await page.screenshot({ path: 'docs/qa/services-pinned-conduct.png' });
  expect(await page.locator('.service-inner').boundingBox()).toEqual(start);
  expect((await page.locator('#reach-atlas').boundingBox())!.y).toBeGreaterThanOrEqual(1080);
  await seek(page, .94);
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-state', 'held');
  expect(await page.locator('.service-inner').boundingBox()).toEqual(start);
  await seek(page, 1.15);
  expect((await page.locator('.service-inner').boundingBox())!.y).toBeLessThan(start!.y - 100);
  expect((await page.locator('#reach-atlas').boundingBox())!.y).toBeLessThan(1080);
  await seek(page, .2);
  await expect(page.locator('[data-hand=self]')).toHaveAttribute('data-pose', '3');
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-state', 'waiting');
  expect(errors).toEqual([]);
});

test('desktop and stacked mobile pin content inside the viewport with no overflow', async ({ page }) => {
  await load(page);
  for (const [width, height] of [[320,568],[390,844],[700,900],[768,1024],[1366,768],[1920,1080],[2560,1440]]) {
    await page.setViewportSize({ width, height });
    const stacked = width < 760;
    await expect(page.locator('#services')).toHaveAttribute('data-pin', stacked ? 'stacked' : 'desktop');
    for (const index of stacked ? [0,1] : [0]) {
      await seek(page, .5, stacked ? index : undefined);
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
    if ([390,1920,2560].includes(width)) await page.screenshot({ path: 'docs/qa/services-pinned-' + width + '.png' });
  }
});

test('reduced motion and no JavaScript have no extra runway and keep the complete content', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await load(page);
  await expect(page.locator('#services')).toHaveAttribute('data-pin', 'none');
  await expect(page.locator('[data-hand=full]')).toHaveAttribute('data-pose', '7');
  await expect(page.locator('.service-inner')).toHaveCSS('position', 'static');
  expect(await page.locator('#services').evaluate(el => (el as HTMLElement).style.height)).toBe('');
  await expect(page.getByRole('link', { name: 'Explore Self Serve', exact: true })).toHaveAttribute('href', 'https://web.8x.social/onboarding');
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage(); await staticPage.goto('/#services');
  await expect(staticPage.locator('.service-still')).toHaveCount(2);
  await expect(staticPage.locator('.service-still').first()).toBeVisible();
  await expect(staticPage.locator('.service-inner')).toHaveCSS('position', 'static');
  await context.close();
});
