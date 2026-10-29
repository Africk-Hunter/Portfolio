import stockZImage from '../images/stockZ.png';
import ghostwryteImage from '../images/ghostwryte.png';
import portfolioImage from '../images/portfolio.png';
import twentyOnImage from '../images/20on20off.png';
import llabcImage from '../images/lunalashlogo.svg';
import archImg from '../images/archivist.svg';
import intraconnectedImg from '../images/intraconnected.svg';
import biggestLittleMediaImg from '../images/BiggestLittleMedia.svg';
import whoseDebutImg from '../images/whoseDebut.svg';

export const projects = {
  intraconnected: {
    projectTitle: 'Intraconnected',
    projectDesc: 'An idea tracking tool that helps users organize thoughts, concepts, and hierarchies using a visual, node-based layout, enabling users to explore and manage their ideas intuitively.',
    projectLink: 'https://intraconnected.app',
    githubLink: 'https://github.com/Africk-Hunter/Intraconnected-Releases',
    projectImage: intraconnectedImg,
    technologyArray: [
      { name: 'React.js' },
      { name: 'TypeScript' },
      { name: 'SCSS' },
    ]
  },
  whoseDebut: {
    projectTitle: 'WHOSE DEBUT?',
    projectDesc: 'A music discovery platform spotlighting weekly album releases from local Reno, NV artists, giving them a space to grow their audience beyond crowded streaming platforms.',
    projectLink: 'https://whosedebut.com',
    githubLink: 'https://github.com/Africk-Hunter/WHOSE-DEBUT-',
    projectImage: whoseDebutImg,
    technologyArray: [
      { name: 'React.js' },
      { name: 'TypeScript' },
      { name: 'Firebase' },
      { name: 'Cloudinary' },
    ]
  },
  biggestLittleMedia: {
    projectTitle: 'Biggest Little Media',
    projectDesc: 'Website for Biggest Little Media, a social media strategy and brand consulting studio helping Reno, NV small businesses grow their online presence.',
    projectLink: 'https://biggestlittlemedia.com',
    githubLink: 'https://github.com/Africk-Hunter/Biggest-Little-Media',
    projectImage: biggestLittleMediaImg,
    technologyArray: [
      { name: 'React.js' },
      { name: 'TypeScript' },
      { name: 'SCSS' },
      { name: 'Claude' },
    ]
  },
  llabc: {
    projectTitle: 'Luna Lash & Beauty Co',
    projectDesc: 'Website for Luna Lash & Beauty Co., designed to highlight services and connect with clients effortlessly.',
    projectLink: 'https://lunalashandbeautyco.com/',
    githubLink: 'https://github.com/Africk-Hunter/luna-lash-beauty-site',
    projectImage: llabcImage,
    technologyArray: [
      { name: 'React.JS' },
      { name: 'Sass' },
      { name: 'Gatsby' },
      { name: 'Typescript' },
    ]
  },
  stockZ: {
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
  },
  archivist: {
    projectTitle: 'Archivist',
    projectDesc: 'A Vue and Flask-based web app that dynamically displays random words and their definitions, powered by a Python web scraper and an SQL database.',
    projectLink: '',
    githubLink: 'https://github.com/Africk-Hunter/Archivist',
    projectImage: archImg,
    technologyArray: [
      { name: 'Vue.js' },
      { name: 'Python' },
      { name: 'SQL' },
      { name: 'Flask' },
      { name: 'AWS' },
    ]
  },
  ghostwryte: {
    projectTitle: 'Ghostwryte.ai',
    projectDesc: 'An AI copilot for knowledge-based content creators, designed to help users craft authentic, personalized content with a minimalist, intuitive interface.',
    projectLink: '',
    githubLink: 'https://github.com/CS425Team46/Ghostwryrte.ai',
    projectImage: ghostwryteImage,
    technologyArray: [
      { name: 'Javascript' },
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'Firebase' }
    ]
  },
  portfolio: {
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
  },
  twentyOnOff: {
    projectTitle: '20ON20OFF',
    projectDesc: 'A timer app that supports the 20-20-20 rule to reduce eye strain by encouraging breaks during extended screen use.',
    projectLink: 'https://two0on20off.onrender.com/',
    githubLink: 'https://github.com/Africk-Hunter/20ON20OFF',
    projectImage: twentyOnImage,
    technologyArray: [
      { name: 'React.JS' },
      { name: 'CSS' },
    ]
  },
};

// Order used by the home page. Keep exactly this order.
export const defaultProjectIds = ['intraconnected', 'whoseDebut', 'biggestLittleMedia', 'llabc', 'stockZ', 'archivist'];
