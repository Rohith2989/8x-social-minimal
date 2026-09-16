# Layered stone family ending — September 17, 2026

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
