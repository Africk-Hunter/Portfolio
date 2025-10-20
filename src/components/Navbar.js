import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  return (
    <nav id="navbar" className="navbar">
      <h1 className="nameText">Hunter Africk</h1>
      <section className="navButtonsWrapper">
        <NavBarItems linkName="Home" offset={navbarHeight} />
        <NavBarItems linkName="Music" offset={navbarHeight} />
        <NavBarItems linkName="Websites" offset={navbarHeight} />
        <NavBarItems linkName="Contact" offset={navbarHeight} />
      </section>
    </nav>
  );
};

const NavBarItems = ({ linkName, offset }) => {
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
  if(linkName === 'Home'){
    scrollToName = '#main'
  }

  return (
    <nav className="navbarLink">
      <button className="navBarLinkButton" onClick={() => scrollToSection(scrollToName)}>
        <h2 className="linkName">{linkName}</h2>
      </button>
    </nav>
  );
};

export default Navbar;
