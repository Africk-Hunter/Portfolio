// Single source of truth for "Dewdrop". The sheet, the CSS export and the Tokens Studio export all read this.
export const tokens = {
  color: {
    mist: { value: '#EDF5F7', role: 'Ground. The page. Cool, pale, mostly empty.' },
    haze: { value: '#D5E8EE', role: 'Wells, tracks, quiet panels, the shadowed side of things.' },
    aqua: { value: '#35C2D6', role: 'The glass. Every button and anything you can press.' },
    tide: { value: '#1E5FA8', role: 'Orb rim, links, focus, cast shadows. The deep end of the glass.' },
    ink: { value: '#0E2B36', role: 'All text. Never pure black.' },
    ink2: { value: '#4A6670', role: 'Captions and secondary text.' },
    spark: { value: '#FFD66B', role: 'A catch light. Tiny, once per screen, never a fill.' },
  },
  font: {
    display: { value: 'Bagel Fat One', role: 'Short words only. Big, soft, a little too friendly.' },
    body: { value: 'Outfit', role: 'Everything you read and every label. Round, calm, even.' },
  },
  size: { display: 128, h2: 44, h3: 22, body: 18, small: 14, label: 12 },
  radius: {
    pill: { value: '999px', role: 'Buttons, chips, switches. Anything pressable.' },
    pillow: { value: '44px', role: 'Panes and cards. Swollen, never sharp.' },
    drop: { value: '50%', role: 'Orbs and beads.' },
  },
  shadow: {
    rest: {
      role: 'Inflated glass: top highlight, inner bounce, coloured cast.',
      layers: [
        { x: 0, y: 2, blur: 0, spread: 0, color: 'rgba(255,255,255,0.9)', inset: true },
        { x: 0, y: -10, blur: 16, spread: -6, color: 'rgba(30,95,168,0.28)', inset: true },
        { x: 0, y: 16, blur: 24, spread: -10, color: 'rgba(30,95,168,0.45)', inset: false },
        { x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(30,95,168,0.22)', inset: false },
      ],
    },
    press: {
      role: 'Pushed in. Also tracks and wells.',
      layers: [
        { x: 0, y: 6, blur: 12, spread: 0, color: 'rgba(14,43,54,0.3)', inset: true },
        { x: 0, y: 1, blur: 0, spread: 0, color: 'rgba(255,255,255,0.8)', inset: false },
      ],
    },
    float: {
      role: 'Panes resting above the page. Light edge, long soft cast.',
      layers: [
        { x: 0, y: 2, blur: 0, spread: 0, color: 'rgba(255,255,255,0.95)', inset: true },
        { x: 0, y: 34, blur: 54, spread: -26, color: 'rgba(30,95,168,0.4)', inset: false },
      ],
    },
  },
  motion: {
    breathe: { value: '6000ms', role: 'Idle. Scale 1 to 1.025. The orb does it; nothing else needs to.' },
    squish: { value: '520ms', role: 'A press: flatten, then spring back once.' },
    ease: { value: 'cubic-bezier(.3,1.5,.5,1)', role: 'One soft overshoot, never two.' },
    drift: { value: '30000ms', role: 'The light wandering across the ground. Ambient only.' },
  },
};

const shadowCss = (s) => s.layers
  .map((l) => `${l.inset ? 'inset ' : ''}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`)
  .join(', ');

export const shadowOf = (k) => shadowCss(tokens.shadow[k]);

export const cssVarMap = () => {
  const o = {};
  Object.entries(tokens.color).forEach(([k, v]) => { o[`--g-${k}`] = v.value; });
  Object.entries(tokens.font).forEach(([k, v]) => { o[`--g-font-${k}`] = `'${v.value}'`; });
  Object.entries(tokens.size).forEach(([k, v]) => { o[`--g-size-${k}`] = `${v}px`; });
  Object.entries(tokens.radius).forEach(([k, v]) => { o[`--g-radius-${k}`] = v.value; });
  Object.keys(tokens.shadow).forEach((k) => { o[`--g-shadow-${k}`] = shadowOf(k); });
  Object.entries(tokens.motion).forEach(([k, v]) => { o[`--g-motion-${k}`] = v.value; });
  return o;
};

export const cssText = () => `:root {\n${Object.entries(cssVarMap()).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;

export const tokensStudio = () => {
  const g = { color: {}, fontFamilies: {}, fontSizes: {}, borderRadius: {}, boxShadow: {}, duration: {} };
  Object.entries(tokens.color).forEach(([k, v]) => { g.color[k] = { value: v.value, type: 'color', description: v.role }; });
  Object.entries(tokens.font).forEach(([k, v]) => { g.fontFamilies[k] = { value: v.value, type: 'fontFamilies', description: v.role }; });
  Object.entries(tokens.size).forEach(([k, v]) => { g.fontSizes[k] = { value: String(v), type: 'fontSizes' }; });
  Object.entries(tokens.radius).forEach(([k, v]) => { g.borderRadius[k] = { value: v.value.replace('px', ''), type: 'borderRadius', description: v.role }; });
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
  ['ink', 'mist', 'Body on page'],
  ['ink2', 'mist', 'Caption on page'],
  ['tide', 'mist', 'Links'],
  ['ink', 'haze', 'Text in a well'],
  ['ink', 'aqua', 'Label on glass'],
  ['mist', 'tide', 'Reversed on tide'],
];
