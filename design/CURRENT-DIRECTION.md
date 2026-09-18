# Current design direction

September 18 release: publish existing implementation work to `main` for Vercel per explicit user request. New shared infinity/product-family footer proposals remain unapproved and deferred until after this release. Preserve the current implemented footer for this deployment. See `docs/RELEASE-2026-09-18.md`; historical no-push instructions below are superseded for this release only.

Latest hero correction: restore the original 36svh bounded panorama and reserve the remaining opening viewport above it, so the photo meets the bottom at every tested size. Original cursor displacement is wired to pointer movement, release and keyboard arrows/Escape; no added controls. Carbon background and five original portrait colours remain. See docs/HERO-ORIGINAL.md. Local only.

Latest hero approval supersedes static portrait composition: keep carbon, restore original yellow studio-photo → dot matrix → five coloured creator portraits. Preserve yellow/blue/cream/lavender/orange per latest explicit user instruction. Remove the “Many voices” typographic artwork from the generated hero concept. Existing minimal navigation and subtle screen-edge breathing continue. Implemented locally using original source images and raster renderer; see `docs/HERO-ORIGINAL.md`. No Git push.

Latest approved implementation: three-stage pinned dashboard before the map. Use the refined dense overview, 20-tile content library and creator report from `dashboard-pinned-v2`. One fixed orange/stone frame; only inner dashboard content changes on native scroll. Existing TikTok/Instagram/YouTube Shorts marks are purposeful platform labels; keep dots in charts and a quiet breathing field behind the frame. Real local clips, example-labelled reporting, responsive manual tabs and reduced motion. See `docs/DASHBOARD.md`. Services remains a separate continuous timed loop without pinning. Local only.


Latest correction: Services runs an ongoing eight-second loop independent of entry, exit and scroll. No pin or input lock; reduced motion is static. Comparison opens with the Network ink reveal on each visit, regardless of stationary cursor location, then accepts pointer, keyboard and touch selection. Supersedes the timed-pin history below. Keep local.

Latest user correction supersedes scroll scrubbing: Services must pin while its animation plays itself, release afterward, and replay on re-entry from either direction without reload. Implemented as a short timed hold with sequential desktop gestures, per-panel mobile playback, and reset only after leaving the viewport. See docs/SERVICE-CHOICES.md. Local only.

Latest approval: pin the Service Choices composition and scrub the hand sequence with scroll, Self Serve before Full Service. Implemented locally with native sticky positioning, responsive sequential mobile pins and a finished-state hold before the map. This supersedes earlier automatic timed playback and no-pin instructions for this section. All other sections remain unchanged. See docs/SERVICE-CHOICES.md.

Latest: approved Service Choices page and staggered stop-motion are implemented locally. Self Serve uses the pointing hand; Full Service uses one conducting hand (rejected framing/handoff concepts are not used). Orange from the feedback exit through Services and map. Fixed content, 12fps photographic poses, automatic one-at-a-time performance then hold; no presentation timing strip on the website. See docs/SERVICE-CHOICES.md and design/service-stop-motion-v1. Awaiting user visual review. No Git push.

Latest: partner-feedback-v1 still and revised PRESS/BLOOM/SETTLE storyboard are approved and implemented locally. Automatic playback, no hover/click trigger; one gentle ripple across an already readable 2.2M, ink grows from quote centre, final state holds. Real original AI SaaS campaign metrics and anonymous attribution; no invented portrait. Rejected oversized quote-glyph concept and first corner-wipe storyboard are superseded. See docs/PARTNER-FEEDBACK.md.

Latest: comparison-editorial-v1 section and hover/scroll board are approved and implemented locally. Keep the woman/halftone composition, all three comparison columns visible, subtle dark panel/dot treatment, and continuous stone native scroll. Earlier comparison tables, abstract waves and tabbed concepts are superseded. See docs/COMPARISON.md. No push authorized.

