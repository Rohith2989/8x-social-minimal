September 25: approved black-and-blue rebrand is implemented locally from origin/main 82fa59e. Primary blue #0021CC is sampled from the live 8x.social primary buttons. Carbon hero, blue/silver photo and five cool portrait inks; cool paper editorial content; cobalt services/dashboard/map/family with white ink. Preserve animations and geometry. Other product identity colours remain intentional, including Sale orange. Local only, no push/deploy requested. See docs/BLUE-REBRAND.md. This supersedes older orange/yellow palette instructions below.

September 21 correction: user rejected the procedural recreation and requested image-based layered motion. The live family section now uses the isolated artist-rendered infinity in three SVG image layers, a 12-second moving colour mask, subtle depth and stationary five-colour logos. This site uses the ORANGE #F34B32 theme continuous with the map, not Polar. Implementation and push explicitly authorized. See docs/FAMILY-CURRENT.md.

September 21: approved standalone dotted infinity is implemented between map and footer. Twelve-second single-accent current, shallow layered bead motion, fixed five-colour product marks from Raster Human (Social, Business, Sale, Careers, Research). Reusable theme prop and /concepts/family review preserve product colours on every background. User explicitly requested push; supersedes removal/defer for this approved concept. See docs/FAMILY-CURRENT.md. Other website repositories remain untouched.

September 19 update: user requested removing the final animated 8x/product-family section for now, keeping the information footer, starting the hero dot transition earlier, and pushing to Git. The footer now follows the orange map directly. Hero progress includes the photo approach before sticky positioning, preserving the original endpoint, cursor wave and portrait colours. Future infinity design remains deferred.

# 8x Social Minimal

September 18 release: user authorized publishing the previous polish checkpoint and all subsequent local implementation work to `main` for Vercel. Current behavior and scope are summarized in `docs/RELEASE-2026-09-18.md`. Older local-only and main-unchanged notes below describe historical checkpoints. The replacement infinity footer remains a design exploration, not an implemented change.

Latest hero correction: restore the original 36svh bounded panorama and reserve the remaining opening viewport above it, so the photo meets the bottom at every tested size. Original cursor displacement is wired to pointer movement, release and keyboard arrows/Escape; no added controls. Carbon background and five original portrait colours remain. See docs/HERO-ORIGINAL.md. Local only.

Latest local hero: original headline and yellow studio image on black, scrolling through the original dot matrix into five coloured portraits. “Many voices” artwork removed. Review http://localhost:3904/?v=original-hero-carbon-1. Responsive/reduced-motion fallbacks included. See `docs/HERO-ORIGINAL.md`. No commit or push.

Latest local implementation: a three-view dashboard now sits before the map. Native desktop scrolling advances Network overview → Content library (20 tiles per page) → Creator performance inside one fixed window. Real platform marks, working preview controls and a subtle breathing dot background. Review http://localhost:3904/?v=dashboard-pinned-1#dashboard. See `docs/DASHBOARD.md`. Build and targeted responsive/interaction checks cover the preview. No commit or push.


Latest local correction: Services now loops on a continuous eight-second clock, independent of viewport entry, scrolling or return. No pin, input lock or replay triggers; quiet 12fps forward/return poses, staggered self/full gestures, static reduced-motion fallback. Hidden tabs skip drawing but retain the advancing phase. Comparison automatically fills 8x Network when its card enters view, regardless of stationary cursor placement, then supports pointer movement, keyboard and touch choice; rearms after the entire section exits. Supersedes the timed-pin notes below. Keep local; no commit/push.

Latest local refinement: Services plays automatically during a short timed pin, then releases. It replays on each return from above or below without reloading. Scroll scrubbing and extra runway are removed. Review http://localhost:3904/?v=services-autoplay-2#services. Not pushed.

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

## Dashboard design preview

`/dashboard` contains the approved interactive brand workspace with illustrative campaign data and existing 8x creator videos. Includes Overview, Creators, Posts, Feed, Content plan, Analytics and Team. See [dashboard documentation](docs/DASHBOARD-WORKSPACE.md) for scope, demo limitations and verification. No authentication or backend connection is required.
