// Shared content for every portfolio mockup. Facts come from src/data/projects.js and src/components/music.js.
// Entries with `sample: true` are placeholders; swap them for real work and every mockup updates.
import cos from '../../images/opt/cos.webp';
import intraShot from '../../images/opt/intraconnected.webp';
import lunaShot from '../../images/opt/luna.webp';
import stockShot from '../../images/opt/stockz.webp';
import intraTile from '../../images/intraconnected.svg';
import debutTile from '../../images/whoseDebut.svg';
import blmTile from '../../images/BiggestLittleMedia.svg';
import lunaTile from '../../images/lunalashlogo.svg';
import archTile from '../../images/archivist.svg';
import stockTile from '../../images/stockZ.png';
import portraitImg from '../../images/opt/portrait.webp';
import partyImg from '../../images/opt/candid.webp'; // resized WebP of hunter-candid.jpg (see src/images/opt)

export const portrait = portraitImg; // landscape, smiling in the car
export const candid = partyImg; // square, green alien balloon

export const disciplines = [
  { id: 'build', name: 'Build', verb: 'builds', noun: 'websites' },
  { id: 'sound', name: 'Sound', verb: 'plays', noun: 'songs' },
  { id: 'write', name: 'Write', verb: 'writes', noun: 'stories' },
  { id: 'draw', name: 'Draw', verb: 'draws', noun: 'drawings' },
];

export const spotify = 'https://open.spotify.com/artist/5u2QScv7e1WEwV17Oy2vpb?si=qoekf4dAQe6_hVAVKaWreQ';

