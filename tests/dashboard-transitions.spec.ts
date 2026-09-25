import { test, expect } from '@playwright/test';

test('every destination uses its own measured print while the shell and controls stay available', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/dashboard');
  const nav = page.getByRole('navigation', { name: 'Dashboard sections' });
  const before = await nav.boundingBox();
  for (const [label, layout] of [['Creators', 'creators'], ['Posts', 'posts'], ['Feed', 'feed'], ['Content plan', 'plan'], ['Analytics', 'analytics'], ['Team', 'team'], ['Overview', 'statistics']]) {
    await nav.getByRole('link', { name: new RegExp(label) }).click();
    const transition = page.locator(`.ds-route-content[data-raster-layout="${layout}"]`);
    await expect(transition).toBeVisible();
    await expect(transition.locator('.ds-raster-print')).toBeVisible();
    expect(await transition.locator('.ds-raster-print rect,.ds-raster-print path').count()).toBeGreaterThan(2);
    expect(await nav.boundingBox()).toEqual(before);
    await expect(page.getByRole('button', { name: 'Export report', exact: true })).toBeEnabled();
  }
  for (const [label, layout] of [['Pace & calendar', 'calendar'], ['Top posts', 'feed']]) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.locator(`.ds-route-content[data-raster-layout="${layout}"] .ds-raster-print`)).toBeVisible();
  }
  await page.getByRole('button', { name: 'Export report', exact: true }).click();
  await expect(page.getByRole('dialog').locator('[data-raster-layout="dialog"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Export report', exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

for (const [tab, width] of [['creators', 1920], ['feed', 1440], ['plan', 390]] as const) {
  test(`real pending images get exact stencils in ${tab} at ${width}px and clear on load`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1080 });
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/media/showcase/*.jpg', async route => { await gate; await route.continue(); });
    try {
      await page.goto(`/dashboard?tab=${tab}`, { waitUntil: 'domcontentloaded' });
      const transition = page.locator(`.ds-route-content[data-raster-layout="${tab}"]`);
      await expect(transition.locator('[data-raster-pending=true]').first()).toBeAttached();
      await expect(transition).toHaveAttribute('data-raster-phase', 'ready');
      const pending = transition.locator('img[data-raster-pending=true]').first();
      const source = await pending.getAttribute('src');
      const bounds = await pending.boundingBox();
      const shapes = await transition.locator('.ds-raster-media>g>rect:first-child').evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
      expect(shapes.some(r => Math.abs(r.x - bounds!.x) < 1 && Math.abs(r.y - bounds!.y) < 1 && Math.abs(r.width - bounds!.width) < 1 && Math.abs(r.height - bounds!.height) < 1)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `docs/qa/raster-loading-${tab}-${width}.png`, fullPage: true });
      release();
      await expect(transition.locator(`img[src="${source}"]`).first()).not.toHaveAttribute('data-raster-pending', 'true');
      await expect(transition.getByRole('status')).toHaveText('');
    } finally { release(); }
  });
}

test('rapid navigation, failed images, reduced motion and filtering do not trap the page', async ({ page }) => {
  await page.route('**/media/showcase/*.jpg', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/dashboard?tab=posts');
  await expect(page.locator('.ds-route-content')).toHaveAttribute('data-raster-phase', 'ready');
  await expect(page.locator('.ds-raster-print')).toHaveCount(0);
  await expect(page.locator('img[data-raster-pending=true]')).toHaveCount(0);
  const search = page.getByRole('searchbox', { name: 'Search posts' });
  await search.pressSequentially('lena');
  await expect(search).toBeFocused();
  await expect(page.locator('.ds-table tbody tr')).toHaveCount(11);
  const nav = page.getByRole('navigation', { name: 'Dashboard sections' });
  for (const name of ['Creators', 'Team', 'Feed', 'Overview']) await nav.getByRole('link', { name: new RegExp(name) }).click();
  await expect(page.getByTestId('total-views')).toHaveText('2.40M');
  await expect(page.locator('.ds-route-content')).toHaveAttribute('data-raster-layout', 'statistics');
  await expect(page.locator('.ds-raster-print')).toHaveCount(0);
});
