import {test,expect} from '@playwright/test';

function contrast(a:string,b:string){
  const luminance=(s:string)=>s.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((v,c,i)=>v+c*[.2126,.7152,.0722][i],0);
  const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}

test('blue surfaces, controls and shared transition retain readable contrast',async({page})=>{
  await page.setViewportSize({width:1920,height:1080});await page.goto('/');
  await expect(page.locator('.hero-photo-journey')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.hero-cta')).toHaveCSS('background-color','rgb(0, 33, 204)');
  await expect(page.locator('.hero-cta')).toHaveCSS('color','rgb(255, 255, 255)');
  for(const id of ['services','dashboard','reach-atlas','family']){
    const section=page.locator('#'+id);await section.evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-96,behavior:'instant'}));
    await expect(section).toHaveCSS('background-color','rgb(0, 33, 204)');
    const colours=await section.evaluate(el=>{const c=getComputedStyle(el);return [c.color,c.backgroundColor]});
    expect(contrast(colours[0],colours[1]),id).toBeGreaterThan(4.5);
    await page.screenshot({path:`docs/qa/blue-${id}-desktop.png`});
  }
  for(const fraction of [.98,.94,.90,.86,.82,.78,.72]){
    await page.locator('#services').evaluate((el,f)=>scrollTo({top:el.getBoundingClientRect().top+scrollY-innerHeight*f,behavior:'instant'}),fraction);
    await expect.poll(()=>page.locator('#reach-atlas').getAttribute('data-approach')).not.toBe('1.000');
    await page.waitForTimeout(80);
    const colours=await page.locator('#partner-feedback').evaluate(el=>{const c=getComputedStyle(el);return [c.color,c.backgroundColor]});
    expect(contrast(colours[0],colours[1]),`transition ${fraction}`).toBeGreaterThan(4.5);
  }
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('.family-ending')).toHaveCSS('background-color','rgb(244, 246, 250)');
});

test('blue map fallback and light ink remain available without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();await page.goto('http://127.0.0.1:3091/#reach-atlas');
  await expect(page.locator('#reach-atlas')).toHaveCSS('background-color','rgb(0, 33, 204)');
  await expect(page.locator('#reach-atlas')).toHaveCSS('color','rgb(255, 255, 255)');
  await expect(page.locator('.ra-fallback')).toBeVisible();await context.close();
});
