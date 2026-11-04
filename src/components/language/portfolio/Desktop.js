import React, { useEffect, useRef, useState } from 'react';
import { work, links, portrait } from '../../portfolio/data';
import { Glyph, usePage } from '../../portfolio/kit';
import '../../../styles/language/portfolio/desktop.scss';

// Windowsill portfolio: a desktop you're welcome to poke around. Each medium opens in the app it belongs in.
const FONTS = 'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=DM+Mono:wght@500&family=Figtree:wght@500;600;800&display=swap';
const album = work.find((w) => w.id === 'cos');
const sites = work.filter((w) => w.kinds.includes('build'));

const apps = [
  { id: 'welcome', title: 'Welcome.exe', label: 'Welcome', glyph: 'sun', w: 560 },
  { id: 'sites', title: 'C:\\Hunter\\Websites', label: 'Websites', glyph: 'build', w: 820 },
  { id: 'music', title: 'Collection of Sounds', label: 'Music', glyph: 'sound', w: 640 },
  { id: 'notes', title: 'SYNTHETIC.txt - Notepad', label: 'SYNTHETIC.txt', glyph: 'write', w: 540 },
  { id: 'sketch', title: 'Sketchpad', label: 'Sketchpad', glyph: 'draw', w: 600 },
  { id: 'mail', title: 'Say hello', label: 'Mail', glyph: 'mail', w: 440 },
];
const appOf = (id) => apps.find((a) => a.id === id);

const extra = {
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  mail: 'M3 6h18v12H3ZM3 7l9 6 9-6',
};
const Icon = ({ g }) => (extra[g]
  ? <svg className="pf-glyph" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={extra[g]} /></svg>
  : <Glyph k={g} />);

