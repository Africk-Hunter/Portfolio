import React, { useEffect, useRef, useState } from 'react';
import externalLinkIcon from '../images/externalLink.svg';
import githubIcon from '../images/githubIconBlack.svg';
import intraconnectedPlaceholder from '../images/placeholders/intraconnected.app_(Desktop).png';
import lunaPlaceholder from '../images/placeholders/lunalashandbeautyco.com_(Desktop).png';
import stockZPlaceholder from '../images/placeholders/stock-z.com_main(Desktop).png';
import { projects, defaultProjectIds } from '../data/projects';

// Screenshots shown when a site can't be previewed live. Projects without one fall back to their logo.
const PLACEHOLDER_IMAGES = {
  intraconnected: intraconnectedPlaceholder,
  llabc: lunaPlaceholder,
  stockZ: stockZPlaceholder,
};

// Origins each site allows to embed it, taken from its X-Frame-Options / CSP frame-ancestors
// headers (`curl -sI <url>`). An empty list means the site refuses every origin; sites not listed
// send no framing restrictions. Browsers enforce these silently (the iframe still fires `load`
// on an error page), so they can't be detected at runtime. Re-probe if a site's headers change.
const FRAME_ANCESTORS = {
  intraconnected: ['https://hunterafrick.com'], // frame-ancestors 'self' https://hunterafrick.com
  llabc: [], // X-Frame-Options: DENY
  stockZ: [], // frame-ancestors 'none'
};

// The iframe renders the site at this desktop size, then scales down to the frame's width.
// 16:9 to match the viewport and the 1920x1080 placeholder screenshots.
const VIRTUAL_WIDTH = 1440;
const VIRTUAL_HEIGHT = 810;

// No load event within this window counts as a failed preview.
const LOAD_TIMEOUT_MS = 15000;

const canFrameFrom = (projectId, origin) => {
  const allowed = FRAME_ANCESTORS[projectId];
  return !allowed || allowed.includes(origin);
};

// Preview status: 'idle' (not near the viewport yet) → 'loading' → 'loaded', or 'static'
// when the live preview is unavailable or failed and the placeholder is shown instead.
const getInitialStatus = (projectId, projectLink) => {
  if (!projectLink || FRAME_ANCESTORS[projectId]?.length === 0) {
    return 'static';
  }
  return 'idle';
};

const SiteShowcase = ({ ids = defaultProjectIds }) => {
  const [jsReady, setJsReady] = useState(false);

  useEffect(() => {
    setJsReady(true);
  }, []);

  return (
    <section id="Websites" className={`swShowcase${jsReady ? ' js-ready' : ''}`}>
      <h1 className="swLabel">Websites</h1>
      <div className="swList">
        {ids.map((id) => (
          <ShowcaseRow key={id} projectId={id} project={projects[id]} />
        ))}
      </div>
    </section>
  );
};

const ShowcaseRow = ({ projectId, project }) => {
  const rowRef = useRef(null);
  const [inView, setInView] = useState(false);
  const projectLink = project.projectLink || '';

  // Reveals the row and starts its preview the first time it nears the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );

    observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article ref={rowRef} className={`swRow${inView ? ' is-visible' : ''}`}>
      <BrowserFrame projectId={projectId} project={project} projectLink={projectLink} inView={inView} />
      <div className="swInfo">
        <h2 className="swTitle">
          {projectLink ? (
            <a href={projectLink} target="_blank" rel="noopener noreferrer">
              {project.projectTitle}
            </a>
          ) : (
            <span>{project.projectTitle}</span>
          )}
        </h2>
        <p className="swDescription">{project.projectDesc}</p>
        <TechChips technologies={project.technologyArray} />
        <LinkButtons
          projectLink={projectLink}
          githubLink={project.githubLink}
          projectTitle={project.projectTitle}
        />
      </div>
    </article>
  );
};

