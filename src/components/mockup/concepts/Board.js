import React, { useEffect, useMemo, useRef, useState } from 'react';
import { aboutPicture, bio, profile, socials, album, domainOf } from '../showroomData';
import { projects, defaultProjectIds } from '../../../data/projects';

// Round 5: Playroom + Collage in one. Everything is already open on the page:
// four paper pieces on a scrolling board, nothing to click to read. The play is
// optional. Grab a piece by its tab (or a sticker) and move it; "tidy up" puts
// it all back.

const STORAGE = 'mk-board';
const TINTS = ['sky', 'butter', 'lilac'];
const NAV = [
  { id: 'about', label: 'About' },
  { id: 'websites', label: 'Websites' },
  { id: 'music', label: 'Music' },
  { id: 'contact', label: 'Contact' },
];
const STICKERS = [
  { id: 'star', text: '★', left: '86%', top: '17%', r: 12 },
  { id: 'note', text: '♪', left: '6%', top: '58%', r: -10 },
  { id: 'smile', text: ':)', left: '47%', top: '64%', r: 8 },
  { id: 'burst', text: 'new!', left: '83%', top: '4%', r: -8 },
];

const load = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE)) || {};
  } catch (e) {
    return {};
  }
};
const save = (data) => {
  try {
    window.localStorage.setItem(STORAGE, JSON.stringify(data));
  } catch (e) { /* storage can be blocked; the board still works */ }
};

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

/* ---------- buddy: watches the pointer, naps when you stop ---------- */

const Buddy = () => {
  const ref = useRef(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [asleep, setAsleep] = useState(false);

  useEffect(() => {
    let timer;
    const rest = () => {
      setAsleep(false);
      clearTimeout(timer);
      timer = setTimeout(() => setAsleep(true), 8000);
    };
    const onMove = (e) => {
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 220) * 6;
      setLook({ x: (dx / d) * k, y: (dy / d) * k });
      rest();
    };
    window.addEventListener('pointermove', onMove);
    rest();
    return () => {
      window.removeEventListener('pointermove', onMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`pr__buddy ${asleep ? 'isAsleep' : ''}`} ref={ref} aria-hidden="true">
      <span className="pr__eye"><i style={{ transform: `translate(${look.x}px, ${look.y}px)` }} /></span>
      <span className="pr__eye"><i style={{ transform: `translate(${look.x}px, ${look.y}px)` }} /></span>
      {asleep && <span className="pr__zzz">z z z</span>}
    </div>
  );
};

/* ---------- scenery ---------- */

// Deterministic jitter so the torn edges are the same on every render.
const tornEdge = (base, amp, seed) => {
  let s = seed * 97;
  let d = `M0 300 L0 ${base}`;
  for (let x = 20; x <= 1620; x += 20) {
    s = (s * 9301 + 49297) % 233280;
    const jitter = (s / 233280 - 0.5) * amp;
    d += ` L${x} ${(base + jitter + Math.sin(x / 140 + seed) * amp * 1.3).toFixed(1)}`;
  }
  return `${d} L1620 300 Z`;
};

const makeSkyline = () => {
  let s = 11;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const buildings = [];
  let x = 0;
  while (x < 1600) {
    const w = 34 + Math.floor(rand() * 40);
    const h = 40 + Math.floor(rand() * 80);
    const windows = [];
    for (let wy = 10; wy < h - 6; wy += 14) {
      for (let wx = 7; wx < w - 8; wx += 12) {
        if (rand() > 0.62) windows.push({ x: wx, y: wy });
      }
    }
    buildings.push({ x, w, h, windows });
    x += w + 3;
  }
  return buildings;
};

// The page ends at dusk: torn-paper hills with a lit Reno skyline behind them.
const Ground = () => {
  const hills = useMemo(() => [
    { d: tornEdge(128, 16, 1), fill: '#c4dcfb' },
    { d: tornEdge(178, 18, 2), fill: '#8fb4ee' },
    { d: tornEdge(232, 14, 3), fill: '#4a6fc9' },
  ], []);
  const skyline = useMemo(makeSkyline, []);
  const edge = { stroke: '#13245e', strokeWidth: 3, vectorEffect: 'non-scaling-stroke' };

  return (
    <footer className="bd__ground">
      <svg viewBox="0 0 1600 300" preserveAspectRatio="none" aria-hidden="true">
        <path d={hills[0].d} fill={hills[0].fill} {...edge} />
        {skyline.map((b) => (
          <g key={b.x} transform={`translate(${b.x} ${176 - b.h})`}>
            <rect width={b.w} height={b.h + 20} fill="#1c2b7d" />
            {b.windows.map((w) => <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="5" height="7" fill="#ffd84d" />)}
          </g>
        ))}
        <path d={hills[1].d} fill={hills[1].fill} {...edge} />
        <path d={hills[2].d} fill={hills[2].fill} {...edge} />
      </svg>
      <p>Hunter Africk · Reno, NV · made by hand</p>
    </footer>
  );
};

/* ---------- the sections, all open ---------- */

const Links = ({ items }) => (
  <div className="bd__links">
    {items.map(({ label, href }) => (
      <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} ↗</a>
    ))}
  </div>
);

const About = () => (
  <div className="bd__aboutGrid">
    <figure className="bd__polaroid">
      <img src={aboutPicture} alt="Hunter" />
      <figcaption>me, Reno NV</figcaption>
    </figure>
    <div className="bd__paper">
      <h2>Hi, I’m Hunter</h2>
      {bio.map((line) => <p key={line}>{line}</p>)}
      <Links items={socials} />
    </div>
    <dl className="bd__facts">
      {profile.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </React.Fragment>
      ))}
    </dl>
  </div>
);

