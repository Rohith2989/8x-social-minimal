'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Arrow } from './icons';
import { applicationStatus, campaigns, creators, platformFiles, previewClips, type Platform } from '@/lib/dashboard-preview';

const tabs = ['Network overview', 'Content library', 'Creator performance'];
const tabLabels = ['Overview', 'Content', 'Creators'];
const clamp = (n: number) => Math.max(0, Math.min(1, n));

function PlatformMark({ platform, label = false }: { platform: Platform; label?: boolean }) {
  return <span className="dp-platform"><img src={`/platforms/${platformFiles[platform]}.svg`} width="16" height="16" alt={label ? '' : platform} />{label && <span>{platform}</span>}</span>;
}
function Platforms() {
  return <div className="dp-platforms" aria-label="Supported publishing platforms">{(Object.keys(platformFiles) as Platform[]).map(platform => <span title={platform} key={platform}><PlatformMark platform={platform} /></span>)}</div>;
}
function TabIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.55" aria-hidden="true">{index === 0 ? <path d="M5 20V11m7 9V4m7 16V8" /> : index === 1 ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m10 9 5 3-5 3Z" /></> : <><circle cx="9" cy="7" r="3" /><path d="M3 20v-3a5 5 0 0 1 10 0v3Zm12-16a3 3 0 0 1 0 6m2 3a5 5 0 0 1 4 5v2" /></>}</svg>;
}
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6.5" /><path d="m15 15 5 5" /></svg>; }

const chartValues = Array.from({ length: 66 }, (_, i) => 30 + i * .42 + Math.sin(i * .19) * 13 + Math.sin(i * .51) * 4);
function DotChart({ compact = false, variant = 0 }: { compact?: boolean; variant?: number }) {
  const count = compact ? 24 : 66, w = compact ? 180 : 730, h = compact ? 34 : 148;
  return <svg className={compact ? 'dp-spark' : 'dp-chart'} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
    {!compact && <>{[22, 62, 102].map(y => <line key={y} x1="10" y1={y} x2="720" y2={y} stroke="currentColor" opacity=".09" />)}<rect className="dp-chart-focus" x="490" y="8" width="18" height="112" fill="currentColor" opacity=".035" /></>}
    {Array.from({ length: count }, (_, i) => {
      const value = chartValues[(i + variant * 5) % chartValues.length];
      const x = compact ? 3 + i * 7.5 : 12 + i * 10.85;
      const y = compact ? 31 - value * .35 : 130 - value * 1.45;
      return <circle key={i} cx={x} cy={y} r={compact ? 1.65 : 2.25} fill={i === count - 1 ? 'var(--signal)' : 'currentColor'} />;
    })}
    {!compact && <>{['Mar 1', 'Mar 8', 'Mar 15', 'Mar 22', 'Mar 29'].map((text, i) => <text key={text} x={12 + i * 176} y="145" textAnchor={i === 4 ? 'end' : 'start'}>{text}</text>)}<circle className="dp-chart-signal" cx={12 + 65 * 10.85} cy={130 - chartValues[(65 + variant * 5) % chartValues.length] * 1.45} r="5" fill="var(--signal)" /></>}
  </svg>;
}

