import { FamilyInfinity } from '@/components/family-infinity';
import { familyThemes, type FamilyTheme } from '@/lib/family-surface';

// Internal design review: the same component, with all product colours preserved.
export default function FamilyThemeReview() {
  return <main id="main">{(Object.keys(familyThemes) as FamilyTheme[]).map(theme=><FamilyInfinity key={theme} theme={theme} id={`family-${theme}`}/>)}</main>;
}
