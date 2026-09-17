# Screen-edge raster — approved implementation

The user approved this direction and requested restrained breathing shape plus ultrawide support. It replaces the rejected image-bound border, leaving the portrait blended into carbon.

`01-hero-screen-edge.png` is the generated concept; `prompt.json` records its generation prompt. Live implementation uses six SVG paths anchored to the full hero's left and right edges, independent of photo bounds. The asymmetric fields fade inward and at the bottom, protecting the headline area. Their opacity and local width breathe over 12 seconds, in three staggered phases. Dots remain small; on large screens the fields broaden and become softer. There is no horizontal bottom border or portrait motion.

Geometry changes only on resize. Motion pauses offscreen/hidden and becomes static for reduced motion. The orange disc remains behind the portraits even on ultrawide screens. Source: components/hero-raster-edge.tsx, components/hero-sun.tsx, app/hero-raster-edge.css. QA: docs/qa/screen-edge-*.png and the two hero Playwright specs.

The later section and standalone infinity-footer redesigns are still pending.
