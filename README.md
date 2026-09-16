# 8x Social Minimal

The new minimal 8x landing page, built separately from the original `8x-social` project. The homepage includes the carbon hero, continuous creator-content sequence, stone Day-to-day, Dot Reach, an interactive comparison and a closing contact area. The stone sections share one continuous surface without divider rules; motion stays within media, raster edges and comparison glyphs. Five distinct original-site creators appear across the video sections.

## Run

Requires Node 22. Install with `npm ci`, then `npm run dev`. Open http://localhost:3091.

For a production preview: `npm run build` then `npm run start`. Both commands use port 3091; do not stop other projects' servers. Stop an existing 3091 process before switching between development and production.

For the requested review address http://localhost:3904, keep the production server above running and start `npm run preview:alias` in another terminal. This lightweight local proxy streams the same app and videos from 3091; it does not run a second Next server. Day-to-day is part of `/` on both ports, with no concept subroute required. The old `/concepts/day-to-day` review route remains available.

## Verify

`npm run typecheck`, `npm run build`, `npm test`. Playwright runs serially against a production preview on 3091, starting one if necessary. Install the Chromium test browser with `npx playwright install chromium` if absent.

The tests cover native scroll selection with stable media geometry; manual pause and sound; offscreen playback; mobile navigation and clip selection; reduced motion; failed media fallback; and overflow at 320, 390, 768, 1024, 1440, 1920 and 2558 pixels.

## Direction and implementation

Read `AGENTS.md`, `design/CURRENT-DIRECTION.md` and `docs/IMPLEMENTATION.md` before changing the page. Design folders preserve approval/rejection history; their presence does not imply approval. The original orange Reach Atlas and eventual 8-to-infinity family reveal are future work, not implemented yet.

Next.js App Router, React, TypeScript and CSS. Original local SVG, font and creator media. No animation framework, scroll hijacking, external embeds, analytics, or artificial loading screen. The preview is marked `noindex` until launch is explicitly approved. Buttons link to existing 8x services; this project has no form backend.
