# Footer: 8 to dotted infinity

**Historical concept.** The user approved implementation, then rejected the orange timed result. The current stone, scroll-driven revision is documented in [docs/FOOTER.md](../../docs/FOOTER.md). The proposal below preserves the original design discussion and is no longer the implementation specification.

Design proposal, not implemented. The user requested the footer to be the page's only animation feature; this supersedes the earlier deferral of the product-family ending. Earlier page motion has not been changed during this image-design turn.

The footer continues the map's #f34b32 orange without a divider or colour change. A large original 8x mark occupies the left; its 8 turns clockwise ninety degrees, resolves into disciplined dots and settles into a horizontal figure-eight. Keep the original 8's unequal counters and variable stroke weights. Fade the separate x during the turn. The right column stays stationary and readable; do not animate the whole page or fling dots into links.

## Proposed sequence

- 0.0–0.4s: solid original 8x, product links already visible.
- 0.4–1.5s: the 8 turns clockwise; the separate x fades out.
- 1.5–2.3s: ordered dots replace the fill along the silhouette; no random particle explosion.
- 2.3–2.8s: settle into the dotted horizontal 8. Stop at rest rather than looping.

Timings are a proposal. Trigger once when the footer artwork is sufficiently visible, preserve native scrolling and pause when offscreen/hidden. Reduced motion should show the settled frame. For implementation, derive the initial mark from public/8x.svg and use a bounded SVG/canvas dot set. The generated image is an art-direction target, never runtime UI. Review exact interpolation in the browser before claiming parity with the concept.

## Product labels

Latest user-supplied order: 8x Careers, 8x Sale (singular), 8x Social, 8x Research. The user does not know the last product and asked for a substitute; **8x Next is an explicit design placeholder**, not a verified product. Do not create destinations or publish a fictitious product. The original https://www.8x.social/en footer links to 8x.careers but did not confirm the remaining family directory. Verify names and URLs before implementation.

## Assets

Generated with the built-in image-generation tool. Exact generation and corrective-edit prompts are in prompts.json. brand-reference.png is a Sharp raster rendering of the existing public/8x.svg against the map orange. docs/qa/map-desktop.png supplied the actual adjacent section's palette, typography and dot treatment. The board includes the final footer plus four storyboard frames. The corrective edit updates the five product labels after the user's reply.

This is a concept for review only; no live page changes or deployment.
