import React, { useEffect, useState } from 'react';
import { projects, defaultProjectIds } from '../../data/projects';
import { Monitor, Vinyl, Envelope } from './ShowroomObjects';
import { aboutPicture, bio, profile, socials, album, screens, domainOf } from './showroomData';

// Round 3: one showroom, one turntable. The screen never scrolls; each section
// puts a different object on the turntable and its details in the glass panel.
const SECTIONS = [
  { id: 'about', glyph: 'driver' },
  { id: 'websites', glyph: 'garage' },
  { id: 'music', glyph: 'radio' },
  { id: 'contact', glyph: 'mail' },
];

const emptyDraft = { name: '', email: '', message: '' };

const useRenoClock = () => {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit',
    }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return time;
};

const Showroom = () => {
  const [section, setSection] = useState('about');
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState(emptyDraft);
  const [sent, setSent] = useState(false);
  const time = useRenoClock();

  const count = defaultProjectIds.length;
  const step = (dir) => setIndex((i) => (i + dir + count) % count);
  const projectId = defaultProjectIds[index];
  const project = projects[projectId];

  useEffect(() => {
    const handleKey = (e) => {
      if (section !== 'websites' || e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % count);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + count) % count);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [section, count]);

  // The nameplate always names whatever is on the turntable.
  const nameplate = {
    about: 'Hunter Africk',
    websites: project.projectTitle,
    music: album.title,
    contact: 'Write to Me',
  }[section];

  // Keys that change whenever the object on display changes, to replay the swap.
  const displayKey = section === 'websites' ? `websites-${projectId}` : section;

  return (
    <div className="sr">
      <Backdrop />

      <header className="sr__head">
        <div className="sr__slab">
          <span className="sr__led" />
          Reno, NV <span className="sr__time">{time}</span>
        </div>
        <h1 className="sr__nameplate" key={`name-${displayKey}`}>
          {nameplate}
          <span className="sr__orb" />
        </h1>
      </header>

      <nav className="sr__nav">
        {SECTIONS.map(({ id, glyph }) => (
          <button
            key={id}
            className={`sr__navItem ${section === id ? 'isOn' : ''}`}
            onClick={() => setSection(id)}
            aria-current={section === id}
          >
            <span className="sr__oval"><Glyph type={glyph} /></span>
            <span className="sr__navLabel">{id}</span>
          </button>
        ))}
      </nav>

      <section className="sr__stage" aria-label="On display">
        <div className="sr__beam" />
        <div className="sr__object" key={`obj-${displayKey}`}>
          {section === 'websites' && <Monitor key={projectId} project={project} screen={screens[projectId]} />}
          {section === 'music' && <Vinyl />}
          {section === 'contact' && <Envelope draft={draft} sent={sent} />}
        </div>
        <div className={`sr__plate ${section === 'about' ? 'isIdle' : ''}`} key={`plate-${displayKey}`} />
        {section === 'about' && <p className="sr__hint">choose a section to bring something out</p>}
        {section === 'websites' && (
          <div className="sr__picker">
            <button className="sr__arrow" onClick={() => step(-1)} aria-label="Previous website">‹</button>
            <span className="sr__count">{String(index + 1).padStart(2, '0')}<small> / {String(count).padStart(2, '0')}</small></span>
            <button className="sr__arrow" onClick={() => step(1)} aria-label="Next website">›</button>
          </div>
        )}
      </section>

      <aside className="sr__panel">
        {section === 'about' && <AboutPanel />}
        {section === 'websites' && <SpecPanel key={projectId} project={project} index={index} count={count} />}
        {section === 'music' && <MusicPanel />}
        {section === 'contact' && (
          <ContactPanel
            draft={draft}
            sent={sent}
            onChange={(field, value) => setDraft((d) => ({ ...d, [field]: value }))}
            onSend={() => setSent(true)}
            onReset={() => { setDraft(emptyDraft); setSent(false); }}
          />
        )}
      </aside>
    </div>
  );
};

/* ---------- glass panel contents ---------- */

const PanelHead = ({ title, aside }) => (
  <div className="sr__panelHead">
    <h2>{title}</h2>
    {aside && <span>{aside}</span>}
  </div>
);

const SpecList = ({ rows }) => (
  <dl className="sr__spec">
    {rows.map(([k, v]) => (
      <React.Fragment key={k}>
        <dt>{k}</dt>
        <dd>{v}</dd>
      </React.Fragment>
    ))}
  </dl>
);

const Pills = ({ items }) => (
  <div className="sr__pills">
    {items.map(({ label, href }) => (
      <a key={label} className="sr__pill" href={href} target="_blank" rel="noopener noreferrer">{label}</a>
    ))}
  </div>
);

const AboutPanel = () => (
  <>
    <PanelHead title="Driver Profile" />
    <div className="sr__panelBody">
      <div className="sr__intro">
        <div className="sr__portrait"><img src={aboutPicture} alt="Hunter" /></div>
        <p className="sr__hello">Hi, I’m Hunter</p>
      </div>
      {bio.map((line) => <p key={line} className="sr__text">{line}</p>)}
      <SpecList rows={profile} />
      <Pills items={socials} />
    </div>
  </>
);

