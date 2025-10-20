import React, { useEffect, useState } from 'react';
import cosImage from '../images/COS.png';
import spotifyIcon from '../images/Spotify.png';
import AppleMusicIcon from '../images/AppleMusic.png';
import BCIcon from '../images/Bandcamp.png';
import AmazonMusicIcon from '../images/Amazon.svg';


const Music = () => {

  const music_CollectionOfSounds = {
    musicTitle: 'Collection of Sounds',
    musicRelease: 'Released October 2025',
    musicDesc: 'My first album!! Produced, written, recorded, mixed, and mastered by me. The album art is also by me. \n\nCollection of Sounds is a conscious/alternative hip hop album that explores the sounds, aesthetics, and moods that speak to me. It was shaped by my inspirations: Andre 3000, Tyler The Creator, Tame Impala, Common, Q-Tip, Erykah Badu, and many more :)',
    spotifyLink: 'https://open.spotify.com/album/6oQwDQMkd8XiIPoHQBWEDe?si=wQSGork6RAelJ_mNiNuCVA',
    appleMusicLink: 'https://music.apple.com/us/album/collection-of-sounds/1844427260',
    bandcampLink: 'https://huntersmusic.bandcamp.com/album/collection-of-sounds',
    primeMusicLink: 'https://music.amazon.com/albums/B0FTZPRFFJ',
    projectImage: cosImage,
  };

  return (
    <section id="Music" className="music">
      <h1 className='projectsLabel'>Music</h1>
      <section className='projectCardHolder'>
        <MusicCard projectInfo={music_CollectionOfSounds} />
      </section>
    </section>
  );
};

export default Music;

const MusicCard = ({ projectInfo }) => {

  const { musicTitle, musicRelease, musicDesc, spotifyLink, appleMusicLink, bandcampLink, primeMusicLink, projectImage } = projectInfo || {};

  return (
    <div className='musicCard'>
      <a target="_blank" href={spotifyLink} className="albumLink"><img src={projectImage} alt={musicTitle} className="albumImage" /></a>
      <section className="details">
        <div className="titleAndRelease">
          <h2 className="title">{musicTitle}</h2>
          <p className="release">{musicRelease}</p>
        </div>
        <p className="description">
          {musicDesc}
        </p>
        <div className="links">
          <a target="_blank" href={spotifyLink} className="musicLink"><img src={spotifyIcon} alt="Spotify" className="musicLinkImg" /></a>
          <a target="_blank" href={appleMusicLink} className="musicLink"><img src={AppleMusicIcon} alt="Apple Music" className="musicLinkImg" /></a>
          <a target="_blank" href={bandcampLink} className="musicLink"><img src={BCIcon} alt="Bandcamp" className="musicLinkImg" /></a>
          <a target="_blank" href={primeMusicLink} className="musicLink"><img src={AmazonMusicIcon} alt="Prime Music" className="musicLinkImg" /></a>
        </div>
      </section>
    </div>
  );
};



