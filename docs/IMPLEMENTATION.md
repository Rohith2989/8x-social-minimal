# Implementation handoff

## Current scope

Fresh repository `Rohith2989/8x-social-minimal`, branch `main`, local port 3091. Old site remains separate and unmodified. User approved implementation of the continuous carbon hero/content proposal, then requested a regenerated portrait with complete shoulders and upper torsos.

The hero has real responsive typography, original serif SVG mark, a separate CSS orange disc, and a monochrome portrait layer. It follows normal document scroll. The portrait is decorative brand imagery, not a claim these people are customers or employees. Original creator clips follow on the same background. No invented performance metrics or client claims.

Wide-screen edge correction: only the portrait layout retains the artwork width cap. The hero itself spans the viewport, allowing the circle to remain round beyond that cap. A horizontal mask on the picture softens its outer 6% on each side, combined with the existing lower-torso fade. This removes the visible rectangular shoulder edges on large screens without cropping the faces. Visually checked at 2558px; see `qa/wide-portrait-blend.png`.

## Motion and media

### Orange Reach Atlas

The latest user explicitly chose the map next. `components/reach-atlas.tsx` and `app/reach-atlas.css` place the original map after the comparison, on the root route at `#reach-atlas`. Geography, country outlines, 4.3px dot strokes and market data come unchanged from the lighter original assets. The inherited display is 61 countries while the source explicitly lists/highlights 51; this port preserves that distinction and invents no extra coverage.

`components/map-approach.tsx` warms the shared stone surface into the original #f34b32 during 0.3 viewport of native scroll: it begins when the map section enters the viewport and completes when its top reaches 70% of viewport height, before the geography arrives. The header, comparison accents, photo-edge canvas backgrounds and closing contact area follow the same surface. Reversing scroll restores it exactly. No added pin, timer, wheel interception, full-page wipe or divider. Reduced motion switches the surface without interpolation. Event-driven requestAnimationFrame batches scroll/resize updates; there is no idle animation loop.

Original country hover/click lifts and stable country accents remain. Country labels now use the light highlight colour with dark text for contrast. Region buttons filter available choices and dim other countries; the native selector supports keyboard use and small markets. On phones the map is a native horizontal scroll region and selecting a market centres that area. Escape and the clear button release selection. Atlas JSON loads near the section; a local SVG remains visible if it fails, with the country selector still usable. Reduced motion removes lifts, parallax and label motion.

The map uses original local assets and CSS/SVG only, with no new dependencies, generated geometry, density increase or WebGL. The old map-to-finale animation is not imported. Brand proof, service choices and dashboard remain future editorial work; the original 8-to-infinity ending remains deferred.

`components/network-comparison.tsx` and `app/network-comparison.css` implement the approved comparison after Dot Reach on the same #e9e5dc surface. The selector controls one shared panel, with the intrinsic heights of all modes reserved through a layered CSS grid. Inactive panels are inert and hidden from assistive technology. Arrow keys/Home/End select modes; Tab reaches the selected panel. 108 decorative SVG dots morph within three small fixed glyph bounds, with no animation framework or perpetual loop. Reduced motion disables transitions and the one-time entrance. Narrow layouts stack the explanations with orange bullets. Content avoids invented metrics or categorical claims about competitors.

Initial deep links below the creator reading interval are restored once page/font layout settles, because the interval adds height during hydration. This is a one-time initial-fragment correction, cancelled by user input and on cleanup. It does not take control of normal scrolling. Removed global CSS smooth scrolling so the browser's initial anchor animation cannot finish at a stale pre-hydration position; native scrolling is unchanged and in-page links now land immediately.

Continuity cleanup: removed top/bottom navigation rails and link dividers, Day-to-day accordion rules/active bars, Dot Reach top rule and footer rule. Desktop Day-to-day bottom padding is 60px and Reach padding is 52px/64px. The header follows the stone surface after its leading edge reaches the header and returns to carbon above it; scroll/resize reads are batched in one animation frame, with no idle loop. The mobile menu uses that same surface. Existing navigation feedback, keyboard focus and video controls remain. Rejected chart/fan proposals are not live.

