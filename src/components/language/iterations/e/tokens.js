// Single source of truth for the "Pondlife" language. Everything exported is generated from this.
export const tokens = {
  color: {
    'birch-milk': { value: '#F6F1E3', role: 'Page ground. Warm, never white.' },
    'dew': { value: '#E2EAD0', role: 'Resting surface, wet-leaf pale.' },
    'lichen': { value: '#C5D77E', role: 'Primary growth colour: buttons, active, "alive".' },
    'seaglass': { value: '#79D4C0', role: 'Water, focus, secondary glow.' },
    'kelp': { value: '#34502B', role: 'Deep text-green, links, headings on pale.' },
    'tannin': { value: '#A85A19', role: 'Pond-tea amber: warmth, highlights, hover.' },
    'koi': { value: '#F2512B', role: 'The one loud thing per screen. Large or icon only.' },
    'jelly': { value: '#F4B6CF', role: 'Soft accents, blossoms, playful secrets.' },
    'peat': { value: '#261E16', role: 'Ink. All body text.' },
    'deep-pond': { value: '#17261A', role: 'Night panels, code, the underside of things.' },
  },
  radius: {
    pebble: { value: '58% 42% 55% 45% / 46% 54% 46% 54%', role: 'Cards, patches: round but never a circle.' },
    puddle: { value: '38% 62% 63% 37% / 41% 44% 56% 59%', role: 'Hero blobs, badges.' },
    leaf: { value: '6px 80px 6px 80px', role: 'Tags, chips, small labels.' },
    bud: { value: '28px 38px 30px 42px / 36px 28px 40px 30px', role: 'Buttons and inputs.' },
  },
  font: {
    display: { value: 'Fraunces', role: 'Headlines. SOFT 100, WONK 1: soft-shouldered, slightly leaning.' },
    body: { value: 'Bricolage Grotesque', role: 'Everything you read. Friendly, uneven, human.' },
    mono: { value: 'Spline Sans Mono', role: 'Labels, hex values, instructions.' },
  },
  motion: {
    sway: { value: '7s ease-in-out infinite', role: 'Idle: parts rock a few degrees, like reeds.' },
    bloom: { value: '650ms cubic-bezier(.34,1.56,.64,1)', role: 'Appear / hover: overshoots, then settles.' },
    settle: { value: '900ms cubic-bezier(.2,.9,.3,1)', role: 'Page changes. Slow start of rest.' },
    drift: { value: '16s linear infinite', role: 'Background light and bubbles.' },
  },
  shadow: {
    soil: { value: '0 14px 28px -10px rgba(38,30,22,.35), 0 2px 0 rgba(255,255,255,.7) inset', role: 'Resting object sitting on the ground.' },
    dewdrop: { value: '0 0 0 1px rgba(255,255,255,.7) inset, 0 -10px 18px rgba(121,212,192,.35) inset, 0 8px 20px -8px rgba(23,38,26,.4)', role: 'Glass drops and bubbles.' },
    glow: { value: '0 0 0 4px rgba(121,212,192,.55), 0 0 28px rgba(197,215,126,.7)', role: 'Focus, selection, "alive".' },
  },
};

const flat = () => {
  const out = [];
  Object.entries(tokens).forEach(([group, items]) => {
    Object.entries(items).forEach(([name, t]) => out.push({ group, name, ...t }));
  });
  return out;
};

export const cssVariables = () => {
  const lines = flat().map((t) => `  --pond-${t.group}-${t.name}: ${t.value};`);
  return `:root {\n${lines.join('\n')}\n}`;
};

const tsType = { color: 'color', radius: 'borderRadius', font: 'fontFamilies', motion: 'other', shadow: 'boxShadow' };

export const tokensStudioJson = () => {
  const global = {};
  Object.entries(tokens).forEach(([group, items]) => {
    global[group] = {};
    Object.entries(items).forEach(([name, t]) => {
      global[group][name] = { value: t.value, type: tsType[group], description: t.role };
    });
  });
  return JSON.stringify({ global, $themes: [], $metaData: { tokenSetOrder: ['global'] } }, null, 2);
};

export const textPairs = [
  ['peat', 'birch-milk', 'Body on page'],
  ['peat', 'dew', 'Body on surface'],
  ['peat', 'lichen', 'Label on growth button'],
  ['peat', 'seaglass', 'Label on water'],
  ['kelp', 'birch-milk', 'Headings / links'],
  ['kelp', 'dew', 'Links on surface'],
  ['birch-milk', 'kelp', 'Reversed on kelp'],
  ['birch-milk', 'deep-pond', 'Night panel'],
  ['lichen', 'deep-pond', 'Accent on night'],
  ['tannin', 'birch-milk', 'Warm accent text'],
  ['koi', 'birch-milk', 'Koi (large / icon only)'],
];
