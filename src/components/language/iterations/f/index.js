import React, { useEffect, useRef, useState } from 'react';
import { copyText, downloadFile, contrast, loadFonts } from '../../shared';
import { tokens, cssVarMap, cssText, tokensStudio, shadowOf, textPairs } from './tokens';
import { parts, recipes } from './parts';
import '../../../../styles/language/iterations/f.scss';

export const meta = {
  id: 'f',
  name: 'Terrarium',
  tagline: 'Clearcase meets Pondlife: moulded gadget parts, grown instead of drawn, with fireflies for lamps.',
};

export const fontsHref =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=DotGothic16&display=swap';

const principles = [
  ['Moulded, then grown', 'Parts have seams, lips and travel like hardware, but the mould was a pond: lumpy edges, never two corners alike. You can always see where one thing ends.'],
  ['Press, then settle', 'Buttons drop 3px and spring back with one overshoot. A press is a toy action, not a decision. Nothing can go wrong.'],
  ['Fireflies, not alarms', 'Light means state, and only fireflies emit it. Lit is ready. Dim is resting. There is no red siren anywhere.'],
  ['Nobody is counting', 'No timers, scores or streaks. The idle lamp breathes every 4.2 seconds, the reeds sway when nothing is happening, and you can stay as long as you like.'],
  ['Every tank hides a jar', 'Each screen holds one small thing to find. It is never needed and always rewarded, and it never has a points counter.'],
];

const voice = [
  ['Press the green one. The tank is ready.', 'Click here to proceed to the next step.'],
  ['Saved. Take your time.', 'Success! Do not forget to hurry.'],
  ['Hm, that did not take. Try again, no rush.', 'Error 500: operation failed!'],
  ['Nothing in the tank yet. Good place for a seed.', 'No results found.'],
];

const motions = [
  ['press', 'Tap'], ['sway', 'Idle'], ['breathe', 'Ready'], ['settle', 'Arrive'],
];

const jellies = [['Lichen', 'lichen'], ['Tangerine', 'tangerine'], ['Blossom', 'blossom']];

const nav = [
  ['principles', 'Principles'], ['colour', 'Colour'], ['type', 'Type'], ['shape', 'Shape'],
  ['motion', 'Motion'], ['parts', 'Parts'], ['recipes', 'Recipes'], ['voice', 'Voice'],
  ['poke', 'Poke around'], ['export', 'Export'],
];

// Where each firefly hovers inside the tank (percent), and how it drifts.
const flies = [
  { x: 10, y: 24, dx: 18, dy: -14, t: 9 },
  { x: 74, y: 14, dx: -22, dy: 12, t: 11 },
  { x: 28, y: 62, dx: 24, dy: 10, t: 13 },
  { x: 58, y: 48, dx: -16, dy: -18, t: 10 },
  { x: 88, y: 66, dx: -26, dy: -8, t: 12 },
  { x: 46, y: 22, dx: 14, dy: 20, t: 14 },
];

const ratingOf = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Large only' : 'Fail');
const col = (k) => tokens.color[k].value;

const Part = ({ p, onCopy }) => {
  return (
    <figure className="f-part">
      <div className="f-part-stage" dangerouslySetInnerHTML={{ __html: p.svg }} />
      <figcaption>
        <b className="f-lcd">{p.name}</b>
        <span>{p.note}</span>
        <span className="f-part-btns">
          <button type="button" className="f-btn f-btn-small" onClick={() => onCopy(p.svg, `${p.name} copied. Paste into Figma.`)}>Copy for Figma</button>
          {p.lumpy && (
            <button type="button" className="f-btn f-btn-small" onClick={() => onCopy(p.lumpy, `${p.name} (lumpy) copied`)}>Copy lumpy</button>
          )}
        </span>
      </figcaption>
    </figure>
  );
};

