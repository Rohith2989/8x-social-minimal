'use client';

import type { ComponentPropsWithRef } from 'react';

/** One decorative surface for buttons of every size; content and semantics stay native. */
export function RasterSurface() {
  return <span className="ds-raster-surface" aria-hidden="true"><span className="ds-raster-motion"><span className="ds-raster-dots" /><span className="ds-raster-solid" /></span></span>;
}

export function RasterButton({ children, className = '', type = 'button', ...props }: ComponentPropsWithRef<'button'>) {
  return <button {...props} type={type} className={`ds-raster-button ${className}`}>{children}<RasterSurface /></button>;
}

export function RasterLink({ children, className = '', ...props }: ComponentPropsWithRef<'a'>) {
  return <a {...props} className={`ds-raster-button ${className}`}>{children}<RasterSurface /></a>;
}
