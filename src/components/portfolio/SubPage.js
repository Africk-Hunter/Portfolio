import React from 'react';
import { Link } from 'react-router-dom';
import ZineShell from './ZineShell';
import { PAGES } from './pages';
import '../../styles/portfolio/subpages.scss';

export const EMAIL = 'HunterAfrick@gmail.com';

// One-line teaser shown on the "next page" card, keyed by path.
const NEXT_NOTE = {
  '/web-design/': 'Sites built for real businesses, from design to launch.',
  '/music/': 'Records, sleeves and where to hear them.',
};

// The header's only tab is Contact (scrolls to the cards at the foot), so the bar is the same height as on the cover.
const SECTIONS = [['contact', 'Contact']];

// Fireflies and bubbles drifting in a dark "tank" band (styles live in zine.scss).
export const Drift = ({ bubbles = 5 }) => (
  <>
    {[1, 2, 3, 4].map((n) => <i key={n} className={`tz-fly tz-fly-${n}`} aria-hidden="true" />)}
    {Array.from({ length: bubbles }, (_, i) => (
      <i key={i} className="tz-bubble" aria-hidden="true" style={{ '--s': `${10 + ((i * 7) % 16)}px`, left: `${8 + i * (84 / bubbles)}%`, animationDelay: `${-i * 2.3}s` }} />
    ))}
  </>
);

// Layout for the indexable inner pages (/web-design, /music): the zine's paper, header and footer around a cover-style
// hero (copy beside a piece of artwork) and one article with one h1. Prerendered, so the text is in the HTML Google fetches.
export default function SubPage({ path, kicker, folio, title, stand, art, actions, tone = '', children }) {
  const others = PAGES.filter(([to]) => to !== path);
  return (
    <ZineShell prerender sections={SECTIONS} contactId="contact">
      <article className={`tz-page tz-sub ${tone}`}>
        <header className="tz-sub-head">
          <div className="tz-sub-copy">
            <p className="tz-strip"><span><Link to="/">Hunter Africk</Link> &middot; {kicker}</span><span>{folio}</span></p>
            <h1>{title}</h1>
            <p className="tz-stand">{stand}</p>
            {actions}
          </div>
          {art && <div className="tz-sub-art">{art}</div>}
          {[1, 2, 3].map((n) => <i key={n} className={`tz-fly tz-sub-fly-${n}`} aria-hidden="true" />)}
        </header>
        {children}
        <nav id="contact" className="tz-sub-more" aria-label="More from Hunter Africk">
          {others.map(([to, label]) => (
            <Link key={to} className="tz-next" to={to}>
              <span className="tz-kicker">Next page</span>
              <b>{label}</b>
              <span className="tz-next-note">{NEXT_NOTE[to]}</span>
              <i className="tz-next-go" aria-hidden="true">&rarr;</i>
            </Link>
          ))}
          <a className="tz-next tz-next-mail" href={`mailto:${EMAIL}`}>
            <span className="tz-kicker">Work with me</span>
            <b>Have a project? Let&rsquo;s talk.</b>
            <span className="tz-next-note">Email me at {EMAIL}</span>
            <i className="tz-next-go" aria-hidden="true">&rarr;</i>
          </a>
          <Link className="tz-next-home" to="/">Back to the cover <span aria-hidden="true">&uarr;</span></Link>
        </nav>
      </article>
    </ZineShell>
  );
}
