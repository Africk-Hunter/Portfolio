import React, { useRef, useState } from 'react';
import '../../styles/language/Windowsill.scss';
import {
  colors, type, gloss, scale, radii, elevation, motion, voice, principles,
  contrast, hexOf, cssVars, toCss, toTokensStudio,
} from './windowsillTokens';
import { parts } from './WindowsillParts';

const recipes = [
  ['Body', 'Shape with the flat token colour. Nothing else on it yet.'],
  ['Depth', 'Duplicate the body, fill Ink, then use a linear fill: 0% opacity at the top, 22% at the bottom.'],
  ['Sheen', 'Draw a lens on the top half: pill-shaped top, lower edge a gentle downward curve (pen tool, one anchor each end, pull the handles down ~6px). Linear fill white, 70% at the top to 4% at the bottom. Inset 6px from the rim.'],
  ['Bounce', 'A thin crescent along the bottom inside edge. Linear fill white 28% at the bottom to 0% at the top. About 6px at its fattest.'],
  ['Edge', 'Duplicate the body, shrink 1px, no fill, stroke 1px white at 45%, inside. Then a 2px Ink stroke on the original, inside.'],
  ['Cast shadow', 'Ellipse under the object, Ink at 16%, layer blur 8, nudged 2px right of centre because the window is top-left.'],
  ['Window bloom (page background)', 'Two ellipses, 900px: Lemonade at 55% top-left and Rinse at 70% bottom-right. Layer blur 200. Milk behind.'],
  ['Glass sphere', 'Circle, radial fill: white 0%, Rinse 50%, Pool 100%, centre moved to 38% / 30%. Add a 12px Chlorophyll arc at 55% for the reflected floor, then one sheen lens on top.'],
  ['Sticker text', 'Display font. Stroke 3px Ink, outside. Duplicate, offset 0/5, Ink fill, behind. This is the only intentionally flat, graphic part. Everything else is glossy.'],
];

const Section = ({ id, title, children }) => (
  <section id={id} className="ws-section">
    <h2>{title}</h2>
    {children}
  </section>
);

