// Attribute-only SVG strings: no <style>, no CSS vars, no filters, so they paste into Figma as editable vectors.
// Gradients use objectBoundingBox, halos are plain circles (blur them in Figma), every <g id> becomes a layer name.
const wrap = (w, h, defs, body, name) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs><g id="${name}">${body}</g></svg>`;
const stops = (l) => l.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('');
const lin = (id, l) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(l)}</linearGradient>`;
const rad = (id, l, extra = '') => `<radialGradient id="${id}"${extra}>${stops(l)}</radialGradient>`;
const FONT = "font-family=\"'Microgramma D Extended', Michroma, sans-serif\" font-weight=\"700\"";

const veinBranches = (w, y, step, rise, color) => {
  let s = '';
  for (let x = 14; x < w - 24; x += step) {
    s += `<path d="M${x} ${y}L${x + rise} ${y - rise}M${x} ${y}L${x + rise} ${y + rise}" stroke="${color}" stroke-width="1.5" stroke-linecap="round" fill="none"/>`;
  }
  return s;
};

export const parts = [
  {
    id: 'lamp', name: 'Fruit lamp',
    note: 'The only light source. Lit means ready; dim means resting. Blur the halo in Figma.',
    svg: wrap(112, 112, rad('ovl1', [[0, '#E8A93A', 0.65], [1, '#D9744A', 0]]) + rad('ovl2', [[0, '#F5DE82'], [0.5, '#E8A93A'], [1, '#D9744A']], ' cx="0.36" cy="0.3" r="0.85"'),
      '<circle id="Halo" cx="56" cy="62" r="50" fill="url(#ovl1)"/>'
      + '<path id="Stem" d="M56 40C56 32 60 26 66 22" stroke="#8A5A34" stroke-width="3" stroke-linecap="round" fill="none"/>'
      + '<path id="Cap leaf" d="M62 28C70 18 82 18 88 22C82 32 70 34 62 28Z" fill="#9BCB5E"/>'
      + '<circle id="Body" cx="56" cy="64" r="24" fill="url(#ovl2)"/>'
      + '<ellipse id="Catch light" cx="47" cy="55" rx="7" ry="4" fill="#FFFFFF" opacity="0.7" transform="rotate(-30 47 55)"/>', 'Fruit lamp'),
  },
  {
    id: 'button', name: 'Cut button',
    note: 'Two opposite corners cut at 45 degrees. A bark plate sits under it; press moves it 2px onto the plate.',
    svg: wrap(236, 80, lin('ovb1', [[0, '#F5DE82'], [0.18, '#EDB649'], [1, '#E8A93A']]),
      '<polygon id="Plate" points="26,12 232,12 232,56 214,74 10,74 10,30" fill="#8A5A34"/>'
      + '<polygon id="Body" points="22,6 226,6 226,50 208,68 4,68 4,24" fill="url(#ovb1)"/>'
      + '<path id="Top edge" d="M24 9H224" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="1.5"/>'
      + `<text id="Label" x="115" y="43" text-anchor="middle" ${FONT} font-size="14" letter-spacing="2.4" fill="#16301F">ENTER</text>`, 'Cut button'),
  },
  {
    id: 'panel', name: 'Canopy panel',
    note: 'Two corners cut, a 1px lime edge, a vein under the heading. Matte inside; light only on the edge.',
    svg: wrap(320, 196, lin('ovp1', [[0, '#2A4D37'], [1, '#24432F']]) + rad('ovp2', [[0, '#F5DE82'], [1, '#D9744A']], ' cx="0.4" cy="0.35" r="0.8"'),
      '<polygon id="Body" points="28,4 316,4 316,164 292,188 4,188 4,28" fill="url(#ovp1)" stroke="#9BCB5E" stroke-opacity="0.5" stroke-width="1"/>'
      + `<text id="Heading" x="26" y="40" ${FONT} font-size="13" letter-spacing="2.4" fill="#F2ECD2">SPECIMEN 04</text>`
      + '<path id="Midrib" d="M26 56H294" stroke="#9BCB5E" stroke-width="1.5" stroke-linecap="round" fill="none"/>'
      + veinBranches(300, 56, 22, 7, '#9BCB5E')
      + '<rect id="Line 1" x="26" y="86" width="210" height="7" rx="3.5" fill="#F2ECD2" opacity="0.7"/>'
      + '<rect id="Line 2" x="26" y="108" width="248" height="7" rx="3.5" fill="#F2ECD2" opacity="0.32"/>'
      + '<rect id="Line 3" x="26" y="130" width="170" height="7" rx="3.5" fill="#F2ECD2" opacity="0.32"/>'
      + '<circle id="Lamp" cx="290" cy="28" r="8" fill="url(#ovp2)"/>', 'Canopy panel'),
  },
  {
    id: 'vein', name: 'Vein divider',
    note: 'Every divider is a leaf vein: a midrib with branches at 45 degrees. The end node is the only warm thing.',
    svg: wrap(340, 36, '', `<path id="Midrib" d="M6 18H322" stroke="#9BCB5E" stroke-width="1.5" stroke-linecap="round" fill="none"/>${veinBranches(340, 18, 18, 8, '#9BCB5E')}<circle id="Node" cx="328" cy="18" r="5" fill="#D9744A"/>`, 'Vein divider'),
  },
  {
    id: 'pod', name: 'Pod switch',
    note: 'A leaf slides along a dark pod. Slide the leaf 56px right for ON; the lamp lights with it.',
    svg: wrap(144, 68, rad('ovs1', [[0, '#F5DE82'], [1, '#D9744A']], ' cx="0.4" cy="0.35" r="0.8"') + lin('ovs2', [[0, '#B6DC7C'], [1, '#6FA85A']]),
      '<rect id="Pod" x="4" y="12" width="136" height="44" rx="22" fill="#10241A" stroke="#9BCB5E" stroke-opacity="0.45"/>'
      + '<circle id="Lamp" cx="112" cy="34" r="7" fill="url(#ovs1)"/>'
      + '<path id="Leaf" d="M16 46C16 22 30 14 54 14C54 36 44 50 16 46Z" fill="url(#ovs2)" stroke="#16301F" stroke-opacity="0.5"/>'
      + '<path id="Leaf rib" d="M20 44L50 18" stroke="#16301F" stroke-opacity="0.5" stroke-width="1.5" stroke-linecap="round"/>', 'Pod switch'),
  },
  {
    id: 'leaf', name: 'Leaf glyph',
    note: 'The icon base. Midrib and four veins. Colour it lime, or ember when it needs attention.',
    svg: wrap(112, 112, lin('ovf1', [[0, '#B6DC7C'], [1, '#6FA85A']]),
      '<path id="Blade" d="M14 100C12 44 50 10 100 12C102 62 70 100 14 100Z" fill="url(#ovf1)"/>'
      + '<path id="Midrib" d="M14 100L90 22" stroke="#16301F" stroke-opacity="0.65" stroke-width="2.5" stroke-linecap="round"/>'
      + '<path id="Veins" d="M34 80L34 52M52 62L52 36M70 44L78 52M30 80L58 86M50 62L80 66" stroke="#16301F" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round" fill="none"/>', 'Leaf glyph'),
  },
];

