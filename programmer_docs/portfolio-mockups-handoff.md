# Handoff: `/language` portfolio mockups (Portfolio tab)

> For the next AI. Do not commit or push unless asked. The user reviews in their own browser and said the final result "looks great", so treat the current direction as approved. Nothing here was visually verified by me; the user's eyes are the check.

## 1. What exists

`/language` has a switcher (bottom of screen) with a **Language | Portfolio** sub-tab. Portfolio is enabled for 5 languages, each with its **own format**, not a reskin of one template:

| Language id | Name | Portfolio format | File |
|---|---|---|---|
| `original` | Windowsill | Desktop OS: draggable windows, album player, Notepad, drawable sketchpad | `portfolio/Desktop.js` + `desktop.scss` |
| `a` | Clearcase | 2002 product catalogue: models HA-01.., spec sheets, compare table | `portfolio/Catalogue.js` + `catalogue.scss` |
| `f` | Terrarium | Printed zine, Issue 04: cover, contents, spreads, Q&A | `portfolio/Zine.js` + `zine.scss` |
| `g` | Dewdrop | Typographic index; hover floats work in a glass drop; click opens a case sheet | `portfolio/Index.js` + `index.scss` |
| `h` | Overgrowth | Futuristic greenhouse: glass side panel + long horizontal gallery | `portfolio/Greenhouse.js` + `greenhouse.scss` |

Plumbing:
- `src/components/language/Language.js`: view state (`language`/`portfolio`), hash format `#f` or `#f/portfolio`, tab is disabled when the language has no portfolio.
- `portfolio/themes.js`: maps language id to portfolio component; `portfolioIds` drives the tab.
- `portfolio/Portfolio.js`: picks the component.
- `portfolio/kit.js`: `Glyph` (line icons from `data.glyphs`), `usePage(fonts, bg)` (loads fonts, paints `body` behind the fixed root), `pad`.
- `portfolio/data.js`: single content source for all five (work, bio, links, images, disciplines). Edit here and all pages update.
- Styles: `src/styles/language/portfolio/*.scss`, one per format, each scoped by a unique prefix (`wd-`, `cc-`, `tz-`, `di-`, `gh-`). Pages are `position: fixed; inset: 0` and scroll themselves, like the other iterations.
- Language sheets (Pondlife `e`, Slow Horizon `b`) have no portfolio yet.

## 2. The user's brief and brand (verbatim intent)

- Mockup portfolio pages for Windowsill, Clearcase, Terrarium, Dewdrop, Overgrowth, keeping the language sheets, switched via a sub-tab.
- Brand: **multidisciplinary creative who doesn't do just one thing**. Four disciplines: **Build, Sound, Write, Draw**. Work overlaps on purpose (WHOSE DEBUT? is build+sound; the album is sound+draw+write).
- "these all kinda suck. they dont really look like portfolios at all." Then: research the most unique portfolio sites, pick pieces, "make something new. try your hardest. as if i would never get hired if this is not good."
- Overgrowth: "get rid of that sonar shit", and "futuristic cool. not military". The radar sweep, the specimen/field-unit/SPEC language were all rejected.

## 3. Lessons (what actually mattered)

### Design process
1. **A skin on one shared template is not a portfolio.** The first pass (one component, five colour skins) was rejected outright. What worked: each language gets a **different format** that the language's own metaphor suggests (desktop, catalogue, zine, index, gallery). When asked for "unique", change the structure, not the palette.
2. **Use real work and real assets.** Pages only read as portfolios once they had the actual album cover, the project screenshots (`src/images/placeholders/*Desktop*.png`), project tiles, and the user's photos. Placeholder glyph plates were what made pass one feel fake.
3. **Multidisciplinary is shown by overlap, not by listing.** Discipline lamps/filters that multi-select, entries tagged with several kinds, a compare table, cross-links between pieces (Notepad links to the album and to Archivist; novel feature links to the field guide). Each format also carries one "all four at once" moment in its hero.
4. **Give each format one thing a visitor can do** (poke around): drag windows and draw; press mode keys; click cover lines; hover for the drop; wheel through the gallery. This is the "playful, nobody's keeping score" spirit without literal references.
5. **Research worked best as specific stealable mechanics**, not "good sites". Used: Poolsuite-style OS desktop; Teenage Engineering spec blocks; Studio Anton hover-preview index; category gate; header/section camera moves; long horizontal galleries. Web fetch of Fast Company and Codrops returned 403, so don't retry them.
6. **Keep the user's own words** in copy (bio, "Produced, written, recorded, mixed, and mastered by me"). Anything I wrote is flagged as placeholder/draft in the UI: SYNTHETIC pitch/excerpt, Sketchbook, Zine editor's letter and Q&A. The user must replace these before real use.
7. **Don't carry old concepts in.** CLAUDE.md bans the `/mockup`, `/lang_old` and `background/` material and the earlier redesign direction. I never opened them. Keep it that way; the old note about a "showroom" direction is off-limits too.

