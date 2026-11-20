import React from 'react';
import { work } from './data';
import blmLogo from '../../images/blm-logo.svg';
import bfosLogo from '../../images/buildflowos-logo.svg';
import intraShot from '../../images/opt/intraconnected.webp';
import '../../styles/portfolio/projects.scss';

// Each card wears the look of the site it represents (colors, type and button style come from that site's own
// stylesheet; see projects.scss). Copy comes from data.js, so this stays in step with the rest of the portfolio.
const order = ['intraconnected', 'blm', 'whosedebut', 'buildflowos', 'stockz', 'luna'];
const byId = (id) => work.find((w) => w.id === id);
const stackOf = (w) => w.stack.filter((s) => s !== 'Claude');
const num = (i) => `No. ${String(i + 1).padStart(2, '0')}`;

const Ext = () => (
  <svg className="pj-out" viewBox="0 0 12 12" width="0.8em" height="0.8em" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M3 9 9 3M4 3h5v5" /></svg>
);

// "Visit" is the card's main button; any other link (the code) is a quieter text link.
const Links = ({ w, arrow }) => {
  const visit = w.links.find(([l]) => l === 'Visit');
  const rest = w.links.filter(([l]) => l !== 'Visit');
  return (
    <p className="pj-go">
      {visit && <a className="pj-btn" href={visit[1]} target="_blank" rel="noopener noreferrer">{visit[1].replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}{arrow}</a>}
      {rest.map(([l, h]) => <a key={l} className="pj-alt" href={h} target="_blank" rel="noopener noreferrer">{l === 'GitHub' ? 'Code on GitHub' : l}</a>)}
    </p>
  );
};

const Meta = ({ w }) => <p className="pj-meta">{w.role} &middot; {stackOf(w).join(', ')}</p>;

const Intra = ({ w, i }) => (
  <article className="pj pj-intra">
    <div className="pj-copy">
      <p className="pj-tag">{num(i)} &middot; Flagship</p>
      <h3>{w.title}</h3>
      <p className="pj-dek">An idea tracker that grows your thoughts into a tree.</p>
      <p>{w.blurb}</p>
      <ul className="pj-checks">
        <li className="pj-bar" aria-hidden="true">3/3</li>
        <li>{w.role}</li>
        <li>{stackOf(w).join(', ')}</li>
      </ul>
      <Links w={w} arrow={<Ext />} />
    </div>
    <figure className="pj-shot">
      <div className="pj-shot-bar" aria-hidden="true"><i /><i /><i /><span>intraconnected.app</span></div>
      <img src={intraShot} alt="Intraconnected on the web: a project open with a note, a checklist and idea cards on a green grid" loading="eager" decoding="async" />
    </figure>
  </article>
);

const Blm = ({ w, i }) => (
  <article className="pj pj-blm">
    <img className="pj-logo" src={blmLogo} alt="" aria-hidden="true" loading="lazy" decoding="async" />
    <p className="pj-tag">{num(i)} &middot; Client work</p>
    <h3>Biggest <em>little</em> Media</h3>
    <p>{w.blurb}</p>
    <Meta w={w} />
    <Links w={w} arrow={<span className="pj-arr"> &rarr;</span>} />
  </article>
);

const Debut = ({ w, i }) => (
  <article className="pj pj-wd">
    <p className="pj-tag">{num(i)} &middot; 2026</p>
    <div className="pj-vinyl" aria-hidden="true" />
    <h3>{w.title}</h3>
    <div className="pj-rule" aria-hidden="true" />
    <p>{w.blurb}</p>
    <Meta w={w} />
    <Links w={w} />
  </article>
);

const Luna = ({ w, i }) => (
  <article className="pj pj-luna">
    <div className="pj-leaf" aria-hidden="true" />
    <div className="pj-pebble" aria-hidden="true" />
    <svg className="pj-swirl" viewBox="0 0 92 52" aria-hidden="true"><path d="M2 46C24 50 58 40 78 22 92 9 86 0 72 4 56 9 40 26 30 38" fill="none" stroke="#F8F8FF" strokeWidth="1.4" strokeLinecap="round" /></svg>
    <p className="pj-tag">{num(i)} &middot; Client work</p>
    <h3>{w.title}</h3>
    <p>{w.blurb}</p>
    <Meta w={w} />
    <Links w={w} arrow={<span className="pj-arr"> &rarr;</span>} />
  </article>
);

const Stock = ({ w, i }) => (
  <article className="pj pj-stockz">
    <svg className="pj-chart" viewBox="0 0 96 40" aria-hidden="true">
      <rect x="0" y="25" width="96" height="10" fill="#9BCB5E" fillOpacity=".16" />
      <path d="M0 25H96M0 35H96" stroke="#9BCB5E" strokeOpacity=".55" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M0 14 9 10 17 18 25 15 33 27 41 22 49 31 57 24 65 12 73 16 81 6 89 9 96 3" fill="none" stroke="#F2ECD2" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    <p className="pj-tag">{num(i)} &middot; Web app</p>
    <h3>Stock <span>Z</span></h3>
    <p>{w.blurb}</p>
    <Meta w={w} />
    <Links w={w} />
  </article>
);

// BuildFlowOS wears its own site's look: deep navy, blue rules, one orange accent, Barlow caps.
const Bfos = ({ w, i }) => (
  <article className="pj pj-bfos">
    <p className="pj-tag">{num(i)} &middot; Client website</p>
    <h3><img className="pj-wordmark" src={bfosLogo} alt={w.title} loading="lazy" decoding="async" /></h3>
    <p>{w.blurb}</p>
    <Meta w={w} />
    <Links w={w} arrow={<span className="pj-arr"> &rarr;</span>} />
  </article>
);

const cards = { intraconnected: Intra, blm: Blm, whosedebut: Debut, luna: Luna, stockz: Stock, buildflowos: Bfos };

export default function ProjectCards() {
  return (
    <div className="pj-grid">
      {order.map((id, i) => {
        const C = cards[id];
        return <div key={id} className={`pj-pin pj-pin-${i % 3}${id === 'intraconnected' ? ' is-wide' : ''}`}><C w={byId(id)} i={i} /></div>;
      })}
      <div className="pj-pin pj-pin-1">
        <a className="pj pj-you" href="mailto:HunterAfrick@gmail.com">
          <svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 52C28 40 33 30 30 14" /><path d="M30 40C20 40 14 33 13 25C23 25 29 31 30 40Z" /><path d="M31 30C40 30 46 24 47 16C37 16 31 21 31 30Z" /></svg>
          <p className="pj-tag">No. 07 &middot; Next</p>
          <h3>Your site here</h3>
          <p>Have a business or a project that needs a home on the web? Let&rsquo;s plant it.</p>
          <p className="pj-go"><span className="pj-btn">Email me</span></p>
        </a>
      </div>
    </div>
  );
}
