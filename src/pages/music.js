import React from 'react';
import SubPage, { Drift } from '../components/portfolio/SubPage';
import { SEO } from '../components/seo';
import { pageSchema } from '../components/schema';
import { work, spotify } from '../components/portfolio/data';

// The three service marks redrawn as one-colour shapes so they take the button's ink instead of the brands' colours.
// Spotify's bars are cut out in --tz-ico-cut (set by .tz-jelly-ico to match the button).
const LOGOS = {
  Spotify: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor" /><path d="M5.9 8.9c4.3-1.3 9.2-.9 12.8 1.1M6.6 12.2c3.5-.9 7.2-.6 10.1 1M7.3 15.3c2.8-.7 5.6-.4 7.6.8" fill="none" stroke="var(--tz-ico-cut)" strokeWidth="1.9" strokeLinecap="round" /></svg>,
  'Apple Music': <svg viewBox="225 170 660 840" aria-hidden="true"><path fill="currentColor" d="M423 300C423 275 440 265 460 260L830 185C860 180 876 190 876 215V790C876 860 840 900 760 915C690 925 643 880 643 822C643 760 690 725 760 708L805 699C825 695 830 680 830 665V380C830 368 822 355 800 358L494 420C473 425 469 435 469 470V860C469 940 420 990 340 1000C275 1005 235 960 235 905C235 845 280 812 350 797L395 788C415 783 423 770 423 750Z" /></svg>,
  Bandcamp: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 18 8.2 6H22.5l-6.7 12Z" fill="currentColor" /></svg>,
};
const PATH = '/music/';
const DESC = 'Collection of Sounds is the debut album by Hunter Africk, a conscious, alternative hip hop record from Reno, NV. Listen on Spotify, Apple Music or Bandcamp.';
const album = work.find((w) => w.id === 'cos');
const BANDCAMP = 'https://huntersmusic.bandcamp.com';
const APPLE = album.links.find(([l]) => l === 'Apple Music')[1];
const INFLUENCES = ['Andre 3000', 'Tyler, The Creator', 'Tame Impala', 'Common', 'Q-Tip', 'Erykah Badu'];
const JOBS = ['Written', 'Produced', 'Recorded', 'Mixed', 'Mastered', 'Drawn'];

const musicSchema = pageSchema({ path: PATH, name: 'Music by Hunter Africk', description: DESC });
musicSchema['@graph'].push({
  '@type': 'MusicAlbum', '@id': 'https://hunterafrick.com/music/#album', name: album.title, albumProductionType: 'https://schema.org/StudioAlbum',
  genre: ['Alternative hip hop', 'Conscious hip hop'], datePublished: '2025-10', image: 'https://hunterafrick.com/og-image.png',
  byArtist: { '@type': 'MusicGroup', name: 'Hunter Africk', url: BANDCAMP, sameAs: [spotify.split('?')[0], BANDCAMP] },
  sameAs: album.links.map(([, h]) => h.split('?')[0]),
});

// The sleeve, with a spinning record sliding out from behind it. The record's label is the cover art.
const Deck = () => (
  <div className="mu-deck">
    <div className="mu-record"><img src={album.image} alt="" width="120" height="120" /></div>
    <img className="mu-sleeve" src={album.image} alt="Collection of Sounds album cover, drawn by Hunter Africk" width="360" height="360" loading="eager" decoding="async" />
    <p className="mu-burst" aria-hidden="true"><b>debut</b> LP &middot; Oct {album.year}</p>
  </div>
);

const Listen = () => (
  <div className="tz-row">
    {album.links.map(([l, h], i) => (
      <a key={l} className={`tz-jelly tz-jelly-ico${i ? ' tz-jelly-pale' : ''}`} href={h} target="_blank" rel="noopener noreferrer">
        {LOGOS[l]}Listen on {l}
      </a>
    ))}
  </div>
);

export default function MusicPage() {
  return (
    <SubPage path={PATH} tone="mu" kicker="Music" folio="Side A" art={<Deck />} actions={<Listen />}
      title="Hunter Africk: hip hop from Reno, NV"
      stand="I write, produce, record, mix and master my own music. My debut album is Collection of Sounds.">

      {/* a strip of tape across the page: six jobs, one person */}
      <div className="mu-tape" role="img" aria-label={`${JOBS.join(', ')}: all by Hunter Africk`}>
        <div aria-hidden="true">
          {[0, 1].map((k) => (
            <p key={k}>{JOBS.map((j) => <span key={j}>{j}</span>)}<b>by one person</b></p>
          ))}
        </div>
      </div>

      <section className="tz-sub-block mu-notes">
        <div>
          <p className="tz-kicker">Liner notes</p>
          <h2>{album.title}</h2>
          <div className="mu-cols">
            <p className="tz-drop">{album.blurb}</p>
            <p>{album.long}</p>
            <p>It is a conscious, alternative hip hop record, and it doubles as a r&eacute;sum&eacute;: songwriting, production, engineering and illustration on a single sleeve.</p>
          </div>
          <p className="mu-who">Shaped by</p>
          <ul className="mu-chips">
            {INFLUENCES.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>

        <aside className="mu-back">
          <h2>Credits</h2>
          <dl>
            {album.credits.map(([role, who], i) => (
              <div key={role}><dt><i>{`A${i + 1}`}</i>{role}</dt><dd>{who}</dd></div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="tz-tank mu-tank">
        <Drift />
        <p className="tz-kicker">Elsewhere</p>
        <h2>More to hear</h2>
        <p className="tz-novel-dek">Follow along, or find the next local release.</p>
        <div className="tz-row">
          <a className="tz-jelly" href={spotify} target="_blank" rel="noopener noreferrer">Follow on Spotify</a>
          <a className="tz-jelly" href={APPLE} target="_blank" rel="noopener noreferrer">Apple Music</a>
          <a className="tz-jelly" href={BANDCAMP} target="_blank" rel="noopener noreferrer">Bandcamp</a>
        </div>
        <a className="mu-wd" href="https://whosedebut.com" target="_blank" rel="noopener noreferrer">
          <i aria-hidden="true" />
          <span><b>WHOSE DEBUT?</b>A weekly spotlight on releases from local Reno artists. I built it.</span>
        </a>
      </section>
    </SubPage>
  );
}

export const Head = () => <SEO title="Music: Collection of Sounds" description={DESC} pathname={PATH} schema={musicSchema} />;
