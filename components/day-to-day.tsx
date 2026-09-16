'use client';
import { useEffect, useRef, useState } from 'react';
import { RasterEdge } from './raster-edge';
import { Arrow, PlayIcon } from './icons';
import { links, dayCreator } from '@/lib/content';

const steps = [
  ['Find your people.', 'Creators who fit your category and audience.'],
  ['Keep content moving.', 'Briefs, reviews and publishing. Kept moving by 8x.'],
  ['See what works.', 'Content tracking and performance reporting, brought together.'],
];

export function DayToDay() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // The earlier native-scroll stage measures its height after hydration.
    // Resolve this preview's deep link after that measurement and font layout.
    let cancelled = false, frame = 0;
    void document.fonts.ready.then(() => {
      if (cancelled || location.hash !== '#day-to-day') return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          const target = document.getElementById('day-to-day');
          if (!cancelled && target && location.hash === '#day-to-day') window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 96, behavior: 'instant' });
        });
      });
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const player = video.current!;
    const observer = new IntersectionObserver(([e]) => { if (!e.isIntersecting) player.pause(); });
    observer.observe(player);
    const pause = () => { if (document.hidden) player.pause(); };
    document.addEventListener('visibilitychange', pause);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pause); };
  }, []);
  return <section id="day-to-day" className="day-to-day" aria-labelledby="day-title">
    <RasterEdge seam />
    <div className="day-grid page-width">
      <div className="day-reading">
        <h2 id="day-title">Your network.<br />Our day-to-day.</h2>
        <p className="day-description">From finding creators to keeping content moving.</p>
        <div className="day-steps">
          {steps.map(([title, body], index) => <div className="day-step" data-active={active === index} key={title}>
            <h3><button id={'step-' + index} aria-expanded={active === index} aria-controls={'step-panel-' + index} onClick={() => setActive(index)}>{title}<span aria-hidden="true">{active === index ? '●' : '+'}</span></button></h3>
            <div id={'step-panel-' + index} role="region" aria-labelledby={'step-' + index} hidden={active !== index}><p>{body}</p></div>
          </div>)}
        </div>
        <a className="day-cta" href={links.build}>Build your network<Arrow /></a>
      </div>
      <figure className="day-figure">
        <div className="day-film">
          <video ref={video} width="480" height="854" preload="none" playsInline muted loop poster={'/media/' + dayCreator.id + '-v1.jpg'} aria-label={'Original creator example from ' + dayCreator.handle}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
            <source src={'/media/' + dayCreator.id + '-v1.mp4'} type="video/mp4" />
          </video>
          <RasterEdge revision={active} />
          {failed && <a className="day-fallback" href={dayCreator.source}>Watch the original <Arrow /></a>}
        </div>
        <figcaption><a href={dayCreator.source} target="_blank" rel="noreferrer">{dayCreator.handle}<Arrow /></a><button aria-label={playing ? 'Pause creator example' : 'Play creator example'} onClick={() => { const player = video.current!; if (playing) player.pause(); else void player.play().catch(() => setFailed(true)); }}><PlayIcon playing={playing} /></button></figcaption>
      </figure>
    </div>
  </section>;
}
