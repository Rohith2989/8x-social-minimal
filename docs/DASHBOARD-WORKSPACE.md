# Campaign workspace preview

Implemented locally on 25 September 2026, following approval of the merged dashboard concept. Route: `/dashboard`. Review server: `http://localhost:3090/dashboard`.

The graphic ribbon, floating sidebar, carbon performance panel, cobalt chart and pale-blue video shelf follow the approved composition. The banner, dots and interface icons are native vector/CSS artwork, so they remain sharp at different screen sizes. Existing locally stored 8x showcase footage supplies the video previews. No new packages, authentication, database, remote writes, Git push or deployment were added.

## Scope and source

The read-only `8xsocial/8x-social-fullymanaged` reference checkout at `e0dc1f40d2c17fb0480db297c9e3a4f05d4e3d68` informed the brand workspace destinations and controls. This is a client-side design prototype, not production feature parity or a creator-side dashboard implementation.

- Overview: Statistics, Top posts, Pace & calendar; date ranges and a custom calendar; daily/cumulative Views, Posts and Engagement; platform filtering and keyboard-accessible chart inspection.
- Creators: searchable, status-filtered roster; creator details and related posts.
- Posts: search, platform/status filters, sorting, pagination, filtered-set selection, CSV export, copyable preview links and local review flags.
- Feed: paginated video grid with playable detail dialogs.
- Content plan: example briefs, formats, reference videos and local flags. Active/upcoming/past are illustrative planning states, not a scheduling backend.
- Analytics: platform breakdowns and explanatory integration previews. No OAuth or external analytics access.
- Team: local invitation/removal simulation. No email is sent.
- Supporting controls: campaign switch, notifications, export dialog, profile, settings, help, account-manager message preview and reduced-motion preference.

## Demo data

`lib/dashboard-demo.ts` provides 248 post records and 24 illustrative creators. The initial campaign sums to 2.40M views, 112.8K likes, 8,400 comments and 10,800 shares: 132K interactions and 5.5% engagement. TikTok contributes 1.50M views / 160 posts; Instagram contributes 900K / 88 posts. Every filter, chart, count and CSV derives from the same records. The second campaign uses a smaller fixture subset.

Names, campaign associations and results are fictional. Existing showcase footage is not evidence of those results. The interface and exported files identify the data as illustrative. Navigation and reporting filters persist in the URL; local edits, flags, preferences and team changes reset on reload.

## Validation

`npm run build` passes. Nine targeted Playwright checks cover metric/filter consistency, cumulative chart keyboard access, custom date persistence, search focus, all-record filtered CSV export, real video playback, modal focus restoration, post deep links, sidebar destinations, local team actions and responsive layouts at 1920×1080, 1440×900, 2560×1440, 768×1024 and 390×844. Screenshots are in `docs/qa/dashboard-*.png`.

Run against the normal preview with `npx playwright test tests/dashboard-workspace.spec.ts`. To target port 3090 in PowerShell, set `$env:DASHBOARD_TEST_URL='http://127.0.0.1:3090'` first. Start that review server with `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3090` after building. Other local servers and pre-existing rebrand edits are preserved.

## Approved refinement and release

The banner is now 112px tall on desktop (136px on large displays, 78–100px on smaller screens). The post shelf uses a full-width heading and four wider 9:16 frames; tablets and phones use two columns. Original video framing is preserved with contain sizing. The page scrolls naturally to accommodate portrait footage.

A custom Meridian globe/meridian mark replaces the letter badge. Alex uses an AI-generated fictional portrait, optimized as a 256px WebP, with a restrained blue profile ring. Original generation: `exec-9af580d8-6787-4bf7-ac85-0c996288dfe1.png`; runtime asset: `public/dashboard/alex-carter.webp`. No real person is identified as Alex.

The user explicitly requested pushing all current work to `main`, including the blue rebrand and dashboard. This supersedes the initial local-only restriction for this release. Use `$env:PLAYWRIGHT_PORT='3090'` to run the full suite against the dashboard review server.

Release verification: the production build and complete 56-test Playwright suite passed after the refinement, including all nine dashboard checks and the landing page regressions.