export const work = [
  {
    id: 'cos', title: 'Collection of Sounds', kind: 'Debut album', year: '2025', kinds: ['sound', 'draw', 'write'],
    image: cos, tile: cos, square: true,
    blurb: 'My first full-length release: a conscious, alternative hip hop album.',
    long: 'Collection of Sounds explores the sounds, aesthetics and moods that speak to me. It was shaped by the people I keep coming back to: Andre 3000, Tyler, The Creator, Tame Impala, Common, Q-Tip and Erykah Badu.',
    role: 'Writer, producer, engineer, cover artist', stack: ['Production', 'Mixing', 'Mastering', 'Cover art'],
    credits: [['Written', 'Hunter Africk'], ['Produced', 'Hunter Africk'], ['Recorded', 'Hunter Africk'], ['Mixed', 'Hunter Africk'], ['Mastered', 'Hunter Africk'], ['Cover art', 'Hunter Africk']],
    links: [
      ['Spotify', 'https://open.spotify.com/album/6oQwDQMkd8XiIPoHQBWEDe?si=wQSGork6RAelJ_mNiNuCVA'],
      ['Apple Music', 'https://music.apple.com/us/album/collection-of-sounds/1844427260'],
      ['Bandcamp', 'https://huntersmusic.bandcamp.com/album/collection-of-sounds'],
    ],
  },
  {
    id: 'intraconnected', title: 'Intraconnected', kind: 'Web app', kinds: ['build', 'draw'],
    image: intraShot, tile: intraTile,
    blurb: 'An idea tracker that grows your thoughts into a tree of nodes you can explore, rearrange and lock.',
    role: 'Product design, frontend, brand', stack: ['React', 'TypeScript', 'SCSS'],
    links: [['Visit', 'https://intraconnected.app'], ['GitHub', 'https://github.com/Africk-Hunter/Intraconnected-Releases']],
  },
  {
    id: 'whosedebut', title: 'WHOSE DEBUT?', kind: 'Music platform', kinds: ['build', 'sound'],
    image: debutTile, tile: debutTile, square: true,
    blurb: 'A weekly spotlight on album releases from local Reno, NV artists, off the crowded streaming shelves.',
    long: 'Each week one local release gets the front page. Built for the scene I make music in, so artists can grow an audience beyond the algorithm.',
    role: 'Concept, design, full stack', stack: ['React', 'TypeScript', 'Firebase', 'Cloudinary'],
    links: [['Visit', 'https://whosedebut.com'], ['GitHub', 'https://github.com/Africk-Hunter/WHOSE-DEBUT-']],
  },
  {
    id: 'synthetic', title: 'SYNTHETIC', kind: 'Novel', year: 'In progress', kinds: ['write'], sample: true,
    image: null, tile: null,
    blurb: 'A novel, written chapter by chapter. Placeholder line: drop the real two-sentence pitch here.',
    long: 'Placeholder. This is where the pitch and an excerpt of the opening pages would go.',
    role: 'Author', stack: ['Fiction', 'Long form'],
    links: [],
  },
  {
    id: 'archivist', title: 'Archivist', kind: 'Web app', kinds: ['build', 'write'],
    image: archTile, tile: archTile, square: true,
    blurb: 'Serves up random words and their definitions, scraped and stored for anyone who collects language.',
    long: 'A Vue and Flask app backed by a Python scraper and a SQL database. A small machine for falling in love with words.',
    role: 'Full stack', stack: ['Vue', 'Python', 'Flask', 'SQL', 'AWS'],
    links: [['GitHub', 'https://github.com/Africk-Hunter/Archivist']],
  },
  {
    id: 'luna', title: 'Luna Lash & Beauty Co', kind: 'Website', kinds: ['build'],
    image: lunaShot, tile: lunaTile,
    blurb: 'A soft, elegant site for a lash and beauty studio, built to show off services and get clients booked.',
    long: 'Designed around the studio’s own photography, with booking one tap away on every page.',
    role: 'Design, build', stack: ['Gatsby', 'Sass', 'TypeScript'],
    links: [['Visit', 'https://lunalashandbeautyco.com/'], ['GitHub', 'https://github.com/Africk-Hunter/luna-lash-beauty-site']],
  },
  {
    id: 'blm', title: 'Biggest Little Media', kind: 'Website', kinds: ['build'],
    image: blmTile, tile: blmTile, square: true,
    blurb: 'Home for a social media and brand studio helping Reno small businesses grow online.',
    long: 'A brand-forward site for a local studio, written and built to sell the craft without the jargon.',
    role: 'Design, build', stack: ['React', 'TypeScript', 'SCSS'],
    links: [['Visit', 'https://biggestlittlemedia.com'], ['GitHub', 'https://github.com/Africk-Hunter/Biggest-Little-Media']],
  },
  {
    id: 'stockz', title: 'Stock Z', kind: 'Web app', kinds: ['build'],
    image: stockShot, tile: stockTile,
    blurb: 'Finds good buying ranges for a stock from its history, so decisions come from data, not nerves.',
    long: 'Pulls historical prices and turns them into plain ranges you can act on.',
    role: 'Full stack', stack: ['JavaScript', 'Tailwind', 'Firebase'],
    links: [['Visit', 'https://www.Stock-Z.com'], ['GitHub', 'https://github.com/Africk-Hunter/StockZ']],
  },
  {
    id: 'sketchbook', title: 'Sketchbook', kind: 'Drawings', kinds: ['draw'], sample: true,
    image: null, tile: null,
    blurb: 'Studies, doodles and character sheets. Placeholder: swap in scans of favourite pages.',
    long: 'Placeholder. A handful of scanned pages would live here.',
    role: 'Illustration', stack: ['Pencil', 'Ink'],
    links: [],
  },
];

export const bio = {
  short: 'Hunter Africk is a creative in Reno, NV who makes websites, music, stories and drawings, usually more than one at a time.',
  long: [
    'I’m a creative based in Reno, NV. I make music, write stories, build websites and draw, and I like putting myself in a position to grow.',
    'I have a bachelor’s in Computer Science & Engineering from UNR. When I’m not making something I’m listening to music, reading, or sitting in a park.',
  ],
  where: 'Reno, NV',
  school: 'B.S. Computer Science & Engineering, UNR',
};

export const links = [
  { name: 'GitHub', href: 'https://github.com/Africk-Hunter' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/hunter-africk-3a6485209/' },
  { name: 'Spotify', href: spotify },
  { name: 'Bandcamp', href: 'https://huntersmusic.bandcamp.com/album/collection-of-sounds' },
];

export const glyphs = {
  build: 'M8 7 3 12l5 5M16 7l5 5-5 5M14 4l-4 16',
  sound: 'M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4',
  write: 'M4 20l1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3',
  draw: 'M3 17c3-8 6-8 7-3s4 4 7-4M17 4l3 3-5 5-3-3 5-5Z',
};

export const nameOf = (k) => disciplines.find((d) => d.id === k).name;
export const countOf = (k) => work.filter((w) => w.kinds.includes(k)).length;
