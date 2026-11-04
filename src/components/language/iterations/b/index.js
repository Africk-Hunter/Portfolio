import React, { useEffect, useRef, useState } from 'react';
import { copyText, downloadFile, contrast, loadFonts } from '../../shared';
import { tokens, toCssVars, toTokensStudio, times, timeNotes } from './tokens';
import { parts } from './parts';
import '../../../../styles/language/iterations/b.scss';

export const meta = {
  id: 'b',
  name: 'Slow Horizon',
  tagline: 'A site made of weather and light: type under a sky that never hurries.',
};

export const fontsHref =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..800,0..100;1,9..144,300..800,0..100&family=Hanken+Grotesk:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap';

const c = (k) => tokens.color[k].value;

const principles = [
  ['01', 'The light stays on.', 'Wii: nothing can go wrong. No red alarms, no countdowns, no scolding. Errors are said gently and the way back is always visible.'],
  ['02', 'Waiting is weather.', 'Wii: waiting is pleasant. A loading state is a cloud crossing, not a bar filling. Nobody is keeping score.'],
  ['03', 'Always a horizon.', 'XP: you always knew where things were. Every screen has one fixed line to orient by, and it never moves.'],
  ['04', 'Poke the sky.', '98: the machine is yours. Pinball hid in Word. Leave small rewards under the sun, the stars, the corners. Never announce them.'],
  ['05', 'Type does the work.', 'Structure is made from size, italics and air, not from boxes. If it needs a border, the hierarchy failed.'],
];

const contrastPairs = [
  ['ink', 'paper'], ['quiet', 'paper'], ['sunDeep', 'paper'], ['ink', 'apricot'],
  ['ink', 'sea'], ['moon', 'night'], ['flare', 'night'], ['sea', 'night'], ['sun', 'night'], ['sun', 'paper'],
];

const scale = [
  ['sky', 'display', 'clamp(3.5rem,14vw,8rem)', 300, 'normal', 'Tuesday.'],
  ['h1', 'display', 'clamp(2.25rem,8vw,4rem)', 400, 'normal', 'A calm, clear afternoon'],
  ['h2', 'display', '2rem', 400, 'italic', 'with a chance of nothing going wrong'],
  ['body', 'text', '1.0625rem', 400, 'normal', 'Everything here is yours to open, drag and leave a mess of. The sky will tidy itself.'],
  ['label', 'label', '0.75rem', 500, 'normal', '14:07 / SAVED NOWHERE, KEPT EVERYWHERE'],
];

const levels = [
  ['Ground', 'Milk Haze. No shadow, no edge.'],
  ['Haze', 'A 30% wash of Apricot or Lilac between content. Replaces cards and dividers.'],
  ['Cloud', 'Pale shapes at 40-90% opacity, top-lit. The only thing that overlaps text, and only behind it.'],
  ['Light', 'Sun, glint, flare. Glows with the haze tokens. The highest things are the brightest, never the darkest.'],
];

const motions = [
  ['Drift', 'drift', 'Clouds cross the sky over a minute. Paused for reduced motion.'],
  ['Breathe', 'breath', 'Light sources pulse 4% in size. You notice only when it stops.'],
  ['Dawn', 'dawn', 'Scene changes cross-fade slowly. Try the sun above.'],
];

const voice = [
  ['Take your time. This will keep.', 'Hurry! Only 3 minutes left!'],
  ['That did not work. Nothing is lost, try once more.', 'ERROR: Invalid input.'],
  ['I make websites and small odd tools.', 'Passionate full-stack ninja.'],
  ['Hello again. Welcome back.', 'Welcome back, valued user.'],
];

const recipes = [
  ['Sky', 'Rectangle, Fill: Linear gradient, 4 stops from Night Plum to Lilac to Apricot to Milk Haze, angle 180. Add 4% Noise (Figma Noise plugin) as a second fill at Overlay.'],
  ['Haze', 'Ellipse 140% wide, Fill: Apricot at 35%, Layer blur 80. Sits at the horizon line, behind type.'],
  ['Glow', 'Duplicate the shape. Layer blur 40, blend Plus Lighter (or Screen). Drop it at 60% opacity under the original.'],
  ['Text glow', 'Text, Effects: Drop shadow, X0 Y0, Blur 24, colour Flare Yellow at 45%. Night skies only.'],
  ['Window', 'Frame with the arch radius (round only the top corners, 50% of width), Fill Milk Haze 30%, Effect: Background blur 18. Use sparingly, once per view.'],
  ['Flare', 'Paste the Lens Flare part, place the first disc exactly on the sun, rotate the whole group to taste. Lock it.'],
];

