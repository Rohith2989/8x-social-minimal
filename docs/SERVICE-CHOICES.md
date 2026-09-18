# Service Choices — current continuous playback

Latest request supersedes all earlier pin/re-entry choreography. Both hand illustrations share an ongoing eight-second clock: self tap, quiet return to rest, full-service conducting gesture, return to rest, repeat. The original photographed poses and 12fps held exposures remain. Viewport entry and scrolling never start, stop or reset the phase. No scroll interception or pinned runway remains.

The clock advances while the section is offscreen. Hidden browser tabs skip painting, then sample the current phase on return. Reduced motion shows the final still. Failed assets and no-JavaScript retain the SVG illustration fallback. Responsive desktop/mobile layouts remain fitted, with normal native scrolling and unchanged CTAs.

Local only; no Git push. Previous implementation notes below are historical.

# Service choices — local implementation

Approved orange section follows Partner Feedback and precedes the original Reach Atlas. Two open columns, fixed typography, fixed CTA positions and photographic halftone hands. The latest user explicitly requested pinning this section until the sequential gestures finish. No timing strip, added controls, tabs or divider.

## Performance

Latest correction: scroll scrubbing is rejected. The gestures now play on a time-based clock while the composition stays at the reading position. Desktop: 180ms arrival, Self Serve's 17 exposures at 12fps, 300ms pause, Full Service's 22 exposures at 12fps, then 250ms final hold. This is approximately four seconds, independent of scrolling speed. The pin then releases and normal scrolling continues. There is no added scroll runway and no collapsing spacer on release.

Below 760px wide, each service performs independently when it reaches the reading position. The copy, hand and CTA stay together and fit the available height. Each performance rearms once its panel has fully left the viewport, then automatically plays forwards on the next visit from either direction. No reload is needed. It does not loop endlessly while the reader stays in the section. Desktop canvas composition uses uniform contain scaling. Reduced motion and viewports below 520px tall use the static readable layout.

Wheel, single-touch scrolling and scrolling keys are held only during the short active performance; direct scroll changes are clamped to its anchor. Escape, Tab, following a link, focusing outside the section or using the custom Scroll Thread releases immediately. No body overflow/position changes are made, preserving scrollbar width. Pinning only starts when the required artwork has loaded and the panel fits. Missing artwork never traps scrolling. Hidden tabs pause the clock; resize/reduced-motion changes safely release incompatible active layouts. All listeners and animation frames are removed on unmount.

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
- Review: http://localhost:3904/?v=services-autoplay-2#services. Enter the section to play; leave and return to replay.

## Local rollback

Remove ServiceChoices import/render and stylesheet import, return MapApproach's entrance to reach-atlas, remove services from the header observer and Scroll Thread surface detection. Revert only these narrow changes; the repository contains many unrelated intentional local edits. Do not reset or restore the whole working tree.

All work remains local. No commit, push or deployment is authorized.
