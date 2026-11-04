import React from 'react';
import Board from '../components/mockup/concepts/Board';
import { SEO } from '../components/seo';
import '../styles/mockup/Mockup.scss';

// Redesign mockup, round 5: Playroom + Collage in one. A scrolling paper
// board where every section is open on the page.
const MockupPage = () => (
  <div className="mk">
    <Board />
  </div>
);

export default MockupPage;

export const Head = () => (
  <SEO title="Mockup | Hunter Africk" pathname="/mockup">
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300..600&family=Saira:ital,wdth,wght@0,75..125,300..900;1,75..125,300..900&display=swap"
    />
  </SEO>
);
