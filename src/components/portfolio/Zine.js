import React, { useEffect, useRef, useState } from 'react';
import { work, bio, portrait, candid } from './data';
import { usePage, Glyph } from './kit';
import { useSlamIntro, ZINE_REVEALS } from './loadIn';
import ZineFooter from './ZineFooter';
import ContactBlock from './ContactBlock';
import '../../styles/portfolio/zine.scss';
import blmShot from '../../images/opt/blm.webp';
import debutShot from '../../images/opt/whosedebut.webp';

// Phone layout (matches the 700px block at the end of zine.scss). The page is prerendered, so the first render
// (server and hydration) is always the desktop one; the effect below corrects it before the intro reveals anything.
const PHONE = '(max-width: 700px)';
// Tablet layout (matches the tablet block in zine.scss): 701–1024px, plus portrait screens up to 1200px (13" iPad Pro
// held upright). Landscape tablets wider than 1024px keep the desktop layout. The wordmark shrinks to a monogram here.
const TABLET = '(min-width: 701px) and (max-width: 1024px), (min-width: 701px) and (max-width: 1200px) and (orientation: portrait)';
const useMedia = (q) => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
};
const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
// Screenshots for sites whose `image` is a square logo tile.
const phoneShots = { blm: blmShot, whosedebut: debutShot };

// Terrarium portfolio: a printed zine, Issue 04. Cover, contents, feature spreads, an interview and a back cover.
// Editorial framing does the multidisciplinary work: every medium gets its own feature, and they cross-reference.
// Fonts are self-hosted: the @font-face rules and preloads are injected in gatsby-ssr.js, so nothing comes from Google.
// Microgramma D Extended Bold (the Websites heading) is commercial, so it is not bundled: it is used only if installed
// on the visitor's system, and Michroma stands in otherwise. (If you ever self-host it, add url() sources back here:
// listing files that do not exist costs a failed request per format.)
// Same rule and style id as Greenhouse, so it is only ever injected once.
const FACE = "@font-face{font-family:'Microgramma D Extended';font-weight:700;font-display:swap;src:local('Microgramma D Extended Bold'),local('MicrogrammaDExtended-Bold');}";
const album = work.find((w) => w.id === 'cos');
const intra = work.find((w) => w.id === 'intraconnected');
const siteOrder = ['intraconnected', 'blm', 'whosedebut', 'luna', 'stockz', 'archivist'];
export const sites = work.filter((w) => w.kinds.includes('build'))
  .sort((a, b) => siteOrder.indexOf(a.id) - siteOrder.indexOf(b.id));
const icIcons = {
  Visit: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  GitHub: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>,
};
const branches = [
  ['Start rough', 'Begin with a rough thought, nothing more.'],
  ['Break it down', 'Split it into parts that branch off.'],
  ['Add the detail', 'To-dos and links, right on the node.'],
  ['Lock it away', 'Keep whatever is private out of sight.'],
];

// Simple streaming-service marks, drawn in currentColor so they take the button's ink.
const svc = {
  Spotify: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><path d="M6.8 9.4c3.7-1.1 7.9-.8 11 1M7.4 12.6c3-.8 6.2-.5 8.6.9M8 15.6c2.4-.6 4.8-.4 6.6.7" fill="none" stroke="var(--tz-ico-cut, #F2EFDF)" strokeWidth="1.7" strokeLinecap="round" /></svg>,
  'Apple Music': <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18.5V6.2l10-2v12.1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><ellipse cx="6.6" cy="18.6" rx="2.6" ry="2.1" fill="currentColor" /><ellipse cx="16.6" cy="16.6" rx="2.6" ry="2.1" fill="currentColor" /></svg>,
  Bandcamp: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 17.5 8.4 6.5H22l-6.4 11Z" fill="currentColor" /></svg>,
};

