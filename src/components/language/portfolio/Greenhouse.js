import React, { useEffect, useMemo, useRef, useState } from 'react';
import { work, disciplines, bio, links, portrait, candid, nameOf, countOf, spotify } from '../../portfolio/data';
import { Glyph, usePage, pad } from '../../portfolio/kit';
import '../../../styles/language/portfolio/greenhouse.scss';

// Overgrowth portfolio: a greenhouse from a nicer future. A glass side panel holds the index and the
// discipline lamps; the work hangs on a long horizontal gallery lit by bioluminescent light.
const FONTS = 'https://fonts.googleapis.com/css2?family=Michroma&family=Barlow:wght@300;400;500;600&family=Azeret+Mono:wght@400;500&display=swap';
const FACE = "@font-face{font-family:'Microgramma D Extended';font-weight:700;font-display:swap;src:local('Microgramma D Extended Bold'),local('MicrogrammaDExtended-Bold'),url('/fonts/MicrogrammaDExtended-Bold.woff2') format('woff2'),url('/fonts/MicrogrammaDExtended-Bold.otf') format('opentype'),url('/fonts/MicrogrammaDExtended-Bold.ttf') format('truetype');}";

// A frond drawn in code: a drooping stem with leaflet pairs that shrink toward the tip.
const Frond = ({ className, style }) => {
  const leaflets = useMemo(() => Array.from({ length: 13 }, (_, i) => {
    const x = 30 + i * 38;
    const len = 150 * (1 - (i / 12) * 0.72) + 18;
    return { x, y: (x / 520) ** 2 * 60, len, w: len * 0.2, a: (Math.atan((2 * x / 520 ** 2) * 60) * 180) / Math.PI };
  }), []);
  return (
    <svg className={className} style={style} viewBox="-20 -190 620 400" aria-hidden="true">
      {leaflets.flatMap((l, i) => [-1, 1].map((s) => (
        <path key={`${i}${s}`} transform={`translate(${l.x} ${l.y}) rotate(${l.a + s * 62})`} d={`M0 0Q${l.len * 0.45} ${-l.w} ${l.len} 0Q${l.len * 0.45} ${l.w} 0 0Z`} />
      )))}
      <path className="gh-stem" d="M0 0Q260 -10 560 70" />
    </svg>
  );
};

const kindsLabel = (w) => w.kinds.map(nameOf).join(' × ');