Latest: user approved combined-showcase-v4 for implementation. The homepage now merges DayToDay and DotReach into a continuous 18-video surface with slow shared light, a monochrome base, locally restored natural colour and dotted outer dissolution. The actual clips are original showcase media; generated board placeholders are not used. All 42 showcase clips are imported locally. See docs/VIDEO-SURFACE.md for motion, performance, accessibility and rollback. No commit or push is authorized.

Current implementation: approved consistent-video-v2 is live locally. The navbar uses quiet text links and an orange text CTA across hero/content. The hero edge field now spans CreatorWork with an eight-second breathing cycle (opacity .32-.62, width scale up to 1.055). Reusable MediaRaster adds three lightweight SVG fringe layers per player; all media frames remain fixed. All three visible videos autoplay muted, with no permanent play/sound/seek toolbar, tap/keyboard pause, offscreen/hidden pause and reduced-motion manual playback. Aligned captions, fine keylines and category dots follow the approved board. Keep all changes LOCAL; do not commit or push without an explicit request.

Newest video concept: design/consistent-video-v2 supersedes the v1 player-toolbar mockup. User wants no visible media controls, muted in-view autoplay, a consistent dotted media fringe and a continuous breathing dot background from hero to creator work. Generated section + four-stage storyboard are local only; no live implementation in this design turn. Never commit or push unless explicitly asked.

Latest approved update: Scroll Thread (option 01) is implemented as a slim fixed right-edge native-scroll control. A 36px orange segment and small handle follow progress; track clicks, dragging and Arrow/Page/Home/End keys work. A 44px hit area surrounds the line. Desktop fine pointers use it in place of the native scrollbar after hydration; mobile and no-JS retain native scrolling. It adapts contrast on stone/orange. Both hero raster sides now use the same vertical fade; the earlier delayed right-side appearance is removed. Subsequent sections remain deferred.

Latest correction: screen-edge dots now span the document top, including the navigation, with a smooth 100px density fade-in. This removes the abrupt horizontal start at the former hero/header boundary on 1080p and 2K. The layer remains decorative, pointer-transparent, resize-driven and paused offscreen/hidden; portrait composition is unchanged. Sidebar ideas are concepts only, not approved implementation.

## Latest approved implementation: screen-edge breathing

Latest approved implementation: screen-edge raster v2 replaces the rejected photo border. Six SVG paths form asymmetric fields anchored to the physical hero edges. A 12-second cycle breathes opacity and at most 1.4% local width, with no portrait movement. Ultrawide fields broaden and soften, while text clearance stays protected; the orange disc follows the centered portrait group. Offscreen/hidden pauses and static reduced motion are supported. See design/hero-screen-edge-v2 and docs/IMPLEMENTATION.md. Later section/footer redesigns remain pending.

The generated still is the approved direction; live results remain open to visual review. Earlier image-bound implementation descriptions below are historical and superseded.

## Latest implementation: subtle hero raster edge

The user approved hero-raster-edge-v1 and requested particularly subtle animation. The original five-person portrait now has a narrow warm-grey halftone perimeter in three SVG paths. An eight-second CSS cycle changes opacity from .48 to .62 and shifts each layer at most .45px horizontally/.65px vertically; phases are staggered. The portrait itself is not animated or replaced. Geometry follows the actual image bounds on resize. Offscreen/hidden pauses and reduced-motion static rendering are implemented. Build and three targeted tests pass, including all 11 existing hero viewport checks. This finishes the hero task only; the three similar sections and standalone infinity footer remain subsequent work.

## Latest feedback: consistent media treatment, revised sections and standalone footer

The user says Day-to-day, Real voices/Wider reach, and A different way to grow look too similar and must be redesigned. They also dislike inconsistent media treatments (boxes, dots, dotted mirror); keep backgrounds and media treatment consistent across the page. The first creator-content section is liked.

The original 8x-to-infinity transition is now rejected. The future footer should start with an existing infinity at the bottom, with products arranged above/around it, rather than use the logo conversion as a transition. Video, layered motion or Blender remain open implementation choices, not approved decisions.

Immediate task ONLY: generate the hero portrait edge animation concept using the supplied fine halftone border. See hero-raster-edge-v1. Keep five portraits still and complete. The three section redesigns and standalone footer concept follow later; no live changes to those areas in this proposal turn. This feedback supersedes older footer-entrance approval statements below.

