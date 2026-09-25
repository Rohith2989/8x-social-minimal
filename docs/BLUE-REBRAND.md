# Black and blue — September 25, 2026

Approved after two generated previews of the existing hero and map. The baseline is origin/main `82fa59e`; the previous local infinity experiments were archived in a named Git stash before pulling. Do not reapply them. This implementation is local; no push or deployment was requested.

## Palette and source

The live https://www.8x.social/en primary buttons computed as `rgb(0, 33, 204)` on September 25. Use `#0021CC` for the primary brand colour, `#111111` carbon, and `#F4F6FA` cool paper. Blue text on carbon needs the lighter `#8AA4FF` variant, while white labels sit on cobalt controls and surfaces. These are deliberate contrast roles, not one global hue filter.

## Section decisions

- Hero: carbon remains, CTA is cobalt/white, navigation retains light text and blue accents. The existing WebGL pigment function now maps studio luminance to charcoal, cobalt, blue and silver. Five portrait inks remain distinct within a cool blue/silver palette. The CSS fallback is also blue. Geometry, viewport-bottom photo, cursor wave, scroll release and reduced-motion behaviour are retained.
- Creator footage: retain actual video colours. Borders and active indicators use cool tones; the grid's subtle warm light becomes cool. No destructive media edits.
- Comparison: cool paper and blue accents; the dark fluid reveal uses brighter blue for readable details. A runtime SVG colour matrix recolours the orange strip baked into the original portrait asset. Neutral RGB values and alpha remain invariant.
- Feedback: blue quotation/thread details, cool neutral number-dot substrate. The number field inverts on the dark part of the shared approach so it remains legible.
- Services: cobalt/white copy and inverse white/blue CTAs. Photographic hand gestures are neutral grayscale; light dots replace black dots that would disappear on cobalt. Timed playback remains unchanged.
- Dashboard: cobalt outer stage, cool paper window, carbon sidebar, blue chart endpoints/progress and pale-blue active rail. Creator footage and platform marks stay unaltered. Existing Overview / Content / Creators pin sequence is retained; the next full dashboard product remains a separate task.
- Map: cobalt surface, white covered countries, muted light-blue background geography, cool country labels, light controls and scroll thread. Original coverage, count, density, filtering and cursor selection remain. SVG failure/no-JavaScript fallback uses the same palette.
- Family: a new reusable cobalt theme uses the existing image layers in pale silver with an ice-blue accent. Social's icon is now blue; other products retain their identities (Sale orange, Business violet, Careers blue, Research slate). This is the only intentional brand-orange element on the live page, apart from natural video content.
- Footer: cool paper, carbon information and cobalt links. Header and mobile menu adapt to every background, including the footer and product family.

## Shared surface

MapApproach interpolates cool paper to cobalt over the existing reading interval. Foreground ink is selected by measured relative luminance, avoiding unreadable dark text halfway through the change. No geometry, scroll distance, input handling or added animation framework changes.

## Verification

Production build and focused Playwright checks cover desktop/mobile/ultrawide hero fit, cursor wave, early release, reverse scroll, dashboard states/controls, fluid comparison reveal, continuous hand playback, map interactions/fallback, family/footers, scroll control, reduced motion, no-JavaScript output and contrast throughout the surface transition. New visual captures use `docs/qa/blue-*.png`.

Preview: http://localhost:3904/?v=blue-rebrand-1 (Next production server 3091; proxy 3904).

Final result: production build passed. 37 distinct targeted browser tests passed (25 in the main pass; 14 in the final pass, including two repeated palette checks). No commit or push performed.

Release update: the user subsequently authorized pushing the complete blue rebrand together with the approved /dashboard workspace and its banner, portrait-video and identity refinements to main. See docs/DASHBOARD-WORKSPACE.md.
