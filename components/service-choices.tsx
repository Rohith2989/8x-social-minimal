'use client';

import { useEffect, useRef } from 'react';
import { Arrow } from './icons';
import { links } from '@/lib/content';

type Kind = 'self' | 'full';
const W = 760, H = 400, FPS = 12;
// Held exposures are intentional: anticipation, contact, release, rest.
const poses = {
  self: [0, 0, 1, 1, 2, 3, 3, 3, 4, 5, 5, 6, 6, 7, 7, 7, 7],
  full: [0, 0, 1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7],
};
const hand = { self: { x: 0, y: 35, size: 430 }, full: { x: 345, y: -108, size: 380 } };
const dots = (kind: Kind) => Array.from({ length: kind === 'self' ? 20 : 36 }, (_, i) => {
  const cols = kind === 'self' ? 5 : 9;
  return { row: Math.floor(i / cols), col: i % cols,
    x: kind === 'self' ? 365 + i % cols * 43 : 125 + i % cols * 44,
    y: kind === 'self' ? 107 + Math.floor(i / cols) * 43 : 258 + Math.floor(i / cols) * 34 };
});

function Still({ kind }: { kind: Kind }) {
  const p = hand[kind];
  return <svg className="service-still" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
    {dots(kind).map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={kind === 'self' && i === 5 ? 16 : 10}
      fill={(kind === 'self' ? i === 5 : i === 4) ? '#ffffff' : '#b5ceff'} />)}
    <svg x={p.x} y={p.y} width={p.size} height={p.size} viewBox="1330.5 443.5 443.5 443.5" overflow="hidden">
      <image href={`/media/service-hands/${kind}.webp`} width="1774" height="887" />
    </svg>
  </svg>;
}