## Latest: restrained colour current

The colour-current storyboard is the visual target. User rejected the fixed-grid colour pass, a generic narrow ribbon, then excessive speed and rainbow coverage. Latest request is subtle motion and only a speck of colour. The endpoint now uses the board's sampled dot positions/radii, tiny coherent drift (under one SVG unit) and 0.1% breathing. One accent spans 12% of the path and travels in 40 seconds; most dots stay carbon. No point shuffling, blinking or whole-mark rotation at rest. The original layered SVG entrance remains. Implementation awaits user review; do not call it an exact match or approved. See docs/FOOTER.md.

## Latest: approved endpoint, refined motion and circle correction

The user likes the v3 dotted footer endpoint and viewport result and asked to bring it alive with layered motion. Preserve the final geometry, palette and directory. The refined sequence lifts three shallow layers beneath the original solid mark, turns it as a coherent silhouette, compresses the layers, then prints the stationary dots. The last 17% of travel holds the finished mark. New choreography awaits review; the settled visual is approved. The orange hero circle was separately flagged for spilling through the faded shoulders: it is now smaller, inset behind the faces, and fades with the whole composition rather than behind transparent clothing. No new asset or dependency.

## Latest: layered footer and viewport correction

The user rejected the v2 point-morph animation and requested a new generated sequence before rebuilding. They specifically suggested layered motion. See footer-layered-v3: the generated board is saved, and the live footer now uses a coherent solid SVG turn followed by complementary masks revealing a stationary halftone print. No dot swarm or individual point morph. The hero now fits the full portrait frame at 1920×1080 and other desktop landscape sizes; wide headlines use two lines. Portrait tablets and phones retain natural document flow. The original map stays orange. New implementation awaits user visual review. This supersedes the v2 description below.

## Current implementation: stone family ending (2026-09-17)

The user approved implementing the family concept, then rejected the orange timed animation because it was already settled when reached and lacked a visible footer. That rejection supersedes the proposal below. The ending now uses warm stone, an orange dot seam from the preserved map, a native-scroll original 8 → raster → quarter-turn → open dotted infinity sequence, stationary products, and a separate semantic footer with contact/company/legal links. No replay controls, idle loops or extra ornamental animation earlier on the page. See [implementation details](../docs/FOOTER.md). The new version is implemented and tested, pending user visual review; do not claim approval yet.

## Latest proposal: footer product family

The user now requests a footer concept: the original 8 rotates horizontally and becomes dotted, with the product family on the right. This is intended to be the page's only animation feature. See [footer-infinity-v1](footer-infinity-v1/README.md) and its four-stage generated board. User-supplied product labels: 8x Careers, 8x Sale, 8x Social, 8x Research; 8x Next is an explicitly temporary fifth label because the user does not know the final name. Proposal only: footer and earlier page motion have not been changed. Wait for design feedback before implementing the ending or removing existing animation.

## Latest implementation: original orange map (2026-09-17)

The user explicitly selected the map as the next implementation, superseding the earlier deferral below. Reach Atlas now follows the comparison on `/`. Preserve the original #f34b32 orange, geography, dot density and market data. The shared stone canvas warms as the map heading enters; navigation and the closing contact area share the same colour. No divider, full-page wipe, new pin or scroll interception. Country hover/click lifts, region filters, contrasting name labels and an accessible native market selector work on desktop and mobile. See docs/IMPLEMENTATION.md for timing and verification. Service choices, dashboard and brand/partner proof remain open content work; their prior layouts remain rejected. The 8-to-infinity ending remains deferred.

## Earlier decisions (newest first)

User approved building network-comparison-v1 and requested a Git push after completion. The root homepage now continues directly from Dot Reach into the comparison, on the same stone surface. Compact 8x / Influencers / Paid ads tabs change the shared detail area and bounded SVG dot motifs; layout height is reserved across all states. No new scroll lock, rules, cards or scene transition. Keyboard arrows/Home/End, reduced motion and narrow layouts supported. On mobile the comparison becomes a simple vertical reading list with orange dots. The original orange map remains later work; do not skip the other missing business topics.

