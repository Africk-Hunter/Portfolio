import React, { useEffect, useRef, useState } from 'react';
import { copyText, downloadFile, contrast, loadFonts } from '../../shared';
import { tokens, cssVarMap, cssText, tokensStudio, shadowOf, textPairs } from './tokens';
import { parts, recipes } from './parts';
import '../../../../styles/language/iterations/g.scss';

export const meta = {
  id: 'g',
  name: 'Dewdrop',
  tagline: 'One glass orb in a lot of air. Inflated, not machined.',
};

export const fontsHref =
  'https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Outfit:wght@400;500;600&display=swap';

const principles = [
  ['One orb, a lot of air', 'Each screen has one hero and about sixty percent empty ground. Space is the loudest thing on the page.'],
  ['Inflated, not machined', 'Parts have no seams, screws or readouts. They are blown, swollen and soft, as if breath filled them.'],
  ['Light goes through', 'Gloss is a lens of light passing through glass, with a bounce at the bottom. Edges are light, never ink outlines.'],
  ['Blue shadows', 'Every shadow is tinted by the glass that casts it. Grey would be a lie in a room this bright.'],
  ['Nobody is counting', 'The orb breathes slowly when nothing is happening. Press it and it squishes. Nothing is scored.'],
];

const voice = [
  ['Come in. Take your time.', 'Welcome! Get started now!'],
  ['That one is empty. Try another.', 'Invalid selection.'],
  ['Saved. It will be here.', 'Success! Changes saved!'],
  ['Press the glass.', 'Click here to continue.'],
];

const pokes = ['', 'Squish.', 'Again?', 'Ha. Okay.', 'Still here.', 'You found the pinball. (There is no pinball.)'];

const motions = [['breathe', 'Idle'], ['squish', 'Press'], ['drift', 'Ambient']];

const nav = [
  ['principles', 'Principles'], ['colour', 'Colour'], ['type', 'Type'], ['shape', 'Shape and light'],
  ['motion', 'Motion'], ['parts', 'Parts'], ['recipes', 'Recipes'], ['voice', 'Voice'], ['export', 'Export'],
];

const ratingOf = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Large only' : 'Fail');
const col = (k) => tokens.color[k].value;

const Part = ({ p, onCopy }) => (
  <figure className="g-part">
    <div className="g-part-stage" dangerouslySetInnerHTML={{ __html: p.svg }} />
    <figcaption>
      <b>{p.name}</b>
      <span>{p.note}</span>
      <button type="button" className="g-btn g-btn-small" onClick={() => onCopy(p.svg, `${p.name} copied. Paste into Figma.`)}>Copy for Figma</button>
    </figcaption>
  </figure>
);

const Block = ({ id, title, setRef, children }) => (
  <section className="g-block" id={`g-${id}`} ref={(el) => setRef(id, el)}>
    <h2>{title}</h2>
    {children}
  </section>
);

