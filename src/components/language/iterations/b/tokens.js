// Single source of truth for the "Slow Horizon" language.
// The sheet, the CSS-variable export and the Tokens Studio export all read this object.

export const tokens = {
  color: {
    ink: { value: '#2B2338', name: 'Dusk Ink', role: 'Text on any light sky. Never pure black.' },
    quiet: { value: '#6B5F7E', name: 'Quiet Ink', role: 'Secondary text, captions, mono labels on light.' },
    paper: { value: '#FFF6EA', name: 'Milk Haze', role: 'The page itself. Warm, never white.' },
    apricot: { value: '#FFB77A', name: 'Apricot Hour', role: 'Warm haze near the horizon. Fills and glow, not text.' },
    sun: { value: '#FF6F59', name: 'Low Sun', role: 'The one hot colour. Big shapes and large display type only.' },
    sunDeep: { value: '#B2392B', name: 'Low Sun Deep', role: 'Links and small accents on Milk Haze.' },
    lilac: { value: '#B9A6E8', name: 'Lilac Smog', role: 'Distant air. Backgrounds between two warm skies.' },
    sea: { value: '#7FD8C0', name: 'Sea Glass', role: 'Cool counterweight. Success, noon sky, links on night.' },
    flare: { value: '#FFE27A', name: 'Flare Yellow', role: 'Light sources only: sun, sparkle, focus ring on night.' },
    night: { value: '#1B1530', name: 'Night Plum', role: 'The dark sky. Not black, never black.' },
    moon: { value: '#F6EBDD', name: 'Moon Milk', role: 'Text on Night Plum.' },
  },
  font: {
    display: { value: 'Fraunces', role: 'Headlines, numerals, the voice. Soft axis at 100.' },
    text: { value: 'Hanken Grotesk', role: 'Paragraphs and UI copy.' },
    label: { value: 'DM Mono', role: 'Times, hex codes, system-ish whispers.' },
  },
  size: {
    sky: { value: '8rem', role: 'Once per page. The sky word.' },
    h1: { value: '4rem', role: 'Section headlines.' },
    h2: { value: '2rem', role: 'Sub-heads, italic.' },
    body: { value: '1.0625rem', role: 'Reading text, 1.65 leading.' },
    label: { value: '0.75rem', role: 'Mono, uppercase, +0.12em tracking.' },
  },
  radius: {
    arch: { value: '50% 50% 0 0 / 22% 22% 0 0', role: 'Window tops. The only large curve.' },
    pill: { value: '999px', role: 'Tags and the tiny buttons.' },
    orb: { value: '50%', role: 'Sun, moon, flares.' },
  },
  motion: {
    drift: { value: '60s', role: 'Clouds crossing. Ambient only.' },
    dawn: { value: '1400ms', role: 'Scene changes (sky colour, sun position).' },
    breath: { value: '5s', role: 'Idle glow pulse.' },
    ease: { value: 'cubic-bezier(.3,.1,.2,1)', role: 'Slow in, slower out. Nothing bounces.' },
  },
  haze: {
    low: { value: '0 0 24px rgba(255,226,122,.45)', role: 'Text glow on night.' },
    high: { value: '0 0 90px 20px rgba(255,183,122,.55)', role: 'Sun halo.' },
  },
};

const kebab = (s) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export const toCssVars = () => {
  const lines = [];
  Object.entries(tokens).forEach(([group, items]) => {
    Object.entries(items).forEach(([k, t]) => {
      const v = group === 'font' ? `'${t.value}', ${k === 'display' ? 'serif' : k === 'label' ? 'monospace' : 'sans-serif'}` : t.value;
      lines.push(`  --sh-${group}-${kebab(k)}: ${v};`);
    });
  });
  return `:root {\n${lines.join('\n')}\n}`;
};

const typeFor = { color: 'color', font: 'fontFamilies', size: 'fontSizes', radius: 'borderRadius', motion: 'other', haze: 'boxShadow' };

export const toTokensStudio = () => {
  const global = {};
  Object.entries(tokens).forEach(([group, items]) => {
    global[group] = {};
    Object.entries(items).forEach(([k, t]) => {
      global[group][k] = { value: t.value, type: typeFor[group], description: t.name ? `${t.name}. ${t.role}` : t.role };
    });
  });
  return JSON.stringify({ global, $themes: [], $metadata: { tokenSetOrder: ['global'] } }, null, 2);
};

export const times = ['dawn', 'noon', 'dusk', 'night', 'eclipse'];
export const timeNotes = {
  dawn: 'Dawn. Nobody is up yet but you.',
  noon: 'Noon. Everything is easy to see.',
  dusk: 'Dusk. The day is allowed to end.',
  night: 'Night. The stars are not counting.',
  eclipse: 'Eclipse. You found the odd one. Nobody saw.',
};
