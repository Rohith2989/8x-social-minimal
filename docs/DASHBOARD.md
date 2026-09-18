# Dashboard preview

Implemented locally between Service Choices and the original Reach Atlas. The approved references are in `design/dashboard-pinned-v2`: dense overview v2, 20-tile content library and creator performance. This is a working marketing preview, not an authenticated reporting integration.

## Reading and motion

On desktop (at least 1000 × 720), one native sticky stage holds the orange headline and stone dashboard for 2.4 viewport heights of additional scroll. Three equal intervals select Overview, Content and Creators. Only the inner panel fades; the window, controls and page surface remain fixed. The earlier 12px slide was removed during release checks because bringing a moving control into view could advance the scroll-driven tab. Browser scroll anchoring is disabled inside the dashboard, and the ambient dot field is bounded by the page gutter. Scrolling backward reverses the sequence. Tab clicks and keyboard arrows/Home/End select the corresponding scroll interval. There is no input interception or timed scroll lock.

Small screens and reduced motion use an unpinned tabbed dashboard. Without JavaScript all three reports remain in document flow. The existing orange surface continues into the map; map geometry and behaviour are unchanged.

Three restrained CSS dot layers breathe behind the window over nine seconds. Dots also remain in the charts; platform identity, application status and campaign progress use SVG platform marks and solid bars. Motion pauses offscreen/hidden and is static for reduced motion. Only one selected video decodes at a time, muted/looping while the Content view is visible. Click/keyboard toggles playback; reduced motion requires an explicit click. Failed videos retain posters and original-source links.

## Data and interaction

- Overview: campaign selection and CSV export; metric examples transcribed from the original site's product screenshot, stored at `design/dashboard-live-v1/source-dashboard.png`.
- Content: 46 locally available original clips, 20 per page, real search/filter/sort/pagination. Four attributed original creator clips plus all 42 imported showcase clips. Unattributed showcase clips are labelled `8x showcase`, never assigned a guessed platform or creator.
- Creators: seven verified original-site handles with platform labels, filter/search, selection and original profile links.
- Existing TikTok, Instagram and YouTube Shorts SVGs are reused. The three header marks identify supported platforms; individual rows use only verified attribution.
- Graphs are illustrative, not fetched analytics. Example-data labels distinguish the preview from live reporting. No fabricated performance figures are attached to real creators.

## Files and verification

`components/dashboard-preview.tsx`, `app/dashboard-preview.css`, `lib/dashboard-preview.ts`; homepage insertion before Reach Atlas. Header observes the new orange section. The existing global animation suppression explicitly allows this section's approved local motion.

Run `npm run build` and `npx playwright test tests/dashboard-preview.spec.ts` against the current production preview. Checks cover stable pin geometry, reverse scrolling and release, offscreen animation pause, 20-tile pagination, playback, search, creator selection, CSV export, keyboard navigation, no-JS content and responsive overflow at 320, 390, 768, 1024, 1366, 1440, 1920 and 2560 widths. Screenshots live under `docs/qa/dashboard-*`.

Review: http://localhost:3904/?v=dashboard-pinned-1#dashboard

Included in the explicitly authorized September 18 main/Vercel release. See `docs/RELEASE-2026-09-18.md`. Future changes remain local until requested.
