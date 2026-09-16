'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Arrow } from './icons';
import { links } from '@/lib/content';

const modes = [
  { id: 'network', label: '8x network', items: [
    ['Creator-led', 'content', 'Creators make and publish in their own voice.'],
    ['Organic', 'distribution', 'Content reaches people through the feed.'],
    ['Managed', 'end to end', 'Briefs, reviews, payments. Handled by 8x.'],
  ] },
  { id: 'influencers', label: 'Influencers', items: [
    ['Sponsored', 'content', 'Creators feature your brand in sponsored posts.'],
    ['Creator', 'audiences', 'Distribution through the creator’s existing audience.'],
    ['Campaign', 'partnerships', 'Scope and delivery agreed with the creator or agency.'],
  ] },
  { id: 'ads', label: 'Paid ads', items: [
    ['Ad', 'creative', 'Creative produced for advertising placements.'],
    ['Paid', 'distribution', 'Placement funded by your media spend.'],
    ['Campaign', 'controls', 'Targeting, budgets and optimisation through ad tools.'],
  ] },
] as const;

function DotGlyph({ mode, column }: { mode: number; column: number }) {
  return <svg className="comparison-glyph" viewBox="0 0 100 100" aria-hidden="true">
    {Array.from({ length: 36 }, (_, i) => {
      const size = mode === 0 && column !== 1 ? 4 : 6;
      const slot = i % (size * size);
      let x = 8 + slot % size * (72 / (size - 1));
      let y = 8 + Math.floor(slot / size) * (72 / (size - 1));
      if (mode === 1) {
        const group = Math.floor(i / 12);
        const angle = (i % 12) / 12 * Math.PI * 2;
        x = [25, 67, 46][group] + Math.cos(angle) * 18;
        y = [26, 26, 67][group] + Math.sin(angle) * 18;
      }
      if (mode === 2) x += Math.floor(i / 6) % 2 * 5;
      const accent = mode === 0 ? (column === 1 ? [8, 9, 10].includes(i) : i === 6) : mode === 1 ? i % 12 === column * 3 : Math.floor(i / 6) === column + 1;
      return <circle key={i} r="3.5" style={{ transform: `translate(${x}px, ${y}px)`, opacity: i < size * size ? 1 : 0, fill: accent ? '#f34b32' : '#111', transitionDelay: `${i % 6 * 12}ms` }} />;
    })}
  </svg>;
}

export function NetworkComparison() {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect(); }
    }, { threshold: .12 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % modes.length;
    else if (event.key === 'ArrowLeft') next = (index + modes.length - 1) % modes.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = modes.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return <section ref={root} id="comparison" className="network-comparison" aria-labelledby="comparison-title" data-entered={entered}>
    <div className="page-width">
      <div className="comparison-intro">
        <h2 id="comparison-title">A different way<br />to grow<span>.</span></h2>
        <p>Creator networks bring content, distribution and daily management together.</p>
      </div>
      <div className="comparison-tabs" role="tablist" aria-label="Compare ways to reach your audience">
        {modes.map((mode, index) => <button key={mode.id} ref={el => { tabs.current[index] = el; }} role="tab" id={'comparison-tab-' + mode.id} aria-selected={active === index} aria-controls={'comparison-panel-' + mode.id} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => onKeyDown(event, index)}>{mode.label}</button>)}
      </div>
      <div className="comparison-glyphs" aria-hidden="true">{[0, 1, 2].map(column => <DotGlyph key={column} mode={active} column={column} />)}</div>
      {/* Layer intrinsic layouts so the longest mode reserves its space at every width. */}
      <div className="comparison-panels">
        {modes.map((mode, index) => <div key={mode.id} role="tabpanel" id={'comparison-panel-' + mode.id} aria-labelledby={'comparison-tab-' + mode.id} className="comparison-panel" data-active={active === index} aria-hidden={active !== index} inert={active !== index} tabIndex={active === index ? 0 : -1}>
          {mode.items.map(([first, second, body]) => <div className="comparison-benefit" key={first}>
            <h3>{first}<br />{' '}{second}<span>.</span></h3><p>{body}</p>
          </div>)}
        </div>)}
      </div>
      <a className="comparison-cta" href={links.build}>Build your network<Arrow /></a>
    </div>
  </section>;
}
