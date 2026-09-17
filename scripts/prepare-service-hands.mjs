import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const generated = 'C:/Users/rohit/.codex/generated_images/01a09c25-77bb-7223-98a9-b5e4764a8526/';
await mkdir('design/service-stop-motion-v1', { recursive: true });
await mkdir('public/media/service-hands', { recursive: true });
const sourceFiles = [
  ['exec-71069408-81a9-4229-a3a3-4d98e233d659.png', '01-approved-page.png'],
  ['exec-5eff197a-d1eb-4bcf-8110-fc51a0b3b8f2.png', '02-self-serve-motion.png'],
  ['exec-7343e4fb-4755-4d71-9c15-696866877bfd.png', '03-full-service-motion.png'],
  ['exec-5e0f3492-3ad8-414b-9e7e-07bc1cbe35e2.png', '04-self-serve-master.png'],
  ['exec-2927cef3-7a12-4686-900d-0a723c3478ee.png', '05-full-service-master.png'],
];
for (const [source, dest] of sourceFiles) await copyFile(generated + source, 'design/service-stop-motion-v1/' + dest);
const manifest = {};
for (const [name, file] of [['self',sourceFiles[3][1]],['full',sourceFiles[4][1]]]) {
  const input = 'design/service-stop-motion-v1/' + file;
  const { width, height, hasAlpha } = await sharp(input).metadata();
  if (!hasAlpha) throw new Error('Hand asset must retain transparency');
  // Encoding only: poses and alpha come directly from the image tool.
  await sharp(input).webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(`public/media/service-hands/${name}.webp`);
  manifest[name] = { width, height, columns: 4, rows: 2, poses: 8 };
}
await writeFile('public/media/service-hands/manifest.json', JSON.stringify(manifest, null, 2));
console.log(manifest);