// A live site in an iframe: rendered at desktop width, then scaled down to fit its frame. Falls back to the
// screenshot when a work has no live URL. Non-interactive so it never traps the page's scroll.
const liveUrl = (w) => (w.links.find(([l]) => l === 'Visit') || [])[1];
// On phones a screenshot replaces the iframe: desktop-width pages are heavy and trap touch scrolling.
// `defer`: show the screenshot first and only start the live site once it has been in view for a moment, so the
// heavy page load does not compete with the section's reveal animations and the scroll.
export const Live = ({ w, W = 1280, H = 800, interactive = false, defer = true }) => {
  const box = useRef(null);
  const [scale, setScale] = useState(0.3);
  const [armed, setArmed] = useState(!defer);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!defer || armed || !el || typeof IntersectionObserver === 'undefined') return undefined;
    let t;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      // Start the live site only once the section's entrance has played and the browser is idle, so its load
      // (a whole app booting) never lands in the middle of the reveal animations.
      const start = () => setArmed(true);
      t = setTimeout(() => (window.requestIdleCallback ? window.requestIdleCallback(start, { timeout: 1500 }) : start()), interactive ? 1600 : 700);
    }, interactive ? { threshold: 0.5 } : { rootMargin: '0px 0px 15% 0px', threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [defer, armed, interactive]);
  const phone = useMedia(PHONE);
  const shot = phone && (phoneShots[w.id] || (!w.square && w.image));
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const fit = () => setScale(el.clientWidth / W);
    fit();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W, shot]);
  const url = liveUrl(w);
  if (!url) return <img src={w.image} alt={`${w.title} preview`} loading="lazy" decoding="async" />;
  if (shot) return <img src={shot} alt={`${w.title} preview`} loading="lazy" decoding="async" />;
  return (
    <div className={`tz-live${interactive ? ' tz-live-on' : ''}`} ref={box} style={{ aspectRatio: `${W} / ${H}` }}>
      {defer && !loaded && <img className="tz-live-ph" src={phoneShots[w.id] || w.image} alt={`${w.title} preview`} loading="lazy" decoding="async" />}
      {armed && (
        <iframe src={url} title={`${w.title}, live site`} tabIndex={interactive ? 0 : -1} sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          style={{ width: W, height: H, transform: `scale(${scale})`, opacity: defer && !loaded ? 0 : 1 }} />
      )}
    </div>
  );
};