Latest user correction: the map MUST use the original orange surface, not stone. The proposed direct creator-to-map shortcut in continuous-reach-v1 is rejected because it skips important original-site content. Original content audit: brand proof, comparison, partner feedback, Self Serve / Full Service and real-time dashboard are missing or only partially represented. Design the comparison next on the continuous stone surface; keep the map later and orange. Rejected visual treatments do not imply deletion of their underlying business content.

Implemented basis: [network-comparison-v1](network-comparison-v1/README.md), a compact mode selector and open three-column explanation on the shared stone background. See [content audit](../docs/CONTENT-AUDIT.md) for all missing original-site topics; do not skip the service choices and product dashboard when planning the rest of the page.

Latest correction: content-intelligence-v1 is REJECTED too. User dislikes the slide-like separation and specifically requested removal of section lines and bars. Live section, footer, navigation and accordion rules are removed; adjacent stone content spacing is shorter. Sticky navigation now follows the stone surface and returns to carbon above it. Video controls and meaningful focus/selection indicators remain. New [continuous-reach-v1](continuous-reach-v1/README.md) image proposes a direct creator-to-map continuation, with no extra chart section. It is a proposal only; the original orange map remains future work and must retain its geometry, density, data and interactions.

Maggie's Dot Reach video starts muted when at least 30% is visible, pauses offscreen/hidden, resumes on re-entry, and respects deliberate pause and reduced motion. Service-choice-v1's abstract dot fan and content-intelligence-v1's dashboard/chart are rejected. Do not implement them.

Latest request: user approved [dot-reach-v1](dot-reach-v1/README.md) and asked to implement with distinct original-site creators throughout. The root homepage now includes Dot Reach directly after Day-to-day on the same stone surface, with a live raster perimeter over monochrome Maggie footage, compact platform marks and native scrolling. The creator-content rail uses Nick, Mindful Witmee and Chow; Day-to-day uses Liv. No clips repeat across sections, and the studio montage remains only in the hero. Port 3904 remains an alias to the single 3091 preview.

Partner-continuation-v1 is rejected: conventional, insufficiently minimal and missing the dot concept. Do not implement it.

Use three surfaces—carbon, orange and warm stone. This explicitly reintroduces the earlier stone colour as part of the palette, superseding its rejection below. Keep the approved carbon hero. [day-to-day-v1](day-to-day-v1/README.md) preserves the original concept; `/concepts/day-to-day/` remains available. Fine dot treatments belong on image edges and the narrow surface seam; avoid a full-page effect. The temporary closing contact area also uses stone so the homepage does not immediately jump back to black.

The user approved implementation of [continuous-work-v2](continuous-work-v2/README.md) in this fresh repository. The carbon hero and continuous real-content sequence are now built. All three desktop media rectangles remain fixed: only active clip, caption, underline and progress dot change. Latest steering: regenerate the hero montage with complete shoulders and upper torsos so it flows naturally into the page. See `../docs/IMPLEMENTATION.md` for behavior and validation.

Future requirement: preserve original Reach Atlas and its orange #f34b32. A later background transition must lead into that map. After it, an 8-to-infinity family/product reveal is desired, explicitly deferred. Do not work on it yet. Carbon hero remains the current liked direction; reference to beige does not clearly reverse rejection of stone.

Latest correction: retain the carbon hero body and scrap ALL prior next-section compositions. User wants one continuous page with local scroll-triggered changes, not a succession of large standalone scenes. Studio portrait group is used only once in the hero. Later content uses actual original-site media.

Implemented basis: hero-v3-carbon and continuous-work-v2, including the revised navigation rail from carbon-continuation-v1/01-hero-navigation.png. Earlier README statements such as “not implemented yet” describe historical design turns, not current app status.

Rejected next-section history: network-v1, network-v2, carbon-continuation-v1/02-next-section.png and 03-transition-sequence.png. Warm stone palette is rejected. Do not treat saved concept presence as approval.
