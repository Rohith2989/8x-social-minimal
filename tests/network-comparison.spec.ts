import { test, expect } from '@playwright/test';

test('comparison continues the page and switches modes without moving its layout', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#comparison');
  const section = page.locator('#comparison');
  await expect(section).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('.site-header')).toHaveAttribute('data-surface', 'stone');
  await expect(page.getByRole('link', { name: 'How it works', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect(section).toHaveCSS('background-color', 'rgb(233, 229, 220)');
  expect(await section.evaluate(el => Math.abs(el.getBoundingClientRect().top - document.getElementById('reach')!.getBoundingClientRect().bottom))).toBeLessThan(1);
  const geometry = () => section.evaluate(el => ({ height: el.getBoundingClientRect().height, footer: document.querySelector('footer')!.getBoundingClientRect().top + scrollY }));
  const before = await geometry();
  const dot = page.locator('.comparison-glyphs circle').first();
  const originalDot = await dot.getAttribute('style');
  await page.getByRole('tab', { name: '8x network', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Influencers', exact: true })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toHaveCount(1);
  await expect(page.getByRole('tabpanel')).toHaveAccessibleName('Influencers');
  await expect(page.getByRole('heading', { name: 'Sponsored content.' })).toBeVisible();
  expect(await dot.getAttribute('style')).not.toEqual(originalDot);
  expect(await geometry()).toEqual(before);
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: 'Paid ads', exact: true })).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Paid distribution.' })).toBeVisible();
  expect(await geometry()).toEqual(before);
  await page.keyboard.press('Home');
  await expect(page.getByRole('tabpanel')).toHaveAccessibleName('8x network');
  await page.getByRole('tab', { name: '8x network', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toHaveCSS('opacity', '1');
  await page.locator('.comparison-glyphs').evaluate(el => Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished)));
  await page.screenshot({ path: 'docs/qa/comparison-desktop.png' });
  expect(errors).toEqual([]);
});

test('comparison remains usable on narrow screens and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#comparison');
  const section = page.locator('#comparison');
  const before = await section.evaluate(el => el.getBoundingClientRect().height);
  await page.getByRole('tab', { name: 'Paid ads', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Campaign controls.' })).toBeVisible();
  expect(await section.evaluate(el => el.getBoundingClientRect().height)).toBe(before);
  await expect(page.locator('.comparison-glyphs circle').first()).toHaveCSS('transition-duration', '0s');
  for (const width of [320, 390, 768, 1440, 2558]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('tab', { name: '8x network', exact: true }).click();
  await section.evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 90, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/qa/comparison-mobile.png' });
});
