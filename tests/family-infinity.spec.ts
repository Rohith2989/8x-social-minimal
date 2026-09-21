import {test,expect} from '@playwright/test';

test('infinity keeps stable links while the current moves and pauses offscreen',async({page})=>{
  await page.setViewportSize({width:1920,height:1080});await page.goto('/#family');
  const root=page.locator('#family'),canvas=root.locator('.fi-image-scene');
  await expect(root).toHaveAttribute('data-ready','true');
  await root.scrollIntoViewIfNeeded();await expect(root).toHaveAttribute('data-running','true');
  const links=await root.locator('.fi-products').boundingBox();
  const before=await canvas.screenshot();
  const frame=Number(await root.getAttribute('data-frame'));
  await expect.poll(async()=>Number(await root.getAttribute('data-frame'))).toBeGreaterThan(frame+.8);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  expect(await root.locator('.fi-products').boundingBox()).toEqual(links);
  await page.screenshot({path:'docs/qa/family-infinity-desktop.png'});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(root).toHaveAttribute('data-running','false');
  const paused=await root.getAttribute('data-frame');await page.waitForTimeout(180);expect(await root.getAttribute('data-frame')).toBe(paused);
  await root.scrollIntoViewIfNeeded();await expect(root).toHaveAttribute('data-running','true');
  await root.getByRole('link',{name:'8x Careers'}).focus();await expect(root.getByRole('link',{name:'8x Careers'})).toBeFocused();
});

test('all five logo colours survive each theme and every supported width',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/concepts/family');
  const colours=['rgb(255, 212, 56)','rgb(77, 44, 145)','rgb(243, 75, 50)','rgb(120, 174, 232)','rgb(157, 173, 194)'];
  for(const theme of ['polar','social','business','sale','careers','research']){
    const root=page.locator(`#family-${theme}`);await root.scrollIntoViewIfNeeded();
    expect(await root.locator('.fi-icon').evaluateAll(els=>els.map(el=>getComputedStyle(el).backgroundColor))).toEqual(colours);
    await expect(root.locator('.fi-icon[data-product=social] img')).toHaveCSS('filter','none');
    await root.screenshot({path:`docs/qa/family-theme-${theme}.png`});
  }
  for(const [width,height] of [[320,568],[390,844],[768,1024],[1366,768],[1920,1080],[2560,1440],[3440,1440]]){
    await page.setViewportSize({width,height});const root=page.locator('#family-polar');await root.scrollIntoViewIfNeeded();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    const boxes=await root.locator('.fi-product').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));
    for(let i=0;i<boxes.length;i++){
      const a=boxes[i];expect(a.x).toBeGreaterThanOrEqual(0);expect(a.x+a.w).toBeLessThanOrEqual(width);
      for(let j=i+1;j<boxes.length;j++){const b=boxes[j];expect(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y).toBe(false);}
    }
    if(width===390)await root.screenshot({path:'docs/qa/family-infinity-mobile.png'});
  }
});

test('reduced motion and no scripts retain a complete infinity and product directory',async({page,browser})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/#family');
  const root=page.locator('#family');await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute('data-running','false');await expect(root).toHaveAttribute('data-ready','true');
  const before=await root.locator('.fi-image-scene').screenshot();await page.waitForTimeout(200);
  expect((await root.locator('.fi-image-scene').screenshot()).equals(before)).toBe(true);
  const context=await browser.newContext({javaScriptEnabled:false});const plain=await context.newPage();await plain.goto('http://127.0.0.1:3091/#family');
  await expect(plain.locator('#family .fi-image-scene')).toBeVisible();await expect(plain.locator('#family .fi-product')).toHaveCount(5);
  await context.close();
});
