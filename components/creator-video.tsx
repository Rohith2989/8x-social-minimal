'use client';
import { useEffect, useRef, useState } from 'react';
import { clips } from '@/lib/content';
import { Arrow, PlayIcon, SoundIcon } from './icons';

type Props = { index: number; active: boolean; inView: boolean; reduced: boolean; onSelect: (index: number) => void; onAttention: (sound: boolean) => void };
export function CreatorVideo({ index, active, inView, reduced, onSelect, onAttention }: Props) {
  const clip = clips[index];
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync(); document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  useEffect(() => {
    const player = video.current;
    const eligible = active && inView && visible;
    if (!eligible) {
      player?.pause();
      if (player) player.muted = true;
      setMuted(true); setManualPlay(false);
      return;
    }
    if (userPaused || (reduced && !manualPlay)) { player?.pause(); return; }
    if (!loaded) { setLoaded(true); return; }
    const attempt = player?.play();
    attempt?.catch(error => { if (error.name !== 'AbortError') setPlaying(false); });
  }, [active, inView, visible, reduced, manualPlay, userPaused, loaded]);

  const toggle = () => {
    onSelect(index); onAttention(!muted);
    if (playing) { setUserPaused(true); video.current?.pause(); }
    else {
      setUserPaused(false); setManualPlay(true); setFailed(false);
      if (!loaded) setLoaded(true);
      else { if (video.current?.error) video.current.load(); void video.current?.play().catch(() => setPlaying(false)); }
    }
  };
  const sound = () => {
    onSelect(index);
    const nextMuted = !muted;
    if (video.current) video.current.muted = nextMuted;
    setMuted(nextMuted); onAttention(!nextMuted);
  };

  return <figure className="creator-card" data-active={active} data-clip={clip.id}>
    <div className="video-frame">
      <video ref={video} width="480" height="854" poster={'/media/' + clip.id + '-v1.jpg'} preload="none" muted playsInline loop
        aria-label={'Creator video: ' + clip.title}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onTimeUpdate={() => { const v = video.current; if (v?.duration) setProgress(v.currentTime / v.duration * 100); }}
        onVolumeChange={() => { if (video.current) setMuted(video.current.muted); }}
        onError={() => { setFailed(true); setPlaying(false); }}>
        {loaded && <source src={'/media/' + clip.id + '-v1.mp4'} type="video/mp4" />}
      </video>
      {!active && <button className="poster-select" onClick={() => { onSelect(index); setUserPaused(false); setManualPlay(true); }} aria-label={'Watch ' + clip.title}><span><PlayIcon /></span></button>}
      {active && <div className="video-controls">
        <button onClick={toggle} aria-label={(playing ? 'Pause ' : 'Play ') + clip.title}><PlayIcon playing={playing} /></button>
        <input type="range" min="0" max="100" step=".1" value={progress} aria-label={'Seek ' + clip.title} style={{ '--played': progress + '%' } as React.CSSProperties}
          onPointerDown={() => onAttention(!muted)}
          onChange={e => { const v = video.current; if (v?.duration) { v.currentTime = Number(e.target.value) / 100 * v.duration; setProgress(Number(e.target.value)); onAttention(!muted); } }} />
        <button onClick={sound} disabled={!loaded} aria-label={(muted ? 'Unmute ' : 'Mute ') + clip.title}><SoundIcon muted={muted} /></button>
        <a href={clip.source} target="_blank" rel="noreferrer" aria-label={'Open original ' + clip.title}><Arrow /></a>
      </div>}
      {failed && <div className="video-error"><p>This clip couldn’t load.</p><a href={clip.source} target="_blank" rel="noreferrer">Watch the original <Arrow /></a></div>}
      <span className="video-active-line" aria-hidden="true" />
    </div>
    <figcaption><a href={clip.source} target="_blank" rel="noreferrer">{clip.handle}{clip.platform && <span> · {clip.platform}</span>}<Arrow /></a></figcaption>
  </figure>;
}
