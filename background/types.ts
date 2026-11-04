// Layer model for the portable background: the procedural styles only (no 3D scenes).
// Pulled out of the app's utilities/theme.ts so this folder has no outside dependencies.

export type BgType = 'gradient' | 'pattern' | 'plasma' | 'ripples' | 'metaballs' | 'warp' | 'gyroid' | 'fractal' | 'spiral' | 'mandala' | 'contours' | 'truchet' | 'ridges' | 'terrain' | 'shapes' | 'starfield' | 'bubbles' | 'dust' | 'caustics' | 'vignette' | 'dither' | 'vhs' | 'scanlines' | 'paper' | 'aquarium' | 'pixelate';
export type BgParam = 'kind' | 'color' | 'color2' | 'color3' | 'angle' | 'size' | 'density' | 'speed' | 'spread' | 'zoom';

export interface BgLayer {
    id: string;
    type: BgType;
    /** gradient: linear | radial | conic. pattern: grid | dots | stripes | checker | triangles | zigzag | rings | burst. */
    kind: string;
    color: string;
    color2: string;
    color3: string;
    angle: number;   // 0-360
    size: number;    // 1-10
    density: number; // 1-10
    speed: number;   // 0-10 (0 = still)
    /** Floating shapes only: 0-10, vertical spread. */
    spread?: number;
    zoom?: number;
    opacity: number; // 0-100
    /** Effects only: act on everything behind the page instead of just the layers below. */
    over?: boolean;
}

export interface BgTypeDef {
    type: BgType;
    label: string;
    group: string;
    hint: string;
    params: BgParam[];
    names?: Partial<Record<BgParam, string>>;
    blend?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
    effect?: true;
    layersOnly?: true;
    alwaysOver?: true;
    shelved?: boolean;
}

const ALL: BgParam[] = ['color', 'color2', 'color3', 'size', 'density', 'speed'];

export const VHS_MAX_BULGE = 4;
export const MAX_BG_LAYERS = 4;/** Per-style override of a slider range (angle, size, density, speed, spread, zoom). */export const LAYER_RANGE_OVERRIDE: Partial<Record<BgType, Partial<Record<'angle' | 'size' | 'density' | 'speed' | 'spread' | 'zoom', { min: number; max: number }>>>> = {    contours: { size: { min: 10, max: 20 }, speed: { min: 0, max: 4 } },    vhs: { size: { min: 1, max: VHS_MAX_BULGE } },    shapes: { angle: { min: 0, max: 100 } },};