const download = (name, text, mime) => {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const Windowsill = () => {
  const [toast, setToast] = useState('');
  const [poked, setPoked] = useState(0);
  const timer = useRef(null);
  const vars = cssVars();

  const say = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 1600);
  };

  const copy = async (text, msg = 'Copied. Paste it into Figma.') => {
    try {
      await navigator.clipboard.writeText(text);
      say(msg);
    } catch (e) {
      say('Could not copy. Select it by hand.');
    }
  };

  const pokes = ['Poke it.', 'Again?', 'Ha. Okay.', 'Still here.', 'You found the pinball. (There is no pinball.)'];

  return (
    <div className="ws-root" style={vars}>
      <div className="ws-bloom" aria-hidden="true" />
      <nav className="ws-rail" aria-label="Sections">
        {['principles', 'colour', 'type', 'shape', 'gloss', 'parts', 'recipes', 'motion', 'voice', 'export'].map((s) => (
          <a key={s} href={`#${s}`}>{s}</a>
        ))}
      </nav>

      <div className="ws-page">
        <header className="ws-hero">
          <span className="ws-sys">windowsill / design language v1</span>
          <h1>Windowsill</h1>
          <p>A sunny room with the machine left on for you. Everything is a soft, glossy thing you can pick up, and nothing is asking you for anything.</p>
          <button
            type="button"
            className="ws-pokeable"
            onClick={() => setPoked((n) => n + 1)}
            title="pokeable"
          >
            {poked === 0 ? 'poke me' : pokes[Math.min(poked - 1, pokes.length - 1)]}
          </button>
        </header>

        <Section id="principles" title="Principles">
          <ol className="ws-principles">
            {principles.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ol>
        </Section>

        <Section id="colour" title="Colour">
          <div className="ws-grid">
            {colors.map((c) => (
              <button type="button" key={c.name} className="ws-swatch" onClick={() => copy(c.hex, `${c.hex} copied`)}>
                <span className="ws-chip" style={{ background: c.hex }} />
                <b>{c.name}</b>
                <code>{c.hex}</code>
                <small>{c.role}</small>
              </button>
            ))}
          </div>
          <h3>Text contrast</h3>
          <p className="ws-note">Ink on every light colour. Ink never sits on Pool or Sticker for body text.</p>
          <div className="ws-contrast">
            {['milk', 'rinse', 'chlorophyll', 'lemonade', 'pool', 'sticker'].map((n) => {
              const r = contrast(hexOf('ink'), hexOf(n));
              return (
                <div key={n} style={{ background: hexOf(n) }}>
                  <b>Ink on {n}</b>
                  <span>{r.toFixed(1)}:1 {r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'large only' : 'fail'}</span>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="type" title="Type">
          <div className="ws-grid ws-grid-3">
            {Object.entries(type).map(([k, t]) => (
              <div key={k} className="ws-card">
                <b>{k}</b>
                <div className="ws-fontname" style={{ fontFamily: t.family }}>{t.family.split(',')[0].replace(/'/g, '')}</div>
                <small>{t.use}</small>
              </div>
            ))}
          </div>
          <div className="ws-scale">
            {scale.map((s) => (
              <div key={s.name} className="ws-scale-row">
                <code>{s.name}<br />{s.size}/{s.line}</code>
                <span
                  className={s.font === 'display' ? 'ws-sticker-text' : ''}
                  style={{ fontFamily: type[s.font].family, fontSize: s.size, lineHeight: s.line, fontWeight: s.weight }}
                >
                  {s.sample}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="shape" title="Shape and light">
          <p className="ws-note">Light comes from the window, top-left and warm. Shadows fall bottom-right and cool. Always.</p>
          <div className="ws-grid ws-grid-3">
            {radii.map((r) => (
              <div key={r.name} className="ws-card">
                <div className="ws-radius" style={{ borderRadius: Math.min(r.px, 36) }} />
                <b>{r.name}</b> <code>{r.px === 999 ? 'full' : `${r.px}px`}</code>
                <small>{r.note}</small>
              </div>
            ))}
          </div>
          <div className="ws-grid ws-grid-3">
            {elevation.map((e) => (
              <div key={e.name} className="ws-card">
                <div className="ws-elev" style={{ boxShadow: e.css }} />
                <b>{e.name}</b>
                <code>{e.css}</code>
              </div>
            ))}
          </div>
        </Section>

        <Section id="gloss" title="Gloss">
          <p className="ws-note">Five quiet layers, never one white band. The glow should read as a surface catching light, not a sticker stuck on top.</p>
          <ol className="ws-principles ws-gloss">
            {gloss.map(([t, d]) => <li key={t}><strong>{t}</strong><span>{d}</span></li>)}
          </ol>
        </Section>

        <Section id="parts" title="Parts (copy as SVG)">
          <div className="ws-grid ws-grid-3">
            {parts.map(({ name, C, note }) => (
              <PartCard key={name} name={name} note={note} onCopy={copy}><C /></PartCard>
            ))}
          </div>
        </Section>

        <Section id="recipes" title="Figma recipes (for what SVG cannot carry)">
          <ul className="ws-recipes">
            {recipes.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
          </ul>
        </Section>

        <Section id="motion" title="Motion">
          <div className="ws-grid ws-grid-3">
            {motion.map((m) => (
              <div key={m.name} className="ws-card">
                <div className={`ws-motion-demo ws-motion-${m.name}`} />
                <b>{m.name}</b> <code>{m.value}</code>
                <small>{m.note}</small>
              </div>
            ))}
          </div>
          <p className="ws-note">Respect prefers-reduced-motion: breathing and drift stop, settle becomes instant.</p>
        </Section>

        <Section id="voice" title="Voice">
          <div className="ws-voice">
            {voice.map((v) => (
              <div key={v.say}><span className="ws-say">{v.say}</span><s>{v.notThis}</s></div>
            ))}
          </div>
        </Section>

        <Section id="export" title="Export">
          <div className="ws-actions">
            <button type="button" onClick={() => download('windowsill.tokens.json', toTokensStudio(), 'application/json')}>Download Tokens Studio JSON</button>
            <button type="button" onClick={() => copy(toCss())}>Copy CSS variables</button>
          </div>
          <p className="ws-note">In Figma: Tokens Studio plugin, then Settings, Add new, JSON, paste. Colours become styles; shadows become effect styles.</p>
        </Section>
      </div>

      <div className={`ws-toast ${toast ? 'on' : ''}`} role="status">{toast}</div>
    </div>
  );
};

const PartCard = ({ name, note, onCopy, children }) => {
  const ref = useRef(null);
  return (
    <div className="ws-card ws-part">
      <div className="ws-part-stage" ref={ref}>{children}</div>
      <b>{name}</b>
      <small>{note}</small>
      <button type="button" onClick={() => onCopy(ref.current.innerHTML, `${name} copied. Paste into Figma.`)}>Copy SVG</button>
    </div>
  );
};

export default Windowsill;