export default function Dewdrop() {
  const [toast, setToast] = useState('');
  const [pokeN, setPokeN] = useState(0);
  const [squish, setSquish] = useState(false);
  const [current, setCurrent] = useState('principles');
  const timer = useRef(null);
  const rootRef = useRef(null);
  const orbRef = useRef(null);
  const secs = useRef({});

  useEffect(() => {
    loadFonts(fontsHref);
    return () => clearTimeout(timer.current);
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
    const top = rootRef.current.getBoundingClientRect().top + 200;
    let hit = nav[0][0];
    nav.forEach(([id]) => {
      const el = secs.current[id];
      if (el && el.getBoundingClientRect().top <= top) hit = id;
    });
    setCurrent(hit);
  };

  // The catch light follows the pointer, so the orb feels lit by whatever you are holding.
  const onMove = (e) => {
    const o = orbRef.current;
    if (!o) return;
    const b = o.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (e.clientX - (b.left + b.width / 2)) / 600));
    const y = Math.max(-1, Math.min(1, (e.clientY - (b.top + b.height / 2)) / 600));
    o.style.setProperty('--lx', `${x * 18}px`);
    o.style.setProperty('--ly', `${y * 14}px`);
  };

  const press = () => {
    setPokeN((n) => n + 1);
    setSquish(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setSquish(true)));
  };

  return (
    <div className="g-root" style={cssVarMap()} ref={rootRef} onScroll={onScroll} onPointerMove={onMove}>
      <nav className="g-rail" aria-label="Sections">
        {nav.map(([id, label]) => (
          <button key={id} type="button" className={id === current ? 'is-current' : ''} onClick={() => go(id)}>
            <i aria-hidden="true" />{label}
          </button>
        ))}
      </nav>

      <div className="g-page">
        <header className="g-hero">
          <p className="g-eyebrow">Design language / iteration G</p>
          <h1><span>Dewdrop</span></h1>
          <p className="g-lede">A bright, quiet room with one glass thing in it. Everything is soft, nothing is asking, and you may press the orb.</p>
          <button
            type="button"
            ref={orbRef}
            className={`g-orb${squish ? ' is-squish' : ''}`}
            aria-label="Press the orb"
            onClick={press}
            onAnimationEnd={() => setSquish(false)}
          >
            <i className="g-orb-floor" />
            <i className="g-orb-sheen" />
            <i className="g-orb-catch" />
          </button>
          <p className="g-poke" aria-live="polite">{pokes[Math.min(pokeN, pokes.length - 1)] || 'Press the glass.'}</p>
        </header>

        <Block id="principles" title="Principles" setRef={setRef}>
          <ol className="g-prin">
            {principles.map(([h, b]) => <li key={h}><h3>{h}</h3><p>{b}</p></li>)}
          </ol>
        </Block>

        <Block id="colour" title="Colour" setRef={setRef}>
          <p className="g-sub">Cool air, one glass, one deep blue. The warm spark is a catch light and nothing more.</p>
          <div className="g-tokens">
            {Object.entries(tokens.color).map(([k, v]) => (
              <button type="button" className="g-tok" key={k} onClick={() => copy(v.value, `${k} copied`)}>
                <i style={{ background: v.value }} />
                <b>{k}</b><code>{v.value}</code><small>{v.role}</small>
              </button>
            ))}
          </div>
          <h3 className="g-h3">Text pairs (WCAG)</h3>
          <ul className="g-pairs">
            {textPairs.map(([a, b, label]) => {
              const r = contrast(col(a), col(b));
              return (
                <li key={a + b}>
                  <span className="g-pair" style={{ color: col(a), background: col(b) }}>Aa</span>
                  <span>{label}<small>{a} on {b}</small></span>
                  <code>{r.toFixed(2)}</code>
                  <em className={`g-rate g-rate-${ratingOf(r).split(' ')[0]}`}>{ratingOf(r)}</em>
                </li>
              );
            })}
          </ul>
        </Block>

        <Block id="type" title="Type" setRef={setRef}>
          <div className="g-faces">
            {Object.entries(tokens.font).map(([k, v]) => (
              <div key={k} className={`g-face g-face-${k}`}><small>{k}</small><b>{v.value}</b><span>{v.role}</span></div>
            ))}
          </div>
          <div className="g-scale">
            <p className="g-s-display"><small>Display 128/0.9</small><span>Hello</span></p>
            <p className="g-s-h2"><small>Heading 44/1.1</small>Make yourself at home</p>
            <p className="g-s-body"><small>Body 18/1.6</small>Take your time. Whatever you set down here will still be here when you get back.</p>
            <p className="g-s-label"><small>Label 12, caps, +0.14em</small>Unhurried</p>
          </div>
        </Block>

        <Block id="shape" title="Shape and light" setRef={setRef}>
          <p className="g-sub">Light comes from straight above. Shadows are blue and fall straight down. Corners are always the biggest radius that fits.</p>
          <div className="g-shapes">
            {Object.entries(tokens.radius).map(([k, v]) => (
              <div key={k} className="g-shape"><i style={{ borderRadius: v.value }} /><b>{k}</b><small>{v.role}</small><code>{v.value}</code></div>
            ))}
          </div>
          <div className="g-mats">
            {Object.keys(tokens.shadow).map((k) => (
              <div key={k} className="g-mat" style={{ boxShadow: shadowOf(k) }}><b>{k}</b><small>{tokens.shadow[k].role}</small></div>
            ))}
          </div>
        </Block>

        <Block id="motion" title="Motion" setRef={setRef}>
          <p className="g-sub">Slow, soft, one overshoot. Reduced-motion stops the breathing and drift and makes presses instant.</p>
          <div className="g-motions">
            {motions.map(([k, role]) => (
              <div key={k} className="g-motion">
                <span className={`g-m-obj g-m-${k}`} />
                <b>{k}</b><small>{role}</small><code>{tokens.motion[k].value}</code>
              </div>
            ))}
          </div>
        </Block>

        <Block id="parts" title="Parts (copy for Figma)" setRef={setRef}>
          <div className="g-parts">{parts.map((p) => <Part key={p.id} p={p} onCopy={copy} />)}</div>
          <p className="g-note">Click Copy for Figma, then paste into a Figma file. Bodies are real rectangles with a corner-radius field. Layers are named (Body, Sheen, Bounce, Rim, Cast) and there are no filters or masks.</p>
        </Block>

        <Block id="recipes" title="Figma recipes" setRef={setRef}>
          <p className="g-sub">For what vectors cannot carry: blur, glow and the ground light.</p>
          <dl className="g-recipes">
            {recipes.map((r) => <div key={r.n}><dt>{r.n}</dt><dd>{r.t}</dd></div>)}
          </dl>
        </Block>

        <Block id="voice" title="Voice" setRef={setRef}>
          <p className="g-sub">Short, calm, physical verbs: press, hold, set down. Warm, a little dry, never loud.</p>
          <div className="g-voice">
            {voice.map(([d, x]) => (
              <div key={d}>
                <p className="g-do"><b>Do</b>{d}</p>
                <p className="g-dont"><b>Don&rsquo;t</b>{x}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block id="export" title="Export" setRef={setRef}>
          <p className="g-sub">Both outputs come from one tokens object. Import the JSON through Tokens Studio, then apply the set in Figma.</p>
          <div className="g-actions">
            <button type="button" className="g-btn" onClick={() => { downloadFile('dewdrop.tokens.json', JSON.stringify(tokensStudio(), null, 2)); say('Tokens are on their way down.'); }}>Download Tokens Studio JSON</button>
            <button type="button" className="g-btn" onClick={() => copy(cssText(), 'CSS variables copied')}>Copy CSS variables</button>
          </div>
          <pre className="g-code">{cssText().split('\n').slice(0, 9).join('\n')}{'\n  ...'}</pre>
        </Block>
        <div className="g-spare" />
      </div>
      <div className={`g-toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
