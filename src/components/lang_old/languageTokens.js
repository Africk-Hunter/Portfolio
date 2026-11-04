// HOMEROOM design language: the single source of truth.
// The /language page renders from this file and the exports (CSS variables,
// Tokens Studio JSON) are generated from it, so what you see is what you copy.

export const colorGroups = [
  {
    group: 'Daylight',
    note: 'Surfaces. Nothing is ever pure white: white is only ever light.',
    items: [
      { key: 'cloud', name: 'Cloud', hex: '#F6FBFF', role: 'Top of the sky, panel highlights' },
      { key: 'haze', name: 'Haze', hex: '#DCEDFF', role: 'Mid-sky, field wells' },
      { key: 'sky', name: 'Sky', hex: '#C4E0FD', role: 'Horizon sky' },
      { key: 'pane', name: 'Pane', hex: '#93C2F6', role: 'Gel midtones, floor shine' },
    ],
  },
  {
    group: 'Water',
    note: 'The cool middle. Secondary text, icons at rest, gel shade.',
    items: [
      { key: 'lagoon', name: 'Lagoon', hex: '#4D84DC', role: 'Gel shade, glow base' },
      { key: 'bluebird', name: 'Bluebird', hex: '#4A6FC9', role: 'Labels, icons at rest' },
      { key: 'dusk', name: 'Dusk', hex: '#5D75B3', role: 'Placeholders, quiet lines' },
    ],
  },
  {
    group: 'Ink',
    note: 'The only dark. There is no black in this language.',
    items: [
      { key: 'slab', name: 'Slab', hex: '#2A3B95', role: 'Top of the slab gradient' },
      { key: 'indigo', name: 'Indigo', hex: '#1C2B7D', role: 'Deep accents' },
      { key: 'ink', name: 'Ink', hex: '#13245E', role: 'All headings, outlines, the slab' },
      { key: 'inkSoft', name: 'Ink Soft', hex: '#2B3D78', role: 'Body copy' },
    ],
  },
  {
    group: 'Warm',
    note: 'One accent, used sparingly. If everything glows, nothing does.',
    items: [
      { key: 'cream', name: 'Cream', hex: '#FFFBE0', role: 'Butter gel highlight' },
      { key: 'butter', name: 'Butter', hex: '#FFD84D', role: 'Names, selected, go' },
      { key: 'amber', name: 'Amber', hex: '#FFB347', role: 'LEDs and glow only' },
    ],
  },
  {
    group: 'Weather',
    note: 'Status only, never decoration. There is no red: a stumble is lilac, not alarming.',
    items: [
      { key: 'mint', name: 'Mint', hex: '#8FE3C8', role: 'Okay' },
      { key: 'mintDeep', name: 'Mint Deep', hex: '#17755F', role: 'Okay, as text' },
      { key: 'lilac', name: 'Lilac', hex: '#B9A8F0', role: 'Hm. (what red would have been)' },
      { key: 'lilacDeep', name: 'Lilac Deep', hex: '#5B48B8', role: 'Hm, as text' },
    ],
  },
];

export const colors = colorGroups.flatMap((g) => g.items);
export const colorByKey = Object.fromEntries(colors.map((c) => [c.key, c]));

// ---------- contrast ----------

const channel = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};

export const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

export const grade = (ratio) => {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'Large only';
  return 'Decor only';
};

// [foreground, background, what it's for]
export const pairs = [
  ['ink', 'cloud', 'Headings and UI on the sky'],
  ['inkSoft', 'cloud', 'Body copy'],
  ['bluebird', 'cloud', 'Labels, secondary text'],
  ['dusk', 'cloud', 'Placeholders'],
  ['butter', 'ink', 'Names and titles on the slab'],
  ['cloud', 'ink', 'Light text on the slab'],
  ['ink', 'butter', 'Text on a go button'],
  ['mintDeep', 'cloud', 'Okay, as text'],
  ['lilacDeep', 'cloud', 'Hm, as text'],
  ['ink', 'mint', 'Text on an okay chip'],
  ['ink', 'lilac', 'Text on a hm chip'],
  ['butter', 'cloud', 'Never text: butter needs an ink outline'],
];

// ---------- glazes (gradients) ----------

