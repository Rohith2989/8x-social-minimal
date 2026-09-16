import { test, expect, type Page } from '@playwright/test';

async function arrive(page: Page) {
  await page.goto('/#reach-atlas');
  await expect(page.locator('#reach-atlas')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('#reach-atlas')).toHaveCSS('background-color', 'rgb(243, 75, 50)');
}

async function point(page: Page, code: string) {
  const data = await (await page.request.get('/reach/atlas.json')).json();
  const country = data.countries.find((c: { code: string }) => c.code === code);
  const rect = await page.locator('.ra-geography').boundingBox();
  const point = { x: rect!.x + country.anchor[0] / 1440 * rect!.width, y: rect!.y + country.anchor[1] / 600 * rect!.height };
  await page.mouse.move(point.x, point.y);
  return point;
}

test('original map coverage, density, orange and country interactions are preserved', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await arrive(page);
  const coverage = await (await page.request.get('/reach/coverage.json')).json();
  expect(await page.locator('.ra-country').evaluateAll(els => els.map(e => e.getAttribute('data-code')).sort())).toEqual([...coverage.isoA3].sort());
  await expect(page.locator('.ra-country')).toHaveCount(51);
  await expect(page.locator('.ra-count strong')).toHaveText('61');
  await expect(page.locator('.ra-country-face').first()).toHaveCSS('stroke-width', '4.3px');
  const headingBox = () => page.locator('#atlas-title').evaluate(el => ({ top: el.getBoundingClientRect().top + scrollY, width: el.getBoundingClientRect().width }));
  const heading = await headingBox();
  const india = await point(page, 'IND');
  await expect(page.locator('#reach-atlas')).toHaveAttribute('data-selected', 'IND');
  await expect(page.locator('.ra-country[data-code=IND] .ra-country-face')).toHaveCSS('stroke', 'rgb(255, 224, 163)');
  await expect(page.locator('.ra-country-label')).toHaveCSS('background-color', 'rgb(255, 224, 163)');
  await page.mouse.click(india.x, india.y);
  await page.mouse.move(1, 1);
  await expect(page.locator('#reach-atlas')).toHaveAttribute('data-selected', 'IND');
  await page.locator('#reach-market').selectOption('JPN');
  await expect(page.locator('.ra-market-name')).toHaveText('Japan');
  await expect(page.locator('.ra-country[data-code=JPN] .ra-country-face')).toHaveCSS('stroke', 'rgb(181, 220, 255)');
  expect(await headingBox()).toEqual(heading);
  await page.getByRole('button', { name: 'Clear selected market' }).click();
  await expect(page.locator('#reach-atlas')).toHaveAttribute('data-selected', '');
  await page.mouse.move(1, 1);
  await expect(page.locator('.ra-country[data-code=JPN] .ra-country-face')).toHaveCSS('stroke', 'rgb(23, 25, 34)');
  await page.locator('#reach-atlas').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/qa/map-desktop.png' });
  expect(errors).toEqual([]);
});

test('approach reverses exactly and the map joins the page without a divider or pin', async ({ page }) => {
  await arrive(page);
  const position = async (fraction: number) => {
    await page.locator('#reach-atlas').evaluate((el, f) => scrollTo({ top: el.getBoundingClientRect().top + scrollY - innerHeight * f, behavior: 'instant' }), fraction);
  };
  await position(1.1);
  await expect(page.locator('#comparison')).toHaveCSS('background-color', 'rgb(233, 229, 220)');
  await position(.85);
  await expect.poll(async () => Math.abs(Number(await page.locator('#reach-atlas').getAttribute('data-approach')) - .5)).toBeLessThan(.01);
  const mid = await page.locator('#comparison').evaluate(el => getComputedStyle(el).backgroundColor);
  await expect(page.locator('#reach-atlas')).toHaveCSS('background-color', mid);
  await expect(page.locator('.site-header')).toHaveCSS('background-color', mid);
  await position(.7);
  await expect(page.locator('#reach-atlas')).toHaveCSS('background-color', 'rgb(243, 75, 50)');
  await position(.85);
  await expect(page.locator('#comparison')).toHaveCSS('background-color', mid);
  expect(await page.locator('#reach-atlas').evaluate(el => Math.abs(el.getBoundingClientRect().top - document.getElementById('comparison')!.getBoundingClientRect().bottom))).toBeLessThan(1);
});

test('small countries, filters, reduced motion and a failed atlas request remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await arrive(page);
  await page.locator('#reach-market').selectOption('SGP');
  await expect(page.locator('.ra-market-name')).toHaveText('Singapore');
  expect(await page.locator('.ra-map-scroll').evaluate(el => el.scrollLeft)).toBeGreaterThan(100);
  await expect(page.locator('.ra-country[data-code=SGP] .ra-country-face')).toHaveCSS('transform', 'none');
  await page.getByRole('button', { name: 'Europe', exact: true }).click();
  const countries = await page.locator('#reach-market option').allTextContents();
  expect(countries).toContain('United Kingdom'); expect(countries).not.toContain('India');
  await page.locator('#reach-market').selectOption('GBR');
  await page.locator('#reach-market').press('Escape');
  await expect(page.locator('#reach-atlas')).toHaveAttribute('data-selected', '');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'All markets', exact: true }).click();
  await page.locator('.ra-map-scroll').evaluate(el => el.scrollLeft = 0);
  await page.locator('#reach-atlas').evaluate(el => scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: 'instant' }));
  await page.screenshot({ path: 'docs/qa/map-mobile.png' });
  await page.route('**/reach/atlas.json', route => route.abort());
  await page.reload();
  await expect(page.locator('.ra-fallback')).toBeVisible();
  await page.locator('#reach-market').selectOption('IND');
  await expect(page.locator('.ra-market-name')).toHaveText('India');
});
