import React, { useEffect, useState } from 'react';
import linkedinIcon from '../images/linkedinIcon.svg';
import githubIcon from '../images/githubIcon.svg';
import arrow from '../images/arrow.svg';
import aboutPicture from '../images/aboutPicture.jpg';
import scrollTo from 'gatsby-plugin-smoothscroll';


const About = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="Home" className="about">
      {windowWidth < 768 ? (
        <>
          <MobileAbout />
          <AboutText />
        </>
      ) : (
        <DesktopAbout />
      )}
    </section>
  );
};

const DesktopAbout = () => {
  return (
    <>
      <div className='aboutWrapper'>
        <div className="aboutLeft">
          <AboutText />
        </div>
        <div className="aboutRight">
          <div className="pictureContainer"><img className="aboutPicture" src={aboutPicture} alt='Myself' /></div>
        </div>
      </div>
      <AboutButtons />
    </>
  );
};

const MobileAbout = () => {
  return (
    <div className="buttonsAndPicture">
      <AboutButtons />
      <div className="pictureContainer"><img className="aboutPicture" src={aboutPicture} alt='Myself' /></div>
    </div>
  );
};

const AboutButtons = () => {
  return (
    <div className="aboutButtons">
      <a className="aboutButtonSquare" href='https://github.com/Africk-Hunter' target="_blank" rel="noopener noreferrer">
        <img src={githubIcon} alt="GitHub" className='buttonPicture' />
      </a>
      <a className="aboutButtonSquare" href='https://www.linkedin.com/in/hunter-africk-3a6485209/' target="_blank" rel="noopener noreferrer">
        <img src={linkedinIcon} alt="LinkedIn" className='buttonPicture' />
      </a>
      <button className="aboutContactButton" onClick={() => scrollTo('#Contact')}>
        <span className="contactText">Contact Me</span>
        <img className='contactArrowImg' src={arrow} alt='' />
      </button>
    </div>
  );
};

const AboutText = () => {
  return (
    <div className='aboutTextWrapper'>
      <h1 className="introText">Hi, <br />I'm Hunter</h1>
      <p className="aboutMeText">
        I am a software developer based in Reno, NV. I enjoy designing and building engaging web experiences with a focus on intuitive design. <br /><br />
        When I’m not coding, you'll find me either drawing, hitting the gym, listening to music, or relaxing at the park.
      </p>
    </div>
  );
};


export default About;
