import { test, expect, type Page } from '@playwright/test';

async function position(page: Page, p: number) {
  await page.locator('#family').evaluate((el, progress) => {
    const style = getComputedStyle(el), top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top - parseFloat(style.getPropertyValue('--family-top')) + parseFloat(style.getPropertyValue('--family-distance')) * progress, behavior: 'instant' });
  }, p);
  await expect.poll(async () => Math.abs(Number(await page.locator('#family').getAttribute('data-progress')) - p)).toBeLessThan(.005);
  await expect(page.locator('#family')).toHaveAttribute('data-running', 'false');
}

test('scroll reveals a real transformation, stable products and a separate stone footer', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/#family');
  const journey = page.locator('#family');
  await expect(journey).toHaveAttribute('data-pinned', 'true');
  await expect(page.locator('.family-ending')).toHaveCSS('background-color', 'rgb(233, 229, 220)');
  const images: string[] = [];
  let productY = 0;
  for (const [name, progress] of [['original', 0], ['lift', .24], ['turn', .5], ['impression', .735], ['infinity', .94]] as const) {
    await position(page, progress);
    const bounds = await page.locator('.family-directory').boundingBox();
    if (name === 'original') productY = bounds!.y;
    else expect(Math.abs(bounds!.y - productY)).toBeLessThan(1);
    images.push(await page.locator('.family-art>svg').evaluate(el => el.outerHTML));
    if (name === 'infinity') await expect(page.locator('.family-current')).toHaveCSS('opacity', '1');
    await page.screenshot({ path: `docs/qa/footer-current-${name}.png` });
  }
  expect(new Set(images).size).toBe(5);
  await expect(journey).toHaveAttribute('data-running', 'false');
  await position(page, .5);
  await expect(page.locator('.family-current')).toHaveCSS('opacity', '0');
  // CSSOM may normalize the opacity style's whitespace after the crossfade.
  const returned = await page.locator('.family-art>svg').evaluate(el => el.outerHTML);
  expect(returned.replace(/style="[^"]*"/g,'') === images[2].replace(/style="[^"]*"/g,'')).toBe(true);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.getByRole('contentinfo', { name: '8x Social footer' })).toBeVisible();
  await expect(page.locator('#contact').getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', 'https://www.8x.social/en/book-call');
  await expect(page.locator('.site-header')).toHaveAttribute('data-ending', 'true');
  await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(233, 229, 220)');
  expect(await page.locator('.family-directory li').count()).toBe(5);
  expect(await page.locator('.family-directory a').count()).toBe(2);
  await expect(journey).toHaveAttribute('data-running', 'false');
  await page.screenshot({ path: 'docs/qa/footer-v3-contact.png' });
  expect(errors).toEqual([]);
});

