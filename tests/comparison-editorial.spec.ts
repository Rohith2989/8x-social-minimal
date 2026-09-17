import { test, expect } from '@playwright/test';

test('all comparisons remain visible through hover and keyboard focus without reflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/#comparison');
  const section = page.locator('#comparison');
  await page.evaluate(() => document.fonts.ready);
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute('data-running', 'true');
  await expect(page.locator('.comparison-portrait img')).toHaveJSProperty('naturalWidth', 1086);
  const cards = section.getByRole('article');
  await expect(cards).toHaveCount(3);
  await expect(section.getByRole('tab')).toHaveCount(0);
  const geometry = () => cards.evaluateAll(elements => elements.map(el => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y + scrollY, height: el.getBoundingClientRect().height, width: el.getBoundingClientRect().width })));
  const before = await geometry();
  for (let i = 0; i < 3; i++) {
    await cards.nth(i).hover();
    await expect(section.locator('[data-active=true]')).toHaveCount(1);
    await expect(cards.nth(i)).toHaveAttribute('data-active', 'true');
    await expect(cards.nth(i).locator('.comparison-ink')).toHaveCSS('clip-path', 'ellipse(150% 150% at 100% 100%)');
    await expect(cards.nth(i).locator('.comparison-ink')).toHaveCSS('color', 'rgb(244, 243, 238)');
    await expect(section.locator('.comparison-option > .comparison-content dd')).toHaveCount(9);
    expect(await geometry()).toEqual(before);
  }
  await page.mouse.move(5, 5);
  await cards.nth(1).focus();
  await expect(cards.nth(1)).toHaveAttribute('data-active', 'true');
  const layer = cards.nth(1).locator('.comparison-print-layer').first();
  await expect(layer).toHaveCSS('animation-play-state', 'running');
  // Verify actual animation time advances, not just the presence of a CSS declaration.
  const start = await layer.evaluate(el => el.getAnimations()[0].currentTime as number);
  await expect.poll(() => layer.evaluate(el => el.getAnimations()[0].currentTime as number)).toBeGreaterThan(start + 80);
  await page.keyboard.press('Tab');
  await expect(cards.nth(2)).toBeFocused();
  await expect(cards.nth(2)).toHaveAttribute('data-active', 'true');
  await page.keyboard.press('Escape');
  await expect(section.locator('[data-active=true]')).toHaveCount(0);
  await cards.first().hover();
  await expect(cards.first().locator('.comparison-ink')).toHaveCSS('clip-path', 'ellipse(150% 150% at 100% 100%)');
  await expect(cards.first().locator('.comparison-print')).toHaveCSS('opacity', '0.9');
  await page.screenshot({ path: 'docs/qa/comparison-editorial-1920.png' });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(section).toHaveAttribute('data-running', 'false');
  await expect(cards.first().locator('.comparison-print-layer').first()).toHaveCSS('animation-play-state', 'paused');
  expect(errors).toEqual([]);
});

test('continuous stone surface, responsive geometry and static reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#comparison');
  const section = page.locator('#comparison');
  await page.evaluate(() => document.fonts.ready);
  expect(await section.evaluate(el => Math.abs(el.getBoundingClientRect().top - document.getElementById('day-to-day')!.getBoundingClientRect().bottom))).toBeLessThan(1);
  for (const width of [320, 390, 768, 1024, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: width === 2560 ? 1440 : 1080 });
    await section.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 110, behavior: 'instant' }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width}px`).toBe(true);
    expect(await section.locator('.comparison-option').evaluateAll(els => els.every(el => el.scrollWidth <= el.clientWidth))).toBe(true);
    await expect(section.locator('.comparison-option > .comparison-content dd')).toHaveCount(9);
    if (width === 2560) await page.screenshot({ path: 'docs/qa/comparison-editorial-2560.png' });
    if (width === 390) await section.screenshot({ path: 'docs/qa/comparison-editorial-390.png' });
  }
  await section.getByRole('article').first().focus();
  await expect(section.locator('.comparison-print-layer').first()).toHaveCSS('animation-name', 'none');
  await expect(section.locator('.comparison-ink').first()).toHaveCSS('transition-duration', '0s');
});

test('touch highlights one column without hiding its neighbours', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/#comparison');
  const cards = page.locator('.comparison-option');
  await cards.nth(1).tap();
  await expect(cards.nth(1)).toHaveAttribute('data-active', 'true');
  await cards.nth(2).tap();
  await expect(cards.nth(2)).toHaveAttribute('data-active', 'true');
  await expect(cards.nth(1)).toHaveAttribute('data-active', 'false');
  await expect(page.locator('.comparison-option > .comparison-content dd')).toHaveCount(9);
  await context.close();
});
