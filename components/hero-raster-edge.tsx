'use client';

import { useEffect, useRef } from 'react';

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

// Six static print plates: three per screen edge. Only their transform and
// opacity breathe; the portrait and its bounds are never used as a frame.
function edgePaths(width: number, height: number, gutter: number, copyBottom: number) {
  const paths = ['', '', '', '', '', ''];
  const mobile = width <= 700;
  const spare = Math.max(0, (width - 1800) / 2);
  const band = mobile ? Math.min(22, width * .045) : Math.min(420, width * .07 + spare * .2);
  const pitch = mobile ? 4.5 : width > 2600 ? 7 : 5.5;
  for (let side = 0; side < 2; side++) {
    for (let row = 0, y = 2; y < height; row++, y += pitch) {
      const t = y / height;
      // Unequal, broad contours have no straight interior boundary.
      const contour = .7 + .16 * Math.sin(t * 6.2 + side * 1.9) + .12 * Math.sin(t * 2.8 + side);
      const copyClearance = Math.max(8, gutter - 22);
      const open = smooth((y - copyBottom) / 110);
      const extent = Math.min(band * contour, copyClearance + (band - copyClearance) * open);
      const endFade = 1 - smooth((t - .78) / .22);
      const appear = side ? .18 + .82 * smooth((t - .15) / .4) : .65 + .35 * smooth(t / .5);
      for (let col = 0, offset = 1.5 + (row % 2) * pitch / 2; offset < extent; col++, offset += pitch) {
        const strength = Math.pow(1 - offset / extent, 1.8) * appear * endFade;
        const noise = .82 + .18 * Math.sin(row * 12.9898 + col * 78.233 + side * 43);
        const radius = (mobile ? 1.2 : 2) * strength * noise;
        if (radius < .2) continue;
        const x = side ? width - offset : offset;
        const r = radius.toFixed(2), diameter = (radius * 2).toFixed(2);
        paths[side * 3 + (row + col) % 3] += `M${(x-radius).toFixed(2)},${y.toFixed(2)}a${r},${r} 0 1,0 ${diameter},0a${r},${r} 0 1,0 -${diameter},0`;
      }
    }
  }
  return { paths, band };
}

export function HeroRasterEdge() {
  const root = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = root.current!, hero = svg.parentElement!, copy = hero.querySelector('.hero-reading')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const syncMotion = () => { svg.dataset.active = String(visible && !document.hidden && !motion.matches); };
    const measure = () => {
      const outer = hero.getBoundingClientRect(), reading = copy.getBoundingClientRect();
      if (!outer.width || !outer.height) return;
      svg.setAttribute('viewBox', `0 0 ${outer.width} ${outer.height}`);
      const { paths, band } = edgePaths(outer.width, outer.height, reading.left - outer.left, reading.bottom - outer.top);
      paths.forEach((path, index) => svg.children[index].setAttribute('d', path));
      svg.dataset.band = band.toFixed(1);
      svg.dataset.ready = 'true';
    };
    const resize = new ResizeObserver(measure); resize.observe(hero); resize.observe(copy);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncMotion(); });
    intersection.observe(hero);
    document.addEventListener('visibilitychange', syncMotion);
    motion.addEventListener('change', syncMotion);
    measure(); syncMotion();
    return () => {
      resize.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', syncMotion); motion.removeEventListener('change', syncMotion);
    };
  }, []);

  return <svg ref={root} className="hero-raster-edge" data-active="false" aria-hidden="true" focusable="false">
    {[0, 1, 2, 3, 4, 5].map(layer => <path key={layer} className={`hero-raster-layer hero-raster-layer-${layer % 3} ${layer < 3 ? 'hero-raster-left' : 'hero-raster-right'}`} />)}
  </svg>;
}
