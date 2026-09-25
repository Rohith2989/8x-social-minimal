'use client';

import { RasterButton } from './raster-button';
import { RasterTransition } from './raster-transition';

import { useEffect, useLayoutEffect, useId, useRef, type ReactNode } from 'react';

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    overview: <><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" /></>,
    creators: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5v2" /></>,
    posts: <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="m10 8 5 4-5 4Z" /></>,
    feed: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 3v5m10-5v5M3 11h18m-13 4h2m4 0h2" /></>,
    analytics: <><path d="M4 3v17h17M7 15l4-5 4 2 5-7" /></>,
    team: <><circle cx="8" cy="7" r="3" /><circle cx="18" cy="8" r="2" /><path d="M2 21v-3a6 6 0 0 1 12 0v3m2-7a4 4 0 0 1 6 4v3" /></>,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    outward: <path d="M6 18 18 6M6 6h12v12" />,
    chevron: <path d="m8 5 7 7-7 7" />,
    down: <path d="m6 9 6 6 6-6" />,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    bell: <><path d="M9.75 19.5a2.4 2.4 0 0 0 4.5 0M12 3v1.25M5.25 16.5c1.35-1.5 1.5-3.2 1.5-6a5.25 5.25 0 0 1 10.5 0c0 2.8.15 4.5 1.5 6 .4.45.08 1.15-.52 1.15H5.77c-.6 0-.92-.7-.52-1.15Z" /></>,
    search: <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    more: <><circle cx="12" cy="5" r=".8" /><circle cx="12" cy="12" r=".8" /><circle cx="12" cy="19" r=".8" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    heart: <path d="M12 21 3 12C-2 5 6-1 12 6c6-7 14-1 9 6Z" />,
    message: <><path d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z" /><path d="M7 8h10M7 12h7" /></>,
    send: <><path d="m3 10 18-7-7 18-3-8-8-3Zm8 3 10-10" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9 8a3 3 0 1 1 4 3c-1 .5-1 1-1 3m0 3h.01" /></>,
    settings: <><path d="m9 3-1 3-3 1 1 4-2 2 2 3 3 1 1 4h4l1-4 3-1 2-3-2-2 1-4-3-1-1-3Z" /><circle cx="12" cy="12" r="3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    play: <path d="m9 5 10 7-10 7Z" />,
    flag: <><path d="M5 21V3c5-3 9 3 14 0v10c-5 3-9-3-14 0" /></>,
    copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 5V3H3v13h2" /></>,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    filter: <><path d="M3 6h18M6 12h12M9 18h6" /></>,
    refresh: <><path d="M20 8a8 8 0 1 0 0 8M20 3v5h-5" /></>,
    link: <><path d="m10 14 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 2 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" /></>,
  };
  return <svg className="ds-icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] ?? paths.overview}</svg>;
}
export function Dots() { return <span className="ds-dotmark" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</span>; }
export function PlatformMark({ name }: { name: string }) {
  return <span className={`ds-platform ds-platform-${name.toLowerCase()}`} title={name}><img src={`/platforms/${name === 'TikTok' ? 'tiktok' : name === 'Instagram' ? 'instagram' : 'youtubeshorts'}.svg`} alt={name} width="19" height="19" /></span>;
}
export function Banner() {
  return <div className="ds-banner" aria-hidden="true"><div className="ds-banner-dots" /><div className="ds-banner-wedge" /><div className="ds-banner-eight">8</div><div className="ds-banner-paper"><span /></div><div className="ds-banner-step" /><div className="ds-banner-words">Ideas<br />multiply.</div><div className="ds-banner-arch" /></div>;
}
export function Menu({ id, label, open, setOpen, children, className = '', icon, trigger, align = 'right' }: { id: string; label: string; open: string | null; setOpen: (v: string | null) => void; children: ReactNode; className?: string; icon?: string; trigger?: ReactNode; align?: 'left' | 'right' }) {
  const root = useRef<HTMLDivElement>(null), button = useRef<HTMLButtonElement>(null);
  const active = open === id;
  useLayoutEffect(() => {
    if (!active) return;
    const panel = root.current?.querySelector<HTMLElement>('.ds-menu-panel');
    if (!panel) return;
    const fit = () => {
      panel.style.translate = '0px 0px';
      panel.style.maxHeight = `${Math.max(120, innerHeight - 24)}px`;
      const anchor = button.current?.getBoundingClientRect();
      if (!anchor) return;
      // A short window can use the space above the trigger. The list, rather
      // than the whole page, then handles any remaining overflow natively.
      const below = Math.max(100, innerHeight - anchor.bottom - 24);
      const above = Math.max(100, anchor.top - 24);
      const wanted = panel.scrollHeight;
      const flipped = wanted > below && above > below;
      panel.dataset.placement = flipped ? 'above' : 'below';
      panel.style.maxHeight = `${Math.min(innerHeight - 24, flipped ? above : below)}px`;
      const rect = panel.getBoundingClientRect();
      const shift = rect.left < 12 ? 12 - rect.left : rect.right > innerWidth - 12 ? innerWidth - 12 - rect.right : 0;
      const top = Math.max(12, Math.min(flipped ? anchor.top - rect.height - 12 : anchor.bottom + 12, innerHeight - rect.height - 12));
      // Inline sidebar menus remain part of the sidebar's own scroll flow.
      const inline = getComputedStyle(panel).position === 'static';
      panel.style.translate = inline ? '0px 0px' : `${shift}px ${top - rect.top}px`;
      panel.style.setProperty('--popup-anchor-x', `${anchor.left + anchor.width / 2 - rect.left - shift}px`);
    };
    fit(); window.addEventListener('resize', fit);
    const onScroll = (event: Event) => { if (!(event.target instanceof Node) || !panel.contains(event.target)) fit(); };
    window.addEventListener('scroll', onScroll, true);
    return () => { window.removeEventListener('resize', fit); window.removeEventListener('scroll', onScroll, true); };
  }, [active, className]);
  useEffect(() => {
    if (!active) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(null); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [active, setOpen]);
  return <div ref={root} className={`ds-menu ${className}`} data-open={active} onKeyDown={e => {
    if (e.key === 'Escape') { e.stopPropagation(); setOpen(null); button.current?.focus(); }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
      const items = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('.ds-menu-panel button:not(:disabled), .ds-menu-panel input') ?? []);
      if (items.length) { e.preventDefault(); const at = items.indexOf(document.activeElement as HTMLButtonElement); items[e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (at + (e.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length]?.focus(); }
    }
  }}><RasterButton ref={button} className="ds-menu-trigger" aria-label={label} aria-expanded={active} aria-controls={`${id}-panel`} onClick={() => setOpen(active ? null : id)} onKeyDown={e => { if (e.key === 'ArrowDown' && !active) { e.preventDefault(); setOpen(id); requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('.ds-menu-panel button')?.focus()); } }}>{trigger ?? <>{icon && <Icon name={icon} />}<span>{label}</span><Icon name="down" size={14} /></>}</RasterButton>{active && <div id={`${id}-panel`} className="ds-menu-panel" data-align={align} onClick={() => { if (className.includes('ds-filter-menu')) requestAnimationFrame(() => { if (!root.current?.querySelector('.ds-menu-panel') && document.activeElement === document.body) button.current?.focus({ preventScroll: true }); }); }}>{children}</div>}</div>;
}
export function Choice({ active, children, onClick, description }: { active?: boolean; children: ReactNode; onClick: () => void; description?: string }) {
  return <RasterButton type="button" className="ds-choice" aria-pressed={active} onClick={onClick}><span>{children}{description && <small>{description}</small>}</span>{active ? <Icon name="check" size={17} /> : <span className="ds-choice-dot" />}</RasterButton>;
}
export function Modal({ title, children, onClose, className = '', kind = '', context = '8x workspace', detail = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string; kind?: string; context?: string; detail?: string }) {
  const dialog = useRef<HTMLDialogElement>(null), titleId = useId();
  useEffect(() => {
    const el = dialog.current;
    const before = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    el?.showModal();
    return () => { el?.close(); document.body.style.overflow = overflow; before?.focus(); };
  }, []);
  return <dialog ref={dialog} className={`ds-dialog ${className}`} aria-labelledby={titleId} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }} data-kind={kind}><div className="ds-dialog-frame">{kind !== 'post' && <aside className="ds-dialog-rail" aria-hidden="true"><span className="ds-popup-tab" /><Dots /><span className="ds-rail-context">{context}</span><p>{kind === 'export' ? <>Your work,<br />in numbers.</> : kind === 'brief' ? <>A shared<br />direction.</> : kind === 'creator' ? <>People.<br />Possibility.</> : <>Your work.<br />Connected.</>}</p><small>{detail || '8x social / Workspace'}</small></aside>}<div className="ds-dialog-main"><header><div><span className="ds-eyebrow">{kind === 'export' ? 'Export report' : kind === 'post' ? 'Content preview' : '8x workspace'}</span><h2 id={titleId}>{title}</h2></div><RasterButton className="ds-icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></RasterButton></header><RasterTransition layout="dialog" revision={title}>{children}</RasterTransition></div></div></dialog>;
}
