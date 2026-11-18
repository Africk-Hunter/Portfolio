import React from 'react';
import SubPage, { Drift, EMAIL } from '../components/portfolio/SubPage';
import { SEO } from '../components/seo';
import { pageSchema } from '../components/schema';
import { bio } from '../components/portfolio/data';
import ProjectCards from '../components/portfolio/ProjectCards';

const PATH = '/web-design/';
const DESC = 'Hunter Africk designs and builds custom websites and web apps in Reno, NV. See the projects: Intraconnected, Biggest Little Media, Luna Lash & Beauty Co, Stock Z and more.';

// A browser window with a seedling growing out of it (the same drawing as the Websites page of the zine).
const Sprout = () => (
  <svg className="tz-sprout" viewBox="0 0 220 260" aria-hidden="true">
    <rect className="tz-sprout-win" x="16" y="104" width="188" height="134" rx="12" />
    <path className="tz-sprout-rule" d="M16 130H204" />
    <circle className="tz-sprout-dot" cx="32" cy="117" r="5" />
    <circle className="tz-sprout-dot is-pink" cx="47" cy="117" r="5" />
    <circle className="tz-sprout-dot is-sea" cx="62" cy="117" r="5" />
    <rect className="tz-sprout-url" x="78" y="111" width="112" height="12" rx="6" />
    <path className="tz-sprout-text" d="M32 152H72M32 164H62M150 152H188M158 164H188" />
    <path className="tz-sprout-soil" d="M56 238C76 210 146 210 166 238Z" />
    <path className="tz-sprout-stem" d="M111 218C107 170 118 110 104 44" />
    {[[110, 190, -1], [112, 156, 1], [111, 118, -1], [108, 82, 1]].map(([x, y, s], i) => (
      <path key={i} transform={`translate(${x} ${y}) scale(${s * (0.62 - i * 0.07)} ${0.62 - i * 0.07})`} d="M0 0C34-6 70-26 84-62C46-60 10-36 0 0Z" />
    ))}
    <circle className="tz-sprout-bud" cx="104" cy="38" r="8" />
    <path className="tz-sprout-cursor" d="M140 44L140 74L148 66L154 79L160 76L154 63L165 63Z" />
  </svg>
);

const Art = () => (
  <div className="ws-art">
    <Sprout />
    <p className="mu-burst ws-burst" aria-hidden="true"><b>made</b> by one person</p>
  </div>
);

export default function WebDesignPage() {
  return (
    <SubPage path={PATH} tone="ws" kicker="Web design" folio="p.12 · Build" art={<Art />}
      title="Web design and development in Reno, NV"
      stand="I design and build custom websites and web apps for Reno small businesses and local creators. The design and the code come from the same person."
      actions={(
        <p className="ws-label">
          <b>B.S. Computer Science &amp; Engineering</b>
          University of Nevada, Reno &middot; based in {bio.where}
        </p>
      )}>

      <section className="ws-shelf">
        <header className="ws-shelf-head">
          <h2>Projects</h2>
          <p className="tz-kicker">6 sites on the shelf</p>
        </header>
        <ProjectCards />
      </section>

      <section className="tz-tank ws-tank">
        <Drift />
        <p className="tz-kicker">Your turn</p>
        <h2>Want a site?</h2>
        <p className="tz-novel-dek">Want a site for your business? Write to me and tell me what you&rsquo;re growing.</p>
        <div className="tz-row">
          <a className="tz-jelly" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </section>
    </SubPage>
  );
}

export const Head = () => (
  <SEO title="Web Design & Development in Reno, NV" description={DESC} pathname={PATH}
    schema={pageSchema({ path: PATH, name: 'Web design and development in Reno, NV', description: DESC })} />
);
