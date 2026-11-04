// Single source of truth for "Terrarium". The sheet, the CSS export and the Tokens Studio export all read this.
export const tokens = {
  color: {
    shell: { value: '#F2EFDF', role: 'Milky ABS with a green cast. Page surface and every moulded part.' },
    seam: { value: '#D3D1B6', role: 'Seams, troughs, dividers.' },
    peat: { value: '#261E16', role: 'Printed ink. All body and label text.' },
    ink2: { value: '#5E5A48', role: 'Secondary printed text, serials, captions.' },
    kelp: { value: '#34502B', role: 'Deep green: headings on pale, links.' },
    lichen: { value: '#C5D77E', role: 'Default jelly. The button colour; one lit per view.' },
    tangerine: { value: '#FF6B2C', role: 'Alternate jelly, and the one loud thing per screen.' },
    blossom: { value: '#F4B6CF', role: 'Alternate jelly, soft secrets.' },
    seaglass: { value: '#79D4C0', role: 'Water, focus, linked, selected.' },
    firefly: { value: '#D4F23C', role: 'The only thing that emits light. Ready, on, found.' },
    label: { value: '#FFD23F', role: 'Printed label yellow. Stickers, tags, hints.' },
    tank: { value: '#1D3B30', role: 'Smoked green translucent plastic. Displays, tanks, hatches.' },
    deep: { value: '#12251D', role: 'The underside of things. Code, night, LCD ground.' },
  },
  font: {
    display: { value: 'Fraunces', role: 'Headlines. SOFT 100, WONK 1: soft-shouldered and leaning.' },
    body: { value: 'Bricolage Grotesque', role: 'Manual text. Friendly, uneven, human.' },
    lcd: { value: 'DotGothic16', role: 'Dot-matrix readouts, serials, labels, numbers.' },
  },
  size: { display: 96, h2: 36, h3: 22, body: 17, lcd: 16, caption: 13 },
  radius: {
    pebble: { value: '58% 42% 55% 45% / 46% 54% 46% 54%', role: 'Round parts: buttons, chips, dots.' },
    casing: { value: '34px 96px 44px 80px / 54px 44px 88px 48px', role: 'Unit panels. Lumpy, never matching.' },
    bud: { value: '26px 36px 28px 40px / 34px 26px 38px 28px', role: 'Rectangular parts: inputs, labels.' },
    chip: { value: '6px 18px 6px 18px', role: 'Tags and tiny readouts.' },
  },
  shadow: {
    moulded: {
      role: 'Raised plastic: top highlight, underside tint, hard lip, soft cast.',
      layers: [
        { x: 0, y: 2, blur: 0, spread: 0, color: 'rgba(255,255,255,0.75)', inset: true },
        { x: 0, y: -4, blur: 6, spread: 0, color: 'rgba(52,80,43,0.22)', inset: true },
        { x: 0, y: 3, blur: 0, spread: 0, color: 'rgba(38,30,22,0.22)', inset: false },
        { x: 0, y: 12, blur: 18, spread: -8, color: 'rgba(18,37,29,0.4)', inset: false },
      ],
    },
    pressed: {
      role: 'Pushed in. Also troughs and wells.',
      layers: [
        { x: 0, y: 3, blur: 7, spread: 0, color: 'rgba(18,37,29,0.38)', inset: true },
        { x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(255,255,255,0.8)', inset: false },
      ],
    },
    glow: {
      role: 'Firefly light spill. Fireflies only.',
      layers: [
        { x: 0, y: 0, blur: 12, spread: 3, color: 'rgba(212,242,60,0.7)', inset: false },
        { x: 0, y: 0, blur: 30, spread: 0, color: 'rgba(121,212,192,0.4)', inset: false },
      ],
    },
  },
  motion: {
    press: { value: '140ms', role: 'Button travel, 3px, springy.' },
    ease: { value: 'cubic-bezier(.34,1.56,.64,1)', role: 'Overshoots once, never twice.' },
    settle: { value: '900ms', role: 'Panels arriving and resting.' },
    sway: { value: '7000ms', role: 'Idle: parts rock a few degrees like reeds.' },
    breathe: { value: '4200ms', role: 'Idle lamp pulse. Slow on purpose.' },
  },
};

const shadowCss = (s) => s.layers
  .map((l) => `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
  .join(', ');

export const shadowOf = (k) => shadowCss(tokens.shadow[k]);

export const cssVarMap = () => {
  const o = {};
  Object.entries(tokens.color).forEach(([k, v]) => { o[`--f-${k}`] = v.value; });
  Object.entries(tokens.font).forEach(([k, v]) => { o[`--f-font-${k}`] = `'${v.value}'`; });
  Object.entries(tokens.size).forEach(([k, v]) => { o[`--f-size-${k}`] = `${v}px`; });
  Object.entries(tokens.radius).forEach(([k, v]) => { o[`--f-radius-${k}`] = v.value; });
  Object.keys(tokens.shadow).forEach((k) => { o[`--f-shadow-${k}`] = shadowOf(k); });
  Object.entries(tokens.motion).forEach(([k, v]) => { o[`--f-motion-${k}`] = v.value; });
  return o;
};

export const cssText = () => `:root {\n${Object.entries(cssVarMap()).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;

export const tokensStudio = () => {
  const g = { color: {}, fontFamilies: {}, fontSizes: {}, borderRadius: {}, boxShadow: {}, duration: {} };
  Object.entries(tokens.color).forEach(([k, v]) => { g.color[k] = { value: v.value, type: 'color', description: v.role }; });
  Object.entries(tokens.font).forEach(([k, v]) => { g.fontFamilies[k] = { value: v.value, type: 'fontFamilies', description: v.role }; });
  Object.entries(tokens.size).forEach(([k, v]) => { g.fontSizes[k] = { value: String(v), type: 'fontSizes' }; });
  Object.entries(tokens.radius).forEach(([k, v]) => { g.borderRadius[k] = { value: v.value, type: 'borderRadius', description: `${v.role} CSS 8-value form; Figma needs a pen-tool shape.` }; });
  Object.entries(tokens.shadow).forEach(([k, s]) => {
    g.boxShadow[k] = {
      value: s.layers.map((l) => ({ x: l.x, y: l.y, blur: l.blur, spread: l.spread, color: l.color, type: l.inset ? 'innerShadow' : 'dropShadow' })),
      type: 'boxShadow',
      description: s.role,
    };
  });
  Object.entries(tokens.motion).forEach(([k, v]) => { if (/ms$/.test(v.value)) g.duration[k] = { value: v.value, type: 'other', description: v.role }; });
  return { global: g, $themes: [], $metadata: { tokenSetOrder: ['global'] } };
};

export const textPairs = [
  ['peat', 'shell', 'Body on page'],
  ['ink2', 'shell', 'Caption on page'],
  ['kelp', 'shell', 'Headings and links'],
  ['peat', 'lichen', 'Label on default jelly'],
  ['peat', 'tangerine', 'Label on tangerine jelly'],
  ['peat', 'blossom', 'Label on blossom jelly'],
  ['peat', 'seaglass', 'Label on water'],
  ['firefly', 'tank', 'LCD on tank'],
  ['shell', 'tank', 'Reversed on tank'],
  ['label', 'deep', 'Label yellow on deep'],
];
