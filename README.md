# 8x Social Minimal

The new minimal 8x landing page, built separately from the original `8x-social` project. The homepage includes the carbon hero, continuous creator-content sequence, stone Day-to-day, Dot Reach, an interactive comparison, the original orange Reach Atlas and a stone product-family/contact footer. The stone surface warms into orange as the map heading arrives, without a divider or extra map scroll pin. Five distinct original-site creators appear across the video sections. The ending holds the original 8 through a scroll-driven layered SVG turn and halftone print reveal; earlier decorative effects are static.

## Run

Requires Node 22. Install with `npm ci`, then `npm run dev`. Open http://localhost:3091.

For a production preview: `npm run build` then `npm run start`. Both commands use port 3091; do not stop other projects' servers. Stop an existing 3091 process before switching between development and production.

For the requested review address http://localhost:3904, keep the production server above running and start `npm run preview:alias` in another terminal. This lightweight local proxy streams the same app and videos from 3091; it does not run a second Next server. Day-to-day is part of `/` on both ports, with no concept subroute required. The old `/concepts/day-to-day` review route remains available.

## Verify

`npm run typecheck`, `npm run build`, `npm test`. Playwright runs serially against a production preview on 3091, starting one if necessary. Install the Chromium test browser with `npx playwright install chromium` if absent.

The tests cover native scroll selection with stable media geometry; manual pause and sound; offscreen playback; mobile navigation and clip selection; reduced motion; failed media fallback; and overflow at 320, 390, 768, 1024, 1440, 1920 and 2558 pixels.

## Direction and implementation

Read `AGENTS.md`, `design/CURRENT-DIRECTION.md`, `docs/IMPLEMENTATION.md` and `docs/FOOTER.md` before changing the page. Design folders preserve approval/rejection history; their presence does not imply approval. Review the live map at http://localhost:3904/#reach-atlas and scroll through the ending at http://localhost:3904/#family. Twenty-one behavioral tests cover the page, including the reversible footer, stable products, static rest, contact links and no-script fallback. 8x Next remains a placeholder; unverified products have no invented destinations.

Next.js App Router, React, TypeScript and CSS. Original local SVG, font and creator media. No animation framework, scroll hijacking, external embeds, analytics, or artificial loading screen. The preview is marked `noindex` until launch is explicitly approved. Buttons link to existing 8x services; this project has no form backend.
