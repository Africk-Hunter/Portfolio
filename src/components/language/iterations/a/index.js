import React, { useEffect, useRef, useState } from 'react';
import { copyText, downloadFile, contrast, loadFonts } from '../../shared';
import { tokens, cssVarMap, cssText, tokensStudio } from './tokens';
import { parts, recipes } from './parts';
import '../../../../styles/language/iterations/a.scss';

export const meta = { id: 'a', name: 'Clearcase', tagline: 'A 2002 gadget line: moulded jelly buttons, LED lamps, smoked plastic and printed labels.' };
export const fontsHref = 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;700&family=Michroma&family=DotGothic16&display=swap';

const principles = [
  ['Every part has a seam', 'You can always see where one thing ends and the next starts. Nothing is a mystery, so nothing is scary. (98: you always knew where things were.)'],
  ['Press, never submit', 'Buttons are moulded and travel 2px. Pressing is a toy action with a click, not a decision with consequences. (Wii: nothing can go wrong.)'],
  ['Light means ready', 'LEDs report state calmly. Lime is on, teal is linked, red is only standby. No alarms.'],
  ['Nobody is counting', 'No timers, scores or streaks. The idle lamp breathes every 4.2 seconds, because you do not have to hurry.'],
  ['Every unit has a hatch', 'Unscrew the case and something small and silly lives inside. A homework tool with Minesweeper in it.'],
];

const type = [
  ['Display', 'label', 'display', 'CLEARCASE 02'],
  ['Title', 'label', 'title', 'Port panel'],
  ['Label', 'label', 'label', 'POWER / STANDBY / LINK'],
  ['Body', 'body', 'body', 'Plug it in and have a look around. Nothing here bites.'],
  ['LCD', 'lcd', 'lcd', 'TRK 04  00:03:12'],
];

const voice = [
  ['Press the orange one.', 'Click here to proceed to the next step.'],
  ['Saved. Take your time.', 'Success! Do not forget to hurry.'],
  ['Standby. Nothing is wrong.', 'Error 404: you broke it.'],
  ['Open the hatch.', 'Unlock premium content.'],
];

const swatches = [['Tangerine', 'jelly'], ['Port teal', 'port'], ['Standby red', 'standby']];

const ratio = (a, b) => contrast(tokens.color[a].value, tokens.color[b].value);
const pairs = [
  ['graphite', 'shell'], ['ink2', 'shell'], ['graphite', 'jelly'], ['graphite', 'led'],
  ['graphite', 'label'], ['graphite', 'port'], ['shell', 'smoke'], ['led', 'smoke'],
];

const Part = ({ p, onCopy }) => {
  const ref = useRef(null);
  return (
    <figure className="a-part">
      <div className="a-part-stage" ref={ref} dangerouslySetInnerHTML={{ __html: p.svg }} />
      <figcaption>
        <b className="a-label">{p.name}</b>
        <span>{p.note}</span>
        <button type="button" className="a-btn a-btn-small" onClick={() => onCopy(ref.current.innerHTML, `${p.name} SVG copied`)}>Copy SVG</button>
      </figcaption>
    </figure>
  );
};

const Section = ({ n, title, children }) => (
  <section className="a-panel">
    <span className="a-screw a-screw-tl" aria-hidden="true" />
    <span className="a-screw a-screw-tr" aria-hidden="true" />
    <header className="a-panel-head"><span className="a-lcd a-badge">{n}</span><h2 className="a-h2">{title}</h2></header>
    {children}
  </section>
);

