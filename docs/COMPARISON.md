Latest local refinement: 8x Network opens with the existing 800ms curved ink fill when 35% of its card enters the reading area. A stationary cursor over another column cannot steal the opening reveal. After 900ms, actual pointer movement selects other columns; deliberate focus/touch works immediately. Network remains the default outside the cards. Leaving the entire section rearms the reveal for the next visit. Reduced-motion removes transitions. Mobile observes the card instead of the portrait/section entrance.

# Editorial comparison

Approved direction: `design/comparison-editorial-v1/01-approved-section.png` and `02-approved-motion.png`. Replaces the old mode tabs. All three approaches and all nine values remain readable at once. The same stone canvas continues from the video surface through normal document scroll; nothing pins, wipes, flies between sections, or hides while entering.

## Interaction

- Hover, keyboard focus, or touch highlights one column. Default is neutral; Escape clears the active treatment.
- Latest approval supersedes the fade/lift: a curved elliptical ink front sweeps from the bottom-right over 800ms. Ink and a light-text visual copy share one clip mask, giving exact local contrast as the front passes. CSS transitions reverse from the current position on exit, including interrupted hovers; card and text geometry never move.
- The duplicate light-text layer is aria-hidden, inert and pointer-transparent. Only the original content and single real CTA are accessible. Identical shared markup and inherited padding keep both text layers aligned at all breakpoints.
- Orange halftone emerges after 500ms, settling at 800ms. Three SVG groups breathe in eight seconds with less than 1.2px translation and 1.2% local scaling. There are 360 fixed circles per column, no per-frame React updates or new dependencies.
- Inactive, offscreen, and hidden-document animation pauses. Reduced motion removes all transforms/animation transitions while retaining the color distinction.
- Keyboard focus has a visible outline; the original onboarding CTA remains a real link. No controls conceal business content.

## Asset and layout

The woman is the approved generated editorial illustration, not a testimonial or an actual named 8x creator. The production asset is `public/media/comparison-portrait.webp` (1086 x 1448, alpha transparency). The PNG master is preserved in the design folder. Imagegen isolated the portrait and removed the backdrop; Sharp only encoded the WebP. Faces and orange artwork are not cropped to fit.

Wide screens show three comparison columns and the portrait. Tablets keep columns together and move the portrait beside the heading. Phones stack the image and all three columns with aligned definition lists. Section min-height keeps the following map below the initial reading viewport; the original reversible map approach remains intact.

The older global motion freeze in `app/family-footer.css` now excludes this approved section only. All other existing behavior is preserved.

## Review / rollback

Ink update validation: build and four targeted comparison tests pass. The new test freezes the actual 800ms transition at 300ms/440ms, confirms intermediate masks and exact alignment of both text layers, checks label contrast and accessible CTA count, and verifies reversal plus settled state. Captured frames: docs/qa/comparison-ink-rise.png, comparison-ink-flow.png and comparison-ink-hold.png. Latest review: http://localhost:3904/?v=fluid-ink-1#comparison.

Validation: production build passes. Three comparison tests pass (real animation-time advancement, fixed geometry, keyboard/touch, offscreen pause, reduced motion and overflow checks at 320/390/768/1024/1440/1920/2560). All three original map tests and three video-surface tests pass. The video test now retains a stable clip identity while the moving light changes which videos are playing; no video implementation change was needed. Screenshots are in docs/qa/comparison-editorial-*.png. git diff --check passes.

Review at http://localhost:3904/?v=comparison-editorial-1#comparison. No commit or push authorized. Main changes: `components/network-comparison.tsx`, `app/network-comparison.css`, the one global-freeze exception, the portrait asset, and `tests/comparison-editorial.spec.ts` replacing obsolete tab tests. Reverting those component/styles to their previous tracked versions restores the older comparison without touching the local video showcase or hero work.