const Websites = () => (
  <div className="bd__projects">
    {defaultProjectIds.map((id, i) => {
      const p = projects[id];
      const links = [];
      if (p.projectLink) links.push({ label: domainOf(p.projectLink), href: p.projectLink });
      links.push({ label: 'source', href: p.githubLink });
      return (
        <article key={id} className="bd__card" style={{ '--r': `${i % 2 ? 0.9 : -0.9}deg` }}>
          <img src={p.projectImage} alt="" />
          <h3>{p.projectTitle}</h3>
          <p>{p.projectDesc}</p>
          <p className="bd__tech">{p.technologyArray.map((t) => t.name).join(' · ')}</p>
          <Links items={links} />
        </article>
      );
    })}
  </div>
);

const Music = () => (
  <div className="bd__record">
    <div className="bd__sleeve">
      <span className="bd__vinyl"><img src={album.cover} alt="" /></span>
      <img className="bd__cover" src={album.cover} alt={album.title} />
    </div>
    <div className="bd__paper">
      <h2>{album.title}</h2>
      <p>{album.desc}</p>
      <p className="bd__tech">{album.specs.map(([k, v]) => `${k}: ${v}`).join(' · ')}</p>
      <Links items={album.links} />
    </div>
  </div>
);

const Contact = () => {
  const [sent, setSent] = useState(false);
  return sent ? (
    <div className="bd__sent">
      <h2>Sent.</h2>
      <p>Mockup only: nothing was actually delivered yet.</p>
      <button className="bd__btn" onClick={() => setSent(false)}>write another</button>
    </div>
  ) : (
    <form className="bd__form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <h2>Say hello</h2>
      <input placeholder="Your name" aria-label="Your name" required />
      <input type="email" placeholder="Your email" aria-label="Your email" required />
      <textarea rows="5" placeholder="Your message" aria-label="Your message" required />
      <button className="bd__btn" type="submit">send it ›</button>
    </form>
  );
};

const SECTION_BODY = { about: About, websites: Websites, music: Music, contact: Contact };
const SECTION_ROT = { about: -0.8, websites: 0.5, music: -1.4, contact: 1.2 };