// "The Debut" hand-lettered to match the Collection of Sounds cover: each letter is one drawn outline with waisted
// (concave) sides, flared ends and slit counters / round-ended notches, a thin black outline, a hard black extrusion
// and a mottled amber / salmon / lime fill.
const dbtGlyph = {
  T: 'M0,16 C22,4 44,8 56,5 C70,8 92,3 112,12 C115,26 114,40 110,54 C102,44 90,40 76,45 C71,76 72,108 80,141 C64,149 44,149 28,141 C37,108 38,76 34,45 C22,40 10,44 2,54 C-2,40 -2,28 0,16 Z',
  H: 'M2,6 C16,2 32,2 44,6 C39,30 39,46 42,58 C52,54 60,54 68,58 C71,46 71,30 66,6 C80,2 96,2 110,6 C99,40 99,110 110,146 C96,150 80,150 66,146 C71,128 71,110 68,94 C60,90 52,90 42,94 C39,110 39,128 44,146 C30,150 14,150 2,146 C13,110 13,40 2,6 Z',
  E: 'M2,6 C40,0 84,2 108,4 C112,18 110,30 106,42 C90,38 72,38 58,42 C44,40 40,58 54,59 C68,57 80,57 92,59 C94,69 94,80 90,90 C78,88 66,88 58,91 C43,91 42,110 56,110 C74,112 92,110 110,106 C113,120 113,132 108,146 C72,152 36,150 2,146 C13,110 13,40 2,6 Z',
  D: 'M2,6 C50,0 100,10 108,56 C114,100 92,140 50,148 C34,150 16,148 2,146 C13,110 13,40 2,6 Z M38,40 C60,44 74,62 72,82 C70,100 58,112 40,114 C45,92 45,62 38,40 Z',
  B: 'M2,6 C50,0 98,4 102,34 C104,52 96,62 86,67 C76,66 74,77 86,77 C106,82 114,98 108,122 C100,148 50,152 2,146 C13,110 13,40 2,6 Z M38,26 C58,26 66,38 62,50 C58,60 48,62 38,60 C42,48 42,38 38,26 Z M38,90 C62,88 76,100 72,113 C68,126 56,130 38,128 C43,114 43,102 38,90 Z',
  U: 'M2,6 C16,2 32,2 46,6 C40,46 44,84 54,110 C64,84 68,46 62,6 C78,2 94,2 108,6 C100,50 106,100 98,124 C88,150 22,150 10,124 C2,100 10,50 2,6 Z',
};
// Letters follow two concentric rainbow arcs ("THE" above "DEBUT"), each tilted to the curve, like the words on the cover.
const dbtAdv = { D: 112, E: 110, B: 108, U: 110, T: 108, H: 110 };
const dbtArc = (word, R, k, tilt) => {
  const total = [...word].reduce((t, l) => t + dbtAdv[l] * k, 0);
  let s = -total / 2;
  return [...word].map((l, i) => {
    s += (dbtAdv[l] * k) / 2;
    const th = s / R;
    s += (dbtAdv[l] * k) / 2;
    const deg = (th * 180) / Math.PI + tilt[i];
    return { l, t: `translate(${(280 + R * Math.sin(th)).toFixed(1)},${(700 - R * Math.cos(th)).toFixed(1)}) rotate(${deg.toFixed(1)}) scale(${k}) translate(-55,-76)` };
  });
};
const dbtLetters = [...dbtArc('THE', 690, 0.6, [-3, 2, -2]), ...dbtArc('DEBUT', 560, 0.94, [-3, 3, -2, 3, -3])];
// A slight hand-inked wobble is baked into the outlines (not a raster filter), so edges stay smooth and antialiased.
const dbtWobble = (d, seed) => { let n = 0; return d.replace(/-?d+(.d+)?/g, (m) => { const r = Math.sin((seed + 1) * 91.7 + (n++) * 12.9898) * 43758.5453; return (+m + ((r - Math.floor(r)) - 0.5) * 2.6).toFixed(1); }); };
const dbtShapes = dbtLetters.map(({ l }, i) => dbtWobble(dbtGlyph[l], i * 7 + 3));
const dbtDepth = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
const DebutTitle = () => (
  <svg className="tz-debut-title" viewBox="-20 -50 600 360" role="img" aria-label="The Debut" shapeRendering="geometricPrecision">
    <defs>
      {dbtLetters.map((_, i) => (
        <filter key={i} id={`tz-dbt-mot${i}`} colorInterpolationFilters="sRGB" x="-12%" y="-12%" width="124%" height="124%">
          <feTurbulence type="fractalNoise" baseFrequency=".02 .024" numOctaves="2" seed={3 + i * 5} />
          <feColorMatrix type="matrix" values="2.4 0 0 0 -.7  2.4 0 0 0 -.7  2.4 0 0 0 -.7  0 0 0 0 1" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues=".72 .98 .96 1 .97 .94 .76" />
            <feFuncG type="table" tableValues=".82 .66 .74 .58 .66 .72 .8" />
            <feFuncB type="table" tableValues=".28 .24 .2 .42 .22 .22 .28" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="1.6" />
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
      ))}
    </defs>
    {dbtLetters.map(({ t }, i) => (
      <g key={i}>
        <g fill="#111" stroke="#111" strokeWidth="8" strokeLinejoin="round" fillRule="evenodd">
          {dbtDepth.map((j) => <path key={j} d={dbtShapes[i]} transform={`translate(${j * 0.9},${j * 1.2}) ${t}`} />)}
          <path d={dbtShapes[i]} transform={t} />
        </g>
        <path d={dbtShapes[i]} transform={t} fillRule="evenodd" fill="#fff" filter={`url(#tz-dbt-mot${i})`} />
      </g>
    ))}
  </svg>
);

const contents = [
  ['field', '12', 'Websites', `${sites.length} specimens, and the gardener who grew them.`, ['Build']],
  ['cover', '06', 'The debut', 'Inside Collection of Sounds, made start to finish at home.', ['Sound', 'Draw']],
  ['intra', '16', 'Intraconnected', 'An idea tracker that grows your thoughts into a tree.', ['Build', 'Draw']],
  ['qa', '24', 'One lane was never enough', 'A short conversation about doing four things.', ['All']],
];

// Phone header's contents menu: [section, page, title]. 'top' is the cover.
const toc = [['top', 'p.01', 'Cover'], ['field', 'p.12', 'Websites'], ['cover', 'p.06', 'The debut'], ['intra', 'p.16', 'Intraconnected'], ['qa', 'p.24', 'Interview'], ['letters', 'p.28', 'Get in touch']];

export const descriptors = {
  intraconnected: 'Ideas, arranged as a tree',
  whosedebut: 'Local records, one a week',
  archivist: 'A machine for collecting words',
  luna: 'Lashes, booked in a tap',
  blm: 'Brand work for small shops',
  stockz: 'Buying ranges from history',
};

