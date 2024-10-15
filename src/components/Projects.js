import React, { useEffect, useState } from 'react';
import externalLink from '../images/externalLink.svg';
import githubIcon from '../images/githubIconBlack.svg';
import stockZImage from '../images/stockZ.png';
import ghostwryteImage from '../images/ghostwryte.png';
import portfolioImage from '../images/portfolio.png';
import twentyOnImage from '../images/20on20off.png';


const Projects = () => {

  const projectInformationStockZ = {
    projectTitle: 'Stock Z',
    projectDesc: 'Stock Z is a web application designed to assist users in identifying optimal purchasing price ranges for stocks. Leveraging historical data, StockZ provides valuable insights to aid users in making informed decisions.',
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
    projectDesc: 'Ghostwryte.ai is an AI assistant designed for knowledge-based content creators on platforms such as LinkedIn. Ghostwryte helps users craft authentic content that reflects their unique voices through a minimalist, intuitive interface. Ghostwryte leverages machine learning to accurately mimic a user\'s writing style when generating content.',
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
    projectDesc: 'This portfolio website you are on now.',
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
    projectDesc: '20ON20OFF is a timer program designed to help users follow the 20-20-20 rule: for every 20 minutes spent looking at a screen, take a 20-second break and look at something 20 feet away. This app assists in reducing eye strain and promoting better eye health during prolonged screen use.',
    projectLink: 'https://two0on20off.onrender.com/',
    githubLink: 'https://github.com/Africk-Hunter/20ON20OFF',
    projectImage: twentyOnImage,
    technologyArray: [
      { name: 'React.JS' },
      { name: 'CSS' },
    ]
  };
  
  

  return (
    <section id="Projects" className="projects">
      <h1 className='projectsLabel'>Projects</h1>
      <section className='projectCardHolder'>
        <ProjectCard projectInfo={projectInformationStockZ} />
        <ProjectCard projectInfo={projectInformationGhostwryte}/>
        <ProjectCard projectInfo={projectInformationPortfolio} />
        <ProjectCard projectInfo={projectInformation20On}/>
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
                      <div className='projectImageHolder'><img className='projectImg' src={props.projectInfo.projectImage}/></div>
                      <ProjectCardButtonLinks projectLink={props.projectInfo.projectLink} githubLink={props.projectInfo.githubLink} />
                    </section>
                    <ProjectDescription projectName={props.projectInfo.projectTitle} description={props.projectInfo.projectDesc} />
                  </section>
                  <ProjectTechnologies technologies={props.projectInfo.technologyArray} />
                </section>
            ) : (
                <>
                    <div className='projectImageHolder'><img className='projectImg' src={props.projectInfo.projectImage}/></div>
                    <section className='projectDescriptionWrapper'>
                        <ProjectDescription projectName={props.projectInfo.projectTitle} description={props.projectInfo.projectDesc} />
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
            <h1 className='projectName'>{props.projectName}</h1>
            <p className='projectDesc'>{props.description}</p>
        </section>
    );
};
const ProjectCardButtonLinks = (props) => {
  return (
    <section className='cardButtonWrapper'>
      <a
        className='cardLinkButton'
        href={props.githubLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className='cardLinkImg' src={githubIcon} alt="GitHub Link" />
      </a>
      <a
        className='cardLinkButton'
        href={props.projectLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ visibility: props.projectLink === '' ? 'hidden' : 'visible' }}
      >
        <img className='cardLinkImg' src={externalLink} alt="External Link" />
      </a>

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

  

  
