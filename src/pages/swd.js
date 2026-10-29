import React from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import SiteShowcase from '../components/SiteShowcase';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { SEO } from '../components/seo';
import '../styles/index.scss';

const navLinks = ['Home', 'Websites', 'Contact'];

// Edit this list (and its order) to tailor the page for a specific audience.
const projectIds = ['intraconnected', 'whoseDebut', 'biggestLittleMedia', 'llabc', 'stockZ'];

const bio = (
  <>
    I’m a software developer based in Reno, NV. I enjoy finding new ways to make the websites I build more interactive and personalized through creative design.<br /><br />
    I have a bachelors degree in Computer Science & Engineering from UNR. When I’m not programming, I enjoy making music, writing, relaxing at the park, and hanging out with my girlfriend :)
  </>
);

const SwdPage = () => {
  return (
    <>
      <main id="main">
        <Navbar links={navLinks} />
        <About showSpotify={false} bio={bio} />
        <SiteShowcase ids={projectIds} />
        <Contact />
      </main>
      <Footer links={navLinks} showSpotify={false} />
    </>
  );
};

export default SwdPage;

export const Head = () => (
  <SEO
    title="Hunter Africk | Software Developer"
    description="Software development portfolio of Hunter Africk: full-stack web apps built with React, TypeScript, and Firebase."
    pathname="/swd"
  >
    <meta name="robots" content="noindex, nofollow" />
  </SEO>
);