const copyVars = () => copyText(toCssVars());

export default function SlowHorizon() {
  const [time, setTime] = useState('dawn');
  const [pokes, setPokes] = useState(0);
  const [toast, setToast] = useState('');
  const [found, setFound] = useState(false);
  const timer = useRef(null);
  const partRefs = useRef({});

  useEffect(() => { loadFonts(fontsHref); }, []);
  useEffect(() => () => clearTimeout(timer.current), []);

  const say = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 2200);
  };

  const poke = () => {
    const n = pokes + 1;
    setPokes(n);
    const next = times[n % times.length];
    setTime(next);
    if (next === 'eclipse') setFound(true);
    say(timeNotes[next]);
  };

  const copyPart = async (p) => {
    const el = partRefs.current[p.id];
    const ok = el && (await copyText(el.outerHTML));
    say(ok ? `${p.name} copied. Paste into Figma.` : 'Could not copy. Select it by hand, no hurry.');
  };

  const run = async (fn, okMsg) => say((await fn()) ? okMsg : 'Could not copy. No hurry, try again.');

  return (
    <div className="b-root">
      <header className="b-hero" data-time={time}>
        {times.map((t) => <div key={t} className={`b-sky b-sky--${t}${t === time ? ' is-on' : ''}`} />)}
        <div className="b-stars" />
        <div className="b-cloud b-cloud--1" />
        <div className="b-cloud b-cloud--2" />
        <button type="button" className="b-orb" onClick={poke} aria-label="The sun. Click it to change the time of day.">
          <span className="b-orb-core" />
        </button>
        <div className="b-hero-top">
          <p className="b-label">design language / iteration b</p>
          <h1 className="b-sky-word">Slow<br /><em>Horizon</em></h1>
          <p className="b-hero-lede">A language made of weather and light. Type sits on the sky; nothing is boxed in, nothing is timed.</p>
        </div>
        <div className="b-hero-low">
          <p className="b-label b-clock">{timeNotes[time]}</p>
          <p className="b-label b-hint">{found ? 'You found the eclipse. It is documented under Poke around.' : 'the sun is not just decoration.'}</p>
        </div>
        <div className="b-horizon" />
      </header>

      <Section n="06:12" title="Principles" tone="a">
        <ol className="b-principles">
          {principles.map(([n, h, t]) => (
            <li key={n}><span className="b-label">{n}</span><h3>{h}</h3><p>{t}</p></li>
          ))}
        </ol>
      </Section>

      <Section n="09:40" title="Colour" tone="b">
        <p className="b-lede">Warm light at the bottom of the sky, cool air at the top. No blue. Hot colour appears once per view.</p>
        <ul className="b-swatches">
          {Object.entries(tokens.color).map(([k, t]) => {
            const dark = contrast(t.value, c('ink')) < contrast(t.value, c('paper'));
            return (
              <li key={k} style={{ background: t.value, color: dark ? c('paper') : c('ink') }}>
                <b>{t.name}</b><code>{t.value}</code><span>{t.role}</span>
              </li>
            );
          })}
        </ul>
        <h3 className="b-h2">Contrast, computed</h3>
        <ul className="b-contrast">
          {contrastPairs.map(([f, g]) => {
            const r = contrast(c(f), c(g));
            const tag = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Large only' : 'Decor only';
            return (
              <li key={f + g} style={{ background: c(g), color: c(f) }}>
                <span>{tokens.color[f].name} on {tokens.color[g].name}</span>
                <code>{r.toFixed(2)}:1 {tag}</code>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section n="12:00" title="Type" tone="c">
        <p className="b-lede">
          Three voices. <b>Fraunces</b> (soft axis at 100) is warm and old-fashioned like a library book left in the sun.{' '}
          <b>Hanken Grotesk</b> reads plainly. <b>DM Mono</b> is the system whispering, like a Control Panel.
        </p>
        <div className="b-type">
          {scale.map(([k, f, size, wt, st, sample]) => (
            <div key={k} className="b-type-row">
              <span className="b-label">{k} / {tokens.font[f].value} / {tokens.size[k].value}</span>
              <p className={`b-sample b-sample--${f}`} style={{ fontSize: size, fontWeight: wt, fontStyle: st }}>{sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n="15:30" title="Shape & light" tone="d">
        <div className="b-shapes">
          <div className="b-arch"><span className="b-label">arch<br />the only big curve</span></div>
          <div className="b-pill"><span className="b-label">pill</span></div>
          <div className="b-disc"><span className="b-label">orb</span></div>
        </div>
        <p className="b-lede">Corners are not rounded; skies are. Containers do not exist unless they are windows (arch top, flat sill). Everything else is a pill, a disc, or a line.</p>
        <h3 className="b-h2">Altitude, not elevation</h3>
        <ol className="b-levels">
          {levels.map(([h, t], i) => (
            <li key={h} style={{ '--b-i': i }}><b>{h}</b><span>{t}</span></li>
          ))}
        </ol>
      </Section>

      <Section n="17:45" title="Motion" tone="e">
        <ul className="b-motion">
          {motions.map(([h, k, t]) => (
            <li key={h}>
              <i className={`b-m b-m--${k}`} />
              <div><b>{h}</b> <code>{tokens.motion[k].value}</code><p>{t}</p></div>
            </li>
          ))}
        </ul>
        <p className="b-label">easing {tokens.motion.ease.value}. never bounce, never snap.</p>

        <h3 className="b-h2">Poke around</h3>
        <p className="b-lede">
          The sun at the top of the sheet is a button. Each poke moves the day on: dawn, noon, dusk, night. The fifth poke
          goes somewhere nobody asked: an eclipse. Rule: every page gets one thing like this. It is never labelled, never
          rewarded with points, and always safe to ignore. {found ? 'You have found it already.' : ''}
        </p>
      </Section>

      <div className="b-sunset" aria-hidden="true" />

      <Section n="19:30" title="Parts" tone="n">
        <p className="b-lede">Six vectors. Copy one, paste into Figma, it lands as editable shapes with gradients. Colours are baked in.</p>
        <ul className="b-parts">
          {parts.map((p) => (
            <li key={p.id}>
              <div
                className="b-stage"
                ref={(el) => { partRefs.current[p.id] = el && el.querySelector('svg'); }}
              >
                {p.svg}
              </div>
              <b>{p.name}</b>
              <p>{p.note}</p>
              <button type="button" className="b-link" onClick={() => copyPart(p)}>Copy SVG</button>
            </li>
          ))}
        </ul>
        <h3 className="b-h2">Figma recipes</h3>
        <p className="b-lede">Anything CSS can do and an SVG cannot. Build these once as components.</p>
        <dl className="b-recipes">
          {recipes.map(([h, t]) => (<div key={h}><dt>{h}</dt><dd>{t}</dd></div>))}
        </dl>
      </Section>

      <Section n="21:00" title="Voice" tone="n">
        <p className="b-lede">Plain, unhurried, slightly amused. Speaks like someone who has left the room so you can look around.</p>
        <ul className="b-voice">
          {voice.map(([d, n]) => (
            <li key={d}><p className="b-do"><span className="b-label">do</span>{d}</p><p className="b-dont"><span className="b-label">don&rsquo;t</span>{n}</p></li>
          ))}
        </ul>
      </Section>

      <Section n="23:55" title="Export" tone="n">
        <p className="b-lede">Both files are built from one tokens object. Colour, type, radius, motion and haze come across.</p>
        <div className="b-actions">
          <button type="button" className="b-btn" onClick={() => { downloadFile('slow-horizon.tokens.json', toTokensStudio()); say('Tokens file is on its way.'); }}>Download Tokens Studio JSON</button>
          <button type="button" className="b-btn" onClick={() => run(copyVars, 'CSS variables copied.')}>Copy CSS variables</button>
        </div>
        <pre className="b-pre">{toCssVars().split('\n').slice(0, 9).join('\n')}{'\n  ...'}</pre>
      </Section>

      <div className="b-end" aria-hidden="true" />
      <div className={`b-toast${toast ? ' is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}

function Section({ n, title, tone, children }) {
  return (
    <section className={`b-sec b-sec--${tone}`}>
      <div className="b-sec-head">
        <span className="b-label b-time">{n}</span>
        <h2>{title}</h2>
      </div>
      <div className="b-sec-body">{children}</div>
    </section>
  );
}
