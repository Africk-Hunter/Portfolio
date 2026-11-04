import React, { useEffect, useMemo, useRef, useState } from 'react';
import { copyText, downloadFile, contrast, loadFonts } from '../../shared';
import { tokens, cssVarMap, cssText, tokensStudio, shadowOf, textPairs } from './tokens';
import { parts, recipes } from './parts';
import '../../../../styles/language/iterations/h.scss';

export const meta = {
  id: 'h',
  name: 'Overgrowth',
  tagline: 'A sci-fi field console the jungle took back. Cut corners, leaf veins, fruit for lamps.',
};

export const fontsHref =
  'https://fonts.googleapis.com/css2?family=Michroma&family=Barlow:wght@400;500;600&family=Azeret+Mono:wght@400;500&display=swap';

// Microgramma D Extended Bold is a commercial font, so it is not bundled. Drop the file in static/fonts/
// (MicrogrammaDExtended-Bold.ttf, .otf or .woff2) and it is picked up here. Until then Michroma stands in.
const fontFace = `@font-face{font-family:'Microgramma D Extended';font-weight:700;font-display:swap;src:local('Microgramma D Extended Bold'),local('MicrogrammaDExtended-Bold'),url('/fonts/MicrogrammaDExtended-Bold.woff2') format('woff2'),url('/fonts/MicrogrammaDExtended-Bold.otf') format('opentype'),url('/fonts/MicrogrammaDExtended-Bold.ttf') format('truetype');}`;

const principles = [
  ['Built, then reclaimed', 'Hard engineering with something growing through it. Corners are cut at 45 degrees, edges are one lime line, and veins cross the joins.'],
  ['Light comes from fruit', 'The floor is dark. The only lights are lamps shaped like fruit: ember and amber, lit when ready, dim when resting.'],
  ['Veins carry signal', 'Every divider is a leaf vein. Anything that connects or progresses runs along one, and the vine on the left grows as you read.'],
  ['Wide letters, wide gaps', 'Microgramma Extended is for titles and labels only: caps, tracked, never more than five words. Everything you read is in Barlow.'],
  ['Everything is a specimen', 'Panels are catalogued, not decorated: numbered, labelled, quiet. Calm like a field station at night, never a game HUD.'],
];

const voice = [
  ['Specimen logged.', 'Success! Item added!'],
  ['Nothing here yet. Plant something.', 'No results found.'],
  ['Signal lost. Try again.', 'Error 500: request failed.'],
  ['Press to grow.', 'Click here to continue.'],
];

const motions = [['grow', 'Progress'], ['sweep', 'Ambient'], ['pulse', 'Idle']];

const nav = [
  ['principles', 'Principles'], ['colour', 'Colour'], ['type', 'Type'], ['shape', 'Shape and light'],
  ['motion', 'Motion'], ['parts', 'Parts'], ['recipes', 'Recipes'], ['voice', 'Voice'], ['export', 'Export'],
];

const ratingOf = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Large only' : 'Fail');
const col = (k) => tokens.color[k].value;