const DEFS: BgTypeDef[] = [
    { type: 'gradient', label: 'Gradient', group: 'Overlays', hint: 'A smooth blend of three colors', params: ['kind', 'color', 'color2', 'color3', 'angle'], blend: 'normal' },
    { type: 'pattern', label: 'Pattern', group: 'Basic', hint: 'A repeating grid, dots, stripes, checks and more', params: ['kind', 'color', 'size', 'angle'] },
    { type: 'plasma', label: 'Plasma', group: 'Math', hint: 'Four travelling sine waves added together', params: ['kind', ...ALL], names: { kind: 'Look' } },
    { type: 'ripples', label: 'Ripples', group: 'Math', hint: 'Three wave sources interfering', params: ['kind', 'color', 'color2', 'color3', 'size', 'speed'], names: { kind: 'Look' } },
    { type: 'metaballs', label: 'Metaballs', group: 'Math', hint: 'Drifting blobs whose fields merge like a lava lamp', params: ALL, names: { size: 'Blob size', density: 'Blobs' } },
    { type: 'warp', label: 'Marble', group: 'Math', hint: 'Noise bent by more noise, like smoke or marble', params: ALL, names: { size: 'Scale', density: 'Swirl' } },
    { type: 'gyroid', label: 'Gyroid', group: 'Math', hint: 'A slice through an endlessly folding minimal surface', params: ALL, names: { size: 'Scale', density: 'Bands' } },
    { type: 'fractal', label: 'Julia set', group: 'Math', hint: 'A fractal that slowly changes shape', params: ['color', 'color2', 'color3', 'size', 'speed'] },
    { type: 'spiral', label: 'Sunflower', group: 'Math', hint: 'Dots placed 137.5 degrees apart (the golden angle)', params: ALL, names: { size: 'Dot size', density: 'Dots' } },
    { type: 'mandala', label: 'Spirograph', group: 'Math', hint: 'Rotated hypotrochoid curves', params: ALL, names: { size: 'Line width', density: 'Rings' } },
    { type: 'contours', label: 'Contours', group: 'Math', hint: 'Height lines of a slowly drifting landscape', params: ALL, names: { color: 'Lines', color2: 'Low ground', color3: 'High ground', density: 'Lines' } },
    { type: 'truchet', label: 'Truchet tiles', group: 'Math', hint: 'Quarter-circle tiles that turn now and then', params: ALL, names: { size: 'Tile size', density: 'Line width' } },
    { type: 'ridges', label: 'Hills', group: 'Math', hint: 'Layered ridges, each a sum of three sines', params: ['color', 'color2', 'color3', 'density', 'speed'], names: { color: 'Near hills', color2: 'Far hills', color3: 'Sky', density: 'Ridges' } },
    { type: 'terrain', label: 'Wave grid (3D)', group: 'Math', hint: 'A rolling wireframe landscape you fly over', params: ALL, names: { color: 'Near', color2: 'Middle', color3: 'Far', size: 'Wave height', density: 'Grid' } },
    { type: 'shapes', label: 'Floating shapes (3D)', group: 'Math', hint: 'Lit solids that spin and bob in space', params: ['kind', 'color', 'color2', 'color3', 'angle', 'size', 'density', 'speed', 'spread'], names: { angle: 'Position', spread: 'Spread', kind: 'Look', color: 'Shape color', color2: 'Shape color 2', color3: 'Shape color 3', size: 'Shape size', density: 'Shapes' } },
    { type: 'starfield', label: 'Starfield', group: 'Overlays', hint: 'Stars streaming past as if flying through space', params: ['color', 'color2', 'color3', 'size', 'density', 'speed'], names: { color: 'Stars', color2: 'Stars 2', color3: 'Stars 3', size: 'Star size', density: 'Stars' }, blend: 'screen' },
    { type: 'bubbles', label: 'Bubbles', group: 'Overlays', hint: 'Glossy see-through bubbles rising and wobbling', params: ALL, names: { kind: 'Look', color: 'Bubbles', color2: 'Shine', color3: 'Bubbles 2', size: 'Bubble size', density: 'Bubbles' }, blend: 'screen' },
    { type: 'dust', label: 'Bokeh', group: 'Overlays', hint: 'Soft, out-of-focus lights drifting slowly', params: ALL, names: { color: 'Light 1', color2: 'Light 2', color3: 'Light 3', size: 'Light size', density: 'Lights' }, blend: 'screen' },
    { type: 'caustics', label: 'Caustics', group: 'Soft', hint: 'The shifting net of light on a pool floor', params: ['kind', 'color', 'color2', 'size', 'speed'], names: { kind: 'Look', color: 'Light', color2: 'Bright spots', size: 'Scale' }, blend: 'screen' },
    { type: 'vignette', label: 'Vignette', group: 'Soft', hint: 'Darkens or tints the edges and keeps the middle clear', params: ['color', 'size'], names: { color: 'Edge', size: 'Reach' }, blend: 'multiply' },
    { type: 'vhs', label: 'VHS', group: 'Effects', hint: 'Affects every layer under it: worn tape on a tube monitor, with an optional bulging screen', params: ['kind', 'size', 'density'], names: { kind: 'Screen', size: 'Bulge', density: 'Tape wear' }, effect: true, alwaysOver: true },
    { type: 'dither', label: 'Dither', group: 'Effects', hint: 'Affects every layer under it: fewer shades, with grain between them', params: ['size', 'density'], names: { size: 'Grain', density: 'Shades' }, effect: true },
    // Shelved styles kept so the shared drawing code still type-checks.
    { type: 'scanlines', label: 'Scanlines', group: 'Overlays', hint: '', params: ['color', 'size'], blend: 'multiply', shelved: true },
    { type: 'paper', label: 'Paper texture', group: 'Overlays', hint: '', params: ['kind', 'color', 'size', 'density'], shelved: true },
    { type: 'aquarium', label: 'Aquarium', group: 'Scenes', hint: '', params: ALL, shelved: true },
    { type: 'pixelate', label: 'Pixelate', group: 'Effects', hint: '', params: ['size'], effect: true, layersOnly: true, shelved: true },
];

