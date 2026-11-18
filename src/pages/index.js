import React from 'react';
import Zine from '../components/portfolio/Zine';
import { candid } from '../components/portfolio/data';
import { SEO } from '../components/seo';
import { homeSchema } from '../components/schema';

// Prerendered at build time: the HTML ships the zine's cover with the intro state already applied (see loadIn.js),
// then React hydrates and the masthead slams in.
const IndexPage = () => <Zine />;

export default IndexPage;

export const Head = () => (
  <SEO
    fullTitle="Hunter Africk | Reno Web Developer & Designer"
    pathname="/"
    schema={homeSchema}
  >
    {/* The two faces the first screen needs, fetched in parallel with the CSS instead of after it. */}
    <link rel="preload" as="font" type="font/woff2" href="/fonts/Fraunces-var.woff2" crossOrigin="anonymous" />
    <link rel="preload" as="font" type="font/woff2" href="/fonts/BricolageGrotesque-var.woff2" crossOrigin="anonymous" />
    <link rel="preload" as="image" href={candid} type="image/webp" fetchpriority="high" />
  </SEO>
);
