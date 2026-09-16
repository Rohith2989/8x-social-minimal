import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { CreatorWork } from '@/components/creator-work';
import { DayToDay } from '@/components/day-to-day';
import './preview.css';

export default function DayToDayConcept() {
  return <><Header /><main id="main"><Hero /><CreatorWork /><DayToDay /></main></>;
}