export const glazes = [
  {
    key: 'daylight', name: 'Daylight', angle: 180, role: 'The sky. Runs to Sky at the horizon line (63%).',
    stops: [['#F6FBFF', 0], ['#DCEDFF', 40], ['#C4E0FD', 63]],
  },
  {
    key: 'floor', name: 'Floor', angle: 180, role: 'The glossy showroom floor, below the horizon.',
    stops: [['#E9F4FF', 0], ['#B7D8FB', 18], ['#8DBCEF', 60], ['#79ACEA', 100]],
  },
  {
    key: 'gelBlue', name: 'Gel Blue', angle: 180, role: 'Resting ovals and chips.',
    stops: [['#E9F5FF', 0], ['#93C2F6', 52], ['#4D84DC', 100]],
  },
  {
    key: 'gelButter', name: 'Gel Butter', angle: 180, role: 'Selected, go, the seal.',
    stops: [['#FFFBE0', 0], ['#FFE48A', 50], ['#F5B93A', 100]],
  },
  {
    key: 'gelMint', name: 'Gel Mint', angle: 180, role: 'Okay.',
    stops: [['#F0FFF9', 0], ['#8FE3C8', 52], ['#2FB296', 100]],
  },
  {
    key: 'gelLilac', name: 'Gel Lilac', angle: 180, role: 'Hm.',
    stops: [['#F5F1FF', 0], ['#B9A8F0', 52], ['#7F68D9', 100]],
  },
  {
    key: 'slab', name: 'Slab', angle: 180, role: 'The one dark shape. Slab and panel headers.',
    stops: [['#2A3B95', 0], ['#13245E', 100]],
  },
  {
    key: 'glass', name: 'Glass', angle: 160, role: 'Panels. Pair with a 18px blur and 1.4 saturation.',
    stops: [['rgba(255,255,255,0.75)', 0], ['rgba(255,255,255,0.35)', 45], ['rgba(214,234,255,0.45)', 100]],
  },
];

export const glazeCss = (g) =>
  `linear-gradient(${g.angle}deg, ${g.stops.map(([c, p]) => `${c} ${p}%`).join(', ')})`;

// ---------- type ----------

// "Width is volume": one family, Saira, and the wider and heavier it gets,
// the louder it is. Hanken Grotesk is for reading.
export const typeStyles = [
  {
    key: 'shout', name: 'Shout', family: 'Saira', weight: 800, width: 125, italic: true, size: 64, lh: 1,
    track: 0.01, upper: true, look: 'nameplate', role: 'One per screen. Names the thing on display.',
  },
  {
    key: 'announce', name: 'Announce', family: 'Saira', weight: 800, width: 125, italic: true, size: 40, lh: 1,
    track: 0.01, upper: true, look: 'nameplate', role: 'Section names.',
  },
  {
    key: 'plate', name: 'Plate', family: 'Saira', weight: 800, width: 115, italic: true, size: 22, lh: 1.1,
    track: 0.02, upper: true, look: 'plate', role: 'Panel titles. Butter on Ink.',
  },
  {
    key: 'heading', name: 'Heading', family: 'Saira', weight: 700, width: 112, italic: true, size: 30, lh: 1.1,
    track: 0, upper: false, look: 'ink', role: 'Greetings and subheads, in Ink.',
  },
  {
    key: 'spec', name: 'Spec', family: 'Saira', weight: 600, width: 92, italic: false, size: 15, lh: 1.5,
    track: 0, upper: false, look: 'ink', role: 'Values in a spec sheet.',
  },
  {
    key: 'label', name: 'Label', family: 'Saira', weight: 600, width: 100, italic: true, size: 13, lh: 1.2,
    track: 0.18, upper: true, look: 'bluebird', role: 'The slab, nav labels, small caps.',
  },
  {
    key: 'whisper', name: 'Whisper', family: 'Saira', weight: 500, width: 75, italic: true, size: 12, lh: 1.3,
    track: 0.06, upper: false, look: 'dusk', role: 'Hints and captions. The quietest voice.',
  },
  {
    key: 'body', name: 'Body', family: 'Hanken Grotesk', weight: 400, width: 100, italic: false, size: 16, lh: 1.65,
    track: 0, upper: false, look: 'inkSoft', role: 'Everything you read.',
  },
  {
    key: 'bodySmall', name: 'Body Small', family: 'Hanken Grotesk', weight: 400, width: 100, italic: false, size: 14, lh: 1.6,
    track: 0, upper: false, look: 'inkSoft', role: 'Notes and helper lines.',
  },
];

export const typeCss = (t) => ({
  fontFamily: `'${t.family}', sans-serif`,
  fontWeight: t.weight,
  fontStretch: `${t.width}%`,
  fontStyle: t.italic ? 'italic' : 'normal',
  fontSize: t.size,
  lineHeight: t.lh,
  letterSpacing: `${t.track}em`,
  textTransform: t.upper ? 'uppercase' : 'none',
});

// ---------- shape, space, light, motion ----------

export const radii = [
  { key: 'bead', name: 'Bead', value: 999, role: 'Circles and pills. The default for anything you press.' },
  { key: 'oval', name: 'Oval', value: '50%', role: 'Nav. Always 2:1.' },
  { key: 'pebble', name: 'Pebble', value: 28, role: 'Tiles, channels, large surfaces.' },
  { key: 'field', name: 'Field', value: 14, role: 'Inputs and small wells.' },
  { key: 'chip', name: 'Chip', value: 12, role: 'Tiny tags.' },
];

export const cuts = [
  { key: 'cutPanel', name: 'Panel cut', value: 30, role: 'Top-left corner of a glass panel, cut at 45 degrees.' },
  { key: 'cutSlab', name: 'Slab cut', value: 28, role: 'Right edge of the slab, a falling diagonal.' },
];

export const spacing = [4, 8, 12, 16, 24, 32, 48, 72];

