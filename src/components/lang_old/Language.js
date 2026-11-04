import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  colorByKey,
  colorGroups,
  contrast,
  cssText,
  cssVars,
  cuts,
  durations,
  easings,
  glazeCss,
  glazes,
  grade,
  light,
  pairs,
  radii,
  spacing,
  tokensStudio,
  typeCss,
  typeStyles,
} from './languageTokens';
import {
  Bead,
  GelOval,
  Icon,
  iconList,
  PanelShape,
  Plinth,
  Pointer,
  pointerCss,
  Ribbons,
  Seal,
  SlabShape,
} from './LanguageParts';

/* ---------- copy plumbing ---------- */

const CopyCtx = createContext(() => {});
const useCopy = () => useContext(CopyCtx);

const writeClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (err) {
      return false;
    }
  }
};

const withXmlns = (svg) => (svg.includes('xmlns=') ? svg : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'));

/* ---------- content ---------- */

const sections = [
  ['principles', 'Principles'],
  ['room', 'The room'],
  ['color', 'Color'],
  ['type', 'Type'],
  ['shape', 'Shape and light'],
  ['parts', 'Parts'],
  ['components', 'Components'],
  ['icons', 'Icons'],
  ['motion', 'Motion'],
  ['voice', 'Voice'],
  ['figma', 'Into Figma'],
];

const principles = [
  {
    title: 'Nothing can go wrong',
    body: 'Softness is not decoration. It is how the screen tells you that you are safe and do not have to hurry.',
    rules: [
      'There is no red. A stumble is lilac and says what is still safe.',
      'Every screen has a way home, in the same place.',
      'Nothing is destructive. Things are put away, never deleted.',
    ],
  },
  {
    title: 'Nobody is keeping score',
    body: 'Waiting is part of the room, so it should be pleasant. Nothing counts, expires, or asks for more.',
    rules: [
      'No counters, streaks, badges, ratings, or timers.',
      'Waits are marching blocks and slow light, never a spinner.',
      'Nothing is ever used up: popped things grow back.',
    ],
  },
  {
    title: 'You always know where things are',
    body: 'It was a homework machine, and it was trustworthy because the Start button never moved.',
    rules: [
      'Four zones, always in the same place. Content swaps in them; they never wander.',
      'The slab says where you are. The nameplate says what you are looking at.',
      'One nav, one structure, one accent.',
    ],
  },
  {
    title: 'The machine is yours to poke',
    body: 'Pinball was hiding inside the homework tool. Every object reacts when touched, and a few keep secrets.',
    rules: [
      'Hover lifts, press sinks. No object is dead to the touch.',
      'Secrets are never required and never score points.',
      'Discovery is its own reward, and the copy says so.',
    ],
  },
  {
    title: 'Bright on top, wistful underneath',
    body: 'The light is generous. Underneath it there is one dark shape, an amber LED, and a lamp left on in an empty room.',
    rules: [
      'Surfaces are daylight; the only dark is Ink, and it is used once per screen.',
      'Empty states glow. They are never broken, only quiet.',
      'Copy is gentle and a little lonely, never chirpy.',
    ],
  },
];

const nevers = [
  'Red, or any alarm color',
  'Pure black, or pure white as a fill',
  'Spinners, countdowns, badges, streaks, "3 new"',
  'Title bars, start orbs, taskbars, or any operating-system costume',
  'Beaches, palms, or any postcard scenery',
  'Grain, scanlines, or VHS standing in for composition',
  'Card grids, bento layouts, hero-plus-button',
  'Anything that bounces, except the Seal',
];

const roomZones = [
  ['1', 'Slab', 'Where am I. The one dark shape, with an amber LED and the local time.'],
  ['2', 'Nameplate', 'What am I looking at. Always names what is on the turntable.'],
  ['3', 'Nav', 'Where can I go. Glossy ovals, left, one per room.'],
  ['4', 'Turntable', 'The thing itself. One object at a time, standing on the floor.'],
  ['5', 'Panel', 'The details. Glass, right, the same header every time, body scrolls inside.'],
  ['6', 'Home bead', 'The way back. Bottom left, on every screen, never hidden.'],
];

const voice = [
  ['Welcome', 'Welcome back. Take your time.', 'Get started now!'],
  ['Loading', 'Warming up the screen.', 'Loading, please wait...'],
  ['Empty', 'Nothing here yet. That is okay.', 'No results found.'],
  ['Stumble', 'Hm. That did not go through. Your message is still here.', 'Error: submission failed.'],
  ['Success', 'Sealed and sent.', 'Success! Message delivered!!'],
  ['Link out', 'Opens somewhere else. Your place here is saved.', 'You are leaving this site.'],
  ['Secret', 'You found it. Nothing happens next. That is the prize.', 'Achievement unlocked.'],
  ['Asleep', 'Resting right now. Back soon.', 'Disabled.'],
];

const voiceRules = [
  'Plain words, short sentences, sentence case. No exclamation marks.',
  'Say what is still safe before saying what went wrong.',
  'No urgency words: now, hurry, last chance, only, limited.',
  'Rooms, not pages. Things on the turntable, not items in a list.',
  'A little wistful is allowed. Chirpy is not.',
];

/* ---------- layout pieces ---------- */

const Sheet = ({ id, no, title, lede, children }) => (
  <section id={id} className="lg__sheet" data-section>
    <header className="lg__sheetHead">
      <h2>{title}</h2>
      <span>No. {String(no).padStart(2, '0')}</span>
    </header>
    <div className="lg__sheetBody">
      {lede && <p className="lg__lede">{lede}</p>}
      {children}
    </div>
  </section>
);

const Sub = ({ children, note }) => (
  <div className="lg__sub">
    <h3>{children}</h3>
    {note && <p>{note}</p>}
  </div>
);

const CopyChip = ({ text, label, message, className = '' }) => {
  const copy = useCopy();
  return (
    <button type="button" className={className || 'lg__chip'} onClick={() => copy(text, message || `${label} copied.`)}>
      {label}
    </button>
  );
};

/* ---------- parts ---------- */

const PartCard = ({ name, note, children, tall }) => {
  const copy = useCopy();
  const ref = useRef(null);

  const onCopy = () => {
    const svg = ref.current && ref.current.querySelector('svg');
    if (svg) copy(withXmlns(svg.outerHTML), `${name} copied. Paste it straight into Figma.`);
  };

  return (
    <article className="lg__part">
      <div ref={ref} className={`lg__partArt${tall ? ' lg__partArt--tall' : ''}`}>
        {children}
      </div>
      <footer>
        <div>
          <h4>{name}</h4>
          <p>{note}</p>
        </div>
        <button type="button" className="lg__chip" onClick={onCopy}>Copy SVG</button>
      </footer>
    </article>
  );
};

/* ---------- component demos ---------- */

const Card = ({ title, tag, wide, children, recipe }) => (
  <article className={`lg__card${wide ? ' lg__card--wide' : ''}`}>
    <header>
      <h3>{title}</h3>
      {tag && <span>{tag}</span>}
    </header>
    <div className="lg__cardStage">{children}</div>
    {recipe && (
      <details className="lg__recipe">
        <summary>Figma recipe</summary>
        <ul>{recipe.map((r) => <li key={r}>{r}</li>)}</ul>
      </details>
    )}
  </article>
);

const navItems = [['home', 'About'], ['websites', 'Websites'], ['music', 'Music'], ['contact', 'Contact']];

const NavDemo = () => {
  const [on, setOn] = useState('websites');
  return (
    <div className="lg__navDemo">
      {navItems.map(([icon, label]) => (
        <button
          key={icon}
          type="button"
          className={`lg__navItem${on === icon ? ' isOn' : ''}`}
          aria-pressed={on === icon}
          onClick={() => setOn(icon)}
        >
          <span className="lg__oval"><Icon name={icon} size={30} /></span>
          <span className="lg__navLabel">{label}</span>
        </button>
      ))}
    </div>
  );
};

const Lamp = () => {
  const [on, setOn] = useState(true);
  return (
    <button type="button" role="switch" aria-checked={on} className={`lg__lamp${on ? ' isOn' : ''}`} onClick={() => setOn(!on)}>
      <span className="lg__lampKnob" />
      <span className="lg__lampText">{on ? 'Lights on' : 'Lights down'}</span>
    </button>
  );
};

const PopField = () => {
  const [popped, setPopped] = useState(() => new Set());
  const timers = useRef({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  const pop = (i) => {
    setPopped((prev) => new Set(prev).add(i));
    clearTimeout(timers.current[i]);
    timers.current[i] = setTimeout(() => {
      setPopped((prev) => {
        const next = new Set(prev);
        next.delete(i);
        return next;
      });
    }, 5000 + Math.random() * 4000);
  };

  return (
    <div className="lg__pop">
      {Array.from({ length: 40 }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`lg__bubble${popped.has(i) ? ' isPopped' : ''}`}
          aria-label="Bubble"
          aria-pressed={popped.has(i)}
          onClick={() => pop(i)}
        />
      ))}
    </div>
  );
};

const SealDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg__sealDemo">
      <button type="button" className={`lg__sealBtn${open ? ' isOpen' : ''}`} aria-pressed={open} aria-label="A small gold seal" onClick={() => setOpen((o) => !o)}>
        <Seal id="seal-demo" size={84} />
      </button>
      <p className={`lg__sealNote${open ? ' isOpen' : ''}`}>
        You found it. Nothing happens next. That is the prize.
      </p>
    </div>
  );
};