const Unit = ({ id, n, title, active, setRef, children }) => (
  <section className={`f-unit${active ? ' is-current' : ''}`} id={`f-${id}`} ref={(el) => setRef(id, el)}>
    <span className="f-leafscrew f-leafscrew-a" aria-hidden="true" />
    <span className="f-leafscrew f-leafscrew-b" aria-hidden="true" />
    <header className="f-unit-head">
      <span className="f-lcd f-badge">{n}</span>
      <h2>{title}</h2>
      <span className={`f-lamp${active ? ' is-lit' : ''}`} aria-hidden="true" />
    </header>
    {children}
  </section>
);

export default function Terrarium() {
  const [toast, setToast] = useState('');
  const [jelly, setJelly] = useState(0);
  const [sway, setSway] = useState(true);
  const [lit, setLit] = useState(() => flies.map(() => false));
  const [ripples, setRipples] = useState([]);
  const [current, setCurrent] = useState('principles');
  const timer = useRef(null);
  const rootRef = useRef(null);
  const secs = useRef({});

  useEffect(() => {
    loadFonts(fontsHref);
    return () => clearTimeout(timer.current);
  }, []);

  const say = (m) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 1900);
  };
  const copy = async (text, msg) => say((await copyText(text)) ? msg : 'Clipboard said no. Try again?');
  const setRef = (id, el) => { secs.current[id] = el; };

  const onScroll = () => {
    const top = rootRef.current.getBoundingClientRect().top + 160;
    let hit = nav[0][0];
    nav.forEach(([id]) => {
      const el = secs.current[id];
      if (el && el.getBoundingClientRect().top <= top) hit = id;
    });
    setCurrent(hit);
  };
  const go = (id) => secs.current[id] && secs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });

  const ripple = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((r) => [...r.slice(-5), { id, x: e.clientX - b.left, y: e.clientY - b.top }]);
    setTimeout(() => setRipples((r) => r.filter((q) => q.id !== id)), 1800);
  };

  const count = lit.filter(Boolean).length;
  const allGlow = count === flies.length;
  const catchFly = (i) => {
    const next = lit.map((v, j) => (j === i ? !v : v));
    setLit(next);
    if (next.every(Boolean)) say('Every firefly is lit. Nobody is counting.');
  };

  const vars = { ...cssVarMap(), '--f-jelly': col(jellies[jelly][1]) };
  const status = allGlow ? 'ALL GLOWING. NOBODY IS COUNTING.' : `READY  ${String(count).padStart(2, '0')}/06 GLOWING  SWAY ${sway ? 'ON' : 'OFF'}`;

  return (
    <div className={`f-root${sway ? '' : ' f-still'}${allGlow ? ' f-allglow' : ''}`} style={vars} ref={rootRef} onScroll={onScroll}>
      <div className="f-chassis">
        <aside className="f-rail">
          <div className="f-rail-in">
            <div className="f-lcd f-screen" role="status">{String(nav.findIndex(([id]) => id === current) + 1).padStart(2, '0')} / {nav.length}<br />{count}/6 lit</div>
            <nav aria-label="Sections">
              {nav.map(([id, label]) => (
                <button key={id} type="button" className={`f-navbtn${id === current ? ' is-current' : ''}`} onClick={() => go(id)}>
                  <i aria-hidden="true" />{label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <div className="f-main">
          <header className="f-hero">
            <div className="f-tank" onClick={ripple} role="presentation">
              {ripples.map((r) => <i key={r.id} className="f-ripple" style={{ left: r.x, top: r.y }} />)}
              <p className="f-lcd f-eyebrow">DESIGN LANGUAGE / ITERATION F</p>
              <h1>Terra<em>rium</em></h1>
              <p className="f-lede">A pocket gadget that grew in a pond. Moulded buttons, lamps that are fireflies, a tank you can tap. Welcoming like a menu that waits, open like a machine that is yours.</p>
              {flies.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  className={`f-fly${lit[i] ? ' is-lit' : ''}`}
                  style={{ left: `${f.x}%`, top: `${f.y}%`, '--dx': `${f.dx}px`, '--dy': `${f.dy}px`, '--t': `${f.t}s` }}
                  aria-pressed={lit[i]}
                  aria-label={`Firefly ${i + 1}`}
                  onClick={(e) => { e.stopPropagation(); catchFly(i); }}
                />
              ))}
              <p className="f-lcd f-tank-screen">{status}</p>
            </div>
            <div className="f-controls">
              <span className="f-lcd">Jelly</span>
              {jellies.map(([n, k], i) => (
                <button key={k} type="button" aria-pressed={jelly === i} aria-label={`${n} jelly`} className={`f-chip${jelly === i ? ' is-on' : ''}`} style={{ '--c': col(k) }} onClick={() => { setJelly(i); say(`${n} jelly`); }} />
              ))}
              <span className="f-lcd f-gap">Sway</span>
              <button type="button" className="f-seed" aria-pressed={sway} aria-label="Sway" onClick={() => setSway(!sway)}><i /></button>
              <span className="f-hint">Tap the water. Catch the fireflies.</span>
            </div>
          </header>

          <Unit id="principles" n="01" title="Principles" active={current === 'principles'} setRef={setRef}>
            <ol className="f-prin">
              {principles.map(([h, b]) => <li key={h}><h3>{h}</h3><p>{b}</p></li>)}
            </ol>
          </Unit>

          <Unit id="colour" n="02" title="Colour" active={current === 'colour'} setRef={setRef}>
            <p className="f-sub">Bone plastic and smoked pond glass. Three jellies share one slot: only one is lit at a time, and fireflies are the only light.</p>
            <div className="f-tokens">
              {Object.entries(tokens.color).map(([k, v]) => (
                <button type="button" className="f-tok" key={k} onClick={() => copy(v.value, `${k} copied`)}>
                  <i style={{ background: v.value }} />
                  <b>{k}</b><code className="f-lcd">{v.value}</code><small>{v.role}</small>
                </button>
              ))}
            </div>
            <h3 className="f-h3">Text pairs (WCAG)</h3>
            <ul className="f-pairs">
              {textPairs.map(([a, b, label]) => {
                const r = contrast(col(a), col(b));
                return (
                  <li key={a + b}>
                    <span className="f-pair" style={{ color: col(a), background: col(b) }}>Aa</span>
                    <span>{label}<small>{a} on {b}</small></span>
                    <code className="f-lcd">{r.toFixed(2)}</code>
                    <em className={`f-rate f-rate-${ratingOf(r).split(' ')[0]}`}>{ratingOf(r)}</em>
                  </li>
                );
              })}
            </ul>
            <p className="f-note">Every jelly takes peat text, never white. Firefly yellow is a lamp, not a text colour on pale.</p>
          </Unit>

          <Unit id="type" n="03" title="Type" active={current === 'type'} setRef={setRef}>
            <div className="f-faces">
              {Object.entries(tokens.font).map(([k, v]) => (
                <div key={k} className={`f-face f-face-${k}`}><small>{k}</small><b>{v.value}</b><span>{v.role}</span></div>
              ))}
            </div>
            <div className="f-scale">
              <p className="f-s-display"><small className="f-lcd">Display 96/0.92</small>Hello, you.</p>
              <p className="f-s-h2"><small className="f-lcd">Heading 36/1.1</small>Make yourself at home</p>
              <p className="f-s-body"><small className="f-lcd">Body 17/1.6</small>Take your time. Whatever you leave in the tank will be here when you get back, a little greener.</p>
              <p className="f-s-lcd"><small className="f-lcd">LCD 16 / dot matrix</small>TRK 04  00:03:12  3/6 GLOWING</p>
            </div>
            <p className="f-note">The serif is soft, the dots are hard. LCD text is always uppercase and always on tank or deep, never on shell.</p>
          </Unit>

          <Unit id="shape" n="04" title="Shape and material" active={current === 'shape'} setRef={setRef}>
            <p className="f-sub">Four lumpy radii in the 8-value CSS form. Light comes from the top left, through water. Shadows are a short hard lip first, then a soft cast.</p>
            <div className="f-shapes">
              {Object.entries(tokens.radius).map(([k, v]) => (
                <div key={k} className="f-shape"><i style={{ borderRadius: v.value }} /><b className="f-lcd">{k}</b><small>{v.role}</small><code>{v.value}</code></div>
              ))}
            </div>
            <div className="f-mats">
              {Object.keys(tokens.shadow).map((k) => (
                <div key={k} className={`f-mat f-mat-${k}`} style={{ boxShadow: shadowOf(k) }}><b className="f-lcd">{k}</b><small>{tokens.shadow[k].role}</small></div>
              ))}
              <div className="f-mat f-mat-smoked"><b className="f-lcd">smoked</b><small>Translucent tank green. Displays and hatches. The only thing that blurs what is behind it.</small></div>
            </div>
          </Unit>

          <Unit id="motion" n="05" title="Motion" active={current === 'motion'} setRef={setRef}>
            <p className="f-sub">Parts move like parts: translate and rotate, with one overshoot. The Sway switch up top stops idle motion; reduced-motion does the same.</p>
            <div className="f-motions">
              {motions.map(([k, role]) => (
                <div key={k} className="f-motion">
                  <span className={`f-m-obj f-m-${k}`} />
                  <b className="f-lcd">{k}</b><small>{role}</small><code>{tokens.motion[k].value}</code>
                </div>
              ))}
            </div>
          </Unit>

          <Unit id="parts" n="06" title="Parts (copy for Figma)" active={current === 'parts'} setRef={setRef}>
            <div className="f-parts">{parts.map((p) => <Part key={p.id} p={p} onCopy={copy} />)}</div>
            <p className="f-note">Click Copy for Figma, then paste into a Figma file. Bodies are real rectangles with a corner-radius field, so resize and reshape them freely. Layers are named (Cap, Lip, Gloss) and there are no filters or masks.</p>
          </Unit>

          <Unit id="recipes" n="07" title="Figma recipes" active={current === 'recipes'} setRef={setRef}>
            <p className="f-sub">For what vectors cannot carry: glass, glow, grain and corners.</p>
            <dl className="f-recipes">
              {recipes.map((r) => <div key={r.n}><dt>{r.n}</dt><dd>{r.t}</dd></div>)}
            </dl>
          </Unit>

          <Unit id="voice" n="08" title="Voice" active={current === 'voice'} setRef={setRef}>
            <p className="f-sub">Short, kind, physical verbs: press, slide, tap, plant. Warm and a little wry. Never exclaim twice and never shout in capitals (the LCD is the exception).</p>
            <div className="f-voice">
              {voice.map(([d, x]) => (
                <div key={d}>
                  <p className="f-do"><b className="f-lcd">Do</b>{d}</p>
                  <p className="f-dont"><b className="f-lcd">Don&rsquo;t</b>{x}</p>
                </div>
              ))}
            </div>
          </Unit>

          <Unit id="poke" n="09" title="Poke around" active={current === 'poke'} setRef={setRef}>
            <p>The tank at the top holds six fireflies. Tap one to light it, again to let it go. Light all six and see. The water answers when you tap it, and the Sway switch stops everything idle.</p>
            <div className="f-poke">
              <div className="f-lcd f-screen">{status}</div>
              <button type="button" className="f-btn" onClick={() => { setLit(flies.map(() => false)); say('Fireflies let go.'); }}>Let them go</button>
              <button type="button" className="f-btn" onClick={() => go('principles')}>Back to the tank</button>
            </div>
            <p className="f-note">Rule of the language: every surface hides one small thing, and it never has a points counter.</p>
          </Unit>

          <Unit id="export" n="10" title="Export" active={current === 'export'} setRef={setRef}>
            <p className="f-sub">Both outputs come from one tokens object. Import the JSON through Tokens Studio, then apply the set in Figma.</p>
            <div className="f-actions">
              <button type="button" className="f-btn" onClick={() => { downloadFile('terrarium.tokens.json', JSON.stringify(tokensStudio(), null, 2)); say('Tokens are on their way down.'); }}>Download Tokens Studio JSON</button>
              <button type="button" className="f-btn f-btn-water" onClick={() => copy(cssText(), 'CSS variables copied')}>Copy CSS variables</button>
            </div>
            <pre className="f-code">{cssText().split('\n').slice(0, 9).join('\n')}{'\n  ...'}</pre>
          </Unit>
          <div className="f-spare" />
        </div>
      </div>
      <div className={`f-toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
