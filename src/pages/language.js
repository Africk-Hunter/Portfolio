import React from 'react';
import Language from '../components/language/Language';
import LocalOnly from '../components/language/LocalOnly';

// Localhost only: on the live site this redirects to the main page (see LocalOnly).
const LanguagePage = () => <LocalOnly><Language /></LocalOnly>;

export default LanguagePage;

// Windowsill (the first pass) relies on these fonts; the other iterations load their own via loadFonts.
export const Head = () => (
  <>
    <title>Design language</title>
    <meta name="robots" content="noindex" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=DM+Mono:wght@500&family=Figtree:wght@500;600;800&display=swap"
    />
  </>
);
