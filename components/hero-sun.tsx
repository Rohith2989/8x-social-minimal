'use client';

import { useEffect, useRef } from 'react';

export function HeroSun() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const sun = ref.current;
    const frame = sun?.parentElement;
    const portrait = frame?.querySelector('img');
    if (!sun || !frame || !portrait) return;
    const measure = () => {
      const outer = frame.getBoundingClientRect();
      const image = portrait.getBoundingClientRect();
      // Keep the disc behind the right-hand voices even when the artwork is
      // much narrower than an ultrawide viewport. Preserve the mobile inset.
      const inset = Math.max(outer.width * .2,
        outer.right - (image.left + image.width * .9));
      sun.style.right = `${inset}px`;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(portrait);
    portrait.addEventListener('load', measure);
    measure();
    return () => {
      observer.disconnect();
      portrait.removeEventListener('load', measure);
    };
  }, []);
  return <span ref={ref} className="hero-sun" aria-hidden="true" />;
}
