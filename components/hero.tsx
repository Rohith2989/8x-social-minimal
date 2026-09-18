import { Arrow } from './icons';
import { links } from '@/lib/content';
import { HeroPhotoJourney } from './hero-photo-journey';

export function Hero() {
  return <section className="hero hero-original" id="network" aria-labelledby="hero-title">
    <div className="hero-reading page-width">
      <h1 id="hero-title"><span>Creator networks.</span><span>Built for your brand<span className="hero-period">.</span></span></h1>
      <div className="hero-offer">
        <p>We find the creators, manage the content, and grow your organic reach.</p>
        <a className="hero-cta" href={links.build}>Build your network<Arrow /></a>
        <a className="hero-secondary" href="#work">See how it works <span aria-hidden="true">→</span></a>
      </div>
    </div>
    <HeroPhotoJourney />
  </section>;
}
