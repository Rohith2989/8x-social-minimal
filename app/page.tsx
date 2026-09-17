import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { CreatorWork } from '@/components/creator-work';
import { VideoSurface } from '@/components/video-surface';
import { NetworkComparison } from '@/components/network-comparison';
import { PartnerFeedback } from '@/components/partner-feedback';
import { ServiceChoices } from '@/components/service-choices';
import { ReachAtlas } from '@/components/reach-atlas';
import { MapApproach } from '@/components/map-approach';
import { FamilyFooter } from '@/components/family-footer';
import { HeroRasterEdge } from '@/components/hero-raster-edge';
import { ScrollThread } from '@/components/scroll-thread';

export default function Home() {
  return <><Header /><HeroRasterEdge /><MapApproach /><main id="main"><Hero /><CreatorWork /><VideoSurface /><NetworkComparison /><PartnerFeedback /><ServiceChoices /><ReachAtlas /></main>
    <FamilyFooter /><ScrollThread />
  </>;
}
