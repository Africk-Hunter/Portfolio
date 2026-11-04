import React, { useEffect, useState } from 'react';
import '../../styles/language/Switcher.scss';
import SiteBackground from '../SiteBackground';
import Windowsill from './Windowsill';
import A, { meta as metaA } from './iterations/a';
import B, { meta as metaB } from './iterations/b';
import E, { meta as metaE } from './iterations/e';
import F, { meta as metaF } from './iterations/f';
import G, { meta as metaG } from './iterations/g';
import H, { meta as metaH } from './iterations/h';
import Portfolio from './portfolio/Portfolio';
import { portfolioIds } from './portfolio/themes';

// Add an iteration here and it appears in the switcher. Each one is a self-contained, fixed-position sheet.
export const iterations = [
  { id: 'original', name: 'Windowsill', tagline: 'The first pass.', Component: Windowsill },
  { ...metaA, Component: A },
  { ...metaB, Component: B },
  { ...metaE, Component: E },
  { ...metaF, Component: F },
  { ...metaG, Component: G },
  { ...metaH, Component: H },
];

const ids = iterations.map((i) => i.id);

const Language = () => {
  const [active, setActive] = useState(ids[0]);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState('language'); // 'language' or 'portfolio'

  // Restore from the URL hash (#f or #f/portfolio) or the last choice.
  useEffect(() => {
    const [hashId, hashView] = window.location.hash.slice(1).split('/');
    let id = hashId;
    if (!ids.includes(id)) {
      try { id = window.localStorage.getItem('lang-iteration'); } catch (e) { id = null; }
    }
    if (ids.includes(id)) setActive(id);
    if (hashView === 'portfolio' && portfolioIds.includes(id)) setView('portfolio');
  }, []);

  const writeHash = (id, v) => window.history.replaceState(null, '', v === 'portfolio' ? `#${id}/portfolio` : `#${id}`);

  const choose = (id) => {
    setActive(id);
    setOpen(false);
    try { window.localStorage.setItem('lang-iteration', id); } catch (e) { /* ignore */ }
    // Keep the portfolio view when the new language has one; otherwise fall back to the language sheet.
    const v = view === 'portfolio' && portfolioIds.includes(id) ? 'portfolio' : 'language';
    setView(v);
    writeHash(id, v);
  };

  const chooseView = (v) => {
    if (v === 'portfolio' && !portfolioIds.includes(active)) return;
    setView(v);
    writeHash(active, v);
  };

  // [ and ] step through iterations, Escape closes the picker.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest && e.target.closest('input, textarea, select')) return;
      const i = ids.indexOf(active);
      if (e.key === ']') choose(ids[(i + 1) % ids.length]);
      else if (e.key === '[') choose(ids[(i - 1 + ids.length) % ids.length]);
      else if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const current = iterations.find((i) => i.id === active);
  const { Component } = current;
  const hasPortfolio = portfolioIds.includes(active);
  const showPortfolio = view === 'portfolio' && hasPortfolio;

  return (
    <>
      <SiteBackground />
      {showPortfolio ? <Portfolio key={`p-${active}`} themeId={active} /> : <Component key={active} />}
      <div className={`lang-switch ${open ? 'open' : ''}`}>
        {open && (
          <ul role="listbox" aria-label="Iterations">
            {iterations.map((it, n) => (
              <li key={it.id}>
                <button type="button" role="option" aria-selected={it.id === active} onClick={() => choose(it.id)}>
                  <b>{n + 1}</b>
                  <span>{it.name}<small>{it.tagline}</small></span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="lang-views" role="tablist" aria-label="View">
          <button type="button" role="tab" aria-selected={!showPortfolio} onClick={() => chooseView('language')}>Language</button>
          <button type="button" role="tab" aria-selected={showPortfolio} disabled={!hasPortfolio} title={hasPortfolio ? '' : 'No portfolio mockup for this one yet'} onClick={() => chooseView('portfolio')}>Portfolio</button>
        </div>
        <div className="lang-bar">
          <button type="button" aria-label="Previous iteration" onClick={() => choose(ids[(ids.indexOf(active) - 1 + ids.length) % ids.length])}>‹</button>
          <button type="button" className="lang-now" aria-expanded={open} onClick={() => setOpen(!open)}>
            <b>{ids.indexOf(active) + 1}/{ids.length}</b> {current.name}
          </button>
          <button type="button" aria-label="Next iteration" onClick={() => choose(ids[(ids.indexOf(active) + 1) % ids.length])}>›</button>
        </div>
      </div>
    </>
  );
};

export default Language;
