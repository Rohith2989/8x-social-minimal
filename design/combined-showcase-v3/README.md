# Shared glow video grid

Concept only. V2 was rejected for static, differently sized video placement. V3 uses a regular twelve-cell grid with a shared moving focus/glow and dotted outer perimeter. Includes three motion-state miniatures outside the website mockup. No application edits, commit or push.

Proposed motion: muted visible footage, one broad low-intensity warm light traversing neighboring cells over roughly 10-12 seconds. It restores natural color locally while other clips are quieter, and follows the pointer with gentle easing on fine-pointer devices. No card resizing or continuous physical travel. Only nearby cells need active video decoding; pause offscreen. Reduced motion uses a static focus state. Keep accessible manual pause without permanent player toolbars. Implementation pending approval.

Generated using built-in image_gen; exact prompt and references in prompt.json. Five authentic showcase reference stills were supplied. Other cells and captions are illustrative generated mockup content, not verified creator footage or endorsements. Replace those with actual 8x showcase videos on implementation. Board is a visual proposal, not proof of implemented animation. Main view emphasizes footage; miniatures depict the dimmed/restored color states more explicitly. Preserve actual source aspect ratios when building.

Source footage reference: https://www.8x.social/en/showcase. Existing extracted frames live in ../combined-showcase-v1/references and ../combined-showcase-v2/references.

Artifact: 01-glow-grid-sequence.png.
