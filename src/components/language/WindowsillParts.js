import React from 'react';

// Attribute-only inline SVG (no CSS, no <style>) so each part pastes into Figma as editable vectors.
// Light is always top-left. Gloss is layered: body, depth, sheen, bounce, edge. Keep every layer subtle.

const common = { xmlns: 'http://www.w3.org/2000/svg', fill: 'none' };
const INK = '#16324A';

const Defs = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-depth`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={INK} stopOpacity="0" />
      <stop offset="1" stopColor={INK} stopOpacity="0.22" />
    </linearGradient>
    <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
      <stop offset="1" stopColor="#fff" stopOpacity="0.04" />
    </linearGradient>
    <linearGradient id={`${id}-bounce`} x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
  </defs>
);

export const Bead = ({ fill = '#2FBF7A' }) => (
  <svg {...common} width="120" height="120" viewBox="0 0 120 120">
    <Defs id="bead" />
    <ellipse cx="62" cy="109" rx="38" ry="5" fill={INK} fillOpacity="0.16" />
    <circle cx="60" cy="56" r="48" fill={fill} />
    <circle cx="60" cy="56" r="48" fill="url(#bead-depth)" />
    <path d="M24 84a40 40 0 0 0 72 0c-12 10-24 14-36 14S36 94 24 84Z" fill="url(#bead-bounce)" />
    <path d="M24 48C26 28 40 14 60 14s34 14 36 34c-10 8-22 12-36 12S34 56 24 48Z" fill="url(#bead-sheen)" />
    <circle cx="60" cy="56" r="46.5" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
    <circle cx="60" cy="56" r="48" stroke={INK} strokeWidth="2" />
  </svg>
);

export const OrbButton = ({ label = 'Open', fill = '#2FBF7A' }) => (
  <svg {...common} width="180" height="64" viewBox="0 0 180 64">
    <Defs id="btn" />
    <rect x="6" y="10" width="168" height="46" rx="23" fill={INK} fillOpacity="0.16" />
    <rect x="4" y="4" width="172" height="48" rx="24" fill={fill} />
    <rect x="4" y="4" width="172" height="48" rx="24" fill="url(#btn-depth)" />
    <path d="M10 40C18 46 40 48 90 48s72-2 80-8c-8 8-30 10-80 10S18 48 10 40Z" fill="url(#btn-bounce)" />
    <path d="M28 7H152C163 7 171 14 172 25C140 32 40 32 8 25C9 14 17 7 28 7Z" fill="url(#btn-sheen)" />
    <rect x="5" y="5" width="170" height="46" rx="23" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
    <rect x="4" y="4" width="172" height="48" rx="24" stroke={INK} strokeWidth="2" />
    <text x="90" y="34" textAnchor="middle" fontFamily="Figtree, sans-serif" fontWeight="800" fontSize="17" fill={INK}>{label}</text>
  </svg>
);

export const Window = ({ title = 'readme.txt' }) => (
  <svg {...common} width="260" height="170" viewBox="0 0 260 170">
    <Defs id="win" />
    <rect x="8" y="14" width="246" height="150" rx="26" fill={INK} fillOpacity="0.14" />
    <rect x="4" y="4" width="248" height="154" rx="26" fill="#F6F8F2" />
    <path d="M4 30a26 26 0 0 1 26-26h196a26 26 0 0 1 26 26v12H4Z" fill="#BFEDE6" />
    <path d="M4 30a26 26 0 0 1 26-26h196a26 26 0 0 1 26 26v12H4Z" fill="url(#win-sheen)" />
    <path d="M4 42h248" stroke={INK} strokeOpacity="0.5" strokeWidth="1" />
    <rect x="5" y="5" width="246" height="152" rx="25" stroke="#fff" strokeOpacity="0.7" strokeWidth="1" />
    <rect x="4" y="4" width="248" height="154" rx="26" stroke={INK} strokeWidth="2" />
    <text x="24" y="28" fontFamily="'DM Mono', monospace" fontSize="12" fill={INK}>{title}</text>
    <circle cx="206" cy="23" r="7" fill="#FFE27A" stroke={INK} strokeWidth="1.5" />
    <circle cx="228" cy="23" r="7" fill="#FF5A4A" stroke={INK} strokeWidth="1.5" />
    <rect x="24" y="62" width="140" height="7" rx="3.5" fill={INK} fillOpacity="0.5" />
    <rect x="24" y="82" width="190" height="7" rx="3.5" fill={INK} fillOpacity="0.28" />
    <rect x="24" y="102" width="110" height="7" rx="3.5" fill={INK} fillOpacity="0.28" />
  </svg>
);

export const Sticker = ({ word = 'Hi!' }) => (
  <svg {...common} width="200" height="100" viewBox="0 0 200 100">
    <ellipse cx="102" cy="56" rx="92" ry="38" fill={INK} />
    <ellipse cx="100" cy="50" rx="92" ry="38" fill="#FFE27A" stroke={INK} strokeWidth="3" />
    <ellipse cx="100" cy="50" rx="84" ry="31" stroke="#fff" strokeWidth="2" strokeOpacity="0.8" />
    <text x="100" y="64" textAnchor="middle" fontFamily="'Bagel Fat One', sans-serif" fontSize="44" fill="#FF5A4A" stroke={INK} strokeWidth="3" paintOrder="stroke">{word}</text>
  </svg>
);

export const Pokeable = () => (
  <svg {...common} width="72" height="72" viewBox="0 0 72 72">
    <Defs id="pk" />
    <circle cx="36" cy="36" r="30" fill="#FF5A4A" />
    <circle cx="36" cy="36" r="30" fill="url(#pk-depth)" />
    <path d="M12 34C14 18 24 8 36 8s22 10 24 26c-7 5-15 8-24 8s-17-3-24-8Z" fill="url(#pk-sheen)" />
    <circle cx="36" cy="36" r="29" stroke="#fff" strokeOpacity="0.45" strokeWidth="1" />
    <circle cx="36" cy="36" r="30" stroke={INK} strokeWidth="2" />
    <path d="M36 23v16M36 47v2" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const Orb = () => (
  <svg {...common} width="120" height="120" viewBox="0 0 120 120">
    <defs>
      <radialGradient id="orb-body" cx="0.38" cy="0.3" r="0.85">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#BFEDE6" />
        <stop offset="1" stopColor="#3B6FE0" />
      </radialGradient>
      <linearGradient id="orb-sheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="60" r="52" fill="url(#orb-body)" />
    <path d="M16 78c22 14 52 8 74-14 8-8 13-16 14-22" stroke="#2FBF7A" strokeWidth="12" strokeLinecap="round" strokeOpacity="0.55" />
    <path d="M20 52C22 30 38 14 60 14s38 16 40 38c-12 8-26 12-40 12S32 60 20 52Z" fill="url(#orb-sheen)" />
    <circle cx="60" cy="60" r="52" stroke={INK} strokeWidth="2" />
  </svg>
);

export const parts = [
  { name: 'Bead', C: Bead, note: 'The base form: body, depth, sheen, bounce, edge.' },
  { name: 'Orb button', C: OrbButton, note: 'Anything pressable. Sinks 2px on press.' },
  { name: 'Window', C: Window, note: 'Sheen only on the title bar. The body stays matte.' },
  { name: 'Sticker', C: Sticker, note: 'The only flat, graphic part. Display type, outline, offset shadow.' },
  { name: 'Pokeable', C: Pokeable, note: 'One per screen. It does something small and silly.' },
  { name: 'Orb', C: Orb, note: 'Glass sphere: radial body, reflected floor, one sheen.' },
];
