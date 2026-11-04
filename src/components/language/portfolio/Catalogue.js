import React, { useRef, useState } from 'react';
import { work, disciplines, bio, links, portrait, nameOf, countOf } from '../../portfolio/data';
import { Glyph, usePage, pad } from '../../portfolio/kit';
import '../../../styles/language/portfolio/catalogue.scss';

// Clearcase portfolio: a 2002 product catalogue. Every piece of work is a model in the HA series,
// with a spec sheet, and the compare chart shows which models run more than one mode at once.
const FONTS = 'https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;700&family=Michroma&family=DotGothic16&display=swap';
const model = (w) => `HA-${pad(work.indexOf(w) + 1)}`;
const album = work[0];

const Leds = ({ kinds, big }) => (
  <span className={`cc-leds${big ? ' cc-leds-big' : ''}`} aria-label={`Modes: ${kinds.map(nameOf).join(', ')}`}>
    {disciplines.map((d) => <i key={d.id} className={kinds.includes(d.id) ? 'is-on' : ''}><b>{d.name[0]}</b></i>)}
  </span>
);

const Art = ({ w }) => (w.image
  ? <img src={w.image} alt={`${w.title}`} className={w.square ? 'is-square' : ''} />
  : <span className="cc-proto"><Glyph k={w.kinds[0]} /><b>{w.title}</b><small>Prototype</small></span>);