const Win = ({ app, st, top, onFocus, onClose, onMin, onDrag, children }) => {
  const drag = useRef(null);
  const down = (e) => {
    if (e.button !== 0 || e.target.closest('button') || window.innerWidth < 760) return;
    drag.current = { dx: e.clientX - st.x, dy: e.clientY - st.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => { if (drag.current) onDrag(e.clientX - drag.current.dx, e.clientY - drag.current.dy); };
  const up = () => { drag.current = null; };
  return (
    <section className={`wd-win wd-win-${app.id}${top ? ' is-top' : ''}`} style={{ left: st.x, top: st.y, zIndex: st.z, width: app.w }} onPointerDown={onFocus} role="dialog" aria-label={app.label}>
      <header className="wd-bar" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <span className="wd-bar-ico"><Icon g={app.glyph} /></span>
        <b>{app.title}</b>
        <button type="button" className="wd-ctl" aria-label="Minimise" onClick={onMin}>_</button>
        <button type="button" className="wd-ctl wd-ctl-x" aria-label="Close" onClick={onClose}>&times;</button>
      </header>
      <div className="wd-body">{children}</div>
    </section>
  );
};

const Sketch = ({ onOpenMusic }) => {
  const ref = useRef(null);
  const last = useRef(null);
  const [ink, setInk] = useState('#16324A');
  const pt = (e) => { const r = ref.current.getBoundingClientRect(); return [(e.clientX - r.left) * (ref.current.width / r.width), (e.clientY - r.top) * (ref.current.height / r.height)]; };
  const down = (e) => { ref.current.setPointerCapture(e.pointerId); last.current = pt(e); };
  const move = (e) => {
    if (!last.current) return;
    const c = ref.current.getContext('2d');
    const p = pt(e);
    c.strokeStyle = ink; c.lineWidth = ink === '#FFFFFF' ? 22 : 5; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(...last.current); c.lineTo(...p); c.stroke();
    last.current = p;
  };
  const clear = () => { const c = ref.current.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, ref.current.width, ref.current.height); };
  useEffect(clear, []);
  return (
    <div className="wd-sketch">
      <div className="wd-tools">
        {['#16324A', '#FF5A4A', '#2FBF7A', '#3B6FE0', '#FFE27A'].map((c) => (
          <button key={c} type="button" className={`wd-swatch${ink === c ? ' is-on' : ''}`} style={{ background: c }} aria-label={`Ink ${c}`} onClick={() => setInk(c)} />
        ))}
        <button type="button" className={`wd-pill${ink === '#FFFFFF' ? ' is-on' : ''}`} onClick={() => setInk('#FFFFFF')}>Eraser</button>
        <button type="button" className="wd-pill" onClick={clear}>Clear</button>
      </div>
      <canvas ref={ref} width="1040" height="560" onPointerDown={down} onPointerMove={move} onPointerUp={() => { last.current = null; }} aria-label="Drawing canvas: draw something" />
      <div className="wd-sketch-foot">
        <button type="button" className="wd-thumb" onClick={onOpenMusic}><img src={album.image} alt="" />Album cover, drawn by me</button>
        <p className="wd-sys">Your turn. Draw me something; I can&rsquo;t see it, but it counts.</p>
      </div>
    </div>
  );
};

export default function Desktop() {
  usePage(FONTS, '#F6F8F2');
  const zTop = useRef(2);
  const [wins, setWins] = useState({});
  const [pick, setPick] = useState(sites[0].id);
  const [spin, setSpin] = useState(false);
  const [start, setStart] = useState(false);
  const [clock, setClock] = useState('');
  const [selIcon, setSelIcon] = useState(null);

  const open = (id) => {
    setStart(false);
    setWins((w) => {
      const i = apps.findIndex((a) => a.id === id);
      const vw = typeof window === 'undefined' ? 1200 : window.innerWidth;
      const vh = typeof window === 'undefined' ? 800 : window.innerHeight;
      const app = appOf(id);
      const prev = w[id];
      const x = prev ? prev.x : Math.max(12, Math.min(vw - app.w - 24, 150 + i * 46 + (id === 'welcome' ? (vw - app.w) / 2 - 150 : 0)));
      const y = prev ? prev.y : Math.max(56, Math.min(vh - 460, 70 + i * 30));
      zTop.current += 1;
      return { ...w, [id]: { x, y, z: zTop.current, min: false } };
    });
  };
  const focus = (id) => setWins((w) => {
    if (!w[id] || w[id].z === zTop.current) return w;
    zTop.current += 1;
    return { ...w, [id]: { ...w[id], z: zTop.current } };
  });
  const close = (id) => setWins((w) => { const n = { ...w }; delete n[id]; return n; });
  const min = (id) => setWins((w) => ({ ...w, [id]: { ...w[id], min: true } }));
  const drag = (id) => (x, y) => setWins((w) => ({ ...w, [id]: { ...w[id], x: Math.max(-200, x), y: Math.max(44, y) } }));
  const openSite = (id) => { setPick(id); open('sites'); };

  useEffect(() => {
    open('welcome');
    const tick = () => setClock(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    tick();
    const t = setInterval(tick, 15000);
    return () => clearInterval(t);
  }, []);

  const openIds = Object.keys(wins);
  const topId = openIds.filter((id) => !wins[id].min).sort((a, b) => wins[b].z - wins[a].z)[0];
  const site = work.find((w) => w.id === pick);

  const body = {
    welcome: (
      <div className="wd-welcome">
        <div className="wd-photo"><img src={portrait} alt="Hunter, grinning in the driver's seat" /></div>
        <div>
          <h1 className="wd-sticker">Hi, I&rsquo;m Hunter!</h1>
          <p>I make <b>websites</b>, <b>music</b>, <b>stories</b> and <b>drawings</b>, usually more than one at a time. This desktop is my studio. Open whatever looks fun.</p>
        </div>
        <div className="wd-doors">
          <button type="button" className="wd-gel wd-gel-blue" onClick={() => open('sites')}><Glyph k="build" />Websites</button>
          <button type="button" className="wd-gel wd-gel-red" onClick={() => open('music')}><Glyph k="sound" />Music</button>
          <button type="button" className="wd-gel wd-gel-green" onClick={() => open('notes')}><Glyph k="write" />Writing</button>
          <button type="button" className="wd-gel wd-gel-yellow" onClick={() => open('sketch')}><Glyph k="draw" />Drawing</button>
        </div>
        <p className="wd-sys wd-tip">Tip: drag windows by their title bar. Nothing in here keeps score.</p>
      </div>
    ),
    sites: (
      <div className="wd-explorer">
        <div className="wd-addr"><span className="wd-sys">Address</span><code>C:\Hunter\Websites\{site.title}</code><span className="wd-sys">{sites.length} items</span></div>
        <div className="wd-files" role="listbox" aria-label="Websites">
          {sites.map((s) => (
            <button key={s.id} type="button" role="option" aria-selected={pick === s.id} className="wd-file" onClick={() => setPick(s.id)}>
              <span className="wd-file-img"><img src={s.tile} alt="" /></span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
        <article className="wd-preview" key={site.id}>
          <div className={`wd-shot${site.square ? ' is-square' : ''}`}><img src={site.image} alt={`${site.title} preview`} /></div>
          <p className="wd-sys">{site.kind}{site.kinds.length > 1 ? ` · also ${site.kinds.filter((k) => k !== 'build').join(', ')}` : ''}</p>
          <h2>{site.title}</h2>
          <p>{site.blurb}</p>
          <ul className="wd-chips">{site.stack.map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="wd-row">{site.links.map(([l, h], i) => <a key={l} className={`wd-gel ${i ? 'wd-gel-white' : 'wd-gel-green'}`} href={h} target="_blank" rel="noopener noreferrer">{l}</a>)}</div>
        </article>
      </div>
    ),
    music: (
      <div className={`wd-player${spin ? ' is-spin' : ''}`}>
        <div className="wd-deck">
          <i className="wd-disc" aria-hidden="true" />
          <img className="wd-cover" src={album.image} alt="Collection of Sounds cover art" />
        </div>
        <div className="wd-player-info">
          <p className="wd-sys">Debut album · {album.year}</p>
          <h2 className="wd-sticker wd-sticker-s">Collection of Sounds</h2>
          <p>{album.blurb}</p>
          <dl className="wd-credits">{album.credits.map(([r]) => <div key={r}><dt>{r}</dt><dd>me</dd></div>)}</dl>
          <div className="wd-row">
            <button type="button" className="wd-gel wd-gel-white" aria-pressed={spin} onClick={() => setSpin(!spin)}>{spin ? 'Stop the disc' : 'Spin the disc'}</button>
            {album.links.map(([l, h], i) => <a key={l} className={`wd-gel ${i ? 'wd-gel-white' : 'wd-gel-red'}`} href={h} target="_blank" rel="noopener noreferrer">{l}</a>)}
          </div>
        </div>
      </div>
    ),
    notes: (
      <div className="wd-notepad">
        <nav className="wd-menu" aria-label="Notepad menu"><span>File</span><span>Edit</span><span>Format</span><span>Help</span></nav>
        <div className="wd-paper" tabIndex="0">
          <p className="wd-paper-t">SYNTHETIC</p>
          <p>a novel by Hunter Africk</p>
          <p>&nbsp;</p>
          <p>[Placeholder: the first paragraph goes here, so a reader gets the opening page the moment they open the file.]</p>
          <p>&nbsp;</p>
          <p>status: being written, one chapter at a time.</p>
          <p>&nbsp;</p>
          <p>see also: a website that collects words &rarr; <button type="button" className="wd-link" onClick={() => openSite('archivist')}>Archivist</button></p>
          <p>see also: lyrics &rarr; <button type="button" className="wd-link" onClick={() => open('music')}>Collection of Sounds</button></p>
        </div>
        <p className="wd-status wd-sys">Ln 1, Col 1 &nbsp;|&nbsp; UTF-8 &nbsp;|&nbsp; words, still growing</p>
      </div>
    ),
    sketch: <Sketch onOpenMusic={() => open('music')} />,
    mail: (
      <div className="wd-mail">
        <p className="wd-field"><span className="wd-sys">To</span>Hunter Africk</p>
        <p className="wd-field"><span className="wd-sys">From</span>you</p>
        <p className="wd-field"><span className="wd-sys">Subject</span>Let&rsquo;s make something</p>
        <p className="wd-mail-body">Websites, songs, stories, drawings, or a thing that is two of those at once. I&rsquo;m always happy to talk.</p>
        <div className="wd-row">{links.map((l, i) => <a key={l.name} className={`wd-gel ${i ? 'wd-gel-white' : 'wd-gel-green'}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>)}</div>
      </div>
    ),
  };

  return (
    <div className="wd" onPointerDown={(e) => { if (e.target === e.currentTarget || e.target.classList.contains('wd-desk')) { setSelIcon(null); setStart(false); } }}>
      <div className="wd-wall" aria-hidden="true"><span>hello!</span></div>

      <header className="wd-top">
        <button type="button" className="wd-orb" aria-expanded={start} onClick={() => setStart(!start)}>HA</button>
        <div className="wd-tasks">
          {openIds.map((id) => (
            <button key={id} type="button" className={`wd-task${id === topId ? ' is-on' : ''}`} onClick={() => (id === topId ? min(id) : open(id))}>
              <Icon g={appOf(id).glyph} /><span>{appOf(id).label}</span>
            </button>
          ))}
        </div>
        <div className="wd-tray wd-sys"><span>Reno, NV</span><b>{clock}</b></div>
      </header>

      {start && (
        <nav className="wd-start" aria-label="Start">
          <p className="wd-start-head"><img src={portrait} alt="" /><span><b>Hunter Africk</b><small>multidisciplinary, on purpose</small></span></p>
          {apps.map((a) => <button key={a.id} type="button" onClick={() => open(a.id)}><Icon g={a.glyph} />{a.label}</button>)}
        </nav>
      )}

      <div className="wd-desk">
        <ul className="wd-icons">
          {apps.map((a) => (
            <li key={a.id}>
              <button type="button" className={`wd-icon wd-icon-${a.id}${selIcon === a.id ? ' is-sel' : ''}`} onClick={() => { setSelIcon(a.id); open(a.id); }}>
                <span className="wd-icon-face">{a.id === 'music' ? <img src={album.image} alt="" /> : <Icon g={a.glyph} />}</span>
                <span className="wd-icon-label">{a.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {openIds.map((id) => (!wins[id].min && (
          <Win key={id} app={appOf(id)} st={wins[id]} top={id === topId} onFocus={() => focus(id)} onClose={() => close(id)} onMin={() => min(id)} onDrag={drag(id)}>
            {body[id]}
          </Win>
        )))}
      </div>
    </div>
  );
}
