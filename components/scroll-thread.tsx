'use client';

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function ScrollThread() {
  const root = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  useEffect(() => {
    const rail = root.current!;
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - innerHeight;
      const progress = distance > 0 ? clamp(scrollY / distance) : 0;
      rail.style.setProperty('--thread-position', `${36 + progress * Math.max(0, rail.clientHeight - 60)}px`);
      rail.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      rail.setAttribute('aria-valuetext', `${Math.round(progress * 100)}% through the page`);
      rail.dataset.scrollable = String(distance > 0);
      const middle = innerHeight / 2;
      const stone = document.getElementById('day-to-day');
      const map = document.getElementById('reach-atlas')?.getBoundingClientRect();
      const services = document.getElementById('services')?.getBoundingClientRect();
      rail.dataset.surface = map && (services ?? map).top <= middle && map.bottom >= middle ? 'orange'
        : stone && stone.getBoundingClientRect().top <= middle ? 'stone' : 'carbon';
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(queue);
    resize.observe(document.body);
    resize.observe(rail);
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    document.documentElement.dataset.scrollThread = 'true';
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
      delete document.documentElement.dataset.scrollThread;
    };
  }, []);

  const seek = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const progress = clamp((event.clientY - box.top - 48) / (box.height - 60));
    window.scrollTo({ top: progress * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' });
  };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const amount = event.key === 'ArrowDown' ? 80 : event.key === 'ArrowUp' ? -80
      : event.key === 'PageDown' ? innerHeight * .85 : event.key === 'PageUp' ? -innerHeight * .85 : 0;
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      window.scrollTo({ top: event.key === 'Home' ? 0 : document.documentElement.scrollHeight, behavior: 'instant' });
    } else if (amount) {
      event.preventDefault();
      window.scrollBy({ top: amount, behavior: 'instant' });
    }
  };
  return <div ref={root} className="scroll-thread" role="scrollbar" aria-label="Page scroll position"
    aria-controls="main" aria-orientation="vertical" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}
    tabIndex={0} data-surface="carbon" onKeyDown={keyboard}
    onPointerDown={event => {
      if (event.button !== 0) return;
      dragging.current = true;
      event.currentTarget.dataset.dragging = 'true';
      event.currentTarget.setPointerCapture(event.pointerId);
      seek(event);
    }} onPointerMove={event => { if (dragging.current) seek(event); }}
    onPointerUp={event => { dragging.current = false; event.currentTarget.dataset.dragging = 'false'; }}
    onLostPointerCapture={event => { dragging.current = false; event.currentTarget.dataset.dragging = 'false'; }}>
    <span className="scroll-thread-track" aria-hidden="true"><span className="scroll-thread-marker" /></span>
  </div>;
}
