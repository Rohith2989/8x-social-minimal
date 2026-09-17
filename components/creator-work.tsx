'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { clips } from '@/lib/content';
import { CreatorVideo } from './creator-video';

export function CreatorWork() {
  const journey = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true);
  const activeRef = useRef(0);
  const manual = useRef<{ y: number; sound: boolean } | null>(null);
  const desktop = useRef(false);

  const select = useCallback((index: number) => {
    manual.current = { y: window.scrollY, sound: false };
    activeRef.current = index; setActive(index);
    if (!desktop.current && rail.current && window.innerWidth < 720) {
      const card = rail.current.children[index] as HTMLElement;
      rail.current.scrollTo({ left: card.offsetLeft - rail.current.offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
  }, []);
  const attention = useCallback((sound: boolean) => { manual.current = { y: window.scrollY, sound }; }, []);

  useEffect(() => {
    const root = journey.current!, content = stage.current!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, span = 0, stickyTop = 0;
    let anchorFrame = 0, anchorCancelled = false;
    const initialHash = window.location.hash;
    const cancelAnchor = () => { anchorCancelled = true; cancelAnimationFrame(anchorFrame); };
    const measure = () => {
      setReduced(motion.matches);
      const height = content.getBoundingClientRect().height;
      desktop.current = window.innerWidth >= 1050 && window.innerHeight >= 700 && height < window.innerHeight - 150 && !motion.matches;
      span = desktop.current ? Math.min(window.innerHeight * .95, 1100) : 0;
      stickyTop = Math.max(125, (window.innerHeight - height) / 2 + 18);
      root.style.setProperty('--read-distance', span + 'px');
      root.style.setProperty('--stage-height', height + 'px');
      root.style.setProperty('--stage-top', stickyTop + 'px');
      root.dataset.sticky = String(desktop.current);
      schedule();
    };
    const draw = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const progress = span ? Math.max(0, Math.min(1, (stickyTop - rect.top) / span)) : 0;
      root.dataset.progress = progress.toFixed(4);
      if (!desktop.current) return;
      const latch = manual.current;
      if (latch && !latch.sound && Math.abs(window.scrollY - latch.y) > 110) manual.current = null;
      if (manual.current) return;
      const index = Math.min(2, Math.floor(progress * 3));
      if (index !== activeRef.current) { activeRef.current = index; setActive(index); }
    };
    function schedule() { if (!raf) raf = requestAnimationFrame(draw); }
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    const visibility = new IntersectionObserver(([entry]) => {
      const shown = entry.isIntersecting;
      setInView(shown);
      if (shown) root.dataset.entered = 'true';
      else manual.current = null;
    }, { rootMargin: '-90px 0px -12% 0px', threshold: .08 });
    visibility.observe(content);
    measure();
    // Hydrating the reading interval changes the position of later anchors.
    // Restore only the initial fragment, once fonts/layout settle, never after user input.
    const anchorEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    anchorEvents.forEach(type => window.addEventListener(type, cancelAnchor, { passive: true, once: true }));
    const restoreAnchor = () => { void document.fonts.ready.then(() => {
      if (anchorCancelled || !initialHash || window.location.hash !== initialHash) return;
      anchorFrame = requestAnimationFrame(() => {
        measure();
        anchorFrame = requestAnimationFrame(() => {
          if (anchorCancelled) return;
          const target = document.getElementById(initialHash.slice(1));
          if (target && (root.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) target.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
      });
    }); };
    if (document.readyState === 'complete') restoreAnchor();
    else window.addEventListener('load', restoreAnchor, { once: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    motion.addEventListener('change', measure);
    return () => { cancelAnchor(); window.removeEventListener('load', restoreAnchor); anchorEvents.forEach(type => window.removeEventListener(type, cancelAnchor)); cancelAnimationFrame(raf); observer.disconnect(); visibility.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); motion.removeEventListener('change', measure); };
  }, []);

  useEffect(() => {
    const element = rail.current!;
    let timer: ReturnType<typeof setTimeout>;
    const follow = () => {
      if (window.innerWidth >= 720) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const center = element.scrollLeft + element.clientWidth / 2;
        let nearest = 0, distance = Infinity;
        Array.from(element.children).forEach((child, index) => {
          const card = child as HTMLElement;
          const d = Math.abs(card.offsetLeft - element.offsetLeft + card.clientWidth / 2 - center);
          if (d < distance) { distance = d; nearest = index; }
        });
        activeRef.current = nearest; setActive(nearest);
      }, 100);
    };
    element.addEventListener('scroll', follow, { passive: true });
    return () => { clearTimeout(timer); element.removeEventListener('scroll', follow); };
  }, []);

  return <section ref={journey} id="work" className="work-journey page-width" aria-labelledby="work-title" data-active={clips[active].id}>
    <div ref={stage} className="work-stage">
      <div className="work-reading">
        <h2 id="work-title">Creator content.<br />Built for the feed.</h2>
        <p className="work-description">Creators publish in their own voice.<br className="desktop-break" /> We run the operation behind it.</p>
        <div className="work-selection">
          <div className="clip-selectors" role="group" aria-label="Choose a creator example">
            {clips.map((clip, index) => <button key={clip.id} aria-pressed={active === index} aria-controls="creator-media" onClick={() => select(index)}><span className="selection-dot" aria-hidden="true" />{clip.title}</button>)}
          </div>
        </div>
      </div>
      <div className="work-media" id="creator-media" role="region" aria-label="Original creator clips">
        <div className="video-rail" ref={rail}>
          {clips.map((clip, index) => <CreatorVideo key={clip.id} index={index} active={index === active} inView={inView} reduced={reduced} onSelect={select} onAttention={attention} />)}
        </div>
      </div>
    </div>
  </section>;
}
