import React, { useEffect } from 'react';
import { glyphs } from './data';

const loadFonts = (href) => {
  if (typeof document === 'undefined' || !href) return;
  if (document.querySelector(`link[data-lang-fonts="${href}"]`)) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = href;
  l.setAttribute('data-lang-fonts', href);
  document.head.appendChild(l);
};

export const Glyph = ({ k, className = 'pf-glyph' }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={glyphs[k]} />
  </svg>
);

// Loads a language's fonts and paints the body behind the fixed page, so overscroll never shows the live site.
export const usePage = (fonts, bg) => {
  useEffect(() => {
    loadFonts(fonts);
    const prev = document.body.style.background;
    document.body.style.background = bg;
    return () => { document.body.style.background = prev; };
  }, [fonts, bg]);
};

export const pad = (n) => String(n).padStart(2, '0');

// Pages built on ZineShell (/404) render client-side only, so reading matchMedia up front is safe.
export const PHONE = '(max-width: 700px)';
export const TABLET = '(min-width: 701px) and (max-width: 1024px), (min-width: 701px) and (max-width: 1200px) and (orientation: portrait)';
export const useMedia = (q) => {
  const [m, setM] = React.useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
};
export const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

// Same rule and style id as the Zine, so it is only ever injected once.
export const FACE = "@font-face{font-family:'Microgramma D Extended';font-weight:700;font-display:swap;src:local('Microgramma D Extended Bold'),local('MicrogrammaDExtended-Bold');}";
export const injectFace = () => {
  if (!document.getElementById('gh-face')) {
    const s = document.createElement('style');
    s.id = 'gh-face'; s.textContent = FACE; document.head.appendChild(s);
  }
};
