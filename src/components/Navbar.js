import React from 'react';

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
    return (
      <nav className="navbarLink">
        <div><h2 className='linkName'>{props.linkName}</h2></div>
      </nav>
    );
  };
export default Projects;
