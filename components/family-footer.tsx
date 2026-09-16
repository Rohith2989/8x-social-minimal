'use client';

import { useEffect, useRef } from 'react';
import { Arrow } from './icons';
import { links } from '@/lib/content';
import mark from '@/lib/footer-mark.json';

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { const t = clamp(x); return t * t * t * (t * (t * 6 - 15) + 10); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const products = [
  { name: 'Careers', href: 'https://8x.careers' }, { name: 'Sale' },
  { name: 'Social', href: '#network' }, { name: 'Research' }, { name: 'Next', placeholder: true },
];

export function FamilyFooter() {
  const root = useRef<HTMLElement>(null), stage = useRef<HTMLDivElement>(null), artwork = useRef<SVGSVGElement>(null);
  const ink = useRef<SVGGElement>(null), depth = useRef<SVGGElement>(null), suffix = useRef<SVGPathElement>(null);
  const solidMask = useRef<SVGLinearGradientElement>(null), printMask = useRef<SVGLinearGradientElement>(null);
  useEffect(() => {
    const journey = root.current!, content = stage.current!, el = artwork.current!, motion = matchMedia('(prefers-reduced-motion: reduce)');
    let span = 0, top = 100, raf = 0, progress = 0, target = 0, last = 0;
    let measured = false;
    const draw = () => {
      // Lift the complete silhouette, turn it, then lay it onto the print plane.
      // Every layer shares one transform, so the serif edges never scatter.
      const turn = ease((progress - .18) / .36);
      const lift = ease((progress - .07) / .16) * (1 - ease((progress - .46) / .14));
      const reveal = ease((progress - .6) / .23);
      const transform = `translate(${mix(280, 450, turn)} ${300 - lift * 18}) scale(${mix(1.64, 3, turn)} ${mix(1.64, 2.2, turn)}) rotate(${turn * 90}) translate(-93 -132)`;
      ink.current!.setAttribute('transform', transform);
      depth.current!.setAttribute('transform', transform);
      depth.current!.setAttribute('opacity', String(lift));
      // Three shallow registration layers compress together as the mark lands.
      Array.from(depth.current!.children).forEach((layer, i) => {
        const distance = (3 - i) * lift;
        layer.setAttribute('transform', `translate(${distance * 1.1} ${distance * 1.8})`);
      });
      suffix.current!.setAttribute('opacity', String(1 - ease((progress - .05) / .12)));
      const sweep = mix(-50, 950, reveal);
      for (const mask of [solidMask.current!, printMask.current!]) {
        mask.setAttribute('x1', String(sweep - 42)); mask.setAttribute('x2', String(sweep + 42));
      }
      journey.dataset.progress = progress.toFixed(3);
      journey.dataset.phase = progress < .07 ? 'original' : progress < .18 ? 'lift' : progress < .6 ? 'turn' : progress < .83 ? 'impression' : 'settled';
    };
    const sample = () => {
      if (motion.matches) return 1;
      const rect = journey.getBoundingClientRect();
      // Tall windows may reach the document end before the theoretical pin ends.
      const available = Math.max(1, document.documentElement.scrollHeight - innerHeight - (rect.top + scrollY) + top);
      const distance = Math.min(span, available);
      journey.style.setProperty('--family-distance', `${distance}px`);
      return span ? clamp((top - rect.top) / distance) : clamp((innerHeight * .8 - el.getBoundingClientRect().top) / (innerHeight * .65));
    };
    const tick = (time: number) => {
      raf = 0;
      if (document.hidden) { last = 0; return; }
      target = sample();
      const dt = last ? Math.min(64, time - last) : 16; last = time;
      progress = motion.matches ? 1 : mix(progress, target, 1 - Math.exp(-dt / 85));
      if (Math.abs(progress - target) < .0003) progress = target;
      draw();
      const running = Math.abs(progress - target) >= .0003;
      journey.dataset.running = String(running);
      if (running) raf = requestAnimationFrame(tick); else last = 0;
    };
    const schedule = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); };
    const measure = () => {
      top = innerWidth <= 700 ? 82 : 110;
      const stageHeight = content.getBoundingClientRect().height;
      span = !motion.matches && stageHeight + top + 20 < innerHeight ? innerHeight * 1.15 : 0;
      journey.style.setProperty('--family-travel', `${span}px`);
      journey.style.setProperty('--family-height', `${stageHeight}px`);
      journey.style.setProperty('--family-top', `${top}px`);
      journey.dataset.pinned = String(span > 0);
      if (!measured) { progress = sample(); measured = true; }
      draw(); journey.dataset.ready = 'true'; schedule();
    };
    const observer = new ResizeObserver(measure); observer.observe(el); observer.observe(content);
    measure(); window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', measure);
    motion.addEventListener('change', measure); document.addEventListener('visibilitychange', schedule);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); motion.removeEventListener('change', measure); document.removeEventListener('visibilitychange', schedule); };
  }, []);

  return <div className="family-ending">
    <div className="family-seam" aria-hidden="true"><svg width="100%" height="72"><defs><pattern id="family-edge" width="8" height="72" patternUnits="userSpaceOnUse">{Array.from({ length: 9 }, (_, y) => <circle key={y} cx="4" cy={y * 8 + 2} r={5.8 * Math.pow(1 - y / 9, 1.3)} fill="#f34b32" />)}</pattern></defs><rect width="100%" height="72" fill="url(#family-edge)" /></svg></div>
    <section id="family" className="family-journey" ref={root} aria-label="Explore the 8x family" data-running="false">
      <div className="family-stage page-width" ref={stage}>
        <div className="family-art" role="img" aria-label="The original 8 turns horizontally, then a print reveal changes its ink to dots as you scroll.">
          <img className="family-fallback" src="/footer/infinity.svg" alt="" width="900" height="600" />
          <svg ref={artwork} viewBox="0 0 900 600" fill="#171922" aria-hidden="true">
            <defs>
              <linearGradient id="family-solid-gradient" ref={solidMask} gradientUnits="userSpaceOnUse" x1="-85" x2="-15" y1="0" y2="0"><stop stopColor="black" /><stop offset="1" stopColor="white" /></linearGradient>
              <linearGradient id="family-print-gradient" ref={printMask} gradientUnits="userSpaceOnUse" x1="-85" x2="-15" y1="0" y2="0"><stop stopColor="white" /><stop offset="1" stopColor="black" /></linearGradient>
              <mask id="family-solid-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="600"><rect width="900" height="600" fill="url(#family-solid-gradient)" /></mask>
              <mask id="family-print-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="900" height="600"><rect width="900" height="600" fill="url(#family-print-gradient)" /></mask>
            </defs>
            <g mask="url(#family-solid-mask)"><g ref={depth} opacity="0">{[.08, .16, .24].map((opacity, i) => <path key={i} d={mark.eight} opacity={opacity} />)}</g><g ref={ink}><path d={mark.eight} /></g></g>
            <path ref={suffix} d={mark.x} transform="translate(280 300) scale(1.64) translate(-93 -132)" />
            <g className="family-print-layer" mask="url(#family-print-mask)">{mark.dots.map(([a,b,r], i) => <circle key={i} cx={450-(b-132)*3} cy={300+(a-93)*2.2} r={r} />)}</g>
          </svg>
        </div>
        <div className="family-directory"><h2>Explore 8x</h2><ul>{products.map(product => <li key={product.name}>
          {product.href ? <a href={product.href} aria-label={'8x ' + product.name}><img src="/8x.svg" alt="8x" width="386" height="264" /><span>{product.name}</span><Arrow /></a>
            : <div className="family-product"><img src="/8x.svg" alt="8x" width="386" height="264" /><span>{product.name}</span>{product.placeholder && <small>Placeholder</small>}</div>}
        </li>)}</ul></div>
      </div>
    </section>
    <footer id="contact" className="family-footer page-width" aria-label="8x Social footer">
      <div className="family-contact"><a className="family-brand" href="#network" aria-label="8x Social back to top"><img src="/8x.svg" alt="" width="386" height="264" /><span>social</span></a><a className="family-call" href={links.call}>Build your network.<Arrow /></a></div>
      <div className="family-bottom"><span>© {new Date().getFullYear()} 8x Social</span><nav aria-label="Company"><a href={links.creators}>For creators</a><a href="https://www.linkedin.com/company/8xhq">LinkedIn</a><a href={links.call}>Contact</a></nav><nav aria-label="Legal"><a href="https://www.8x.social/en/privacy">Privacy</a><a href="https://www.8x.social/en/terms">Terms</a></nav><a href="#network">Back to top ↑</a></div>
    </footer>
  </div>;
}
