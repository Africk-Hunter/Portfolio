import React from 'react';

// Everything here is plain SVG with attributes only (no classes), so the
// markup carries its styling with it when pasted into Figma.

const INK = '#13245E';

// ---------- icons: 32 grid, 2.4 stroke, round caps ----------

const iconBodies = {
  home: <path d="M5 15 L16 6 L27 15 M8 13 V26 H24 V13 M13 26 V18 H19 V26" />,
  websites: (
    <>
      <rect x="4" y="6" width="24" height="16" rx="3.5" />
      <path d="M11 27 H21 M16 22 V27" />
    </>
  ),
  music: (
    <>
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="3.4" />
      <path d="M8.4 12.4 A8.4 8.4 0 0 1 12.4 8.4" />
    </>
  ),
  contact: (
    <>
      <rect x="4" y="8" width="24" height="16" rx="3.5" />
      <path d="M5.5 10.5 L16 18 L26.5 10.5" />
    </>
  ),
  back: <path d="M20 7 L10 16 L20 25" />,
  next: <path d="M12 7 L22 16 L12 25" />,
  out: <path d="M13 7 H7 V25 H25 V19 M17 5 H27 V15 M27 5 L14 18" />,
  close: <path d="M8 8 L24 24 M24 8 L8 24" />,
  play: <path d="M11 7 L25 16 L11 25 Z" />,
  check: <path d="M7 17 L13 23 L25 9" />,
  poke: <path d="M16 4 L19 13 L28 16 L19 19 L16 28 L13 19 L4 16 L13 13 Z" />,
  wait: <path d="M9 5 H23 M9 27 H23 M10 5 V9 L16 16 L22 9 V5 M10 27 V23 L16 16 L22 23 V27" />,
  place: (
    <>
      <path d="M16 28 C16 28 6 19.5 6 13 A10 10 0 0 1 26 13 C26 19.5 16 28 16 28 Z" />
      <circle cx="16" cy="13" r="3.4" />
    </>
  ),
  sun: (
    <>
      <circle cx="16" cy="16" r="5.5" />
      <path d="M16 3.5 V7 M16 25 V28.5 M3.5 16 H7 M25 16 H28.5 M7.2 7.2 L9.6 9.6 M22.4 22.4 L24.8 24.8 M24.8 7.2 L22.4 9.6 M9.6 22.4 L7.2 24.8" />
    </>
  ),
};

export const iconList = [
  ['home', 'Home'], ['websites', 'Websites'], ['music', 'Music'], ['contact', 'Contact'],
  ['back', 'Back'], ['next', 'Next'], ['out', 'Opens elsewhere'], ['close', 'Close'],
  ['play', 'Play'], ['check', 'Okay'], ['poke', 'Poke'], ['wait', 'Waiting'],
  ['place', 'Place'], ['sun', 'Daylight'],
];

