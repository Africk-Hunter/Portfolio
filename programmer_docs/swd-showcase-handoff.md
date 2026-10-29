# Handoff: /swd "Websites" section makeover (live-preview showcase rows)

> Self-contained. The implementer needs no prior conversation.
> Do NOT commit or push. Do NOT change the home page (`/`) look or behavior.

## 1. Context

**Repo:** `d:\Repositories\Portfolio`. Gatsby 5, React 18, SCSS via `gatsby-plugin-sass`, plain JavaScript (no TypeScript). The only scripts are `develop`, `dev`, `build`, `serve`, and `clean`. There is no test or lint script.

**Working tree:** the branch is `master`, and the owner already has uncommitted edits in `About.js`, `Footer.js`, `Navbar.js`, `Projects.js`, `404.js`, `Projects.scss`, `package.json`, plus untracked `src/data/`, `src/images/sadFace.svg`, and `src/pages/swd.js`. **Do not revert, reformat, or stage these.**

**Problem:** The `/swd` page (`src/pages/swd.js`) is a recruiter-facing variant of the portfolio. Its "Websites" section renders the shared `Projects` component with `variant="large"`. Each card shows a small logo thumbnail beside text, which does not show off the sites.

**Decisions already made with the owner:**
- The preview is a **live iframe of the real site** inside a browser-window mockup.
- The layout is **alternating full-width showcase rows**: preview on one side, text on the other, flipping on each row. On mobile the rows stack.
- The change applies to **`/swd` only**. The home page keeps using `Projects` unchanged.

## 2. Verified facts about the codebase

- **`src/pages/swd.js`** imports Navbar, About, Projects, Contact, Footer, SEO, and `../styles/index.scss`. It defines `navLinks = ['Home', 'Websites', 'Contact']` and `projectIds = ['intraconnected', 'whoseDebut', 'biggestLittleMedia', 'llabc', 'stockZ', 'archivist']`, with a comment saying to edit that list to tailor the page. It renders `<Projects ids={projectIds} variant="large" />` inside `<main id="main">`. Keep the list, its comment, the bio, the nav links, and the SEO `Head` export.

- **`src/data/projects.js`** exports `projects` (an object keyed by id) and `defaultProjectIds`. Each project has `projectTitle`, `projectDesc`, `projectLink` (an empty string for Archivist, Ghostwryte, and Portfolio), `githubLink`, `projectImage` (a logo import, svg or png), and `technologyArray` (an array of `{ name }`). **Do not modify this file.**

- **Global styles.** `src/styles/index.scss` pulls in all partials with `@use './About'; @use './Navbar'; @use './Music'; @use './Projects'; @use './Contact'; @use './Footer';`. Every page imports `index.scss`, so **all selectors are global and shared with the home page.** Every new class must be prefixed `sw` (for example `.swShowcase`, `.swRow`) to avoid collisions with `.projectCard` and friends.

- **Tokens** in `src/styles/variables.scss`:
  - `$backgroundColor: #FFFFF1`
  - `$accentColor: #66B851`
  - `$mainColor: #D9D9D9`
  - `$macbook-air-13: 1000px`
  - `$macbook-air-15: 1439px`

  Partials start with `@use './variables' as vars;`. Montserrat is loaded via `@import url(...)` in `About.scss`, and text uses weights 500 and 600. The radius used throughout is 10px, pills use 15px, the chip background is `lightgray`, and the card border is `3px solid vars.$mainColor`.

- **Content width is narrow.** `index.scss` sets `main` to `width: 78%` on mobile, `55%` at 768px and up, `75%` between 1000px and 1439px, and `65%` between 1300px and 1440px (the later rule wins). On desktop the content column is only about 800 to 1050px, which is too cramped for a side-by-side row. The showcase must break out wider than `main` on large screens (see §4.3).

- `html { overflow-x: hidden; }` is set, so a viewport-width breakout will not create a horizontal scrollbar.

- **Navbar.** `Navbar.scss` makes the nav `position: sticky`. The nav button scrolls to `#Websites` by computing `section.offsetTop - navbarHeight`. The new section root **must keep `id="Websites"`**.