const channels = [
  ['Websites', 'a'],
  ['Music', 'b'],
  ['Contact', 'c'],
];

const ChannelDemo = () => {
  const [on, setOn] = useState(0);
  return (
    <div className="lg__channels">
      {channels.map(([name, tone], i) => (
        <button key={name} type="button" className={`lg__channel${on === i ? ' isOn' : ''}`} onClick={() => setOn(i)} aria-pressed={on === i}>
          <span className={`lg__screen lg__screen--${tone}`} />
          <span className="lg__channelName">{name}</span>
        </button>
      ))}
    </div>
  );
};

const TideBar = () => (
  <div className="lg__tideStack">
    <div>
      <div className="lg__tide lg__tide--wait" role="progressbar" aria-label="Waiting">
        <span className="lg__tideRun">
          {[0, 1, 2, 3].map((n) => <i key={n} />)}
        </span>
      </div>
      <p className="lg__whisper">Warming up the screen.</p>
    </div>
    <div>
      <div className="lg__tide" role="progressbar" aria-valuenow={11} aria-valuemin={0} aria-valuemax={18}>
        {Array.from({ length: 18 }, (_, n) => <i key={n} className={n < 11 ? 'isOn' : ''} />)}
      </div>
      <p className="lg__whisper">Filling. Blocks, no number.</p>
    </div>
  </div>
);

