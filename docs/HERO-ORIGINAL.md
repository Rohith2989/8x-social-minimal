# Original photographic hero on carbon

September 18, local only. User approved the black photographic hero concept, then explicitly requested the original five portrait colours and removal of the right-hand “Many voices” artwork. These instructions supersede the former static five-person hero, orange disc and monochrome concept endpoint.

## Latest correction

The first implementation left empty space below the photo and omitted pointer event wiring. The opening now reserves viewport height minus the measured header and the original bounded 36svh image band. This places the photo bottom at the viewport bottom across desktop, tablet, portrait phone and short landscape. Font/content height stays readable. The existing renderer receives stage-relative pointer positions, uses its original exponential easing and six-unit broad displacement, and releases on leave/cancel/touch-up. Keyboard arrows and Escape offer the same effect without a permanent toolbar. Pointer motion does not intercept scrolling.

## Layout

- Original headline: “Creator networks. Built for your brand.” Supporting copy and two links occupy the right column, stacking below on mobile. Existing minimal navigation is retained.
- The original full-width yellow studio panorama follows the copy. Its wider source preserves the full original central scene; only extended room scenery can leave the viewport.
- A native sticky stage carries the photo through the original patch-release dot matrix into five coloured portraits. Yellow, blue, cream, lavender and orange use the original shader palette. The black page stays `#111` throughout.
- Final “A world of voices.” heading appears after the portraits settle. A final reading interval precedes the existing CreatorWork section. Backward scrolling reconstructs the photograph.
- The existing subtle screen-edge breathing texture continues through hero and CreatorWork. No “Many voices” panel, orange disc, loading intro, small captions or pause toolbar is added.

## Implementation and provenance

`components/hero.tsx` and `components/hero-photo-journey.tsx`; responsive overrides in `app/hero-original.css`. `lib/hero-raster-engine.ts` and `lib/hero-raster-shaders.ts` are adapted from the user's original sibling `8x-social` repo, not an approximation built from the generated board.

Source images copied unchanged into `public/media/hero-original`: `studio.webp` from original `studio-panorama-wide-v1.webp`; `portraits.webp` from original `atlas-portraits-v1.webp`. These are existing approved editorial imagery, not customer identity/performance evidence.

Small screens use 1.95px pitch and 1.65px dots for facial detail. Original 3.8px dot pitch is preserved at 1080p and geometry is bounded to approximately 145k points at larger sizes. DPR capped at 1.75, low-power WebGL, two draw layers. All five people fit inside the destination frame, including narrow screens. Source band uses the original bounded aspect-ratio rule to preserve the full central scene.

No wheel/touch interception. Scroll updates are rAF-coalesced, and hidden/offscreen drawing stops. Reduced motion and no-JavaScript show both complete compositions in normal document flow, with a CSS five-colour halftone fallback. Context loss falls back to the same image sequence without blanking the section.

## Review

http://localhost:3904/?v=original-hero-carbon-1

`tests/hero-viewport.spec.ts` covers forward/reverse progress, viewport fit, absence of the removed artwork, bounded points, offscreen pause, context loss, reduced motion and no-JS. Existing edge tests now target the studio photo instead of the replaced portrait/circle. Screenshots under `docs/qa/hero-original-*` and `docs/qa/hero-voices-*`.

Keep changes local. Do not commit, push or deploy without a new user request.