- **SSR.** Gatsby builds with SSR. Existing components read `window.innerWidth` inside `useEffect` with an initial state of `0`. Follow that pattern. Do not touch `window`, `document`, `ResizeObserver`, or `IntersectionObserver` outside `useEffect`.

- **Icons:** `src/images/externalLink.svg`, `src/images/githubIconBlack.svg`, `src/images/arrow.svg`. Logo fallbacks come from `projectImage`.

- **Existing motion** on the site is minimal, a 0.1s hover scale on `.cardLinkButton`. Keep the new motion restrained.

## 3. Files

**Create**
1. `src/components/SiteShowcase.js`
2. `src/styles/SiteShowcase.scss`

**Edit**
3. `src/styles/index.scss`: add `@use './SiteShowcase';` directly after `@use './Projects';`.
4. `src/pages/swd.js`: replace the `Projects` import and usage with `SiteShowcase`, rendered as `<SiteShowcase ids={projectIds} />`. Change nothing else.

**Do not edit:** `Projects.js`, `Projects.scss`, `src/data/projects.js`, `src/pages/index.js`.

The `.projectsLarge` block at the bottom of `Projects.scss` and the `variant` prop become unused on `/swd`. Leave them in place and mention this in the final report.

## 4. Design spec

### 4.1 Component structure (`src/components/SiteShowcase.js`)

```
SiteShowcase({ ids = defaultProjectIds })          // import { projects, defaultProjectIds } from '../data/projects'
└ <section id="Websites" className="swShowcase">
   ├ <h1 className="swLabel">Websites</h1>          // same look as .projectsLabel: Montserrat 600, 2rem mobile / 2.5rem desktop
   └ <div className="swList">
      └ ids.map → <ShowcaseRow key={id} index={i} project={projects[id]} />

ShowcaseRow
└ <article className="swRow">                       // add .swRow--reverse for odd rows, or rely on nth-child in CSS
   ├ <BrowserFrame project={project} />
   └ <div className="swInfo">
      ├ h2 title (link to projectLink if present, otherwise plain text)
      ├ p description
      ├ TechChips (ul/li with aria-label "Technologies")
      └ LinkButtons ("Visit site" if projectLink, "GitHub" always)
```

- Alternate the rows **in CSS** with `.swRow:nth-child(even)`, not in JS, to avoid hydration mismatches. The `<div className="swList">` wrapper keeps the `h1` from shifting the child count.
- Keep the helpers (`BrowserFrame`, `TechChips`, `LinkButtons`) in the same file as small function components, matching the style of `Projects.js`. Default-export the main component.
- Use real semantics: `article`, `h2` titles, `ul` and `li` for chips, real `<a>` for links with `target="_blank" rel="noopener noreferrer"`.

### 4.2 `BrowserFrame` (the preview)

Markup:
```
<div className="swFrame">
  <div className="swFrameBar">
    <span className="swDots" aria-hidden="true"><i /><i /><i /></span>
    {projectLink ? <a className="swUrl">{domain}</a> : <span className="swUrl">Not publicly hosted</span>}
  </div>
  <div className="swViewport" ref={viewportRef}>
    <img className="swFallback" src={projectImage} alt="" />           // logo, sits under the iframe
    {mountIframe && embeddable && <iframe className={...} />}         // see below
    {projectLink && <a className="swOverlay" href={projectLink} target="_blank" rel="noopener noreferrer" aria-label={`Preview of ${projectTitle}: open site in a new tab`} />}
  </div>
</div>
```

**Domain.** Derive it from `projectLink` with `new URL(projectLink).host`, wrapped in try/catch, and strip a leading `www.`.

**Whole frame is the link.** The `swOverlay` anchor covers the viewport (`position: absolute; inset: 0; z-index: 2`). The iframe gets `pointer-events: none`, `tabIndex={-1}`, `aria-hidden="true"`, and `title={`${projectTitle} live preview`}`. This avoids click and scroll capture inside the iframe.

**Scaled desktop render.** Render the iframe at a fixed virtual size of **1280×800** with `transform-origin: 0 0`, and scale it with `transform: scale(s)` where `s = viewportWidth / 1280`.
- Measure with a `ResizeObserver` on the viewport, inside `useEffect`. Guard with `typeof ResizeObserver !== 'undefined'`. Use `s = 0.5` before the first measurement.
- The viewport uses `aspect-ratio: 16 / 10; overflow: hidden; position: relative`.
- Set the scale through a CSS custom property such as `--sw-scale`, or inline style. Animate only transform and opacity, never width or height.