test('entrance waits at rest; settled dots move continuously without moving products', async ({ page }) => {
  await page.goto('/#family');
  const root = page.locator('#family');
  await expect(root).toHaveAttribute('data-ready', 'true');
  await position(page, .25);
  await expect(root).toHaveAttribute('data-running', 'false');
  const frame = await page.locator('.family-art>svg').evaluate(el => el.outerHTML);
  await page.waitForTimeout(500);
  expect(await page.locator('.family-art>svg').evaluate(el => el.outerHTML)).toBe(frame);
  await position(page, .84); await expect(root).toHaveAttribute('data-phase', 'settled');
  await expect(root).toHaveAttribute('data-flowing', 'true');
  await expect(page.locator('.family-current')).toHaveCSS('opacity', '1');
  const product = await page.locator('.family-directory').boundingBox();
  const pixels = () => page.locator('.family-current').evaluate((canvas: HTMLCanvasElement) => { const data=canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data; const sampled:number[]=[]; for(let i=0;i<data.length;i+=64) sampled.push(data[i],data[i+1],data[i+2],data[i+3]); return sampled; });
  const first = await pixels();
  await page.screenshot({path:'docs/qa/footer-current-flow-a.png'});
  await page.waitForTimeout(1800);
  const second = await pixels();
  let coloured = 0, changed = 0, moved = 0, opaque = 0;
  for(let i=0;i<first.length;i+=4) {
    if (second[i+3]>180) opaque++;
    if (second[i+3]>180 && Math.max(second[i],second[i+1],second[i+2])-Math.min(second[i],second[i+1],second[i+2])>70) coloured++;
    if (Math.abs(first[i]-second[i])+Math.abs(first[i+1]-second[i+1])+Math.abs(first[i+2]-second[i+2])>90) changed++;
    if (Math.abs(first[i+3]-second[i+3])>100) moved++;
  }
  // A small moving accent, never an all-over rainbow.
  expect(coloured).toBeGreaterThan(30);
  expect(coloured / opaque).toBeLessThan(.18);
  expect(changed).toBeGreaterThan(100);
  expect(moved).toBeGreaterThan(60);
  expect(await page.locator('.family-directory').boundingBox()).toEqual(product);
  await page.screenshot({path:'docs/qa/footer-current-flow-b.png'});
  await position(page, 1); await expect(root).toHaveAttribute('data-phase', 'settled');
  await position(page, 0); await expect(root).toHaveAttribute('data-phase', 'original');
  await expect(root).toHaveAttribute('data-flowing', 'false');
  await expect(page.locator('.family-current')).toHaveCSS('opacity', '0');
});

test('current stops offscreen and freezes to a colourful still for reduced motion', async ({page}) => {
  await page.goto('/#family'); await position(page,.94);
  const root=page.locator('#family'), canvas=page.locator('.family-current');
  await expect(root).toHaveAttribute('data-flowing','true');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(root).toHaveAttribute('data-flowing','false');
  await expect(canvas).toHaveCSS('opacity','1');
  const still=await canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL());
  await page.waitForTimeout(400);
  expect(await canvas.evaluate((el:HTMLCanvasElement)=>el.toDataURL())).toBe(still);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await position(page,.94); await expect(root).toHaveAttribute('data-flowing','true');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await expect(root).toHaveAttribute('data-flowing','false');
  await expect(root).toHaveAttribute('data-running','false');
  const stopped=await canvas.getAttribute('data-frame');
  await page.waitForTimeout(400);
  expect(await canvas.getAttribute('data-frame')).toBe(stopped);
});

test('entrance print geometry stays stable and finishes at the bottom of a tall window', async ({ page }) => {
  await page.setViewportSize({width:1226,height:1302}); await page.goto('/#family');
  const root=page.locator('#family'); await expect(root).toHaveAttribute('data-ready','true');
  const dots=page.locator('.family-print-layer');
  const geometry=await dots.innerHTML();
  await position(page,.74);
  expect(await dots.innerHTML()).toBe(geometry);
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
  await expect(root).toHaveAttribute('data-phase','settled');
  await expect(root).toHaveAttribute('data-running','false');
  await expect(page.locator('#contact').getByRole('link',{name:'Privacy'})).toBeInViewport();
  expect(await dots.innerHTML()).toBe(geometry);
});

test('footer remains readable on phones, reduced motion and without scripts', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#family');
  await expect(page.locator('#family')).toHaveAttribute('data-pinned', 'false');
  await expect(page.locator('#family')).toHaveAttribute('data-phase', 'settled');
  await expect(page.locator('#family')).toHaveAttribute('data-running', 'false');
  await page.screenshot({ path: 'docs/qa/footer-v3-mobile.png' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact').getByRole('link', { name: 'Privacy' })).toBeVisible();
  await page.screenshot({ path: 'docs/qa/footer-v3-mobile-contact.png' });
  for (const width of [320, 768, 1024, 1920, 2558]) {
    await page.setViewportSize({ width, height: 1080 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  const context = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await context.newPage(); await fallback.goto('http://127.0.0.1:3091/#family');
  await expect(fallback.locator('.family-fallback')).toBeVisible();
  await expect(fallback.getByRole('link', { name: '8x Careers', exact: true })).toBeVisible();
  await context.close();
});
