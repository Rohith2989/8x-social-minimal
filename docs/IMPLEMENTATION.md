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

Production build and TypeScript checks pass. Six serial Chromium behavioral tests pass. Responsive checks span 320–2558px. Browser visual review completed at desktop and phone sizes. Browser/device-specific Safari and Firefox verification has not been performed. Native autoplay policy can require the visible Play control.

A test caught the sticky stage escaping its container when extra reading distance was padding. The container now uses measured min-height so the frames hold in place throughout the sequence.

## Future work / constraints

Preserve the liked original Reach Atlas and its exact orange `#f34b32` when the later page is built. Design the approach to it as part of the continuous page. After the map, an 8-to-infinity reveal for the wider product family is requested but explicitly deferred. Confirm actual product names/content before building it. Do not reinstate rejected standalone scenes, the old loader, diagram sections or repeated studio montage.

Before a public launch, review final content and links, decide indexing/social metadata, and verify on target browsers. No hosting deployment has been performed.
