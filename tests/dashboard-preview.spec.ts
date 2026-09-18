import { test, expect, type Page } from '@playwright/test';

async function ready(page: Page, width = 1920, height = 1080) {
  await page.setViewportSize({ width, height });
  await page.goto('/#dashboard');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('#dashboard')).toHaveAttribute('data-enhanced', 'true');
}
async function progress(page: Page, p: number) {
  await page.locator('#dashboard').evaluate((el, p) => {
    const section = el as HTMLElement;
    const top = Number.parseFloat(section.style.getPropertyValue('--dp-top'));
    const travel = Number.parseFloat(section.style.getPropertyValue('--dp-travel'));
    scrollTo({ top: scrollY + el.getBoundingClientRect().top - top + travel * p, behavior: 'instant' });
  }, p);
}

test('native pin holds one frame across three states, reverses, and releases into the map', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await ready(page);
  const section = page.locator('#dashboard'), screen = section.locator('.dp-window');
  await expect(section).toHaveAttribute('data-pinned', 'true');
  let initial: Awaited<ReturnType<typeof screen.boundingBox>> = null;
  for (const [p, index] of [[.1,0],[.45,1],[.82,2],[.45,1],[.1,0]]) {
    await progress(page, p);
    await expect(section).toHaveAttribute('data-active', String(index));
    await expect(section.locator('[role=tabpanel][aria-hidden=false]')).toHaveCount(1);
    await expect(section.locator(`#dashboard-panel-${index}`)).toHaveCSS('opacity', '1');
    const box = await screen.boundingBox();
    if (!initial) initial = box;
    expect(Math.abs(box!.y - initial!.y)).toBeLessThan(2);
    expect(box!.height).toBeCloseTo(initial!.height, 0);
    expect(box!.y + box!.height).toBeLessThan(1045);
    await page.screenshot({ path: `docs/qa/dashboard-${index}-1920.png` });
  }
  const ambient = section.locator('.dp-ambient i').first();
  await expect(ambient).toHaveCSS('animation-play-state', 'running');
  const time = await ambient.evaluate(el => el.getAnimations()[0].currentTime as number);
  await expect.poll(() => ambient.evaluate(el => el.getAnimations()[0].currentTime as number)).toBeGreaterThan(time + 100);
  await progress(page, 1.2);
  expect((await section.locator('.dp-stage').boundingBox())!.y).toBeLessThan(0);
  expect(await page.locator('#reach-atlas').evaluate(el => el.previousElementSibling?.id)).toBe('dashboard');
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(ambient).toHaveCSS('animation-play-state', 'paused');
  expect(errors).toEqual([]);
});

test('library search, pagination, one-video playback, and creator selection work', async ({ page }) => {
  await ready(page);
  await page.getByRole('tab', { name: 'Content', exact: true }).click();
  const section = page.locator('#dashboard'), panel = page.locator('#dashboard-panel-1');
  await expect(section).toHaveAttribute('data-active', '1');
  await expect(panel.locator('.dp-video-tile')).toHaveCount(20);
  await expect(panel.locator('video')).toHaveCount(1);
  await expect.poll(() => panel.locator('video').evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);
  await page.getByRole('button', { name: 'Next content page' }).click();
  await expect(section).toHaveAttribute('data-active', '1');
  await expect(panel.locator('.dp-video-tile')).toHaveCount(20);
  await page.getByRole('searchbox', { name: 'Search content' }).fill('Entertainment');
  await expect(panel.locator('.dp-video-tile')).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Search content' }).fill('missing-video-xyz');
  await expect(panel.getByText('No matching videos. Try another search.')).toBeVisible();
  await page.getByRole('tab', { name: 'Creators', exact: true }).click();
  await expect(section).toHaveAttribute('data-active', '2');
  await page.locator('.dp-creator-row').filter({ hasText: '@nickmakesmusic' }).click();
  await expect(page.locator('.dp-inspector strong')).toHaveText('@nickmakesmusic');
  await expect(page.locator('.dp-inspector>a')).toHaveAttribute('href', /tiktok.com/);
  await page.getByRole('tab', { name: 'Creators', exact: true }).focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: 'Overview', exact: true })).toBeFocused();
  await expect(section).toHaveAttribute('data-active', '0');
  await page.getByLabel('Campaign', { exact: true }).selectOption('AiApply');
  await expect(page.locator('.dp-campaigns tbody tr')).toHaveCount(1);
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  expect((await downloaded).suggestedFilename()).toBe('8x-campaign-preview.csv');
  for (const platform of ['TikTok','Instagram','YouTube Shorts']) await expect(page.locator('#dashboard-panel-0').getByAltText(platform)).toBeVisible();
});

test('responsive views fit desktop; small screens and reduced motion keep native flow', async ({ page }) => {
  await ready(page);
  for (const [width,height] of [[2560,1440],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[320,568]]) {
    await page.setViewportSize({ width, height });
    await expect(page.locator('#dashboard')).toHaveAttribute('data-pinned', String(width >= 1000 && height >= 720));
    for (let i = 0; i < 3; i++) {
      await page.locator(`#dashboard-tab-${i}`).click();
      await expect(page.locator(`#dashboard-panel-${i}`)).toHaveCSS('opacity', '1');
      const overflow = await page.locator(`#dashboard-panel-${i}`).evaluate(el => ({ height: el.scrollHeight - el.clientHeight, width: el.scrollWidth - el.clientWidth }));
      expect(overflow.height, `panel ${i}, ${width} tall overflow`).toBeLessThanOrEqual(2);
      expect(overflow.width, `panel ${i}, ${width} wide overflow`).toBeLessThanOrEqual(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    if ([2560,390].includes(width)) await page.locator('.dp-stage').screenshot({ path: `docs/qa/dashboard-stage-${width}.png` });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(page.locator('#dashboard')).toHaveAttribute('data-pinned', 'false');
  await expect(page.locator('.dp-ambient i').first()).toHaveCSS('animation-name', 'none');
  await page.getByRole('tab', { name: 'Content', exact: true }).click();
  await expect(page.locator('#dashboard')).toHaveAttribute('data-active', '1');
  const video = page.locator('#dashboard-panel-1 video');
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
  await page.locator('.dp-video-tile[data-selected=true]').click();
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(.1);
  await page.locator('.dp-video-tile[data-selected=true]').click();
  await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).paused)).toBe(true);
});

test('without JavaScript all three reports remain readable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto('/#dashboard');
  await expect(page.locator('#dashboard [role=tabpanel]')).toHaveCount(3);
  for (const panel of await page.locator('#dashboard [role=tabpanel]').all()) await expect(panel).toBeVisible();
  await expect(page.locator('.dp-stage')).not.toHaveCSS('position', 'sticky');
  await context.close();
});
