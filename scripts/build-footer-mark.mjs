import fs from 'node:fs/promises';
import sharp from 'sharp';

// Keep the real mark, including both counters. Its second subpath is the x.
const source = await fs.readFile('public/8x.svg', 'utf8');
const paths = source.match(/d="([^"]+)" fill=/)[1].match(/M[^M]+/g);
if (paths.length !== 4) throw new Error('Review changed logo geometry before rebuilding.');
const eight = [paths[0], paths[2], paths[3]].join('');
const x = paths[1];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><path fill="white" d="${eight}" transform="translate(450 300) scale(3 2.2) rotate(90) translate(-93 -132)"/></svg>`;
const { data, info } = await sharp(Buffer.from(svg)).blur(8).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const dots = [];
for (let y = 24; y < 580; y += 10) for (let px = 24; px < 890; px += 10) {
  const alpha = data[(y * info.width + px) * 4 + 3] / 255;
  if (alpha < .015) continue;
  // Store original-path coordinates; runtime rotates the same points, not a swarm.
  dots.push([+(93 + (y - 300) / 2.2).toFixed(3), +(132 - (px - 450) / 3).toFixed(3), +(4.28 * Math.sqrt(alpha)).toFixed(3)]);
}
await fs.mkdir('public/footer', { recursive: true });
await fs.writeFile('lib/footer-mark.json', JSON.stringify({ eight, x, dots }));
const circles = dots.map(([a, b, r]) => `<circle cx="${(450 - (b - 132) * 3).toFixed(2)}" cy="${(300 + (a - 93) * 2.2).toFixed(2)}" r="${r}"/>`).join('');
await fs.writeFile('public/footer/infinity.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" fill="#171922">${circles}</svg>`);
console.log(`Built original-logo infinity: ${dots.length} stationary dot targets.`);
