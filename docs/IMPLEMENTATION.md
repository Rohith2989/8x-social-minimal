# Implementation handoff

Latest correction: screen-edge dots now span the document top, including the navigation, with a smooth 100px density fade-in. This removes the abrupt horizontal start at the former hero/header boundary on 1080p and 2K. The layer remains decorative, pointer-transparent, resize-driven and paused offscreen/hidden; portrait composition is unchanged. Sidebar ideas are concepts only, not approved implementation.

## Current hero: screen-edge raster v2

Latest approved implementation: screen-edge raster v2 replaces the rejected photo border. Six SVG paths form asymmetric fields anchored to the physical hero edges. A 12-second cycle breathes opacity and at most 1.4% local width, with no portrait movement. Ultrawide fields broaden and soften, while text clearance stays protected; the orange disc follows the centered portrait group. Offscreen/hidden pauses and static reduced motion are supported. See design/hero-screen-edge-v2 and docs/IMPLEMENTATION.md. Later section/footer redesigns remain pending.

Geometry updates only on resize; six CSS-animated path layers require no per-frame JavaScript. Bands cap at 420px, with fixed small dot spacing and lower overall opacity above 2600px. The top copy is protected with an inset limit. HeroSun measures the image on resize to prevent the orange disc floating away on ultrawide screens. No dependencies were added.

Validation: production build and four targeted Playwright tests, including 320px mobile through 5120px ultrawide, original full-portrait viewport checks, no overflow, edge anchoring, stationary portraits, offscreen pause and reduced motion. Screenshots: docs/qa/screen-edge-*.png. Rollback baseline: fcc03d2 (the rejected photo-border version).


## Latest footer revision

See [FOOTER.md](FOOTER.md) for the current stone ending. It supersedes older deferrals in this history: the family reveal is implemented, with a native-scroll transformation and complete contact/legal footer. Earlier ornamental motion is static; functional media and controls remain. The user rejected the initial orange timed footer. Current revision awaits visual review.

## Viewport correction

app/hero-responsive.css constrains landscape desktop heroes by viewport height as well as width. At 1920×1080 the headline uses two lines and the entire intrinsic portrait frame fits below it; all five faces and upper bodies are visible. The image is scaled proportionally, never cover-cropped. Portrait tablets and phones retain natural flow; short landscape phones get a bounded portrait width. tests/hero-viewport.spec.ts checks 11 desktop/tablet/mobile sizes including 1920×1080, 1366×768 and 2560×1440. Footer progress is capped by the actual remaining document scroll so tall windows reach the final frame.

## Current scope

Fresh repository `Rohith2989/8x-social-minimal`, branch `main`, local port 3091. Old site remains separate and unmodified. User approved implementation of the continuous carbon hero/content proposal, then requested a regenerated portrait with complete shoulders and upper torsos.

The hero has real responsive typography, original serif SVG mark, a separate CSS orange disc, and a monochrome portrait layer. It follows normal document scroll. The portrait is decorative brand imagery, not a claim these people are customers or employees. Original creator clips follow on the same background. No invented performance metrics or client claims.

Wide-screen edge correction: only the portrait layout retains the artwork width cap. The hero itself spans the viewport, allowing the circle to remain round beyond that cap. A horizontal mask on the picture softens its outer 6% on each side, combined with the existing lower-torso fade. This removes the visible rectangular shoulder edges on large screens without cropping the faces. Visually checked at 2558px; see `qa/wide-portrait-blend.png`.

## Motion and media

### Orange Reach Atlas

The latest user explicitly chose the map next. `components/reach-atlas.tsx` and `app/reach-atlas.css` place the original map after the comparison, on the root route at `#reach-atlas`. Geography, country outlines, 4.3px dot strokes and market data come unchanged from the lighter original assets. The inherited display is 61 countries while the source explicitly lists/highlights 51; this port preserves that distinction and invents no extra coverage.

