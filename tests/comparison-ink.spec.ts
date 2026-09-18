import { test, expect } from '@playwright/test';

test('ink sweeps through intermediate curved states, shares text geometry, and reverses midway', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/#comparison');
  await page.evaluate(() => document.fonts.ready);
  const card = page.getByRole('article', { name: '8x network', exact: true });
  const ink = card.locator('.comparison-ink');
  await card.scrollIntoViewIfNeeded();
  await expect(page.locator('#comparison')).toHaveAttribute('data-introducing', 'false');
  await card.focus(); await page.keyboard.press('Escape');
  await expect(ink).toHaveCSS('clip-path', 'ellipse(0% 0% at 100% 100%)');
  await card.hover();
  await expect(card).toHaveAttribute('data-active', 'true');
  await expect.poll(() => ink.evaluate(el => el.getAnimations().some(a => (a as CSSTransition).transitionProperty === 'clip-path'))).toBe(true);
  const duration = await ink.evaluate(el => {
    const animation = el.getAnimations().find(a => (a as CSSTransition).transitionProperty === 'clip-path')!;
    animation.pause(); animation.currentTime = 300;
    return animation.effect!.getTiming().duration;
  });
  expect(duration).toBe(800);
  const halfway = await ink.evaluate(el => getComputedStyle(el).clipPath);
  expect(halfway).not.toBe('ellipse(0% 0% at 100% 100%)');
  expect(halfway).not.toBe('ellipse(150% 150% at 100% 100%)');
  await expect(ink).toHaveAttribute('aria-hidden', 'true');
  await expect(ink).toHaveAttribute('inert', '');
  await expect(ink.locator('dt').first()).toHaveCSS('color', 'rgb(197, 194, 188)');
  await expect(card.getByRole('link')).toHaveCount(1);
  expect(await card.evaluate(el => {
    const original = el.querySelector(':scope > .comparison-content')!;
    const duplicate = el.querySelector('.comparison-ink .comparison-content')!;
    const a = original.getBoundingClientRect(), b = duplicate.getBoundingClientRect();
    return Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y),Math.abs(a.width-b.width),Math.abs(a.height-b.height));
  })).toBeLessThan(.1);
  await card.screenshot({ path: 'docs/qa/comparison-ink-rise.png' });
  await ink.evaluate(el => { const a=el.getAnimations().find(a => (a as CSSTransition).transitionProperty === 'clip-path')!; a.currentTime=440; });
  await card.screenshot({ path: 'docs/qa/comparison-ink-flow.png' });
  await ink.evaluate(el => el.getAnimations().forEach(a=>a.play()));
  await page.mouse.move(5,5);
  await expect(ink).toHaveCSS('clip-path', 'ellipse(0% 0% at 100% 100%)');
  await card.hover();
  await expect(ink).toHaveCSS('clip-path', 'ellipse(150% 150% at 100% 100%)');
  await expect(card.locator('.comparison-print')).toHaveCSS('opacity', '0.9');
  await card.screenshot({ path: 'docs/qa/comparison-ink-hold.png' });
});
