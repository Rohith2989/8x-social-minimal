'use client';

import { useEffect, useRef } from 'react';
import { RasterEngine } from '@/lib/hero-raster-engine';

const smooth = (from: number, to: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

export function HeroPhotoJourney() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const portraits = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const section = root.current!, output = canvas.current!, stage = section.querySelector<HTMLElement>('.hp-stage')!;
    const heading = section.querySelector<HTMLElement>('.hp-heading')!;
    const header = document.querySelector<HTMLElement>('.site-header');
    const hero = section.closest<HTMLElement>('.hero')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let renderer: RasterEngine | undefined, frame = 0, ready = false, disposed = false, visible = false;
    let top = 96, height = 900, sourceHeight = 400, distance = 1100;
    const render = () => {
      frame = 0;
      const progress = motion.matches ? 0 : Math.max(0, Math.min(1, (top - section.getBoundingClientRect().top) / distance));
      const scene = Math.min(1, progress / .84);
      section.dataset.progress = scene.toFixed(3);
      const text = smooth(.76, .98, scene);
      section.style.setProperty('--hp-copy', String(text));
      section.style.setProperty('--hp-rise', `${(1 - text) * 16}px`);
      section.style.setProperty('--hp-source', String(1 - smooth(.18, .66, scene)));
      section.style.setProperty('--hp-portraits', String(smooth(.36, .86, scene)));
      heading.setAttribute('aria-hidden', String(!motion.matches && scene < .8));
      if (visible && !document.hidden && !motion.matches) renderer?.setScene(scene, height, false, 0, sourceHeight);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const run = () => renderer?.setRunning(ready && visible && !document.hidden && !motion.matches);
    const measure = () => {
      top = Math.ceil(header?.getBoundingClientRect().height ?? 96);
      height = innerWidth < 760 ? Math.min(innerHeight - top, Math.max(400, innerWidth * .75)) : innerHeight - top;
      height = Math.max(270, height);
      // The original hero reserves exactly the space above its 36svh photo.
      sourceHeight = Math.max(section.clientWidth / 6, Math.min(innerHeight * .36, section.clientWidth / 3.01));
      hero.style.setProperty('--hero-opening-height', `${innerHeight}px`);
      hero.style.setProperty('--hero-header-height', `${top}px`);
      hero.style.setProperty('--hero-photo-height', `${sourceHeight}px`);
      distance = Math.max(height * 1.35, 450);
      section.style.setProperty('--hp-top', `${top}px`);
      section.style.setProperty('--hp-height', `${height}px`);
      section.style.setProperty('--hp-source-height', `${sourceHeight}px`);
      const portraitHeight = Math.min(height * .7, section.clientWidth * .94 / 2.4);
      section.style.setProperty('--hp-portrait-height', `${portraitHeight}px`);
      section.style.setProperty('--hp-portrait-width', `${portraitHeight * 2.4}px`);
      section.style.setProperty('--hp-portrait-top', `${Math.max(16, (height * .74 - portraitHeight) * .5)}px`);
      section.style.setProperty('--hp-distance', `${motion.matches ? 0 : distance}px`);
      section.dataset.enhanced = String(!motion.matches);
      section.dataset.reduced = String(motion.matches);
      schedule(); run();
    };
    const failure = () => { if (!disposed) { ready = false; section.dataset.ready = 'false'; section.dataset.fallback = 'true'; } };
    measure();
    try {
      renderer = new RasterEngine(output, photo.current!, portraits.current!, {
        onReady: () => { if (!disposed) { ready = true; section.dataset.ready = 'true'; schedule(); run(); } }, onFailure: failure,
      });
    } catch { failure(); }
    // Reconnect the original renderer's smoothed local pointer displacement.
    // These listeners never cancel wheel/touch events or capture scrolling.
    let pointerX = 0, pointerY = 0;
    const position = (event: PointerEvent) => {
      const rect = output.getBoundingClientRect();
      pointerX = event.clientX - rect.left; pointerY = event.clientY - rect.top;
      if (!motion.matches) renderer?.setPointer(pointerX, pointerY, true);
    };
    const release = () => renderer?.setPointer(pointerX, pointerY, false);
    const pointerUp = (event: PointerEvent) => { if (event.pointerType !== 'mouse') release(); };
    const keyboard = (event: KeyboardEvent) => {
      if (event.target !== output) return;
      if (event.key === 'Escape') { release(); return; }
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) || motion.matches) return;
      event.preventDefault();
      pointerX = Math.max(0, Math.min(output.clientWidth, pointerX + (event.key === 'ArrowRight' ? 48 : event.key === 'ArrowLeft' ? -48 : 0)));
      pointerY = Math.max(0, Math.min(output.clientHeight, pointerY + (event.key === 'ArrowDown' ? 48 : event.key === 'ArrowUp' ? -48 : 0)));
      renderer?.setPointer(pointerX, pointerY, true);
    };
    const focus = () => { pointerX = output.clientWidth / 2; pointerY = sourceHeight / 2; if (!motion.matches) renderer?.setPointer(pointerX, pointerY, true); };
    stage.addEventListener('pointermove', position); stage.addEventListener('pointerdown', position);
    stage.addEventListener('pointerleave', release); stage.addEventListener('pointercancel', release); stage.addEventListener('pointerup', pointerUp);
    output.addEventListener('keydown', keyboard); output.addEventListener('focus', focus); output.addEventListener('blur', release);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); run(); }); observer.observe(stage);
    const resize = new ResizeObserver(measure); resize.observe(section); if (header) resize.observe(header);
    addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', measure);
    document.addEventListener('visibilitychange', run); motion.addEventListener('change', measure);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => {
      disposed = true; cancelAnimationFrame(frame); renderer?.dispose(); observer.disconnect(); resize.disconnect();
      removeEventListener('scroll', schedule); removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', run); motion.removeEventListener('change', measure);
      stage.removeEventListener('pointermove', position); stage.removeEventListener('pointerdown', position);
      stage.removeEventListener('pointerleave', release); stage.removeEventListener('pointercancel', release); stage.removeEventListener('pointerup', pointerUp);
      output.removeEventListener('keydown', keyboard); output.removeEventListener('focus', focus); output.removeEventListener('blur', release);
    };
  }, []);
  return <div className="hero-photo-journey" ref={root} data-enhanced="false" data-ready="false">
    <div className="hp-stage">
      <div className="hp-photo"><img ref={photo} src="/media/hero-original/studio.webp" alt="A creator filming a conversation with two women in a sunny studio." width="3840" height="640" fetchPriority="high" /></div>
      <div className="hp-portraits"><img ref={portraits} src="/media/hero-original/portraits.webp" alt="Five creators, rendered in yellow, blue, cream, lavender and orange dots." width="1944" height="810" /><span aria-hidden="true" /></div>
      <canvas ref={canvas} className="hp-canvas" role="img" tabIndex={0} aria-label="Interactive dot panorama. Move the pointer or use arrow keys to ripple the dots. Escape releases the ripple. Scroll to reveal five coloured creator portraits." />
      <div className="hp-heading page-width"><h2>A world of voices<span>.</span></h2></div>
    </div>
  </div>;
}
