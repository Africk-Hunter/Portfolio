import React from 'react';

// Attribute-only SVG parts. No <style>, no CSS vars: they paste into Figma as vectors.
// Gradients use plain <stop> attributes, which Figma turns into gradient fills.
const P = { xmlns: 'http://www.w3.org/2000/svg' };

export const parts = [
  {
    id: 'sun',
    name: 'Low Sun',
    note: 'The only hot thing. Place near a horizon, never centred.',
    svg: (
      <svg {...P} viewBox="0 0 160 160" width="160" height="160">
        <defs>
          <radialGradient id="bsun-g" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.35" stopColor="#FFE27A" />
            <stop offset="0.72" stopColor="#FF6F59" />
            <stop offset="1" stopColor="#FF6F59" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="78" fill="url(#bsun-g)" />
        <circle cx="80" cy="80" r="30" fill="#FFF6EA" fillOpacity="0.85" />
      </svg>
    ),
  },
  {
    id: 'cloud',
    name: 'Milk Cloud',
    note: 'Flat-bottomed, lit from above. Use at 40-90% opacity.',
    svg: (
      <svg {...P} viewBox="0 0 220 110" width="220" height="110">
        <defs>
          <linearGradient id="bcloud-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#E7DDF5" />
          </linearGradient>
        </defs>
        <path
          d="M30 96 C8 96 6 66 28 62 C28 38 60 30 74 48 C86 22 130 22 140 52 C166 40 196 54 190 78 C206 80 208 96 188 96 Z"
          fill="url(#bcloud-g)"
        />
      </svg>
    ),
  },
  {
    id: 'horizon',
    name: 'Horizon Line',
    note: 'One per screen. It is where the eye rests; type sits above it.',
    svg: (
      <svg {...P} viewBox="0 0 400 60" width="400" height="60">
        <defs>
          <linearGradient id="bhor-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFB77A" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFB77A" />
            <stop offset="1" stopColor="#B9A6E8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 30 C60 24 120 36 200 30 S340 24 400 30" fill="none" stroke="url(#bhor-g)" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 40 C80 34 140 46 220 40 S340 36 400 40" fill="none" stroke="#7FD8C0" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'flare',
    name: 'Lens Flare',
    note: 'Three discs on a diagonal from the light source. Decoration, never a button.',
    svg: (
      <svg {...P} viewBox="0 0 300 120" width="300" height="120">
        <line x1="10" y1="10" x2="290" y2="110" stroke="#FFE27A" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="30" cy="20" r="18" fill="#FFE27A" fillOpacity="0.5" />
        <circle cx="120" cy="52" r="9" fill="#7FD8C0" fillOpacity="0.55" />
        <circle cx="190" cy="76" r="22" fill="none" stroke="#FFB77A" strokeOpacity="0.6" strokeWidth="2" />
        <circle cx="262" cy="102" r="12" fill="#B9A6E8" fillOpacity="0.55" />
      </svg>
    ),
  },
  {
    id: 'sparkle',
    name: 'Glint',
    note: 'A four-point star. The "something is here" mark; replaces bullets and badges.',
    svg: (
      <svg {...P} viewBox="0 0 80 80" width="80" height="80">
        <path d="M40 2 C42 28 52 38 78 40 C52 42 42 52 40 78 C38 52 28 42 2 40 C28 38 38 28 40 2 Z" fill="#FFE27A" />
        <circle cx="40" cy="40" r="5" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    id: 'birds',
    name: 'Far Birds',
    note: 'Proof there is a distance. Two or three, never a flock.',
    svg: (
      <svg {...P} viewBox="0 0 120 50" width="120" height="50">
        <path d="M8 24 Q20 8 32 22 Q44 8 56 24" fill="none" stroke="#2B2338" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 38 Q78 28 86 37 Q94 28 102 38" fill="none" stroke="#2B2338" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];