export const BG_TYPES: BgTypeDef[] = DEFS.filter((d) => !d.shelved);
export const BG_TYPE_BY_KEY = Object.fromEntries(DEFS.map((t) => [t.type, t])) as Record<BgType, BgTypeDef>;

export const KIND_OPTIONS: Partial<Record<BgType, string[]>> = {
    gradient: ['linear', 'radial', 'conic'],
    pattern: ['grid', 'dots', 'stripes', 'checker', 'triangles', 'zigzag', 'rings', 'burst'],
    shapes: ['dithered', 'smooth'],
    // First entry is the default.
    plasma: ['smooth', 'dithered'],
    ripples: ['smooth', 'dithered'],
    caustics: ['smooth', 'dithered'],
    bubbles: ['smooth', 'low-res'],
    vhs: ['curved', 'flat'],
    paper: ['paper', 'canvas', 'cardboard'],
};

let layerSeq = 0;
/** A layer of the given type with its default look. Override any field: `{ ...newLayer('plasma'), color: '#fff' }`. */
export function newLayer(type: BgType): BgLayer {
    const base: BgLayer = {
        id: `l${Date.now().toString(36)}${layerSeq++}`,
        type,
        kind: KIND_OPTIONS[type]?.[0] ?? '',
        color: '#ff5fa2',
        color2: '#6a8cff',
        color3: '#7cf0c9',
        angle: 180,
        size: 5,
        density: 5,
        speed: 3,
        opacity: 50,
    };
    switch (type) {
        case 'gradient': return { ...base, color: '#4fb3ee', color2: '#9ed8f7', color3: '#ddf3ff' };
        case 'pattern': return { ...base, color: '#41bc28', angle: 45 };
        case 'ripples': return { ...base, color: '#ffffff', color2: '#8fd3ff', color3: '#2a8fe0', size: 4 };
        case 'metaballs': return { ...base, color: '#2a1a5e', color2: '#ff5fa2', color3: '#ffd36b', size: 5, density: 5, speed: 2 };
        case 'warp': return { ...base, color: '#1b2a49', color2: '#6a8cff', color3: '#f3e9d2', size: 5, density: 5, speed: 2 };
        case 'gyroid': return { ...base, color: '#0f3b4f', color2: '#3dffb0', color3: '#ffd36b', size: 5, density: 5, speed: 2 };
        case 'ridges': return { ...base, color: '#2b6f8f', color2: '#8fd0e8', color3: '#f6e7c1', speed: 4 };
        case 'mandala': return { ...base, color: '#ffffff', color2: '#ffd36b', color3: '#ff6b9a' };
        case 'contours': return { ...base, color: '#7a5a3a', color2: '#efe4cc', color3: '#cfe0bf', size: 10, density: 4, speed: 1 };
        case 'truchet': return { ...base, color: '#ff6b9a', color2: '#4f8fe0', color3: '#3dba7a', size: 4, density: 4, speed: 2 };
        case 'terrain': return { ...base, color: '#ff4fd8', color2: '#8f6bff', color3: '#4fd8ff', speed: 2 };
        case 'shapes': return { ...base, angle: 50, color: '#5fb8ff', color2: '#b07bff', color3: '#7cf0c9', density: 4, speed: 2 };
        case 'starfield': return { ...base, color: '#ffffff', color2: '#9ad0ff', color3: '#ffd9a0', size: 4, density: 5, speed: 3 };
        case 'bubbles': return { ...base, color: '#9be7ff', color2: '#ffffff', color3: '#ff9be0', size: 5, density: 4, speed: 3 };
        case 'dust': return { ...base, color: '#ffe7b0', color2: '#ffffff', color3: '#ffc2a0', size: 5, density: 5, speed: 2 };
        case 'caustics': return { ...base, color: '#8fe6ff', color2: '#ffffff', size: 5, speed: 2 };
        case 'vignette': return { ...base, color: '#000000', size: 5 };
        case 'dither': return { ...base, size: 4, density: 4 };
        case 'vhs': return { ...base, size: 3, density: 5, over: true };
        default: return base;
    }
}
