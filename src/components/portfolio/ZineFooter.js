import React from 'react';
import { links } from './data';

const EMAIL = 'HunterAfrick@gmail.com';

// The zine's colophon: the last thing on every page. `nav` is [label, onClick] pairs; `onTop` scrolls back to the cover.
export default function ZineFooter({ nav = [], onTop }) {
  const year = new Date().getFullYear();
  return (
    <footer className="tz-foot">
      <div className="tz-foot-in">
        <div className="tz-foot-brand">
          <p className="tz-foot-name">Hunter Africk</p>
          <p className="tz-foot-line">Developer &middot; Musician &middot; Writer &middot; Illustrator</p>
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
          <p className="tz-foot-line">Commissions, collaborations, a song you think I&rsquo;d like.</p>
        </div>
      </div>

      <div className="tz-foot-base">
        <p>&copy; {year} Hunter Africk. All rights reserved.</p>
        {onTop && <button type="button" className="tz-foot-top" onClick={onTop}>Back to the cover <span aria-hidden="true">&uarr;</span></button>}
      </div>
    </footer>
  );
}
