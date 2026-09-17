# Partner feedback — automatic impression

Approved section and revised motion: `design/partner-feedback-v1`. Root homepage after comparison, before the original orange map. Review `/?v=feedback-impression-1#partner-feedback`.

Source: https://www.8x.social/en/for-brands, inspected September 18, 2026. Its anonymous AI SaaS / Growth Team testimonial reports over 650 videos, 2.2M reach, India and UAE, TikTok and Instagram. Attribution is preserved without inventing a named client or portrait. The displayed quote is an excerpt, not an invented endorsement.

Motion is automatic, not hover/click/focus controlled. Each art panel begins once 20% visible, so the stacked mobile quotation does not finish offscreen. A 2.2-second bounded RAF timeline sends one 3.8-unit pressure wave through an already readable numeral. The ink blooms outward from the quotation centre with a softly lobed boundary. A single clip masks black ink and an exactly aligned, inert white-text copy, retaining contrast. It ends still; no replay on scroll-back. Hidden/offscreen panels pause and reduced motion shows the finished state immediately. Without JavaScript, SVG numerals and the completed quote remain readable.

`scripts/build-feedback-dots.mjs` samples the shipped font into 3,741 dot positions in `lib/feedback-dots.json`. Canvas only runs during the short entrance, with DPR capped at 2; no dependency or external asset request. Resize repaints the current state. Static SVG is the fallback. The quote/number are semantic content once; the duplicate is aria-hidden and inert.

Implementation: `components/partner-feedback.tsx`, `app/partner-feedback.css`; imported by homepage/layout. Header active-section tracking includes partner feedback. Map geometry/data and comparison animation remain intact. No Git commit or push authorized.

Validation: production build; targeted Playwright checks of automatic intermediate states, actual changing canvas pixels, final rest, no replay, exact text geometry and a single accessible quote; 320–2560px layouts, reduced motion and no-JS fallback. Screenshots in `docs/qa/feedback-*.png`.
