import React, { useEffect, useState } from 'react';
import externalLink from '../images/externalLink.svg';
import githubIcon from '../images/githubIconBlack.svg';

const Projects = () => {

  const technologyArray = [
    { name: 'Javascript' },
    { name: 'HTML' },
    { name: 'Tailwind CSS' },
  ];

  return (
    <section id="projects" className="projects">
      <h1 className='projectsLabel'>Projects</h1>
      <section className='projectCardHolder'>
        <ProjectCard technologyArray={technologyArray} />
        <ProjectCard technologyArray={technologyArray} />
        <ProjectCard technologyArray={technologyArray} />
      </section>
    </section>
  );
};


export default Projects;

const ProjectCard = (props) => {

    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
      setWindowWidth(window.innerWidth);
  
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (
        <div className='projectCard'>
            {windowWidth < 768 ? (
                <>

                </>
            ) : (
                <>
                    <div className='projectImageHolder'><img className='projectImg' /></div>
                    <section className='projectDescriptionWrapper'>
                        <ProjectDescription projectName="Stock Z" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat." />
                        <section className='projectDescirptionBottomBar'>
                            <ProjectTechnologies technologies={props.technologyArray} />
                            <section className='cardButtonWrapper'>
                              <button className='cardLinkButton'><img className='cardLinkImg' src={githubIcon}/></button>
                              <button className='cardLinkButton'><img className='cardLinkImg' src={externalLink}/></button>
                            </section>
                        </section>
                    </section>
                </>
            )}
                
        </div>
    );
  };


const ProjectDescription = (props) => {
    return (
        <section className="projectDescriptionText">
            <h1 className='projectName'>{props.projectName}</h1>
            <p className='projectDesc'>{props.description}</p>
        </section>
    );
};


const ProjectTechnologies = ({ technologies }) => {
  return (
    <section className="projectTechnologies">
      {technologies?.map((tech, index) => (
        <div key={index} className="technology">
          <span className="technologyName">{tech.name}</span>
        </div>
      ))}
    </section>
  );
};

  

  
