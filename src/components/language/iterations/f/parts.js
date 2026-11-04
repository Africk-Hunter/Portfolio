// Attribute-only SVG strings: no <style>, no CSS vars, no filters, so they paste into Figma cleanly.
// Malleable rules: every body is a <rect rx>, <circle> or <ellipse> (Figma gives it a corner-radius field),
// gradients use objectBoundingBox so they follow the shape when resized, shadows are stacked shapes (not
// filters), and every id becomes a Figma layer name. The old lumpy path versions live on as `lumpy`.
const grille = () => {
  let s = '';
  for (let c = 0; c < 7; c += 1) {
    const x = 14 + c * 11;
    s += `<rect x="${x}" y="12" width="5" height="${30 + (c % 3) * 4}" rx="2.5" fill="#12251D" opacity="0.8"/><rect x="${x}" y="${14 + 30 + (c % 3) * 4}" width="5" height="2" rx="1" fill="#FFFFFF" opacity="0.8"/>`;
  }
  return s;
};

const lumpyParts = [
  {
    id: 'pebble', name: 'Pebble button',
    note: 'Dark lip sits under the cap, so it reads as 8px of travel.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="176" height="76" viewBox="0 0 176 76"><defs><linearGradient id="fpb1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3EFA8"/><stop offset="0.55" stop-color="#C5D77E"/><stop offset="1" stop-color="#9DB555"/></linearGradient><linearGradient id="fpb2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path transform="translate(0 8)" d="M12 32C10 14 36 5 88 5s78 9 76 27c-2 19-18 29-76 29S14 51 12 32Z" fill="#6F8636"/><path d="M12 32C10 14 36 5 88 5s78 9 76 27c-2 19-18 29-76 29S14 51 12 32Z" fill="url(#fpb1)" stroke="#7C9A3E" stroke-width="2"/><path d="M30 20C50 9 126 9 146 20C130 32 48 32 30 20Z" fill="url(#fpb2)"/><rect x="66" y="36" width="44" height="7" rx="3.5" fill="#261E16" opacity="0.8"/></svg>',
  },
  {
    id: 'firefly', name: 'Firefly lamp',
    note: 'Halo is its own circle: blur it in Figma. Wings sit behind the body.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><defs><radialGradient id="ffl1"><stop offset="0" stop-color="#D4F23C" stop-opacity="0.9"/><stop offset="1" stop-color="#D4F23C" stop-opacity="0"/></radialGradient><radialGradient id="ffl2" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#F6FFB0"/><stop offset="0.5" stop-color="#D4F23C"/><stop offset="1" stop-color="#7DA20E"/></radialGradient></defs><circle cx="36" cy="36" r="35" fill="url(#ffl1)"/><ellipse cx="22" cy="25" rx="11" ry="6" fill="#FFFFFF" opacity="0.55" transform="rotate(-24 22 25)"/><ellipse cx="50" cy="25" rx="11" ry="6" fill="#FFFFFF" opacity="0.55" transform="rotate(24 50 25)"/><circle cx="36" cy="38" r="13" fill="url(#ffl2)" stroke="#261E16" stroke-width="3"/><ellipse cx="31" cy="32" rx="5" ry="3" fill="#FFFFFF" opacity="0.85"/></svg>',
  },
  {
    id: 'seed', name: 'Seed switch',
    note: 'Slide the thumb 56px right for ON. The lamp lights with it.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="148" height="64" viewBox="0 0 148 64"><defs><linearGradient id="fsd1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A7A58A"/><stop offset="1" stop-color="#DAD8BF"/></linearGradient><linearGradient id="fsd2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D3D1B6"/></linearGradient></defs><path d="M10 32C10 18 22 14 40 14h68c20 0 30 4 30 18s-10 18-30 18H40C22 50 10 46 10 32Z" fill="url(#fsd1)" stroke="#8A8870" stroke-width="2"/><path d="M12 32C12 18 26 9 42 9s30 8 30 23-14 23-30 23S12 46 12 32Z" fill="url(#fsd2)" stroke="#261E16" stroke-width="2.5"/><path d="M32 22v20M42 20v24M52 22v20" stroke="#261E16" stroke-width="3" stroke-linecap="round" opacity="0.4"/><circle cx="116" cy="32" r="6" fill="#D4F23C" stroke="#261E16" stroke-width="2"/></svg>',
  },
  {
    id: 'tank', name: 'Tank window',
    note: 'Smoked green with a water line. Put LCD text and fireflies inside it.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="208" height="128" viewBox="0 0 208 128"><defs><linearGradient id="ftk1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E5C49"/><stop offset="1" stop-color="#12251D"/></linearGradient><linearGradient id="ftk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.45"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></linearGradient></defs><path d="M16 36C16 16 42 8 104 8s88 8 88 28v52c0 20-30 28-88 28S16 108 16 88Z" fill="url(#ftk1)" stroke="#261E16" stroke-width="3"/><path d="M22 66c20-8 34 8 56 0s34 8 56 0 34 8 52 0" stroke="#79D4C0" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/><path d="M28 26C40 16 80 14 120 16C96 26 56 28 28 26Z" fill="url(#ftk2)"/><circle cx="150" cy="92" r="5" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6"/><circle cx="164" cy="78" r="3" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.5"/></svg>',
  },
  {
    id: 'leafscrew', name: 'Leaf screw',
    note: 'The slot is a leaf. Rotate each one to a different angle.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><defs><radialGradient id="fls1" cx="0.35" cy="0.3" r="0.9"><stop offset="0" stop-color="#FFFFFF"/><stop offset="0.6" stop-color="#D3D1B6"/><stop offset="1" stop-color="#8A8870"/></radialGradient></defs><circle cx="28" cy="28" r="22" fill="url(#fls1)" stroke="#5E5A48" stroke-width="2.5"/><path transform="rotate(30 28 28)" d="M10 28C16 18 36 18 46 28C36 38 16 38 10 28Z" fill="#34502B" opacity="0.85"/><path transform="rotate(30 28 28)" d="M14 28h28" stroke="#F2EFDF" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/></svg>',
  },
  {
    id: 'label', name: 'Leaf label',
    note: 'Printed sticker. Product name in Fraunces on the top line.',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="204" height="84" viewBox="0 0 204 84"><path d="M8 14C8 8 12 6 18 6h112c42 0 66 14 66 36s-24 36-66 36H18C12 78 8 76 8 70Z" fill="#261E16"/><path d="M14 16C14 13 16 12 20 12h110c36 0 58 12 58 30s-22 30-58 30H20c-4 0-6-1-6-4Z" fill="#FFD23F"/><rect x="30" y="42" width="130" height="3" rx="1.5" fill="#79D4C0"/><rect x="30" y="49" width="110" height="3" rx="1.5" fill="#FF6B2C"/><rect x="30" y="56" width="86" height="3" rx="1.5" fill="#34502B"/></svg>',
  },
  {
    id: 'reeds', name: 'Reed grille',
    note: 'Speaker slots of uneven height. Each is a dark bar plus a white lip.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="60" viewBox="0 0 100 60"><path d="M4 18C4 6 20 2 50 2s46 4 46 16v24c0 12-16 16-46 16S4 54 4 42Z" fill="#DAD8BF" stroke="#8A8870" stroke-width="2"/>${grille()}</svg>`,
  },
];