export default function Greenhouse() {
  usePage(FONTS, '#10241A');
  const [picked, setPicked] = useState([]);
  const [active, setActive] = useState(0);
  const [prog, setProg] = useState(0);
  const track = useRef(null);
  const root = useRef(null);
  const plates = useRef([]);
  const glide = useRef({ target: 0, raf: 0 });

  useEffect(() => {
    if (!document.getElementById('gh-face')) {
      const s = document.createElement('style');
      s.id = 'gh-face'; s.textContent = FACE; document.head.appendChild(s);
    }
  }, []);

  const list = picked.length ? work.filter((w) => w.kinds.some((k) => picked.includes(k))) : work;
  const horizontal = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 901px)').matches;

  // One glide loop owns horizontal movement (wheel and index clicks), so nothing fights it.
  const glideTo = (x) => {
    const el = track.current;
    glide.current.target = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, x));
    if (glide.current.raf) return;
    const step = () => {
      const g = glide.current;
      const d = g.target - el.scrollLeft;
      if (Math.abs(d) < 0.6) { el.scrollLeft = g.target; g.raf = 0; return; }
      el.scrollLeft += d * 0.16;
      g.raf = requestAnimationFrame(step);
    };
    glide.current.raf = requestAnimationFrame(step);
  };

  // The wheel drives the horizontal gallery from anywhere on the page (not just over the track), on wide screens.
  // Either axis counts, and line/page delta modes (Firefox, some mice) are converted to pixels.
  useEffect(() => {
    const el = track.current;
    const host = root.current;
    const g = glide.current;
    const onWheel = (e) => {
      if (!horizontal() || e.ctrlKey) return;
      const list = e.target.closest && e.target.closest('.gh-index');
      if (list && list.scrollHeight > list.clientHeight && Math.abs(e.deltaY) >= Math.abs(e.deltaX)) return; // let a long index scroll itself
      let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (e.deltaMode === 1) d *= 32;
      else if (e.deltaMode === 2) d *= el.clientWidth;
      e.preventDefault();
      glideTo((g.raf ? g.target : el.scrollLeft) + d * 1.2);
    };
    host.addEventListener('wheel', onWheel, { passive: false });
    return () => { host.removeEventListener('wheel', onWheel); cancelAnimationFrame(g.raf); g.raf = 0; };
  }, []);

  // Wide screens scroll the track sideways; narrow screens scroll the whole page down.
  const onScroll = () => {
    const h = horizontal();
    const el = h ? track.current : root.current;
    const max = h ? el.scrollWidth - el.clientWidth : el.scrollHeight - el.clientHeight;
    setProg(max > 0 ? Math.min(1, (h ? el.scrollLeft : el.scrollTop) / max) : 0);
    const box = el.getBoundingClientRect();
    const mid = h ? box.left + el.clientWidth * 0.4 : box.top + el.clientHeight * 0.4;
    let hit = 0;
    plates.current.forEach((p, i) => { if (p && (h ? p.getBoundingClientRect().left : p.getBoundingClientRect().top) <= mid) hit = i; });
    setActive(hit);
  };

  const goTo = (i) => {
    const p = plates.current[i];
    if (!p) return;
    if (horizontal()) glideTo(p.offsetLeft - 40);
    else p.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') goTo(Math.min(active + 1, list.length + 1));
      if (e.key === 'ArrowLeft') goTo(Math.max(active - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    cancelAnimationFrame(glide.current.raf); glide.current.raf = 0;
    if (track.current) track.current.scrollTo({ left: 0, top: 0 });
    if (root.current) root.current.scrollTo({ top: 0 });
    setActive(0); setProg(0);
  }, [picked.length]);

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const setPlate = (i) => (el) => { plates.current[i] = el; };
  plates.current.length = list.length + 2;

  return (
    <div className="gh" style={{ '--prog': prog }} ref={root} onScroll={onScroll}>
      <div className="gh-sky" aria-hidden="true"><i className="gh-bloom gh-bloom-a" /><i className="gh-bloom gh-bloom-b" /><i className="gh-bloom gh-bloom-c" /></div>
      <Frond className="gh-frond gh-frond-a" />
      <Frond className="gh-frond gh-frond-b" />

      <aside className="gh-panel">
        <div className="gh-id">
          <p className="gh-name">Hunter<br />Africk</p>
          <p className="gh-tag">Builds, plays, writes and draws. Grown in {bio.where}.</p>
        </div>

        <div className="gh-block">
          <p className="gh-label">Disciplines</p>
          <ul className="gh-disc">
            {disciplines.map((d) => {
              const on = picked.includes(d.id);
              return (
                <li key={d.id}>
                  <button type="button" className={on ? 'is-on' : ''} aria-pressed={on} onClick={() => toggle(d.id)}>
                    <i className="gh-fruit" />
                    <span>{d.name}</span>
                    <em>{pad(countOf(d.id))}</em>
                    <b className="gh-bar" style={{ '--w': countOf(d.id) / work.length }} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="gh-block gh-block-index">
          <p className="gh-label">Index {picked.length > 0 && <button type="button" className="gh-clear" onClick={() => setPicked([])}>Show all</button>}</p>
          <ol className="gh-index">
            <li><button type="button" className={active === 0 ? 'is-on' : ''} onClick={() => goTo(0)}><span>00</span>Hello</button></li>
            {list.map((w, i) => (
              <li key={w.id}><button type="button" className={active === i + 1 ? 'is-on' : ''} onClick={() => goTo(i + 1)}><span>{pad(work.indexOf(w) + 1)}</span>{w.title}</button></li>
            ))}
            <li><button type="button" className={active === list.length + 1 ? 'is-on' : ''} onClick={() => goTo(list.length + 1)}><span>&rarr;</span>Contact</button></li>
          </ol>
        </div>

        <a className="gh-now" href={spotify} target="_blank" rel="noopener noreferrer">
          <span className="gh-eq" aria-hidden="true"><i /><i /><i /><i /></span>
          <span><small>Now playing</small>Collection of Sounds</span>
        </a>
      </aside>

      <div className="gh-track" ref={track} onScroll={onScroll} tabIndex="-1">
        <section className="gh-plate gh-intro" ref={setPlate(0)}>
          <div className="gh-intro-copy">
            <p className="gh-label">Portfolio · 2026</p>
            <h1>Hunter<br />Africk</h1>
            <p className="gh-lede">I build websites, make music, write fiction and draw. Here they grow side by side, and some of them grew into each other.</p>
            <div className="gh-chips">{disciplines.map((d) => <span key={d.id}><Glyph k={d.id} />{d.noun}</span>)}</div>
            <p className="gh-hint"><i />Scroll to wander</p>
          </div>
          <figure className="gh-frame gh-intro-photo"><img src={candid} alt="Hunter looking up, holding a glowing green alien balloon" /></figure>
        </section>

        {list.map((w, i) => (
          <article key={w.id} className={`gh-plate gh-work${w.square ? ' is-square' : ''}`} ref={setPlate(i + 1)}>
            <figure className="gh-frame gh-art">
              {w.image ? <img src={w.image} alt={`${w.title}`} /> : <span className="gh-seed"><Glyph k={w.kinds[0]} /><small>Still germinating</small></span>}
              <figcaption><span>{pad(work.indexOf(w) + 1)}</span>{kindsLabel(w)}</figcaption>
            </figure>
            <div className="gh-copy">
              <p className="gh-label">{w.kind}{w.year ? ` · ${w.year}` : ''}{w.sample ? ' · placeholder' : ''}</p>
              <h2>{w.title}</h2>
              <p className="gh-blurb">{w.blurb}</p>
              <dl className="gh-meta">
                <div><dt>Role</dt><dd>{w.role}</dd></div>
                <div><dt>Made with</dt><dd>{w.stack.join(' / ')}</dd></div>
              </dl>
              {w.links.length > 0 && <div className="gh-row">{w.links.map(([l, h], j) => <a key={l} className={`gh-btn${j ? ' gh-btn-ghost' : ''}`} href={h} target="_blank" rel="noopener noreferrer">{l}</a>)}</div>}
            </div>
          </article>
        ))}

        <section className="gh-plate gh-outro" ref={setPlate(list.length + 1)}>
          <figure className="gh-frame gh-outro-photo"><img src={portrait} alt="Hunter grinning in the driver's seat" /></figure>
          <div className="gh-copy">
            <p className="gh-label">About</p>
            <h2>One person, four disciplines</h2>
            {bio.long.map((p) => <p key={p} className="gh-blurb">{p}</p>)}
            <div className="gh-row">{links.map((l, j) => <a key={l.name} className={`gh-btn${j ? ' gh-btn-ghost' : ''}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>)}</div>
          </div>
        </section>
        <div className="gh-tail" aria-hidden="true" />
      </div>

      <div className="gh-vine" aria-hidden="true"><i /></div>
    </div>
  );
}