### Aesthetic rules that landed well
- Keep each language's **tokens** (palette, type, radii, shadows, motion) exactly; only the layout/format changes.
- Overgrowth must feel **futuristic and calm**: glass, bioluminescent light, wide-letter type, cut corners, fruit lamps. **No** radar/sonar, no military language (specimen, field unit, SPEC, transmit, log).
- Dark hero scenes want a lit "tank"/panel; light languages want soft ground gradients. Both use `usePage` so overscroll never flashes the live site.

### Tooling / technical gotchas
- **Webpack only loads lowercase `.jpg`.** `IMG_0028.JPG` fails with "Module parse failed". Fix was a lowercase copy `src/images/hunter-candid.jpg` (original left in place). Check extensions on any new image import.
- `COS.png` is 7.7 MB at 3000x3000. Pages using it load slowly; a ~1200px copy would help (not done, user's call).
- **Scroll-snap fights programmatic scrolling.** In Greenhouse, `scroll-snap-type` plus a wheel handler setting `scrollLeft` caused jumping. Fix: remove snap and drive all horizontal movement through one rAF glide loop (`glideTo`) used by both wheel and index clicks. Cancel the loop on filter change.
- **Responsive scroller swap:** wide = sideways track scroll, narrow = whole page scroll. The scroll listener must be on the element that actually scrolls (root on narrow). A flex container's `padding-right` is dropped at the end of a scroller, so use a spacer element.
- `clip-path` kills `box-shadow` and focus outlines; `backdrop-filter` breaks under an ancestor `filter`. For cut-corner panels with a 1px edge, make the element the edge colour and a `::before` (inset 1px, clipped 0.41px smaller) the fill.
- Page roots: `position: fixed; inset: 0` and wrap resets in `:where()`. Avoid `<main>` styling collisions with `src/styles/index.scss`; `gh-track` uses `<main>` inside the fixed root and works, but if layout oddities appear, change it to a `div`.
- Dev server is usually already running on port 8000. Check with `curl http://localhost:8000/language/`, then fetch `component---src-pages-language-js.js` and grep for `Module not found|Module parse failed` to confirm a clean compile without opening a browser.
- Validation recipe (no Python on this machine): `npx sass --no-source-map <file>` for SCSS; Babel parse via `node -e` with `@babel/preset-react`; ESLint 7 using `@babel/eslint-parser/lib/index.cjs` by absolute path, `--no-eslintrc`, `--resolve-plugins-relative-to .`.
- Shell is Windows with Git Bash. `python` is not installed (it opens the Store); use the Edit tool or node for scripted edits.
- A background `sleep` command got auto-backgrounded; avoid long sleeps in foreground checks.

### Working style the user responded to
- They interrupt mid-run with short, blunt corrections ("get rid of that sonar shit", "futuristic cool. not military"). Apply immediately and fold it into the work in progress, don't debate.
- Large builds were accepted this time because the direction was set by research plus their brief, then summarised with a table of formats and an explicit list of placeholder copy. Keep summaries short and honest about what wasn't visually verified.
- Ask before big unprompted rewrites when the direction is uncertain; here the user explicitly said "try your hardest", which authorised it.

## 4. Open items / ideas not done

- Replace placeholders: SYNTHETIC pitch/excerpt, Sketchbook scans, Zine letter and Q&A, discipline tags I chose (Intraconnected = Draw, Archivist = Write, album = Write for lyrics). All in `portfolio/data.js` except the Zine's prose in `Zine.js`.
- Add portfolios for Pondlife (`e`) and Slow Horizon (`b`) if wanted: add a component, register in `themes.js`.
- Resize `COS.png`.
- Greenhouse may still need feel-tuning (wheel speed `1.4`, glide `0.16` in `Greenhouse.js`).
- No automated tests; visual QA is the user's.
