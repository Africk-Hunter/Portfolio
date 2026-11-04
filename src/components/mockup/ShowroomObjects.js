import React, { useEffect, useRef, useState } from 'react';
import { album, domainOf } from './showroomData';

// The skeuomorphic objects that stand on the showroom turntable.

const FRAME_W = 1280;

// A flat-panel display. Live sites render at desktop width inside an iframe,
// scaled down to fit the glass; blocked sites show a scrollable still instead.
export const Monitor = ({ project, screen }) => {
  const glass = useRef(null);
  const [scale, setScale] = useState(0.5);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / FRAME_W));
    ro.observe(glass.current);
    return () => ro.disconnect();
  }, []);

  const href = project.projectLink || project.githubLink;

  return (
    <div className="mon">
      <div className="mon__bezel">
        <div className="mon__glass" ref={glass}>
          {screen.live && (
            <>
              {!loaded && <div className="mon__boot">connecting to {domainOf(project.projectLink)}…</div>}
              <iframe
                className="mon__frame"
                src={project.projectLink}
                title={project.projectTitle}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                style={{ width: FRAME_W, height: FRAME_W * 9 / 16, transform: `scale(${scale})` }}
              />
            </>
          )}
          {screen.still && (
            <div className="mon__still">
              <img src={screen.still} alt={`${project.projectTitle} homepage`} />
            </div>
          )}
          {!screen.live && !screen.still && (
            <div className="mon__nosignal">
              <img src={project.projectImage} alt="" />
              <span>no live site</span>
            </div>
          )}
          {!screen.live && (
            <a className="mon__open" href={href} target="_blank" rel="noopener noreferrer">
              {project.projectLink ? 'open site ↗' : 'view source ↗'}
            </a>
          )}
          <div className="mon__shine" />
        </div>
        <div className="mon__chin">
          <span className="mon__brand">hunter</span>
          <span className="mon__led" />
        </div>
      </div>
      <div className="mon__neck" />
      <div className="mon__foot" />
    </div>
  );
};

// The album standing in its sleeve, the record half out and turning.
export const Vinyl = () => (
  <div className="vin">
    <div className="vin__disc">
      <div className="vin__record">
        <div className="vin__label" style={{ backgroundImage: `url(${album.cover})` }} />
      </div>
      <div className="vin__sheen" />
    </div>
    <a className="vin__sleeve" href={album.links[0].href} target="_blank" rel="noopener noreferrer">
      <img src={album.cover} alt={album.title} />
    </a>
  </div>
);

// An envelope in an acrylic tray. The letter mirrors the contact form as you
// type, and folds away when the message is sent.
export const Envelope = ({ draft, sent }) => (
  <div className={`env ${sent ? 'isSent' : ''}`}>
    <div className="env__back" />
    <div className="env__slot">
      <div className="env__letter">
        <p className="env__salutation">Dear Hunter,</p>
        <p className="env__body">{draft.message || 'Your message will appear here as you write it.'}</p>
        <p className="env__sign">— {draft.name || 'you'}</p>
      </div>
    </div>
    <div className="env__pocket" />
    <div className="env__flap" />
    <div className="env__seal" />
    <div className="env__tray" />
  </div>
);
