import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './day-to-day.css';
import './dot-reach.css';
import './network-comparison.css';
import './reach-atlas.css';
import './family-footer.css';
import './hero-responsive.css';
import './hero-raster-edge.css';

const inter = localFont({ src: '../public/fonts/inter-latin-variable.woff2', weight: '100 900', variable: '--font-brand', display: 'swap' });
export const metadata: Metadata = {
  title: '8x Social — Your brand. A world of voices.',
  description: 'We build and manage creator networks for your brand. Real creators, original content, one dedicated team.',
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#111111', colorScheme: 'dark' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable}><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
