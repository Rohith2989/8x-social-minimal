'use client';

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

// Content selectors are deliberately specific: navigation, filters, headings and
// controls remain crisp. Shapes are measured from the real responsive layout.
const shapesByLayout: Record<string, string> = {
  statistics: '.ds-main-metrics strong,.ds-metric-links strong,.ds-chart-svg>path:first-of-type,.ds-post-image,.ds-post-handle,.ds-post-views strong',
  creators: '.ds-ledger-person>img,.ds-ledger-person strong,.ds-ledger-handle,.ds-ledger-content button,.ds-ledger-content>span,.ds-ledger-reach strong,.ds-ledger-engagement',
  posts: '.ds-content-cell>img,.ds-content-cell strong,.ds-content-cell small,.ds-table tbody td:nth-child(n+3):not(:nth-child(4))',
  feed: '.ds-post-image,.ds-post-handle,.ds-post-views strong',
  calendar: '.ds-publishing-grid>button>strong,.ds-day-dots,.ds-publishing-grid>button>span:not(.ds-raster-surface),.ds-publishing-grid>button>small',
  plan: '.ds-direction-portrait>img,.ds-direction-intro h3,.ds-direction-intro>p,.ds-direction-hook p,.ds-direction-beats li,.ds-brief-specs strong,.ds-standard p',
  analytics: '.ds-analytics-heading strong,.ds-chart-svg>path:first-of-type,.ds-platform-rows strong,.ds-platform-rows>button>span:not(.ds-platform):not(.ds-raster-surface)',
  team: '.ds-member>.ds-avatar-initial,.ds-member strong,.ds-member small,.ds-member>.ds-status',
  dialog: '.ds-report-metrics dd,.ds-creator-detail>img,.ds-creator-detail h3,.ds-creator-detail p,.ds-dialog-clips img,.ds-post-info h3,.ds-post-info>p:not(.ds-panel-note),.ds-post-info dd,.ds-export-summary strong,.ds-help-content p,.ds-form input:not([type=checkbox]),.ds-form textarea,.ds-player',
};
type Shape = { x: number; y: number; w: number; h: number; r: number; light: boolean; kind: string; path?: string; matrix?: string };
type Frame = { w: number; h: number; print: Shape[]; media: Shape[] };

