import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('creator filters, sorting, columns and empty reset remain functional', async ({ page }) => {
  await page.goto('/dashboard?tab=creators');
  await expect(page.locator('.ds-creator-table tbody tr')).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'Publishing 18', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'In review 6', exact: true }).click();
  await expect(page.locator('.ds-ledger-footer')).toContainText('1–5 of 6 creators');
  await page.reload();
  await expect(page.getByRole('button', { name: 'In review 6', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const search = page.getByRole('searchbox', { name: 'Search creators' });
  await search.pressSequentially('no-such-creator', { delay: 10 });
  await expect(search).toBeFocused();
  await expect(page.getByText('No creators match this view.')).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.ds-ledger-footer')).toContainText('1–5 of 24 creators');
  const before = await page.locator('.ds-ledger-person strong').first().textContent();
  await page.getByRole('button', { name: 'Reach', exact: true }).click();
  await expect(page.getByRole('columnheader', { name: 'Reach', exact: true })).toHaveAttribute('aria-sort', 'ascending');
  expect(await page.locator('.ds-ledger-person strong').first().textContent()).not.toBe(before);
  await page.getByRole('button', { name: 'Columns', exact: true }).click();
  await page.getByRole('checkbox', { name: 'Recent content', exact: true }).uncheck();
  await expect(page.getByRole('columnheader', { name: 'Recent content' })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Columns', exact: true })).toBeFocused();
});

test('creator selection spans pages and CSV aggregates the same campaign data', async ({ page }) => {
  await page.goto('/dashboard?tab=creators');
  await page.getByRole('checkbox', { name: 'Select all 24 filtered creators' }).check();
  await expect(page.getByRole('region', { name: 'Selected creators', exact: true })).toContainText('24 selected');
  await page.getByRole('button', { name: 'Next creator page' }).click();
  await expect(page.locator('.ds-ledger-footer')).toContainText('6–10 of 24 creators');
  await expect(page.getByRole('region', { name: 'Selected creators', exact: true })).toContainText('24 selected');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export selected', exact: true }).click();
  const file = await download;
  const records = (await readFile((await file.path())!, 'utf8')).split('\r\n').slice(2);
  expect(records).toHaveLength(24);
  expect(records.reduce((sum, row) => sum + Number(row.split(',')[5].replaceAll('"', '')), 0)).toBe(2400000);
  await page.getByRole('button', { name: 'Clear creator selection' }).click();
  await expect(page.getByRole('region', { name: 'Selected creators', exact: true })).toHaveCount(0);
});

test('creator action popup supports keyboard, row exports, profiles and matching posts', async ({ page }) => {
  await page.goto('/dashboard?tab=creators');
  const trigger = page.getByRole('button', { name: 'Actions for Lena Hayes' });
  await trigger.focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'View creator' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Export row' })).toBeFocused();
  const download = page.waitForEvent('download');
  await page.keyboard.press('Enter');
  const file = await download;
  expect((await readFile((await file.path())!, 'utf8')).split('\r\n')).toHaveLength(3);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('menuitem', { name: 'View creator' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('menuitem', { name: 'Open posts' }).click();
  await expect(page.getByRole('searchbox', { name: 'Search posts' })).toHaveValue('@lena.creates');
  await expect(page.locator('.ds-table tbody tr')).toHaveCount(11);
});

for (const width of [1920, 1440, 768, 390]) {
  test(`creator ledger layout and popup at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1080 });
    await page.goto('/dashboard?tab=creators');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('checkbox', { name: 'Select Sofia Reed', exact: true }).check();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const columnsAligned = await page.locator('.ds-creator-table').evaluate(table => {
      const headers = [...table.querySelectorAll('thead th')];
      const cells = [...table.querySelectorAll('tbody tr:first-child td')];
      return headers.length === cells.length && headers.every((th, i) => Math.abs(th.getBoundingClientRect().x - cells[i].getBoundingClientRect().x) < 1);
    });
    expect(columnsAligned).toBe(true);
    const wave = page.locator('.ds-creator-table tr[data-selected=true] .ds-ledger-row-wave');
    expect(await wave.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await page.getByRole('button', { name: 'Actions for Marcus Cole' }).click();
    const menu = page.getByRole('menu', { name: 'Marcus Cole actions' });
    await expect(menu).toBeVisible();
    const bounds = await menu.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    if (width > 1000) await page.screenshot({ path: `docs/qa/creators-${width}.png`, fullPage: true });
    else { await page.keyboard.press('Escape'); await page.locator('.ds-ledger-scroll').evaluate(el => el.scrollLeft = 0); await page.screenshot({ path: `docs/qa/creators-${width}.png`, fullPage: true }); }
  });
}
