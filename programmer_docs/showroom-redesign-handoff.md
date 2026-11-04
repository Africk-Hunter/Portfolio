# Handoff: portfolio visual redesign ("Showroom"), lessons and state after round 3

> Self-contained. The next agent needs no prior conversation.
> This is a creative, iterative redesign with the owner (Hunter). Read §2 before designing anything.
> Do NOT commit or push unless asked. The live pages (`/`, `/swd`) are untouched; all redesign work lives at `/mockup`.

## 1. Where things stand

The owner is redesigning the portfolio's visual identity. We prototype at **`http://localhost:8000/mockup`** (`npm run dev`, Gatsby 5, port 8000). Three rounds so far:

| Round | What was built | Verdict |
|---|---|---|
| 1 | Three one-screen concepts: **Extended Forecast** (late-night cable weather segment), **Showroom** (late-90s car-select screen, bleached into baby blue), **Sleeve** (overexposed record sleeve + catalog) | **Showroom won**, because it *committed* to one idea |
| 2 | Three scrolling Showroom variants (Daylight / Gallery / Window) with a tropical beach scene (palms, sand, sea, island) | **Rejected.** Too much space between sections, poor flow, scenery "childish / too tropical", UI "inconsistent and undecided, trying to be a lot of things" |
| 3 | **One committed build**: a fixed-screen showroom with one turntable whose object changes per section | Current. The owner hasn't reviewed it yet |

Round 3 is the baseline to iterate from. Decisions are also saved in the agent memory (`portfolio-redesign-direction`, `references-are-spirit`).

## 2. Lessons about working with this owner (most important)

1. **Commit to one idea.** What the owner valued most in round 1 was that the Showroom "felt like it was committing to something." Round 2 failed by stacking ideas: three nav systems, a different layout per section, decorative scenery that competed with the content. Every element must serve the one metaphor. When unsure, remove things.
2. **References are spirit, never layouts.** The owner said "stop copying design" and "this should not look like some shitty Windows recreation." Don't reproduce compositions from the mood board, and don't offer options framed as "do it like image X." Make the translation calls yourself and present them as original design decisions. Ask about direction and taste, not about which reference to copy.
3. **"Grit" is compositional, not surface.** Grain, scanlines and VHS effects are NOT what they mean. In the owner's words about the Weather Channel image, the grit "comes from the font, the grays against that deep purple, the city lights… it is foundational to the image composition." Read it as confident heavy type, firm contrast (one dark, decisive shape against airy light), decisive angles, and small warm lights in a cool field. A faint grain overlay is fine but is not the point.
4. **"Sleek" means the spirit of Windows XP / 7 (Aero)**: glass, gloss, glow, light ribbons, gel buttons. It does **not** mean title bars, start orbs, taskbars or anything that reads as an OS recreation.
5. **Not generic.** The owner's first and loudest instruction was "I do not want this to look like any other UI." Avoid hero-plus-CTA, card grids, bento layouts, 2021-style glassmorphism, synthwave, and SaaS-template patterns.
6. **No tropical or literal postcard scenery.** Palms, sand and a beach read as childish. The backdrop should belong to the metaphor (a showroom), not be a place.
7. **The owner likes the current typography** (wide heavy italic yellow outlined in navy, plus a clean sans). Keep it; small experiments are allowed.
8. **Ask decisions with `AskUserQuestion`, and keep them few and real.** The owner used `/grill-me` to settle direction. Questions that worked: metaphor, structure (fixed vs scroll), backdrop, per-section objects, mobile, scope. If a question can be answered by checking (for example, whether a site allows iframes), check it instead of asking.
9. **Don't stall on slow tooling.** The owner asked "why is it taking so long" when Gatsby's cold start took about 90s. Explain briefly, keep moving. They also rejected a headless-Chrome screenshot step: they review in their own browser. Don't screenshot unless asked, and say plainly that you haven't visually verified the work.
10. **Mood board, for reference only:** NFS car-select screen (Italdesign Nazca C2: chrome swoosh, oval glass buttons, yellow italic wordmark, spec sheet), the PRYDA Frutiger Aero web template, a 2002 Sony VAIO catalog (airy, overexposed, silver hardware), a Bryce-style fantasy beach with a hanging planet, the "August in the Water [1995]" album cover (halftone, hairline frames, wistful caption), Weather Channel "Good Evening Forecast" (granite gray, slanted taupe bands, deep purple night, city lights), and Toro on a payphone (lavender, lonely, cute). The shared thread: **bright on the surface, wistful underneath**, light as a material, things presented like products, early-2000s optimism about technology. The palette leans baby blue (not dark blue), with one warm accent.

