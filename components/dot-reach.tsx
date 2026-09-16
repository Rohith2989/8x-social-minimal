'use client';
import { useEffect, useRef, useState } from 'react';
import { links, reachCreator } from '@/lib/content';
import { Arrow, PlayIcon } from './icons';
import { PortraitRaster } from './portrait-raster';

export function DotReach() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);
  useEffect(() => {
    const player = video.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let inView = false;
    const sync = () => {
      if (!inView || document.hidden || reduced.matches || userPaused.current) { player.pause(); return; }
      player.muted = true;
      // A blocked autoplay attempt leaves the normal Play control available.
      void player.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .3;
      sync();
    }, { threshold: [0, .3], rootMargin: '-90px 0px 0px' });
    observer.observe(player);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
  }, []);
  return <section className="dot-reach" id="reach" aria-labelledby="reach-title">
    <div className="reach-grid page-width">
      <div className="reach-reading">
        <h2 id="reach-title">Real voices.<br />Wider reach<span>.</span></h2>
        <p>Creator content, made for the platforms your audience uses.</p>
        <a className="reach-cta" href={links.build}>Build your network<Arrow /></a>
        <ul className="reach-platforms" aria-label="Content platforms">
          {[['tiktok', 'TikTok'], ['instagram', 'Instagram'], ['youtubeshorts', 'YouTube Shorts']].map(([id, title]) => <li key={id}><img src={'/platforms/' + id + '.svg'} width="36" height="36" alt="" /><span>{title}</span></li>)}
        </ul>
      </div>
      <figure className="reach-figure">
        <div className="reach-portrait">
          <video ref={video} width="480" height="854" playsInline muted loop preload="none" poster={'/media/' + reachCreator.id + '-v1.jpg'}
            aria-label={'Original creator video from ' + reachCreator.handle} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
            <source src={'/media/' + reachCreator.id + '-v1.mp4'} type="video/mp4" />
          </video>
          <PortraitRaster />
          <span className="reach-signal" aria-hidden="true">{Array.from({length:12}, (_, i) => <i key={i} />)}</span>
          {failed && <a className="reach-fallback" href={reachCreator.source}>Watch the original<Arrow /></a>}
        </div>
        <figcaption><a href={reachCreator.source} target="_blank" rel="noreferrer">{reachCreator.handle}<Arrow /></a><button aria-label={(playing ? 'Pause' : 'Play') + ' reach video'} onClick={() => {
          const player = video.current!;
          if (playing) { userPaused.current = true; player.pause(); }
          else { userPaused.current = false; void player.play().catch(error => { if (error.name !== 'AbortError') setFailed(true); }); }
        }}><PlayIcon playing={playing} /></button></figcaption>
      </figure>
    </div>
  </section>;
}
