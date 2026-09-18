import { test, expect, type Page } from '@playwright/test';

async function workPosition(page: Page, progress = 0) {
  await page.locator('#work').evaluate((element, fraction) => {
    const style = getComputedStyle(element);
    const top = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - parseFloat(style.getPropertyValue('--stage-top')) + parseFloat(style.getPropertyValue('--read-distance')) * fraction, behavior: 'instant' });
  }, progress);
}

test('native scroll changes clip focus without moving the media frames', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('#work')).toHaveAttribute('data-sticky', 'true');
  await page.locator('.hp-photo img').evaluate((img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: 'docs/qa/desktop-hero.png' });
  await workPosition(page, .1);
  await expect(page.locator('#work')).toHaveAttribute('data-active', 'nickmakesmusic');
  await expect(page.getByRole('button', { name: 'Pause Entertainment', exact: true })).toBeVisible();
  await page.locator('.video-rail').evaluate(el => Promise.all(el.getAnimations().map(a => a.finished)));
  const before = await page.locator('.video-frame').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
  await workPosition(page, .5);
  await expect(page.locator('#work')).toHaveAttribute('data-active', 'mindful-witmee');
  await expect(page.getByRole('button', { name: 'Pause Everyday routines', exact: true })).toBeVisible();
  const after = await page.locator('.video-frame').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; }));
  expect(after).toEqual(before);
  await page.screenshot({ path: 'docs/qa/desktop-content.png' });
  await workPosition(page, .9);
  await expect(page.locator('#work')).toHaveAttribute('data-active', 'techwithchow');
  await expect.poll(() => page.locator('#work video').evaluateAll(nodes => nodes.every(v => !(v as HTMLVideoElement).paused && (v as HTMLVideoElement).muted)) ).toBe(true);
  expect(errors).toEqual([]);
});

test('manual pause holds independently, then offscreen playback stops', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#work')).toHaveAttribute('data-sticky', 'true');
  await workPosition(page, .1);
  await page.getByRole('button', { name: 'Pause Entertainment', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Play Entertainment', exact: true })).toBeVisible();
  await workPosition(page, .6);
  await expect(page.getByRole('button', { name: 'Play Entertainment', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause Everyday routines', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Play Entertainment', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause Entertainment', exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.locator('video').evaluateAll(nodes => nodes.every(v => (v as HTMLVideoElement).paused && (v as HTMLVideoElement).muted))).toBe(true);
});

test('mobile menu, manual clip selection and rail stay usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('.hp-photo img').evaluate((img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: 'docs/qa/mobile-hero.png' });
  await page.getByRole('button', { name: /menu/i }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'How it works', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'How it works', exact: true })).toBeHidden();
  await expect(page.locator('#work')).toHaveAttribute('data-sticky', 'false');
  await page.getByRole('button', { name: 'Tech in the wild', exact: true }).click();
  await expect(page.locator('#work')).toHaveAttribute('data-active', 'techwithchow');
  await expect.poll(() => page.locator('.video-rail').evaluate(el => el.scrollLeft)).toBeGreaterThan(300);
  await page.locator('.video-rail').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-clip=techwithchow]')).toBeInViewport();
  await page.getByRole('button', { name: 'Entertainment', exact: true }).click();
  await expect(page.locator('#work')).toHaveAttribute('data-active', 'nickmakesmusic');
  await expect.poll(() => page.locator('.video-rail').evaluate(el => el.scrollLeft)).toBeLessThan(2);
  await page.locator('.video-rail').scrollIntoViewIfNeeded();
  await page.screenshot({path:'docs/qa/creator-dots-mobile.png'});
});

test('reduced motion avoids sticky traversal and autoplay but allows deliberate playback', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('#work').scrollIntoViewIfNeeded();
  await expect(page.locator('#work')).toHaveAttribute('data-sticky', 'false');
  expect(await page.locator('#work video source').count()).toBe(0);
  expect(await page.locator('video').evaluateAll(videos => videos.every(video => (video as HTMLVideoElement).paused))).toBe(true);
  await page.getByRole('button', { name: 'Play Entertainment', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pause Entertainment', exact: true })).toBeVisible();
});

test('failed media exposes a usable original link', async ({ page }) => {
  await page.route(/\/media\/nickmakesmusic-v1\.(webm|mp4)/, route => route.abort());
  await page.goto('/');
  await workPosition(page, .1);
  await expect(page.getByText('This clip couldn’t load.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Watch the original', exact: false })).toHaveAttribute('href', /tiktok.com/);
});

test('responsive layouts keep text and navigation inside the viewport', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440, 1920, 2558]) {
    await page.setViewportSize({ width, height: width > 1600 ? 1080 : 900 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `overflow at ${width}`).toBe(true);
    for (const selector of ['h1', '.hero-offer', '.nav-rail', '#work-title']) {
      const bounds = await page.locator(selector).boundingBox();
      expect(bounds!.x, `${selector} left at ${width}`).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width, `${selector} right at ${width}`).toBeLessThanOrEqual(width + 1);
    }
    if (width === 2558) {
      await page.locator('.hp-photo img').evaluate((img: HTMLImageElement) => img.decode());
      await page.locator('.hp-photo').scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'docs/qa/wide-portrait-blend.png' });
    }
  }
});

