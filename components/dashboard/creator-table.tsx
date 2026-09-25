'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { compact, demoCreators, totals, type DemoPost } from '@/lib/dashboard-demo';
import { Dots, Icon, Menu } from './ui';
import { RasterButton } from './raster-button';
import { CurrentButton } from './current-button';

type Creator = typeof demoCreators[number];
type Row = { creator: Creator; posts: DemoPost[]; metrics: ReturnType<typeof totals> };
type Column = 'content' | 'reach' | 'engagement';
const columnLabels: Record<Column, string> = { content: 'Recent content', reach: 'Reach', engagement: 'Engagement' };

function exportRows(rows: Row[]) {
  const cell = (v: unknown) => `"${String(v).replaceAll('"', '""')}"`;
  const records = [
    ['DEMO DATA — illustrative creator identities and campaign results'],
    ['Creator', 'Handle', 'Workflow', 'Platforms', 'Posts', 'Views', 'Engagement rate'],
    ...rows.map(({ creator, posts, metrics }) => [creator.name, creator.handle, creator.workflow,
      [...new Set(posts.map(p => p.platform))].join(' / '), metrics.posts, metrics.views, `${metrics.rate.toFixed(2)}%`]),
  ];
  const url = URL.createObjectURL(new Blob([records.map(r => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = '8x-creator-performance.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function RowActions({ row, onView, onPosts }: { row: Row; onView: () => void; onPosts: () => void }) {
  const button = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const id = `creator-actions-${row.creator.id}`;
  const isOpen = !!position;
  const close = () => { setPosition(null); button.current?.focus({ preventScroll: true }); };
  const place = () => {
    const rect = button.current!.getBoundingClientRect();
    setPosition({ left: Math.max(12, Math.min(rect.right - 206, window.innerWidth - 218)), top: rect.bottom + 166 > window.innerHeight ? Math.max(12, rect.top - 162) : Math.max(12, rect.bottom + 8) });
  };
  useEffect(() => {
    if (!isOpen) return;
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!panel.current?.contains(event.target as Node) && !button.current?.contains(event.target as Node)) setPosition(null); };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [isOpen]);
  const open = () => {
    if (position) { close(); return; }
    place();
  };
  return <>
    <RasterButton ref={button} className="ds-creator-action" aria-label={`Actions for ${row.creator.name}`} aria-haspopup="menu" aria-expanded={!!position} aria-controls={position ? id : undefined} onClick={open} onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); if (!position) open(); } }}><Dots /></RasterButton>
    {position && createPortal(<div ref={panel} id={id} role="menu" aria-label={`${row.creator.name} actions`} className="ds-creator-popup" style={position} onKeyDown={e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') close();
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault(); const items = [...panel.current!.querySelectorAll<HTMLButtonElement>('button')];
        const at = items.indexOf(document.activeElement as HTMLButtonElement);
        items[e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (at + (e.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length].focus();
      }
    }}>
      <RasterButton role="menuitem" onClick={() => { close(); onView(); }}><Icon name="eye" size={17} />View creator</RasterButton>
      <RasterButton role="menuitem" onClick={() => { close(); onPosts(); }}><Icon name="posts" size={17} />Open posts</RasterButton>
      <RasterButton role="menuitem" onClick={() => { exportRows([row]); close(); }}><Icon name="download" size={17} />Export row</RasterButton>
    </div>, document.querySelector('.ds-app')!)}
  </>;
}

