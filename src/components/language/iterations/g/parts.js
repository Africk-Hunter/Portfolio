// Attribute-only SVG strings: no <style>, no CSS vars, no filters, so they paste into Figma as editable vectors.
// Bodies are real rects/circles (corner-radius field works), gradients use objectBoundingBox, shadows are
// stacked shapes (no filters), and every <g id> becomes a Figma layer name. Light comes from above.
const wrap = (w, h, defs, body, name) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}</defs><g id="${name}">${body}</g></svg>`;
const stops = (l) => l.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a === undefined ? '' : ` stop-opacity="${a}"`}/>`).join('');
const lin = (id, l) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(l)}</linearGradient>`;
const rad = (id, l, extra = '') => `<radialGradient id="${id}"${extra}>${stops(l)}</radialGradient>`;
const sheen = (id) => lin(id, [[0, '#FFFFFF', 0.85], [1, '#FFFFFF', 0.04]]);
const glass = (id) => lin(id, [[0, '#8DE6F1'], [0.55, '#35C2D6'], [1, '#1E8FB5']]);

export const parts = [
  {
    id: 'orb', name: 'Orb',
    note: 'The hero. One per screen. Radial body, reflected floor, catch light.',
    svg: wrap(160, 172, rad('dwo1', [[0, '#FFFFFF'], [0.45, '#A9E8F2'], [1, '#1E5FA8']], ' cx="0.36" cy="0.28" r="0.85"') + sheen('dwo2'),
      '<ellipse id="Cast" cx="82" cy="162" rx="52" ry="7" fill="#1E5FA8" opacity="0.25"/>'
      + '<circle id="Body" cx="80" cy="78" r="68" fill="url(#dwo1)"/>'
      + '<path id="Floor" d="M26 106c24 18 62 12 90-14 9-8 15-17 17-25" stroke="#35C2D6" stroke-width="14" stroke-linecap="round" stroke-opacity="0.45" fill="none"/>'
      + '<path id="Sheen" d="M28 62C30 36 50 18 80 18s50 18 52 44c-14 10-32 15-52 15S42 72 28 62Z" fill="url(#dwo2)"/>'
      + '<ellipse id="Catch light" cx="52" cy="36" rx="14" ry="7" fill="#FFD66B" opacity="0.9" transform="rotate(-24 52 36)"/>'
      + '<circle id="Rim" cx="80" cy="78" r="67.5" stroke="#1E5FA8" stroke-opacity="0.55" stroke-width="1.5" fill="none"/>', 'Orb'),
  },
  {
    id: 'button', name: 'Glass button',
    note: 'Anything pressable. Sinks 4px and flattens on press, then springs back.',
    svg: wrap(200, 76, glass('dwb1') + sheen('dwb2') + lin('dwb3', [[0, '#FFFFFF', 0], [1, '#FFFFFF', 0.4]]),
      '<rect id="Cast" x="16" y="20" width="168" height="50" rx="25" fill="#1E5FA8" opacity="0.3"/>'
      + '<rect id="Body" x="6" y="4" width="188" height="58" rx="29" fill="url(#dwb1)"/>'
      + '<path id="Bounce" d="M22 52C60 62 140 62 178 52C168 59 146 62 100 62S32 59 22 52Z" fill="url(#dwb3)"/>'
      + '<path id="Sheen" d="M36 9H164C178 9 188 17 189 27C150 37 50 37 11 27C12 17 22 9 36 9Z" fill="url(#dwb2)"/>'
      + '<rect id="Rim" x="6.5" y="4.5" width="187" height="57" rx="28.5" stroke="#FFFFFF" stroke-opacity="0.7" fill="none"/>'
      + '<text id="Label" x="100" y="40" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="600" font-size="19" fill="#0E2B36">Come in</text>', 'Glass button'),
  },
  {
    id: 'switch', name: 'Bead switch',
    note: 'Slide the bead 52px right for ON. The track fills with glass.',
    svg: wrap(132, 72, lin('dws1', [[0, '#BCD7E0'], [1, '#E3F0F4']]) + glass('dws2') + sheen('dws3') + rad('dws4', [[0, '#FFFFFF'], [1, '#CFE6EC']], ' cx="0.38" cy="0.3" r="0.85"'),
      '<rect id="Track" x="6" y="14" width="120" height="46" rx="23" fill="url(#dws1)"/>'
      + '<rect id="Track edge" x="6.5" y="14.5" width="119" height="45" rx="22.5" stroke="#1E5FA8" stroke-opacity="0.25" fill="none"/>'
      + '<circle id="Bead cast" cx="38" cy="42" r="21" fill="#1E5FA8" opacity="0.25"/>'
      + '<circle id="Bead" cx="38" cy="35" r="24" fill="url(#dws4)"/>'
      + '<ellipse id="Bead sheen" cx="34" cy="26" rx="13" ry="7" fill="url(#dws3)"/>'
      + '<circle id="Bead rim" cx="38" cy="35" r="23.5" stroke="#1E5FA8" stroke-opacity="0.4" fill="none"/>', 'Bead switch'),
  },
  {
    id: 'chip', name: 'Chip',
    note: 'Small label. A quiet well with one light edge.',
    svg: wrap(128, 48, lin('dwc1', [[0, '#C6DEE6'], [1, '#E3F0F4']]),
      '<rect id="Body" x="4" y="6" width="120" height="36" rx="18" fill="url(#dwc1)"/>'
      + '<rect id="Light edge" x="4" y="7" width="120" height="36" rx="18" stroke="#FFFFFF" stroke-opacity="0.9" fill="none"/>'
      + '<text id="Label" x="64" y="30" text-anchor="middle" font-family="Outfit, sans-serif" font-weight="500" font-size="15" fill="#0E2B36">Unhurried</text>', 'Chip'),
  },
  {
    id: 'pane', name: 'Pane',
    note: 'Cards and windows. Pillowy, matte inside, light only on the edge.',
    svg: wrap(300, 196, lin('dwp1', [[0, '#FFFFFF'], [1, '#E6F2F5']]) + sheen('dwp2') + glass('dwp3'),
      '<rect id="Cast" x="22" y="30" width="256" height="156" rx="44" fill="#1E5FA8" opacity="0.2"/>'
      + '<rect id="Body" x="8" y="8" width="284" height="170" rx="44" fill="url(#dwp1)"/>'
      + '<path id="Edge glow" d="M52 9H248C268 9 285 24 290 44C240 30 60 30 10 44C15 24 32 9 52 9Z" fill="url(#dwp2)" opacity="0.7"/>'
      + '<rect id="Rim" x="8.5" y="8.5" width="283" height="169" rx="43.5" stroke="#1E5FA8" stroke-opacity="0.18" fill="none"/>'
      + '<circle id="Bead" cx="46" cy="58" r="12" fill="url(#dwp3)"/>'
      + '<rect id="Line 1" x="70" y="52" width="130" height="8" rx="4" fill="#0E2B36" opacity="0.7"/>'
      + '<rect id="Line 2" x="36" y="96" width="210" height="7" rx="3.5" fill="#0E2B36" opacity="0.3"/>'
      + '<rect id="Line 3" x="36" y="116" width="170" height="7" rx="3.5" fill="#0E2B36" opacity="0.3"/>'
      + '<rect id="Line 4" x="36" y="136" width="120" height="7" rx="3.5" fill="#0E2B36" opacity="0.3"/>', 'Pane'),
  },
];

export const recipes = [
  { n: 'Glass body', t: 'Pill or circle. Linear fill top to bottom: #8DE6F1 at 0%, #35C2D6 at 55%, #1E8FB5 at 100%. Never a flat fill.' },
  { n: 'Sheen', t: 'A lens on the top half, flat bottom edge bowed downward (pen tool, pull each handle down about 6px). White 85% to 4%, top to bottom. Inset about 5px from the rim.' },
  { n: 'Bounce', t: 'A thin crescent inside the bottom edge. White 0% to 40%, top to bottom. Light coming back up through the glass.' },
  { n: 'Rim', t: 'Duplicate the body, no fill, 1px stroke inside. White 70% on glass, Tide 18% on panes. No dark outline, ever; the edge is light, not ink.' },
  { n: 'Cast', t: 'A copy of the silhouette in Tide at 25%, shrunk 12% and dropped 14px. Layer blur 12. Shadows are blue, never grey.' },
  { n: 'Orb body', t: 'Circle, radial fill: white 0%, #A9E8F2 45%, Tide 100%. Move the gradient centre to 36% / 28%. Add a 14px Aqua arc at 45% for the reflected floor, then the sheen, then a Spark ellipse for the catch light.' },
  { n: 'Ground light', t: 'Behind everything on Mist: one 1100px ellipse of white at 90% top-left, one of Haze at 80% bottom-right, layer blur 220. The page is the only gradient background.' },
  { n: 'Display text', t: 'Bagel Fat One in Tide. Duplicate in white, nudge down 3px, behind. That is the whole effect: a lip of light under the word.' },
];