export const light = [
  {
    key: 'rest', name: 'Resting', css: '0 4px 10px rgba(30, 70, 150, 0.22)',
    figma: 'Drop shadow: y 4, blur 10, #1E4696 at 22%', role: 'Sitting on the floor.',
  },
  {
    key: 'lift', name: 'Lifted', css: '0 0 16px rgba(110, 180, 255, 0.8)',
    figma: 'Drop shadow: blur 16, #6EB4FF at 80%. Move up 2.', role: 'You are over it.',
  },
  {
    key: 'held', name: 'Held', css: '0 1px 3px rgba(30, 70, 150, 0.3), inset 0 3px 6px rgba(30, 70, 150, 0.25)',
    figma: 'Drop y 1 blur 3 #1E4696 30%. Inner y 3 blur 6 #1E4696 25%. Move down 1.', role: 'You are pressing it.',
  },
  {
    key: 'spot', name: 'Spotlit', css: '0 0 22px rgba(255, 216, 77, 0.8)',
    figma: 'Drop shadow: blur 22, #FFD84D at 80%', role: 'Selected. The thing on the turntable.',
  },
  {
    key: 'focus', name: 'Focus', css: '0 0 0 3px rgba(255, 216, 77, 0.75)',
    figma: 'Stroke outside: 3, #FFD84D at 75%', role: 'Keyboard focus. Always visible, always warm.',
  },
];

export const durations = [
  { key: 'touch', name: 'Touch', ms: 400, role: 'Hover and press. Never snappier than this.' },
  { key: 'settle', name: 'Settle', ms: 700, role: 'Panel and content arriving.' },
  { key: 'swap', name: 'Swap', ms: 900, role: 'The turntable changing objects.' },
  { key: 'blink', name: 'Blink', ms: 3600, role: 'LEDs, looping.' },
  { key: 'breath', name: 'Breath', ms: 6000, role: 'Idle objects breathing, looping.' },
  { key: 'drift', name: 'Drift', ms: 28000, role: 'Ribbons across the sky, looping.' },
];

export const easings = [
  { key: 'settle', name: 'Settle', value: 'cubic-bezier(.2, .7, .2, 1)', role: 'Arrives fast, lands slowly. The default.' },
  { key: 'ease', name: 'Ease', value: 'ease', role: 'Hover and color changes.' },
  { key: 'spring', name: 'Spring', value: 'cubic-bezier(.3, 1.6, .5, 1)', role: 'The Seal only. Nothing else bounces.' },
];

// ---------- exports ----------

const kebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

export const cssVars = () => {
  const v = {};
  colors.forEach((c) => { v[`--${kebab(c.key)}`] = c.hex; });
  glazes.forEach((g) => { v[`--glaze-${kebab(g.key)}`] = glazeCss(g); });
  radii.forEach((r) => { v[`--r-${r.key}`] = typeof r.value === 'number' ? `${r.value}px` : r.value; });
  cuts.forEach((c) => { v[`--${kebab(c.key)}`] = `${c.value}px`; });
  light.forEach((l) => { v[`--light-${l.key}`] = l.css; });
  durations.forEach((d) => { v[`--t-${d.key}`] = `${d.ms}ms`; });
  easings.forEach((e) => { v[`--ease-${e.key}`] = e.value; });
  return v;
};

export const cssText = () =>
  `:root {\n${Object.entries(cssVars()).map(([k, val]) => `  ${k}: ${val};`).join('\n')}\n}\n`;

// Tokens Studio for Figma format (single set).
export const tokensStudio = () => {
  const out = { color: {}, gradient: {}, radius: {}, spacing: {}, shadow: {}, duration: {}, typography: {} };
  colors.forEach((c) => { out.color[c.key] = { value: c.hex, type: 'color', description: c.role }; });
  glazes.forEach((g) => { out.gradient[g.key] = { value: glazeCss(g), type: 'color', description: g.role }; });
  radii.forEach((r) => {
    out.radius[r.key] = { value: String(typeof r.value === 'number' ? r.value : 9999), type: 'borderRadius', description: r.role };
  });
  spacing.forEach((s, i) => { out.spacing[`step${i + 1}`] = { value: String(s), type: 'spacing' }; });
  light.forEach((l) => { out.shadow[l.key] = { value: l.css, type: 'boxShadow', description: `${l.role} Figma: ${l.figma}` }; });
  durations.forEach((d) => { out.duration[d.key] = { value: `${d.ms}ms`, type: 'other', description: d.role }; });
  typeStyles.forEach((t) => {
    out.typography[t.key] = {
      type: 'typography',
      description: `${t.role} Variable axis: Width ${t.width}.${t.italic ? ' Italic.' : ''}`,
      value: {
        fontFamily: t.family,
        fontWeight: String(t.weight),
        fontSize: String(t.size),
        lineHeight: String(t.lh),
        letterSpacing: `${t.track * 100}%`,
        textCase: t.upper ? 'uppercase' : 'none',
      },
    };
  });
  return out;
};
