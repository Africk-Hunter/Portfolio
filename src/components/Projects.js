import React, { useEffect, useState } from 'react';
import externalLink from '../images/externalLink.svg';
import githubIcon from '../images/githubIconBlack.svg';

const Projects = () => {
  return (
    <section id="projects" className="projects">
        <h1 className='projectsLabel'>Projects</h1>
        <section className='projectCardHolder'>
          <ProjectCard />
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
                        <ProjectDescription projectName="Stock Z" description="Test Desc" />
                        <section className='projectDescirptionBottomBar'>
                            <ProjectTechnologies technologies={['hi', 'hello']} />
                            <section className='cardButtonWrapper'>
                              <button className='cardLinkButton'><img className='cardLinkImg' src={githubIcon}/></button>
                              <button className='cardLinkButton'><img className='cardLinkImg' src={externalLink}/></button>
                            </section>
                        </section>
                        <ProjectTechnologies />
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
            <span className="technology-name">{tech.name}</span>
          </div>
        ))}
      </section>
    );
  };
  

  