## 3. Round 3 design (the current build)

**Metaphor:** a showroom with **one turntable**. The screen never scrolls. The oval nav picks a section; the section's object spins onto the turntable, and the glass panel on the right shows its details.

**Rules that keep it consistent:**
- The big yellow **nameplate** always names what's on the turntable: "Hunter Africk" (About), the project title (Websites), "Collection of Sounds" (Music), "Write to Me" (Contact).
- The **glass panel** is always on the right with the same structure: a navy header bar with a yellow title and an optional count, then a body that scrolls internally.
- There is **one dark, decisive shape**: the navy slab top-left with a diagonal edge, an amber LED and "RENO, NV" plus the live local time. That's the "grit".
- One nav (glossy ovals, left), one accent color (butter yellow `#ffd84d`), one structure.

**Sections:**

| Section | Turntable | Panel ("head title") |
|---|---|---|
| About (landing) | empty and glowing, with the hint "choose a section to bring something out" | "Driver Profile": portrait, "Hi, I'm Hunter", bio, profile spec rows, github/linkedin/spotify pills |
| Websites | flat-panel **monitor**: live scrollable iframe, or a screenshot fallback; ‹ › arrows and the ←/→ keys | "General": status, built with, visit, source, description |
| Music | album sleeve standing, **vinyl** half out and spinning (cover art as the label) | "Track Info": artist, released, genre, made by, description, streaming pills |
| Contact | **envelope** in an acrylic tray; the letter mirrors the form as you type; on send the letter slides in, the flap closes and a gold seal pops | "Leave a Message": name/email/message form → "Sealed and sent" (mockup only, not delivered) |

**Spec sheet content:** only rows that mean something for the thing on display. The owner explicitly rejected car filler ("drivetrain", "weight dist", "price").

**Backdrop:** a pale sky gradient with SVG light ribbons (white, baby blue, a thin butter line) drifting slowly, a glossy floor from 63% down that mirrors the ribbons (flipped copy, blurred, masked), floor seams in perspective, horizon haze, a soft spotlight cone over the turntable, faint grain.

**Palette tokens** (on `.sr`): navy `#13245e`, indigo `#1c2b7d`, blue `#4a6fc9`, soft `#5d75b3`, butter `#ffd84d`, amber `#ffb347`, sky gradient `#f6fbff → #dcedff → #c4e0fd`, floor `#e9f4ff → #79acea`.

**Type:** Saira (wide `font-stretch: 125%`, weight 800, italic, uppercase, butter fill, `-webkit-text-stroke: 0.08em navy` + `paint-order: stroke fill`) for the nameplate and headings; Saira italic for labels and specs; Hanken Grotesk for body text. Loaded from Google Fonts in the page `Head`.

**Motion is down-tempo:** slow drifts (28–40s), eased swaps (0.7–1s), gentle breathing. Nothing bounces except the seal.

## 4. Files

All new and uncommitted:

- `src/pages/mockup.js`: the page. Renders `<Showroom />` inside `.mk` (a fixed, full-viewport root), and loads the fonts plus `noindex` in `Head`.
- `src/components/mockup/Showroom.js`: sections, state (section, project index, contact draft, sent), nameplate, oval nav, stage, panels, backdrop + `Ribbons` SVG, nav glyphs, Reno clock hook.
- `src/components/mockup/ShowroomObjects.js`: `Monitor`, `Vinyl`, `Envelope`.
- `src/components/mockup/showroomData.js`: bio, profile rows, socials, album data, `screens` (live/still per project), `domainOf`.
- `src/styles/mockup/Mockup.scss`: `.mk` root, zero-specificity resets, reduced-motion rule; `@use`s the partials below.
- `src/styles/mockup/_Showroom.scss`: layout, backdrop, head, nav, stage/turntable, glass panel, forms.
- `src/styles/mockup/_objects.scss`: monitor, vinyl, envelope.
- `src/styles/mockup/_textures.scss`: generated SVG grain and granite data URIs, `scanlines` and `overlay` mixins.