const SpecPanel = ({ project, index, count }) => {
  const live = project.projectLink;
  return (
    <>
      <PanelHead title="General" aside={`${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`} />
      <div className="sr__panelBody">
        <SpecList rows={[
          ['status', live ? 'live' : 'prototype'],
          ['built with', project.technologyArray.map((t) => t.name).join(', ')],
          ['visit', live ? <a href={live} target="_blank" rel="noopener noreferrer">{domainOf(live)} ↗</a> : 'n/a'],
          ['source', <a href={project.githubLink} target="_blank" rel="noopener noreferrer">github ↗</a>],
        ]} />
        <p className="sr__text">{project.projectDesc}</p>
      </div>
    </>
  );
};

const MusicPanel = () => (
  <>
    <PanelHead title="Track Info" aside="LP" />
    <div className="sr__panelBody">
      <SpecList rows={album.specs} />
      <p className="sr__text">{album.desc}</p>
      <Pills items={album.links} />
    </div>
  </>
);

const ContactPanel = ({ draft, sent, onChange, onSend, onReset }) => (
  <>
    <PanelHead title="Leave a Message" />
    <div className="sr__panelBody">
      {sent ? (
        <div className="sr__sent">
          <p className="sr__hello">Sealed and sent.</p>
          <p className="sr__text">Mockup only: nothing was actually delivered yet.</p>
          <button className="sr__pill" onClick={onReset}>write another</button>
        </div>
      ) : (
        <form className="sr__form" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
          <input className="sr__field" placeholder="Your Name" aria-label="Your name" value={draft.name} onChange={(e) => onChange('name', e.target.value)} required />
          <input className="sr__field" type="email" placeholder="Your Email Address" aria-label="Your email" value={draft.email} onChange={(e) => onChange('email', e.target.value)} required />
          <textarea className="sr__field" rows="6" placeholder="Your Message" aria-label="Your message" value={draft.message} onChange={(e) => onChange('message', e.target.value)} required />
          <button className="sr__pill sr__pill--go" type="submit">seal &amp; send ›</button>
        </form>
      )}
    </div>
  </>
);

/* ---------- backdrop: showroom floor with ribbons of light ---------- */

const Ribbons = ({ className }) => (
  <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="srRibbonA" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset=".3" stopColor="#ffffff" stopOpacity=".9" />
        <stop offset=".65" stopColor="#9fd0ff" stopOpacity=".75" />
        <stop offset="1" stopColor="#5f8fe6" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="srRibbonB" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#bfe4ff" stopOpacity="0" />
        <stop offset=".5" stopColor="#ffffff" stopOpacity=".8" />
        <stop offset="1" stopColor="#c9b8ff" stopOpacity="0" />
      </linearGradient>
      <filter id="srSoft"><feGaussianBlur stdDeviation="6" /></filter>
    </defs>
    <g className="sr__ribbonDrift">
      <path filter="url(#srSoft)" fill="url(#srRibbonA)" d="M-100 470 C 300 250, 700 220, 1000 300 S 1500 400, 1700 230 L1700 300 C 1500 460, 1300 390, 1000 370 S 300 330, -100 560 Z" />
      <path fill="url(#srRibbonB)" opacity=".7" d="M-100 260 C 400 110, 900 90, 1700 170 L1700 186 C 900 116, 400 140, -100 290 Z" />
      <path fill="none" stroke="#ffffff" strokeWidth="2" opacity=".9" d="M-100 520 C 400 290, 900 270, 1700 300" />
      <path fill="none" stroke="#ffd84d" strokeWidth="1.5" opacity=".7" d="M-100 540 C 420 315, 920 296, 1700 326" />
    </g>
  </svg>
);

const Backdrop = () => (
  <div className="sr__backdrop" aria-hidden="true">
    <Ribbons className="sr__ribbons" />
    <div className="sr__floor">
      <Ribbons className="sr__ribbons sr__ribbons--reflected" />
    </div>
  </div>
);

/* ---------- nav glyphs ---------- */

const Glyph = ({ type }) => (
  <svg viewBox="0 0 40 40" className="sr__glyph" aria-hidden="true">
    {type === 'garage' && (
      <>
        <rect x="7" y="9" width="26" height="17" rx="2" />
        <path d="M15 32h10M20 26v6" />
      </>
    )}
    {type === 'radio' && (
      <>
        <circle cx="20" cy="20" r="12" />
        <circle cx="20" cy="20" r="3" />
      </>
    )}
    {type === 'driver' && (
      <>
        <circle cx="20" cy="14" r="6" />
        <path d="M8 33c1.5-7 6-10 12-10s10.5 3 12 10" />
      </>
    )}
    {type === 'mail' && (
      <>
        <rect x="7" y="11" width="26" height="18" rx="2" />
        <path d="M7 12l13 10 13-10" />
      </>
    )}
  </svg>
);

export default Showroom;
