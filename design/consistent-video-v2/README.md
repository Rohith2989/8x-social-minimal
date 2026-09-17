# Continuous dotted video edges — motion proposal

Latest user feedback: retain the liked three-video composition and quiet keylines, remove visible player icons/timeline/sound toolbar, add a consistent fine dotted fringe around media with a quiet background dot field. Hero breathing must be noticeable yet subtle; its dots must flow continuously into this section with no page wipe or background switch. Videos should autoplay when the section is visible.

01-motion-board.png shows the proposed section and four-stage hero-to-video sequence. Generated with built-in image_gen; exact prompt is in prompt.json. This is a still storyboard, not a recording of implemented motion. No live component changes in this design turn.

Intended implementation: one shared carbon surface and continuous edge field; an eight-second subtle opacity/shape breath with fixed media geometry; original footage with muted inline autoplay, offscreen pause, reduced-motion handling and an accessible keyboard/tap pause mechanism without a permanent toolbar. The proposed media treatment should be reusable in later sections. All three visible clips should be eligible to play, replacing the previous active-only playback rule if this concept is implemented. Preserve source footage and header/scroll-thread geometry; generated thumbnail/header variations are not changes to those assets. Do not reproduce the storyboard's annotation strip or its hard preview boundary in the live page.

Keep all work local. No commit or push unless the user explicitly requests it.

## Implemented locally

Current implementation: approved consistent-video-v2 is live locally. The navbar uses quiet text links and an orange text CTA across hero/content. The hero edge field now spans CreatorWork with an eight-second breathing cycle (opacity .32-.62, width scale up to 1.055). Reusable MediaRaster adds three lightweight SVG fringe layers per player; all media frames remain fixed. All three visible videos autoplay muted, with no permanent play/sound/seek toolbar, tap/keyboard pause, offscreen/hidden pause and reduced-motion manual playback. Aligned captions, fine keylines and category dots follow the approved board. Keep all changes LOCAL; do not commit or push without an explicit request.

Validation: production build; creator-presentation, landing, hero-raster-edge, hero-viewport and scroll-thread tests. One pre-existing ambiguous mobile navigation locator was scoped to the main navigation. Desktop screenshot: docs/qa/creator-dots-1920.png; mobile: docs/qa/creator-dots-mobile.png. Original video media are untouched. Other section/footer redesigns remain deferred.
