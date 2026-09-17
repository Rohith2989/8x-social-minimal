'use client';
import { useEffect, useRef, useState } from 'react';
import { clips } from '@/lib/content';
import { Arrow } from './icons';
import { MediaRaster } from './media-raster';

type Props = { index: number; active: boolean; inView: boolean; reduced: boolean; onSelect: (index: number) => void; onAttention: (sound: boolean) => void };
export function CreatorVideo({ index, active, inView, reduced, onSelect, onAttention }: Props) {
  const clip = clips[index];
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting && entry.intersectionRatio >= .3), { threshold: .3 });
    observer.observe(video.current!);
    sync(); document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  useEffect(() => {
    const player = video.current;
    if (!inView || !onScreen || !visible) { player?.pause(); setManualPlay(false); return; }
    if (userPaused || (reduced && !manualPlay)) { player?.pause(); return; }
    if (!loaded) { setLoaded(true); return; }
    player?.play()?.catch(error => { if (error.name !== 'AbortError') setPlaying(false); });
  }, [inView, onScreen, visible, reduced, manualPlay, userPaused, loaded]);
  const toggle = () => {
    onSelect(index); onAttention(false);
    if (playing) { setUserPaused(true); video.current?.pause(); }
    else {
      setUserPaused(false); setManualPlay(true); setFailed(false);
      if (!loaded) setLoaded(true);
      else { if (video.current?.error) video.current.load(); void video.current?.play().catch(() => setPlaying(false)); }
    }
  };
  return <figure className="creator-card" data-active={active} data-clip={clip.id}>
    <div className="video-shell">
      <MediaRaster active={inView && onScreen && visible && !reduced} />
      <div className="video-frame">
        <video ref={video} width="480" height="854" poster={'/media/' + clip.id + '-v1.jpg'} preload="none" muted playsInline loop
          aria-label={'Creator video: ' + clip.title} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => { setFailed(true); setPlaying(false); }}>
          {loaded && <source src={'/media/' + clip.id + '-v1.mp4'} type="video/mp4" />}
        </video>
        <button className="video-surface-toggle" onClick={toggle} aria-label={(playing ? 'Pause ' : 'Play ') + clip.title}>
          <span>{playing ? 'Pause video' : 'Play video'}</span>
        </button>
        {failed && <div className="video-error"><p>This clip couldn’t load.</p><a href={clip.source} target="_blank" rel="noreferrer">Watch the original <Arrow /></a></div>}
      </div>
    </div>
    <figcaption><span className="creator-status" aria-hidden="true" /><a href={clip.source} target="_blank" rel="noreferrer">{clip.handle}<span> · {clip.platform}</span><Arrow /></a></figcaption>
  </figure>;
}
