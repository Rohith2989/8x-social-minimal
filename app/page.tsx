import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { CreatorWork } from '@/components/creator-work';
import { DayToDay } from '@/components/day-to-day';
import { DotReach } from '@/components/dot-reach';
import { NetworkComparison } from '@/components/network-comparison';
import { ReachAtlas } from '@/components/reach-atlas';
import { MapApproach } from '@/components/map-approach';
import { FamilyFooter } from '@/components/family-footer';

export default function Home() {
  return <><Header /><MapApproach /><main id="main"><Hero /><CreatorWork /><DayToDay /><DotReach /><NetworkComparison /><ReachAtlas /></main>
    <FamilyFooter />
  </>;
}
