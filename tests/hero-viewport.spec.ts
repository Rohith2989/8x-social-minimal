import { test, expect, type Page } from '@playwright/test';

async function scene(page: Page, p: number) {
  await page.locator('.hero-photo-journey').evaluate((el, p) => {
    const s = getComputedStyle(el);
    scrollTo({ top: el.getBoundingClientRect().top + scrollY - parseFloat(s.getPropertyValue('--hp-top')) + parseFloat(s.getPropertyValue('--hp-distance')) * p, behavior: 'instant' });
  }, p);
}

test('original hero fits desktops; five voices stay contained through mobile and ultrawide', async ({ page }) => {
  const errors: string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.hero-photo-journey')).toHaveAttribute('data-ready','true');
  for (const [width,height] of [[1920,1080],[2560,1440],[3440,1440],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[320,568],[844,390]]) {
    await page.setViewportSize({width,height});
    await page.evaluate(() => { scrollTo({top:0,behavior:'instant'}); return document.fonts.ready; });
    const heading = page.locator('h1');
    await expect(heading).toContainText('Creator networks.');
    await expect(page.locator('.hero-cta')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const widthOverflow = await heading.evaluate(el => el.scrollWidth > el.clientWidth + 1);
    expect(widthOverflow,`heading at ${width}`).toBe(false);
    await expect.poll(async () => { const box = (await page.locator('.hp-photo').boundingBox())!; return Math.abs(box.y + box.height - height); }, { message: `photo meets viewport bottom at ${width}×${height}` }).toBeLessThan(2);
    if([1920,390].includes(width)) await page.screenshot({path:`docs/qa/hero-original-${width}.png`});
    await scene(page,.9);
    await expect(page.locator('.hp-canvas')).toHaveAttribute('data-progress','1.000');
    await expect(page.locator('.hp-heading')).toHaveCSS('opacity','1');
    const fits=await page.locator('.hero-photo-journey').evaluate(el=>{const s=getComputedStyle(el);return parseFloat(s.getPropertyValue('--hp-portrait-width'))<=innerWidth && parseFloat(s.getPropertyValue('--hp-portrait-top'))+parseFloat(s.getPropertyValue('--hp-portrait-height')) < parseFloat(s.getPropertyValue('--hp-height'))*.77});
    expect(fits).toBe(true);
    expect(Number(await page.locator('.hp-canvas').getAttribute('data-particles'))).toBeLessThan(147000);
    if([1920,390,2560].includes(width)) await page.screenshot({path:`docs/qa/hero-voices-${width}.png`});
  }
  expect(errors).toEqual([]);
});

test('original pointer field reaches the shader and releases smoothly on exit',async({page})=>{
  await page.setViewportSize({width:1920,height:1080}); await page.goto('/');
  const canvas=page.locator('.hp-canvas');
  await expect(page.locator('.hero-photo-journey')).toHaveAttribute('data-ready','true');
  const strength=()=>canvas.evaluate(el=>{
    const gl=(el as HTMLCanvasElement).getContext('webgl')!;
    const program=gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
    const location=gl.getUniformLocation(program,'u_pointerStrength');
    if(!location) throw new Error('Pointer strength uniform is missing');
    return gl.getUniform(program,location) as number;
  });
  const photo=(await page.locator('.hp-photo').boundingBox())!;
  await page.mouse.move(photo.x+photo.width*.5,photo.y+photo.height*.45);
  await expect.poll(strength).toBeGreaterThan(.95);
  const before=await canvas.screenshot();
  await page.mouse.move(photo.x+photo.width*.57,photo.y+photo.height*.57,{steps:6});
  await expect.poll(strength).toBeGreaterThan(.95);
  expect((await canvas.screenshot()).equals(before)).toBe(false);
  await page.mouse.move(800,30);
  await expect.poll(strength).toBeLessThan(.02);
  await scene(page,.9);
  const stage=(await canvas.boundingBox())!;
  await page.mouse.move(stage.x+stage.width*.45,stage.y+stage.height*.35);
  await expect.poll(strength).toBeGreaterThan(.95);
  await canvas.focus(); await page.keyboard.press('ArrowRight');
  await expect.poll(strength).toBeGreaterThan(.95);
  await page.keyboard.press('Escape'); await expect.poll(strength).toBeLessThan(.02);
});

test('photo-to-coloured-portraits reverses and suspends beyond the hero',async({page})=>{
  await page.setViewportSize({width:1920,height:1080});await page.goto('/');
  const root=page.locator('.hero-photo-journey'), canvas=page.locator('.hp-canvas');
  await expect(root).toHaveAttribute('data-ready','true');
  await expect(page.getByText('Many',{exact:true})).toHaveCount(0);
  await expect(page.locator('.hero-sun')).toHaveCount(0);
  await scene(page,.45);await expect.poll(async()=>Number(await canvas.getAttribute('data-progress'))).toBeGreaterThan(.5);
  await page.screenshot({path:'docs/qa/hero-original-matrix.png'});
  await scene(page,.9);await expect(canvas).toHaveAttribute('data-progress','1.000');
  await scene(page,.45);await expect.poll(async()=>Number(await canvas.getAttribute('data-progress'))).toBeLessThan(.6);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await expect(canvas).toHaveAttribute('data-progress','0.000');
  await page.locator('#comparison').scrollIntoViewIfNeeded();await expect(canvas).toHaveAttribute('data-running','false');
  await scene(page,.9);await expect(canvas).toHaveAttribute('data-running','true');
  await canvas.evaluate(el=>(el as HTMLCanvasElement).getContext('webgl')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(root).toHaveAttribute('data-fallback','true');
  await expect(page.locator('.hp-portraits')).toHaveCSS('opacity','1');
  await expect(canvas).toHaveCSS('opacity','0');
  await page.screenshot({path:'docs/qa/hero-original-fallback.png'});
});

test('reduced motion and no JavaScript show both complete still compositions',async({page,browser})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
  await expect(page.locator('.hero-photo-journey')).toHaveAttribute('data-reduced','true');
  await expect(page.locator('.hp-stage')).toHaveCSS('position','relative');
  await expect(page.locator('.hp-canvas')).toHaveCSS('opacity','0');
  await expect(page.locator('.hp-portraits img')).toBeVisible();
  await expect(page.locator('.hp-heading')).not.toHaveAttribute('aria-hidden','true');
  const context=await browser.newContext({javaScriptEnabled:false});const plain=await context.newPage();await plain.goto('/');
  await expect(plain.locator('.hp-photo img')).toBeVisible();await expect(plain.locator('.hp-portraits img')).toBeVisible();await expect(plain.locator('.hp-stage')).toHaveCSS('position','relative');await context.close();
});
