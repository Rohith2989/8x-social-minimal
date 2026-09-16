export function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" /></svg>;
}
export function PlayIcon({ playing = false }: { playing?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{playing ? <path fill="currentColor" d="M6 4h4v16H6zm8 0h4v16h-4z" /> : <path fill="currentColor" d="m7 3 14 9-14 9z" />}</svg>;
}
export function SoundIcon({ muted }: { muted: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3Z" />{muted ? <path d="m16 9 6 6m0-6-6 6" /> : <><path d="M16 8a6 6 0 0 1 0 8M19 4a11 11 0 0 1 0 16" /></>}</svg>;
}
