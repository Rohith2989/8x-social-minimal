import { Arrow } from './icons';
import { links } from '@/lib/content';
import { HeroSun } from './hero-sun';

export function Hero() {
  return <section className="hero" id="network" aria-labelledby="hero-title">
    <div className="hero-reading page-width">
      <h1 id="hero-title"><span>Your brand.</span><span>A world</span><span>of voices.</span></h1>
      <div className="hero-offer">
        <p>We build and manage<br className="desktop-break" /> creator networks<br className="desktop-break" /> for your brand.</p>
        <a className="hero-cta" href={links.build}><span>Build your network</span><span className="arrow-disc"><Arrow /></span></a>
      </div>
    </div>
    <div className="hero-portrait" aria-label="A world of individual voices">
      <HeroSun />
      <picture>
        <source media="(max-width: 720px)" srcSet="/media/portraits-small-v2.webp" />
        <img src="/media/portraits-v2.webp" alt="Five people, each with their own perspective, in a single black-and-white portrait." width="1817" height="866" fetchPriority="high" decoding="async" />
      </picture>
    </div>
  </section>;
}
