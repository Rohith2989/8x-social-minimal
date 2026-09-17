import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

// Sample the shipped brand font once; runtime needs no font rasterization or downloads.
const font = await readFile(new URL('../public/fonts/inter-latin-variable.woff2', import.meta.url));
const browser = await chromium.launch();
const page = await browser.newPage();
const data = await page.evaluate(async base64 => {
  const face = new FontFace('Feedback', `url(data:font/woff2;base64,${base64})`, { weight: '100 900' });
  await face.load(); document.fonts.add(face);
  const canvas = document.createElement('canvas'); canvas.width = 900; canvas.height = 470;
  const ctx = canvas.getContext('2d');
  ctx.font = '650 365px Feedback';
  const width = ctx.measureText('2.2M').width;
  ctx.save(); ctx.translate(450, 0); ctx.scale(812 / width, 1);
  ctx.fillText('2.2M', -width / 2, 365); ctx.restore();
  const pixels = ctx.getImageData(0, 0, 900, 470).data;
  const dots = [];
  for (let y = 20; y <= 440; y += 10) for (let x = 20; x <= 880; x += 10) {
    const ink = pixels[(y * 900 + x) * 4 + 3] > 100 ? 1 : 0;
    const edge = Math.min(1, x / 85, (900-x)/85, y/75, (470-y)/85);
    const density = Math.max(0, 1 - ((x-450)/510)**2 - ((y-235)/280)**2);
    const radius = ink ? 3.55 : (.35 + density * 1.75) * edge;
    dots.push([x, y, +radius.toFixed(2), ink]);
  }
  const path = ink => dots.filter(d=>d[3]===ink).map(([x,y,r])=>`M${x-r},${y}a${r},${r} 0 1,0 ${r*2},0a${r},${r} 0 1,0 ${-r*2},0`).join('');
  return { dots, inkPath: path(1), groundPath: path(0) };
}, font.toString('base64'));
await writeFile(new URL('../lib/feedback-dots.json', import.meta.url), JSON.stringify(data));
await browser.close();
console.log(`Saved ${data.dots.length} bounded dot samples`);