**Lazy mount.** Use an `IntersectionObserver` on the row with `rootMargin: '200px'`. When the row first intersects, set `mountIframe = true` and disconnect. Until then only the logo shows. The iframe also gets `loading="lazy"`, `referrerPolicy="no-referrer"`, and `sandbox="allow-scripts allow-same-origin allow-forms"`. Do not add `allow-top-navigation` or `allow-popups`.

**Load fade.** On `onLoad`, set `loaded = true`. The iframe starts at `opacity: 0` and transitions to `1` over about 250ms with ease-out, so the logo cross-fades into the live page.

**Blocked embeds.** A site that sends `X-Frame-Options` or a CSP `frame-ancestors` directive still fires `load`, but shows a blank or error page that would hide the logo. So decide embeddability **before** implementing: probe each site (see §5, step 1) and record which ones forbid framing.
- Put those sites in a local constant in `SiteShowcase.js`, for example `const NO_EMBED = new Set([...])`. The example id in the probe result must be filled in from the actual probe, not assumed.
- Rows in `NO_EMBED`, and Archivist (empty `projectLink`), skip the iframe and show the **static state**: the logo centered on a soft panel inside the same browser frame, with an "Open live site →" hint when a link exists.
- Do **not** add flags to `src/data/projects.js`.

### 4.3 Layout and styling (`src/styles/SiteShowcase.scss`)

Start the file with `@use './variables' as vars;`. Prefix every class with `sw`.

- **Section:** margin `8rem 0 4rem` on desktop and `1rem 0 3rem` on mobile, matching `.projects`. Use a flex column, centered, with a gap of about 3rem on mobile and 5rem on desktop.

- **Breakout (≥1100px):** on `.swShowcase` use `position: relative; left: 50%; transform: translateX(-50%); width: min(1180px, 92vw);`. The parent `main` is a centered flex column, so the child can exceed its width. Verify there is no horizontal scrollbar. Below 1100px the section just uses the `main` width.

- **Row (≥1100px):** `display: grid; grid-template-columns: 1.4fr 1fr; gap: 3rem; align-items: center;`. Flip even rows with `.swRow:nth-child(even) .swFrame { order: 2; }`. Below 1100px use one column, frame on top, `gap: 1.5rem`.

- **Frame:** `border: 3px solid vars.$mainColor; border-radius: 10px; background: #fff; overflow: hidden;`. Put the depth shadow on a `::after` pseudo-element (see §4.4).
  - Bar: flat `vars.$mainColor`, about 2.25rem tall, flex, padding `0 .75rem`, gap `.75rem`.
  - Dots: 10px circles in neutral grays (for example `#bdbdbd`). **No traffic-light red, yellow, or green.** Keep to the site palette.
  - URL pill: white background, 15px radius, padding `.15rem .75rem`, font 500 at `.8rem` Montserrat, single line with ellipsis, color `#444`.

- **Info column:**
  - Title: 600 weight, about 1.75rem on desktop and 1.25rem on mobile.
  - Description: 500 weight, about 1.05rem with line-height 1.55 on desktop and .95rem on mobile.
  - Chips: reuse the look of `.technology` (lightgray pill, 15px radius, 600 weight, about .75 to .9rem), inside a wrapping flex list with `gap: .5rem`. Use `sw` class names.

- **Link buttons**, both real `<a>`:
  - Primary "Visit site": background `vars.$accentColor`, dark text, 10px radius, padding `.6rem 1.1rem`, with `externalLink.svg` at about 1rem. Render only when `projectLink` exists. Check contrast: the text must reach 4.5:1 on the green. Use a dark text color, and fall back to text-only if the icon reads poorly.
  - Secondary "GitHub": transparent background, `2px solid vars.$mainColor`, with `githubIconBlack.svg`.
  - Minimum hit height 40px.

- **Static fallback panel:** `.swFallback` is `object-fit: contain; position: absolute; inset: 0; margin: auto; width: 55%; height: 55%;` on a flat background, either `vars.$backgroundColor` or a light neutral. No gradients, per the site's style.