function Overview() {
  const [campaign, setCampaign] = useState('All campaigns');
  const rows = campaigns.filter(c => campaign === 'All campaigns' || c.name === campaign);
  function exportRows() {
    const csv = 'Example data from the original 8x product preview\nCampaign,Target,Markets,Applications,Progress\n' + rows.map(c => `${c.name},${c.target},${c.markets},${c.applications},${c.progress}%`).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = '8x-campaign-preview.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <>
    <div className="dp-panel-heading"><h3>Network overview</h3><div className="dp-heading-actions"><Platforms /><select aria-label="Campaign" value={campaign} onChange={e => setCampaign(e.target.value)}><option>All campaigns</option>{campaigns.map(c => <option key={c.name}>{c.name}</option>)}</select><button onClick={exportRows} className="dp-export">Export <span aria-hidden="true">↓</span></button></div></div>
    <dl className="dp-metrics">{[['Creators', '120.6K'], ['Videos', '265'], ['Brands', '1.7K'], ['Applications', '22.9K']].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="dp-analysis"><div className="dp-performance"><div className="dp-block-heading"><h4>Performance overview</h4><span>Illustrative trend</span></div><DotChart /></div>
      <div className="dp-status"><h4>Applications by status</h4>{applicationStatus.map((s, i) => <div className="dp-status-row" key={s.name}><span>{s.name}</span><i className="dp-bar" aria-hidden="true"><i style={{ width: `${s.percent}%`, background: i === 0 ? 'var(--signal)' : undefined }} /></i><strong>{s.count}</strong><span>{s.percent}%</span></div>)}</div></div>
    <div className="dp-campaigns"><h4>Campaign activity</h4><div className="dp-table-scroll"><table><thead><tr>{['Campaign', 'Target', 'Markets', 'Applications', 'Progress', 'Status'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(c => <tr key={c.name}><th scope="row">{c.name}</th><td>{c.target}</td><td>{c.markets}</td><td>{c.applications}</td><td><div className="dp-progress"><span className="dp-bar" aria-hidden="true"><i style={{ width: `${c.progress}%` }} /></span>{c.progress}%</div></td><td><span className="dp-status-label">Active</span></td></tr>)}</tbody></table></div></div>
    <div className="dp-panel-footer"><span>Cross-platform reporting</span><span>Source preview · example data</span></div>
  </>;
}

function ContentLibrary({ running, reduced }: { running: boolean; reduced: boolean }) {
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('All sources'), [sort, setSort] = useState('Featured');
  const [page, setPage] = useState(0), [selected, setSelected] = useState('maggie-intech'), [paused, setPaused] = useState(false), [failed, setFailed] = useState(false);
  const [manualPlayback, setManualPlayback] = useState(false);
  const playbackAllowed = !reduced || manualPlayback;
  const video = useRef<HTMLVideoElement>(null);
  const filtered = useMemo(() => {
    const result = previewClips.filter(c => `${c.title} ${c.handle ?? ''}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All sources' || (filter === '8x showcase' ? !c.platform : c.platform === filter)));
    return sort === 'A–Z' ? [...result].sort((a, b) => a.title.localeCompare(b.title)) : result;
  }, [query, filter, sort]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / 20)), currentPage = Math.min(page, pageCount - 1);
  const shown = filtered.slice(currentPage * 20, currentPage * 20 + 20);
  const selectedClip = shown.find(c => c.id === selected);
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    let cancelled = false;
    if (running && !paused && playbackAllowed && !failed) void el.play().catch(() => { if (!cancelled) setPaused(true); }); else el.pause();
    return () => { cancelled = true; el.pause(); };
  }, [running, paused, playbackAllowed, failed, selectedClip]);
  return <>
    <div className="dp-panel-heading"><h3>Content library <span>{previewClips.length} preview clips</span></h3><Platforms /></div>
    <div className="dp-toolbar"><label className="dp-search"><SearchIcon /><input type="search" aria-label="Search content" placeholder="Search content…" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} /></label><div><select aria-label="Content source" value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}><option>All sources</option><option>TikTok</option><option>Instagram</option><option>8x showcase</option></select><select aria-label="Content order" value={sort} onChange={e => { setSort(e.target.value); setPage(0); }}><option>Featured</option><option>A–Z</option></select></div></div>
    <div className="dp-library-grid">{shown.map(clip => <button className="dp-video-tile" key={clip.id} data-selected={selected === clip.id} aria-pressed={selected === clip.id} aria-label={`Preview ${clip.handle ?? clip.title}`} onClick={() => { if (selected === clip.id && playbackAllowed) setPaused(!paused); else { setSelected(clip.id); setPaused(false); setFailed(false); } setManualPlayback(true); }}><span className="dp-video-image"><img src={clip.poster} alt="" loading="lazy" width="320" height="570" />{selected === clip.id && <video key={clip.id} ref={video} src={running ? clip.video : undefined} poster={clip.poster} muted loop playsInline preload="none" onError={() => setFailed(true)} />}{selected === clip.id && <span className="dp-video-state">{failed ? 'Preview unavailable' : paused || !playbackAllowed ? 'Play' : 'Pause'}</span>}</span><span className="dp-video-title">{clip.title}</span><span className="dp-video-source">{clip.platform ? <PlatformMark platform={clip.platform} label /> : '8x showcase'}</span></button>)}{!shown.length && <p className="dp-empty">No matching videos. Try another search.</p>}</div>
    <div className="dp-panel-footer"><span>{filtered.length ? `${currentPage * 20 + 1}–${Math.min((currentPage + 1) * 20, filtered.length)} of ${filtered.length} clips` : '0 clips'}{selectedClip && <a href={selectedClip.source} target="_blank" rel="noreferrer">Open original <Arrow /></a>}</span><nav aria-label="Content pages"><button aria-label="Previous content page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>←</button><span>{currentPage + 1} / {pageCount}</span><button aria-label="Next content page" disabled={currentPage === pageCount - 1} onClick={() => setPage(currentPage + 1)}>→</button></nav></div>
  </>;
}

function CreatorPerformance() {
  const [selected, setSelected] = useState('maggie-intech'), [query, setQuery] = useState(''), [platform, setPlatform] = useState('All platforms');
  const current = creators.find(c => c.id === selected)!;
  const shown = creators.filter(c => c.handle.toLowerCase().includes(query.toLowerCase()) && (platform === 'All platforms' || c.platform === platform));
  return <>
    <div className="dp-panel-heading"><h3>Creator performance</h3><Platforms /></div>
    <div className="dp-toolbar"><label className="dp-search"><SearchIcon /><input type="search" aria-label="Find a creator" placeholder="Find a creator…" value={query} onChange={e => setQuery(e.target.value)} /></label><select aria-label="Creator platform" value={platform} onChange={e => setPlatform(e.target.value)}><option>All platforms</option><option>TikTok</option><option>Instagram</option></select></div>
    <div className="dp-creator-layout"><div className="dp-roster"><div className="dp-roster-labels"><span>Creator</span><span>Platform</span><span>Recent activity</span></div>{shown.map((c, index) => <button className="dp-creator-row" aria-pressed={selected === c.id} key={c.id} onClick={() => setSelected(c.id)}><span className="dp-person"><img src={`/media/${c.id}-v1.jpg`} width="36" height="36" alt="" loading="lazy" /><span>{c.handle}</span></span><PlatformMark platform={c.platform} label /><DotChart compact variant={index} /></button>)}{!shown.length && <p className="dp-empty">No matching creators.</p>}</div>
      <aside className="dp-inspector" aria-label="Selected creator"><div className="dp-person"><img src={`/media/${current.id}-v1.jpg`} width="56" height="56" alt="" loading="lazy" /><div><strong>{current.handle}</strong><PlatformMark platform={current.platform} label /></div></div><div className="dp-block-heading"><h4>Views over time</h4><span>Illustrative activity</span></div><DotChart variant={creators.indexOf(current)} /><div className="dp-inspector-labels"><span>Views</span><span>Engagement</span><span>Content</span></div><a href={current.source} target="_blank" rel="noreferrer">Open creator profile <Arrow /></a></aside></div>
    <div className="dp-panel-footer"><span>Creator-level reporting</span><span>Product preview · illustrative trends</span></div>
  </>;
}

export function DashboardPreview() {
  const root = useRef<HTMLElement>(null), seek = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0), [enhanced, setEnhanced] = useState(false), [running, setRunning] = useState(false), [reduced, setReduced] = useState(false);
  useEffect(() => {
    const section = root.current!, header = document.querySelector<HTMLElement>('.site-header');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, pinned = false, top = 0, travel = 0, visible = false, disposed = false;
    const update = () => {
      raf = 0;
      if (pinned) { const progress = clamp((top - section.getBoundingClientRect().top) / travel); setActive(Math.min(2, Math.floor(progress * 3))); }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    const visibility = () => setRunning(visible && !document.hidden);
    const measure = () => {
      top = Math.ceil(header?.getBoundingClientRect().height ?? 90);
      pinned = innerWidth >= 1000 && innerHeight >= 720 && !motion.matches;
      travel = Math.round(innerHeight * 2.4);
      section.dataset.pinned = String(pinned);
      section.style.setProperty('--dp-top', `${top}px`);
      section.style.setProperty('--dp-view', `${innerHeight - top}px`);
      section.style.setProperty('--dp-travel', `${pinned ? travel : 0}px`);
      setReduced(motion.matches); schedule();
    };
    seek.current = index => {
      setActive(index);
      if (pinned) scrollTo({ top: section.getBoundingClientRect().top + scrollY - top + travel * ((index + .4) / 3), behavior: 'instant' });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
    observer.observe(section.querySelector('.dp-stage')!);
    const resize = new ResizeObserver(measure); if (header) resize.observe(header);
    setEnhanced(true); measure();
    addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', measure);
    document.addEventListener('visibilitychange', visibility); motion.addEventListener('change', measure);
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect(); removeEventListener('scroll', schedule); removeEventListener('resize', measure); document.removeEventListener('visibilitychange', visibility); motion.removeEventListener('change', measure); seek.current = () => {}; };
  }, []);
  useEffect(() => {
    const focused = document.activeElement;
    const hiddenPanel = focused?.closest<HTMLElement>('.dp-panel');
    if (hiddenPanel && Number(hiddenPanel.dataset.index) !== active && root.current?.contains(hiddenPanel)) root.current.querySelector<HTMLButtonElement>(`#dashboard-tab-${active}`)?.focus({ preventScroll: true });
  }, [active]);
  return <section id="dashboard" ref={root} className="dashboard-section" data-enhanced={enhanced} data-running={running} data-active={active} aria-labelledby="dashboard-title" style={{ '--dp-active': active } as CSSProperties}>
    <div className="dp-stage page-width"><header className="dp-intro"><h2 id="dashboard-title">See exactly what’s working.<br />In real time.</h2><p>Views, creators and campaign ROI.<br />All in one place.</p></header>
      <div className="dp-screen-wrap"><div className="dp-ambient" aria-hidden="true"><i /><i /><i /></div><div className="dp-window"><nav className="dp-rail" aria-label="Dashboard views"><img className="dp-logo" src="/8x.svg" alt="8x" width="46" height="34" /><div role="tablist" aria-label="Dashboard preview" aria-orientation="vertical"><span className="dp-rail-indicator" aria-hidden="true" />{tabs.map((tab, index) => <button id={`dashboard-tab-${index}`} key={tab} role="tab" aria-selected={active === index} aria-controls={`dashboard-panel-${index}`} tabIndex={active === index ? 0 : -1} onClick={() => seek.current(index)} onKeyDown={e => { const next = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (index + 1) % 3 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (index + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1; if (next >= 0) { e.preventDefault(); seek.current(next); root.current?.querySelector<HTMLButtonElement>(`#dashboard-tab-${next}`)?.focus({ preventScroll: true }); } }}><TabIcon index={index} /><span>{tabLabels[index]}</span></button>)}</div></nav>
      <div className="dp-panels">{[<Overview key="overview" />, <ContentLibrary key="content" running={running && active === 1} reduced={reduced} />, <CreatorPerformance key="creators" />].map((panel, index) => <div key={index} className="dp-panel" role="tabpanel" id={`dashboard-panel-${index}`} aria-labelledby={`dashboard-tab-${index}`} data-index={index} data-active={active === index} aria-hidden={enhanced ? active !== index : undefined} inert={enhanced && active !== index}>{panel}</div>)}</div></div></div>
      <div className="dp-stage-footer"><div className="dp-steps" aria-label="Dashboard section progress">{tabs.map((tab, i) => <button key={tab} aria-label={`Show ${tab}`} aria-current={active === i ? 'step' : undefined} onClick={() => seek.current(i)}><span /></button>)}<span className="dp-step-name">0{active + 1} / {tabs[active]}</span></div><small>Product preview · example data</small></div>
    </div>
  </section>;
}
