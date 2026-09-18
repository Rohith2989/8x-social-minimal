import { test, expect } from '@playwright/test';

test('map leads directly to the information footer on desktop and mobile', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.family-journey, .family-art, .family-current, .family-directory')).toHaveCount(0);
  for (const width of [390,1920,2560]) {
    await page.setViewportSize({width,height:1080});
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact').getByRole('link',{name:'Privacy',exact:true})).toBeVisible();
    await expect(page.locator('#contact').getByRole('link',{name:'Build your network.'})).toBeVisible();
    const gap=await page.evaluate(() => document.querySelector('.family-ending')!.getBoundingClientRect().top-document.querySelector('#reach-atlas')!.getBoundingClientRect().bottom);
    expect(Math.abs(gap)).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    if(width===1920) await page.screenshot({path:'docs/qa/footer-without-animation.png'});
  }
});

test('information footer remains available without JavaScript', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage(); await page.goto('http://127.0.0.1:3091/#contact');
  await expect(page.locator('#contact').getByRole('link',{name:'Privacy',exact:true})).toBeVisible();
  await expect(page.locator('.family-journey')).toHaveCount(0);
  await context.close();
});
