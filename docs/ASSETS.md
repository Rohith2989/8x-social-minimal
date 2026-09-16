# Asset provenance

- `public/8x.svg` and `public/icon.svg`: original 8x brand assets copied from the existing project. Do not redraw the mark with a substitute font.
- `public/fonts/inter-latin-variable.woff2`: existing local Inter asset reused from the original project.
- `public/media/judy-v1.*`, `jack-v1.*`, `network-v1.*`: original site posters and video formats copied from the existing project. Original source links are preserved in `lib/content.ts`; the product clip links directly to the original CDN. These are not generated videos.
- `design/hero-v1/references/atlas-portraits-v1.webp`: unchanged original project portrait panorama used as a visual reference.
- `assets/hero/portraits-cutout.png`: built-in image generation edit that extracted the five-person montage onto transparent pixels. Generated derivative; not a pixel-identical original photograph.
- `assets/hero/portraits-complete-v2.png`: subsequent user-requested outpainting to complete shoulders and upper torsos, retaining the earlier faces/order/style as closely as generation permits. This is brand imagery, not customer or employee identification.
- `assets/hero/prompts.json`: exact prompts and input roles for both portrait edits. Production WebP derivatives are produced with `npm run assets:build`. Originals are preserved for rollback. No generated page screenshot is used as a production UI.

Design folders contain generated concepts, exact prompts and reference notes from prior iterations. Refer to `design/CURRENT-DIRECTION.md` to distinguish approved direction from rejected explorations.