export function CreatorTable({ creators, posts, query, status, page, context, onQuery, onStatus, onPage, onReset, onView, onPosts, onVideo }: {
  creators: Creator[]; posts: DemoPost[]; query: string; status: string; page: number; context: string;
  onQuery: (query: string) => void; onStatus: (status: string) => void; onPage: (page: number) => void;
  onReset: () => void;
  onView: (id: number) => void; onPosts: (handle: string) => void; onVideo: (post: DemoPost) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]), [open, setOpen] = useState<string | null>(null);
  const [sort, setSort] = useState<'reach-desc' | 'reach-asc' | 'name' | 'engagement'>('reach-desc');
  const [columns, setColumns] = useState<Record<Column, boolean>>({ content: true, reach: true, engagement: true });
  const selectAll = useRef<HTMLInputElement>(null);
  useEffect(() => { setSelected([]); setOpen(null); }, [context, query, status]);
  const rows = useMemo(() => creators.map(creator => {
    const matching = posts.filter(p => p.creator === creator.id).sort((a, b) => b.day - a.day);
    return { creator, posts: matching, metrics: totals(matching) };
  }), [creators, posts]);
  const filtered = rows.filter(({ creator }) => `${creator.name} ${creator.handle}`.toLowerCase().includes(query.toLowerCase()) &&
    (status === 'All statuses' || creator.workflow === status || creator.status === status)).sort((a, b) =>
    sort === 'name' ? a.creator.name.localeCompare(b.creator.name) : sort === 'engagement' ? b.metrics.rate - a.metrics.rate :
      (sort === 'reach-asc' ? 1 : -1) * (a.metrics.views - b.metrics.views));
  const pageCount = Math.max(1, Math.ceil(filtered.length / 5)), currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * 5, currentPage * 5);
  const picked = filtered.filter(r => selected.includes(r.creator.id));
  const allPicked = filtered.length > 0 && picked.length === filtered.length;
  useEffect(() => { if (selectAll.current) selectAll.current.indeterminate = picked.length > 0 && !allPicked; }, [picked.length, allPicked]);
  const changeSort = (next: typeof sort) => { setSort(next); onPage(1); };
  return <section className="ds-creator-ledger" aria-labelledby="creator-ledger-title">
    <header className="ds-ledger-intro"><div><span className="ds-eyebrow">YOUR CREATOR NETWORK</span><h2 id="creator-ledger-title">A network in motion.</h2><p>Every voice. Every contribution.</p></div><div className="ds-ledger-wave" aria-hidden="true" /></header>
    <div className="ds-ledger-shell">
      <div className="ds-ledger-toolbar">
        <div className="ds-ledger-tabs" role="group" aria-label="Creator workflow">
          {(['All statuses', 'Publishing', 'In review'] as const).map(value => <RasterButton key={value} aria-pressed={status === value} onClick={() => onStatus(value)}>{value === 'All statuses' ? 'All creators' : value}<span>{value === 'All statuses' ? rows.length : rows.filter(r => r.creator.workflow === value).length}</span></RasterButton>)}
        </div>
        <label className="ds-ledger-search"><Icon name="search" size={17} /><input type="search" aria-label="Search creators" value={query} placeholder="Find a creator" onChange={e => onQuery(e.target.value)} /></label>
        <Menu id="creator-columns" label="Columns" open={open} setOpen={setOpen} className="ds-ledger-columns" trigger={<><Dots /><span>Columns</span></>}>
          <span className="ds-menu-caption">Visible columns</span>{(Object.keys(columnLabels) as Column[]).map(column => <label key={column}><input type="checkbox" checked={columns[column]} onChange={e => setColumns({ ...columns, [column]: e.target.checked })} />{columnLabels[column]}</label>)}
        </Menu>
      </div>
      <div className="ds-ledger-scroll" tabIndex={0} role="region" aria-label="Creator performance table; scroll horizontally on smaller screens">
        <table className="ds-creator-table">
          <caption className="ds-sr">Creator performance for the selected campaign and reporting period</caption>
          <thead><tr>
            <th scope="col" className="ds-ledger-index"><input ref={selectAll} type="checkbox" aria-label={`Select all ${filtered.length} filtered creators`} disabled={!filtered.length} checked={allPicked} onChange={e => setSelected(e.target.checked ? filtered.map(r => r.creator.id) : [])} /></th>
            <th scope="col" aria-sort={sort === 'name' ? 'ascending' : 'none'}><RasterButton onClick={() => changeSort('name')}>Creator {sort === 'name' && <Icon name="down" size={12} />}</RasterButton></th>
            {columns.content && <th scope="col">Recent content</th>}
            {columns.reach && <th scope="col" aria-sort={sort.startsWith('reach') ? sort === 'reach-desc' ? 'descending' : 'ascending' : 'none'}><RasterButton onClick={() => changeSort(sort === 'reach-desc' ? 'reach-asc' : 'reach-desc')}>Reach <span data-ascending={sort === 'reach-asc'}><Icon name="down" size={12} /></span></RasterButton></th>}
            {columns.engagement && <th scope="col" aria-sort={sort === 'engagement' ? 'descending' : 'none'}><RasterButton onClick={() => changeSort('engagement')}>Engagement</RasterButton></th>}
            <th scope="col" className="ds-ledger-action-heading">Actions</th>
          </tr></thead>
          <tbody>{visible.map((row, index) => <tr key={row.creator.id} data-selected={selected.includes(row.creator.id)}>
            <td className="ds-ledger-index"><span className="ds-ledger-row-wave" aria-hidden="true" /><span className="ds-ledger-rank">{String((currentPage - 1) * 5 + index + 1).padStart(2, '0')}</span><input type="checkbox" aria-label={`Select ${row.creator.name}`} checked={selected.includes(row.creator.id)} onChange={e => setSelected(e.target.checked ? [...selected, row.creator.id] : selected.filter(id => id !== row.creator.id))} /></td>
            <td><RasterButton className="ds-ledger-person" onClick={() => onView(row.creator.id)}><img src={row.creator.poster} alt="" width="52" height="52" /><span><strong>{row.creator.name}</strong><span className="ds-ledger-handle">{row.creator.handle}<span className="ds-ledger-platforms">{[...new Set(row.posts.map(p => p.platform))].map(platform => <img key={platform} src={`/platforms/${platform === 'TikTok' ? 'tiktok' : 'instagram'}.svg`} alt={platform} width="14" height="14" />)}</span></span></span></RasterButton></td>
            {columns.content && <td><div className="ds-ledger-content"><div>{row.posts.slice(0, 2).map(post => <RasterButton key={post.id} onClick={() => onVideo(post)} aria-label={`Play ${post.title} by ${row.creator.name}`}><img src={post.poster} alt="" width="35" height="48" /><span><Icon name="play" size={11} /></span></RasterButton>)}</div><span>{row.metrics.posts} <small>posts</small></span></div></td>}
            {columns.reach && <td className="ds-ledger-reach"><strong>{compact(row.metrics.views)}</strong><small>views</small></td>}
            {columns.engagement && <td className="ds-ledger-engagement">{row.metrics.posts ? `${row.metrics.rate.toFixed(1)}%` : '—'}</td>}
            <td className="ds-ledger-actions"><RowActions row={row} onView={() => onView(row.creator.id)} onPosts={() => onPosts(row.creator.handle)} /></td>
          </tr>)}</tbody>
        </table>
        {!visible.length && <div className="ds-ledger-empty"><Dots /><h3>No creators match this view.</h3><p>Try another name or workflow.</p><CurrentButton variant="secondary" icon="refresh" onClick={onReset}>Reset filters</CurrentButton></div>}
      </div>
      <footer className="ds-ledger-footer">
        <span>{filtered.length ? `${(currentPage - 1) * 5 + 1}–${Math.min(currentPage * 5, filtered.length)}` : '0'} of {filtered.length} creators</span>
        {picked.length > 0 && <div className="ds-ledger-selection" role="region" aria-label="Selected creators"><strong>{picked.length} selected</strong><CurrentButton icon="download" onClick={() => exportRows(picked)}>Export selected</CurrentButton><RasterButton aria-label="Clear creator selection" onClick={() => setSelected([])}><Icon name="close" size={15} /></RasterButton></div>}
        <div className="ds-ledger-pagination"><RasterButton aria-label="Previous creator page" disabled={currentPage === 1} onClick={() => onPage(currentPage - 1)}><Icon name="chevron" size={17} /></RasterButton><span>{String(currentPage).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span><RasterButton aria-label="Next creator page" disabled={currentPage === pageCount} onClick={() => onPage(currentPage + 1)}><Icon name="chevron" size={17} /></RasterButton></div>
      </footer>
    </div>
  </section>;
}
