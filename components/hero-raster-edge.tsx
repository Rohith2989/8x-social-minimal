'use client';

import { useEffect, useRef } from 'react';

const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

// Three fixed print layers, rather than thousands of animated particles.
// Geometry is generated only on resize; CSS moves the layers by < 1px.
function edgePaths(width: number, height: number) {
  const paths = ['', '', ''];
  const pitch = width < 600 ? 4 : 5;
  const band = Math.min(42, width * .065);
  for (let row = 0, y = 2; y < height; row++, y += pitch) {
    for (let col = 0, x = 2 + (row % 2) * pitch / 2; x < width; col++, x += pitch) {
      const side = Math.min(x, width - x);
      const lower = Math.abs(y - height * .88);
      if (side > band && lower > band * .65) continue;
      const sideStrength = Math.pow(Math.max(0, 1 - side / band), 1.7) * smooth(y / height / .42);
      const bottomStrength = Math.pow(Math.max(0, 1 - lower / (band * .65)), 2) * .35;
      const strength = Math.max(sideStrength, bottomStrength);
      const noise = .8 + .2 * Math.sin(row * 12.9898 + col * 78.233);
      const radius = (width < 600 ? 1.15 : 1.5) * strength * noise;
      if (radius < .2) continue;
      const r = radius.toFixed(2), diameter = (radius * 2).toFixed(2);
      paths[(row + col) % 3] += `M${(x-radius).toFixed(2)},${y.toFixed(2)}a${r},${r} 0 1,0 ${diameter},0a${r},${r} 0 1,0 -${diameter},0`;
    }
  }
  return paths;
}

export function HeroRasterEdge() {
  const root = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = root.current!, frame = svg.parentElement!, img = frame.querySelector('img')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const syncMotion = () => { svg.dataset.active = String(visible && !document.hidden && !motion.matches); };
    const measure = () => {
      const outer = frame.getBoundingClientRect(), image = img.getBoundingClientRect();
      if (!image.width || !image.height) return;
      svg.setAttribute('viewBox', `0 0 ${image.width} ${image.height}`);
      svg.style.left = `${image.left - outer.left}px`;
      svg.style.top = `${image.top - outer.top}px`;
      svg.style.width = `${image.width}px`;
      svg.style.height = `${image.height}px`;
      edgePaths(image.width, image.height).forEach((path, index) => svg.children[index].setAttribute('d', path));
      svg.dataset.ready = 'true';
    };
    const resize = new ResizeObserver(measure); resize.observe(frame); resize.observe(img);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncMotion(); });
    intersection.observe(frame);
    img.addEventListener('load', measure);
    document.addEventListener('visibilitychange', syncMotion);
    motion.addEventListener('change', syncMotion);
    measure(); syncMotion();
    return () => {
      resize.disconnect(); intersection.disconnect(); img.removeEventListener('load', measure);
      document.removeEventListener('visibilitychange', syncMotion); motion.removeEventListener('change', syncMotion);
    };
  }, []);

  return <svg ref={root} className="hero-raster-edge" data-active="false" aria-hidden="true" focusable="false">
    {[0, 1, 2].map(layer => <path key={layer} className={`hero-raster-layer hero-raster-layer-${layer}`} />)}
  </svg>;
}