const CursorZone = () => (
  <div className="lg__cursorZone" style={{ '--cur-rest': pointerCss(false), '--cur-over': pointerCss(true) }}>
    <p className="lg__whisper">Move around in here.</p>
    <button type="button" className="lg__pill">Something live</button>
    <button type="button" className="lg__pill lg__pill--go">Something warm</button>
  </div>
);

/* ---------- main ---------- */

const VolumeDial = () => {
  const [v, setV] = useState(70);
  const width = Math.round(75 + (v / 100) * 50);
  const weight = Math.round(300 + (v / 100) * 600);
  const loud = v > 60;
  return (
    <div className="lg__dial">
      <div
        className={`lg__dialWord${loud ? ' isLoud' : ''}`}
        style={{ fontStretch: `${width}%`, fontWeight: weight, fontSize: `clamp(34px, ${5 + v / 25}vw, 84px)` }}
      >
        Welcome back
      </div>
      <label className="lg__dialControl">
        <span>quiet</span>
        <input type="range" min="0" max="100" value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Volume" />
        <span>loud</span>
      </label>
      <p className="lg__whisper">Saira, Width {width}, Weight {weight}. Same family, turned up.</p>
    </div>
  );
};

const typeSample = {
  shout: 'Hello again',
  announce: 'Collection of Sounds',
  plate: 'Driver Profile',
  heading: "Hi, I'm Hunter",
  spec: 'Built with  Gatsby, React',
  label: 'You are here / Websites',
  whisper: 'choose a section to bring something out',
  body: 'The screen never scrolls. Pick a room from the ovals and its object spins onto the turntable while the glass panel tells you about it.',
  bodySmall: 'Opens somewhere else. Your place here is saved.',
};

const figmaLine = (t) =>
  `${t.name}: ${t.family}, weight ${t.weight}${t.italic ? ' italic' : ''}, width axis ${t.width}, ${t.size}px / ${t.lh}, tracking ${(t.track * 100).toFixed(0)}%${t.upper ? ', ALL CAPS' : ''}`;

const useReplay = () => {
  const [n, setN] = useState(0);
  return [n, () => setN((x) => x + 1)];
};

const MotionDemo = ({ title, note, children, replay }) => (
  <article className="lg__motion">
    <div className="lg__motionStage">{children}</div>
    <footer>
      <div>
        <h4>{title}</h4>
        <p>{note}</p>
      </div>
      {replay && <button type="button" className="lg__chip" onClick={replay}>Replay</button>}
    </footer>
  </article>
);

