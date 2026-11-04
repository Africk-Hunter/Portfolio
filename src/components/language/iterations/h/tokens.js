// Single source of truth for "Overgrowth". The sheet, the CSS export and the Tokens Studio export all read this.
export const tokens = {
  color: {
    floor: { value: '#1A3526', role: 'Ground. Deep jungle green. The page and the underside of everything.' },
    deep: { value: '#10241A', role: 'Wells, night, the shadowed side of a frond.' },
    canopy: { value: '#24432F', role: 'Panel fill. One step up from the floor.' },
    cream: { value: '#F2ECD2', role: 'All primary text on dark. Warm, never white.' },
    sand: { value: '#DCD3A6', role: 'Secondary text, captions, dim readouts.' },
    lime: { value: '#9BCB5E', role: 'Signal. Veins, edges, links, active, success.' },
    ember: { value: '#D9744A', role: 'The hot contrast. Lamps, warnings, one loud thing per screen.' },
    amber: { value: '#E8A93A', role: 'Buttons and anything you can press.' },
    butter: { value: '#F5DE82', role: 'Highlights on amber, hover, lamp cores.' },
    bark: { value: '#8A5A34', role: 'Plates under buttons, stems, root lines.' },
    orchid: { value: '#6B5A9A', role: 'A rare cool flower. Secret things only.' },
    ink: { value: '#16301F', role: 'Text on lime, amber, butter and ember.' },
  },
  font: {
    display: { value: 'Microgramma D Extended', stack: "'Microgramma D Extended', 'Michroma', 'Eurostile', sans-serif", role: 'Bold, caps, tracked. Titles and labels only.' },
    body: { value: 'Barlow', stack: "'Barlow', system-ui, sans-serif", role: 'Anything you read. Calm, squared, a little industrial.' },
    mono: { value: 'Azeret Mono', stack: "'Azeret Mono', ui-monospace, monospace", role: 'Readouts, hex codes, specimen numbers.' },
  },
  size: { display: 88, h2: 34, h3: 18, body: 17, mono: 13, label: 11 },
  cut: {
    sm: { value: '10px', role: 'Buttons, chips.' },
    md: { value: '22px', role: 'Panels and tiles.' },
    lg: { value: '44px', role: 'Hero frames.' },
  },
  shadow: {
    lamp: {
      role: 'Light from a fruit. Ember and amber. Round things only.',
      layers: [
        { x: 0, y: 0, blur: 14, spread: 2, color: 'rgba(232,169,58,0.7)', inset: false },
        { x: 0, y: 0, blur: 40, spread: 6, color: 'rgba(217,116,74,0.35)', inset: false },
      ],
    },
    vein: {
      role: 'Signal running along a line. Lime.',
      layers: [{ x: 0, y: 0, blur: 12, spread: 0, color: 'rgba(155,203,94,0.6)', inset: false }],
    },
    etch: {
      role: 'Cut into the panel: a faint top edge and a dark floor.',
      layers: [
        { x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(242,236,210,0.12)', inset: true },
        { x: 0, y: -2, blur: 6, spread: 0, color: 'rgba(0,0,0,0.35)', inset: true },
      ],
    },
  },
  motion: {
    grow: { value: '1400ms', role: 'A vine reaching its next node.' },
    sweep: { value: '9000ms', role: 'The scanner arm. One slow lap.' },
    pulse: { value: '3200ms', role: 'Idle lamp glow, in and out.' },
    press: { value: '120ms', role: 'Button travel, 2px down and right.' },
    ease: { value: 'cubic-bezier(.2,.7,.2,1)', role: 'Fast out, slow settle. No bounce: this is machinery.' },
  },
};

const shadowCss = (s) => s.layers
  .map((l) => `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
  .join(', ');

export const shadowOf = (k) => shadowCss(tokens.shadow[k]);

export const cssVarMap = () => {
  const o = {};
  Object.entries(tokens.color).forEach(([k, v]) => { o[`--h-${k}`] = v.value; });
  Object.entries(tokens.font).forEach(([k, v]) => { o[`--h-font-${k}`] = v.stack; });
  Object.entries(tokens.size).forEach(([k, v]) => { o[`--h-size-${k}`] = `${v}px`; });
  Object.entries(tokens.cut).forEach(([k, v]) => { o[`--h-cut-${k}`] = v.value; });
  Object.keys(tokens.shadow).forEach((k) => { o[`--h-shadow-${k}`] = shadowOf(k); });
  Object.entries(tokens.motion).forEach(([k, v]) => { o[`--h-motion-${k}`] = v.value; });
  return o;
};

export const cssText = () => `:root {\n${Object.entries(cssVarMap()).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;

export const tokensStudio = () => {
  const g = { color: {}, fontFamilies: {}, fontSizes: {}, sizing: {}, boxShadow: {}, duration: {} };
  Object.entries(tokens.color).forEach(([k, v]) => { g.color[k] = { value: v.value, type: 'color', description: v.role }; });
  Object.entries(tokens.font).forEach(([k, v]) => { g.fontFamilies[k] = { value: v.value, type: 'fontFamilies', description: v.role }; });
  Object.entries(tokens.size).forEach(([k, v]) => { g.fontSizes[k] = { value: String(v), type: 'fontSizes' }; });
  Object.entries(tokens.cut).forEach(([k, v]) => { g.sizing[`cut-${k}`] = { value: v.value.replace('px', ''), type: 'sizing', description: `${v.role} Chamfer distance on two opposite corners.` }; });
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
  ['cream', 'floor', 'Body on page'],
  ['sand', 'floor', 'Caption on page'],
  ['lime', 'floor', 'Signal and links'],
  ['butter', 'floor', 'Highlight text'],
  ['ember', 'floor', 'Warning text'],
  ['cream', 'canopy', 'Text in a panel'],
  ['ink', 'amber', 'Label on a button'],
  ['ink', 'lime', 'Label on signal'],
  ['ink', 'ember', 'Label on ember'],
];
