# Stone continuation / dot-edge motion

Latest user direction reintroduces stone explicitly alongside carbon and orange. The former rejection of stone no longer applies to the overall palette. The current approved carbon hero remains. The new section design uses stone `#E9E5DC`, carbon `#111111` and signal orange `#F34B32`.

Deliverables: `01-section.png`, `02-transition.png`, exact prompts in `prompts.json`, original user edge reference in `references/dot-edge.png`. Images were generated with built-in image_gen. They are design concepts, not screenshots of the implemented page. Generated photo likeness/text can differ; the motion preview uses the untouched original Judy media.

Motion preview: http://localhost:3091/concepts/day-to-day/#day-to-day . To review the outgoing content and seam, start at `#work` and scroll naturally. This isolated route includes the existing hero and creator-content components followed by the stone section. Main `/` remains unchanged pending design review.

## Proposed section

“Your network. Our day-to-day.” explains creator sourcing, content operations and reporting. Three accessible accordion rows change the supporting copy and orange active marker. One original creator example remains in a stable media area. It illustrates creator work, not an invented screenshot of 8x software or proof of an undisclosed performance claim. No repeat of the studio hero montage.

## Actual motion

- Normal document scrolling brings the stone surface up beneath the existing carbon section. Only a 28px dotted seam reacts to the scroll position. No whole-screen colour wipe or scroll interception.
- Two 22px photograph-edge strips resolve into tiny photo-coloured dots. A local wave travels along the rim for four seconds on entry. Hover/focus and changing a detail row replay 2.4 seconds. It settles completely afterward. These implementation dimensions slightly expand the board's initial 14px rim for legibility.
- Faces and the central photograph remain intact; no image pixelation, scale change or morph. Caption/accordion changes take 240ms. The media container stays fixed on desktop.
- Canvas draws only the boundary and narrow rims, capped at 24fps and 1.5 device-pixel ratio; idle/offscreen/hidden state stops animation. Reduced motion draws a static dot treatment. No WebGL, generated video or animation dependency.
- The original creator video plays only on deliberate request; playback pauses when it leaves view or the document is hidden. Play/pause and original source links remain.

Reference principles: https://listenlabs.ai/ (consistent page/interaction hierarchy), https://www.8x.social/en/for-brands (actual service scope and media). No Listen Labs assets or wording copied.

Later orange map and 8-to-infinity family ending remain deferred. This preview does not imply approval of the new section or automatically replace the landing page.

Validation: production build passes; all eight distinct existing/new checks have passing runs. The two concept checks passed three consecutive runs after fixing an observer timing race on direct section navigation. Tests verify actual canvas pixels changing, stable media dimensions, manual playback, static reduced-motion treatment and mobile overflow. QA screenshots are in `docs/qa/day-to-day-*.png`.
