# Hero raster edge — proposal

Update: approved and implemented. The user explicitly requested very subtle motion, so the live version extends the proposed six-second cycle to eight seconds and limits travel to less than one pixel. `components/hero-raster-edge.tsx` builds three deterministic SVG paths around the existing portrait; `app/hero-raster-edge.css` supplies gentle opacity/translation. No generated screenshot is embedded in the page. Pauses offscreen/hidden, static with reduced motion. Without JavaScript the original unaltered portrait remains. The historical proposal below explains the supplied concept.

First task in the September 17 feedback round: keep the five-person hero and generate a preview of a fine animated dotted perimeter based on the user's supplied border reference. The proposal preserves the existing carbon hero and orange accents. Faces and shoulders stay still; only the narrow raster edge gently changes dot radius/density over a six-second cycle, with about two pixels of travel.

The generated board shows the full hero and three illustrative close-up keyframes. These are concept stills, not a recording or an implemented animation. Built-in image generation; exact prompt is in prompt.json. The portrait identities/layout are preservation targets, not a guarantee of pixel-identical generated output.

Implementation should reuse the current portrait asset with a code-native edge layer rather than animate the people or use the generated page screenshot. Reduced motion must keep a static perimeter. Await user feedback on this concept before implementing.

Other newly requested changes are recorded in CURRENT-DIRECTION.md for subsequent tasks.
