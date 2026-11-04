import React, { useEffect, useRef, useState } from 'react';
import { copyText, downloadFile, contrast, loadFonts } from '../../shared';
import { tokens, cssVariables, tokensStudioJson, textPairs } from './tokens';
import { parts } from './parts';
import '../../../../styles/language/iterations/e.scss';

export const meta = {
  id: 'e',
  name: 'Pondlife',
  tagline: 'Soft technology that grows, sways and settles like a pond edge.',
};

export const fontsHref =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Spline+Sans+Mono:wght@400;600&display=swap';

const principles = [
  ['Nothing can wilt', 'Wii welcome: no error is permanent. Failures are shown as a plant that droops and re-perks on retry, never as red alarms.'],
  ['Nobody is counting', 'No streaks, scores or timers. Waiting is a pond: ripples, drifting bubbles, a slow sway. You may stay as long as you like.'],
  ['Grown, not drawn', 'Edges are asymmetric and lumpy as if shaped by water. If two corners match, one of them is wrong.'],
  ['Poke the soil', '98/XP spirit: the machine is yours. Every screen hides one thing to dig up. It is never needed, always rewarded.'],
  ['Roots you can follow', 'Playful on top, plain underneath. Labels say what they do, navigation never moves, the stem always leads home.'],
];

const voice = [
  ['Welcome back. The pond is where you left it.', 'Session restored successfully.'],
  ['Hm, that did not take. Try again, no rush.', 'Error 500: operation failed!'],
  ['Planted. It will show up in a moment.', 'Your request has been submitted.'],
  ['There is nothing here yet. Good place for a seed.', 'No results found.'],
];

const motionDemos = [
  ['sway', 'Idle'], ['bloom', 'Appear'], ['settle', 'Rest'], ['drift', 'Ambient'],
];

const recipes = [
  ['Dew glass', 'Rectangle, fill #FFFFFF at 28%. Background blur 14. Inner shadow white 70%, x0 y2 blur 0. Stroke #FFFFFF 70% inside 1px. Add a second ellipse (white to transparent, 90 deg) over the top third as the gloss.'],
  ['Wet gloss', 'Duplicate the shape, fill linear white 85% to 0% top to bottom, scale to 90% width and 40% height, nudge up 4px, layer blend Normal. Never full-width: gloss floats inside the edge.'],
  ['Seaglass glow', 'Drop shadow #79D4C0 55% x0 y0 blur 28 spread 4, then a second #C5D77E 70% blur 28. Use for focus and selection only.'],
  ['Pond grain', 'Fill a frame with #F6F1E3, add the free Noise and Texture plugin: mono noise 18%, density 60%, blend Multiply. Overlay two huge blurred ellipses (#79D4C0 22%, #C5D77E 30%, blur 200).'],
  ['Blob corners', 'Figma corners are symmetric. Draw a pebble with the pen tool (4 anchors, drag handles unevenly), or paste a Part below and resize it. Radius tokens show the CSS values for dev.'],
];

const ratingOf = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA large' : 'fail');
const getC = (k) => tokens.color[k].value;

const moss = Array.from({ length: 16 }, (_, i) => i);

const Section = ({ n, title, side = 'l', children }) => (
  <section className={`e-patch e-side-${side}`}>
    <header className="e-patch-head">
      <span className="e-no">{String(n).padStart(2, '0')}</span>
      <h2>{title}</h2>
    </header>
    {children}
  </section>
);