const BrowserFrame = ({ projectId, project, projectLink, inView }) => {
  const viewportRef = useRef(null);
  const [status, setStatus] = useState(() => getInitialStatus(projectId, projectLink));
  const showIframe = status === 'loading' || status === 'loaded';
  const placeholderImage = PLACEHOLDER_IMAGES[projectId];

  // The page's own origin decides whether the site will let itself be framed here.
  useEffect(() => {
    if (inView && status === 'idle') {
      setStatus(canFrameFrom(projectId, window.location.origin) ? 'loading' : 'static');
    }
  }, [inView, status, projectId]);

  useEffect(() => {
    if (status !== 'loading') {
      return undefined;
    }
    const timer = setTimeout(() => setStatus('static'), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [status]);

  // Scale the virtual desktop render to the viewport's width.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !showIframe || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const updateScale = () => {
      viewport.style.setProperty('--sw-scale', String(viewport.clientWidth / VIRTUAL_WIDTH));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [showIframe]);

  return (
    <div className="swFrame">
      <div className="swFrameBar">
        <span className="swDots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {projectLink ? (
          <a className="swUrl" href={projectLink} target="_blank" rel="noopener noreferrer" tabIndex={-1}>
            <LockIcon />
            <span className="swUrlText">{getDomain(projectLink)}</span>
          </a>
        ) : (
          <span className="swUrl">
            <span className="swUrlText">Not publicly hosted</span>
          </span>
        )}
        <span className="swFrameStatus">{status === 'loaded' && 'Live'}</span>
      </div>
      <div className={`swViewport${status === 'static' ? ' swViewport--static' : ''}`} ref={viewportRef}>
        {status === 'static' && (
          <img
            className={`swFallback${placeholderImage ? '' : ' swFallback--logo'}`}
            src={placeholderImage || project.projectImage}
            alt=""
          />
        )}
        {(status === 'idle' || status === 'loading') && (
          <span className="swLoading" aria-hidden="true">Loading preview</span>
        )}
        {showIframe && (
          <iframe
            className={`swIframe${status === 'loaded' ? ' is-loaded' : ''}`}
            src={projectLink}
            style={{ width: VIRTUAL_WIDTH, height: VIRTUAL_HEIGHT }}
            title={`${project.projectTitle} live preview`}
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-forms"
            aria-hidden="true"
            tabIndex={-1}
            onLoad={() => setStatus((current) => (current === 'loading' ? 'loaded' : current))}
            onError={() => setStatus('static')}
          />
        )}
        {projectLink && (
          <a
            className="swOverlay"
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Preview of ${project.projectTitle}: open site in a new tab`}
          />
        )}
        {status === 'static' && projectLink && (
          <span className="swStaticHint" aria-hidden="true">
            Open live site <span>→</span>
          </span>
        )}
      </div>
    </div>
  );
};

const LockIcon = () => (
  <svg className="swUrlIcon" viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <rect x="2" y="5.5" width="8" height="5.5" rx="1.25" fill="currentColor" />
    <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const TechChips = ({ technologies = [] }) => (
  <ul className="swChips" aria-label="Technologies">
    {technologies.map((tech, index) => (
      <li key={`${tech.name}-${index}`} className="swChip">
        {tech.name}
      </li>
    ))}
  </ul>
);

const LinkButtons = ({ projectLink, githubLink, projectTitle }) => (
  <div className="swLinkButtons">
    {projectLink && (
      <a
        className="swAction swAction--primary"
        href={projectLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="swActionIcon" src={externalLinkIcon} alt="" aria-hidden="true" />
        <span>Visit site</span>
      </a>
    )}
    <a
      className="swAction swAction--secondary"
      href={githubLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`GitHub repository for ${projectTitle}`}
    >
      <img className="swActionIcon" src={githubIcon} alt="" aria-hidden="true" />
      <span>GitHub</span>
    </a>
  </div>
);

const getDomain = (projectLink) => {
  try {
    return new URL(projectLink).host.replace(/^www\./i, '').toLowerCase();
  } catch (error) {
    return 'Live site';
  }
};

export default SiteShowcase;
