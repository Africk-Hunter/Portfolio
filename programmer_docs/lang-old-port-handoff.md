# Handoff: port `lang_old` ("Homeroom") into the UI Database shelf

> Target repo: `d:\Repositories\UI_Database` (Vite + React + SCSS). Source repo: `d:\Repositories\Portfolio` (Gatsby 5). Nothing here has been run or visually checked; it comes from reading the code and the shelf's `instructions.md` and `docs/standard.md`.

## 1. What it is

A single-page **design-language spec sheet** named **Homeroom**, served at `/lang_old` in the source (noindex, dev-only). It is a sticky section rail plus 11 sections: Principles, The room, Color, Type, Shape and light, Parts, Components, Icons, Motion, Voice, Into Figma. Every token, SVG part and recipe has a copy button, and the page can export CSS variables and Tokens Studio JSON.

In the shelf this becomes a **language entry**: `languages/homeroom/`, with `sheet.jsx` as the page.

## 2. Read this first: the content is Showroom-flavoured

`programmer_docs/language-handoff.md` records that this attempt was **rejected**. The owner asked for a fresh "Aero adjacent" language (spirit of the Wii menu and Windows 98/XP) and the previous AI instead rebuilt the **Showroom** portfolio concept: turntable, floor and ribbons, slab, nameplate, glass panel, butter/navy palette, Saira + Hanken Grotesk, "The room" four-zone frame.

- **Reusable:** the mechanism (tokens -> CSS vars -> copy-as-SVG), the sheet scaffolding, the contrast calculator.
- **Not reusable as-is:** token values, principle text, SVG shapes (gel ovals, slab, plinth, seal) and section copy. They encode the Showroom look.

**Decision for the owner before any build:** keep Homeroom as the Showroom look (a faithful archive of that concept), or keep only the mechanism and re-author the look from a fresh brief. Everything below assumes the owner has chosen; do not guess.

## 3. Shelf rules that govern this port

From `instructions.md` and `docs/standard.md`:

- **Bubble.** Do not read, open or borrow from any existing entry in `languages/`, `formats/`, `components/`, nor `index.json` or any `DESIGN.md`. The only source material is this handoff and the Portfolio files it lists (owner-supplied). Allowed shelf reading: `instructions.md`, `docs/standard.md`, `docs/backgrounds.md`, `docs/structure.md`, the `/new-language` skill.
- **No house style.** Do not "tidy" Homeroom toward how other entries look.
- **Process.** Propose first (name, 4-5 principles, palette, type, structural idea) and wait for a go. Then build the **Sheet only**. Structure card (`docs/structure.md`) only after approval, Showcase only after the card is approved. If rejected, delete the folder.
- **Generated files.** `DESIGN.md` and `index.json` come from `npm run index`. Never hand-edit.
- **Don't commit** unless asked.

## 4. File mapping (source -> `languages/homeroom/`)

Scaffold with `npm run new -- language homeroom`, then fill the files. `id` is lowercase-with-dashes and must equal `spec.id`.

