'use client';

import { useRef, useState, type ReactNode } from 'react';
import { CurrentButton } from './current-button';
import { RasterButton } from './raster-button';
import { Icon, Menu, PlatformMark } from './ui';

export function FilterOption({ active, children, onClick, icon, count, multiple = false }: {
  active: boolean; children: ReactNode; onClick: () => void; icon?: ReactNode; count?: number; multiple?: boolean;
}) {
  return <RasterButton className="ds-filter-option" role={multiple ? 'checkbox' : undefined} aria-checked={multiple ? active : undefined} aria-pressed={multiple ? undefined : active} data-selected={active} onClick={onClick}>
    {icon && <span className="ds-filter-symbol" aria-hidden="true">{icon}</span>}
    <span className="ds-filter-label">{children}</span>{count !== undefined && <span className="ds-filter-count">{count}</span>}
    <span className="ds-filter-check" aria-hidden="true">{active && <Icon name="check" size={15} />}</span>
    <span className="ds-filter-wave" aria-hidden="true" />
  </RasterButton>;
}

export function PlatformFilter({ id, value, open, setOpen, onChange }: {
  id: string; value: string; open: string | null; setOpen: (v: string | null) => void; onChange: (v: string) => void;
}) {
  const platforms = ['TikTok', 'Instagram'];
  const selected = platforms.filter(p => value === 'All platforms' || p === value);
  function toggle(platform: string) {
    const next = selected.includes(platform) ? selected.filter(p => p !== platform) : [...selected, platform];
    onChange(next.length === 2 ? 'All platforms' : next[0] ?? 'No platforms');
  }
  return <Menu id={id} label={value} open={open} setOpen={setOpen} className="ds-filter-menu ds-platform-filter" trigger={<><span className="ds-filter-marks" aria-hidden="true">{(selected.length ? selected : platforms).map(p => <PlatformMark key={p} name={p} />)}</span><span>{selected.length === 2 ? 'Platforms · 2' : selected[0] ?? 'Platforms · 0'}</span><Icon name="down" size={14} /></>}>
    <h3 className="ds-filter-heading">Where your audience is</h3>
    <div role="group" aria-label="Platforms">{platforms.map(p => <FilterOption key={p} multiple active={selected.includes(p)} icon={<PlatformMark name={p} />} onClick={() => toggle(p)}>{p}</FilterOption>)}</div>
    <footer className="ds-filter-footer"><span aria-live="polite">{selected.length} {selected.length === 1 ? 'platform' : 'platforms'} selected</span><RasterButton onClick={() => onChange(selected.length ? 'No platforms' : 'All platforms')}>{selected.length ? 'Clear' : 'Select all'}</RasterButton></footer>
  </Menu>;
}

export function ReportingDatePicker({ from, to, onApply }: { from: number; to: number; onApply: (from: number, to: number, range: string) => void }) {
  const [start, setStart] = useState(from), [end, setEnd] = useState(to), [pickingEnd, setPickingEnd] = useState(false);
  const [preset, setPreset] = useState('Custom');
  const grid = useRef<HTMLDivElement>(null);
  function choose(day: number) {
    setPreset('Custom');
    if (!pickingEnd) { setStart(day); setEnd(day); setPickingEnd(true); }
    else { setStart(Math.min(start, day)); setEnd(Math.max(start, day)); setPickingEnd(false); }
  }
  return <div className="ds-period-picker">
    <div className="ds-period-body"><nav className="ds-period-presets" aria-label="Date presets">{[['7D', 'Last 7 days'], ['1M', 'Last 30 days'], ['Lifetime', 'This month'], ['Custom', 'Custom range']].map(([key, label]) => <RasterButton key={key} aria-pressed={preset === key} onClick={() => { setPreset(key); setPickingEnd(false); if (key !== 'Custom') { setStart(key === '7D' ? 18 : 1); setEnd(24); } }}>{label}</RasterButton>)}</nav>
      <div className="ds-period-calendar"><header><strong>September 2026</strong><span>Campaign reporting</span></header><div className="ds-weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}</div>
        <div ref={grid} className="ds-date-grid" onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
          const day = Number((event.target as HTMLElement).dataset.day); if (!day) return;
          event.preventDefault(); event.stopPropagation();
          const next = event.key === 'Home' ? 1 : event.key === 'End' ? 24 : Math.max(1, Math.min(24, day + ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key] ?? 0)));
          grid.current?.querySelector<HTMLButtonElement>(`[data-day="${next}"]`)?.focus();
        }}><span />{Array.from({ length: 30 }, (_, i) => i + 1).map(day => <RasterButton key={day} data-day={day} disabled={day > 24} data-selected={day >= start && day <= end} data-edge={day === start || day === end} aria-label={`September ${day}`} aria-pressed={day >= start && day <= end} onClick={() => choose(day)}><span>{day}</span></RasterButton>)}</div>
        <p className="ds-period-hint" aria-live="polite">{pickingEnd ? 'Choose the end date.' : 'Data available through 24 September.'}</p>
      </div></div>
    <footer className="ds-period-footer"><span>{start} – {end} September 2026</span><CurrentButton icon="arrow" aria-label="Apply dates" disabled={pickingEnd} onClick={() => onApply(start, end, preset)}>Apply period</CurrentButton></footer>
  </div>;
}
