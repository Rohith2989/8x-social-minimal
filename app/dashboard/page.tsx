import type { Metadata } from 'next';
import { DashboardWorkspace } from '@/components/dashboard/workspace';
import './dashboard.css';
import './buttons.css';
import './raster-controls.css';
import './creator-table.css';
import './filters.css';
import './transitions.css';
import './content-plan.css';
import './popups.css';
import './scrollbars.css';

export const metadata: Metadata = {
  title: '8x Social — Campaign workspace',
  description: 'An interactive design preview of the 8x Social brand workspace. All campaign data is illustrative.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardWorkspace />;
}
