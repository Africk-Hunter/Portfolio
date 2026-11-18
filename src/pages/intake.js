import React from 'react';
import ZineShell from '../components/portfolio/ZineShell';
import IntakeForm from '../components/portfolio/IntakeForm';
import { SEO } from '../components/seo';
import '../styles/portfolio/intake.scss';

export default function IntakePage() {
  return (
    <ZineShell prerender sections={[['contact', 'Contact']]} contactId="contact">
      <section className="tz-page tz-sub tz-intake"><IntakeForm /></section>
    </ZineShell>
  );
}

// A private link for clients, so it stays out of search results (and out of the sitemap).
export const Head = () => <SEO title="A few questions" noindex />;
