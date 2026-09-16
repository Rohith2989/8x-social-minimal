import { copyFile } from 'node:fs/promises';
const names = ['mindful-witmee','nickmakesmusic','techwithchow','maggie-intech','wellnesswithliv1'];
// Original CDN clips are already compact 480px H.264 previews. Keep their pixels,
// audio, subtitles and timing unchanged instead of transcoding them again.
for (const name of names) for (const ext of ['jpg','mp4']) {
  await copyFile(`assets/creators/${name}.${ext}`, `public/media/${name}-v1.${ext}`);
}
