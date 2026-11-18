import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePage, useMedia, PHONE, smooth, injectFace } from './kit';
import ZineFooter from './ZineFooter';
import { useSlamIntro, ZINE_REVEALS } from './loadIn';
import '../../styles/portfolio/zine.scss';

const PAPER = '#F2EFDF';
const EMAIL = 'HunterAfrick@gmail.com';

// The zine's paper, running header and footer around any other page (/404, /web-design, /music).
// `sections` is [id, label] pairs for the in-page tabs; each section element carries a matching id.
// `prerender` pages (the indexable ones) ship their full content in the HTML and skip the load-in animation, so search
// engines and slow connections see the text at once. Other pages (404) render client-side only, after the intro starts.
export default function ZineShell({ sections = [], contactId, prerender = false, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return prerender || mounted
    ? <Sheet sections={sections} contactId={contactId} intro={!prerender}>{children}</Sheet>
    : <div style={{ position: 'fixed', inset: 0, background: PAPER }} />;
}

function Sheet({ sections, contactId, intro, children }) {
  usePage(null, PAPER); // fonts are self-hosted (see _fonts.scss), as for the Zine
  useEffect(injectFace, []);
  const rootEl = useRef(null);
  // No masthead here, so the intro is just a short beat before the same scroll-in reveals the Zine uses.
  // `intro` never changes for a given page, so the hook is called the same way on every render.
  useSlamIntro(rootEl, { mast: '.tz-mast', shake: '.tz-cover', reveals: intro ? ZINE_REVEALS : [], typed: '.tz-nav > button, .tz-nav > div > button:not(.tz-nav-home)', off: !intro });
  const phone = useMedia(PHONE);
  const [active, setActive] = useState(null);

  const go = (id) => {
    // a page with no #contact block of its own (/intake) points Contact at the footer, which has the email
    const root = rootEl.current;
    const el = root && (root.querySelector(`#${id}`) || (id === contactId ? root.querySelector('.tz-foot') : null));
    if (!el) return;
    // Short pages already show the contact cards/footer, or sit at the end of their scroll, so scrolling would look like
    // a dead button. In that case Contact does the useful thing and opens an email to me.
    if (id === contactId) {
      const atEnd = root.scrollTop + root.clientHeight >= root.scrollHeight - 4;
      const r = el.getBoundingClientRect();
      const inView = r.top >= 0 && r.top < root.clientHeight * 0.6;
      if (atEnd || inView) { window.location.href = `mailto:${EMAIL}`; return; }
    }
    el.scrollIntoView({ behavior: smooth(), block: 'start' });
  };
  const toTop = () => rootEl.current && rootEl.current.scrollTo({ top: 0, behavior: smooth() });
  const navigate = useNavigate();
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
