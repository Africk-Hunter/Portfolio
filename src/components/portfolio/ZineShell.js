import React, { useEffect, useRef, useState } from 'react';
import { navigate } from 'gatsby';
import { usePage, useMedia, PHONE, smooth, injectFace } from './kit';
import ZineFooter from './ZineFooter';
import { useSlamIntro, ZINE_REVEALS } from './loadIn';
import '../../styles/portfolio/zine.scss';

const PAPER = '#F2EFDF';

// The zine's paper, running header and footer around any other page (/404).
// `sections` is [id, label] pairs for the in-page tabs; each section element carries a matching id.
// Like the Zine it measures the screen, so it renders client-side only: a blank sheet of paper fills in until then.
export default function ZineShell({ sections = [], contactId, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted
    ? <Sheet sections={sections} contactId={contactId}>{children}</Sheet>
    : <div style={{ position: 'fixed', inset: 0, background: PAPER }} />;
}

function Sheet({ sections, contactId, children }) {
  usePage(null, PAPER); // fonts are self-hosted (see gatsby-ssr.js), as for the Zine
  useEffect(injectFace, []);
  const rootEl = useRef(null);
  // No masthead here, so the intro is just a short beat before the same scroll-in reveals the Zine uses.
  useSlamIntro(rootEl, { mast: '.tz-mast', shake: '.tz-cover', reveals: ZINE_REVEALS, typed: '.tz-nav > button, .tz-nav > div > button:not(.tz-nav-home)' });
  const phone = useMedia(PHONE);
  const [active, setActive] = useState(null);

  const go = (id) => {
    const el = rootEl.current && rootEl.current.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: smooth(), block: 'start' });
  };
  const toTop = () => rootEl.current && rootEl.current.scrollTo({ top: 0, behavior: smooth() });
  const home = () => navigate('/');

  // Lights the tab for the section in view.
  useEffect(() => {
    const root = rootEl.current;
    if (!root || !sections.length) return undefined;
    const track = () => {
      let cur = null;
      sections.forEach(([id]) => {
        const el = root.querySelector(`#${id}`);
        if (el && root.scrollTop >= el.offsetTop - root.clientHeight * 0.4) cur = id;
      });
      if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4 && contactId) cur = contactId;
      setActive(cur);
    };
    track();
    root.addEventListener('scroll', track, { passive: true });
    return () => root.removeEventListener('scroll', track);
  }, [sections, contactId]);

  const tabs = sections.filter(([id]) => id !== contactId);
  const footNav = [['Cover', () => home()], ...sections.map(([id, label]) => [label, () => go(id)])];

  return (
    <div className="tz tz-shell" ref={rootEl}>
      <nav className="tz-nav" aria-label="Main">
        <button type="button" className="tz-nav-mark" aria-label="Hunter Africk, back to the cover" onClick={home}>{phone ? 'HA' : 'HUNTER AFRICK'}</button>
        <div>
          {tabs.map(([id, label]) => (
            <button key={id} type="button" aria-current={active === id ? 'true' : undefined} onClick={() => go(id)}>{label}</button>
          ))}
          {contactId && (
            <button type="button" className="tz-jelly tz-jelly-s tz-nav-cta" aria-current={active === contactId ? 'true' : undefined} onClick={() => go(contactId)}>Contact</button>
          )}
        </div>
      </nav>
      <main>{children}</main>
      <ZineFooter nav={footNav} onTop={toTop} />
    </div>
  );
}
