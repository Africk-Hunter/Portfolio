// One source of truth. The sheet, the CSS export and the Tokens Studio export all read this.
export const tokens = {
  color: {
    shell: { value: '#EFEBDD', role: 'Bone ABS. Page surface, the plastic everything is made of.' },
    seam: { value: '#CFC8B4', role: 'Panel seams, dividers, recessed troughs.' },
    graphite: { value: '#23262B', role: 'Printed ink. All body text and label text.' },
    ink2: { value: '#5A574D', role: 'Secondary printed text, captions, serial numbers.' },
    smoke: { value: '#3A3340', role: 'Smoked plum translucent plastic. Dark panels, displays.' },
    jelly: { value: '#FF6B2C', role: 'Tangerine jelly. THE button colour; one per view.' },
    led: { value: '#A6E22E', role: 'LED lime. Ready, on, done, good.' },
    port: { value: '#12BFAE', role: 'Port teal. Links, connected, selected.' },
    label: { value: '#FFD23F', role: 'Label yellow. Stickers, tags, hints, highlights.' },
    standby: { value: '#E5322D', role: 'Standby red. Off or paused; never an error siren.' },
  },
  font: {
    label: { value: 'Michroma', role: 'Moulded labels and headings. Wide, set in caps with tracking.' },
    body: { value: 'Familjen Grotesk', role: 'Manual text. Quirky grotesque, calm and warm.' },
    lcd: { value: 'DotGothic16', role: 'Dot-matrix readouts, serials, numbers.' },
  },
  size: { // px
    display: 40, title: 24, label: 12, body: 17, lcd: 20, caption: 13,
  },
  radius: { chip: 6, button: 16, panel: 24, pill: 999, screw: 50 },
  shadow: {
    moulded: { value: 'inset 0 2px 0 rgba(255,255,255,.7), inset 0 -3px 0 rgba(0,0,0,.18), 0 3px 0 rgba(0,0,0,.22), 0 8px 14px rgba(35,38,43,.22)', role: 'Raised plastic part.' },
    pressed: { value: 'inset 0 3px 6px rgba(0,0,0,.3), 0 1px 0 rgba(255,255,255,.7)', role: 'Pushed in. Also used for troughs.' },
    glow: { value: '0 0 10px 2px rgba(166,226,46,.75)', role: 'LED light spill.' },
  },
  motion: { // ms
    press: { value: '120ms', role: 'Button travel. Springy overshoot, 2px down.' },
    ease: { value: 'cubic-bezier(.3,1.6,.5,1)', role: 'The click curve.' },
    hatch: { value: '480ms', role: 'Panels opening.' },
    breathe: { value: '4200ms', role: 'Idle LED pulse. Slow on purpose.' },
  },
};

const kebab = (s) => s.replace(/([A-Z])/g, '-$1').toLowerCase();

export const cssVarMap = () => {
  const o = {};
  Object.entries(tokens.color).forEach(([k, v]) => { o[`--a-${kebab(k)}`] = v.value; });
  Object.entries(tokens.font).forEach(([k, v]) => { o[`--a-font-${k}`] = `'${v.value}'`; });
  Object.entries(tokens.size).forEach(([k, v]) => { o[`--a-size-${k}`] = `${v}px`; });
  Object.entries(tokens.radius).forEach(([k, v]) => { o[`--a-radius-${k}`] = `${v}${k === 'screw' ? '%' : 'px'}`; });
  Object.entries(tokens.shadow).forEach(([k, v]) => { o[`--a-shadow-${k}`] = v.value; });
  Object.entries(tokens.motion).forEach(([k, v]) => { o[`--a-motion-${k}`] = v.value; });
  return o;
};

export const cssText = () => `:root {\n${Object.entries(cssVarMap()).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;

export const tokensStudio = () => {
  const out = { color: {}, fontFamilies: {}, fontSizes: {}, borderRadius: {}, boxShadow: {}, duration: {} };
  Object.entries(tokens.color).forEach(([k, v]) => { out.color[k] = { value: v.value, type: 'color', description: v.role }; });
  Object.entries(tokens.font).forEach(([k, v]) => { out.fontFamilies[k] = { value: v.value, type: 'fontFamilies', description: v.role }; });
  Object.entries(tokens.size).forEach(([k, v]) => { out.fontSizes[k] = { value: String(v), type: 'fontSizes' }; });
  Object.entries(tokens.radius).forEach(([k, v]) => { out.borderRadius[k] = { value: String(v), type: 'borderRadius' }; });
  out.boxShadow.glow = { value: { x: 0, y: 0, blur: 10, spread: 2, color: 'rgba(166,226,46,0.75)', type: 'dropShadow' }, type: 'boxShadow', description: tokens.shadow.glow.role };
  out.boxShadow.moulded = {
    value: [
      { x: 0, y: 2, blur: 0, spread: 0, color: 'rgba(255,255,255,0.7)', type: 'innerShadow' },
      { x: 0, y: -3, blur: 0, spread: 0, color: 'rgba(0,0,0,0.18)', type: 'innerShadow' },
      { x: 0, y: 3, blur: 0, spread: 0, color: 'rgba(0,0,0,0.22)', type: 'dropShadow' },
      { x: 0, y: 8, blur: 14, spread: 0, color: 'rgba(35,38,43,0.22)', type: 'dropShadow' },
    ],
    type: 'boxShadow',
    description: tokens.shadow.moulded.role,
  };
  out.duration.press = { value: '120ms', type: 'other' };
  out.duration.hatch = { value: '480ms', type: 'other' };
  out.duration.breathe = { value: '4200ms', type: 'other' };
  return { global: out, $themes: [], $metadata: { tokenSetOrder: ['global'] } };
};
