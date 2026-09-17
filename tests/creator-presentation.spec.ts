import { test, expect } from '@playwright/test';

test('continuous dot surface and matched players remain fixed while all clips play', async ({page}) => {
  await page.setViewportSize({width:1920,height:1080});
  await page.goto('/');
  await page.locator('.video-rail').scrollIntoViewIfNeeded();
  const videos = page.locator('#work video');
  await expect.poll(()=>videos.evaluateAll(nodes=>nodes.every(v=>!(v as HTMLVideoElement).paused))).toBe(true);
  expect(await page.locator('#work .video-controls, #work input[type=range], #work .poster-select, #work .clip-progress').count()).toBe(0);
  const before = await videos.evaluateAll(nodes=>nodes.map(v=>(v as HTMLVideoElement).currentTime));
  const bounds = await page.locator('.video-frame').evaluateAll(nodes=>nodes.map(el=>{
    const b=el.getBoundingClientRect();return [b.x,b.y,b.width,b.height];
  }));
  await page.waitForTimeout(800);
  const after = await videos.evaluateAll(nodes=>nodes.map(v=>(v as HTMLVideoElement).currentTime));
  after.forEach((time,i)=>expect(time).toBeGreaterThan(before[i]));
  expect(await page.locator('.video-frame').evaluateAll(nodes=>nodes.map(el=>{
    const b=el.getBoundingClientRect();return [b.x,b.y,b.width,b.height];
  }))).toEqual(bounds);
  const surface=await page.locator('.hero-raster-edge').boundingBox();
  const work=await page.locator('#work').boundingBox();
  expect(Math.abs(surface!.y+surface!.height-work!.y-work!.height)).toBeLessThan(2);
  await expect(page.locator('.media-raster path').first()).toHaveCSS('animation-play-state','running');
  await page.screenshot({path:'docs/qa/creator-dots-1920.png'});
  await page.getByRole('button',{name:'Pause Entertainment',exact:true}).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button',{name:'Play Entertainment',exact:true})).toBeVisible();
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('.media-raster path').first()).toHaveCSS('animation-name','none');
});
