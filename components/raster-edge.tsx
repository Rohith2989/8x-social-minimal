'use client';
import { useEffect, useRef } from 'react';

// Only two narrow image strips or the 28px section seam are painted.
// Photograph pixels, faces and layout are never displaced.
export function RasterEdge({ seam = false, revision = 0 }: { seam?: boolean; revision?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const replay = useRef<() => void>(() => {});
  useEffect(() => { replay.current(); }, [revision]);
  useEffect(() => {
    const el = canvas.current!, ctx = el.getContext('2d')!;
    const host = el.parentElement!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, raf = 0, visible = false, start = 0, until = 0, last = 0;
    const draw = (time: number) => {
      const elapsed = (time - start) / 1000;
      const motion = reduced.matches || time >= until ? 0 : Math.sin(Math.PI * Math.min(1, (time - start) / (until - start)));
      ctx.clearRect(0, 0, width, height);
      if (seam) {
        const rect = el.getBoundingClientRect();
        const scrollPhase = reduced.matches ? 0 : Math.max(0, Math.min(1, 1 - rect.top / innerHeight));
        ctx.fillStyle = '#111111';
        ctx.beginPath();
        for (let y = 0; y < height; y += 4) for (let x = 0; x < width + 4; x += 4) {
          const density = Math.max(0, 1 - y / height);
          const r = Math.max(0, density * 2.9 + Math.sin(x * .018 + scrollPhase * 6) * .2 * density);
          ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      } else {
        const band = 22;
        ctx.fillStyle = getComputedStyle(host).backgroundColor;
        ctx.fillRect(0, 0, band, height); ctx.fillRect(width - band, 0, band, height);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        for (let y = 2; y < height + 4; y += 4) for (let x = 2; x < band; x += 4) {
          const density = x / band;
          const ripple = Math.sin(y * .045 - elapsed * 5) * .7 * motion;
          const r = Math.max(.1, density * 3.3 + ripple * Math.sin(density * Math.PI));
          ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.moveTo(width - x + r, y); ctx.arc(width - x, y, r, 0, Math.PI * 2);
        }
        ctx.fill(); ctx.globalCompositeOperation = 'source-over';
      }
    };
    const tick = (time: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (time - last >= 1000 / 24) { draw(time); last = time; }
      if (!seam && !reduced.matches && time < until) raf = requestAnimationFrame(tick);
      else draw(time);
    };
    const schedule = () => {
      // Hash navigation can move the section after an observer delivery.
      // Check current geometry when scrolling or explicitly replaying a rim.
      const rect = el.getBoundingClientRect();
      const shown = rect.bottom > 0 && rect.top < innerHeight && rect.width > 0;
      if (shown && !visible) { start = performance.now(); until = start + 4000; }
      visible = shown;
      if (!visible || document.hidden) { cancelAnimationFrame(raf); raf = 0; return; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const pulse = () => { start = performance.now(); until = start + 2400; schedule(); };
    replay.current = pulse;
    const resize = () => {
      width = el.clientWidth; height = el.clientHeight;
      const dpr = Math.min(devicePixelRatio, 1.5);
      el.width = Math.round(width * dpr); el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw(performance.now());
    };
    const observer = new IntersectionObserver(schedule);
    observer.observe(el);
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    host.addEventListener('pointerenter', pulse);
    host.addEventListener('focusin', pulse);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('storysurfacechange', schedule);
    document.addEventListener('visibilitychange', schedule);
    reduced.addEventListener('change', schedule);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); ro.disconnect(); host.removeEventListener('pointerenter', pulse); host.removeEventListener('focusin', pulse); window.removeEventListener('scroll', schedule); window.removeEventListener('storysurfacechange', schedule); document.removeEventListener('visibilitychange', schedule); reduced.removeEventListener('change', schedule); replay.current = () => {}; };
  }, [seam]);
  return <canvas ref={canvas} className={seam ? 'raster-seam' : 'raster-rim'} aria-hidden="true" />;
}
