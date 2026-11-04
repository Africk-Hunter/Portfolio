// Single source of truth for the Windowsill language.
// The page CSS variables, the Tokens Studio JSON and the CSS export are all generated from here.

export const colors = [
  { name: 'milk', hex: '#F6F8F2', role: 'Ground. The page, the sill.' },
  { name: 'rinse', hex: '#BFEDE6', role: 'Aqua wash. Fills, hover pools, quiet panels.' },
  { name: 'chlorophyll', hex: '#2FBF7A', role: 'Primary gel. Buttons and anything you are meant to press.' },
  { name: 'pool', hex: '#3B6FE0', role: 'Links, focus rings, selected state.' },
  { name: 'lemonade', hex: '#FFE27A', role: 'Warm bloom and highlights. Light coming through the window.' },
  { name: 'sticker', hex: '#FF5A4A', role: 'The one loud colour. Pokeables, badges, a single thing per screen.' },
  { name: 'ink', hex: '#16324A', role: 'Text and outlines. Never pure black.' },
];

export const type = {
  display: { family: "'Bagel Fat One', 'Arial Rounded MT Bold', sans-serif", use: 'Short words only. Always with a sticker outline.' },
  body: { family: "'Figtree', 'Segoe UI', sans-serif", use: 'Everything you read.' },
  system: { family: "'DM Mono', 'Consolas', monospace", use: 'Title bars, hints, pokeable labels.' },
};

// Gloss is built from layers, never a single white band. Keep each layer subtle.
export const gloss = [
  ['Body', 'Flat colour. No bright gradient fill.'],
  ['Depth', 'Ink gradient over the body: 0% at the top to 22% at the bottom.'],
  ['Sheen', 'A lens on the top half with a curved lower edge. White 70% to 4%, top to bottom.'],
  ['Bounce', 'A thin crescent at the bottom edge, white 28% fading up. Light bouncing off the sill.'],
  ['Edge', '1px white at 45% just inside a 2px Ink rim.'],
];

export const scale = [
  { name: 'sticker-xl', size: 72, line: 0.95, font: 'display', sample: 'Hello' },
  { name: 'sticker-l', size: 44, line: 1, font: 'display', sample: 'Come on in' },
  { name: 'title', size: 28, line: 1.15, font: 'body', weight: 800, sample: 'Pick something up' },
  { name: 'body', size: 17, line: 1.55, font: 'body', weight: 500, sample: 'Nothing here is keeping score.' },
  { name: 'small', size: 14, line: 1.45, font: 'body', weight: 600, sample: 'Takes about a minute' },
  { name: 'system', size: 12, line: 1.3, font: 'system', weight: 500, sample: 'C:\\sill\\readme.txt' },
];

export const radii = [
  { name: 'pebble', px: 14, note: 'Inputs, chips' },
  { name: 'bead', px: 28, note: 'Cards, windows' },
  { name: 'orb', px: 999, note: 'Buttons, badges, anything pressable' },
];

// Light always comes from the window: top-left, warm. Shadows fall bottom-right, cool.
export const elevation = [
  { name: 'rest', css: '0 1px 0 rgba(255,255,255,.9) inset, 0 8px 16px -8px rgba(22,50,74,.3), 0 1px 2px rgba(22,50,74,.2)' },
  { name: 'lifted', css: '0 1px 0 #fff inset, 0 14px 28px -10px rgba(22,50,74,.34)' },
  { name: 'held', css: '0 2px 6px rgba(22,50,74,.3) inset, 0 1px 0 rgba(255,255,255,.6)' },
];

export const motion = [
  { name: 'breathe', value: '6s ease-in-out infinite', note: 'Idle. Scale 1 to 1.02. Everything alive does this, out of phase.' },
  { name: 'settle', value: '420ms cubic-bezier(.3,1.5,.5,1)', note: 'Things land with one soft overshoot.' },
  { name: 'drift', value: '40s linear infinite', note: 'Background bloom wandering. Never faster.' },
];

export const voice = [
  { say: 'Not yet.', notThis: 'Error 404' },
  { say: 'Pick it up and see.', notThis: 'Click here' },
  { say: 'Take your time.', notThis: 'Loading…' },
  { say: 'That one is empty. Try another.', notThis: 'Invalid selection' },
];

export const principles = [
  ['Daylight, not screen-light', 'Bright milky ground. Light blooms in from the edges. Dark is for ink only.'],
  ['Everything is a bead', 'Swollen, rounded, liquid-filled. A highlight and a soft shadow. Nothing sharp, nothing flat.'],
  ['Idling is the default', 'Slow breathing and drift. No spinners. Waiting should look pleasant.'],
  ['Every surface hides one thing', 'Pokeables: a hover, a double-click or a drag that reveals something small and silly.'],
  ['Nobody keeps score', 'No error states, only not-yet states. Labels say what they do.'],
];

// ---- derived ----

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

export const hexOf = (name) => colors.find((c) => c.name === name).hex;

export const cssVars = () => {
  const v = {};
  colors.forEach((c) => { v[`--ws-${c.name}`] = c.hex; });
  Object.entries(type).forEach(([k, t]) => { v[`--ws-font-${k}`] = t.family; });
  radii.forEach((r) => { v[`--ws-r-${r.name}`] = `${r.px}px`; });
  elevation.forEach((e) => { v[`--ws-e-${e.name}`] = e.css; });
  return v;
};

export const toCss = () => `:root {\n${Object.entries(cssVars()).map(([k, val]) => `  ${k}: ${val};`).join('\n')}\n}\n`;

export const toTokensStudio = () => {
  const color = {};
  colors.forEach((c) => { color[c.name] = { value: c.hex, type: 'color', description: c.role }; });
  const fontFamilies = {};
  Object.entries(type).forEach(([k, t]) => { fontFamilies[k] = { value: t.family.split(',')[0].replace(/'/g, ''), type: 'fontFamilies' }; });
  const fontSize = {};
  scale.forEach((s) => { fontSize[s.name] = { value: String(s.size), type: 'fontSizes' }; });
  const borderRadius = {};
  radii.forEach((r) => { borderRadius[r.name] = { value: String(r.px), type: 'borderRadius' }; });
  const boxShadow = {
    rest: { value: [{ x: 0, y: 6, blur: 14, spread: -6, color: '#16324A47', type: 'dropShadow' }, { x: 0, y: 1, blur: 0, spread: 0, color: '#FFFFFF', type: 'innerShadow' }], type: 'boxShadow' },
    lifted: { value: [{ x: 0, y: 14, blur: 28, spread: -10, color: '#16324A57', type: 'dropShadow' }, { x: 0, y: 1, blur: 0, spread: 0, color: '#FFFFFF', type: 'innerShadow' }], type: 'boxShadow' },
    held: { value: [{ x: 0, y: 2, blur: 6, spread: 0, color: '#16324A4D', type: 'innerShadow' }], type: 'boxShadow' },
  };
  return JSON.stringify({ color, fontFamilies, fontSize, borderRadius, boxShadow }, null, 2);
};