### 4.4 Motion (tokens at the top of the SCSS, tunable in one place)

```scss
$sw-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
$sw-dur-micro: 140ms;
$sw-dur-enter: 320ms;
$sw-dur-fade: 250ms;
```

- **Row enter:** `opacity 0 → 1` and `translateY(24px) → 0` over `$sw-dur-enter`. The `.is-visible` class is added by the same IntersectionObserver used for the lazy mount.
- **Progressive enhancement:** the default styles are fully visible. Apply the hidden starting state only under `.swShowcase.js-ready .swRow:not(.is-visible)`, and add `js-ready` in a `useEffect`. This way no-JS users and reduced-motion users never see invisible content.
- **Frame hover:** `translateY(-4px)` on the frame. Fade the stronger shadow in by animating the `::after` pseudo-element's `opacity`. Do not animate `box-shadow` directly. Use `$sw-dur-micro`.
- **Buttons:** hover `translateY(-1px)`, `:active` `scale(.97)`, and `:focus-visible` with `outline: 3px solid vars.$accentColor; outline-offset: 2px;`.
- **Iframe:** cross-fade as described in §4.2.
- **Reduced motion (mandatory):** wrap all movement in `@media (prefers-reduced-motion: no-preference)`. Under `reduce`, remove translate and scale, and keep only instant changes or opacity changes of 100ms or less.
- Animate only `transform` and `opacity`. Never toggle `pointer-events` in a way tied to an animation, because that can trap clicks.

### 4.5 Accessibility

- The iframe is decorative: `aria-hidden="true"` and `tabIndex={-1}`.
- The overlay anchor carries the accessible name, `aria-label="Preview of {title}: open site in a new tab"`. The title link is plain text and the "Visit site" button is a separate link. This avoids three identical link names.
- Every link has a visible `:focus-visible` state.
- Chips sit in a list with an accessible label.
- Do not rely on color alone.

## 5. Implementation steps, in order

1. **Probe embeddability (read-only).** For each swd site run `curl -sI -L -m 10 <projectLink>` and note any `x-frame-options` header or `frame-ancestors` in `content-security-policy`. Record the results and fill in `NO_EMBED`. The sites are:
   - https://intraconnected.app
   - https://whosedebut.com
   - https://biggestlittlemedia.com
   - https://lunalashandbeautyco.com/
   - https://www.Stock-Z.com
   - Archivist has no link and needs no probe.
2. Create `src/styles/SiteShowcase.scss` with the tokens, then create `src/components/SiteShowcase.js`.
3. Add `@use './SiteShowcase';` to `src/styles/index.scss`.
4. Update `src/pages/swd.js`.
5. Run `npm run build` and fix any SSR errors, such as `window is not defined`. Then run `npm run develop` for visual checks.

## 6. Verification checklist

- `npm run build` passes.
- `/swd` at about 1440px, 1920px, 1100px, 768px, and 375px:
  - No horizontal scroll.
  - Rows alternate at 1100px and up, and stack below.
  - The frame aspect ratio holds.
  - The iframe rescales when the window resizes.
- Each embeddable site loads in its frame after scrolling into view and fades in. Non-embeddable sites and Archivist show the static logo state. No row shows a blank white frame.
- Clicking anywhere on a preview opens the site in a new tab.
- Keyboard Tab reaches the overlay link, the title link, and the buttons in order, with visible focus.
- The navbar "Websites" button still scrolls to the section (it depends on `id="Websites"`).
- With the OS reduce-motion setting on, rows are visible immediately and nothing slides.
- The home page (`/`) is visually and behaviorally unchanged, because it still uses `Projects`.
- If a browser cannot be run, say plainly that visuals are unverified.

## 7. Final report should include

- **What changed**, grouped as Visual, Motion, Interaction, Structure, and Accessibility.
- **Tunables:** the `$sw-*` tokens at the top of `SiteShowcase.scss`, the `NO_EMBED` set and the 1280×800 virtual viewport constant in `SiteShowcase.js`, and the breakout width.
- **Leftovers:** the `.projectsLarge` rules and the `variant` prop in `Projects` are now unused on `/swd`.
- **Unverified items**, if any.
