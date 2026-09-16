# Implementation handoff

## Current scope

Fresh repository `Rohith2989/8x-social-minimal`, branch `main`, local port 3091. Old site remains separate and unmodified. User approved implementation of the continuous carbon hero/content proposal, then requested a regenerated portrait with complete shoulders and upper torsos.

The hero has real responsive typography, original serif SVG mark, a separate CSS orange disc, and a monochrome portrait layer. It follows normal document scroll. The portrait is decorative brand imagery, not a claim these people are customers or employees. Original creator clips follow on the same background. No invented performance metrics or client claims.

Wide-screen edge correction: only the portrait layout retains the artwork width cap. The hero itself spans the viewport, allowing the circle to remain round beyond that cap. A horizontal mask on the picture softens its outer 6% on each side, combined with the existing lower-torso fade. This removes the visible rectangular shoulder edges on large screens without cropping the faces. Visually checked at 2558px; see `qa/wide-portrait-blend.png`.

## Motion and media

- On sufficiently large/tall desktop viewports, the content stage holds for 0.95 viewport height of additional native scroll, capped at 1100px. No wheel or touch interception. Media frames maintain identical geometry.
- Scroll changes the active clip, caption, underline, brightness and progress dot. Only the active visible video plays; it starts muted. Offscreen and hidden-document videos pause.
- Manual selection holds until another 110px of vertical scrolling. Explicitly enabled sound holds selection until the stage leaves view. Pausing is respected for that clip. Seeking, mute, playback and original-source links remain accessible.
- Narrow or short screens use normal flow; phones use a horizontal native rail and manual selection. Reduced motion removes the sticky distance and transitions and requires deliberate playback.
- Loading errors preserve a link to the original media. Hero and poster images render without JavaScript; playback and selection need JavaScript. No video files are requested before an eligible clip needs them.

`components/creator-work.tsx` owns selection and geometry. `components/creator-video.tsx` owns media state. `components/header.tsx` handles section state and mobile navigation. Styling is in `app/globals.css`; outgoing links/content are in `lib/content.ts`.

## Validation

Production build and TypeScript checks pass. Ten serial Chromium behavioral tests pass, including Day-to-day and Dot Reach on the root route, distinct creator assets, fixed media geometry, working raster motion, reduced motion, video failure and offscreen playback. Responsive checks span 320–2558px. Browser visual review completed at desktop and phone sizes; Maggie playback was also verified in the in-app browser on 3904. Browser/device-specific Safari and Firefox verification has not been performed. Native autoplay policy can require the visible Play control.

Day-to-day is included after CreatorWork, followed immediately by Dot Reach. Their CSS is in app/day-to-day.css and app/dot-reach.css. Both use #e9e5dc with no gap, colour wipe, transform of the full section or added sticky interval. The closing contact area continues this surface. The old concept route remains valid. Port 3904 is a local streaming proxy to the single production server on 3091 (npm run preview:alias).

Dot Reach uses original Maggie footage with CSS grayscale/multiply and a canvas overlay whose round holes reveal the live video. Only the perimeter is drawn: the face and layout remain steady. Canvas DPR is capped at 1.5, animation at 24fps. The entry settles after 1.8 seconds and hover after 1.6 seconds; idle, offscreen and hidden-document loops stop. Native scroll adjusts only the edge pattern. Reduced motion is static. Per the latest request, Maggie autoplays muted at 30% visibility, pauses offscreen/hidden, and resumes on re-entry unless deliberately paused. Reduced motion still requires deliberate playback. Liv remains manually played. Both have original-source error links. No generated portrait or screenshot is used as runtime UI. Production build and both targeted Dot Reach tests passed after the autoplay change; autoplay was visibly verified in the in-app browser.

Creator rail: Nick, Mindful Witmee, Chow. Day-to-day: Liv. Dot Reach: Maggie. All five are separate creators from the original site's recent-work gallery; see docs/ASSETS.md and assets/creators/provenance.json. The three old demo assets remain for rollback but are not referenced by the current page. The hero montage remains only in the hero.

A test caught the sticky stage escaping its container when extra reading distance was padding. The container now uses measured min-height so the frames hold in place throughout the sequence.

## Future work / constraints

Preserve the liked original Reach Atlas and its exact orange `#f34b32` when the later page is built. Design the approach to it as part of the continuous page. After the map, an 8-to-infinity reveal for the wider product family is requested but explicitly deferred. Confirm actual product names/content before building it. Do not reinstate rejected standalone scenes, the old loader, diagram sections or repeated studio montage.

Before a public launch, review final content and links, decide indexing/social metadata, and verify on target browsers. No hosting deployment has been performed.
