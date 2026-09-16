'use client';
import { useEffect, useRef, useState } from 'react';
import { Arrow } from './icons';
import { links } from '@/lib/content';

export function Header() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState('network');
  const [stone, setStone] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const start = document.getElementById('day-to-day');
    if (!start) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const edge = header.current?.getBoundingClientRect().bottom ?? 0;
      setStone(start.getBoundingClientRect().top <= edge);
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
  }, []);
  useEffect(() => {
    const targets = ['work', 'day-to-day', 'reach', 'comparison'].map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) { if (entry.isIntersecting) visible.add(entry.target); else visible.delete(entry.target); }
      setSection(visible.size ? 'work' : 'network');
    }, { rootMargin: '-15% 0px -35% 0px' });
    targets.forEach(target => observer.observe(target));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); } };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('keydown', close);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', close); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <header ref={header} className="site-header" data-menu-open={open} data-surface={stone ? 'stone' : 'carbon'}>
    <div className="nav-rail">
      <a className="brand" href="#network" aria-label="8x Social — back to top" onClick={() => setOpen(false)}><img src="/8x.svg" alt="" width="68" height="47" /><span>social</span></a>
      <button ref={menuButton} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '−' : '+'}</span></button>
      <nav id="main-navigation" aria-label="Main navigation">
        <a href="#network" className="nav-link" aria-current={section === 'network' ? 'location' : undefined} onClick={() => setOpen(false)}>The network</a>
        <a href="#work" className="nav-link" aria-current={section === 'work' ? 'location' : undefined} onClick={() => setOpen(false)}>How it works</a>
        <a href={links.creators} className="nav-link" onClick={() => setOpen(false)}>For creators</a>
        <a href={links.call} className="nav-contact" onClick={() => setOpen(false)}>Let’s talk<Arrow /></a>
      </nav>
    </div>
  </header>;
}