/* ---------- the page ---------- */

const Board = () => {
  const [offsets, setOffsets] = useState({});
  const [tint, setTint] = useState('sky');
  const [lifted, setLifted] = useState(null);
  const [order, setOrder] = useState({});
  const time = useRenoClock();

  const drag = useRef(null);
  const z = useRef(10);
  const latest = useRef({ offsets, tint });
  latest.current = { offsets, tint };

  useEffect(() => {
    const saved = load();
    if (saved.offsets) setOffsets(saved.offsets);
    if (saved.tint) setTint(saved.tint);
  }, []);

  // Grabbing only ever starts on a tab or sticker, never on text or fields.
  const grab = (id) => ({
    onPointerDown: (e) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const [ox, oy] = latest.current.offsets[id] || [0, 0];
      drag.current = { id, sx: e.clientX, sy: e.clientY, ox, oy };
      z.current += 1;
      setOrder((o) => ({ ...o, [id]: z.current }));
      setLifted(id);
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d || d.id !== id) return;
      setOffsets((o) => ({ ...o, [id]: [d.ox + e.clientX - d.sx, d.oy + e.clientY - d.sy] }));
    },
    onPointerUp: () => {
      if (!drag.current || drag.current.id !== id) return;
      drag.current = null;
      setLifted(null);
      // state has caught up by the next frame
      requestAnimationFrame(() => save(latest.current));
    },
  });

  const pieceStyle = (id, r) => {
    const [dx, dy] = offsets[id] || [0, 0];
    return { '--dx': `${dx}px`, '--dy': `${dy}px`, '--r': `${r}deg`, zIndex: order[id] || 3 };
  };

  const pickTint = (t) => {
    setTint(t);
    save({ offsets, tint: t });
  };
  const tidy = () => {
    setOffsets({});
    save({ tint });
  };
  const jump = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={`bd bd--${tint}`}>
      <nav className="bd__nav" aria-label="Sections">
        {NAV.map(({ id, label }) => <button key={id} onClick={() => jump(id)}>{label}</button>)}
      </nav>

      <header className="bd__hero">
        <div className="bd__sun" aria-hidden="true" />
        <div className="bd__cloud bd__cloud--a" aria-hidden="true" />
        <div className="bd__cloud bd__cloud--b" aria-hidden="true" />
        <div className="bd__tag">Reno, NV <b>{time}</b></div>
        <h1><span>Hunter</span><span>Africk</span></h1>
        <p>websites, music, stories. grab a tab and move things around if you like.</p>
      </header>

      <main className="bd__main">
        {NAV.map(({ id, label }) => {
          const Body = SECTION_BODY[id];
          return (
            <section
              key={id}
              id={id}
              className={`bd__piece bd__piece--${id} ${lifted === id ? 'isLifted' : ''}`}
              style={pieceStyle(id, SECTION_ROT[id])}
              aria-label={label}
            >
              <span className="bd__tab" title="drag me" {...grab(id)}>{label}</span>
              <Body />
            </section>
          );
        })}
      </main>

      {STICKERS.map((s) => (
        <div
          key={s.id}
          className={`bd__sticker bd__sticker--${s.id} ${lifted === s.id ? 'isLifted' : ''}`}
          style={{ ...pieceStyle(s.id, s.r), left: s.left, top: s.top }}
          aria-hidden="true"
          {...grab(s.id)}
        >
          {s.text}
        </div>
      ))}

      <Ground />
      <Buddy />

      <div className="bd__tools">
        {TINTS.map((t) => (
          <button
            key={t}
            className={`co__swatch co__swatch--${t} ${tint === t ? 'isOn' : ''}`}
            onClick={() => pickTint(t)}
            aria-label={`${t} tint`}
          />
        ))}
        <button className="co__reset" onClick={tidy}>tidy up</button>
      </div>
    </div>
  );
};

export default Board;
