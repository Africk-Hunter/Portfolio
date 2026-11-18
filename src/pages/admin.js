import React from 'react';
import ZineShell from '../components/portfolio/ZineShell';
import AdminPanel from '../components/portfolio/AdminPanel';
import { SEO } from '../components/seo';
import '../styles/portfolio/intake.scss';
import '../styles/portfolio/admin.scss';

export default function AdminPage() {
  return (
    <ZineShell prerender>
      <section className="tz-page tz-sub tz-intake"><AdminPanel /></section>
    </ZineShell>
  );
}

// Private: kept out of search results and the sitemap. The data behind it needs the admin password anyway.
export const Head = () => <SEO title="Admin" noindex />;
