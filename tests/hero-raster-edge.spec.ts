import { test, expect } from '@playwright/test';

test('hero edge breathes gently without moving the photo and pauses offscreen', async ({ page }) => {
  await page.goto('/');
  const edge = page.locator('.hero-raster-edge');
  await expect(edge).toHaveAttribute('data-ready', 'true');
  await expect(edge).toHaveAttribute('data-active', 'true');
  const image = page.locator('.hero-portrait img');
  const before = await image.boundingBox();
  const layers = edge.locator('path');
  await expect(layers.first()).toHaveCSS('animation-play-state', 'running');
  const start = await layers.first().evaluate(el => getComputedStyle(el).transform);
  await page.waitForTimeout(900);
  const finish = await layers.first().evaluate(el => {
    const m = new DOMMatrix(getComputedStyle(el).transform);
    return { transform: getComputedStyle(el).transform, displacement: Math.hypot(m.m41,m.m42), scale: m.m11 };
  });
  expect(finish.transform).not.toBe(start);
  expect(finish.displacement).toBeLessThan(1);
  expect(finish.scale).toBeLessThanOrEqual(1.015);
  expect(await image.boundingBox()).toEqual(before);
  await page.locator('#comparison').scrollIntoViewIfNeeded();
  await expect(edge).toHaveAttribute('data-active', 'false');
  await expect(layers.first()).toHaveCSS('animation-play-state', 'paused');
  await image.scrollIntoViewIfNeeded();
  await expect(edge).toHaveAttribute('data-active', 'true');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(edge).toHaveAttribute('data-active', 'false');
  await expect(layers.first()).toHaveCSS('animation-name', 'none');
  await expect(layers.first()).toHaveCSS('transform', 'none');
  expect(await layers.first().getAttribute('d')).toContain('a');
});

test('raster stays at physical screen edges through desktop, ultrawide and mobile resizing', async ({page}) => {
  await page.goto('/');
  for (const [width,height] of [[1920,1080],[2560,1440],[3440,1440],[3840,2160],[5120,1440],[390,844],[320,568]]) {
    await page.setViewportSize({width,height});
    const edge=page.locator('.hero-raster-edge');
    await expect(edge).toHaveAttribute('data-ready','true');
    await expect.poll(()=>edge.getAttribute('viewBox')).toMatch(new RegExp(`^0 0 ${width} `));
    const bounds=await edge.boundingBox();
    expect(bounds!.x).toBe(0); expect(bounds!.width).toBe(width);
    expect(bounds!.y).toBe(0);
    const headerBottom = (await page.locator('.site-header').boundingBox())!.height;
    expect(await page.locator('.hero-portrait .hero-raster-edge').count()).toBe(0);
    const geometry=await edge.locator('path').evaluateAll(elements=>elements.map(el=>{
      const b=(el as SVGPathElement).getBBox();return {x:b.x,y:b.y,width:b.width};
    }));
    // The texture must begin softly inside the header, never at its bottom edge.
    expect(Math.min(...geometry.map(b=>b.y))).toBeGreaterThan(0);
    expect(Math.min(...geometry.map(b=>b.y))).toBeLessThan(headerBottom - 10);
    for(const left of geometry.slice(0,3)){expect(left.x).toBeLessThan(10);expect(left.x+left.width).toBeLessThan(width*.18);}
    for(const right of geometry.slice(3)){expect(right.x).toBeGreaterThan(width*.82);expect(right.x+right.width).toBeGreaterThan(width-10);}
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if (width >= 1920) {
      await expect.poll(async () => {
        const photo = await page.locator('.hero-portrait img').boundingBox();
        const sun = await page.locator('.hero-sun').boundingBox();
        return sun!.x + sun!.width <= photo!.x + photo!.width;
      }).toBe(true);
    }
    await page.screenshot({path:`docs/qa/screen-edge-${width}.png`});
  }
});
