// Attribute-only SVGs: no <style>, no CSS vars, so they paste into Figma as vectors.
const dots = () => {
  let s = '';
  for (let r = 0; r < 4; r += 1) for (let c = 0; c < 8; c += 1) {
    s += `<circle cx="${12 + c * 10.5}" cy="${12 + r * 13}" r="3.6" fill="#23262B" opacity="0.8"/><circle cx="${12 + c * 10.5}" cy="${13.4 + r * 13}" r="3.6" fill="none" stroke="#ffffff" stroke-opacity="0.8" stroke-width="1" opacity="0.7"/>`;
  }
  return s;
};

export const parts = [
  {
    id: 'jelly', name: 'Jelly button', w: 168, h: 76,
    note: 'Lip rect sits under the cap so it reads as travel.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="168" height="76" viewBox="0 0 168 76"><defs><linearGradient id="ajb1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFA56B"/><stop offset="0.55" stop-color="#FF6B2C"/><stop offset="1" stop-color="#E8531A"/></linearGradient><linearGradient id="ajb2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs><rect x="6" y="14" width="156" height="56" rx="22" fill="#9A3208"/><rect x="6" y="6" width="156" height="56" rx="22" fill="url(#ajb1)" stroke="#B83D0B" stroke-width="2"/><rect x="16" y="10" width="136" height="24" rx="12" fill="url(#ajb2)"/><rect x="62" y="30" width="44" height="8" rx="4" fill="#23262B" opacity="0.85"/></svg>`,
  },
  {
    id: 'led', name: 'LED lamp', w: 64, h: 64,
    note: 'Halo is a separate circle so you can blur it in Figma.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><defs><radialGradient id="aled1"><stop offset="0" stop-color="#A6E22E" stop-opacity="0.9"/><stop offset="1" stop-color="#A6E22E" stop-opacity="0"/></radialGradient><radialGradient id="aled2" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#E9FF9C"/><stop offset="0.5" stop-color="#A6E22E"/><stop offset="1" stop-color="#5E9A0F"/></radialGradient></defs><circle cx="32" cy="32" r="31" fill="url(#aled1)"/><circle cx="32" cy="32" r="14" fill="url(#aled2)" stroke="#23262B" stroke-width="3"/><ellipse cx="27" cy="26" rx="5" ry="3" fill="#ffffff" opacity="0.8"/></svg>`,
  },
  {
    id: 'slider', name: 'Slide switch', w: 136, h: 56,
    note: 'Thumb has three grip ridges. Move it 60px for ON.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="136" height="56" viewBox="0 0 136 56"><defs><linearGradient id="asl1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A39C87"/><stop offset="1" stop-color="#DAD3BF"/></linearGradient><linearGradient id="asl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#CFC8B4"/></linearGradient></defs><rect x="4" y="12" width="128" height="32" rx="16" fill="url(#asl1)" stroke="#8C856F" stroke-width="2"/><rect x="10" y="6" width="64" height="44" rx="14" fill="url(#asl2)" stroke="#23262B" stroke-width="2.5"/><rect x="32" y="16" width="4" height="24" rx="2" fill="#23262B" opacity="0.5"/><rect x="42" y="16" width="4" height="24" rx="2" fill="#23262B" opacity="0.5"/><rect x="52" y="16" width="4" height="24" rx="2" fill="#23262B" opacity="0.5"/><circle cx="108" cy="28" r="5" fill="#A6E22E" stroke="#23262B" stroke-width="2"/></svg>`,
  },
  {
    id: 'screw', name: 'Slotted screw', w: 56, h: 56,
    note: 'Rotate the slot to anything; no two screws line up.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><defs><radialGradient id="asc1" cx="0.35" cy="0.3" r="0.9"><stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#CFC8B4"/><stop offset="1" stop-color="#8C856F"/></radialGradient></defs><circle cx="28" cy="28" r="22" fill="url(#asc1)" stroke="#5A574D" stroke-width="2.5"/><rect x="10" y="25" width="36" height="6" rx="3" fill="#23262B" opacity="0.85" transform="rotate(32 28 28)"/><rect x="10" y="27.5" width="36" height="3" rx="1.5" fill="#ffffff" opacity="0.6" transform="rotate(32 28 29.5)"/></svg>`,
  },
  {
    id: 'sticker', name: 'Model sticker', w: 200, h: 84,
    note: 'Die-cut label. Put the product name in Michroma on top.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="84" viewBox="0 0 200 84"><ellipse cx="100" cy="42" rx="96" ry="38" fill="#23262B"/><ellipse cx="100" cy="42" rx="90" ry="32" fill="#FFD23F"/><ellipse cx="100" cy="42" rx="82" ry="25" fill="none" stroke="#23262B" stroke-width="2"/><rect x="34" y="52" width="132" height="3" rx="1.5" fill="#12BFAE"/><rect x="42" y="58" width="116" height="3" rx="1.5" fill="#FF6B2C"/><rect x="52" y="64" width="96" height="3" rx="1.5" fill="#E5322D"/></svg>`,
  },
  {
    id: 'grille', name: 'Speaker grille', w: 96, h: 56,
    note: 'Each hole is a dark disc plus a white lower lip.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="56" viewBox="0 0 96 56"><rect x="1" y="1" width="94" height="54" rx="14" fill="#DAD3BF" stroke="#8C856F" stroke-width="2"/>${dots()}</svg>`,
  },
];

export const recipes = [
  { n: 'Jelly gloss', t: 'Fill: linear 180deg #FFA56B > #FF6B2C > #E8531A. Stroke 2 inside #B83D0B. Duplicate the shape 8px lower, fill #9A3208, send behind (the lip). Add a rounded rect at 10px inset, 40% height, white 85% > 0% linear (the gloss). Inner shadow 0 2 0 white 60%.' },
  { n: 'Smoked plastic', t: 'Fill #3A3340 at 78%. Background blur 14. Stroke 1 inside white 28%. Add a 2px white 18% line along the top edge as the bevel. Noise effect 3% mono over the top.' },
  { n: 'LED glow', t: 'Circle r14 radial #E9FF9C > #A6E22E > #5E9A0F, 3px graphite stroke. Behind it a r30 circle of #A6E22E, layer blur 10, opacity 90%. Add a white ellipse 10x6 at 80% as the specular.' },
  { n: 'Moulded edge', t: 'Effects stack on any panel: inner shadow 0 2 0 white 70%; inner shadow 0 -3 0 black 18%; drop 0 3 0 black 22%; drop 0 8 14 #23262B 22%.' },
  { n: 'ABS grain', t: 'Drop a 100% frame of #EFEBDD, add the Noise plugin at size 1, density 6%, multiply. Do it once on the page, never per part.' },
];