const wrap = (w, h, defs, body, name) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs><g id="${name}">${body}</g></svg>`;
const stops = (list) => list.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('');
const lin = (id, list) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(list)}</linearGradient>`;
const rad = (id, list, extra = '') => `<radialGradient id="${id}"${extra}>${stops(list)}</radialGradient>`;
const gloss = (id) => lin(id, [[0, '#FFFFFF', 0.9], [1, '#FFFFFF', 0]]);

const reeds = () => {
  let s = '';
  for (let c = 0; c < 7; c += 1) {
    const x = 14 + c * 11;
    const h = 30 + (c % 3) * 4;
    s += `<rect id="Slot ${c + 1}" x="${x}" y="12" width="5" height="${h}" rx="2.5" fill="#12251D" opacity="0.8"/><rect id="Slot lip ${c + 1}" x="${x}" y="${44 + (c % 3) * 4}" width="5" height="2" rx="1" fill="#FFFFFF" opacity="0.8"/>`;
  }
  return s;
};

const malleable = [
  {
    id: 'pebble', name: 'Pebble button',
    note: 'Cap, Lip and Gloss are separate rectangles. Change the corner radius on all three together.',
    svg: wrap(176, 76, lin('fpb1', [[0, '#E3EFA8'], [0.55, '#C5D77E'], [1, '#9DB555']]) + gloss('fpb2'),
      '<rect id="Lip" x="4" y="10" width="168" height="62" rx="31" fill="#6F8636"/><rect id="Cap" x="4" y="4" width="168" height="62" rx="31" fill="url(#fpb1)" stroke="#7C9A3E" stroke-width="2"/><rect id="Gloss" x="24" y="9" width="128" height="22" rx="11" fill="url(#fpb2)"/><rect id="Label slot" x="66" y="38" width="44" height="7" rx="3.5" fill="#261E16" opacity="0.8"/>', 'Pebble button'),
  },
  {
    id: 'firefly', name: 'Firefly lamp',
    note: 'Halo is a radial-gradient circle, so no blur is needed. Wings sit behind the body.',
    svg: wrap(72, 72, rad('ffl1', [[0, '#D4F23C', 0.9], [1, '#D4F23C', 0]]) + rad('ffl2', [[0, '#F6FFB0'], [0.5, '#D4F23C'], [1, '#7DA20E']], ' cx="0.4" cy="0.35" r="0.8"'),
      '<circle id="Halo" cx="36" cy="36" r="35" fill="url(#ffl1)"/><ellipse id="Wing left" cx="22" cy="25" rx="11" ry="6" fill="#FFFFFF" opacity="0.55" transform="rotate(-24 22 25)"/><ellipse id="Wing right" cx="50" cy="25" rx="11" ry="6" fill="#FFFFFF" opacity="0.55" transform="rotate(24 50 25)"/><circle id="Body" cx="36" cy="38" r="13" fill="url(#ffl2)" stroke="#261E16" stroke-width="3"/><ellipse id="Glint" cx="31" cy="32" rx="5" ry="3" fill="#FFFFFF" opacity="0.85"/>', 'Firefly lamp'),
  },
  {
    id: 'seed', name: 'Seed switch',
    note: 'Slide Thumb 56px right for ON and move Lamp with it. Stretch Track for a longer switch.',
    svg: wrap(148, 64, lin('fsd1', [[0, '#A7A58A'], [1, '#DAD8BF']]) + lin('fsd2', [[0, '#FFFFFF'], [1, '#D3D1B6']]),
      '<rect id="Track" x="4" y="12" width="140" height="40" rx="20" fill="url(#fsd1)" stroke="#8A8870" stroke-width="2"/><rect id="Thumb" x="8" y="7" width="62" height="50" rx="25" fill="url(#fsd2)" stroke="#261E16" stroke-width="2.5"/><rect id="Grip 1" x="31" y="22" width="3" height="20" rx="1.5" fill="#261E16" opacity="0.4"/><rect id="Grip 2" x="40" y="20" width="3" height="24" rx="1.5" fill="#261E16" opacity="0.4"/><rect id="Grip 3" x="49" y="22" width="3" height="20" rx="1.5" fill="#261E16" opacity="0.4"/><circle id="Lamp" cx="118" cy="32" r="6" fill="#D4F23C" stroke="#261E16" stroke-width="2"/>', 'Seed switch'),
  },
  {
    id: 'tank', name: 'Tank window',
    note: 'Smoked green with a water line and gloss strip. Resize Glass first, then Gloss. Put LCD text and fireflies inside.',
    svg: wrap(208, 128, lin('ftk1', [[0, '#2E5C49'], [1, '#12251D']]) + lin('ftk2', [[0, '#FFFFFF', 0.45], [1, '#FFFFFF', 0]]),
      '<rect id="Glass" x="6" y="4" width="196" height="120" rx="34" fill="url(#ftk1)" stroke="#261E16" stroke-width="3"/><path id="Water line" d="M20 66c20-8 34 8 56 0s34 8 56 0 34 8 56 0" stroke="#79D4C0" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.7"/><rect id="Gloss" x="26" y="14" width="110" height="14" rx="7" fill="url(#ftk2)"/><circle id="Bubble 1" cx="150" cy="92" r="5" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6"/><circle id="Bubble 2" cx="164" cy="78" r="3" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.5"/>', 'Tank window'),
  },
  {
    id: 'leafscrew', name: 'Leaf screw',
    note: 'Head is a circle, the slot is a rotated leaf. Duplicate and rotate Leaf to vary each one.',
    svg: wrap(56, 56, rad('fls1', [[0, '#FFFFFF'], [0.6, '#D3D1B6'], [1, '#8A8870']], ' cx="0.35" cy="0.3" r="0.9"'),
      '<circle id="Head" cx="28" cy="28" r="22" fill="url(#fls1)" stroke="#5E5A48" stroke-width="2.5"/><g id="Leaf" transform="rotate(30 28 28)"><ellipse id="Leaf body" cx="28" cy="28" rx="18" ry="7" fill="#34502B" opacity="0.85"/><rect id="Leaf vein" x="14" y="27.25" width="28" height="1.5" rx="0.75" fill="#F2EFDF" opacity="0.7"/></g>', 'Leaf screw'),
  },
  {
    id: 'label', name: 'Leaf label',
    note: 'Printed sticker: ink outline, yellow paper, three colour bars. Resize Outline and Paper together and keep the 6px gap.',
    svg: wrap(204, 84, '',
      '<rect id="Outline" x="4" y="4" width="196" height="76" rx="26" fill="#261E16"/><rect id="Paper" x="10" y="10" width="184" height="64" rx="20" fill="#FFD23F"/><rect id="Bar seaglass" x="30" y="42" width="130" height="3" rx="1.5" fill="#79D4C0"/><rect id="Bar tangerine" x="30" y="49" width="110" height="3" rx="1.5" fill="#FF6B2C"/><rect id="Bar kelp" x="30" y="56" width="86" height="3" rx="1.5" fill="#34502B"/>', 'Leaf label'),
  },
  {
    id: 'reeds', name: 'Reed grille',
    note: 'Speaker slots of uneven height. Each is a dark bar plus a white lip, all plain rectangles.',
    svg: wrap(100, 60, '', `<rect id="Housing" x="4" y="2" width="92" height="56" rx="20" fill="#DAD8BF" stroke="#8A8870" stroke-width="2"/>${reeds()}`, 'Reed grille'),
  },
  {
    id: 'panel', name: 'Moulded panel',
    note: 'The shell box. Cast and Lip are offset copies of Body: edit Body, then match their size and radius.',
    svg: wrap(248, 152, lin('fpn1', [[0, '#FFFFFF', 0.75], [1, '#FFFFFF', 0]]),
      '<rect id="Cast" x="22" y="26" width="204" height="124" rx="40" fill="#12251D" opacity="0.28"/><rect id="Lip" x="8" y="12" width="232" height="132" rx="40" fill="#261E16" opacity="0.22"/><rect id="Body" x="8" y="6" width="232" height="132" rx="40" fill="#F2EFDF" stroke="#D3D1B6" stroke-width="2"/><rect id="Top light" x="30" y="10" width="188" height="14" rx="7" fill="url(#fpn1)"/><rect id="Underside tint" x="30" y="124" width="188" height="8" rx="4" fill="#34502B" opacity="0.14"/>', 'Moulded panel'),
  },
  {
    id: 'smoked', name: 'Smoked panel',
    note: 'Translucent tank green. In Figma add Background blur 14 to Glass: it is the only thing that blurs what is behind it.',
    svg: wrap(248, 152, lin('fsm1', [[0, '#FFFFFF', 0.4], [1, '#FFFFFF', 0]]),
      '<rect id="Glass" x="6" y="6" width="236" height="140" rx="30" fill="#1D3B30" opacity="0.82" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="1"/><rect id="Top light" x="22" y="12" width="204" height="30" rx="15" fill="url(#fsm1)"/>', 'Smoked panel'),
  },
  {
    id: 'well', name: 'Pressed well',
    note: 'Input and trough. The inner shadow is a gradient rectangle on top, the light catch is a white rectangle underneath.',
    svg: wrap(220, 64, lin('fwl1', [[0, '#12251D', 0.38], [1, '#12251D', 0]]),
      '<rect id="Catch" x="6" y="8" width="208" height="52" rx="22" fill="#FFFFFF" opacity="0.8"/><rect id="Well" x="6" y="4" width="208" height="52" rx="22" fill="#D3D1B6"/><rect id="Inner shadow" x="6" y="4" width="208" height="20" rx="10" fill="url(#fwl1)"/>', 'Pressed well'),
  },
  {
    id: 'lcd', name: 'LCD readout',
    note: 'Deep ground, firefly dot-matrix text. Install DotGothic16 in Figma (it is a Google font).',
    svg: wrap(220, 56, '',
      '<rect id="Screen" x="4" y="4" width="212" height="48" rx="12" fill="#12251D" stroke="#34502B" stroke-width="2"/><text id="Readout" x="20" y="35" font-family="DotGothic16" font-size="16" fill="#D4F23C" letter-spacing="1">READY  03/06</text>', 'LCD readout'),
  },
];

