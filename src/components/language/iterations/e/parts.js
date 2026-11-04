import React from 'react';

// Attribute-only SVGs: no <style>, no CSS vars, so they paste into Figma as vectors.
export const parts = [
  {
    id: 'pebble', name: 'Pebble', note: 'Resting object. Use as a card or avatar ground.',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="96" viewBox="0 0 120 96">
        <defs>
          <radialGradient id="ep1" cx="35%" cy="25%" r="85%">
            <stop offset="0" stopColor="#E2EAD0" />
            <stop offset="0.6" stopColor="#C5D77E" />
            <stop offset="1" stopColor="#7C9A3E" />
          </radialGradient>
        </defs>
        <path d="M16 54C10 30 34 8 62 9c30 1 52 17 50 40-2 26-30 42-58 38C32 84 22 74 16 54Z" fill="url(#ep1)" />
        <path d="M30 30C38 18 56 14 70 17" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" fill="none" />
        <ellipse cx="62" cy="90" rx="38" ry="4" fill="#261E16" fillOpacity="0.18" />
      </svg>
    ),
  },
  {
    id: 'leaf', name: 'Leaf', note: 'Tag, bullet, "new" marker. Rotate 8 to 20 degrees.',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110">
        <defs>
          <linearGradient id="ep2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#C5D77E" />
            <stop offset="1" stopColor="#34502B" />
          </linearGradient>
        </defs>
        <path d="M14 98C6 50 40 12 98 12c4 52-30 90-84 86Z" fill="url(#ep2)" />
        <path d="M14 98C42 70 62 48 90 22" stroke="#F6F1E3" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M48 62l20 2M38 74l18 2M60 46l16-2" stroke="#F6F1E3" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'dew', name: 'Dewdrop', note: 'Notification dot, toggle knob, loading bead.',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="90" height="110" viewBox="0 0 90 110">
        <defs>
          <radialGradient id="ep3" cx="40%" cy="68%" r="70%">
            <stop offset="0" stopColor="#79D4C0" stopOpacity="0.9" />
            <stop offset="0.7" stopColor="#79D4C0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <path d="M46 6C60 34 80 52 80 72c0 20-16 32-35 32S10 92 10 72C10 52 32 34 46 6Z" fill="url(#ep3)" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="2" />
        <ellipse cx="30" cy="68" rx="6" ry="14" fill="#FFFFFF" fillOpacity="0.85" transform="rotate(14 30 68)" />
        <ellipse cx="58" cy="90" rx="10" ry="4" fill="#FFFFFF" fillOpacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'bubble', name: 'Bubble', note: 'Tooltip, avatar ring, "you found something".',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110">
        <defs>
          <radialGradient id="ep4" cx="50%" cy="50%" r="50%">
            <stop offset="0.6" stopColor="#F4B6CF" stopOpacity="0" />
            <stop offset="0.9" stopColor="#79D4C0" stopOpacity="0.45" />
            <stop offset="1" stopColor="#F4B6CF" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        <circle cx="55" cy="55" r="48" fill="url(#ep4)" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.5" />
        <path d="M24 44C28 28 42 18 58 16" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="84" cy="80" r="4" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    ),
  },
  {
    id: 'bud', name: 'Bud Button', note: 'Primary action. Text sits in Bricolage 600, peat.',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="190" height="64" viewBox="0 0 190 64">
        <defs>
          <linearGradient id="ep5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#DDEB9C" />
            <stop offset="1" stopColor="#A9C158" />
          </linearGradient>
        </defs>
        <path d="M22 6C60 2 130 4 168 8c16 2 22 14 20 28-2 16-10 24-28 24-40 3-98 3-136 0C8 58 2 46 3 32 4 18 8 8 22 6Z" fill="url(#ep5)" stroke="#7C9A3E" strokeWidth="1.5" />
        <path d="M20 16C60 10 120 10 160 14" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="168" cy="44" r="3" fill="#FFFFFF" fillOpacity="0.7" />
      </svg>
    ),
  },
  {
    id: 'sprig', name: 'Sprig', note: 'Divider, loader, list ornament.',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
        <path d="M6 40C50 52 90 24 194 30" stroke="#34502B" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M40 44c-2-14 6-22 18-24 2 14-4 22-18 24ZM86 34c0-14 10-20 22-20 0 14-8 20-22 20ZM132 32c6-12 18-14 28-10-4 12-14 16-28 10ZM66 40c10 4 18 12 18 20-12 0-18-8-18-20Z" fill="#79A04A" />
        <circle cx="194" cy="30" r="5" fill="#F2512B" />
      </svg>
    ),
  },
  {
    id: 'ripple', name: 'Ripple', note: 'Click feedback, focus ring, sonar for loading.',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80">
        <ellipse cx="60" cy="40" rx="54" ry="30" stroke="#79D4C0" strokeOpacity="0.45" strokeWidth="2" fill="none" />
        <ellipse cx="60" cy="40" rx="38" ry="20" stroke="#79D4C0" strokeOpacity="0.75" strokeWidth="2.5" fill="none" />
        <ellipse cx="60" cy="40" rx="20" ry="9" stroke="#34502B" strokeOpacity="0.8" strokeWidth="3" fill="#FFFFFF" fillOpacity="0.4" />
      </svg>
    ),
  },
];
