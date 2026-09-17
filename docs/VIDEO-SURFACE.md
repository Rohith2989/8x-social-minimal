# Continuous showcase implementation

September 18, 2026. Approved direction: design/combined-showcase-v4. Local only; no commit or push.

The homepage replaces DayToDay and DotReach with VideoSurface. The old day-to-day concept route is preserved for reference. Existing #day-to-day and #reach links resolve to the merged surface; #showcase is the review anchor. Header and scroll thread retain their stone-surface detection.

42 videos observed on https://www.8x.social/en/showcase were imported from its CDN, with original source URLs recorded in public/media/showcase/sources.json. All are complete-duration, silent H.264 copies at 320px wide/24fps, with two-second posters. Total video size is approximately 48.5 MB across the whole library; only selected clips load on demand. The 18 curated clips are authentic footage, not generated board faces or captions. Import utility: scripts/import-showcase.mjs.

A single bounded-resolution 2D canvas composites the footage, a graphite base, one radial natural-colour reveal, a faint warm reflection and a precomputed halftone alpha mask. Dots dissolve the complete perimeter. Equal 9:16 cells contain every clip. No generated concept image is shipped as footage. The light moves slowly, eases toward a mouse/focused cell and gently opens on first arrival; no card movement or scroll pin. Six columns on tablet and three on phones keep footage readable. Desktop has nine columns and two rows, with a compact 1080p layout.

The paint loop is capped at 25fps and a 1800px buffer width. At most four desktop/two phone videos play near the light. Other clips hold their source frames. Offscreen and hidden documents pause playback and paint work. Reduced motion shows a static composition and requires deliberate video play. Tap/keyboard on a cell toggles that clip, preserving manual pauses. Keyboard focus exposes a whole-surface pause control without a permanent toolbar. A failed clip offers its original source URL. Poster grid and original-showcase link support no-JavaScript reading.

Validation: production build; targeted Playwright coverage of source count, autoplay bounds, pointer response with fixed geometry, manual pause, offscreen pause, reduced motion, deliberate playback, media failure, and 320/390/768/1920/2560 widths. Existing creator presentation, map, scroll thread, comparison and archived day-to-day checks were run. QA images: docs/qa/video-surface-{390,1920,2560}.png.

Rollback: swap VideoSurface in app/page.tsx for the retained DayToDay and DotReach components and remove the video-surface stylesheet import. No older implementation was destructively edited.