export const parts = malleable.map((p) => {
  const old = lumpyParts.find((l) => l.id === p.id);
  return old ? { ...p, lumpy: old.svg } : p;
});

export const recipes = [
  { n: 'Resizing parts', t: 'Paste, double-click into the frame and select a rectangle: Corner radius is live. Resize with the Move tool, not Scale (K), so strokes stay 2 or 3px. Gradients follow the shape. Every layer is named after its job (Cap, Lip, Gloss).' },
  { n: 'Wet jelly', t: 'Fill linear 180deg #E3EFA8 > #C5D77E > #9DB555. Stroke 2 inside #7C9A3E. Duplicate the shape, move it 8px down, fill #6F8636, send behind (the lip). Add a lens shape at 70% width and 35% height, white 90% > 0%. Never full width: the gloss floats inside the edge.' },
  { n: 'Smoked pond glass', t: 'Fill #1D3B30 at 82%. Background blur 14. Inner stroke 1 white 28%. Overlay a second ellipse white 45% > 0% over the top third. Draw the water line as a 2.5 stroke of #79D4C0 at 70% along a wavy path.' },
  { n: 'Firefly glow', t: 'Body r13, radial #F6FFB0 > #D4F23C > #7DA20E, 3 stroke #261E16. Behind it r34 #D4F23C, layer blur 12, 90%. Add a second r48 #79D4C0 at 25%, blur 30. Fireflies are the only things that glow.' },
  { n: 'Moulded edge', t: 'Stack on any panel: inner shadow 0 2 0 white 75%; inner shadow 0 -4 6 #34502B 22%; drop 0 3 0 #261E16 22%; drop 0 12 18 -8 #12251D 40%.' },
  { n: 'Lumpy corners', t: 'Figma corners are symmetric, so parts use plain rounded rectangles. For the hand-drawn look, use Copy lumpy on a part (it distorts when resized), or pull a rectangle into a vector and drag the anchors. The CSS 8-value radii are listed for developers.' },
  { n: 'ABS and water grain', t: 'Page frame #F2EFDF. Noise plugin: mono, size 1, density 6%, Multiply, once on the page. Two huge ellipses behind, #79D4C0 at 25% and #C5D77E at 30%, blur 200.' },
];
