import React from 'react';
import scrollTo from 'gatsby-plugin-smoothscroll';

const Projects = () => {
  return (
    <nav id="navbar" className="navbar">
        <h1 className='nameText'>Hunter Africk</h1>
        <section className='navButtonsWrapper'>
            <NavBarItems linkName='Home'/>
            <NavBarItems linkName='Projects'/>
            <NavBarItems linkName='Contact Me'/>
        </section>
    </nav>
  );
};

const NavBarItems = (props) => {

  let scrollToName = '#' + props.linkName

    return (
      <nav className="navbarLink">
        <button className='navBarLinkButton' onClick={() => scrollTo(scrollToName)}><h2 className='linkName'>{props.linkName}</h2></button>
      </nav>
    );
  };
export default Projects;
