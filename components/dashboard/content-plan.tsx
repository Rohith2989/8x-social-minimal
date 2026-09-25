'use client';

import type { ReactNode } from 'react';
import { demoPosts, type DemoPost } from '@/lib/dashboard-demo';
import { CurrentButton } from './current-button';
import { RasterButton } from './raster-button';
import { Icon, PlatformMark } from './ui';

const directions = [
  { title: 'The everyday edit', category: 'Routine', status: 'Active', reference: 4, hook: 'One small change to my everyday.', description: 'Make the product part of a moment your audience already knows.', beats: ['Open on your real routine', 'Introduce one useful benefit', 'Close with your honest take'] },
  { title: 'Show, don’t tell', category: 'Demonstration', status: 'Active', reference: 5, hook: 'Here’s what it actually looks like.', description: 'Let the experience do the talking. Keep the camera close to the detail.', beats: ['Start with the result', 'Show how you got there', 'Share what surprised you'] },
  { title: 'A fresh perspective', category: 'Personal story', status: 'Active', reference: 6, hook: 'I used to do this differently.', description: 'A familiar problem, a different approach. Tell it in your own words.', beats: ['Name a relatable frustration', 'Show your new approach', 'Leave one useful takeaway'] },
  { title: 'The follow-up', category: 'After the first try', status: 'Upcoming', reference: 7, hook: 'A week later, here’s my take.', description: 'Return to the experience with an honest, considered update.', beats: ['Revisit your first impression', 'Show what stayed in your routine', 'Answer one audience question'] },
  { title: 'Your questions, answered', category: 'Community', status: 'Upcoming', reference: 8, hook: 'You asked about this detail.', description: 'Build the next story around a real question from your audience.', beats: ['Introduce the question', 'Demonstrate the answer', 'Invite the next conversation'] },
  { title: 'First impressions', category: 'Discovery', status: 'Past', reference: 9, hook: 'Let’s try this together.', description: 'An unfiltered first encounter, from opening to first use.', beats: ['Show the first encounter', 'Try one feature on camera', 'Give your first impression'] },
];

export function ContentPlan({ campaign, filter, filterControl, flagged, onFlag, onPlay, onBrief }: {
  campaign: string; filter: string; filterControl: ReactNode; flagged: string[];
  onFlag: (title: string) => void; onPlay: (post: DemoPost) => void; onBrief: () => void;
}) {
  const visible = directions.filter(direction => filter === 'Flagged' ? flagged.includes(direction.title) : direction.status === filter);
  return <section className="ds-creative-plan" aria-label="Campaign creative plan">
    <div className="ds-brief-banner">
      <div className="ds-brief-story"><span className="ds-brief-kicker"><span className="ds-brief-mark" aria-hidden="true" /> {campaign} / Creative brief</span>
        <h2>One direction.<br />Your own point of view.</h2>
        <p>Real moments, told by real people. Show how Meridian fits into everyday life, with the freedom to make it yours.</p>
      </div>
      <div className="ds-brief-delivery"><span className="ds-brief-small">THE CANVAS</span><div className="ds-brief-specs"><div><strong>9:16</strong><span>Vertical format</span></div><div><strong>15–45<span>s</span></strong><span>Room for a story</span></div></div>
        <div className="ds-brief-platforms"><PlatformMark name="TikTok" /><PlatformMark name="Instagram" /><span>Made for the feed. Told in your voice.</span></div>
        <CurrentButton variant="secondary" icon="outward" onClick={onBrief}>Read the full brief</CurrentButton>
      </div>
    </div>
    <header className="ds-directions-header"><div><h2>Creative directions <span>{String(visible.length).padStart(2, '0')}</span></h2><p>A starting point for the story. Not a script.</p></div>{filterControl}</header>
    <div className="ds-direction-grid">{visible.map(direction => {
      const index = directions.indexOf(direction), isFlagged = flagged.includes(direction.title);
      return <article className="ds-direction-card" key={direction.title}>
        <header><span><b>{String(index + 1).padStart(2, '0')}</b> {direction.category}</span><span className="ds-direction-stage">{direction.status}</span></header>
        <div className="ds-direction-lead">
          <div className="ds-direction-portrait"><img src={demoPosts[direction.reference].poster} alt={`Video reference for ${direction.title}`} loading="lazy" width="126" height="224" /><RasterButton className="ds-direction-play" aria-label={`Play reference for ${direction.title}`} onClick={() => onPlay(demoPosts[direction.reference])}><Icon name="play" size={16} /><span>Reference</span></RasterButton></div>
          <div className="ds-direction-intro"><span className="ds-brief-small">THE IDEA</span><h3>{direction.title}</h3><p>{direction.description}</p><div className="ds-direction-platforms"><PlatformMark name="TikTok" /><PlatformMark name="Instagram" /><span>15–45 sec</span></div></div>
        </div>
        <div className="ds-direction-hook"><span className="ds-brief-small">A POSSIBLE OPENING</span><p>“{direction.hook}”</p></div>
        <ol className="ds-direction-beats" aria-label="Story beats">{direction.beats.map((beat, i) => <li key={beat}><span>{String(i + 1).padStart(2, '0')}</span>{beat}</li>)}</ol>
        <footer><span>{direction.status === 'Upcoming' ? '01–15 Oct' : direction.status === 'Past' ? '01–31 Aug' : '01–30 Sep'} <span>2026</span></span><RasterButton className="ds-direction-flag" aria-pressed={isFlagged} aria-label={`${isFlagged ? 'Unflag' : 'Flag'} ${direction.title}`} onClick={() => onFlag(direction.title)}><Icon name={isFlagged ? 'check' : 'flag'} size={15} />{isFlagged ? 'Flagged' : 'Flag for review'}</RasterButton></footer>
      </article>;
    })}</div>
    {!visible.length && <div className="ds-directions-empty"><Icon name="check" size={24} /><h3>All clear.</h3><p>No directions flagged for review. Use the filter to return to your active brief.</p></div>}
    <section className="ds-creative-standards" aria-label="Campaign guidelines"><div className="ds-standards-title"><span className="ds-standards-mark" aria-hidden="true" /><h3>The essentials.</h3><p>Consistent standards.<br />Individual expression.</p></div>{[
      ['01', 'Keep it original', 'Your footage. Your words. A genuine experience, not a scripted claim.'],
      ['02', 'Make it clear', 'Readable captions, clean audio and the product visible in context.'],
      ['03', 'Be transparent', 'Include the required sponsorship disclosure in every post.'],
    ].map(([number, title, copy]) => <div className="ds-standard" key={number}><span>{number}</span><h4>{title}</h4><p>{copy}</p></div>)}</section>
  </section>;
}
