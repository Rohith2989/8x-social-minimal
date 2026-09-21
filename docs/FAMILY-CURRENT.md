# Shared 8x infinity — September 21

User approved the theme/motion boards, implementation ABOVE the information footer, and pushing to Git. During implementation the user rejected the procedural dot recreation and explicitly requested layered motion using the images themselves. They also clarified that this Raster Human website must use the ORANGE theme. Those corrections govern this implementation.

## Final implementation

FamilyInfinity follows ReachAtlas on the SAME #F34B32 orange surface, then the existing information footer follows. No pinning, no numeral-eight rotation, no scroll scrub. The infinity is visible from the outset.

The art is an isolated transparent image derived with image generation from the approved board, rather than newly drawn dots. Source asset: design/family-current-v1/03-isolated-artwork.png (1984x793 RGBA). Lossy WebP at quality 94/alpha 100 is the 520KB runtime asset. The artist-rendered spheres, irregular bead sizes, shading and crossing stay in the image.

Three SVG image layers share the cached asset: complete body, a softly masked foreground crossing, and the colour-current copy. A soft moving mask follows a constant-speed arc-length path through the existing image's two loops over 12 seconds. The second crossing dims under the front branch. A maximum 0.15% full-surface breath and a 1.4-source-pixel foreground offset supply shallow layered depth. Product elements remain stationary. No generated circle grid remains.

RAF property updates are capped at 30fps and suspend offscreen or in hidden tabs. Reduced motion uses a complete still; the SVG/image composition also renders without JavaScript. No video downloads, Canvas2D renderer, WebGL or new dependency. Layered image motion follows the user's explicit implementation choice.

## Shared brand system

Source: original design archive output/8x-raster-human-field-v1/README.md.

Social #FFD438; Business #4D2C91; Sale #F34B32; Careers #78AEE8; Research #9DADC2. Shared Carbon #171922 and Polar #F4F6FA.

All five icon backgrounds remain their original product colours on every surface. Thin neutral keylines distinguish matching-colour icons from the background. Business uses a white serif mark for contrast; the others use carbon. The Business identity comes from the approved Raster Human source, replacing the old provisional Next label.

Reusable API: <FamilyInfinity theme="sale" /> (orange default for this site). Other supported themes: polar, social, business, careers, research. Optional id supports multiple instances. /concepts/family shows every theme. Other website repositories have NOT been modified.

Social and Careers have source-confirmed destinations. Business, Sale and Research remain plain labels until destination URLs are supplied; there are no invented domains or dead click targets.

## Verification

Production build and focused Playwright checks cover actual image motion with stable product positions, offscreen suspend/resume, all five logo colours on all six backgrounds, no label overlaps or horizontal overflow from 320px to 3440px, keyboard links, reduced-motion stability, no-JavaScript rendering, and map → infinity → existing footer order. Screenshots: docs/qa/family-*.png.
