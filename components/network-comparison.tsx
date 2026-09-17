'use client';

import { useEffect, useRef, useState } from 'react';
import { Arrow } from './icons';
import { links } from '@/lib/content';

const approaches = [
  { id: 'network', title: '8x network', caption: 'An ongoing creator programme', values: ['Original creator videos', 'Creator accounts', 'Run by 8x'] },
  { id: 'influencers', title: 'Influencers', caption: 'Creator partnerships', values: ['Sponsored posts', 'Partner audiences', 'Creator or agency'] },
  { id: 'ads', title: 'Paid ads', caption: 'Media campaigns', values: ['Ad creative', 'Paid placements', 'Media buying'] },
] as const;
const labels = ['Content', 'Distribution', 'Management'];

// A bounded print field: three layers breathe instead of animating hundreds of dots.
const printDots = Array.from({ length: 360 }, (_, index) => {
  const column = index % 20, row = Math.floor(index / 20);
  const x = 7 + column * 11 + (row % 2) * 5.5, y = 7 + row * 11;
  const density = Math.max(0, Math.min(1, (x / 220 * .7 + y / 198 * .8 - .55) / .85));
  return { x, y, r: .35 + density ** 1.7 * 3.6, opacity: .15 + density * .8, layer: index % 3 };
});

function DotPrint() {
  return <svg className="comparison-print" viewBox="0 0 230 210" aria-hidden="true" focusable="false">
    {[0, 1, 2].map(layer => <g key={layer} className={`comparison-print-layer layer-${layer}`}>
      {printDots.filter(dot => dot.layer === layer).map(dot => <circle key={`${dot.x}-${dot.y}`} cx={dot.x} cy={dot.y} r={dot.r} opacity={dot.opacity} />)}
    </g>)}
  </svg>;
}

function CardContent({ index, visualOnly = false }: { index: number; visualOnly?: boolean }) {
  const approach = approaches[index];
  const cta = <>Build your network<Arrow /></>;
  return <div className="comparison-content">
    <header className="comparison-option-heading">
      <h3 id={visualOnly ? undefined : `comparison-${approach.id}`}>{index === 0 && <i aria-hidden="true" />}{approach.title}</h3>
      <p>{approach.caption}</p>
      <div className="comparison-signature" aria-hidden="true">{Array.from({ length: index === 0 ? 5 : index === 1 ? 3 : 1 }, (_, i) => <i key={i} />)}</div>
    </header>
    <dl>{labels.map((label, row) => <div key={label}><dt>{label}</dt><dd>{approach.values[row]}</dd></div>)}</dl>
    {index === 0 && (visualOnly ? <span className="comparison-cta">{cta}</span> : <a className="comparison-cta" href={links.build}>{cta}</a>)}
  </div>;
}

export function NetworkComparison() {
  const root = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [touched, setTouched] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const active = hovered ?? focused ?? touched;

  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }, { threshold: 0 });
    if (root.current) observer.observe(root.current);
    document.addEventListener('visibilitychange', update);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
  }, []);

  return <section ref={root} id="comparison" className="network-comparison" aria-labelledby="comparison-title" data-running={running}>
    <div className="comparison-layout page-width">
      <div className="comparison-intro">
        <h2 id="comparison-title">Why brands are<br />{' '}moving budget here<span>.</span></h2>
        <p>Three ways to reach people. A different way to build.</p>
      </div>
      <div className="comparison-portrait" aria-hidden="true">
        <img src="/media/comparison-portrait.webp" width="1086" height="1448" loading="lazy" decoding="async" alt="" />
      </div>
      <div className="comparison-options" aria-label="Content, distribution and management compared">
        {approaches.map((approach, index) => <article key={approach.id}
          className="comparison-option" tabIndex={0} aria-labelledby={`comparison-${approach.id}`}
          data-active={active === index} data-kind={approach.id}
          onPointerEnter={event => { if (event.pointerType === 'mouse' || event.pointerType === 'pen') setHovered(index); }}
          onPointerLeave={() => setHovered(null)}
          onPointerDown={event => { if (event.pointerType === 'touch') setTouched(index); }}
          onFocus={() => setFocused(index)}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(null); }}
          onKeyDown={event => { if (event.key === 'Escape') { setHovered(null); setFocused(null); setTouched(null); event.currentTarget.blur(); } }}>
          <CardContent index={index} />
          {/* One shared mask reveals ink and light text at exactly the same edge.
              The visual copy is inert; there is still only one accessible CTA. */}
          <div className="comparison-ink" aria-hidden="true" inert><DotPrint /><CardContent index={index} visualOnly /></div>
        </article>)}
      </div>
    </div>
  </section>;
}
