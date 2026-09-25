import { test, expect } from '@playwright/test';

test('platform checkboxes update the report immediately, persist, and recover from an empty selection', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'All platforms', exact: true }).click();
  const menu = page.locator('#chart-platform-panel');
  await expect(menu.getByRole('checkbox', { name: 'TikTok', exact: true })).toBeChecked();
  await menu.getByRole('checkbox', { name: 'Instagram', exact: true }).uncheck();
  await expect(menu).toBeVisible();
  await expect(page.getByTestId('total-views')).toHaveText('1.50M');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'TikTok', exact: true })).toBeFocused();
  await page.reload();
  await expect(page.getByTestId('total-views')).toHaveText('1.50M');
  await page.getByRole('button', { name: 'TikTok', exact: true }).click();
  await menu.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(page.getByTestId('total-views')).toHaveText('0');
  await expect(menu).toContainText('0 platforms selected');
  await page.reload();
  await expect(page.getByTestId('total-views')).toHaveText('0');
  await page.getByRole('button', { name: 'No platforms', exact: true }).click();
  await menu.getByRole('button', { name: 'Select all', exact: true }).click();
  await expect(page.getByTestId('total-views')).toHaveText('2.40M');
});

test('date drafts apply atomically; presets, reversed dates, and calendar keyboard movement work', async ({ page }) => {
  await page.goto('/dashboard');
  const open = page.getByRole('button', { name: 'Choose reporting dates' });
  await open.click();
  await page.getByRole('button', { name: 'Last 7 days', exact: true }).click();
  await expect(page.getByTestId('total-views')).toHaveText('2.40M');
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await open.click();
  await expect(page.locator('.ds-period-footer')).toContainText('1 – 24');
  await page.getByRole('button', { name: 'September 20', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Apply dates', exact: true })).toBeDisabled();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('button', { name: 'September 13', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.ds-period-footer')).toContainText('13 – 20');
  await page.getByRole('button', { name: 'Apply dates', exact: true }).click();
  await expect(page).toHaveURL(/from=13&to=20/);
  await expect(open).toBeFocused();
  await open.click();
  await page.getByRole('button', { name: 'Last 7 days', exact: true }).click();
  await page.getByRole('button', { name: 'Apply dates', exact: true }).click();
  await expect(page).toHaveURL(/range=7D&from=18/);
  await page.reload();
  await expect(page.getByRole('button', { name: '7D', exact: true })).toBeVisible();
});

for (const width of [1920, 1440, 768, 390]) {
  test(`filter popovers fit at ${width}px and respect reduced motion`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1080 });
    await page.goto('/dashboard');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('button', { name: 'Choose reporting dates' }).click();
    const date = page.locator('#date-picker-panel');
    const rect = await date.boundingBox();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
    expect(await date.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.screenshot({ path: `docs/qa/filters-period-${width}.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'All platforms', exact: true }).click();
    const platform = page.locator('#chart-platform-panel');
    await expect(platform).toBeVisible();
    const bounds = await platform.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.screenshot({ path: `docs/qa/filters-platform-${width}.png`, fullPage: true });
  });
}
