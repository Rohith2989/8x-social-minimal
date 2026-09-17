import { test, expect } from '@playwright/test';

test('scroll thread follows native scroll and supports track, drag and keyboard', async ({ page }) => {
  await page.goto('/');
  const rail = page.getByRole('scrollbar', { name: 'Page scroll position' });
  await expect(rail).toBeVisible();
  await expect(rail).toHaveAttribute('aria-valuenow', '0');
  await page.mouse.wheel(0, 800);
  await expect.poll(async () => Number(await rail.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  await rail.focus();
  await page.keyboard.press('End');
  await expect(rail).toHaveAttribute('aria-valuenow', '100');
  await page.keyboard.press('Home');
  await expect(rail).toHaveAttribute('aria-valuenow', '0');
  const box = (await rail.boundingBox())!;
  const x = box.x + box.width / 2;
  await page.mouse.move(x, box.y + 12);
  await page.mouse.down();
  await page.mouse.move(x, box.y + 48 + (box.height - 60) / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(async () => Number(await rail.getAttribute('aria-valuenow'))).toBeGreaterThan(45);
  await expect.poll(async () => Number(await rail.getAttribute('aria-valuenow'))).toBeLessThan(55);
  await expect(rail).toHaveAttribute('data-dragging', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await rail.press('Home');
  await expect(rail).toHaveAttribute('aria-valuenow', '0');
  await page.screenshot({ path: 'docs/qa/scroll-thread-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(rail).toBeHidden();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth)).not.toBe('none');
});

test('both hero edges have equally continuous vertical coverage', async ({page}) => {
  for (const [width, height] of [[1920,1080],[2560,1440]]) {
    await page.setViewportSize({width,height});
    await page.goto('/');
    const edge = page.locator('.hero-raster-edge');
    await expect(edge).toHaveAttribute('data-ready','true');
    const paths = await edge.locator('path').evaluateAll(nodes => nodes.map(node => {
      const b = (node as SVGPathElement).getBBox();
      return {top:b.y,bottom:b.y+b.height};
    }));
    const top = (slice: typeof paths) => Math.min(...slice.map(p=>p.top));
    const bottom = (slice: typeof paths) => Math.max(...slice.map(p=>p.bottom));
    expect(Math.abs(top(paths.slice(0,3))-top(paths.slice(3)))).toBeLessThan(15);
    expect(Math.abs(bottom(paths.slice(0,3))-bottom(paths.slice(3)))).toBeLessThan(15);
    await page.screenshot({path:`docs/qa/balanced-edges-${width}.png`});
  }
});
