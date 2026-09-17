# Service choices — local implementation

Approved orange section follows Partner Feedback and precedes the original Reach Atlas. Two open columns, fixed typography, fixed CTA positions and photographic halftone hands. The latest user explicitly requested pinning this section until the sequential gestures finish. No timing strip, added controls, tabs or divider.

## Performance

The former timed autoplay is replaced by native scroll progress. Desktop pins the full composition below the measured navbar for 1.8 viewport heights of travel. The first 8% allows arrival, 8–40% scrubs Self Serve's 17 held exposures, 40–48% rests, 48–86% scrubs Full Service's 22 exposures, and the remaining 14% holds the finished poses before release. A small ivory cue travels through the network with the conducting gesture. Scrolling backwards reverses the sequence. Pausing the scroll holds the exact exposure; there is no autoplay timer, wheel interception or body scroll lock.

Below 760px wide, each service pins independently for .95 viewport heights of travel, in document order. The copy, hand and CTA stay together and fit the available height. Desktop canvas composition uses uniform contain scaling, so constrained viewports never squash the hands. Reduced motion and viewports below 520px tall use the static readable layout without extra runway.

The hands use eight genuinely different photographic poses each, generated from the approved references, as transparent WebP sheets. These are frame-based illustrations, not footage of filmed hands. Canvas composes the hand exposures and vector dots; no WebGL, framework or additional dependency. Assets total approximately 638KB. Pixel ratio is capped at two; scroll requests are batched into one animation frame and canvas redraws only when the exposure or size changes. Hidden documents stop scheduling. Reduced motion shows the finished pose. An SVG sprite composition provides the no-JavaScript fallback without pinning. All business content and links remain semantic HTML.

## Surface continuity

MapApproach now begins warming the shared stone surface when Services enters the viewport, so the preceding feedback section turns orange before these choices arrive. Services, navigation and map share the same colour variable. Map geometry, countries, original orange and selection interactions are unchanged. The Scroll Thread switches to orange-surface contrast from Services through the map.

## Sources and files

- Business copy and destinations follow https://www.8x.social/en/for-brands and lib/content.ts. No prices or performance claims added.
- Approved page, motion references, source sheets and exact prompts: design/service-stop-motion-v1/.
- Runtime images: public/media/service-hands/.
- Encoding script: scripts/prepare-service-hands.mjs (original local source paths are documented there).
- Component and styling: components/service-choices.tsx; app/service-choices.css.
- QA: tests/service-choices.spec.ts; updated surface/adjacency assertions in tests/reach-atlas.spec.ts.
- Review: http://localhost:3904/?v=services-pinned-1#services. Scroll to play; scroll backwards to reverse.

## Local rollback

Remove ServiceChoices import/render and stylesheet import, return MapApproach's entrance to reach-atlas, remove services from the header observer and Scroll Thread surface detection. Revert only these narrow changes; the repository contains many unrelated intentional local edits. Do not reset or restore the whole working tree.

All work remains local. No commit, push or deployment is authorized.
