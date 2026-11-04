# Portable background

The procedural backgrounds from Intraconnected, with no 3D scenes and no app dependencies. Needs only React 18/19 and TypeScript (no Sass, no other packages).

## Use

Copy this folder into the other project, then:

```tsx
import { Background, newLayer, PRESETS } from './background';
import './background/background.css';

// A preset (set preset.bg as the page background color)
<Background layers={PRESETS[1].layers} />

// Or your own layers, bottom first
<Background layers={[
  { ...newLayer('plasma'), color: '#1b2a49', color2: '#6a8cff', color3: '#f3e9d2', opacity: 100 },
  { ...newLayer('starfield'), opacity: 80 },
]} />
```

The background is `position: fixed` behind the page (`z-index: -1`). Give the parent `position: relative` and pass `contained` to fill a section instead. `lite` drops resolution and frame rate for phones. `paused` stops animation.

## Styles

gradient, pattern, plasma, ripples, metaballs, warp (Marble), gyroid, fractal (Julia set), spiral (Sunflower), mandala (Spirograph), contours, truchet, ridges (Hills), terrain, shapes, starfield, bubbles, dust (Bokeh), caustics, vignette. Effects that filter every layer below: dither, vhs. See `BG_TYPES` for each style's controls and `KIND_OPTIONS` for its looks.

Every layer is `{ type, kind, color, color2, color3, angle, size, density, speed, opacity }`. `newLayer(type)` gives sensible defaults.

## Notes

- Animation respects `prefers-reduced-motion`.
- Effects use WebGL when available and fall back to SVG filters.
- Not included: the 3D scenes (city, road, reef, lagoon, hangar, monorail), the "eyez" pattern, "whole app" effects, and the editor UI.
- This is a copy. Fixes to the app's `src/components/themeBackground/` won't carry over automatically.
