import aboutPicture from '../../images/NewPic.png';
import cosImage from '../../images/COS.png';
import llabcShot from '../../images/placeholders/lunalashandbeautyco.com_(Desktop).png';
import stockZShot from '../../images/placeholders/stock-z.com_main(Desktop).png';

// Content for the showroom mockup. Project details come from src/data/projects.js;
// this file only adds what the showroom needs on top of them.

export { aboutPicture };

export const bio = [
  'I’m a creative based in Reno, NV making cool shit. I enjoy making music, writing stories, building websites, drawing, and otherwise putting myself in a position to grow.',
  'I have a bachelors degree in Computer Science & Engineering from UNR. When I’m not creating, I enjoy listening to music, reading books, relaxing at the park, and hanging out with my girlfriend :)',
];

export const profile = [
  ['based in', 'Reno, NV'],
  ['studied', 'CS & Engineering, UNR'],
  ['makes', 'websites, music, stories'],
];

export const socials = [
  { label: 'github', href: 'https://github.com/Africk-Hunter' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/hunter-africk-3a6485209/' },
  { label: 'spotify', href: 'https://open.spotify.com/artist/5u2QScv7e1WEwV17Oy2vpb?si=qoekf4dAQe6_hVAVKaWreQ' },
];

export const album = {
  title: 'Collection of Sounds',
  cover: cosImage,
  specs: [
    ['artist', 'Hunter Africk'],
    ['released', 'October 2025'],
    ['genre', 'conscious / alt hip hop'],
    ['made by', 'me, start to finish'],
  ],
  desc: 'My first album!! Produced, written, recorded, mixed, and mastered by me. The album art is also by me. It explores the sounds, aesthetics, and moods that speak to me, shaped by Andre 3000, Tyler The Creator, Tame Impala, Common, Q-Tip, Erykah Badu, and many more :)',
  links: [
    { label: 'spotify', href: 'https://open.spotify.com/album/6oQwDQMkd8XiIPoHQBWEDe?si=wQSGork6RAelJ_mNiNuCVA' },
    { label: 'apple music', href: 'https://music.apple.com/us/album/collection-of-sounds/1844427260' },
    { label: 'bandcamp', href: 'https://huntersmusic.bandcamp.com/album/collection-of-sounds' },
    { label: 'amazon', href: 'https://music.amazon.com/albums/B0FTZPRFFJ' },
  ],
};

// What each monitor shows. `live` sites allow framing; the others send
// X-Frame-Options: DENY (or have no live site), so they get a still instead.
export const screens = {
  intraconnected: { live: true },
  whoseDebut: { live: true },
  biggestLittleMedia: { live: true },
  llabc: { still: llabcShot },
  stockZ: { still: stockZShot },
  archivist: {},
};

export const domainOf = (url) => url.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '').toLowerCase();