`components/map-approach.tsx` warms the shared stone surface into the original #f34b32 during 0.3 viewport of native scroll: it begins when the map section enters the viewport and completes when its top reaches 70% of viewport height, before the geography arrives. The header, comparison accents, photo-edge canvas backgrounds follow the same surface; the final family/footer area uses its own stone surface. Reversing scroll restores it exactly. No added pin, timer, wheel interception, full-page wipe or divider. Reduced motion switches the surface without interpolation. Event-driven requestAnimationFrame batches scroll/resize updates; there is no idle animation loop.

Country hover/click selection and stable country accents remain; decorative lifts are now disabled. Country labels now use the light highlight colour with dark text for contrast. Region buttons filter available choices and dim other countries; the native selector supports keyboard use and small markets. On phones the map is a native horizontal scroll region and selecting a market centres that area. Escape and the clear button release selection. Atlas JSON loads near the section; a local SVG remains visible if it fails, with the country selector still usable. Reduced motion removes lifts, parallax and label motion.

The map uses original local assets and CSS/SVG only, with no new dependencies, generated geometry, density increase or WebGL. The old map-to-finale animation is not imported. Brand proof, service choices and dashboard remain future editorial work; the 8-to-infinity ending is now implemented; see FOOTER.md.

`components/network-comparison.tsx` and `app/network-comparison.css` implement the approved comparison after Dot Reach on the same #e9e5dc surface. The selector controls one shared panel, with the intrinsic heights of all modes reserved through a layered CSS grid. Inactive panels are inert and hidden from assistive technology. Arrow keys/Home/End select modes; Tab reaches the selected panel. 108 decorative SVG dots switch instantly within three small fixed glyph bounds, with no animation framework or perpetual loop. Reduced motion disables transitions and the one-time entrance. Narrow layouts stack the explanations with orange bullets. Content avoids invented metrics or categorical claims about competitors.

Initial deep links below the creator reading interval are restored once page/font layout settles, because the interval adds height during hydration. This is a one-time initial-fragment correction, cancelled by user input and on cleanup. It does not take control of normal scrolling. Removed global CSS smooth scrolling so the browser's initial anchor animation cannot finish at a stale pre-hydration position; native scrolling is unchanged and in-page links now land immediately.

Continuity cleanup: removed top/bottom navigation rails and link dividers, Day-to-day accordion rules/active bars, Dot Reach top rule and footer rule. Desktop Day-to-day bottom padding is 60px and Reach padding is 52px/64px. The header follows the stone surface after its leading edge reaches the header and returns to carbon above it; scroll/resize reads are batched in one animation frame, with no idle loop. The mobile menu uses that same surface. Existing navigation feedback, keyboard focus and video controls remain. Rejected chart/fan proposals are not live.

- On sufficiently large/tall desktop viewports, the content stage holds for 0.95 viewport height of additional native scroll, capped at 1100px. No wheel or touch interception. Media frames maintain identical geometry.
- Scroll changes the active clip, caption, underline, brightness and progress dot. Only the active visible video plays; it starts muted. Offscreen and hidden-document videos pause.
- Manual selection holds until another 110px of vertical scrolling. Explicitly enabled sound holds selection until the stage leaves view. Pausing is respected for that clip. Seeking, mute, playback and original-source links remain accessible.
- Narrow or short screens use normal flow; phones use a horizontal native rail and manual selection. Reduced motion removes the sticky distance and transitions and requires deliberate playback.
- Loading errors preserve a link to the original media. Hero and poster images render without JavaScript; playback and selection need JavaScript. No video files are requested before an eligible clip needs them.

`components/creator-work.tsx` owns selection and geometry. `components/creator-video.tsx` owns media state. `components/header.tsx` handles section state and mobile navigation. Styling is in `app/globals.css`; outgoing links/content are in `lib/content.ts`.

## Validation