export function RasterTransition({ layout, revision, quiet = false, children, className = '' }: {
  layout: string; revision: string; quiet?: boolean; children: ReactNode; className?: string;
}) {
  const root = useRef<HTMLDivElement>(null), content = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(':', '');
  const [frame, setFrame] = useState<Frame>({ w: 1, h: 1, print: [], media: [] });
  const [resolving, setResolving] = useState(false), [waiting, setWaiting] = useState(false);
  useLayoutEffect(() => {
    const host = root.current!, body = content.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let finished = quiet || reduce.matches, raf = 0, disposed = false;
    let settle: ReturnType<typeof setTimeout>, announce: ReturnType<typeof setTimeout> | undefined;
    const failed = new WeakSet<Element>();
    const watched = new Map<HTMLImageElement | HTMLVideoElement, () => void>();
    const marked = new Set<HTMLElement | SVGElement>();
    const shapeOf = (el: Element, origin: DOMRect): Shape | null => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2 || !el.getClientRects().length) return null;
      let left = Math.max(rect.left, origin.left), right = Math.min(rect.right, origin.right), top = rect.top, bottom = rect.bottom;
      // Clip table stencils to their scroll viewport, rather than painting over
      // the neighbouring columns on narrow screens.
      const scroll = el.closest('.ds-ledger-scroll,.ds-table-scroll');
      if (scroll) { const clip = scroll.getBoundingClientRect(); left = Math.max(left, clip.left); right = Math.min(right, clip.right); top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom); }
      if (right <= left || bottom <= top) return null;
      const style = getComputedStyle(el);
      const radius = style.borderTopLeftRadius.includes('%') ? Math.min(rect.width, rect.height) / 2 : parseFloat(style.borderTopLeftRadius) || 2;
      const shape: Shape = { x: left - origin.left, y: top - origin.top, w: right - left, h: bottom - top, r: radius, light: !!el.closest('.ds-blue-panel,.ds-performance,.ds-player,.ds-brief-banner'), kind: el.matches('img,video,.ds-post-image,.ds-player') ? 'media' : 'text' };
      if (el instanceof SVGPathElement) {
        const matrix = el.getScreenCTM();
        if (matrix) { shape.path = el.getAttribute('d') ?? ''; shape.matrix = `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e - origin.left} ${matrix.f - origin.top})`; shape.kind = 'chart'; }
      }
      return shape;
    };
    const isPending = (el: HTMLImageElement | HTMLVideoElement) => !failed.has(el) && (el instanceof HTMLImageElement ? !el.complete : !el.error && el.readyState < 2);
    function measure() {
      raf = 0; if (disposed) return;
      const origin = host.getBoundingClientRect();
      const print: Shape[] = [], media: Shape[] = [];
      if (!finished) body.querySelectorAll<HTMLElement | SVGElement>(shapesByLayout[layout] ?? shapesByLayout.dialog).forEach(el => {
        const shape = shapeOf(el, origin); if (!shape) return;
        if (shape.kind === 'text' && !el.matches('.ds-avatar-initial,.ds-day-dots,.ds-ledger-content button')) {
          // Reserve each actual text line, never an arbitrary full-width bar.
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let text: Node | null;
          while ((text = walker.nextNode())) {
            if (!text.textContent?.trim()) continue;
            const range = document.createRange(); range.selectNodeContents(text);
            for (const rect of range.getClientRects()) {
              const x = Math.max(shape.x, rect.left - origin.left), y = Math.max(shape.y, rect.top - origin.top);
              const w = Math.min(shape.x + shape.w, rect.right - origin.left) - x, h = Math.min(shape.y + shape.h, rect.bottom - origin.top) - y;
              if (w > 1 && h > 1) print.push({ ...shape, x, y, w, h, r: 2 });
            }
          }
        } else print.push(shape);
        el.setAttribute('data-raster-arriving', 'true'); marked.add(el);
      });
      body.querySelectorAll<HTMLImageElement | HTMLVideoElement>('img:not([src^="/platforms/"]),video').forEach(el => {
        if (!watched.has(el)) {
          const change = () => { el.removeAttribute('data-raster-pending'); schedule(); };
          const error = () => { failed.add(el); change(); };
          el.addEventListener('load', change); el.addEventListener('loadeddata', change); el.addEventListener('error', error);
          watched.set(el, () => { el.removeEventListener('load', change); el.removeEventListener('loadeddata', change); el.removeEventListener('error', error); el.removeAttribute('data-raster-pending'); });
        }
        if (isPending(el)) {
          const shape = shapeOf(el, origin);
          if (shape) { media.push(shape); el.setAttribute('data-raster-pending', 'true'); }
        } else el.removeAttribute('data-raster-pending');
      });
      watched.forEach((cleanup, el) => { if (!body.contains(el)) { cleanup(); watched.delete(el); } });
      const next = { w: Math.max(1, origin.width), h: Math.max(1, origin.height), print, media };
      setFrame(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      const visiblePending = media.some(s => s.y + origin.top < innerHeight && s.y + s.h + origin.top > 0);
      if (visiblePending && !announce) announce = setTimeout(() => { if (!disposed) setWaiting(true); }, 180);
      if (!visiblePending) { clearTimeout(announce); announce = undefined; setWaiting(false); }
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(measure); }
    function finish() {
      finished = true; marked.forEach(el => el.removeAttribute('data-raster-arriving')); marked.clear(); setResolving(false); schedule();
    }
    const preference = () => { if (reduce.matches) finish(); };
    setResolving(!finished); measure();
    // Cosmetic only: actual content and controls are available from the first
    // paint. This timer removes the print layer; it never gates data or input.
    settle = setTimeout(finish, 640);
    const resize = new ResizeObserver(schedule); resize.observe(body);
    const changes = new MutationObserver(schedule); changes.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'poster'] });
    body.addEventListener('scroll', schedule, true); window.addEventListener('resize', schedule); window.addEventListener('scroll', schedule, { passive: true });
    reduce.addEventListener('change', preference);
    return () => {
      disposed = true; cancelAnimationFrame(raf); clearTimeout(settle); clearTimeout(announce); resize.disconnect(); changes.disconnect();
      body.removeEventListener('scroll', schedule, true); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule);
      reduce.removeEventListener('change', preference); watched.forEach(cleanup => cleanup()); marked.forEach(el => el.removeAttribute('data-raster-arriving'));
    };
  }, [layout, revision, quiet]);

  const shapeNode = (s: Shape, index: number) => s.path ? <path key={index} d={s.path} transform={s.matrix} /> : <rect key={index} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} />;
  return <div ref={root} className={`ds-raster-transition ${className}`} data-raster-layout={layout} data-raster-phase={resolving ? 'resolve' : 'ready'}>
    <div ref={content} className="ds-raster-content">{children}</div>
    {(frame.print.length > 0 || frame.media.length > 0) && <svg className="ds-raster-stencil" width={frame.w} height={frame.h} viewBox={`0 0 ${frame.w} ${frame.h}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-dots`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#8aaeff" /></pattern>
        <pattern id={`${id}-light`} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#d5e4ff" /></pattern>
        <linearGradient id={`${id}-current`}><stop stopColor="#87aaff" stopOpacity="0" /><stop offset=".48" stopColor="#87aaff" stopOpacity=".22" /><stop offset=".62" stopColor="#bfd4ff" stopOpacity=".65" /><stop offset="1" stopColor="#87aaff" stopOpacity="0" /></linearGradient>
        <mask id={`${id}-pending`}><g fill={`url(#${id}-light)`}>{frame.media.map(shapeNode)}</g></mask>
        <mask id={`${id}-print`}><g fill={`url(#${id}-light)`}>{frame.print.map(shapeNode)}</g></mask>
      </defs>
      {resolving && <g className="ds-raster-print" key={revision}>{[false, true].map(light => <g key={String(light)} fill={`url(#${id}-${light ? 'light' : 'dots'})`}>{frame.print.filter(s => s.light === light).map(shapeNode)}</g>)}<g mask={`url(#${id}-print)`}><rect className="ds-raster-route-current" x={-frame.w} y="0" width={frame.w} height={frame.h} fill={`url(#${id}-current)`} /></g></g>}
      <g className="ds-raster-media" data-pending-count={frame.media.length}>
        {frame.media.map((s, i) => <g key={i}><rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} fill={s.light ? '#152944' : '#f6f8fe'} /><rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} opacity=".45" fill={`url(#${id}-${s.light ? 'light' : 'dots'})`} /></g>)}
        <g mask={`url(#${id}-pending)`}><rect className="ds-raster-current" x={-frame.w} y="0" width={frame.w} height={frame.h} fill={`url(#${id}-current)`} /></g>
      </g>
    </svg>}
    <span className="ds-sr" role="status" aria-live="polite">{waiting ? 'Loading media previews.' : ''}</span>
  </div>;
}