- On sufficiently large/tall desktop viewports, the content stage holds for 0.95 viewport height of additional native scroll, capped at 1100px. No wheel or touch interception. Media frames maintain identical geometry.
- Scroll changes the active clip, caption, underline, brightness and progress dot. Only the active visible video plays; it starts muted. Offscreen and hidden-document videos pause.
- Manual selection holds until another 110px of vertical scrolling. Explicitly enabled sound holds selection until the stage leaves view. Pausing is respected for that clip. Seeking, mute, playback and original-source links remain accessible.
- Narrow or short screens use normal flow; phones use a horizontal native rail and manual selection. Reduced motion removes the sticky distance and transitions and requires deliberate playback.
- Loading errors preserve a link to the original media. Hero and poster images render without JavaScript; playback and selection need JavaScript. No video files are requested before an eligible clip needs them.

`components/creator-work.tsx` owns selection and geometry. `components/creator-video.tsx` owns media state. `components/header.tsx` handles section state and mobile navigation. Styling is in `app/globals.css`; outgoing links/content are in `lib/content.ts`.

## Validation

Production build and TypeScript checks pass. All fifteen serial Chromium behavioral tests pass, including original map coverage/density/colour, hover and selection, region filtering, small markets, reversible shared-surface approach, reduced motion and failed-atlas fallback; comparison mode switching, stable panel/footer geometry, keyboard navigation, direct fragment navigation, Day-to-day and Dot Reach on the root route, distinct creator assets, fixed media geometry, working raster motion, video failure and offscreen playback. Responsive checks span 320–2558px. Map QA images are in docs/qa/map-desktop.png and map-mobile.png. Live in-app browser review uses 3904. Browser/device-specific Safari and Firefox verification has not been performed. Native autoplay policy can require the visible Play control.

Day-to-day is included after CreatorWork, followed immediately by Dot Reach. Their CSS is in app/day-to-day.css and app/dot-reach.css. Both use #e9e5dc with no gap, colour wipe, transform of the full section or added sticky interval. The closing contact area continues this surface. The old concept route remains valid. Port 3904 is a local streaming proxy to the single production server on 3091 (npm run preview:alias).

Dot Reach uses original Maggie footage with CSS grayscale/multiply and a canvas overlay whose round holes reveal the live video. Only the perimeter is drawn: the face and layout remain steady. Canvas DPR is capped at 1.5, animation at 24fps. The entry settles after 1.8 seconds and hover after 1.6 seconds; idle, offscreen and hidden-document loops stop. Native scroll adjusts only the edge pattern. Reduced motion is static. Per the latest request, Maggie autoplays muted at 30% visibility, pauses offscreen/hidden, and resumes on re-entry unless deliberately paused. Reduced motion still requires deliberate playback. Liv remains manually played. Both have original-source error links. No generated portrait or screenshot is used as runtime UI. Production build and both targeted Dot Reach tests passed after the autoplay change; autoplay was visibly verified in the in-app browser.

Creator rail: Nick, Mindful Witmee, Chow. Day-to-day: Liv. Dot Reach: Maggie. All five are separate creators from the original site's recent-work gallery; see docs/ASSETS.md and assets/creators/provenance.json. The three old demo assets remain for rollback but are not referenced by the current page. The hero montage remains only in the hero.

A test caught the sticky stage escaping its container when extra reading distance was padding. The container now uses measured min-height so the frames hold in place throughout the sequence.

## Future work / constraints

Preserve the now-integrated original Reach Atlas and its exact orange `#f34b32`. After the map, an 8-to-infinity reveal for the wider product family is requested but explicitly deferred. Confirm actual product names/content before building it. Do not reinstate rejected standalone scenes, the old loader, diagram sections or repeated studio montage.

Before a public launch, review final content and links, decide indexing/social metadata, and verify on target browsers. No hosting deployment has been performed.
