# Layered stone family ending — September 17, 2026

## Footer information

The user requested a more useful footer inspired by Listen Labs and explicitly asked to push everything. Under the brand/contact row, an open grid now contains a short brand description, Services (creator network, managed service, DIY tracking), Explore (brands, creators, how it works, markets), and Company (blog, LinkedIn, contact). Privacy/Terms and copyright remain below. No divider lines, new surface colour or extra animation. At tablet size the description spans all three columns; phones use two navigation columns. Service/blog/legal destinations were checked against the original https://www.8x.social/en/for-brands footer on September 17; the hierarchy reference was https://listenlabs.ai/. No invented addresses, product destinations or company claims.

## Current revision: small, slow colour current

This section supersedes the stationary-endpoint descriptions below. The user selected `design/footer-color-current-v1`, then rejected a fixed-grid implementation, a generic ribbon, and excessive motion/colour. Latest direction: subtle movement and just a small colour trace. Review at http://localhost:3904/?v=subtle-current-2#family and scroll down.

The existing original-SVG lift/turn/print entrance remains intact. At 83% progress it crossfades into a canvas surface based on 1,452 dot positions and radii measured from the approved board. The colour accent occupies at most 12% of the loop's path, softly blends into carbon, and circles in 40 seconds. Dot drift is bounded to 0.55 SVG units, with 0.1% breathing over 14 seconds and a 0.25-unit depth wave. Dots do not shuffle between positions, blink or disappear. Radial shading gives each dot shallow depth. This is a code-rendered interpretation of the artwork, not an exact reproduction or an embedded screenshot.

`lib/infinity-current.ts` owns the surface renderer. The visible endpoint has its own clock; it stops offscreen and when the document is hidden. Reduced motion shows a still accent; no-JavaScript retains the black SVG fallback. Canvas resolution caps at 1.75 DPR and mobile paints at roughly 30 fps. Scroll reversal removes the canvas and restores the original layered entrance. Products and links remain stationary. No new runtime dependencies.

Final production build/TypeScript and all five targeted footer tests pass. Earlier full-suite run passed 22 tests. Tests verify a restrained coloured pixel fraction, visible but bounded surface movement, stationary products, reverse, reduced motion, offscreen pause, mobile, tall windows and no-script fallback. QA: `docs/qa/footer-current-*.png`. Visual approval is pending. Rollback baseline: `c797c0e`.

## Historical v3 baseline

The first orange, entrance-timed footer was rejected: the user saw it already settled and could not find a real footer. The subsequent point-morph version was also rejected. The user requested a generated sequence and suggested layered motion; see design/footer-layered-v3. The user now likes the final v3 dotted mark and responsive result. Its refined motion awaits review. The current layered revision uses warm stone (#e9e5dc), connected to the original orange map by a narrow raster seam. The map's palette, geometry and density are unchanged. Review at http://localhost:3904/?v=layered-finish-4#family, then scroll down.

## Sequence and layout

`components/family-footer.tsx` and `app/family-footer.css` implement a native-scroll sequence. The original SVG 8x appears first. The x fades, the complete 8 lifts 18 SVG units with three shallow registration layers, then rotates clockwise into a horizontal figure-eight. The layers compress as it lands. A left-to-right print mask reveals a fixed halftone layer beneath it. No dots travel independently. Lift begins at 7%, turn runs from 18–54%, landing completes at 60%, printing runs from 60–83%; the remaining 17% holds the exact approved endpoint. Products stay readable in a fixed right column; phones stack the artwork above the directory. A separate semantic footer follows with the original brand, Build your network CTA, creator/contact/LinkedIn links, legal links and back-to-top.

When the complete stage fits the viewport, CSS sticky holds it over 1.15 viewport heights of additional native scrolling. There is no wheel/touch interception. The SVG transforms and masks follow scroll with 85ms damping and stop updating at rest; scrolling back reconstructs the original logo. The effective progress distance is capped by the actual remaining document scroll, fixing an unfinished end frame on tall windows. Short viewports use entry progress without pinning. Reduced motion renders the settled illustration without added scroll distance. No JavaScript uses a matching static SVG and ordinary links.

The SVG print layer uses 2,288 stationary dots. Original path geometry and samples are baked by `node scripts/build-footer-mark.mjs` from `public/8x.svg`. Only group transforms, opacity and mask coordinates change during scrolling; no per-dot transforms, physics, canvas redraw, WebGL or new animation dependency. The SVG fallback shares the final dot geometry. The exact vector mark takes precedence over the approximate mark in the generated board.

Earlier ornamental canvas edge ripples and CSS transitions are now static per the request that the footer be the only decorative animation. Native video playback, playback controls, creator selection, comparison tabs, map selection/filtering and the existing stone-to-orange approach remain functional. Header colour returns to stone when the footer arrives.

## Products and destinations

The user's labels/order are Careers, Sale (singular), Social, Research and a fifth placeholder. Careers links to https://8x.careers; Social returns to the local network section. Sale and Research remain plain labels because destinations were not confirmed. **8x Next is explicitly labelled Placeholder**, not a claimed real product. No invented product URLs. Confirm the fifth name and remaining destinations before launch.

## Validation and rollback

Production build and TypeScript pass. All 21 behavioral tests passed on the v3 baseline; the six targeted footer/hero tests pass after this refinement. The rest/reverse test now also verifies the settled SVG remains identical over the final reading interval. Checks cover scroll phases, stationary directory, deterministic reverse, rest without looping, semantic footer/links, mobile, reduced motion, no-script fallback and overflow through 2558px. QA frames are `docs/qa/footer-v3-*.png`. The local browser was also checked through the actual scroll sequence. Safari/Firefox have not been verified.

The original map-only baseline is commit `31d6628`. Both v1 and v2 remain rejected historical implementations. The v3 generated board was produced before the layered implementation. The v1 generated board remains in `design/footer-infinity-v1` as historical direction; its orange timed implementation is rejected. Do not restore it as the current approved design. No deployment or dependency changes accompany this revision.