export function ServiceChoices() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const inner = section.querySelector<HTMLElement>('.service-inner')!;
    const header = document.querySelector<HTMLElement>('.site-header');
    const kinds: Kind[] = ['self', 'full'];
    const stages = kinds.map(kind => ({ kind, element: section.querySelector<HTMLElement>(`[data-hand="${kind}"]`)!,
      image: new Image(), ready: false, frame: -1 }));
    let raf = 0, disposed = false;
    // A page-lifetime clock: entering, leaving and scrolling never restart a gesture.
    const cycle = 8000;

    function draw(index: number, exposure: number) {
      const s = stages[index], canvas = s.element.querySelector('canvas')!, ctx = canvas.getContext('2d');
      if (!ctx || !s.ready) return;
      const pose = poses[s.kind][Math.min(exposure, poses[s.kind].length - 1)];
      const width = s.element.clientWidth, height = s.element.clientHeight, ratio = Math.min(devicePixelRatio || 1, 2);
      const targetW = Math.round(width * ratio), targetH = Math.round(height * ratio);
      if (canvas.width !== targetW || canvas.height !== targetH) { canvas.width = targetW; canvas.height = targetH; }
      ctx.resetTransform(); ctx.clearRect(0, 0, targetW, targetH);
      const scale = Math.min(targetW / W, targetH / H);
      ctx.setTransform(scale, 0, 0, scale, (targetW - W * scale) / 2, (targetH - H * scale) / 2);
      const t = exposure / FPS;
      for (const [i, d] of dots(s.kind).entries()) {
        let y = d.y, radius = 10, cream = false;
        if (s.kind === 'self') {
          cream = i === 5;
          if (cream) { radius = 16; y -= 5 * Math.max(0, Math.sin((t - .25) / .8 * Math.PI)) * (t < 1.05 ? 1 : 0); }
        } else {
          // The cue passes once through the top row; the network settles as the hand rests.
          const wave = Math.exp(-Math.pow((d.col - (t - .25) * 6) / 1.7, 2));
          const envelope = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - .25) / 1.35)));
          y -= wave * envelope * (d.row === 0 ? 16 : 4);
          cream = d.row === 0 && (t > .3 && t < 1.5 ? wave > .44 : d.col === 4);
        }
        ctx.fillStyle = cream ? '#ffffff' : '#b5ceff'; ctx.beginPath(); ctx.arc(d.x, y, radius, 0, Math.PI * 2); ctx.fill();
      }
      const p = hand[s.kind], cellW = s.image.naturalWidth / 4, cellH = s.image.naturalHeight / 2;
      ctx.drawImage(s.image, pose % 4 * cellW, Math.floor(pose / 4) * cellH, cellW, cellH, p.x, p.y, p.size, p.size);
      s.frame = exposure; s.element.dataset.pose = String(pose); s.element.dataset.ready = 'true';
    }
    function exposureAt(kind: Kind, elapsed: number) {
      const last = poses[kind].length - 1;
      const forward = poses[kind].length * 1000 / FPS;
      const returning = elapsed - forward - 500;
      if (elapsed < 0) return 0;
      if (elapsed < forward) return Math.min(last, Math.floor(elapsed * FPS / 1000));
      if (returning < 0) return last;
      // Retrace the photographed poses to rest rather than snapping to frame one.
      return Math.max(0, last - Math.floor(returning * FPS / 1000));
    }
    function measure() {
      if (disposed) return;
      const top = Math.ceil(header?.getBoundingClientRect().height ?? 90);
      section.dataset.layout = innerHeight < 520 ? 'natural' : innerWidth >= 760 ? 'desktop' : 'stacked';
      section.style.setProperty('--service-top', `${top}px`);
      section.style.setProperty('--service-view', `${innerHeight - top}px`);
      stages.forEach(s => { s.frame = -1; });
      schedule();
    }
    function update(now: number) {
      raf = 0;
      if (disposed || document.hidden) return;
      const phase = now % cycle;
      section.dataset.playback = reduced.matches ? 'static' : 'looping';
      stages.forEach((s, index) => {
        const exposure = reduced.matches ? poses[s.kind].length - 1 : exposureAt(s.kind, phase - (index ? 3450 : 0));
        if (s.frame !== exposure) draw(index, exposure);
      });
      if (!reduced.matches && stages.some(s => s.ready)) schedule();
    }
    function schedule() { if (!raf && !document.hidden) raf = requestAnimationFrame(update); }
    // Hidden tabs skip painting; the clock keeps advancing, so returning resumes
    // the current phase instead of replaying an entrance performance.
    function visibility() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else schedule(); }
    stages.forEach(s => {
      s.image.onload = () => { if (disposed) return; s.ready = true; schedule(); };
      s.image.src = `/media/service-hands/${s.kind}.webp`;
    });
    const resize = new ResizeObserver(measure);
    resize.observe(inner); if (header) resize.observe(header);
    addEventListener('resize', measure);
    document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', measure);
    document.fonts.ready.then(() => { if (!disposed) measure(); }); measure();
    return () => {
      disposed = true; cancelAnimationFrame(raf); resize.disconnect();
      removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', measure);
      stages.forEach(s => { s.image.onload = null; });
    };
  }, []);

  return <section ref={root} id="services" className="service-choices" aria-labelledby="services-title">
    <div className="service-inner">
      <header className="service-heading"><h2 id="services-title">Start where you are.<br />Scale when you’re ready.</h2>
        <p>Your team in control. Or our team on it.</p></header>
      <div className="service-options">
        <div className="service-option-track"><article className="service-option"><h3>Self Serve</h3><p>Choose creators, shape the brief and approve the work.</p>
          <div className="service-stage" data-hand="self" aria-hidden="true"><Still kind="self" /><canvas /></div>
          <div className="service-details"><ul><li>Creator selection</li><li>Content approval</li></ul>
            <a className="service-self-cta" href={links.build}>Explore Self Serve <Arrow /></a></div>
        </article></div>
        <div className="service-option-track"><article className="service-option"><h3>Full Service</h3><p>A dedicated team for strategy, creators and delivery.</p>
          <div className="service-stage" data-hand="full" aria-hidden="true"><Still kind="full" /><canvas /></div>
          <div className="service-details"><ul><li>Campaign planning</li><li>Ongoing optimisation</li></ul>
            <a className="service-full-cta" href={links.call}>Talk to our team <span><Arrow /></span></a></div>
        </article></div>
      </div>
    </div>
  </section>;
}