const LanguagePage = () => {
  const rootRef = useRef(null);
  const [active, setActive] = useState('principles');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);
  const [time, setTime] = useState('');
  const [settleN, replaySettle] = useReplay();
  const [swapN, replaySwap] = useReplay();
  const [springN, replaySpring] = useReplay();

  const copy = useCallback(async (text, message) => {
    const ok = await writeClipboard(text);
    setToast(ok ? message : 'Hm. The clipboard is not available here. Nothing is lost.');
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    const tick = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { root, rootMargin: '-25% 0px -65% 0px' },
    );
    root.querySelectorAll('[data-section]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const downloadTokens = () => {
    const blob = new Blob([JSON.stringify(tokensStudio(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'homeroom-tokens.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const iconCopy = (name) => (e) => {
    const svg = e.currentTarget.querySelector('svg');
    if (svg) copy(withXmlns(svg.outerHTML), `${name} icon copied. Paste it into Figma.`);
  };

  return (
    <CopyCtx.Provider value={copy}>
      <div ref={rootRef} className="lg" style={cssVars()}>
        <div className="lg__backdrop" aria-hidden="true">
          <div className="lg__drift"><Ribbons id="bg-ribbons" /></div>
          <div className="lg__drift lg__drift--b"><Ribbons id="bg-ribbons-2" /></div>
          <div className="lg__floor" />
        </div>

        <div className="lg__wrap">
          <nav className="lg__rail" aria-label="Sections">
            <a className="lg__railHome" href="/" aria-label="Back to the portfolio"><Bead id="rail-bead" size={44} /></a>
            <ol>
              {sections.map(([id, label], i) => (
                <li key={id}>
                  <a href={`#${id}`} className={active === id ? 'isOn' : ''} onClick={go(id)}>
                    <b>{String(i + 1).padStart(2, '0')}</b>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="lg__main">
            {/* ---------- hero ---------- */}
            <header className="lg__hero">
              <div className="lg__slab">
                <span className="lg__led" />
                <span>Spec sheet</span>
                <span className="lg__slabTime">Reno, NV {time}</span>
              </div>
              <h1 className="lg__shout lg__stack">Homeroom</h1>
              <p className="lg__heroLine">Nothing can go wrong in here.</p>
              <p className="lg__heroBody">
                A design language for a place that feels like being welcomed. It borrows a spirit, not a screen: the
                softness of a menu that never rushes you, and the ease of a machine that is yours to poke around in.
                Everything below can be lifted straight into Figma.
              </p>
              <div className="lg__heroActions">
                <button type="button" className="lg__pill lg__pill--go" onClick={() => copy(JSON.stringify(tokensStudio(), null, 2), 'Tokens copied. Paste into Tokens Studio.')}>
                  Copy Figma tokens
                </button>
                <button type="button" className="lg__pill" onClick={downloadTokens}>Download tokens.json</button>
                <button type="button" className="lg__pill" onClick={() => copy(cssText(), 'CSS variables copied.')}>Copy CSS variables</button>
              </div>
              <div className="lg__heroArt" aria-hidden="true">
                <span className="lg__heroPlinth"><Plinth id="hero-plinth" /></span>
                <span className="lg__heroOval lg__heroOval--a"><GelOval id="hero-a" gel="blue" icon="websites" width={150} /></span>
                <span className="lg__heroOval lg__heroOval--b"><GelOval id="hero-b" gel="butter" icon="music" width={150} /></span>
                <span className="lg__heroBead"><Bead id="hero-bead" size={64} /></span>
                <span className="lg__heroSeal"><Seal id="hero-seal" size={64} /></span>
              </div>
            </header>

            {/* ---------- 01 principles ---------- */}
            <Sheet
              id="principles"
              no={1}
              title="Principles"
              lede="Two feelings sit under everything: the Wii menu, where you are welcomed and nobody is keeping score, and the old school computer, where the machine was yours and you always knew where things were."
            >
              <ol className="lg__principles">
                {principles.map((p, i) => (
                  <li key={p.title}>
                    <span className="lg__num lg__stack">{i + 1}</span>
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.body}</p>
                      <ul>{p.rules.map((r) => <li key={r}>{r}</li>)}</ul>
                    </div>
                  </li>
                ))}
              </ol>
              <Sub note="Guardrails. These have each been tried and each broke the feeling.">Never</Sub>
              <ul className="lg__never">
                {nevers.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </Sheet>

            {/* ---------- 02 the room ---------- */}
            <Sheet
              id="room"
              no={2}
              title="The room"
              lede="Every screen is the same showroom. Six things, always in the same place. Content swaps inside them; they never move. Build every layout in Figma on this frame."
            >
              <div className="lg__room">
                <div className="lg__roomMap" aria-label="Diagram of the showroom frame">
                  <div className="lg__roomSky" />
                  <div className="lg__roomFloor" />
                  <div className="lg__roomHorizon"><span>horizon 63%</span></div>
                  <div className="lg__zone lg__zone--slab"><i>1</i></div>
                  <div className="lg__zone lg__zone--name"><i>2</i></div>
                  <div className="lg__zone lg__zone--nav"><i>3</i></div>
                  <div className="lg__zone lg__zone--stage"><i>4</i></div>
                  <div className="lg__zone lg__zone--panel"><i>5</i></div>
                  <div className="lg__zone lg__zone--home"><i>6</i></div>
                </div>
                <dl className="lg__roomLegend">
                  {roomZones.map(([n, name, desc]) => (
                    <div key={n}>
                      <dt><i>{n}</i>{name}</dt>
                      <dd>{desc}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <ul className="lg__facts">
                <li><b>Frame</b>1440 x 900, fixed. No page scroll.</li>
                <li><b>Columns</b>130 | fluid | 33% (min 380)</li>
                <li><b>Gutter</b>2% between, 3% right edge</li>
                <li><b>Horizon</b>63% down. Sky above, floor below.</li>
                <li><b>Turntable</b>Centered in the fluid column, base 9% up from the bottom</li>
                <li><b>Mobile</b>Deferred. Specify desktop first.</li>
              </ul>
            </Sheet>

            {/* ---------- 03 color ---------- */}
            <Sheet
              id="color"
              no={3}
              title="Color"
              lede="Baby blue, not dark blue. Ink is the only dark, butter is the only warm, and the weather colors exist so that nothing ever has to be red. Click any swatch to copy its hex."
            >
              {colorGroups.map((g) => (
                <div key={g.group} className="lg__colorGroup">
                  <Sub note={g.note}>{g.group}</Sub>
                  <div className="lg__swatches">
                    {g.items.map((c) => (
                      <button key={c.key} type="button" className="lg__swatch" onClick={() => copy(c.hex, `${c.name} ${c.hex} copied.`)}>
                        <span className="lg__swatchChip" style={{ background: c.hex }} />
                        <b>{c.name}</b>
                        <code>{c.hex}</code>
                        <small>{c.role}</small>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <Sub note="Gradients are materials, not decoration. Each is a recipe for a surface.">Glazes</Sub>
              <div className="lg__glazes">
                {glazes.map((g) => (
                  <button key={g.key} type="button" className="lg__glaze" onClick={() => copy(glazeCss(g), `${g.name} gradient copied.`)}>
                    <span className="lg__glazeChip" style={{ background: g.key === 'glass' ? `${glazeCss(g)}, repeating-conic-gradient(#C4E0FD 0 25%, #F6FBFF 0 50%) 0 0 / 16px 16px` : glazeCss(g) }} />
                    <b>{g.name}</b>
                    <small>{g.role}</small>
                    <code>{g.stops.map(([c]) => c).join('  ')}</code>
                  </button>
                ))}
              </div>

              <Sub note="Ratios are computed from the hex values above, not estimated. Butter on light is a fail on purpose: it only ever carries text with an Ink outline.">Pairings</Sub>
              <div className="lg__pairs">
                {pairs.map(([fg, bg, use]) => {
                  const ratio = contrast(colorByKey[fg].hex, colorByKey[bg].hex);
                  const g = grade(ratio);
                  return (
                    <div key={`${fg}${bg}`} className="lg__pair">
                      <span className="lg__pairAa" style={{ color: colorByKey[fg].hex, background: colorByKey[bg].hex }}>Aa</span>
                      <div>
                        <b>{colorByKey[fg].name} on {colorByKey[bg].name}</b>
                        <small>{use}</small>
                      </div>
                      <span className={`lg__grade${g === 'Decor only' ? ' isNo' : ''}`}>{ratio.toFixed(1)} {g}</span>
                    </div>
                  );
                })}
              </div>
            </Sheet>

            {/* ---------- 04 type ---------- */}
            <Sheet
              id="type"
              no={4}
              title="Type"
              lede="Two families. Saira does the talking, and its width axis is the volume knob: the wider and heavier it is, the louder. Hanken Grotesk does the reading."
            >
              <VolumeDial />
              <Sub note="Both are free on Google Fonts. In Figma, install Saira as a variable font so the Width axis is available.">Scale</Sub>
              <div className="lg__types">
                {typeStyles.map((t) => (
                  <div key={t.key} className="lg__typeRow">
                    <div className="lg__typeMeta">
                      <b>{t.name}</b>
                      <small>{t.family}</small>
                      <small>{t.weight}{t.italic ? ' italic' : ''}  /  width {t.width}</small>
                      <small>{t.size}/{t.lh}  /  {(t.track * 100).toFixed(0)}%{t.upper ? '  /  caps' : ''}</small>
                      <small>{t.role}</small>
                      <button type="button" className="lg__chip" onClick={() => copy(figmaLine(t), `${t.name} spec copied.`)}>Copy spec</button>
                    </div>
                    <div className="lg__typeSample">
                      <span
                        className={`lg__look lg__look--${t.look}${t.look === 'nameplate' && t.key === 'shout' ? ' lg__stack' : ''}`}
                        style={typeCss(t)}
                      >
                        {typeSample[t.key]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Sub note="The nameplate is the signature: butter fill, Ink outline, then offset layers of Bluebird, Pane and white behind it.">Nameplate</Sub>
              <div className="lg__plates">
                <div>
                  <span className="lg__look lg__look--nameplate" style={typeCss(typeStyles[1])}>Write to me</span>
                  <small className="lg__whisper">Plain: fill, outline, one soft shadow</small>
                </div>
                <div>
                  <span className="lg__look lg__look--nameplate lg__stack" style={typeCss(typeStyles[1])}>Write to me</span>
                  <small className="lg__whisper">Stack: the same, with layered offsets</small>
                </div>
                <div className="lg__plateOnInk">
                  <span className="lg__look" style={{ ...typeCss(typeStyles[2]), color: 'var(--butter)' }}>Driver Profile</span>
                  <small className="lg__whisper">On Ink: butter, no outline</small>
                </div>
              </div>
            </Sheet>

            {/* ---------- 05 shape and light ---------- */}
            <Sheet
              id="shape"
              no={5}
              title="Shape and light"
              lede="Things you press are beads and ovals. Surfaces are pebbles. One shape is allowed a hard diagonal. And there are no shadows, only light: every glow is tinted blue or butter, and nothing contains black."
            >
              <Sub>Radii</Sub>
              <div className="lg__radii">
                {radii.map((r) => (
                  <button key={r.key} type="button" className="lg__radius" onClick={() => copy(String(r.value), `${r.name} radius copied.`)}>
                    <span
                      className={`lg__radiusShape${r.key === 'oval' ? ' isOval' : ''}`}
                      style={{ borderRadius: typeof r.value === 'number' ? Math.min(r.value, 46) : r.value }}
                    />
                    <b>{r.name}</b>
                    <code>{typeof r.value === 'number' ? `${r.value}px` : r.value}</code>
                    <small>{r.role}</small>
                  </button>
                ))}
              </div>

              <Sub note="The only hard edges. Each is a straight diagonal, never a curve.">Cuts</Sub>
              <div className="lg__cuts">
                {cuts.map((c) => (
                  <div key={c.key} className="lg__cut">
                    <span className={`lg__cutShape lg__cutShape--${c.key}`} />
                    <b>{c.name}</b>
                    <code>{c.value}px</code>
                    <small>{c.role}</small>
                  </div>
                ))}
              </div>

              <Sub note="A 4px base. Generous: when unsure, add space.">Spacing</Sub>
              <div className="lg__spacing">
                {spacing.map((s, i) => (
                  <button key={s} type="button" className="lg__space" onClick={() => copy(String(s), `Step ${i + 1}: ${s}px copied.`)}>
                    <span style={{ width: s, height: s }} />
                    <code>{s}</code>
                  </button>
                ))}
              </div>

              <Sub note="Five states of light. An object never changes shape to answer you; it changes how it glows.">Light</Sub>
              <div className="lg__lights">
                {light.map((l) => (
                  <button key={l.key} type="button" className="lg__light" onClick={() => copy(l.css, `${l.name} light copied.`)}>
                    <span className={`lg__lightBead lg__lightBead--${l.key}`} style={{ boxShadow: l.css }} />
                    <b>{l.name}</b>
                    <small>{l.role}</small>
                    <code>{l.figma}</code>
                  </button>
                ))}
              </div>

              <Sub note="Instead of shadows, things standing on the floor are reflected in it, at about a quarter strength.">Floor reflection</Sub>
              <div className="lg__reflect">
                <div className="lg__reflectObj" style={{ WebkitBoxReflect: 'below 2px linear-gradient(transparent 55%, rgba(255,255,255,0.35))' }}>
                  <Bead id="reflect-bead" size={84} />
                </div>
                <div className="lg__reflectFloor" />
                <p className="lg__whisper">
                  Figma: duplicate the object, flip vertically, place 2px below, set opacity 28%, add a layer mask
                  that fades to transparent.
                </p>
              </div>
            </Sheet>

            {/* ---------- 06 parts ---------- */}
            <Sheet
              id="parts"
              no={6}
              title="Parts"
              lede="The signature shapes, drawn as vectors. Press Copy SVG and paste directly onto a Figma canvas: gradients, rims and gloss come with it. Flatten once and build everything else from these."
            >
              <div className="lg__parts">
                <PartCard name="Gel oval, blue" note="Nav at rest. 2:1."><GelOval id="p-blue" gel="blue" icon="websites" /></PartCard>
                <PartCard name="Gel oval, butter" note="Selected. Glows."><GelOval id="p-butter" gel="butter" icon="music" /></PartCard>
                <PartCard name="Gel oval, mint" note="Okay."><GelOval id="p-mint" gel="mint" icon="check" /></PartCard>
                <PartCard name="Gel oval, lilac" note="Hm."><GelOval id="p-lilac" gel="lilac" icon="wait" /></PartCard>
                <PartCard name="Slab" note="The one dark shape."><SlabShape id="p-slab" /></PartCard>
                <PartCard name="Glass panel" note="Cut corner, slab header."><PanelShape id="p-panel" /></PartCard>
                <PartCard name="Bead" note="Home, pips, pointer."><Bead id="p-bead" /></PartCard>
                <PartCard name="Seal" note="The only thing that bounces."><Seal id="p-seal" /></PartCard>
                <PartCard name="Ribbons" note="Light in the sky."><Ribbons id="p-rib" /></PartCard>
                <PartCard name="Plinth" note="The turntable, from above."><Plinth id="p-plinth" /></PartCard>
                <PartCard name="Pointer, rest" note="A small blue bead." tall><Pointer over={false} /></PartCard>
                <PartCard name="Pointer, over" note="Butter, with a halo." tall><Pointer over /></PartCard>
              </div>
            </Sheet>

            {/* ---------- 07 components ---------- */}
            <Sheet
              id="components"
              no={7}
              title="Components"
              lede="Live and touchable. Hover, press, tab to them. Each has a recipe you can follow layer by layer in Figma."
            >
              <div className="lg__cards">
                <Card
                  title="Oval nav"
                  tag="Left column"
                  wide
                  recipe={[
                    'Frame 96 x 48, corner radius 999. Fill: Gel Blue, top to bottom.',
                    'Stroke: 2, inside, white at 95%.',
                    'Inner shadow: y -6, blur 10, #0F2878 at 35%. Drop shadow: y 6, blur 14, #1E4696 at 35%.',
                    'Gloss: ellipse inset 14% left and right, 6% from top, 42% tall. White 90% to 10%, top to bottom.',
                    'Icon at 32% width, Ink stroke 2.4. Label below: Label style, Bluebird.',
                    'On: Gel Butter fill, inner shadow #965A00 at 30%, Spotlit glow. Label turns Ink, weight 700.',
                  ]}
                >
                  <NavDemo />
                </Card>

                <Card
                  title="Pill"
                  tag="Press me"
                  recipe={[
                    'Auto layout, padding 8 x 18, radius 999. Fill white to #B9DAFF, top to bottom.',
                    'Stroke 2 white. Drop shadow: Resting.',
                    'Text: Saira 600 italic, 14, Ink. Hover adds Lifted and moves up 2. Pressed uses Held and moves down 1.',
                    'Go: swap fill for Cream to Butter. One Go per screen.',
                    'Asleep: 55% opacity, and say so in words. Never gray.',
                  ]}
                >
                  <div className="lg__pillRow">
                    <button type="button" className="lg__pill">Rest</button>
                    <button type="button" className="lg__pill is-hover">Lifted</button>
                    <button type="button" className="lg__pill is-held">Held</button>
                    <button type="button" className="lg__pill lg__pill--go">Go</button>
                    <button type="button" className="lg__pill is-asleep" aria-disabled="true">Asleep</button>
                  </div>
                </Card>

                <Card
                  title="Field"
                  tag="Type in me"
                  recipe={[
                    'Radius 14, padding 12 x 16. Fill rgba(210,232,255,0.6) to rgba(255,255,255,0.9).',
                    'Stroke 2 white. Inner shadow: y 3, blur 6, #1E4696 at 15%.',
                    'Placeholder: Dusk, italic. Focus: Focus light, 3px Butter outside stroke.',
                    'Hm state: the focus ring becomes Lilac, and the message sits below in Lilac Deep.',
                  ]}
                >
                  <div className="lg__fields">
                    <input className="lg__field" placeholder="Your name" aria-label="Your name" />
                    <div>
                      <input className="lg__field lg__field--hm" defaultValue="hunter@" aria-label="Email" aria-invalid="true" />
                      <p className="lg__hm">Hm. That email looks unfinished. Nothing has been sent.</p>
                    </div>
                  </div>
                </Card>

                <Card
                  title="Glass panel"
                  tag="Right column"
                  wide
                  recipe={[
                    'Frame 380 wide. Cut the top-left corner 30px at 45 degrees (vector, or boolean subtract a rotated square).',
                    'Fill: Glass glaze. Background blur 18. Inner stroke 1 white at 90%. Inner shadow: y -30, blur 60, #78AAF0 at 18%.',
                    'No drop shadow: a clipped shape clips it, and light should come from inside.',
                    'Header: Slab glaze, padding 14 24 12 38, 3px Butter line under it. Title: Plate style, Butter. Count: Saira italic 14, #C9D8FF.',
                    'Body padding 22 26 26. It scrolls inside; the panel never grows past the frame.',
                  ]}
                >
                  <div className="lg__miniPanel">
                    <div className="lg__miniHead"><h4>Driver Profile</h4><span>1 of 4</span></div>
                    <div className="lg__miniBody">
                      <p>Hi. I build websites, mostly in React, and I like making things that feel kind.</p>
                      <dl>
                        <dt>Based in</dt><dd>Reno, NV</dd>
                        <dt>Built with</dt><dd>Gatsby, React</dd>
                      </dl>
                      <div className="lg__pillRow">
                        <button type="button" className="lg__pill">GitHub</button>
                        <button type="button" className="lg__pill">LinkedIn</button>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card
                  title="Slab"
                  tag="Top left"
                  recipe={[
                    'Height 40. Fill: Slab glaze. Right edge falls 28px on a diagonal.',
                    'Text: Label style, #EAF2FF, 18% tracking. Time or value in Butter.',
                    'LED: 7px circle, Amber, outer glow 8px Amber. It blinks slowly: opacity to 45% over 3.6s.',
                    'One per screen. If there are two, one is wrong.',
                  ]}
                >
                  <div className="lg__slab lg__slab--demo">
                    <span className="lg__led" />
                    <span>Websites</span>
                    <span className="lg__slabTime">3 of 6</span>
                  </div>
                </Card>

                <Card
                  title="Status"
                  tag="No red"
                  recipe={[
                    'Pip: 12px bead in the Gel color, white 2px rim.',
                    'Line: Body Small. The weather word first, in its Deep color: Okay / Heads-up / Hm / Asleep.',
                    'Never an icon of an exclamation mark or an X.',
                  ]}
                >
                  <ul className="lg__status">
                    <li><i className="lg__pip lg__pip--mint" /><b>Okay.</b> Sealed and sent.</li>
                    <li><i className="lg__pip lg__pip--butter" /><b>Heads-up.</b> Opens somewhere else. Your place here is saved.</li>
                    <li><i className="lg__pip lg__pip--lilac" /><b>Hm.</b> That did not go through. Your message is still here.</li>
                    <li><i className="lg__pip lg__pip--haze" /><b>Asleep.</b> Nothing here yet. That is okay.</li>
                  </ul>
                </Card>

                <Card
                  title="Tide bar"
                  tag="Waiting"
                  recipe={[
                    'Track: 22 tall, radius 999, fill Haze to white, 2px white stroke, inner shadow y 3 blur 6 at 15%.',
                    'Blocks: 14 x 14, radius 3, gap 3, Gel Blue. Filling: lit blocks are Gel Blue, the rest Haze.',
                    'Waiting: a run of four blocks marches across, 2.4s linear, looping. Prototype with Smart Animate.',
                    'No spinners anywhere. No percentage.',
                  ]}
                >
                  <TideBar />
                </Card>

                <Card
                  title="Lamp switch"
                  tag="Toggle"
                  recipe={[
                    'Track 76 x 36, radius 999, Gel Blue when on, Haze to white when down. White 2px stroke.',
                    'Knob: 28px Bead, 4px in from the edge. On: slides right, glows Butter.',
                    'Label beside it says the state in words. Never just a colour change.',
                  ]}
                >
                  <Lamp />
                </Card>

                <Card
                  title="Channel"
                  tag="Selectable thing"
                  wide
                  recipe={[
                    'Screen 16:10, radius 22, 3px white stroke, gloss: a diagonal white gradient across the top-left, 55% to 0%.',
                    'Caption below: Label style. Selected: caption turns Ink and the Spotlit glow wraps the screen.',
                    'Reflection beneath it at 28%. Hover lifts it 4px.',
                  ]}
                >
                  <ChannelDemo />
                </Card>

                <Card
                  title="Pop field"
                  tag="Poke around"
                  recipe={[
                    'Grid of 40 beads, 30px, gap 8. Gel Blue with a gloss crescent on top.',
                    'Pressed: shrinks to 82%, fades to 45%, loses its gloss. It grows back after five to nine seconds.',
                    'There is no counter and no end. That is the whole game.',
                  ]}
                >
                  <PopField />
                  <p className="lg__whisper">No score. They grow back.</p>
                </Card>

                <Card
                  title="Seal"
                  tag="A secret"
                  recipe={[
                    'The Seal vector from Parts, 84px. Hidden somewhere unexpected, never in the nav.',
                    'Pressed: scales 0.6 to 1.12 to 1 on the Spring curve, 700ms. The note fades up below it.',
                    'Copy is always the same: nothing happens next, and that is the prize.',
                  ]}
                >
                  <SealDemo />
                </Card>

                <Card
                  title="Pointer"
                  tag="Cursor"
                  recipe={[
                    'Two 40px beads from Parts. Rest: Lagoon with a 3px white rim and a thin Ink halo.',
                    'Over anything live: Butter bead, 3px Ink rim, and a white halo ring. Hot spot at the center.',
                    'Always findable on sky, floor, and Ink.',
                  ]}
                >
                  <CursorZone />
                </Card>
              </div>
            </Sheet>

            {/* ---------- 08 icons ---------- */}
            <Sheet
              id="icons"
              no={8}
              title="Icons"
              lede="Drawn on a 32 grid with a 2.4 stroke, round caps and round joins, no fills. They live in an Ink line on a gel surface. Click one to copy it as SVG."
            >
              <div className="lg__icons">
                {iconList.map(([name, label]) => (
                  <button key={name} type="button" className="lg__icon" onClick={iconCopy(label)}>
                    <span className="lg__iconTile"><Icon name={name} size={32} /></span>
                    <small>{label}</small>
                  </button>
                ))}
              </div>
              <p className="lg__whisper">Keep a 3px clear margin inside the 32 grid. Icons are never colored except Ink, or Cream on a Slab.</p>
            </Sheet>

            {/* ---------- 09 motion ---------- */}
            <Sheet
              id="motion"
              no={9}
              title="Motion"
              lede="Down-tempo. Things drift, settle, and breathe. Nothing is faster than 400ms and nothing bounces except the Seal. Waiting should feel like being in a nice room, not like a queue."
            >
              <div className="lg__motions">
                <MotionDemo title="Settle" note="Arrives fast, lands slowly. 700ms." replay={replaySettle}>
                  <div key={settleN} className="lg__demoSettle">Driver Profile</div>
                </MotionDemo>
                <MotionDemo title="Swap" note="The turntable turns the old object away. 900ms." replay={replaySwap}>
                  <div key={swapN} className="lg__demoSwap"><Icon name="music" size={44} /></div>
                </MotionDemo>
                <MotionDemo title="Breath" note="Idle things breathe. 6s, looping.">
                  <div className="lg__demoBreath"><Bead id="breath-bead" size={64} /></div>
                </MotionDemo>
                <MotionDemo title="Drift" note="Ribbons move across the sky. 28s, looping.">
                  <div className="lg__demoDrift"><Ribbons id="drift-rib" /></div>
                </MotionDemo>
                <MotionDemo title="Spring" note="The Seal alone. 700ms." replay={replaySpring}>
                  <div key={springN} className="lg__demoSpring"><Seal id="spring-seal" size={64} /></div>
                </MotionDemo>
              </div>

              <div className="lg__tables">
                <table>
                  <caption>Durations</caption>
                  <tbody>
                    {durations.map((d) => (
                      <tr key={d.key}>
                        <th>{d.name}</th>
                        <td><button type="button" className="lg__link" onClick={() => copy(`${d.ms}ms`, `${d.name} ${d.ms}ms copied.`)}>{d.ms >= 1000 ? `${d.ms / 1000}s` : `${d.ms}ms`}</button></td>
                        <td>{d.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table>
                  <caption>Curves</caption>
                  <tbody>
                    {easings.map((e) => (
                      <tr key={e.key}>
                        <th>{e.name}</th>
                        <td><button type="button" className="lg__link" onClick={() => copy(e.value, `${e.name} curve copied.`)}>{e.value}</button></td>
                        <td>{e.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Sheet>

            {/* ---------- 10 voice ---------- */}
            <Sheet
              id="voice"
              no={10}
              title="Voice"
              lede="Gentle, plain, and a little lonely, like a lamp left on in a quiet house. It says what is still safe before it says what went wrong."
            >
              <div className="lg__voice">
                <div className="lg__voiceHead"><span>Moment</span><span>Say</span><span>Never</span></div>
                {voice.map(([when, say, never]) => (
                  <div key={when} className="lg__voiceRow">
                    <b>{when}</b>
                    <span className="lg__say">{say}</span>
                    <span className="lg__never1">{never}</span>
                  </div>
                ))}
              </div>
              <ul className="lg__rules">
                {voiceRules.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </Sheet>

            {/* ---------- 11 into figma ---------- */}
            <Sheet
              id="figma"
              no={11}
              title="Into Figma"
              lede="Four ways to carry this over, from fastest to most faithful."
            >
              <ol className="lg__steps">
                <li>
                  <h3>Paste the parts</h3>
                  <p>Parts and Icons have Copy SVG buttons. Click, then paste on a Figma canvas. They arrive as editable vectors with gradients and rims intact.</p>
                </li>
                <li>
                  <h3>Import the tokens</h3>
                  <p>Install the Tokens Studio plugin, open Tools, Load from file or paste JSON, and press Create variables. Colors, glazes, radii, spacing, shadows and type arrive named.</p>
                  <div className="lg__heroActions">
                    <CopyChip text={JSON.stringify(tokensStudio(), null, 2)} label="Copy Figma tokens" message="Tokens copied. Paste into Tokens Studio." className="lg__pill lg__pill--go" />
                    <button type="button" className="lg__pill" onClick={downloadTokens}>Download tokens.json</button>
                  </div>
                </li>
                <li>
                  <h3>Install the fonts</h3>
                  <p>Saira (variable, with the Width axis) and Hanken Grotesk, both from Google Fonts. Set Saira width by hand: Figma shows it as the Width slider on variable fonts.</p>
                </li>
                <li>
                  <h3>Follow the recipes</h3>
                  <p>Glass, glow and gloss do not copy as vectors, so every component has a layer-by-layer Figma recipe. Build the Oval once, make it a component with Rest, Hover, On variants, and reuse it.</p>
                </li>
              </ol>
              <div className="lg__heroActions">
                <button type="button" className="lg__pill" onClick={() => copy(cssText(), 'CSS variables copied.')}>Copy CSS variables</button>
                <a className="lg__pill lg__pill--go" href="/">Back to the portfolio</a>
              </div>
            </Sheet>

            <footer className="lg__foot">
              <span className="lg__led" />
              Homeroom. Take your time.
            </footer>
          </div>
        </div>

        <div className={`lg__toast${toast ? ' isOn' : ''}`} role="status" aria-live="polite">{toast}</div>
      </div>
    </CopyCtx.Provider>
  );
};

export default LanguagePage;
