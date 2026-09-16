# Carbon continuation: navigation, next section, transition

The user likes the carbon hero body and explicitly rejects its original navigation. Preserve the hero's bold type, static five-person composition and orange disc. The new navigation and next section shown here are design proposals, not approved implementation.

## Deliverables

- 01-hero-navigation.png: smaller original mark, precise ruled navigation with The network / How it works / For creators, and square orange contact CTA. Hero composition preserved as closely as generated editing allows.
- 02-next-section.png: One brief. Many voices. Carbon background continues; the orange brand origin connects to three creator panels. Brief / Creators / Content controls live beside explanatory copy.
- 03-transition-sequence.png: normal scrolling from hero, local connection reveal, then user-selected content changes. External storyboard captions are not proposed website copy.
- prompts.json: complete exact built-in imagegen prompts and reference chain.

## Proposed motion and implementation invariants

Hero image and large orange disc leave by ordinary native scroll. Do not physically morph the giant disc across the page or distort portraits. Dot motif carries through visually: a small orange point traces the next section's connections once, over about 450ms. A maximum 12px entrance movement is optional. No scroll locking, colour wipe, zooming or automatic tab carousel.

Click/tap or keyboard selects Brief, Creators or Content. Transition only the fixed-size three-panel contents, the short supporting sentence and active underline, about 250ms. Keep heading, panel geometry, origin, connections and whole-section height invariant. Generative storyboard alignment variations are not instructions to shift layout during tab changes. Show all essential content if motion is reduced; instantaneous state change. Hover may add local feedback but should not switch tabs unexpectedly.

Brief shows audience/goals/voice. Creators shows matching people. Content should use verified creator media if implemented; generated video stills and play controls in the board are illustrative only, not real client work. Use original source SVG and photo assets rather than generated logo/face approximations for production. On mobile stack content with useful reading order and touch targets, not shrunken desktop type.

No application code changed, no commit/push requested for this review. Previous stone palette remains rejected. Next action is user review of these three concepts.