Project data comes from `src/data/projects.js` (`projects`, `defaultProjectIds` = intraconnected, whoseDebut, biggestLittleMedia, llabc, stockZ, archivist). Don't modify it. The home page content to mirror lives in `src/components/About.js`, `music.js` and `Contact.js`.

**Layout:** `.sr` is a CSS grid: columns `130px | 1fr | minmax(380px, 33vw)`, rows `auto | 1fr`, `height: 100vh`, `min-height: 680px`, `min-width: 1100px`. Objects are positioned with their base at the plate center (`bottom: 9vh`, centered); the plate is a circle with `rotateX(76deg)`. The section swap replays via React `key`s (`displayKey`) on the nameplate, object and plate.

## 5. Technical lessons and gotchas

- **Iframe embedding (checked with `curl -I`):** Whose Debut?, Biggest Little Media and 20ON20OFF allow framing. **Intraconnected**'s CSP `frame-ancestors` allows `'self' https://hunterafrick.com http://localhost:8000`, but the site's configured URL is **`https://www.hunterafrick.com`**, so the www host would be blocked in production. Flag it to the owner. **Luna Lash** (`X-Frame-Options: DENY`) and **Stock Z** (`frame-ancestors 'none'` + `DENY`) are blocked, so they use screenshot fallbacks from `src/images/placeholders/` (1920×1080). **Archivist** has no live site, so the monitor shows its logo and "no live site".
- **Iframe scaling:** render the iframe at 1280×720 and scale it with a `ResizeObserver` on the glass (`scale = glassWidth / 1280`, `transform-origin: 0 0`). CSS can't divide lengths to get the scale factor. Key the `Monitor` by project id so the loading state resets.
- **Global CSS leaks:** the live site's `index.scss` styles `html`, `body`, `main` and `#gatsby-focus-wrapper`. That's why the mockup root is `position: fixed; inset: 0; overflow: auto`, and why it avoids a `<main>` tag.
- **Reset specificity:** a `.mk button { background: none }` reset beat component classes like `.sr__oval` (a specificity tie that later source order wins). Wrap resets in `:where(.mk) :where(button)` so they have zero specificity. Never paper over this with `!important`.
- **`backdrop-filter` breaks under an ancestor `filter`** (the ancestor becomes the backdrop root), and **`clip-path` clips `box-shadow`**. The glass panel therefore has no drop shadow; it relies on inset highlights.
- **The envelope letter** sits in a clipping `.env__slot` that reaches above the envelope but ends at its bottom edge, so the letter can stick out the top and slide in without showing below.
- **`-webkit-box-reflect`** gives the floor reflections under objects (Chromium and Safari only; harmless elsewhere).
- **Gatsby dev:** a cold start takes about 90s (bootstrap ~72s), then hot reload. Sass prints harmless `legacy-js-api` deprecation warnings. ESLint warnings for deleted files can linger in the log; the `SEO must be in PascalCase` warning is pre-existing on every page. To confirm a compile, read the log after the latest "Re-building development bundle" line. `curl /mockup/` returns 200 even when the build failed.
- **Duplicate SVG gradient ids** across repeated inline SVGs are tolerated (the first definition wins); keep the definitions identical.
- **Shell:** Windows; the Bash tool is Git Bash. Headless Chrome is at `/c/Program Files/Google/Chrome/Application/chrome.exe` if the owner ever asks for screenshots.

## 6. Open items and next steps

- **Get the owner's reaction to round 3.** Iterate on what they say rather than adding features.
- **Deferred by the owner:** mobile layout (the current build needs ≥1100px width), audio playback (the vinyl only spins and links out), making the contact form actually send (the live site uses `emailjs-com` in `src/components/Contact.js`).
- **Screenshots still needed:** Archivist (none exists) and, ideally, fresh ones for the blocked sites.
- **Header fixes the owner could make on their own sites:** add `https://www.hunterafrick.com` to Intraconnected's `frame-ancestors`, and allow framing on Luna Lash and Stock Z if they want those live.
- **Ideas consistent with the direction (not yet approved):** a richer "spin" swap (the plate whirls, the old object leaves before the new arrives), a project lineup visible on the Websites screen, monitor power-on to load the iframe.
- **If adding anything, check it against §2.1:** does it serve the one turntable metaphor, or is it a second idea?