// The rack of seed packets, one card per site.
export const SitePackets = ({ items }) => (
  <ul className="tz-packets">
    {items.map((s, i) => (
      <li key={s.id} className="tz-seed" style={{ '--tilt': `${[-1.6, 1.2, -.8, 1.8, -1.2, .9][i % 6]}deg` }}>
        <div className={`tz-seed-win${s.square && !liveUrl(s) ? ' is-square' : ''}`}>{(liveUrl(s) || (s.links[0] || [])[1])
          ? <a className="tz-seed-link" href={liveUrl(s) || s.links[0][1]} target="_blank" rel="noopener noreferrer" aria-label={`Open ${s.title}`}><Live w={s} /></a>
          : <Live w={s} />}</div>
        <p className="tz-seed-no">No. {String(i + 1).padStart(2, '0')}{s.kinds.length > 1 && <span> &middot; also {s.kinds.filter((k) => k !== 'build').join(', ')}</span>}</p>
        <h3>{s.title}</h3>
        <p className="tz-seed-latin">{descriptors[s.id]}</p>
        <p>{s.blurb}</p>
        <p className="tz-seed-meta">Built with {s.stack.join(', ')}</p>
        <div className="tz-row">{s.links.map(([l, h], j) => <a key={l} className={`tz-jelly tz-jelly-s${j ? ' tz-jelly-pale' : ''}`} href={h} target="_blank" rel="noopener noreferrer">{l}</a>)}</div>
      </li>
    ))}
  </ul>
);

