'use client';
import { useEffect } from 'react';

// The same reading surface warms before the orange map enters; geometry never moves.
export function MapApproach() {
  useEffect(() => {
    const atlas = document.getElementById('reach-atlas');
    if (!atlas) return;
    const entrance = document.getElementById('services') ?? atlas;
    const page = document.documentElement, motion = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, last = '';
    const mix = (a: number[], b: number[], p: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * p)).join(', ')})`;
    const update = () => {
      raf = 0;
      const top = entrance.getBoundingClientRect().top;
      const t = Math.max(0, Math.min(1, (innerHeight - top) / (innerHeight * .3)));
      const p = motion.matches ? (top <= innerHeight ? 1 : 0) : t * t * (3 - 2 * t);
      const color = mix([233, 229, 220], [243, 75, 50], p);
      if (color === last) return;
      last = color;
      page.style.setProperty('--story-surface', color);
      page.style.setProperty('--story-accent', mix([243, 75, 50], [17, 17, 17], p));
      page.style.setProperty('--story-cta-ink', mix([12, 12, 12], [244, 243, 238], p));
      atlas.dataset.approach = p.toFixed(3);
      window.dispatchEvent(new Event('storysurfacechange'));
    };
    const schedule = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(update); };
    const size = new ResizeObserver(schedule); size.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule); document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', schedule); update();
    return () => {
      cancelAnimationFrame(raf); size.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule); motion.removeEventListener('change', schedule);
      ['--story-surface', '--story-accent', '--story-cta-ink'].forEach(name => page.style.removeProperty(name));
    };
  }, []);
  return null;
}