// A frond drawn by code: a drooping stem with leaflet pairs that shrink toward the tip.
const Frond = ({ className }) => {
  const leaflets = useMemo(() => {
    const out = [];
    for (let i = 0; i < 13; i += 1) {
      const t = i / 12;
      const x = 30 + i * 38;
      const y = (x / 520) ** 2 * 60;
      const tan = (Math.atan((2 * x / 520 ** 2) * 60) * 180) / Math.PI;
      const len = 150 * (1 - t * 0.72) + 18;
      out.push({ x, y, len, w: len * 0.2, a: tan });
    }
    return out;
  }, []);
  return (
    <svg className={className} viewBox="-20 -190 620 400" aria-hidden="true">
      {leaflets.flatMap((l, i) => [-1, 1].map((s) => (
        <path key={`${i}${s}`} transform={`translate(${l.x} ${l.y}) rotate(${l.a + s * 62})`} d={`M0 0Q${l.len * 0.45} ${-l.w} ${l.len} 0Q${l.len * 0.45} ${l.w} 0 0Z`} fill="#214030" stroke="#2C5139" strokeWidth="1.5" />
      )))}
      <path d="M0 0Q260 -10 560 70" stroke="#2C5139" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

// A thin vine path, wobbling gently down the rail. Its drawn length follows the scroll position.
const vinePath = (() => {
  let d = 'M30 0';
  for (let k = 0; k < 10; k += 1) d += ` S${k % 2 ? 46 : 14} ${k * 60 + 30} 30 ${(k + 1) * 60}`;
  return d;
})();

const Part = ({ p, onCopy }) => (
  <figure className="h-part">
    <div className="h-part-stage" dangerouslySetInnerHTML={{ __html: p.svg }} />
    <figcaption>
      <b>{p.name}</b>
      <span>{p.note}</span>
      <button type="button" className="h-btn h-btn-small" onClick={() => onCopy(p.svg, `${p.name} copied. Paste into Figma.`)}>Copy for Figma</button>
    </figcaption>
  </figure>
);

const Block = ({ id, n, title, setRef, children }) => (
  <section className="h-block" id={`h-${id}`} ref={(el) => setRef(id, el)}>
    <i className="h-vein" aria-hidden="true" />
    <p className="h-spec">SPEC {String(n).padStart(2, '0')}</p>
    <h2>{title}</h2>
    {children}
  </section>
);

export default function Overgrowth() {
  const [toast, setToast] = useState('');
  const [pings, setPings] = useState([]);
  const [current, setCurrent] = useState('principles');
  const [prog, setProg] = useState(0);
  const timer = useRef(null);
  const rootRef = useRef(null);
  const radarRef = useRef(null);
  const secs = useRef({});

  useEffect(() => {
    loadFonts(fontsHref);
    if (!document.getElementById('h-fontface')) {
      const s = document.createElement('style');
      s.id = 'h-fontface';
      s.textContent = fontFace;
      document.head.appendChild(s);
    }
    // The page itself is transparent so the site background shows through. This is the floor colour
    // behind it, until a Page color is chosen in the Background editor (which paints <html> instead).
    const prev = document.body.style.background;
    document.body.style.background = tokens.color.floor.value;
    return () => { clearTimeout(timer.current); document.body.style.background = prev; };
  }, []);

  const say = (m) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 1800);
  };
  const copy = async (text, msg) => say((await copyText(text)) ? msg : 'Clipboard said no. Try again?');
  const setRef = (id, el) => { secs.current[id] = el; };
  const go = (id) => secs.current[id] && secs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });

  const onScroll = () => {
    const el = rootRef.current;
    const max = el.scrollHeight - el.clientHeight;
    setProg(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    const top = el.getBoundingClientRect().top + 220;
    let hit = nav[0][0];
    nav.forEach(([id]) => {
      const s = secs.current[id];
      if (s && s.getBoundingClientRect().top <= top) hit = id;
    });
    setCurrent(hit);
  };

  const log = (e) => {
    const b = radarRef.current.getBoundingClientRect();
    const x = ((e.clientX - b.left) / b.width) * 100;
    const y = ((e.clientY - b.top) / b.height) * 100;
    if ((x - 50) ** 2 + (y - 50) ** 2 > 2500) return;
    const id = Date.now() + Math.random();
    setPings((p) => [...p.slice(-8), { id, x, y }]);
  };

  const status = pings.length === 0 ? 'SCANNING. TAP THE CANOPY TO LOG A SPECIMEN.' : `${String(pings.length).padStart(2, '0')} SPECIMENS LOGGED`;

  return (
    <div className="h-root" style={cssVarMap()} ref={rootRef} onScroll={onScroll}>
      <nav className="h-rail" aria-label="Sections">
        <svg className="h-vine" viewBox="0 0 60 600" preserveAspectRatio="none" aria-hidden="true">
          <path d={vinePath} className="h-vine-ghost" pathLength="1" />
          <path d={vinePath} className="h-vine-live" pathLength="1" style={{ strokeDashoffset: 1 - prog }} />
        </svg>
        {nav.map(([id, label], i) => {
          const at = i / (nav.length - 1);
          const lit = prog + 0.02 >= at || id === current;
          return (
            <button key={id} type="button" className={`h-node${lit ? ' is-lit' : ''}${id === current ? ' is-current' : ''}`} style={{ top: `${at * 100}%` }} onClick={() => go(id)} aria-label={label}>
              <i /><span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="h-page">
        <header className="h-hero">
          <Frond className="h-frond h-frond-a" />
          <Frond className="h-frond h-frond-b" />
          <p className="h-label h-hero-tag">FIELD UNIT 09 / DESIGN LANGUAGE / ITERATION H</p>

          <div className="h-radar" ref={radarRef} onClick={log} role="presentation">
            <i className="h-ticks" />
            <i className="h-sweep" />
            {pings.map((p, i) => (
              <button key={p.id} type="button" className="h-ping" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-label={`Specimen ${i + 1}, remove`}
                onClick={(e) => { e.stopPropagation(); setPings((q) => q.filter((z) => z.id !== p.id)); }}>
                <b>{String(i + 1).padStart(2, '0')}</b>
              </button>
            ))}
          </div>

          <div className="h-hero-copy">
            <h1>Over<br />growth</h1>
            <i className="h-vein h-vein-ember" aria-hidden="true" />
            <p className="h-lede">A field console the jungle took back. Cut steel, leaf veins and fruit for lamps. Quiet, warm and a little overgrown.</p>
            <p className="h-readout" role="status">{status}</p>
            {pings.length > 0 && <button type="button" className="h-btn h-btn-small" onClick={() => { setPings([]); say('Canopy cleared.'); }}>Clear canopy</button>}
          </div>
        </header>

        <Block id="principles" n={1} title="Principles" setRef={setRef}>
          <ol className="h-prin">
            {principles.map(([h, b]) => <li key={h}><h3>{h}</h3><p>{b}</p></li>)}
          </ol>
        </Block>

        <Block id="colour" n={2} title="Colour" setRef={setRef}>
          <p className="h-sub">Taken from the Truchet theme: a deep green floor, cream ink and one hot orange. Lime is signal, amber is press, ember is the single loud thing.</p>
          <div className="h-tokens">
            {Object.entries(tokens.color).map(([k, v]) => (
              <button type="button" className="h-tok h-cut" key={k} onClick={() => copy(v.value, `${k} copied`)}>
                <i style={{ background: v.value }} />
                <b>{k}</b><code>{v.value}</code><small>{v.role}</small>
              </button>
            ))}
          </div>
          <h3 className="h-h3">Text pairs (WCAG)</h3>
          <ul className="h-pairs">
            {textPairs.map(([a, b, label]) => {
              const r = contrast(col(a), col(b));
              return (
                <li key={a + b}>
                  <span className="h-pair" style={{ color: col(a), background: col(b) }}>Aa</span>
                  <span>{label}<small>{a} on {b}</small></span>
                  <code>{r.toFixed(2)}</code>
                  <em className={`h-rate h-rate-${ratingOf(r).split(' ')[0]}`}>{ratingOf(r)}</em>
                </li>
              );
            })}
          </ul>
          <p className="h-note">Ember and ink is large-only: use it for lamps and big labels, never for body copy.</p>
        </Block>

        <Block id="type" n={3} title="Type" setRef={setRef}>
          <div className="h-faces">
            {Object.entries(tokens.font).map(([k, v]) => (
              <div key={k} className={`h-face h-face-${k}`}><small>{k}</small><b>{v.value}</b><span>{v.role}</span></div>
            ))}
          </div>
          <div className="h-scale">
            <p className="h-s-display"><small>Display 88/0.95, tracked 6%</small><span>Hello</span></p>
            <p className="h-s-h2"><small>Heading 34/1.1</small>Canopy scan</p>
            <p className="h-s-body"><small>Body 17/1.6</small>Take your time. What the scanner finds will be here when you come back, a little greener.</p>
            <p className="h-s-mono"><small>Readout 13, mono</small>LAT 04.221 / LON -61.402 / 03 LOGGED</p>
          </div>
          <p className="h-note">The display face is a commercial font. Place MicrogrammaDExtended-Bold in static/fonts/ and it loads automatically; until then Michroma, a close free cousin, stands in.</p>
        </Block>

        <Block id="shape" n={4} title="Shape and light" setRef={setRef}>
          <p className="h-sub">Two opposite corners are cut at 45 degrees and everything else is square. Panels step up in tone, not in shadow: clipped shapes cannot cast one. Lamps are the only thing that glows.</p>
          <div className="h-shapes">
            {Object.entries(tokens.cut).map(([k, v]) => (
              <div key={k} className="h-shape"><i className="h-cut" style={{ '--cut': v.value }} /><b>cut-{k}</b><small>{v.role}</small><code>{v.value}</code></div>
            ))}
          </div>
          <div className="h-mats">
            {Object.keys(tokens.shadow).map((k) => (
              <div key={k} className="h-mat">
                <span className={`h-mat-obj h-mat-${k}`} style={{ boxShadow: shadowOf(k) }} />
                <b>{k}</b><small>{tokens.shadow[k].role}</small>
              </div>
            ))}
          </div>
        </Block>

        <Block id="motion" n={5} title="Motion" setRef={setRef}>
          <p className="h-sub">Mechanical in, organic out: things arrive fast and settle slowly, with no bounce. Reduced-motion stops the sweep, the pulse and the background.</p>
          <div className="h-motions">
            {motions.map(([k, role]) => (
              <div key={k} className="h-motion">
                <span className={`h-m-obj h-m-${k}`} />
                <b>{k}</b><small>{role}</small><code>{tokens.motion[k].value}</code>
              </div>
            ))}
          </div>
        </Block>

        <Block id="parts" n={6} title="Parts (copy for Figma)" setRef={setRef}>
          <div className="h-parts">{parts.map((p) => <Part key={p.id} p={p} onCopy={copy} />)}</div>
          <p className="h-note">Click Copy for Figma, then paste into a Figma file. Layers are named (Body, Plate, Midrib, Halo) and there are no filters or masks.</p>
        </Block>

        <Block id="recipes" n={7} title="Figma recipes" setRef={setRef}>
          <p className="h-sub">For what vectors cannot carry: blur, glow, the radar and the canopy light.</p>
          <dl className="h-recipes">
            {recipes.map((r) => <div key={r.n}><dt>{r.n}</dt><dd>{r.t}</dd></div>)}
          </dl>
        </Block>

        <Block id="voice" n={8} title="Voice" setRef={setRef}>
          <p className="h-sub">A field log: short, precise, a little dry. Lowercase verbs, no exclamation marks, never a siren.</p>
          <div className="h-voice">
            {voice.map(([d, x]) => (
              <div key={d}>
                <p className="h-do"><b>DO</b>{d}</p>
                <p className="h-dont"><b>DON&rsquo;T</b>{x}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block id="export" n={9} title="Export" setRef={setRef}>
          <p className="h-sub">Both outputs come from one tokens object. Import the JSON through Tokens Studio, then apply the set in Figma.</p>
          <div className="h-actions">
            <button type="button" className="h-btn" onClick={() => { downloadFile('overgrowth.tokens.json', JSON.stringify(tokensStudio(), null, 2)); say('Tokens are on their way down.'); }}>Download Tokens Studio JSON</button>
            <button type="button" className="h-btn" onClick={() => copy(cssText(), 'CSS variables copied')}>Copy CSS variables</button>
          </div>
          <pre className="h-code h-cut">{cssText().split('\n').slice(0, 9).join('\n')}{'\n  ...'}</pre>
        </Block>
        <div className="h-spare" />
      </div>
      <div className={`h-toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
