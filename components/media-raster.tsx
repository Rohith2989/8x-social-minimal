'use client';
import { useEffect, useRef } from 'react';

/** Reusable print fringe. Moving plates never transform the footage. */
export function MediaRaster({ active }: { active: boolean }) {
  const root = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = root.current!, shell = svg.parentElement!;
    const measure = () => {
      const { width, height } = shell.getBoundingClientRect();
      const margin = 24, paths = ['', '', ''];
      svg.setAttribute('viewBox', `0 0 ${width + 48} ${height + 48}`);
      for (let row = 0, y = 2; y < height + 48; row++, y += 4) {
        for (let col = 0, x = 2 + row % 2 * 2; x < width + 48; col++, x += 4) {
          const dx = Math.max(margin - x, 0, x - width - margin);
          const dy = Math.max(margin - y, 0, y - height - margin);
          if (!dx && !dy) continue;
          const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / margin);
          const r = 1.05 * falloff ** 1.6 * (.8 + .2 * Math.sin(row * 19 + col * 7));
          if (r < .17) continue;
          paths[(row + col) % 3] += `M${(x-r).toFixed(2)},${y}a${r.toFixed(2)},${r.toFixed(2)} 0 1,0 ${(r*2).toFixed(2)},0a${r.toFixed(2)},${r.toFixed(2)} 0 1,0 -${(r*2).toFixed(2)},0`;
        }
      }
      paths.forEach((d, i) => svg.children[i].setAttribute('d', d));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(shell); measure();
    return () => observer.disconnect();
  }, []);
  return <svg ref={root} className="media-raster" aria-hidden="true" focusable="false" data-active={active}>
    {[0,1,2].map(i => <path key={i} className={`media-raster-layer media-raster-layer-${i}`} />)}
  </svg>;
}
