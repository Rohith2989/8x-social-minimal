# Layered print reveal

The user rejected v2's individual-dot morph and requested a generated animation image/sequence before another rebuild, then specifically suggested layered motion. The built-in image generator produced `01-layered-sequence.png`; exact prompt and reference role are in `prompt.json`. The board includes a finished composition and four motion frames. This is art direction, not production UI; incidental generated copyright text is not used.

The live implementation now uses cohesive SVG layers: authentic solid 8x; separate fading x; smoothly transformed solid 8 with a shallow ink offset; a stationary halftone print layer; and complementary sweep masks. No individual dot travels or morphs. The original logo's silhouette and unequal counters survive the horizontal turn. Product directory and real contact footer remain fixed in layout on warm stone. The generated image approximates the original mark; runtime always uses `public/8x.svg` geometry.

Native scroll drives the sequence, respects reduced motion and finishes even where the document ends before the theoretical sticky interval. See `docs/FOOTER.md`. This revised implementation still needs the user's visual review; v1 orange/timed and v2 point-morph versions are rejected.
