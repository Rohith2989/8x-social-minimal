import { Arrow } from './icons';
import { links } from '@/lib/content';

export function FamilyFooter() {
  return <div className="family-ending">
    <footer id="contact" className="family-footer page-width" aria-label="8x Social footer">
      <div className="family-contact"><a className="family-brand" href="#network" aria-label="8x Social back to top"><img src="/8x.svg" alt="" width="386" height="264" /><span>social</span></a><a className="family-call" href={links.call}>Build your network.<Arrow /></a></div>
      <div className="family-information">
        <p className="family-description">Creator networks for your brand.<br />From finding your people to keeping content moving.</p>
        <nav aria-label="Services"><h2>Services</h2><a href="https://www.8x.social/en/creator-network">Creator network</a><a href="https://www.8x.social/en/full-service">Managed service</a><a href="https://www.8x.social/en/tracking">DIY tracking</a></nav>
        <nav aria-label="Explore"><h2>Explore</h2><a href="#network">For brands</a><a href={links.creators}>For creators</a><a href="#day-to-day">How it works</a><a href="#reach-atlas">Our markets</a></nav>
        <nav aria-label="Company"><h2>Company</h2><a href="https://www.8x.social/en/blog">Blog</a><a href="https://www.linkedin.com/company/8xhq">LinkedIn</a><a href={links.call}>Contact</a></nav>
      </div>
      <div className="family-bottom"><span>© {new Date().getFullYear()} 8x Social</span><nav aria-label="Legal"><a href="https://www.8x.social/en/privacy">Privacy</a><a href="https://www.8x.social/en/terms">Terms</a></nav><a href="#network">Back to top ↑</a></div>
    </footer>
  </div>;
}
