'use client';

import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { Dots, Icon } from './ui';
import { RasterSurface } from './raster-button';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: string;
  variant?: 'primary' | 'secondary';
  onAction?: () => Promise<void>;
  readyLabel?: string;
};

/** Shared action surface. Busy feedback follows real work, never a cosmetic delay. */
export function CurrentButton({ children, icon = 'arrow', variant = 'primary',
  className = '', type = 'button', disabled, onClick, onAction,
  readyLabel = 'Done', ...props }: Props) {
  const [phase, setPhase] = useState<'idle' | 'working' | 'ready' | 'error'>('idle');
  const locked = useRef(false), mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const label = phase === 'ready' ? readyLabel : phase === 'error' ? 'Try again' : children;
  return <button {...props} type={type}
    className={`ds-current-button ds-current-${variant} ${className}`}
    data-phase={phase} disabled={disabled} aria-disabled={disabled || phase === 'working'}
    aria-busy={phase === 'working'} onClick={async event => {
      if (disabled || locked.current) { event.preventDefault(); return; }
      onClick?.(event);
      if (!onAction || event.defaultPrevented) return;
      locked.current = true; setPhase('working');
      try {
        // Yield one paint before serialization without slowing down the action.
        await new Promise<void>(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
        await onAction();
        if (mounted.current) setPhase('ready');
      } catch {
        if (mounted.current) setPhase('error');
      } finally { locked.current = false; }
    }}>
    <RasterSurface />
    <span className="ds-current-label">
      {onAction && <><span className="ds-current-reserve" aria-hidden="true">{children}</span><span className="ds-current-reserve" aria-hidden="true">{readyLabel}</span><span className="ds-current-reserve" aria-hidden="true">Try again</span></>}
      <span>{label}</span>
    </span>
    <span className="ds-current-disc" aria-hidden="true">{phase === 'working' ? <Dots /> : <Icon name={phase === 'ready' ? 'check' : phase === 'error' ? 'refresh' : icon} size={16} />}</span>
    {onAction && <span className="ds-sr" role="status">{phase === 'working' ? 'Preparing report' : phase === 'ready' ? 'Report ready. Download started.' : phase === 'error' ? 'Export failed. Try again.' : ''}</span>}
  </button>;
}
