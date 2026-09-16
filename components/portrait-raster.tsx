'use client';
import { useEffect, useRef } from 'react';

// Static print perimeter over live footage. Only resize/surface changes redraw it.
export function PortraitRaster() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!, host = el.parentElement!, ctx = el.getContext('2d');
    if (!ctx) return;
    const draw = () => {
      const width = el.clientWidth, height = el.clientHeight, dpr = Math.min(devicePixelRatio, 1.5);
      el.width = Math.round(width * dpr); el.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const top = height * .095, bottom = height * .25, left = width * .115, right = width * .30;
      const pitch = width < 400 ? 5 : 6;
      ctx.fillStyle = getComputedStyle(host).backgroundColor;
      ctx.fillRect(0, 0, width, height); ctx.clearRect(left, top, width - left - right, height - top - bottom);
      ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath();
      for (let y = pitch / 2; y < height; y += pitch) for (let x = pitch / 2; x < width; x += pitch) {
        if (x > left + pitch && x < width - right - pitch && y > top + pitch && y < height - bottom - pitch) continue;
        const density = Math.max(0, Math.min(1, x / left, (width - x) / right, y / top, (height - y) / bottom));
        const r = pitch * .73 * density * density * (3 - 2 * density);
        if (r < .12) continue;
        ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill(); ctx.globalCompositeOperation = 'source-over';
    };
    const size = new ResizeObserver(draw); size.observe(host); draw();
    window.addEventListener('storysurfacechange', draw);
    return () => { size.disconnect(); window.removeEventListener('storysurfacechange', draw); };
  }, []);
  return <canvas className="portrait-raster" ref={canvas} aria-hidden="true" />;
}
