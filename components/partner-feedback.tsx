'use client';

import { useEffect, useRef, type RefObject } from 'react';
import dots from '@/lib/feedback-dots.json';

const duration = 2200;
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const p = clamp(n); return p * p * (3 - 2 * p); };

// One automatic entrance per page visit. No hover, pointer or focus dependency.
// Each panel observes itself so the stacked mobile quote doesn't animate offscreen.
function useImpression(ref: RefObject<HTMLElement | null>, render: (element: HTMLElement, progress: number) => void) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false, elapsed = 0, previous = 0, raf = 0, complete = false;
    const draw = () => render(element, elapsed / duration);
    const finish = () => {
      complete = true; elapsed = duration; cancelAnimationFrame(raf); raf = 0;
      element.dataset.phase = 'settled'; draw();
    };
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden || complete) { previous = 0; return; }
      if (previous) elapsed = Math.min(duration, elapsed + Math.min(now - previous, 64));
      previous = now;
      element.dataset.phase = 'playing';
      draw();
      if (elapsed >= duration) finish();
      else raf = requestAnimationFrame(tick);
    };
    const update = () => {
      if (complete) return;
      // Read current geometry: queued IO records can be stale after font/layout
      // changes or a fast anchor jump on mobile.
      const bounds = element.getBoundingClientRect();
      const shown = Math.max(0, Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top));
      visible = bounds.height > 0 && shown / bounds.height >= .2;
      if (reduced.matches) { finish(); return; }
      if (visible && !document.hidden && !complete) {
        if (!raf) { previous = 0; raf = requestAnimationFrame(tick); }
      } else { cancelAnimationFrame(raf); raf = 0; previous = 0; }
    };
    element.dataset.phase = 'waiting';
    draw();
    const observer = new IntersectionObserver(update, { threshold: [0, .2] });
    observer.observe(element);
    const size = new ResizeObserver(() => { draw(); update(); }); size.observe(element);
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); size.disconnect();
      reduced.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('scroll', update);
    };
  }, [ref, render]);
}

function drawResult(element: HTMLElement, progress: number) {
  const canvas = element.querySelector('canvas');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  const width = element.clientWidth, dpr = Math.min(devicePixelRatio || 1, 2);
  const scale = width / 900;
  const w = Math.round(width * dpr), h = Math.round(width * 470 / 900 * dpr);
  if (!w || !h) return;
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
  ctx.clearRect(0, 0, 900, 470);
  const travel = smooth((progress - .07) / .67);
  const waveRadius = travel * 720;
  const amplitude = Math.sin(Math.PI * clamp(progress / .82)) * 3.8;
  // Two paint batches, fixed 3,741 dots, no React updates or work after settling.
  for (const ink of [0, 1]) {
    ctx.beginPath(); ctx.fillStyle = ink ? '#151515' : '#c6c1b6';
    for (const [x, y, r, isInk] of dots.dots) {
      if (isInk !== ink) continue;
      const dx = x - 289, dy = y - 345, distance = Math.hypot(dx, dy) || 1;
      const band = Math.exp(-(((distance - waveRadius) / 46) ** 2));
      const shift = band * amplitude;
      const px = x + dx / distance * shift, py = y + dy / distance * shift;
      const radius = r * (1 + band * amplitude * .028);
      ctx.moveTo(px + radius, py); ctx.arc(px, py, radius, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  element.dataset.canvas = 'ready';
}

function bloomPanel(element: HTMLElement, progress: number) {
  const ink = element.querySelector<HTMLElement>('.feedback-ink');
  if (!ink) return;
  const p = smooth((progress - .055) / .67);
  if (p >= 1) ink.style.clipPath = 'none';
  else {
    // Smooth, gently lobed central bloom; shared mask keeps both text layers aligned.
    const points = Array.from({ length: 96 }, (_, i) => {
      const angle = i / 96 * Math.PI * 2;
      const radius = p * 94 * (1 + .055 * Math.sin(angle * 3 + .4) + .035 * Math.cos(angle * 5));
      return `${50 + Math.cos(angle) * radius}% ${48 + Math.sin(angle) * radius}%`;
    });
    ink.style.clipPath = `polygon(${points.join(',')})`;
  }
  element.style.setProperty('--feedback-finish', String(smooth((progress - .5) / .25)));
}

const fringe = Array.from({ length: 390 }, (_, i) => {
  const row = Math.floor(i / 65), col = i % 65;
  return <circle key={i} cx={col * 8 + (row % 2) * 4} cy={row * 8 + 3}
    r={Math.max(.25, 3.1 - row * .52)} opacity={1 - row * .12} />;
});

function ClientWords() {
  return <div className="feedback-words">
    <span className="feedback-quotation" aria-hidden="true">“</span>
    <blockquote cite="https://www.8x.social/en/for-brands">We operate across multiple markets and needed a creator strategy that could move fast <span>without losing quality.</span></blockquote>
    <div className="feedback-attribution"><strong>AI SaaS brand</strong><span>Growth Team</span></div>
  </div>;
}

export function PartnerFeedback() {
  const result = useRef<HTMLDivElement>(null), quote = useRef<HTMLElement>(null);
  useImpression(result, drawResult);
  useImpression(quote, bloomPanel);

  return <section id="partner-feedback" className="partner-feedback" aria-labelledby="feedback-title">
    <div className="page-width">
      <header className="feedback-heading"><h2 id="feedback-title">Good work.<br />Heard back<span>.</span></h2><p>Partner feedback<i aria-hidden="true" /></p></header>
      <div className="feedback-spread">
        <div className="feedback-result">
          <div ref={result} className="feedback-dot-art" role="img" aria-label="2.2 million campaign reach">
            <svg className="feedback-dot-fallback" viewBox="0 0 900 470" aria-hidden="true"><path d={dots.groundPath} fill="#c6c1b6" /><path d={dots.inkPath} fill="#151515" /></svg>
            <canvas aria-hidden="true" />
            <svg className="feedback-result-thread" viewBox="0 0 900 470" aria-hidden="true"><path d="M24 409 H876 Q896 409 900 421" /><circle cx="54" cy="409" r="4" /></svg>
          </div>
          <p className="feedback-result-label">Campaign reach</p>
          <dl className="feedback-facts"><div><dt>Creator videos</dt><dd>650+</dd></div><div><dt>TikTok + Instagram</dt><dd>India + UAE</dd></div></dl>
        </div>
        <article ref={quote} className="feedback-quote" aria-label="Feedback from an AI SaaS brand">
          <ClientWords />
          <div className="feedback-ink" aria-hidden="true" inert><ClientWords /></div>
          <svg className="feedback-fringe" viewBox="0 0 520 54" preserveAspectRatio="none" aria-hidden="true">{fringe}</svg>
          <svg className="feedback-quote-thread" viewBox="0 0 520 24" preserveAspectRatio="none" aria-hidden="true"><path d="M0 1 Q20 20 42 20 H516" /></svg>
        </article>
      </div>
    </div>
  </section>;
}
