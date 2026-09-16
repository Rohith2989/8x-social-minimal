import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { CreatorWork } from '@/components/creator-work';
import { DayToDay } from '@/components/day-to-day';
import { DotReach } from '@/components/dot-reach';
import { NetworkComparison } from '@/components/network-comparison';
import { ReachAtlas } from '@/components/reach-atlas';
import { MapApproach } from '@/components/map-approach';
import { Arrow } from '@/components/icons';
import { links } from '@/lib/content';

export default function Home() {
  return <><Header /><MapApproach /><main id="main"><Hero /><CreatorWork /><DayToDay /><DotReach /><NetworkComparison /><ReachAtlas /></main>
    <div className="stone-continuation">
    <footer className="site-footer page-width"><a href={links.call}>Let’s build your network.<Arrow /></a><div><span>© {new Date().getFullYear()} 8x Social</span><a href={links.creators}>For creators<Arrow /></a><a href="https://www.8x.social/en/privacy">Privacy</a></div></footer>
    </div>
  </>;
}
