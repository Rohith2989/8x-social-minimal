# 8x Social Minimal

Overnight checkpoint: `work/minimal-polish-2026-09-18` contains the saved work, with branch-specific Vercel Git deployments disabled. Main is unchanged; merge only when requested. See `docs/HANDOFF-2026-09-18.md` to resume.

Latest local refinement: Services now pins while native scrolling plays Self Serve, then Full Service, then holds before the map. Mobile pins each choice separately; reduced motion removes the runway. Review http://localhost:3904/?v=services-pinned-1#services. Scroll to play or reverse. No commit or push.

Latest local update: orange Self Serve / Full Service choices use staggered photographic stop-motion hands, then settle. Review http://localhost:3904/?v=service-stop-motion-1#services (reload to replay). The shared orange surface continues through the original map. See `docs/SERVICE-CHOICES.md`. No commit or push.

Latest local update: partner feedback now follows comparison, with an automatic dot pressure ripple and central fluid-ink reveal, then a still reading state. Review http://localhost:3904/?v=feedback-impression-1#partner-feedback. See `docs/PARTNER-FEEDBACK.md`. No commit or push.

Latest local update: the comparison now follows the approved photographic direction with three always-visible columns, dark hover/focus/touch panels and a restrained orange halftone breath. Review http://localhost:3904/?v=comparison-editorial-1#comparison. See `docs/COMPARISON.md`. No commit or push.

Latest local update: the two repetitive stone video sections are merged into a continuous 18-clip showcase with a slow shared colour reveal and halftone perimeter. All 42 original showcase clips are imported locally; playback is limited to nearby visible clips. See `docs/VIDEO-SURFACE.md`. Review at http://localhost:3904/?v=video-surface-1#showcase. Changes remain uncommitted and unpushed, as requested.

Latest footer update: the original layered SVG entrance now leads into a mostly carbon dotted infinity with a small, slow colour trace and subpixel breathing. It stops offscreen and respects reduced motion. The latest implementation awaits visual review; see `docs/FOOTER.md` for the current specification, validation and rollback point.

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