export const recipes = [
  { n: 'Cut corners', t: 'Draw a rectangle, flatten it (Ctrl+E), then use the pen to click the edge 22px from the top-left corner on both sides and delete the corner point. Repeat on the bottom-right. Always two opposite corners, never four.' },
  { n: 'Edge', t: 'Duplicate the shape, no fill, 1px stroke Lime at 40%, inside. This is the only outline in the language. Nothing is ever outlined in ink or cream.' },
  { n: 'Lamp glow', t: 'Two copies of the lamp circle behind it: Amber 70% with layer blur 14, then Ember 35% scaled 2.4x with layer blur 40. Round things only: glows on cut shapes look like fog.' },
  { n: 'Vein', t: '1.5px Lime line with round caps. Branches are 1.5px lines at 45 degrees, 8px long, every 18px, alternating above and below the midrib. Set as a component so you can resize it.' },
  { n: 'Radar', t: 'Four circles, no fill, 1px Lime at 28%, at 25/50/75/100% of the radius. A horizontal and vertical line at 25%. Sweep: a circle with an angular gradient, transparent to 75%, Lime 35% at 99%, Amber 90% at 100%. Rotate it 20 degrees per frame in prototypes.' },
  { n: 'Canopy light', t: 'Behind everything on Floor: an Amber ellipse, 1000px, 18% opacity, top-right, layer blur 220. A Deep ellipse, 1200px, 100%, bottom-left, layer blur 240.' },
  { n: 'Display text', t: 'Microgramma D Extended Bold, all caps, letter spacing 6%, Cream. If the face is missing, Michroma is the closest free stand-in. Titles also get a 2px Ember line across their baseline.' },
];
