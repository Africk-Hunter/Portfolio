import React from 'react';
import Zine from '../components/portfolio/Zine';
import { candid } from '../components/portfolio/data';
import { SEO } from '../components/seo';

// Prerendered at build time: the HTML ships the zine's cover with the intro state already applied (see loadIn.js),
// then React hydrates and the masthead slams in.
const IndexPage = () => <Zine />;

export default IndexPage;

export const Head = () => (
  <SEO>
    {/* The two faces the first screen needs, fetched in parallel with the CSS instead of after it. */}
    <link rel="preload" as="font" type="font/woff2" href="/fonts/Fraunces-var.woff2" crossOrigin="anonymous" />
    <link rel="preload" as="font" type="font/woff2" href="/fonts/BricolageGrotesque-var.woff2" crossOrigin="anonymous" />
    <link rel="preload" as="image" href={candid} type="image/webp" fetchPriority="high" />
    <meta name="theme-color" content="#F2EFDF" />
    {/* Without JS the intro never runs, so show the page. */}
    <noscript><style>{`.tz.tz-intro{overflow:auto!important}.tz.tz-intro .tz-nav,.tz.tz-intro .tz-page,.tz.tz-intro .tz-foot,.tz.tz-intro .tz-ic-bg,.tz.tz-intro .tz-cover>:not(.tz-mast){visibility:visible!important}.tz.tz-intro .tz-mast>span{opacity:1!important}`}</style></noscript>
  </SEO>
);
