import React, { useEffect, useState } from 'react';
import externalLink from '../images/externalLink.svg';
import githubIcon from '../images/githubIconBlack.svg';
import { projects, defaultProjectIds } from '../data/projects';


const Projects = ({ ids = defaultProjectIds, variant = 'default' }) => {
  return (
    <section id="Websites" className={variant === 'large' ? 'projects projectsLarge' : 'projects'}>
      <h1 className='projectsLabel'>Websites</h1>
      <section className='projectCardHolder'>
        {ids.map((id) => (
          <ProjectCard key={id} projectInfo={projects[id]} />
        ))}
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
        <section className='mobileInnerProjectCard'>
          <section className='projectPictureAndDescriptionWrapper'>
            <section className='pictureAndLinksWrapper'>
              {props.projectInfo.projectLink ? (
                <a className='projectImageHolder' href={props.projectInfo.projectLink} target="_blank" rel="noopener noreferrer">
                  <img className='projectImg' src={props.projectInfo.projectImage} alt='Project Preview' />
                </a>
              ) : (
                <div className='projectImageHolder'>
                  <img className='projectImg' src={props.projectInfo.projectImage} alt='Project Preview' />
                </div>
              )}
              <ProjectCardButtonLinks projectLink={props.projectInfo.projectLink} githubLink={props.projectInfo.githubLink} />
            </section>
            <ProjectDescription projectName={props.projectInfo.projectTitle} description={props.projectInfo.projectDesc} link={props.projectInfo.projectLink} />
          </section>
          <ProjectTechnologies technologies={props.projectInfo.technologyArray} />
        </section>
      ) : (
        <>
          {props.projectInfo.projectLink ? (
            <a className='projectImageHolder' href={props.projectInfo.projectLink} target="_blank" rel="noopener noreferrer">
              <img className='projectImg' src={props.projectInfo.projectImage} alt='Project Preview' />
            </a>
          ) : (
            <div className='projectImageHolder'>
              <img className='projectImg' src={props.projectInfo.projectImage} alt='Project Preview' />
            </div>
          )}
          <section className='projectDescriptionWrapper'>
            <ProjectDescription projectName={props.projectInfo.projectTitle} description={props.projectInfo.projectDesc} link={props.projectInfo.projectLink} />
            <section className='projectDescirptionBottomBar'>
              <ProjectTechnologies technologies={props.projectInfo.technologyArray} />
              <ProjectCardButtonLinks projectLink={props.projectInfo.projectLink} githubLink={props.projectInfo.githubLink} />
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
      {props.link ? (
        <a className='projectName' href={props.link} target="_blank" rel="noopener noreferrer">{props.projectName}</a>
      ) : (
        <span className='projectName nonClickable'>{props.projectName}</span>
      )}
      <p className='projectDesc'>{props.description}</p>
    </section>
  );
};
const ProjectCardButtonLinks = (props) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className='cardButtonWrapper'>
      {windowWidth < 768 ? (
        <>
          <a className='cardLinkButton' href={props.githubLink} target="_blank" rel="noopener noreferrer">
            <img className='cardLinkImg' src={githubIcon} alt="GitHub Link" />
          </a>
          <a className='cardLinkButton' href={props.projectLink} target="_blank" rel="noopener noreferrer" style={{ visibility: props.projectLink ? 'visible' : 'hidden', pointerEvents: props.projectLink ? 'auto' : 'none' }}>
            <img className='cardLinkImg' src={externalLink} alt="External Link" />
          </a>
        </>
      ) : (
        <>
          <a className='cardLinkButton' href={props.projectLink} target="_blank" rel="noopener noreferrer" style={{ visibility: props.projectLink ? 'visible' : 'hidden', pointerEvents: props.projectLink ? 'auto' : 'none' }}>
            <img className='cardLinkImg' src={externalLink} alt="External Link" />
          </a>
          <a className='cardLinkButton' href={props.githubLink} target="_blank" rel="noopener noreferrer">
            <img className='cardLinkImg' src={githubIcon} alt="GitHub Link" />
          </a>
        </>
      )}
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