## Compact shelf correction (local)

The enlarged portrait cards were rejected as too dominant. The overview shelf now caps each desktop card at 180px (195px ultrawide), retains uncropped 9:16 footage, and uses two compact columns on phones. The surrounding halftone fields breathe slowly over nine seconds. The landing-page motion reset now excludes the dashboard subtree; both OS and dashboard reduced-motion settings still disable the effect. Build and nine dashboard checks pass; breathing opacity and reduced-motion disabling were also checked directly in-browser. No push was requested for this correction.

Eight-post refinement (local): the overview now shows the eight highest-view posts in the selected reporting context. Card sizes remain capped at the approved 180px desktop / 195px ultrawide dimensions. Wide shelves display all eight across; narrower layouts wrap to four or two columns. The existing dot breathing and uncropped video proportions remain. Build and all nine dashboard checks passed.

September 25 component review: removed the small workspace footer captions (Made for your network / Illustrative data / About this preview) at the user's request. Demo context remains available in Help and relevant interactions. Eight compact video cards are unchanged. Production build passed; browser check confirms zero footer captions and eight shelf cards. Broader component redesign is a visual proposal pending user review. Local only.

September 25 Current Button: shared CurrentButton component replaces all 12 primary actions plus the header export and secondary creative-brief action. Carbon shell, fixed white action disc, reversible 480ms cobalt SVG ink front and graduated raster seam; keyboard focus, one-pixel press, disabled and reduced-motion/quiet states. CSV export yields a paint, shows busy dots only during actual work, then a check and Report ready; duplicate pending requests are blocked, errors expose Try again, and reserved labels prevent layout shifts. Immediate navigation/form actions stay immediate. No dependency added. Approved reference: design/dashboard-current-button/approved.png. Production build passes. All 10 dashboard tests pass across the run and targeted rerun (390px image-load check was transient; rerun passed). Next filter design remains a concept; not implemented. Local only.

September 25 follow-up supersedes primary-only coverage: EVERY dashboard button now renders the shared RasterSurface through RasterButton or CurrentButton; sidebar/action links use RasterLink. Includes menus, choices, icons, table actions, pagination, date cells, chart controls, cards, utilities, dialogs and forms. Preserves native button/link semantics, refs and keyboard controls. Fill is now 1150ms, reversible, with a wider masked raster seam and CSS radial dots that remain circular. Light surfaces use pale-blue ink; dark surfaces use cobalt. Removed competing immediate hover backgrounds. Decorative layers are clipped independently so focus outlines and sidebar hints stay visible. Selected states, menu chevrons and reduced-motion/quiet mode preserved. Build and all ten dashboard tests passed; three affected checks passed again after selector refinements. Local only; no Git push. Visual captures: docs/qa/current-button-wave.png and docs/qa/raster-sidebar.png.


## Creator table and saved component release — September 25

The approved creator table replaces the roster cards. A pale blue-grey workflow toolbar replaces the concept's carbon toolbar. Native SVG halftone waves breathe behind the heading and selected rows; row content stays fixed. The index rail, recent video thumbnails, reach figures and compact floating action menu follow `design/dashboard-creator-table/approved.png`.

Search, workflow filters, sorting, optional columns, pagination, selection across pages, selected-row CSV export and row actions are functional. Creator details and related posts reuse existing dashboard dialogs/routes. Metrics derive from the same campaign records; Publishing / In review are illustrative workflow fixtures (18 / 6), not live moderation states. Row popups remain attached while scrolling, support arrow keys and Escape, and restore focus. Small screens scroll the table within its panel; the document does not overflow. Both reduced-motion settings stop decorative animation.

Validation: production build and all 17 dashboard checks passed together, covering creator data/export consistency, filters, keyboard menus, aligned columns, viewport containment at 1920/1440/768/390, existing navigation/media/actions, and overview layouts through 2560px. Updated screenshots: `docs/qa/creators-*.png` and `docs/qa/dashboard-*.png`.

The user explicitly requested saving and pushing ALL current work to main. This release includes the compact eight-video shelf, caption removal, shared fluid buttons across the dashboard, and creator table. It supersedes the local-only notes above for this release.