| Source (`d:\Repositories\Portfolio`) | Target | Work needed |
|---|---|---|
| `src/components/lang_old/languageTokens.js` (293) | `tokens.js` | Reshape. The shelf expects `export const tokens` with groups `color, font, size, radius, shadow, motion`; color/font/radius/motion entries are `{ value, role }`, shadows are `{ role, layers[] }`. Also export `cssVarMap`, `cssText`, `textPairs`, `shadowOf`. Source groups map roughly: `colors`->`color`, `typeStyles`->`font`/`size`, `radii`->`radius`, `light`/`glazes`->`shadow`, `durations`+`easings`->`motion`. `cuts`, `spacing`, `pairs`: fold into `size`/`textPairs` or keep as extra exports (tools tolerate missing groups, but check extras don't break the indexer). Keep `contrast`/`grade`; `textPairs` should drive them. |
| (principles, voice, motion copy buried in `Language.js`) | `spec.js` | Plain data, default export, **no imports**: `id, name, type, tagline, tags, fontsHref, principles [[heading, body]], voice [[do, dont]], motions [[id, role]], rules {do[], dont[]}`. Optional `tension` / `never[]` only if the brief has a story; write them from the owner's brief. |
| `src/components/lang_old/LanguageParts.js` (263) | `parts.js` | Mostly direct. Already attribute-only SVG with ids passed in. Add `recipes`. |
| `src/styles/lang_old/Language.scss` (2544) | `styles.scss` | Rename to one unique class prefix (see §5); prefix every keyframe the same way. |
| `src/components/lang_old/Language.js` (1143) | `sheet.jsx` | Rewrite to render from `spec.js` + `tokens.js` (see §5). |
| `src/pages/lang_old.js` (22) | none | Drop. Routing is the shelf's hash router; head/SEO is not needed. |

## 5. Changes required to meet the CSS/sheet contract

Sheets are rendered live inside scaled cards and the home hero, so they must behave.

- **Root:** `position: fixed; inset: 0; overflow: auto` with one unique prefix (the source already uses this root; rename the class). Resets stay in `:where()` under the root. No `:root`, `html`, `body` or bare element selectors at top level. Grep the 2544-line SCSS for these.
- **No `<main>`**: already avoided in the source; keep it.
- **Listeners:** no `window`/`document` listeners, no body style changes, no portals to `body`. Use `onScroll` / `onPointerMove` on the root. The section rail's active-section tracking must use the root's `onScroll`.
- **Known violations in `Language.js` to fix:**
  - `document.getElementById` (used for exports/downloads): replace with refs.
  - Anchor-element download and the `textarea` + `execCommand` clipboard fallback append to `document`/`body`. Keep `navigator.clipboard` with a try/catch and drop the DOM-appending fallback (or attach any temp element inside the sheet root).
- **Fonts:** Hanken Grotesk + Saira. Put the Google Fonts URL in `spec.fontsHref`; the sheet calls `loadFonts(spec.fontsHref)`. Remove the `<link>` from the old page `Head`. Don't declare `@font-face` for files that don't exist.
- **Viewport units** are fine (previews render at the real window size).
- **Gotchas that still apply:** `backdrop-filter` breaks under an ancestor `filter`; `clip-path` clips `box-shadow` and focus outlines (for a cut-corner panel with a 1px edge, make the element the edge colour and put the fill in a `::before` inset 1px). The glass/gel parts are exposed to both.
- **Section 11 "Into Figma"** (CSS-variable and Tokens Studio export): the shelf's parts are already meant to paste into Figma as vectors, and the shelf may provide its own copy/export tooling. Check the shared sheet tooling before keeping a bespoke exporter; keep it only if it adds something the shelf lacks.

## 6. Token pipeline (unchanged idea)

CSS variables, the displayed tables and exports are all generated from `tokens.js`, so changing a value updates the page and exports together. `contrast`/`grade` compute WCAG ratios from hex values, so the accessibility table stays correct after a palette swap.

## 7. Optional background

Homeroom has none. Per `docs/backgrounds.md`, backgrounds are opt-in and a flat ground is a complete answer. Add `spec.background` only if the owner asks.

## 8. Home hero (optional)

`hero.jsx` is optional and built alongside the sheet if wanted (props `name, tagline, now, onBrowse`; must contain a real `h1`, tagline `p`, `button`, and a now-link `a` with `href={now.href}`). Not part of the Homeroom source; skip unless asked.

## 9. Order of work

1. Owner decides: archive Showroom look vs re-author (§2).
2. Post the proposal (name, 4-5 principles, palette, type, structural idea). **Wait for a go.**
3. `npm run new -- language homeroom`; port tokens -> spec -> parts -> styles -> sheet with §5 fixes.
4. `npm run index`, `npm run dev`, open `#/languages/homeroom`, and check the sheet inside its scaled card as well as full-size.
5. On approval, structure card; then Showcase. If not approved, delete `languages/homeroom/`.

## 10. Optional context (Portfolio repo)

- `programmer_docs/language-handoff.md`: original brief, why this version was rejected, rules for a redo.
- `programmer_docs/language-references/`: seven mood images (1-7.png). Use for spirit only, never reproduce their composition.
- `programmer_docs/showroom-redesign-handoff.md`: the Showroom concept (a deny rule still covers this file in the source repo).
- Check SCSS with `npx sass --no-source-map <file>`.
