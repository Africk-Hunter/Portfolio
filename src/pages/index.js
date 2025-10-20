import React from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Music from '../components/music';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { SEO } from "../components/seo"
import '../styles/index.scss';


const IndexPage = () => {
  return (
    <>
      <main id="main">
        <Navbar />
        <About />
        <Music />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default IndexPage;

export const Head = () => (
  <SEO />
)