export default function ClearcaseSheet() {
  const [toast, setToast] = useState('');
  const [accent, setAccent] = useState(0);
  const [unscrewed, setUnscrewed] = useState([false, false, false, false]);
  const [lamps, setLamps] = useState([false, false, false, false, false, false]);
  const [slide, setSlide] = useState(false);
  const timer = useRef(null);

  useEffect(() => { loadFonts(fontsHref); return () => clearTimeout(timer.current); }, []);

  const say = (m) => { setToast(m); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''), 1800); };
  const copy = async (text, msg) => say((await copyText(text)) ? msg : 'Copy blocked by browser');
  const open = unscrewed.every(Boolean);
  const allLit = lamps.every(Boolean);

  const vars = { ...cssVarMap(), '--a-jelly': tokens.color[swatches[accent][1]].value };
  const gaps = (k) => { const r = ratio(...k); return [r.toFixed(2), r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'Large only' : 'Fail']; };

  return (
    <div className="a-root" style={vars}>
      <div className="a-shell">
        <header className="a-hero">
          <div className="a-hero-top">
            <span className="a-sticker"><b className="a-label">CLEARCASE</b><i /></span>
            <div className="a-lamps" aria-hidden="true"><span className="a-lamp a-lamp-on a-breathe" /><span className="a-lamp a-lamp-teal" /><span className="a-lamp a-lamp-red" /></div>
          </div>
          <h1 className="a-h1">Design language<br />Model 02</h1>
          <p className="a-lede">A product line in software. Every control is a moulded part, every state is a lamp, every label is printed on. Welcoming like a menu that waits for you, hackable like a machine that is yours.</p>
          <div className="a-lcd a-screen" role="status">READY &nbsp;{open ? 'HATCH OPEN' : 'CASE CLOSED'} &nbsp;{String(lamps.filter(Boolean).length).padStart(2, '0')}/06</div>
          <div className="a-swrow">
            <span className="a-label">Jelly colour</span>
            {swatches.map(([n, k], i) => (
              <button key={k} type="button" aria-pressed={accent === i} aria-label={n} className={`a-chip ${accent === i ? 'is-on' : ''}`} style={{ '--c': tokens.color[k].value }} onClick={() => { setAccent(i); say(`${n} jelly`); }} />
            ))}
          </div>
        </header>

        <Section n="01" title="Principles">
          <ol className="a-prin">
            {principles.map(([h, b]) => <li key={h}><b className="a-label">{h}</b><p>{b}</p></li>)}
          </ol>
        </Section>

        <Section n="02" title="Colour: the paint and the plastic">
          <div className="a-tokens">
            {Object.entries(tokens.color).map(([k, v]) => (
              <div className="a-tok" key={k}>
                <i style={{ background: v.value }} />
                <b className="a-label">{k}</b><code className="a-lcd">{v.value}</code><span>{v.role}</span>
              </div>
            ))}
          </div>
          <table className="a-table">
            <caption className="a-label">Text pairs (WCAG)</caption>
            <tbody>
              {pairs.map((k) => { const [r, g] = gaps(k); return (
                <tr key={k.join()}>
                  <td><span className="a-pair" style={{ background: tokens.color[k[1]].value, color: tokens.color[k[0]].value }}>Aa</span></td>
                  <td>{k[0]} on {k[1]}</td><td className="a-lcd">{r}:1</td><td>{g}</td>
                </tr>); })}
            </tbody>
          </table>
          <p className="a-note">Jelly orange takes graphite text, never white. Red is a lamp, not a text colour.</p>
        </Section>

        <Section n="03" title="Type: printed, moulded, lit">
          <div className="a-type">
            {type.map(([n, f, s, sample]) => (
              <div key={n} className="a-type-row">
                <span className="a-label">{n} · {tokens.font[f].value} · {tokens.size[s]}px</span>
                <div className={`a-ty a-ty-${s}`}>{sample}</div>
              </div>
            ))}
          </div>
          <p className="a-note">Michroma is only ever uppercase with 0.08em tracking above 12px. Body never goes under 15px.</p>
        </Section>

        <Section n="04" title="Shape and material">
          <div className="a-shapes">
            {Object.entries(tokens.radius).map(([k, v]) => (
              <div key={k} className="a-shape"><i style={{ borderRadius: k === 'screw' ? '50%' : v }} /><span className="a-label">{k}</span><code className="a-lcd">{v}{k === 'screw' ? '%' : 'px'}</code></div>
            ))}
          </div>
          <div className="a-mats">
            <div className="a-mat a-mat-moulded"><b className="a-label">Moulded</b><span>Raised parts: highlight on top, shade underneath, hard lip, soft cast.</span></div>
            <div className="a-mat a-mat-pressed"><b className="a-label">Recessed</b><span>Troughs and wells. Inputs live here.</span></div>
            <div className="a-mat a-mat-smoke"><b className="a-label">Smoked</b><span>Translucent plum. Displays, hatches.</span></div>
            <div className="a-mat a-mat-glow"><b className="a-label">Lit</b><span>Only LEDs emit light.</span></div>
          </div>
          <p className="a-note">Light comes from top-left, always. Shadows are short and hard first, then soft. Nothing blurs the background except smoked plastic.</p>
        </Section>

        <Section n="05" title="Motion">
          <div className="a-motion">
            <button type="button" className="a-btn" onClick={() => say('Click.')}>Press me</button>
            <span className="a-lamp a-lamp-on a-breathe" aria-hidden="true" />
            <button type="button" className="a-slide" aria-pressed={slide} aria-label="Slide switch" onClick={() => setSlide(!slide)}><i /></button>
          </div>
          <ul className="a-list">
            {Object.entries(tokens.motion).map(([k, v]) => <li key={k}><b className="a-label">{k}</b> <code className="a-lcd">{v.value}</code> {v.role}</li>)}
          </ul>
          <p className="a-note">Parts move like parts: translate, never fade. With reduced motion, lamps hold steady and presses snap.</p>
        </Section>

        <Section n="06" title="Parts: copy as SVG">
          <div className="a-parts">{parts.map((p) => <Part key={p.id} p={p} onCopy={copy} />)}</div>
          <p className="a-note">Paste straight into Figma. They are plain vectors with gradient fills.</p>
        </Section>

        <Section n="07" title="Figma recipes">
          <dl className="a-recipes">
            {recipes.map((r) => <div key={r.n}><dt className="a-label">{r.n}</dt><dd>{r.t}</dd></div>)}
          </dl>
        </Section>

        <Section n="08" title="Voice">
          <div className="a-voice">
            {voice.map(([d, x]) => (
              <div key={d}><p className="a-do"><b className="a-label">Do</b>{d}</p><p className="a-dont"><b className="a-label">Don't</b>{x}</p></div>
            ))}
          </div>
          <p className="a-note">Short, kind, physical verbs: press, slide, open, plug in. Say what the thing is doing, not what you wish the user would do.</p>
        </Section>

        <Section n="09" title="Poke around">
          <p>Every unit ships with a hatch. Find the four screws on this sheet's corners, or use these. Turn all four to open it.</p>
          <div className="a-screws">
            {unscrewed.map((u, i) => (
              <button key={i} type="button" aria-label={`Screw ${i + 1}`} aria-pressed={u} className={`a-bigscrew ${u ? 'is-out' : ''}`} style={{ '--r': `${i * 37 + 20}deg` }} onClick={() => setUnscrewed(unscrewed.map((x, j) => (j === i ? !x : x)))} />
            ))}
          </div>
          <div className={`a-hatch ${open ? 'is-open' : ''}`} aria-hidden={!open}>
            <div className="a-hatch-in">
              <b className="a-label">Service bay</b>
              <p>Six lamps, no rules. Light them all and see.</p>
              <div className="a-lamps">
                {lamps.map((l, i) => (
                  <button key={i} type="button" tabIndex={open ? 0 : -1} aria-label={`Lamp ${i + 1}`} aria-pressed={l} className={`a-lamp a-lamp-btn ${l ? 'a-lamp-on' : ''}`} onClick={() => setLamps(lamps.map((x, j) => (j === i ? !x : x)))} />
                ))}
              </div>
              <p className="a-lcd a-screen">{allLit ? 'ALL GREEN. NOBODY IS KEEPING SCORE.' : 'Waiting. Take your time.'}</p>
            </div>
          </div>
          <p className="a-note">Rule of the language: every surface hides one small thing, and it never has a points counter.</p>
        </Section>

        <Section n="10" title="Export">
          <div className="a-export">
            <button type="button" className="a-btn" onClick={() => { downloadFile('clearcase.tokens.json', JSON.stringify(tokensStudio(), null, 2)); say('Tokens downloaded'); }}>Download Tokens Studio JSON</button>
            <button type="button" className="a-btn a-btn-teal" onClick={() => copy(cssText(), 'CSS variables copied')}>Copy CSS variables</button>
          </div>
        </Section>
      </div>
      <div className={`a-toast ${toast ? 'is-on' : ''}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
