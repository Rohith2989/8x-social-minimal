'use client';
import { useEffect } from 'react';

// One cool reading surface becomes cobalt; ink changes when contrast requires it.
export function MapApproach() {
  useEffect(() => {
    const atlas = document.getElementById('reach-atlas');
    if (!atlas) return;
    const entrance = document.getElementById('services') ?? atlas;
    const page = document.documentElement, motion = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, last = '';
    const update = () => {
      raf = 0;
      const top = entrance.getBoundingClientRect().top;
      const t = Math.max(0, Math.min(1, (innerHeight - top) / (innerHeight * .3)));
      const p = motion.matches ? (top <= innerHeight ? 1 : 0) : t * t * (3 - 2 * t);
      const channels = [244, 246, 250].map((v, i) => Math.round(v + ([0, 33, 204][i] - v) * p));
      const color = `rgb(${channels.join(', ')})`;
      if (color === last) return;
      last = color;
      page.style.setProperty('--story-surface', color);
      const luminance = channels.map(v => { const c = v / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
      const lightInk = luminance < .179;
      page.style.setProperty('--story-ink', lightInk ? '#ffffff' : '#000000');
      page.style.setProperty('--story-muted', lightInk ? '#ffffff' : (p < .2 ? '#333b50' : '#000000'));
      page.style.setProperty('--story-accent', lightInk ? '#ffffff' : (p < .2 ? '#0021cc' : '#000000'));
      page.style.setProperty('--story-cta-ink', lightInk ? '#0021cc' : '#ffffff');
      page.dataset.storyDark = String(lightInk);
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
      ['--story-surface', '--story-ink', '--story-muted', '--story-accent', '--story-cta-ink'].forEach(name => page.style.removeProperty(name));
      delete page.dataset.storyDark;
    };
  }, []);
  return null;
}
