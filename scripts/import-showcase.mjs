import { spawn } from 'node:child_process';
import { mkdir, writeFile, stat } from 'node:fs/promises';
const ffmpeg = 'C:/Users/rohit/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
const ids = Array.from({ length: 45 }, (_, i) => i + 1).filter(id => ![8, 26, 44].includes(id));
const dir = 'public/media/showcase';
await mkdir(dir, { recursive: true });
const run = args => new Promise((resolve, reject) => {
  const process = spawn(ffmpeg, ['-hide_banner', '-loglevel', 'error', ...args], { windowsHide: true });
  let error = ''; process.stderr.on('data', data => error += data);
  process.on('error', reject); process.on('exit', code => code === 0 ? resolve() : reject(new Error(error)));
});
let next = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (next < ids.length) {
    const id = ids[next++], file = `${dir}/${id}`;
    const source = `https://cdn-mrktng.8x.social/assets/videos/video-${id}.mp4`;
    if (!(await stat(`${file}.mp4`).catch(() => null))) {
      await run(['-i', source, '-vf', 'scale=320:-2', '-r', '24', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '27', '-movflags', '+faststart', '-y', `${file}.mp4`]);
    }
    await run(['-ss', '2', '-i', `${file}.mp4`, '-frames:v', '1', '-q:v', '3', '-y', `${file}.jpg`]);
    console.log(`Imported ${id}`);
  }
}));
await writeFile(`${dir}/sources.json`, JSON.stringify({ sourcePage: 'https://www.8x.social/en/showcase', imported: '2026-09-18', encoding: '320px wide H.264, 24fps, no audio; original duration', clips: ids.map(id => ({ id, source: `https://cdn-mrktng.8x.social/assets/videos/video-${id}.mp4`, video: `${id}.mp4`, poster: `${id}.jpg` })) }, null, 2));
