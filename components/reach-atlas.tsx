'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Arrow } from './icons';
import { links } from '@/lib/content';
import markets from '@/lib/reach-markets.json';

type Country = typeof markets[number] & { dots: string; outline: string };
type Atlas = { background: string; countries: Country[]; highlightCount: number };
const regions = ['All markets', 'Americas', 'Europe', 'Africa', 'Asia'];
const accents = ['#b5dcff', '#cfbafa', '#fff3e6', '#ffe0a3'];
const marketColor = (code: string) => accents[[...code].reduce((sum, c) => sum + c.charCodeAt(0), 0) % accents.length];

export function ReachAtlas() {
  const root = useRef<HTMLElement>(null), map = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Atlas | null>(null);
  const [hover, setHover] = useState<string | null>(null), [selected, setSelected] = useState<string | null>(null);
  const [region, setRegion] = useState('All markets'), [reduced, setReduced] = useState(false);
  const [entered, setEntered] = useState(false), [hydrated, setHydrated] = useState(false);
  const current = selected || hover;
  const country = markets.find(c => c.code === current);
  const available = markets.filter(c => region === 'All markets' || c.region === region);

  useEffect(() => {
    setHydrated(true);
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update(); mq.addEventListener('change', update);
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); io.disconnect(); }
    }, { threshold: .08 });
    io.observe(map.current!);
    return () => { mq.removeEventListener('change', update); io.disconnect(); };
  }, []);

  useEffect(() => {
    const abort = new AbortController(); let started = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started) return;
      started = true;
      fetch('/reach/atlas.json', { signal: abort.signal }).then(response => {
        if (!response.ok) throw Error('Atlas unavailable');
        return response.json();
      }).then((atlas: Atlas) => setData(atlas)).catch(() => {});
    }, { rootMargin: '900px' });
    io.observe(root.current!);
    return () => { abort.abort(); io.disconnect(); };
  }, []);

  useEffect(() => {
    if (!selected || innerWidth > 700) return;
    const c = markets.find(item => item.code === selected), scroller = map.current?.parentElement;
    if (c && scroller && map.current) scroller.scrollTo({ left: c.anchor[0] / 1440 * map.current.offsetWidth - scroller.clientWidth * .42, behavior: reduced ? 'instant' : 'smooth' });
  }, [selected, reduced]);

  const choose = (code: string | null) => { setSelected(code); setHover(null); };
  const leave = () => { setHover(null); map.current?.style.setProperty('--ra-mx', '0px'); map.current?.style.setProperty('--ra-my', '0px'); };
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.pointerType !== 'mouse') return;
    const code = (event.target as Element).closest('[data-country]')?.getAttribute('data-country') || null;
    setHover(code);
    if (!reduced && code) {
      const box = event.currentTarget.getBoundingClientRect();
      map.current!.style.setProperty('--ra-mx', `${((event.clientX - box.left) / box.width - .5) * 4}px`);
      map.current!.style.setProperty('--ra-my', `${((event.clientY - box.top) / box.height - .5) * 3}px`);
    }
  };
  const labelStyle = country ? { left: `${Math.min(80, Math.max(10, country.anchor[0] / 1440 * 100 + 2.5))}%`, top: `${Math.min(78, Math.max(8, country.anchor[1] / 600 * 100 - 5))}%`, '--ra-accent': marketColor(country.code) } as CSSProperties : undefined;

  return <section id="reach-atlas" ref={root} className="reach-atlas" aria-labelledby="atlas-title" data-ready={!!data} data-entered={entered} data-selected={current || ''} data-paused={reduced} onKeyDown={event => { if (event.key === 'Escape') choose(null); }}>
    <div className="ra-sheet page-width">
      <header className="ra-heading"><h2 id="atlas-title">One brief.<br />Many markets.</h2><div className="ra-intro"><p>Creator campaigns across multiple markets. One point of contact.</p><a href={links.call}>Plan your markets<Arrow /></a></div></header>
      <div className="ra-map-scroll" tabIndex={0} role="region" aria-label="Interactive world map. Use the country selector below to explore all listed markets.">
        <div className="ra-map" ref={map} onPointerLeave={leave}>
          {!data && <img className="ra-fallback" src="/reach/atlas-fallback.svg" width="1440" height="620" alt="World map highlighting the 51 listed network markets" />}
          {data && <svg className="ra-geography" viewBox="0 0 1440 600" aria-hidden="true" onPointerMove={pointer} onClick={event => { const code = (event.target as Element).closest('[data-country]')?.getAttribute('data-country'); if (code) choose(selected === code ? null : code); }}>
            <path className="ra-land" d={data.background} />
            {data.countries.map(c => <g key={c.code} className={`ra-country${current === c.code ? ' is-active' : ''}${region !== 'All markets' && region !== c.region ? ' is-outside' : ''}`} data-code={c.code} style={{ '--ra-accent': marketColor(c.code) } as CSSProperties}>
              <path className="ra-country-shadow" d={c.dots} /><path className="ra-country-face" d={c.dots} />
            </g>)}
            <g className="ra-hit-regions">{data.countries.map(c => <g key={c.code} data-country={c.code}><path d={c.outline} />{c.count < 8 && <circle cx={c.anchor[0]} cy={c.anchor[1]} r={8} />}</g>)}</g>
          </svg>}
          <div className="ra-count"><strong>61</strong><span>countries. One brief.</span></div>
          {country && <aside className="ra-country-label" style={labelStyle} aria-live="polite"><span className="ra-label-stem" /><span className="ra-market-name">{country.name}</span><a href={links.call}>Explore this market<Arrow /></a>{selected && <button className="ra-clear" onClick={() => choose(null)} aria-label="Clear selected market">×</button>}</aside>}
        </div>
      </div>
      <div className="ra-controls">
        <nav className="ra-regions" aria-label="Filter markets by region">{regions.map(r => <button key={r} disabled={!hydrated} aria-pressed={region === r} onClick={() => { setRegion(r); choose(null); }}>{r === 'All markets' ? 'All markets' : r}</button>)}</nav>
        <label className="ra-select-label" htmlFor="reach-market"><span>Find your market</span><select id="reach-market" disabled={!hydrated} value={selected || ''} onChange={event => choose(event.target.value || null)}><option value="">Choose a country</option>{available.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select></label>
      </div>
    </div>
  </section>;
}
