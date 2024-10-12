import React from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import '../styles/index.scss';
/* import scrollTo from 'gatsby-plugin-smoothscroll'; */


const IndexPage = () => {
  return (
    <>
      <main>
{/*         <Navbar /> */}
        <About />
        <Projects />
        <Contact />
{/*         <Footer /> */}
      </main>
    </>
  );
};

export default IndexPage;