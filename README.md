# 8x Social Minimal

The new minimal 8x landing page, built separately from the original `8x-social` project. Current implementation covers the approved carbon hero and continuous creator-content sequence, with a small closing contact area.

## Run

Requires Node 22. Install with `npm ci`, then `npm run dev`. Open http://localhost:3091.

For a production preview: `npm run build` then `npm run start`. Both commands use port 3091; do not stop other projects' servers. Stop an existing 3091 process before switching between development and production.

## Verify

`npm run typecheck`, `npm run build`, `npm test`. Playwright runs serially against a production preview on 3091, starting one if necessary. Install the Chromium test browser with `npx playwright install chromium` if absent.

The tests cover native scroll selection with stable media geometry; manual pause and sound; offscreen playback; mobile navigation and clip selection; reduced motion; failed media fallback; and overflow at 320, 390, 768, 1024, 1440, 1920 and 2558 pixels.

## Direction and implementation

Read `AGENTS.md`, `design/CURRENT-DIRECTION.md` and `docs/IMPLEMENTATION.md` before changing the page. Design folders preserve approval/rejection history; their presence does not imply approval. The original orange Reach Atlas and eventual 8-to-infinity family reveal are future work, not implemented yet.

Next.js App Router, React, TypeScript and CSS. Original local SVG, font and creator media. No animation framework, scroll hijacking, external embeds, analytics, or artificial loading screen. The preview is marked `noindex` until launch is explicitly approved. Buttons link to existing 8x services; this project has no form backend.
