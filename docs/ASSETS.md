# Asset provenance

- `public/8x.svg` and `public/icon.svg`: original 8x brand assets copied from the existing project. Do not redraw the mark with a substitute font.
- `public/fonts/inter-latin-variable.woff2`: existing local Inter asset reused from the original project.
- `public/media/judy-v1.*`, `jack-v1.*`, `network-v1.*`: original site posters and video formats copied from the existing project. Original source links are preserved in `lib/content.ts`; the product clip links directly to the original CDN. These are not generated videos.
- `design/hero-v1/references/atlas-portraits-v1.webp`: unchanged original project portrait panorama used as a visual reference.
- `assets/hero/portraits-cutout.png`: built-in image generation edit that extracted the five-person montage onto transparent pixels. Generated derivative; not a pixel-identical original photograph.
- `assets/hero/portraits-complete-v2.png`: subsequent user-requested outpainting to complete shoulders and upper torsos, retaining the earlier faces/order/style as closely as generation permits. This is brand imagery, not customer or employee identification.
- `assets/hero/prompts.json`: exact prompts and input roles for both portrait edits. Production WebP derivatives are produced with `npm run assets:build`. Originals are preserved for rollback. No generated page screenshot is used as a production UI.

Design folders contain generated concepts, exact prompts and reference notes from prior iterations. Refer to `design/CURRENT-DIRECTION.md` to distinguish approved direction from rejected explorations.

## Distinct creator refresh (2026-09-17)

Five original creator previews were imported directly from the CDN URLs listed by https://www.8x.social/en/for-brands in its recent-work gallery: nickmakesmusic, mindful-witmee, techwithchow, wellnesswithliv1, maggie-intech. Exact files, original-post links and placements are in assets/creators/provenance.json. Source JPG/MP4 files are preserved in assets/creators; public/media copies retain the original pixels, subtitles, audio and timing. They are not AI-generated. Each creator appears in one video section only.

Reproduce with `node scripts/import-creator-media.mjs`, `node scripts/import-creator-media.mjs --videos`, then `node scripts/prepare-creator-media.mjs`. The CDN's compact H.264 clips work without a second transcode. Existing judy/jack/network files are historical rollback assets, no longer used by the current page.

public/platforms contains original-project SVG platform marks. The new section renders monochrome marks to match the approved dot-reach reference. Source video is unchanged; grayscale and raster are live presentation effects only.