Production build and TypeScript checks pass. The expanded suite contains twenty-one serial Chromium behavioral tests, including original map coverage/density/colour, hover and selection, region filtering, small markets, reversible shared-surface approach, reduced motion and failed-atlas fallback; comparison mode switching, stable panel/footer geometry, keyboard navigation, direct fragment navigation, Day-to-day and Dot Reach on the root route, distinct creator assets, fixed media geometry, static raster edges and the scroll-driven footer, video failure and offscreen playback. Responsive checks span 320–2558px. Map QA images are in docs/qa/map-desktop.png and map-mobile.png. Live in-app browser review uses 3904. Browser/device-specific Safari and Firefox verification has not been performed. Native autoplay policy can require the visible Play control.

Day-to-day is included after CreatorWork, followed immediately by Dot Reach. Their CSS is in app/day-to-day.css and app/dot-reach.css. Both use #e9e5dc with no gap, colour wipe, transform of the full section or added sticky interval. The closing contact area continues this surface. The old concept route remains valid. Port 3904 is a local streaming proxy to the single production server on 3091 (npm run preview:alias).

Dot Reach uses original Maggie footage with CSS grayscale/multiply and a canvas overlay whose round holes reveal the live video. Only the perimeter is drawn: the face and layout remain steady. Canvas DPR is capped at 1.5. The raster edge is now static, redrawn only on resize or shared-surface changes. There is no idle or hover animation loop. Per the latest request, Maggie autoplays muted at 30% visibility, pauses offscreen/hidden, and resumes on re-entry unless deliberately paused. Reduced motion still requires deliberate playback. Liv remains manually played. Both have original-source error links. No generated portrait or screenshot is used as runtime UI. Production build and both targeted Dot Reach tests passed after the autoplay change; autoplay was visibly verified in the in-app browser.

Creator rail: Nick, Mindful Witmee, Chow. Day-to-day: Liv. Dot Reach: Maggie. All five are separate creators from the original site's recent-work gallery; see docs/ASSETS.md and assets/creators/provenance.json. The three old demo assets remain for rollback but are not referenced by the current page. The hero montage remains only in the hero.

A test caught the sticky stage escaping its container when extra reading distance was padding. The container now uses measured min-height so the frames hold in place throughout the sequence.

## Future work / constraints

Preserve the now-integrated original Reach Atlas and its exact orange `#f34b32`. The family ending is implemented after the map. Confirm the fifth product name and unverified product destinations before public launch; see FOOTER.md. Do not reinstate rejected standalone scenes, the old loader, diagram sections or repeated studio montage.

Before a public launch, review final content and links, decide indexing/social metadata, and verify on target browsers. No hosting deployment has been performed.

## Hero circle correction (2026-09-17)
The orange circle is now sized to 60% of the portrait composition height and inset 20% from the right, with its top inside the frame. This keeps the circle behind faces instead of under the translucent shoulder perimeter. The bottom mask belongs to the combined portrait/circle container; only the horizontal edge fade stays on the portrait. Desktop viewport budgeting and full intrinsic image framing are unchanged. Verified the existing 11 hero sizes, including 1920x1080, and refreshed docs/qa/hero-*.png. No source image changes.

## Hero raster edge (2026-09-17)

Approved concept: design/hero-raster-edge-v1/01-hero-motion-board.png. The live implementation preserves the current portrait and circle composite and adds a narrow neutral raster edge. Three SVG paths combine all dots, generated on resize rather than per frame. Eight-second CSS opacity/translation cycles (.48–.62 opacity, at most .45px x / .65px y) are staggered. These three paths are the only exception to the earlier CSS motion reset. No animation framework, WebGL, new dependency or image generation is used at runtime.

IntersectionObserver and document visibility pause the effect. Reduced motion keeps a static edge; no-JavaScript keeps the original photo. Overlay ignores pointer events and accessibility traversal. Its dimensions follow the actual photo rather than the full viewport, preserving full framing on ultrawide screens. Existing composition mask fades the lower edge into carbon.

Production build passes. Three targeted Playwright tests pass: fixed photo and bounded motion, offscreen/reduced-motion handling, and the existing 11 desktop/tablet/phone viewport checks. Fresh captures: docs/qa/hero-*.png. Live review: http://localhost:3904/?v=hero-raster-edge-1. The next-section/footer redesign request is recorded but not implemented in this hero-only change.
