import React from 'react';
import { Link } from 'react-router-dom';
import { links } from './data';
import { PAGES } from './pages';

const EMAIL = 'HunterAfrick@gmail.com';

// The zine's colophon: the last thing on every page. `nav` is [label, onClick] pairs; `onTop` scrolls back to the cover.
export default function ZineFooter({ nav = [], onTop }) {
  const year = new Date().getFullYear();
  return (
    <footer className="tz-foot">
      <div className="tz-foot-in">
        <div className="tz-foot-brand">
          <p className="tz-foot-name">Hunter Africk</p>
          <ul className="tz-foot-tags" aria-label="Roles">
            {['Developer', 'Musician', 'Writer', 'Illustrator'].map((t) => <li key={t}>{t}</li>)}
          </ul>
          <p className="tz-foot-line">Reno, NV</p>
        </div>

        {nav.length > 0 && (
          <nav className="tz-foot-col" aria-label="Footer">
            <h2 className="tz-foot-h">In this issue</h2>
            <ul>
              {nav.map(([label, go]) => (
                <li key={label}><button type="button" onClick={go}>{label}</button></li>
              ))}
            </ul>
          </nav>
        )}

        <nav className="tz-foot-col" aria-label="Pages">
          <h2 className="tz-foot-h">Pages</h2>
          <ul>
            {PAGES.map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}
          </ul>
        </nav>

        <div className="tz-foot-col">
          <h2 className="tz-foot-h">Elsewhere</h2>
          <ul>
            {links.map((l) => (
              <li key={l.name}><a href={l.href} target="_blank" rel="noopener noreferrer">{l.name}<span aria-hidden="true"> &#8599;</span></a></li>
            ))}
          </ul>
        </div>

        <div className="tz-foot-col">
          <h2 className="tz-foot-h">Write me</h2>
          <a className="tz-foot-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </div>

      <div className="tz-foot-base">
        <p>&copy; {year} Hunter Africk &middot; From the Void LLC. All rights reserved.</p>
        {onTop && <button type="button" className="tz-foot-top" onClick={onTop}>Back to the cover <span aria-hidden="true">&uarr;</span></button>}
      </div>
    </footer>
  );
}
