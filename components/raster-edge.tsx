'use client';
import { useEffect, useRef } from 'react';

export function RasterEdge({ seam = false }: { seam?: boolean; revision?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!, ctx = el.getContext('2d'), host = el.parentElement!;
    if (!ctx) return;
    const draw = () => {
      const width = el.clientWidth, height = el.clientHeight, dpr = Math.min(devicePixelRatio, 1.5);
      el.width = Math.round(width * dpr); el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (seam) {
        ctx.fillStyle = '#111111'; ctx.beginPath();
        for (let y = 0; y < height; y += 4) for (let x = 0; x < width + 4; x += 4) {
          const density = Math.max(0, 1 - y / height);
          const r = Math.max(0, density * 2.9 + Math.sin(x * .018) * .2 * density);
          ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();
      } else {
        const band = 22;
        ctx.fillStyle = getComputedStyle(host).backgroundColor;
        ctx.fillRect(0, 0, band, height); ctx.fillRect(width - band, 0, band, height);
        ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath();
        for (let y = 2; y < height + 4; y += 4) for (let x = 2; x < band; x += 4) {
          const r = Math.max(.1, x / band * 3.3);
          ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.moveTo(width - x + r, y); ctx.arc(width - x, y, r, 0, Math.PI * 2);
        }
        ctx.fill(); ctx.globalCompositeOperation = 'source-over';
      }
    };
    const size = new ResizeObserver(draw); size.observe(el); draw();
    window.addEventListener('storysurfacechange', draw);
    return () => { size.disconnect(); window.removeEventListener('storysurfacechange', draw); };
  }, [seam]);
  return <canvas ref={canvas} className={seam ? 'raster-seam' : 'raster-rim'} aria-hidden="true" />;
}
