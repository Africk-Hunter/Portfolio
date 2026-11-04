# Handoff: `/language` design language (redo from the user's actual brief)

> For the next AI. Do not commit or push unless asked. Do not take screenshots unless asked: the user reviews in their own browser, so say plainly that you haven't visually verified.

## 1. The actual request (verbatim intent)

Build a NEW route `/language` (the earlier attempt was moved to `/lang_old` and is off-limits; see CLAUDE.md) that is a **design language** the user can pull into **Figma** to make their own design. Style is "Aero adjacent" (the user's typo "arrow" means Aero).

Inspirations to capture in **spirit only**:
- **Wii menu:** being welcomed. Nothing can go wrong, nobody is keeping score, waiting is pleasant. The softness tells you that you're safe and don't have to hurry.
- **Windows 98 / XP:** the machine is yours and you may poke around. A homework tool with Pinball and Minesweeper hidden inside. Playful because nobody was watching, trustworthy because you always knew where things were.

Constraints from the user:
- **Not generic.** Think far outside the box: typography, colors, everything.
- It must **not look like the references**. It should have their spirit.
- The 7 reference images are saved in `programmer_docs/language-references/` (view them before designing). Treat them as mood only:
  - `1.png`: Shibuya sticker logo over a street photo
  - `2.png`: PRYDA Frutiger Aero web template
  - `3.png`: Wii-style blue wavy poster ("Free yourself from all your thoughts")
  - `4.png`: 90s Yahoo ad ("Upgrade your memory")
  - `5.png`: Sony sticker wordmarks
  - `6.png`: 2002 Sony VAIO catalog
  - `7.png`: "POV it's 2003" glassy green-teal interior

## 2. What went wrong (do not repeat)

The previous AI **imported the Showroom redesign from its memory notes** (turntable, floor and ribbons, slab, nameplate, glass panel, butter/navy palette, Saira/Hanken, "The room" frame map) and built the language as a restatement of it. The user did **not** ask for that. The user's words: "did i tell you to reference the showroom when you made this design?" Answer: no.

The user is also upset about token waste: the previous run produced about 2,000 lines unprompted without checking direction. Work smaller and confirm direction before building big.

## 3. Rules for the redo

1. **Start only from the user's brief and the 7 images.** Treat repo memory and `programmer_docs/showroom-redesign-handoff.md` as **not applicable** to this task. Do not reuse the Showroom palette, turntable, slab, nameplate, panel or "room" frame.
2. The old memory note `homeroom-design-language.md` and its index line in `MEMORY.md` encode the wrong premise. **Delete or correct them.**
3. Make the translation calls yourself and present them as original decisions. Never copy a reference's layout.
4. Ask few, real questions (`AskUserQuestion`) only about taste or direction, and only if something truly blocks you. Otherwise decide.
5. Deliverable must be **Figma-extractable**: named color tokens, type scale, shape and radius, elevation/light, motion, iconography, voice, plus copy-as-SVG parts and a token export. Provide layer-by-layer Figma recipes for anything CSS-only (glass, gloss, glow).
6. Keep it proportionate. Propose the concept (name, 4-5 principles, palette, type pairing) in a short message first, then build.

## 4. Reusable plumbing (safe to keep; it is generic, not Showroom content)

All new and uncommitted:
- `src/pages/lang_old.js`: route, `Head` with noindex and Google Fonts link. **Fonts must change** if the new type direction differs.
- `src/components/lang_old/Language.js`: page: sticky section rail, `Sheet`/`Card`/`PartCard`, copy-to-clipboard context and toast, IntersectionObserver active section, token download.
- `src/components/lang_old/languageTokens.js`: single source of truth. Page CSS variables, Tokens Studio JSON and CSS export are all generated from it. It also computes WCAG contrast from the hex values. **All values in it are the Showroom's and need replacing.**
- `src/components/lang_old/LanguageParts.js`: attribute-only inline SVG (so it pastes into Figma as vectors) plus `Icon`. The shapes are Showroom-specific (gel ovals, slab, plinth, seal) and should be redrawn.
- `src/styles/lang_old/Language.scss`: styles; uses the generated `--*` variables. It compiles.

The mechanism (tokens, then CSS vars, then Tokens Studio JSON, plus Copy SVG) is good. The content is wrong.

## 5. Repo and tooling gotchas

- Gatsby 5, dev server `npm run dev` on port 8000 (cold start is about 90 seconds). It was not running; nothing was visually verified.
- The live site's `src/styles/index.scss` styles `html`, `body`, `main` and `#gatsby-focus-wrapper`. Keep the page root `position: fixed; inset: 0; overflow: auto` and avoid a `<main>` tag. Wrap resets in `:where()` (zero specificity).
- Check SCSS with `npx sass --no-source-map src/styles/lang_old/Language.scss`. Lint with ESLint 7 using `--parser @babel/eslint-parser` and `babelOptions:{presets:["@babel/preset-react"]}` (`--env es2022` is unsupported).
- `backdrop-filter` breaks under an ancestor `filter`, and `clip-path` clips `box-shadow`.
- Shell is Windows; Bash is Git Bash.
- Git has other uncommitted work (`/mockup`, `SiteBackground`, etc.). Do not touch it.

## 6. Suggested first move

Reply with a short concept pitch (not code): a name, the one felt idea, 4-5 principles tied to Wii/98-XP spirit, palette direction, type direction and the "poke around" mechanic. Wait for the user's go-ahead, then rebuild `languageTokens.js` first, then parts, then page.
