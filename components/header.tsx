'use client';
import { useEffect, useRef, useState } from 'react';
import { Arrow } from './icons';
import { links } from '@/lib/content';

export function Header() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState('network');
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const target = document.getElementById('work');
    if (!target) return;
    const observer = new IntersectionObserver(([e]) => setSection(e.isIntersecting ? 'work' : 'network'), { rootMargin: '-15% 0px -35% 0px' });
    observer.observe(target);
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
  return <header ref={header} className="site-header" data-menu-open={open}>
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
