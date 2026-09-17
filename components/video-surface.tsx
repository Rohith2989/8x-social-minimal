'use client';

import { useEffect, useRef } from 'react';
import { Arrow } from './icons';
import { RasterEdge } from './raster-edge';
import { links } from '@/lib/content';

// Real showcase footage only. The entire 42-clip source library is kept locally.
export const showcaseClips = [5, 41, 3, 28, 6, 11, 23, 32, 2, 13, 36, 7, 12, 40, 9, 29, 42, 45];
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function VideoSurface() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const action = useRef<(index: number) => void>(() => {});
  const pause = useRef<() => void>(() => {});

  useEffect(() => {
    const host = stage.current!, output = canvas.current!, ctx = output.getContext('2d');
    if (!ctx) return;
    const videos = Array.from(host.querySelectorAll('video'));
    const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>('.surface-cell'));
    const posters = Array.from(host.querySelectorAll<HTMLImageElement>('.surface-poster'));
    const pauseButton = host.querySelector<HTMLButtonElement>('.surface-pause')!;
    const makeBuffer = () => document.createElement('canvas');
    const color = makeBuffer(), light = makeBuffer(), mask = makeBuffer();
    const cc = color.getContext('2d')!, lc = light.getContext('2d')!, mc = mask.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0, height = 0, columns = 9, gap = 5, cw = 0, ch = 0;
    let visible = false, disposed = false, raf = 0, last = 0, elapsed = 0, painted = 0, synced = -1000;
    let resting = false, pointer = false, focused = -1, x = .5, y = .48, tx = .5, ty = .48;
    let manual = -1;
    const userPaused = new Set<number>(), blocked = new Set<number>();
    const positions = () => videos.map((_, i) => ({ x: i % columns * (cw + gap), y: Math.floor(i / columns) * (ch + gap) }));
    const updateLabels = () => videos.forEach((v, i) => {
      buttons[i].setAttribute('aria-label', `${v.paused ? 'Play' : 'Pause'} showcase clip ${i + 1}`);
      buttons[i].dataset.playing = String(!v.paused);
    });
    const halt = () => { videos.forEach(v => v.pause()); updateLabels(); };
    const syncPlayback = () => {
      if (!visible || document.hidden || resting) { halt(); return; }
      const box = host.getBoundingClientRect();
      const ranked = positions().map((p, i) => ({ i, d: Math.hypot((p.x + cw / 2) / width - x, ((p.y + ch / 2) / height - y) * .65), onScreen: box.top + (p.y + ch) / height * box.height > 96 && box.top + p.y / height * box.height < innerHeight }));
      const selected = reduced.matches ? [manual] : ranked.filter(p => p.onScreen && !userPaused.has(p.i)).sort((a, b) => (a.i === manual ? -1 : b.i === manual ? 1 : a.d - b.d)).slice(0, innerWidth < 720 ? 2 : 4).map(p => p.i);
      videos.forEach((video, i) => {
        const onScreen = ranked[i].onScreen;
        if (!selected.includes(i) || !onScreen || userPaused.has(i)) { video.pause(); return; }
        if (!video.getAttribute('src')) video.src = `/media/showcase/${showcaseClips[i]}.mp4`;
        if (video.paused && !blocked.has(i)) void video.play().catch((error: DOMException) => {
          // Scroll/resize can pause a pending play; that is not an autoplay denial.
          if (!disposed && error.name !== 'AbortError') blocked.add(i);
        });
      });
      updateLabels();
    };
    const draw = () => {
      if (!width || !height) return;
      cc.clearRect(0, 0, width, height);
      positions().forEach((p, i) => {
        const video = videos[i], poster = posters[i];
        const source = video.readyState >= 2 ? video : poster;
        if (source === poster && (!poster.complete || !poster.naturalWidth)) return;
        // Contain the original 480x854 footage; never crop captions or faces.
        const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
        const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
        const scale = Math.min(cw / sw, ch / sh), w = sw * scale, h = sh * scale;
        cc.fillStyle = '#191918'; cc.fillRect(p.x, p.y, cw, ch);
        cc.drawImage(source, p.x + (cw - w) / 2, p.y + (ch - h) / 2, w, h);
      });
      ctx.clearRect(0, 0, width, height);
      ctx.filter = 'grayscale(1) brightness(.72)';
      ctx.drawImage(color, 0, 0); ctx.filter = 'none';
      lc.clearRect(0, 0, width, height);
      lc.globalCompositeOperation = 'source-over'; lc.drawImage(color, 0, 0);
      lc.globalCompositeOperation = 'destination-in';
      const arrival = reduced.matches ? 1 : .75 + .25 * Math.min(1, elapsed / 1800);
      const rx = width * (columns === 3 ? .55 : .25) * arrival, ry = Math.min(height * .85, width * .35);
      lc.save(); lc.translate(x * width, y * height); lc.scale(rx, ry);
      const glow = lc.createRadialGradient(0, 0, 0, 0, 0, 1);
      glow.addColorStop(0, '#000'); glow.addColorStop(.38, '#000'); glow.addColorStop(.75, '#0008'); glow.addColorStop(1, '#0000');
      lc.fillStyle = glow; lc.fillRect(-1, -1, 2, 2); lc.restore();
      ctx.drawImage(light, 0, 0);
      // One shared, restrained warm reflection, not borders on individual cells.
      ctx.save(); ctx.translate(x * width, y * height); ctx.scale(rx, ry);
      const warmth = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      warmth.addColorStop(0, 'rgba(255,170,100,.075)'); warmth.addColorStop(.65, 'rgba(255,190,120,.025)'); warmth.addColorStop(1, 'rgba(255,190,120,0)');
      ctx.fillStyle = warmth; ctx.fillRect(-1, -1, 2, 2); ctx.restore();
      ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(mask, 0, 0); ctx.globalCompositeOperation = 'source-over';
      host.dataset.ready = 'true'; host.dataset.lightX = x.toFixed(3);
    };
    const resize = () => {
      columns = innerWidth < 600 ? 3 : innerWidth < 1000 ? 6 : 9;
      const cssWidth = host.clientWidth;
      // Bound the paint area rather than multiplying 18 video layers by screen DPR.
      width = Math.round(Math.min(cssWidth * Math.min(devicePixelRatio, 1.25), 1800));
      gap = Math.max(3, width / 340); cw = (width - gap * (columns - 1)) / columns; ch = cw * 16 / 9;
      height = Math.round(ch * (18 / columns) + gap * (18 / columns - 1));
      [output, color, light, mask].forEach(c => { c.width = width; c.height = height; });
      mc.clearRect(0, 0, width, height); mc.fillStyle = '#000'; mc.beginPath();
      const pitch = Math.max(3.2, width / cssWidth * 4), edge = Math.min(width * .065, 105), bottom = Math.min(60, ch * .25);
      for (let py = 0; py < height + pitch; py += pitch) for (let px = 0; px < width + pitch; px += pitch) {
        const coverage = clamp(Math.min(px / edge, (width - px) / edge, py / 13, (height - py) / bottom));
        const r = pitch * .73 * Math.sqrt(coverage * coverage * (3 - 2 * coverage));
        if (r > 0) { mc.moveTo(px + r, py); mc.arc(px, py, r, 0, Math.PI * 2); }
      }
      mc.fill(); draw(); syncPlayback();
    };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || disposed) return;
      const dt = Math.min(60, last ? now - last : 0); last = now;
      if (!resting && !reduced.matches) {
        elapsed += dt;
        if (!pointer && focused < 0) { tx = .5 + .31 * Math.sin(elapsed / 11500); ty = .48 + .12 * Math.sin(elapsed / 17000); }
        const ease = 1 - Math.exp(-dt / 650); x += (tx - x) * ease; y += (ty - y) * ease;
      }
      if (now - synced > 650) { syncPlayback(); synced = now; }
      if (now - painted >= 40) { draw(); painted = now; }
      if ((!resting && !reduced.matches) || videos.some(v => !v.paused)) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      syncPlayback();
      if (!visible || document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; return; }
      draw(); if (!raf && (!resting || videos.some(v => !v.paused))) raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || reduced.matches || resting) return;
      const r = host.getBoundingClientRect(); pointer = true; tx = clamp((e.clientX - r.left) / r.width); ty = clamp((e.clientY - r.top) / r.height);
    };
    const leave = () => { pointer = false; };
    const focus = (e: FocusEvent) => {
      focused = buttons.indexOf(e.target as HTMLButtonElement);
      if (focused < 0) return;
      const p = positions()[focused]; tx = (p.x + cw / 2) / width; ty = (p.y + ch / 2) / height;
      if (reduced.matches) { x = tx; y = ty; draw(); }
    };
    const blur = () => { focused = -1; };
    action.current = i => {
      const v = videos[i];
      if (!v.paused) { userPaused.add(i); if (manual === i) manual = -1; v.pause(); }
      else { userPaused.delete(i); blocked.delete(i); manual = i; resting = false; pauseButton.textContent = 'Pause motion'; pauseButton.setAttribute('aria-pressed', 'false'); }
      wake();
    };
    pause.current = () => {
      resting = !resting; pauseButton.textContent = resting ? 'Resume motion' : 'Pause motion'; pauseButton.setAttribute('aria-pressed', String(resting)); wake();
    };
    const onError = (e: Event) => {
      const i = videos.indexOf(e.target as HTMLVideoElement); blocked.add(i);
      buttons[i].hidden = true; host.querySelectorAll<HTMLAnchorElement>('.surface-original')[i].hidden = false;
    };
    videos.forEach(v => { v.addEventListener('error', onError); v.addEventListener('playing', updateLabels); v.addEventListener('pause', updateLabels); });
    posters.forEach(p => p.addEventListener('load', wake));
    const checkVisibility = () => {
      // Hash entry and the preceding sticky stage can settle in the same frame.
      // Read current geometry instead of acting on an older queued IO entry.
      const box = host.getBoundingClientRect();
      const next = box.bottom > 96 && box.top < innerHeight;
      if (next === visible) return;
      visible = next; host.dataset.visible = String(visible); wake();
    };
    const observer = new IntersectionObserver(checkVisibility, { threshold: 0 });
    observer.observe(host);
    const size = new ResizeObserver(resize); size.observe(host);
    host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave); host.addEventListener('focusin', focus); host.addEventListener('focusout', blur);
    document.addEventListener('visibilitychange', wake); reduced.addEventListener('change', wake);
    window.addEventListener('scroll', checkVisibility, { passive: true });
    // Keep the previous section anchors valid while consolidating their content.
    let hashFrame = 0;
    void document.fonts.ready.then(() => {
      if (disposed || !['#day-to-day', '#reach', '#showcase'].includes(location.hash)) return;
      hashFrame = requestAnimationFrame(() => { hashFrame = requestAnimationFrame(() => {
        const section = document.getElementById('day-to-day');
        const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 96;
        if (section) window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - header + 1, behavior: 'instant' });
        checkVisibility();
      }); });
    });
    resize();
    return () => {
      disposed = true; cancelAnimationFrame(raf); cancelAnimationFrame(hashFrame); observer.disconnect(); size.disconnect(); halt();
      videos.forEach(v => { v.removeEventListener('error', onError); v.removeEventListener('playing', updateLabels); v.removeEventListener('pause', updateLabels); v.removeAttribute('src'); v.load(); });
      posters.forEach(p => p.removeEventListener('load', wake));
      host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); host.removeEventListener('focusin', focus); host.removeEventListener('focusout', blur);
      document.removeEventListener('visibilitychange', wake); reduced.removeEventListener('change', wake);
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  return <section id="day-to-day" className="video-surface-section" aria-labelledby="surface-title">
    <span id="showcase" className="surface-anchor" /><span id="reach" className="surface-anchor" />
    <RasterEdge seam />
    <div className="surface-heading page-width">
      <h2 id="surface-title">Many voices.<br />One network<span>.</span></h2>
      <div><p>Creators, content and publishing.<br />One team behind it all.</p><a href={links.build}>Build your network<Arrow /></a></div>
    </div>
    <div className="video-surface" ref={stage} role="group" aria-label="Creator showcase: eighteen original videos" data-ready="false">
      <div className="surface-fallback" aria-hidden="true">{showcaseClips.map(id => <img className="surface-poster" key={id} src={`/media/showcase/${id}.jpg`} alt="" width="320" height="570" loading="lazy" />)}</div>
      <canvas ref={canvas} aria-hidden="true" />
      <div className="surface-interactions">{showcaseClips.map((id, i) => <div className="surface-slot" key={id}>
        <video muted playsInline loop preload="none" aria-hidden="true" tabIndex={-1} />
        <button className="surface-cell" aria-label={`Play showcase clip ${i + 1}`} onClick={() => action.current(i)}><span>Play / pause</span></button>
        <a className="surface-original" href={`https://cdn-mrktng.8x.social/assets/videos/video-${id}.mp4`} hidden target="_blank" rel="noreferrer">Watch original clip {i + 1}<Arrow /></a>
      </div>)}</div>
      <button className="surface-pause" aria-pressed="false" onClick={() => pause.current()}>Pause motion</button>
    </div>
    <div className="surface-caption page-width"><p>Find your people. Keep content moving. See what works.</p><ul aria-label="Publishing platforms"><li>TikTok</li><li>Instagram</li><li>YouTube Shorts</li></ul></div>
    <noscript><p className="page-width"><a href="https://www.8x.social/en/showcase">Watch the creator showcase ↗</a></p></noscript>
  </section>;
}
