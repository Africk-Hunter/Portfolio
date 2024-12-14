import React, { useEffect, useState } from 'react';
import externalLink from '../images/externalLink.svg';
import githubIcon from '../images/githubIconBlack.svg';
import stockZImage from '../images/stockZ.png';
import ghostwryteImage from '../images/ghostwryte.png';
import portfolioImage from '../images/portfolio.png';
import twentyOnImage from '../images/20on20off.png';
import llabcImage from '../images/lunalashlogo.svg';


const Projects = () => {

  const projectInformationStockZ = {
    projectTitle: 'Stock Z',
    projectDesc: 'A web app that helps users identify optimal stock purchasing price ranges using historical data to provide insights for informed decision-making.',
    projectLink: 'https://www.Stock-Z.com',
    githubLink: 'https://github.com/Africk-Hunter/StockZ',
    projectImage: stockZImage,
    technologyArray: [
      { name: 'Javascript' },
      { name: 'HTML' },
      { name: 'Tailwind CSS' },
      { name: 'Firebase' }
    ]
  };

  const projectInformationGhostwryte = {
    projectTitle: 'Ghostwryte.ai',
    projectDesc: 'An AI copilot for knowledge-based content creators, designed to help users craft authentic, personalized content with a minimalist, intuitive interface.',
    projectLink: 'https://ghostwryte-ai-c7cf4cf60c87.herokuapp.com/',
    githubLink: 'https://github.com/CS425Team46/Ghostwryrte.ai',
    projectImage: ghostwryteImage,
    technologyArray: [
      { name: 'Javascript' },
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'Firebase' }
    ]
  };

  const projectInformationPortfolio = {
    projectTitle: 'Portfolio Website',
    projectDesc: 'The website you’re viewing now, built with React, Sass, and Gatsby.',
    projectLink: '',
    githubLink: 'https://github.com/Africk-Hunter/Portfolio',
    projectImage: portfolioImage,
    technologyArray: [
      { name: 'React.JS' },
      { name: 'Sass' },
      { name: 'Gatsby' },
    ]
  };

  const projectInformation20On = {
    projectTitle: '20ON20OFF',
    projectDesc: 'A timer app that supports the 20-20-20 rule to reduce eye strain by encouraging breaks during extended screen use.',
    projectLink: 'https://two0on20off.onrender.com/',
    githubLink: 'https://github.com/Africk-Hunter/20ON20OFF',
    projectImage: twentyOnImage,
    technologyArray: [
      { name: 'React.JS' },
      { name: 'CSS' },
    ]
  };
  const llabc = {
    projectTitle: 'Luna Lash & Beauty Co',
    projectDesc: 'Website for Luna Lash & Beauty Co., designed to highlight services and connect with clients effortlessly.',
    projectLink: 'https://llabc.netlify.app/',
    githubLink: 'https://github.com/Africk-Hunter/luna-lash-beauty-site',
    projectImage: llabcImage,
    technologyArray: [
      { name: 'React.JS' },
      { name: 'Sass' },
      { name: 'Gatsby' },
      { name: 'Typescript' },
    ]
  };



  return (
    <section id="Projects" className="projects">
      <h1 className='projectsLabel'>Projects</h1>
      <section className='projectCardHolder'>
        <ProjectCard projectInfo={llabc} />
        <ProjectCard projectInfo={projectInformationGhostwryte} />
        <ProjectCard projectInfo={projectInformationStockZ} />
        <ProjectCard projectInfo={projectInformationPortfolio} />
        <ProjectCard projectInfo={projectInformation20On} />
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