export default function Zine() {
  usePage(null, '#F2EFDF');
  useEffect(() => {
    if (!document.getElementById('gh-face')) {
      const s = document.createElement('style');
      s.id = 'gh-face'; s.textContent = FACE; document.head.appendChild(s);
    }
  }, []);
  const secs = useRef({});
  const rootEl = useRef(null);
  useSlamIntro(rootEl, { mast: '.tz-mast', shake: '.tz-cover', reveals: ZINE_REVEALS, typed: '.tz-nav > button, .tz-nav > div > button:not(.tz-nav-home)' });
  const navEl = useRef(null);
  const phone = useMedia(PHONE);
  const tablet = useMedia(TABLET);
  const [menu, setMenu] = useState(false);
  const [atSites, setAtSites] = useState(false);
  const [active, setActive] = useState(null);
  // Tracks the section in view.
  useEffect(() => {
    const root = rootEl.current;
    if (!root) return undefined;
    const fade = () => {
      const f = secs.current.field;
      setAtSites(!!f && root.scrollTop >= f.offsetTop - 120);
      let cur = null;
      ['field', 'cover', 'intra', 'qa', 'letters'].forEach((id) => {
        const el = secs.current[id];
        if (el && root.scrollTop >= el.offsetTop - root.clientHeight * 0.4) cur = id;
      });
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) cur = 'letters';
      setActive(cur);
    };
    fade();
    root.addEventListener('scroll', fade, { passive: true });
    return () => root.removeEventListener('scroll', fade);
  }, []);
  const reg = (id) => (el) => { secs.current[id] = el; };
  const go = (id) => secs.current[id] && secs.current[id].scrollIntoView({ behavior: smooth(), block: 'start' });
  const toTop = () => rootEl.current && rootEl.current.scrollTo({ top: 0, behavior: smooth() });

  // Phone: the contents menu closes on a tap outside the header or on Escape.
  useEffect(() => {
    if (!menu) return undefined;
    const away = (e) => { if (navEl.current && !navEl.current.contains(e.target)) setMenu(false); };
    const esc = (e) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [menu]);
  const jump = (id) => { setMenu(false); if (id === 'top') toTop(); else go(id); };
  const now = toc.find(([id]) => id === (active || 'top'));

  return (
    <div className="tz tz-intro" ref={rootEl}>
      <nav className="tz-nav" aria-label="Contents" ref={navEl}>
        {phone ? (
          <>
            <button type="button" className="tz-nav-mark" aria-label="Hunter Africk, back to the cover" onClick={() => jump('top')}>HA</button>
            {/* running header: the page you're on, opens the contents */}
            <button type="button" className="tz-nav-now" aria-expanded={menu} aria-controls="tz-toc" onClick={() => setMenu((m) => !m)}>
              <span className="tz-vh">Contents, now reading </span><em>{now[1]}</em><b>{now[2]}</b>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" className="tz-jelly tz-jelly-s tz-nav-cta" onClick={() => jump('letters')}>Contact</button>
            {menu && (
              <ul className="tz-toc" id="tz-toc">
                {toc.map(([id, p, t]) => (
                  <li key={id}>
                    <button type="button" aria-current={now[0] === id ? 'true' : undefined} onClick={() => jump(id)}><em>{p}</em><b>{t}</b><span aria-hidden="true">&rarr;</span></button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <button type="button" className="tz-nav-mark" aria-label={tablet ? 'Hunter Africk' : undefined} onClick={() => go('qa')}>{tablet ? 'HA' : 'HUNTER AFRICK'}</button>
            <div>
              {<button type="button" className={`tz-nav-home${atSites ? ' is-on' : ''}`} tabIndex={atSites ? 0 : -1} aria-hidden={!atSites} onClick={toTop}>Home</button>}
              {[['field', 'Websites'], ['cover', 'Album'], ['intra', 'Intraconnected'], ['qa', 'Interview']].map(([id, l]) => (
                <button key={id} type="button" aria-current={active === id ? 'true' : undefined} onClick={() => go(id)}>{l}</button>
              ))}
              <button type="button" className="tz-jelly tz-jelly-s tz-nav-cta" aria-current={active === 'letters' ? 'true' : undefined} onClick={() => go('letters')}>Contact</button>
            </div>
          </>
        )}
      </nav>

      {/* COVER */}
      <header className="tz-cover">
        <p className="tz-strip"><span>Developer &middot; Musician &middot; Writer &middot; Illustrator</span><span>{bio.where}</span><span>Open to commissions</span></p>
        <h1 className="tz-mast" aria-label="Hunter">{[...'HUNTER'].map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</h1>
        <figure className="tz-cover-photo">
          <img src={candid} alt="Hunter, looking up at the camera, holding a glowing green alien balloon" fetchPriority="high" decoding="async" />
          {[1, 2, 3, 4, 5].map((n) => <i key={n} className={`tz-fly tz-fly-${n}`} aria-hidden="true" />)}
        </figure>
        <ul className="tz-lines">
          {contents.map(([id, page, title, dek]) => (
            <li key={id} className={`tz-line tz-line-${id}`}>
              <button type="button" onClick={() => go(id)}>
                <i className="tz-line-ico" aria-hidden="true"><Glyph k={{ field: 'build', cover: 'sound', intra: 'build', qa: 'draw' }[id]} /></i>
                <b>{title}</b><span>{dek}</span><em>p.{page}</em>
                <u className="tz-line-go" aria-hidden="true">&rarr;</u>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="tz-burst" onClick={() => go('field')}><b>See the work</b>scroll down</button>
      </header>

      {/* FEATURE: FIELD GUIDE */}
      <section className="tz-page tz-field" ref={reg('field')}>
        {/* A browser window with a seedling growing out of it: a website, collected as a specimen. */}
        <svg className="tz-sprout" viewBox="0 0 220 260" aria-hidden="true">
          <rect className="tz-sprout-win" x="16" y="104" width="188" height="134" rx="12" />
          <path className="tz-sprout-rule" d="M16 130H204" />
          <circle className="tz-sprout-dot" cx="32" cy="117" r="5" />
          <circle className="tz-sprout-dot is-pink" cx="47" cy="117" r="5" />
          <circle className="tz-sprout-dot is-sea" cx="62" cy="117" r="5" />
          <rect className="tz-sprout-url" x="78" y="111" width="112" height="12" rx="6" />
          <path className="tz-sprout-text" d="M32 152H72M32 164H62M150 152H188M158 164H188" />
          <path className="tz-sprout-soil" d="M56 238C76 210 146 210 166 238Z" />
          <path className="tz-sprout-stem" d="M111 218C107 170 118 110 104 44" />
          {[[110, 190, -1], [112, 156, 1], [111, 118, -1], [108, 82, 1]].map(([x, y, s], i) => (
            <path key={i} transform={`translate(${x} ${y}) scale(${s * (0.62 - i * 0.07)} ${0.62 - i * 0.07})`} d="M0 0C34-6 70-26 84-62C46-60 10-36 0 0Z" />
          ))}
          <circle className="tz-sprout-bud" cx="104" cy="38" r="8" />
          <path className="tz-sprout-cursor" d="M140 44L140 74L148 66L154 79L160 76L154 63L165 63Z" />
        </svg>
        <header className="tz-field-head">
          <p className="tz-kicker">p.12 &middot; Build</p>
          <h2>Websites</h2>
          <p className="tz-stand">{sites.length} specimens, collected over a few seasons. Each one was designed and built by hand, and a few of them grew into other habitats along the way.</p>
          <p className="tz-swipe" aria-hidden="true">Swipe through all {sites.length} &rarr;</p>
        </header>
        <SitePackets items={sites} />
      </section>

      {/* FEATURE: THE DEBUT */}
      <section className="tz-page tz-spread" ref={reg('cover')}>
        <DebutTitle />
        <figure className="tz-album">
          <i className="tz-vinyl" aria-hidden="true" />
          <img src={album.image} alt="Collection of Sounds album cover, drawn by Hunter" loading="lazy" decoding="async" />
        </figure>
        <article className="tz-feature">
          <p className="tz-kicker">p.06 &middot; The debut</p>
          <h2>Everything by <i>one</i> pair of hands</h2>
          <p className="tz-stand">{album.blurb}</p>
          <div className="tz-cols">
            <p className="tz-drop">{album.long}</p>
            <p>It is a conscious, alternative hip hop record, released in October {album.year}, and it doubles as a résumé: songwriting, production, engineering and illustration on a single sleeve.</p>
          </div>
          <blockquote className="tz-pull">&ldquo;Produced, written, recorded, mixed, and mastered by me. The album art is also by me.&rdquo;</blockquote>
          <div className="tz-row">{album.links.map(([l, h], i) => <a key={l} className={`tz-jelly tz-jelly-ico${i ? ' tz-jelly-pale' : ''}`} href={h} target="_blank" rel="noopener noreferrer">{svc[l]}{l}</a>)}</div>
        </article>
      </section>

      {/* FEATURE: INTRACONNECTED */}
      <div className="tz-ic-bg">
      <section className="tz-page tz-intra" ref={reg('intra')}>
        <header className="tz-intra-head">
          <p className="tz-kicker">p.16 &middot; Spotlight</p>
          <h2>{intra.title}</h2>
          <p className="tz-stand">{intra.blurb}</p>
        </header>

        <div className="tz-intra-stage">
          <figure className="tz-intra-shot">
            <div className="tz-intra-bar" aria-hidden="true"><i /><i /><i /><span>intraconnected.app</span></div>
            <Live w={intra} H={720} interactive />
          </figure>
        <aside className="tz-intra-side">
          <div>
            <p className="tz-drop tz-ic-box">{intra.long}</p>
            <div className="tz-row tz-ic-row">{intra.links.map(([l, h], i) => <a key={l} className={`tz-nb ${i ? 'tz-nb-link' : 'tz-nb-confirm'}`} href={h} target="_blank" rel="noopener noreferrer">{icIcons[l]}{l}</a>)}</div>
          </div>
          <dl className="tz-packet">
            <dt>The specs</dt>
            <div><dd>Role</dd><dd>Full Stack, Product Design, UI/UX</dd></div>
            <div><dd>Made with</dd><dd>{intra.stack.join(', ')}</dd></div>
          </dl>
        </aside>
          <ol className="tz-intra-nodes">
            {branches.map(([t, d], i) => (
              <li key={t}><span className="tz-intra-n">{i + 1}</span><b>{t}</b><small>{d}</small></li>
            ))}
          </ol>
        </div>
      </section>
      </div>

      {/* FEATURE: Q&A */}
      <section className="tz-page tz-qa" ref={reg('qa')}>
        <figure className="tz-qa-photo">
          <img src={portrait} alt="Hunter grinning in the driver's seat" loading="lazy" decoding="async" />
        </figure>
        <article>
          <p className="tz-kicker">p.24 &middot; The interview</p>
          <h2>One lane was <em>never</em> enough</h2>
          <dl className="tz-dialogue">
            <dt>You make music, websites, stories and drawings. Which one are you?</dt>
            <dd>I&rsquo;m just Hunter. That comes through in whatever I work on. I follow my creativity and don&rsquo;t worry about putting a label on myself. I think that dipping my toes into one medium allows me to create unique ideas in another.</dd>
            <dt>What are your qualifications?</dt>
            <dd>I have my Bachelors in Computer Science &amp; Engineering from UNR. Though I think the passion speaks for itself. I could do it with or without the degree.</dd>
            <dt>And when you&rsquo;re not creating?</dt>
            <dd>I'm listening to music, playing Wii, chilling at Rancho San Rafael [the park], or hanging out with my girlfriend. Mostly gathering things to make next.</dd>
          </dl>
        </article>
      </section>

      {/* BACK COVER */}
      <ContactBlock innerRef={reg('letters')} />

      <ZineFooter
        onTop={toTop}
        nav={[['Websites', () => go('field')], ['Album', () => go('cover')], ['Intraconnected', () => go('intra')], ['Interview', () => go('qa')], ['Contact', () => go('letters')]]}
      />
    </div>
  );
}
