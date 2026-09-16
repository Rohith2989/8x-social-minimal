import { mkdir, writeFile, access } from 'node:fs/promises';
const names = ['mindful-witmee','nickmakesmusic','techwithchow','maggie-intech','wellnesswithliv1'];
await mkdir('assets/creators', {recursive:true});
const extension = process.argv.includes('--videos') ? 'mp4' : 'jpg';
for (const name of names) {
  const target = `assets/creators/${name}.${extension}`;
  try { await access(target); continue; } catch {}
  const url = `https://cdn-mrktng.8x.social/assets/videos/recent-work-v1/${name}.${extension}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(target, bytes);
  console.log(name, extension, bytes.length);
}
