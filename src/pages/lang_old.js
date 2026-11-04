import React from 'react';
import LanguagePage from '../components/lang_old/Language';
import { SEO } from '../components/seo';
import '../styles/lang_old/Language.scss';

// Homeroom: the design language for the portfolio redesign, built as a spec
// sheet whose parts can be copied straight into Figma.
const Language = () => <LanguagePage />;

export default Language;

export const Head = () => (
  <SEO title="Homeroom | Hunter Africk" pathname="/lang_old">
    <meta name="robots" content="noindex, nofollow" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300..600&family=Saira:ital,wdth,wght@0,75..125,300..900;1,75..125,300..900&display=swap"
    />
  </SEO>
);
