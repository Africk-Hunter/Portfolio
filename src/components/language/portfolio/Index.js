import React, { useEffect, useRef, useState } from 'react';
import { work, disciplines, bio, links, portrait, nameOf } from '../../portfolio/data';
import { Glyph, usePage, pad } from '../../portfolio/kit';
import '../../../styles/language/portfolio/index.scss';

// Dewdrop portfolio: a calm typographic index. Hover a row and the work floats up inside a glass drop
// that follows the cursor; click and it opens as a pillowy case sheet. One thing at a time, never hurried.
const FONTS = 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Outfit:wght@300;400;500;600&display=swap';
const nouns = ['websites', 'songs', 'stories', 'drawings', 'things'];

const Drop = ({ w, big }) => (
  <span className={`di-drop${big ? ' di-drop-big' : ''}`}>
    {w.image ? <img src={w.image} alt="" /> : <span className="di-drop-empty"><Glyph k={w.kinds[0]} /></span>}
    <i className="di-sheen" /><i className="di-catch" />
  </span>
);

export default function Index() {
  usePage(FONTS, '#EDF5F7');
  const [noun, setNoun] = useState(0);
  const [picked, setPicked] = useState([]);
  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const orb = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const secs = useRef({});
  const reg = (id) => (el) => { secs.current[id] = el; };
  const go = (id) => secs.current[id] && secs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });

  // The noun in the headline drifts through every medium, then rests on "things".
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNoun(nouns.length - 1); return undefined; }
    const t = setInterval(() => setNoun((n) => (n + 1) % nouns.length), 2200);
    return () => clearInterval(t);
  }, []);

  // The drop trails the cursor with a little lag, like something floating.
  useEffect(() => {
    let raf;
    const step = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.14;
      pos.current.y += (target.current.y - pos.current.y) * 0.14;
      if (orb.current) orb.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const list = picked.length ? work.filter((w) => w.kinds.some((k) => picked.includes(k))) : work;
  const hw = work.find((w) => w.id === hover);
  const ow = work.find((w) => w.id === open);
  const step = (d) => { const i = list.findIndex((w) => w.id === open); setOpen(list[(i + d + list.length) % list.length].id); };
  const track = (e) => { target.current = { x: e.clientX, y: e.clientY }; };

  return (
    <div className="di" onPointerMove={track}>
      <header className="di-top">
        <span className="di-name"><i />Hunter Africk</span>
        <nav aria-label="Sections">
          <button type="button" onClick={() => go('index')}>Index</button>
          <button type="button" onClick={() => go('about')}>About</button>
          <button type="button" onClick={() => go('hi')}>Say hi</button>
        </nav>
      </header>

      <section className="di-hero">
        <h1>
          <span>Hunter makes</span>
          <span className="di-noun" aria-live="off">
            {nouns.map((n, i) => <b key={n} className={i === noun ? 'is-on' : ''} aria-hidden={i !== noun}>{n}.</b>)}
          </span>
        </h1>
        <p className="di-lede">Websites, songs, stories and drawings. Usually more than one at a time, never in a hurry.</p>
        <button type="button" className="di-scroll" onClick={() => go('index')}><span>{pad(work.length)} things</span><i aria-hidden="true" /></button>
      </section>

      <section className="di-index" ref={reg('index')}>
        <div className="di-filter" role="group" aria-label="Filter">
          <button type="button" className={`di-bead${picked.length ? '' : ' is-on'}`} aria-pressed={!picked.length} onClick={() => setPicked([])}>All</button>
          {disciplines.map((d) => {
            const on = picked.includes(d.id);
            return (
              <button key={d.id} type="button" className={`di-bead di-k-${d.id}${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => setPicked(on ? picked.filter((p) => p !== d.id) : [...picked, d.id])}>
                <Glyph k={d.id} />{d.name}
              </button>
            );
          })}
        </div>

        <ol className={`di-list${hover ? ' is-hovering' : ''}`} onPointerLeave={() => setHover(null)}>
          {list.map((w) => (
            <li key={w.id} className={hover === w.id ? 'is-hot' : ''}>
              <button type="button" onPointerEnter={() => setHover(w.id)} onFocus={() => setHover(w.id)} onBlur={() => setHover(null)} onClick={() => setOpen(w.id)}>
                <span className="di-no">{pad(work.indexOf(w) + 1)}</span>
                <span className="di-title">{w.title}{w.sample && <sup>sample</sup>}</span>
                <span className="di-kind">{w.kind}</span>
                <span className="di-dots" aria-label={w.kinds.map(nameOf).join(', ')}>{w.kinds.map((k) => <i key={k} className={`di-k-${k}`} title={nameOf(k)} />)}</span>
                <span className="di-year">{w.year || '↗'}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="di-legend">{disciplines.map((d) => <span key={d.id}><i className={`di-k-${d.id}`} />{d.name}</span>)}</p>
      </section>

      <div className={`di-orb${hw && !ow ? ' is-on' : ''}`} ref={orb} aria-hidden="true">
        <div className="di-orb-in">{hw && <Drop w={hw} key={hw.id} />}</div>
      </div>

      <section className="di-about" ref={reg('about')}>
        <div className="di-portrait"><img src={portrait} alt="Hunter grinning in the driver's seat" /><i className="di-sheen" /><i className="di-catch" /></div>
        <div>
          <h2>Hello.</h2>
          {bio.long.map((p) => <p key={p}>{p}</p>)}
          <ul className="di-facts">
            <li><small>Based in</small>{bio.where}</li>
            <li><small>Studied</small>CS &amp; Engineering, UNR</li>
            <li><small>Listening to</small>Andre 3000, Tame Impala</li>
          </ul>
        </div>
      </section>

      <section className="di-hi" ref={reg('hi')}>
        <h2>Say hi.</h2>
        <p>Write whenever. There is no rush.</p>
        <div className="di-row">{links.map((l, i) => <a key={l.name} className={`di-glass${i ? ' di-glass-pale' : ''}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>)}</div>
        <p className="di-foot">Take your time.</p>
      </section>

      {ow && (
        <div className="di-sheet-wrap" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <article className="di-sheet" role="dialog" aria-modal="true" aria-label={ow.title} key={ow.id}>
            <button type="button" className="di-close" onClick={() => setOpen(null)} aria-label="Close">&times;</button>
            <div className={`di-sheet-art${ow.square ? ' is-square' : ''}`}>
              {ow.image ? <img src={ow.image} alt={`${ow.title}`} /> : <span className="di-drop-empty"><Glyph k={ow.kinds[0]} /></span>}
            </div>
            <div className="di-sheet-copy">
              <p className="di-sheet-kind">{pad(work.indexOf(ow) + 1)} &middot; {ow.kind}{ow.year ? ` · ${ow.year}` : ''}</p>
              <h3>{ow.title}</h3>
              <p className="di-sheet-lede">{ow.blurb}</p>
              <p>{ow.long}</p>
              <dl>
                <div><dt>Role</dt><dd>{ow.role}</dd></div>
                <div><dt>Made with</dt><dd>{ow.stack.join(', ')}</dd></div>
                <div><dt>Touches</dt><dd>{ow.kinds.map(nameOf).join(', ')}</dd></div>
              </dl>
              <div className="di-row">
                {ow.links.map(([l, h], i) => <a key={l} className={`di-glass${i ? ' di-glass-pale' : ''}`} href={h} target="_blank" rel="noopener noreferrer">{l}</a>)}
              </div>
              <div className="di-sheet-nav">
                <button type="button" onClick={() => step(-1)}>&larr; Previous</button>
                <button type="button" onClick={() => step(1)}>Next &rarr;</button>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