export const Icon = ({ name, size = 32, color = INK, width = 2.4 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {iconBodies[name]}
  </svg>
);

// ---------- parts ----------

const Stops = ({ stops }) =>
  stops.map(([color, at]) => <stop key={`${color}${at}`} offset={`${at}%`} stopColor={color} />);

export const gels = {
  blue: [['#E9F5FF', 0], ['#93C2F6', 52], ['#4D84DC', 100]],
  butter: [['#FFFBE0', 0], ['#FFE48A', 50], ['#F5B93A', 100]],
  mint: [['#F0FFF9', 0], ['#8FE3C8', 52], ['#2FB296', 100]],
  lilac: [['#F5F1FF', 0], ['#B9A8F0', 52], ['#7F68D9', 100]],
};

// The nav oval: 2:1, white rim, shaded belly, gloss across the top.
export const GelOval = ({ id, gel = 'blue', icon, width = 192 }) => (
  <svg width={width} height={width / 2} viewBox="0 0 192 96" fill="none" role="img" aria-label="Gel oval">
    <defs>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
        <Stops stops={gels[gel]} />
      </linearGradient>
      <linearGradient id={`${id}-belly`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="55%" stopColor="#0F2878" stopOpacity="0" />
        <stop offset="100%" stopColor="#0F2878" stopOpacity="0.35" />
      </linearGradient>
      <linearGradient id={`${id}-gloss`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <ellipse cx="96" cy="48" rx="92" ry="44" fill={`url(#${id}-fill)`} stroke="#fff" strokeOpacity="0.95" strokeWidth="4" />
    <ellipse cx="96" cy="48" rx="90" ry="42" fill={`url(#${id}-belly)`} />
    <ellipse cx="96" cy="27" rx="66" ry="19" fill={`url(#${id}-gloss)`} />
    {icon && (
      <g transform="translate(66 18) scale(1.875)" stroke={INK} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {iconBodies[icon]}
      </g>
    )}
  </svg>
);

// The one dark shape: a falling diagonal on the right edge, an amber LED.
export const SlabShape = ({ id }) => (
  <svg width="260" height="44" viewBox="0 0 260 44" fill="none" role="img" aria-label="Slab">
    <defs>
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A3B95" />
        <stop offset="100%" stopColor="#13245E" />
      </linearGradient>
      <radialGradient id={`${id}-led`}>
        <stop offset="0%" stopColor="#FFB347" />
        <stop offset="60%" stopColor="#FFB347" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#FFB347" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d="M0 0 H260 L232 44 H0 Z" fill={`url(#${id}-fill)`} />
    <circle cx="28" cy="22" r="10" fill={`url(#${id}-led)`} />
    <circle cx="28" cy="22" r="3.5" fill="#FFB347" />
  </svg>
);

// Glass panel: top-left corner cut at 45 degrees, slab header, butter rule.
export const PanelShape = ({ id }) => (
  <svg width="300" height="190" viewBox="0 0 300 190" fill="none" role="img" aria-label="Glass panel">
    <defs>
      <linearGradient id={`${id}-glass`} x1="0.17" y1="0" x2="0.83" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
        <stop offset="45%" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#D6EAFF" stopOpacity="0.45" />
      </linearGradient>
      <linearGradient id={`${id}-head`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2A3B95" />
        <stop offset="100%" stopColor="#13245E" />
      </linearGradient>
      <clipPath id={`${id}-clip`}>
        <path d="M30 0 H300 V190 H0 V30 Z" />
      </clipPath>
    </defs>
    <path d="M30 0 H300 V190 H0 V30 Z" fill={`url(#${id}-glass)`} stroke="#fff" strokeOpacity="0.9" strokeWidth="2" />
    <g clipPath={`url(#${id}-clip)`}>
      <rect x="0" y="0" width="300" height="46" fill={`url(#${id}-head)`} />
      <rect x="0" y="46" width="300" height="3" fill="#FFD84D" />
      <rect x="38" y="16" width="96" height="12" rx="3" fill="#FFD84D" />
      <rect x="22" y="70" width="190" height="8" rx="4" fill="#2B3D78" fillOpacity="0.5" />
      <rect x="22" y="90" width="236" height="8" rx="4" fill="#2B3D78" fillOpacity="0.3" />
      <rect x="22" y="110" width="150" height="8" rx="4" fill="#2B3D78" fillOpacity="0.3" />
    </g>
  </svg>
);

// A glossy bead: the home button, pointer, and pip all come from this.
export const Bead = ({ id, size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 72 72" fill="none" role="img" aria-label="Bead">
    <defs>
      <radialGradient id={`${id}-body`} cx="0.5" cy="0.6" r="0.55">
        <stop offset="0%" stopColor="#69A8FF" />
        <stop offset="60%" stopColor="#1F4FBF" />
        <stop offset="100%" stopColor="#0D2A78" />
      </radialGradient>
      <radialGradient id={`${id}-shine`} cx="0.34" cy="0.28" r="0.3">
        <stop offset="0%" stopColor="#fff" />
        <stop offset="30%" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="36" cy="36" r="31" fill={`url(#${id}-body)`} stroke="#fff" strokeWidth="3.5" />
    <circle cx="36" cy="36" r="31" fill={`url(#${id}-shine)`} />
  </svg>
);

// The seal: sixteen soft points, butter to amber, a star pressed in.
const sealPoints = () =>
  Array.from({ length: 32 }, (_, i) => {
    const r = i % 2 ? 36 : 42;
    const a = (i / 32) * Math.PI * 2 - Math.PI / 2;
    return `${(48 + r * Math.cos(a)).toFixed(2)},${(48 + r * Math.sin(a)).toFixed(2)}`;
  }).join(' ');

export const Seal = ({ id, size = 96 }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" fill="none" role="img" aria-label="Seal">
    <defs>
      <radialGradient id={`${id}-body`} cx="0.4" cy="0.35" r="0.75">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="55%" stopColor="#FFD84D" />
        <stop offset="100%" stopColor="#E59A1B" />
      </radialGradient>
    </defs>
    <polygon points={sealPoints()} fill={`url(#${id}-body)`} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="48" cy="48" r="26" stroke="#B9760F" strokeOpacity="0.45" strokeWidth="2" />
    <path d="M48 32 L51.5 44.5 L64 48 L51.5 51.5 L48 64 L44.5 51.5 L32 48 L44.5 44.5 Z" fill="#B9760F" fillOpacity="0.55" />
  </svg>
);

// Light ribbons: white, pane, and one thin butter line.
export const Ribbons = ({ id }) => (
  <svg width="420" height="130" viewBox="0 0 420 130" fill="none" role="img" aria-label="Ribbons">
    <defs>
      <linearGradient id={`${id}-w`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity="0" />
        <stop offset="35%" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${id}-p`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#93C2F6" stopOpacity="0" />
        <stop offset="50%" stopColor="#93C2F6" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#93C2F6" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0 96 C90 20 190 130 280 62 S400 18 420 30" stroke={`url(#${id}-w)`} strokeWidth="18" strokeLinecap="round" />
    <path d="M0 78 C100 8 200 112 290 50 S404 6 420 14" stroke={`url(#${id}-p)`} strokeWidth="9" strokeLinecap="round" />
    <path d="M0 108 C80 44 200 140 296 78 S404 30 420 40" stroke="#FFD84D" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// The turntable plate, seen from above and flattened.
export const Plinth = ({ id }) => {
  const wedges = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const b = ((i + 0.5) / 12) * Math.PI * 2;
    const pt = (t) => `${(120 + 112 * Math.cos(t)).toFixed(1)} ${(40 + 34 * Math.sin(t)).toFixed(1)}`;
    return `M120 40 L${pt(a)} L${pt(b)} Z`;
  });
  return (
    <svg width="240" height="80" viewBox="0 0 240 80" fill="none" role="img" aria-label="Plinth">
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="60%" stopColor="#6EAFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#6EAFFF" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="40" rx="118" ry="38" fill={`url(#${id}-glow)`} />
      <ellipse cx="120" cy="40" rx="112" ry="34" fill="#CFE6FF" stroke="#fff" strokeWidth="5" />
      {wedges.map((d) => <path key={d} d={d} fill="#fff" fillOpacity="0.7" />)}
      <ellipse cx="120" cy="40" rx="18" ry="5.5" fill="#fff" fillOpacity="0.95" />
    </svg>
  );
};

// Pointer: a bead at rest, a larger butter bead when over something live.
export const pointerSvg = (over) =>
  over
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="#FFD84D" stroke="#13245E" stroke-width="3"/><circle cx="20" cy="20" r="17" fill="none" stroke="#fff" stroke-opacity="0.9" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="#fff" fill-opacity="0.9"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="8" fill="#4D84DC" stroke="#fff" stroke-width="3"/><circle cx="20" cy="20" r="11" fill="none" stroke="#13245E" stroke-opacity="0.7" stroke-width="1.5"/><circle cx="17.5" cy="17.5" r="2" fill="#fff"/></svg>`;

export const pointerCss = (over) =>
  `url("data:image/svg+xml,${encodeURIComponent(pointerSvg(over))}") 20 20, auto`;

export const Pointer = ({ over }) => (
  <span dangerouslySetInnerHTML={{ __html: pointerSvg(over) }} />
);
