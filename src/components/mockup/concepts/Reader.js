import React, { useEffect, useRef, useState } from 'react';
import { projects, defaultProjectIds } from '../../../data/projects';
import { aboutPicture, bio, socials, album, domainOf } from '../showroomData';

// The calm part. Every concept opens its sections into this same card, so the
// play happens on the way in and reading is always quiet and predictable.

export const TITLES = {
  about: 'Hi, I’m Hunter',
  websites: 'Websites',
  music: 'Collection of Sounds',
  contact: 'Say hello',
};

const About = () => (
  <div className="rd__about">
    <img className="rd__portrait" src={aboutPicture} alt="Hunter" />
    <div>
      {bio.map((line) => <p key={line}>{line}</p>)}
      <div className="rd__links">
        {socials.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
        ))}
      </div>
    </div>
  </div>
);

const Websites = () => (
  <div className="rd__projects">
    {defaultProjectIds.map((id) => {
      const p = projects[id];
      return (
        <article key={id} className="rd__project">
          <img src={p.projectImage} alt="" />
          <h3>{p.projectTitle}</h3>
          <p>{p.projectDesc}</p>
          <p className="rd__tech">{p.technologyArray.map((t) => t.name).join(' · ')}</p>
          <div className="rd__links">
            {p.projectLink && <a href={p.projectLink} target="_blank" rel="noopener noreferrer">{domainOf(p.projectLink)} ↗</a>}
            <a href={p.githubLink} target="_blank" rel="noopener noreferrer">source ↗</a>
          </div>
        </article>
      );
    })}
  </div>
);

const Music = () => (
  <div className="rd__about">
    <img className="rd__cover" src={album.cover} alt={album.title} />
    <div>
      <p>{album.desc}</p>
      <p className="rd__tech">{album.specs.map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
      <div className="rd__links">
        {album.links.map(({ label, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
        ))}
      </div>
    </div>
  </div>
);

const Contact = () => {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="rd__sent">
        <p>Sent. (Mockup only: nothing was actually delivered yet.)</p>
        <button className="rd__btn" onClick={() => setSent(false)}>write another</button>
      </div>
    );
  }
  return (
    <form className="rd__form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <input placeholder="Your name" aria-label="Your name" required />
      <input type="email" placeholder="Your email" aria-label="Your email" required />
      <textarea rows="5" placeholder="Your message" aria-label="Your message" required />
      <button className="rd__btn" type="submit">send it ›</button>
    </form>
  );
};

export const BODIES = { about: About, websites: Websites, music: Music, contact: Contact };

const Reader = ({ id, onClose }) => {
  const card = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // Esc closes, and focus goes back to whatever opened the card.
  useEffect(() => {
    const opener = document.activeElement;
    card.current.focus();
    const onKey = (e) => e.key === 'Escape' && closeRef.current();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (opener && opener.focus) opener.focus();
    };
  }, []);

  const Body = BODIES[id];

  return (
    <div className="rd" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <article className="rd__card" role="dialog" aria-modal="true" aria-label={TITLES[id]} tabIndex={-1} ref={card}>
        <header className="rd__head">
          <h2>{TITLES[id]}</h2>
          <button className="rd__close" onClick={onClose} aria-label="Close (Esc)">×</button>
        </header>
        <div className="rd__body"><Body /></div>
      </article>
    </div>
  );
};

export default Reader;
