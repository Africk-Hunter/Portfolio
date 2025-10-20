import React, { useEffect, useState } from 'react';
import linkedinIcon from '../images/linkedinIconBlack.svg';
import githubIcon from '../images/githubIconBlack.svg';
import spotifyIcon from '../images/spotifyBlack.svg';

const Footer = () => {

  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  return (
    <section id="Footer" className="footer">
      <h1 className="nameTextFooter">Hunter Africk</h1>
      <section className="navButtonsWrapperFooter">
        <NavBarItemFooter linkName="Home" offset={navbarHeight} />
        <NavBarItemFooter linkName="Music" offset={navbarHeight} />
        <NavBarItemFooter linkName="Websites" offset={navbarHeight} />
        <NavBarItemFooter linkName="Contact" offset={navbarHeight} />
      </section>
      <section>
        <div className="aboutButtonsFooter">
          <a className="aboutButtonSquareFooter" href='https://github.com/Africk-Hunter' target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="GitHub" className='buttonPicture' />
          </a>
          <a className="aboutButtonSquareFooter" href='https://www.linkedin.com/in/hunter-africk-3a6485209/' target="_blank" rel="noopener noreferrer">
            <img src={linkedinIcon} alt="LinkedIn" className='buttonPicture' />
          </a>
          <a className="aboutButtonSquare" href='https://open.spotify.com/artist/05U3xSvJfM2puhp2Uk7AZG?si=cSqDi4u4R36B5qK-LBw6WA' target="_blank" rel="noopener noreferrer">
            <img src={spotifyIcon} alt="LinkedIn" className='buttonPicture' />
          </a>
        </div>
      </section>
    </section>
  );
};

const NavBarItemFooter = ({ linkName, offset }) => {
  const scrollToSection = (id) => {
    const section = document.querySelector(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - offset,
        behavior: 'smooth',
      });
    }
  };

  let scrollToName = '#' + linkName;
  if (linkName === 'Home') {
    scrollToName = '#main'
  }

  return (
    <nav className="navbarLinkFooter">
      <button className="navBarLinkButton" onClick={() => scrollToSection(scrollToName)}>
        <h2 className="linkNameFooter">{linkName}</h2>
      </button>
    </nav>
  );
};

export default Footer;
