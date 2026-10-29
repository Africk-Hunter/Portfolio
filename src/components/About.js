import React, { useEffect, useState } from 'react';
import linkedinIcon from '../images/linkedinIcon.svg';
import githubIcon from '../images/githubIcon.svg';
import spotifyIcon from '../images/greenSpotify.svg';
import arrow from '../images/arrow.svg';
import aboutPicture from '../images/NewPic.png';
import scrollTo from 'gatsby-plugin-smoothscroll';


const About = ({ showSpotify = true, bio }) => {
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
          <MobileAbout showSpotify={showSpotify} />
          <AboutText bio={bio} />
        </>
      ) : (
        <DesktopAbout showSpotify={showSpotify} bio={bio} />
      )}
    </section>
  );
};

const DesktopAbout = ({ showSpotify, bio }) => {
  return (
    <>
      <div className='aboutWrapper'>
        <div className="aboutLeft">
          <AboutText bio={bio} />
        </div>
        <div className="aboutRight">
          <div className="pictureContainer"><img className="aboutPicture" src={aboutPicture} alt='Myself' /></div>
        </div>
      </div>
      <AboutButtons showSpotify={showSpotify} />
    </>
  );
};

const MobileAbout = ({ showSpotify }) => {
  return (
    <div className="buttonsAndPicture">
      <AboutButtons showSpotify={showSpotify} />
      <div className="pictureContainer"><img className="aboutPicture" src={aboutPicture} alt='Myself' /></div>
    </div>
  );
};

const AboutButtons = ({ showSpotify }) => {
  return (
    <div className="aboutButtons">
      <a className="aboutButtonSquare" href='https://github.com/Africk-Hunter' target="_blank" rel="noopener noreferrer">
        <img src={githubIcon} alt="GitHub" className='buttonPicture' />
      </a>
      <a className="aboutButtonSquare" href='https://www.linkedin.com/in/hunter-africk-3a6485209/' target="_blank" rel="noopener noreferrer">
        <img src={linkedinIcon} alt="LinkedIn" className='buttonPicture' />
      </a>
      {showSpotify && (
        <a className="aboutButtonSquare" href='https://open.spotify.com/artist/5u2QScv7e1WEwV17Oy2vpb?si=qoekf4dAQe6_hVAVKaWreQ' target="_blank" rel="noopener noreferrer">
          <img src={spotifyIcon} alt="LinkedIn" className='buttonPicture' />
        </a>
      )}
      <button className="aboutContactButton" onClick={() => scrollTo('#Contact')}>
        <span className="contactText">Contact Me</span>
        <img className='contactArrowImg' src={arrow} alt='' />
      </button>
    </div>
  );
};

const AboutText = ({ bio }) => {
  return (
    <div className='aboutTextWrapper'>
      <h1 className="introText">Hi, <br />I'm Hunter</h1>
      <p className="aboutMeText">
        {bio ?? (
          <>
            I’m a creative based in Reno, NV making cool shit. I enjoy making music, writing stories, building websites, drawing, and otherwise putting myself in a position to grow.<br /><br />
            I have a bachelors degree in Computer Science & Engineering from UNR. When I’m not creating, I enjoy listening to music, reading books, relaxing at the park, and hanging out with my girlfriend :)
          </>
        )}
      </p>
    </div>
  );
};


export default About;