export default function Catalogue() {
  usePage(FONTS, '#EFEBDD');
  const [modes, setModes] = useState([]);
  const [sel, setSel] = useState(work[1].id);
  const detailRef = useRef(null);
  const secs = useRef({});
  const reg = (id) => (el) => { secs.current[id] = el; };
  const go = (id) => secs.current[id] && secs.current[id].scrollIntoView({ behavior: 'smooth', block: 'start' });

  const lineup = modes.length ? work.filter((w) => w.kinds.some((k) => modes.includes(k))) : work;
  const cur = work.find((w) => w.id === sel);
  const choose = (id) => {
    setSel(id);
    const el = detailRef.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="cc">
      <header className="cc-top">
        <span className="cc-brand"><i className="cc-led-dot" />HUNTER AFRICK</span>
        <span className="cc-vol">Product catalogue · Vol. 04 · 2026</span>
        <nav aria-label="Sections">
          {[['lineup', 'Lineup'], ['compare', 'Compare'], ['maker', 'Maker'], ['service', 'Service']].map(([id, l]) => <button key={id} type="button" onClick={() => go(id)}>{l}</button>)}
        </nav>
      </header>

      <div className="cc-page">
        <section className="cc-hero">
          <div className="cc-hero-copy">
            <span className="cc-sticker"><b>NEW</b>4 modes</span>
            <h1>One maker.<br />Four modes.</h1>
            <p className="cc-lede">The HA series: albums, web apps, a novel and drawings. Every model designed, built and finished by hand in {bio.where}. Most of them run more than one mode at once.</p>
            <div className="cc-legend">
              {disciplines.map((d) => (
                <span key={d.id} className={`cc-legend-k cc-k-${d.id}`}><i className="cc-lamp is-on" /><Glyph k={d.id} />{d.name}<em>{pad(countOf(d.id))}</em></span>
              ))}
            </div>
            <div className="cc-actions">
              <button type="button" className="cc-key" onClick={() => go('lineup')}>See the lineup</button>
              <button type="button" className="cc-key cc-key-plain" onClick={() => go('service')}>Contact</button>
            </div>
          </div>

          <figure className="cc-shot">
            <div className="cc-stage">
              <img src={album.image} alt="Collection of Sounds, featured model" />
              <i className="cc-plinth" aria-hidden="true" />
            </div>
            {[
              ['a', 'Cover art', 'Drawn in-house'],
              ['b', 'Written + produced', 'By the maker'],
              ['c', 'Mixed + mastered', 'Same pair of ears'],
              ['d', 'Format', 'Streaming, Bandcamp'],
            ].map(([k, t, s]) => <figcaption key={k} className={`cc-call cc-call-${k}`}><b>{t}</b><span>{s}</span></figcaption>)}
            <p className="cc-shot-cap"><span className="cc-lcd">{model(album)}</span> Collection of Sounds · Featured model · {album.year}</p>
          </figure>
        </section>

        <section className="cc-sec" ref={reg('lineup')}>
          <div className="cc-head"><span className="cc-badge">01</span><h2>The HA series</h2><span className="cc-seam" /></div>
          <div className="cc-modes" role="group" aria-label="Filter by mode">
            {disciplines.map((d) => {
              const on = modes.includes(d.id);
              return (
                <button key={d.id} type="button" className={`cc-mode cc-k-${d.id}${on ? ' is-on' : ''}`} aria-pressed={on} onClick={() => setModes(on ? modes.filter((m) => m !== d.id) : [...modes, d.id])}>
                  <i className="cc-lamp" /><Glyph k={d.id} /><span>{d.name}</span>
                </button>
              );
            })}
            <span className="cc-lcd cc-count">{pad(lineup.length)} / {pad(work.length)} MODELS</span>
            {modes.length > 0 && <button type="button" className="cc-key cc-key-plain cc-key-s" onClick={() => setModes([])}>All</button>}
          </div>

          <ul className="cc-line">
            {lineup.map((w) => (
              <li key={w.id}>
                <button type="button" className={`cc-card${sel === w.id ? ' is-sel' : ''}`} aria-pressed={sel === w.id} onClick={() => choose(w.id)}>
                  <span className="cc-card-top"><span className="cc-lcd">{model(w)}</span><Leds kinds={w.kinds} /></span>
                  <span className="cc-card-art"><Art w={w} /></span>
                  <b>{w.title}</b>
                  <small>{w.kind}{w.sample ? ' · prototype' : ''}</small>
                </button>
              </li>
            ))}
          </ul>

          <article className="cc-detail" ref={detailRef} key={cur.id} aria-live="polite">
            <div className="cc-detail-art"><Art w={cur} />{cur.sample && <span className="cc-proto-tag">Prototype · placeholder copy</span>}</div>
            <div className="cc-detail-copy">
              <p className="cc-lcd cc-detail-no">{model(cur)} / {cur.kind.toUpperCase()}</p>
              <h3>{cur.title}</h3>
              <p className="cc-detail-lede">{cur.blurb}</p>
              <p>{cur.long}</p>
              <table className="cc-spec">
                <tbody>
                  <tr><th>Type</th><td>{cur.kind}</td></tr>
                  <tr><th>Maker&rsquo;s role</th><td>{cur.role}</td></tr>
                  <tr><th>Modes</th><td><Leds kinds={cur.kinds} big /> {cur.kinds.map(nameOf).join(' + ')}</td></tr>
                  <tr><th>Built with</th><td>{cur.stack.join(' · ')}</td></tr>
                  <tr><th>Status</th><td>{cur.year || (cur.links.length ? 'In service' : 'In development')}</td></tr>
                </tbody>
              </table>
              {cur.links.length > 0 && (
                <div className="cc-avail"><span className="cc-label">Available at</span>
                  {cur.links.map(([l, h], i) => <a key={l} className={`cc-key${i ? ' cc-key-plain' : ''}`} href={h} target="_blank" rel="noopener noreferrer">{l}</a>)}
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="cc-sec" ref={reg('compare')}>
          <div className="cc-head"><span className="cc-badge">02</span><h2>Compare models</h2><span className="cc-seam" /></div>
          <div className="cc-table-wrap">
            <table className="cc-compare">
              <thead><tr><th>Model</th><th>Type</th>{disciplines.map((d) => <th key={d.id} className="cc-c"><Glyph k={d.id} />{d.name}</th>)}</tr></thead>
              <tbody>
                {work.map((w) => (
                  <tr key={w.id} className={sel === w.id ? 'is-sel' : ''} onClick={() => choose(w.id)}>
                    <td><span className="cc-lcd">{model(w)}</span> <b>{w.title}</b></td>
                    <td>{w.kind}</td>
                    {disciplines.map((d) => <td key={d.id} className="cc-c"><i className={`cc-lamp${w.kinds.includes(d.id) ? ' is-on' : ''}`} aria-label={w.kinds.includes(d.id) ? 'yes' : 'no'} /></td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td>Total</td><td>{pad(work.length)} models</td>{disciplines.map((d) => <td key={d.id} className="cc-c cc-lcd">{pad(countOf(d.id))}</td>)}</tr></tfoot>
            </table>
          </div>
          <p className="cc-fine">{work.filter((w) => w.kinds.length > 1).length} of {work.length} models run two or more modes at once. That is the design brief, not a defect.</p>
        </section>

        <section className="cc-sec cc-maker" ref={reg('maker')}>
          <div className="cc-head"><span className="cc-badge">03</span><h2>About the maker</h2><span className="cc-seam" /></div>
          <div className="cc-maker-in">
            <div className="cc-screen"><img src={portrait} alt="Hunter Africk in his car, grinning" /><span className="cc-lcd">CAM 01 · OPERATOR</span></div>
            <div>
              {bio.long.map((p) => <p key={p}>{p}</p>)}
              <dl className="cc-mspec">
                <div><dt>Plant</dt><dd>{bio.where}</dd></div>
                <div><dt>Training</dt><dd>{bio.school}</dd></div>
                <div><dt>Modes</dt><dd>Build · Sound · Write · Draw</dd></div>
                <div><dt>Influences</dt><dd>Andre 3000, Tame Impala, Erykah Badu</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="cc-sec cc-service" ref={reg('service')}>
          <div className="cc-service-in">
            <span className="cc-sticker cc-sticker-y"><b>Service</b>&amp; support</span>
            <h2>Commissions, collaborations, questions.</h2>
            <p>Need a website, a verse, a cover, or a thing that is all three? Get in touch. Warranty not void if you write.</p>
            <div className="cc-actions">{links.map((l, i) => <a key={l.name} className={`cc-key${i ? ' cc-key-plain' : ''}`} href={l.href} target="_blank" rel="noopener noreferrer">{l.name}</a>)}</div>
          </div>
        </section>

        <footer className="cc-foot">Specifications subject to change as the maker learns new things. Designed in {bio.where}. Batteries not included.</footer>
      </div>
    </div>
  );
}