export default function PondLife() {
  const [toast, setToast] = useState('');
  const [seed, setSeed] = useState(0);
  const [beetle] = useState(() => Math.floor(Math.random() * 16));
  const [raked, setRaked] = useState([]);
  const [ripples, setRipples] = useState([]);
  const timer = useRef(null);
  const refs = useRef({});

  useEffect(() => {
    loadFonts(fontsHref);
    return () => clearTimeout(timer.current);
  }, []);

  const say = (m) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 1900);
  };
  const copy = async (text, label) => say((await copyText(text)) ? `${label} copied. Fresh as dew.` : 'Clipboard said no. Try again?');

  const ripple = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((r) => [...r.slice(-5), { id, x: e.clientX - b.left, y: e.clientY - b.top }]);
    setTimeout(() => setRipples((r) => r.filter((q) => q.id !== id)), 1800);
  };

  const rake = (i) => {
    if (raked.includes(i) || raked.includes(beetle)) return;
    setRaked([...raked, i]);
    if (i === beetle) say('A beetle! It was only napping. Nobody wins, everybody smiles.');
  };
  const dist = (i) => Math.abs((i % 4) - (beetle % 4)) + Math.abs(Math.floor(i / 4) - Math.floor(beetle / 4));
  const warmth = (i) => (i === beetle ? '🪲' : dist(i) <= 1 ? '·' : '');
  const poke = () => {
    const n = Math.min(seed + 1, 5);
    setSeed(n);
    say(['A seed. Hello.', 'It is sprouting.', 'Two leaves.', 'It is budding.', 'Bloom! You found the moss garden.'][n - 1]);
  };

  return (
    <div className="e-root">
      <div className="e-light e-light-a" aria-hidden="true" />
      <div className="e-light e-light-b" aria-hidden="true" />
      <div className="e-wrap">
        <div className="e-hero" onClick={ripple} role="presentation">
          {ripples.map((r) => <i key={r.id} className="e-ripple" style={{ left: r.x, top: r.y }} />)}
          <p className="e-eyebrow">Design language / iteration e</p>
          <h1>Pond<em>life</em><button type="button" className={`e-seed e-seed-${seed}`} onClick={(ev) => { ev.stopPropagation(); poke(); }} aria-label="A tiny speck">{seed > 3 ? '✿' : ''}</button></h1>
          <p className="e-lede">Soft technology that grows. Everything here sways a little, settles when you stop, and never keeps score.</p>
          <p className="e-hint">Tap the water. It answers.</p>
          <div className="e-sw">
            {Object.entries(tokens.color).map(([k, t]) => <span key={k} className="e-sw-dot" style={{ background: t.value }} title={k} />)}
          </div>
        </div>

        <Section n={1} title="Principles" side="r">
          <ol className="e-principles">
            {principles.map(([t, d], i) => (
              <li key={t} style={{ '--i': i }}><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </Section>

        <Section n={2} title="Colour" side="l">
          <p className="e-sub">Pond-tea water, lichen and kelp. Deliberately no sky blue and no grass green: the blue is held by seaglass, the green is yellowed by lichen.</p>
          <div className="e-colors">
            {Object.entries(tokens.color).map(([k, t], i) => (
              <button type="button" key={k} className="e-color" style={{ '--i': i }} onClick={() => copy(t.value, k)}>
                <span className="e-chip" style={{ background: t.value }} />
                <b>{k}</b><code>{t.value}</code><small>{t.role}</small>
              </button>
            ))}
          </div>
          <h3 className="e-h3">Text contrast (WCAG)</h3>
          <ul className="e-pairs">
            {textPairs.map(([f, b, label]) => {
              const r = contrast(getC(f), getC(b));
              return (
                <li key={f + b}>
                  <span className="e-pair" style={{ color: getC(f), background: getC(b) }}>Aa</span>
                  <span>{label}<small>{f} on {b}</small></span>
                  <code>{r.toFixed(2)}</code><em className={`e-r e-r-${ratingOf(r).replace(' ', '-')}`}>{ratingOf(r)}</em>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section n={3} title="Type" side="r">
          <div className="e-type">
            {Object.entries(tokens.font).map(([k, t]) => (
              <div key={k} className={`e-face e-face-${k}`}>
                <small>{k}</small><b>{t.value}</b><span>{t.role}</span>
              </div>
            ))}
          </div>
          <div className="e-scale">
            <p className="e-s-display"><small>Display 72/0.95</small>Hello, you.</p>
            <p className="e-s-h2"><small>Heading 40/1.05</small>Make yourself at home</p>
            <p className="e-s-h3"><small>Subhead 24/1.2</small>The water is fine</p>
            <p className="e-s-body"><small>Body 17/1.6</small>Take your time. Everything you leave will be here when you come back, a little greener.</p>
            <p className="e-s-label"><small>Label 12 / +0.14em</small>planted 3 days ago</p>
          </div>
        </Section>

        <Section n={4} title="Shape" side="l">
          <p className="e-sub">Four lumpy radii. Use the 8-value CSS form so horizontal and vertical radii differ. Rotate objects 1 to 3 degrees off square.</p>
          <div className="e-shapes">
            {Object.entries(tokens.radius).map(([k, t]) => (
              <div key={k} className="e-shape" style={{ borderRadius: t.value }}>
                <b>{k}</b><small>{t.role}</small><code>{t.value}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section n={5} title="Light and material" side="r">
          <p className="e-sub">Light comes from above-left, through water. Objects are wet: a hard highlight, a soft underside tint, a shadow that pools.</p>
          <div className="e-mats">
            {Object.entries(tokens.shadow).map(([k, t]) => (
              <div key={k} className={`e-mat e-mat-${k}`} style={{ boxShadow: t.value }}>
                <b>{k}</b><small>{t.role}</small>
              </div>
            ))}
          </div>
        </Section>

        <Section n={6} title="Motion" side="l">
          <p className="e-sub">Slow biological curves. Springs overshoot once, never twice. Reduced motion removes sway and drift and keeps only fades.</p>
          <div className="e-motions">
            {motionDemos.map(([k, role]) => (
              <div key={k} className="e-motion">
                <span className={`e-m-obj e-m-${k}`} />
                <b>{k}</b><small>{role}</small><code>{tokens.motion[k].value}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section n={7} title="Parts (copy as SVG)" side="r">
          <p className="e-sub">Plain-attribute SVG. Copy, then paste into Figma: they land as editable vectors with gradients.</p>
          <div className="e-parts">
            {parts.map((p, i) => (
              <figure key={p.id} className="e-part" style={{ '--i': i }}>
                <span className="e-part-art" ref={(el) => { refs.current[p.id] = el; }}>{p.svg}</span>
                <figcaption>
                  <b>{p.name}</b><small>{p.note}</small>
                  <button type="button" className="e-btn" onClick={() => copy(refs.current[p.id].innerHTML, `${p.name} SVG`)}>Copy SVG</button>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section n={8} title="Figma recipes" side="l">
          <p className="e-sub">For what vectors cannot carry: glass, gloss, glow and grain.</p>
          <dl className="e-recipes">
            {recipes.map(([t, d]) => (<div key={t}><dt>{t}</dt><dd>{d}</dd></div>))}
          </dl>
        </Section>

        <Section n={9} title="Voice" side="r">
          <p className="e-sub">Warm, unhurried, a little wry. Speak like a friend who gardens. Never exclaim twice, never shout in capitals.</p>
          <div className="e-voice">
            {voice.map(([d, x]) => (
              <div key={d}>
                <p className="e-do"><small>Do</small>{d}</p>
                <p className="e-dont"><small>Don&rsquo;t</small>{x}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section n={10} title="Poke around" side="l">
          <p className="e-sub">
            Rule: each screen hides exactly one growing thing. Here: the speck after the title. Tap it five times to bloom it, then rake the moss below. Nothing is scored; the beetle just likes being found. Dots hint at a nearby beetle.
          </p>
          {seed < 5 ? (
            <p className="e-locked">The moss patch is asleep. Something small is waiting by the title.</p>
          ) : (
            <div className="e-moss" role="group" aria-label="Moss garden">
              {moss.map((i) => (
                <button type="button" key={i} className={`e-moss-t${raked.includes(i) ? ' is-raked' : ''}`} onClick={() => rake(i)} aria-label={`Moss patch ${i + 1}`}>
                  {raked.includes(i) ? warmth(i) : ''}
                </button>
              ))}
            </div>
          )}
          {seed >= 5 && raked.includes(beetle) && <button type="button" className="e-btn" onClick={() => setRaked([])}>Re-moss</button>}
        </Section>

        <Section n={11} title="Export" side="r">
          <p className="e-sub">Both outputs come from one tokens object. Import the JSON through Tokens Studio, then apply sets in Figma.</p>
          <div className="e-actions">
            <button type="button" className="e-btn e-btn-main" onClick={() => { downloadFile('pondlife.tokens.json', tokensStudioJson()); say('Tokens are on their way down.'); }}>Download Tokens Studio JSON</button>
            <button type="button" className="e-btn" onClick={() => copy(cssVariables(), 'CSS variables')}>Copy CSS variables</button>
          </div>
          <pre className="e-code">{cssVariables().split('\n').slice(0, 9).join('\n')}{'\n  ...'}</pre>
        </Section>
        <div className="e-spare" />
      </div>
      <div className={`e-toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
