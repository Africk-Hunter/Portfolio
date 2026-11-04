// Small helpers shared by the background painters: seeded random, per-layer cache, sprites, color math.

import { type BgLayer } from './types';

// ── Small helpers ────────────────────────────────────────────────────────────

// Deterministic pseudo-random so a layer looks the same on every render.
export function rng(seed: number) {
    let a = seed + 0x6d2b79f5;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
export const hashId = (id: string) => [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

// What a layer works out once and reuses every frame: random placements, pre-drawn sprites. Layers are
// replaced, never changed, when edited, so the layer object is the key.
const perLayer = new WeakMap<BgLayer, Map<string, unknown>>();
export function cached<T>(l: BgLayer, key: string, make: () => T): T {
    let m = perLayer.get(l);
    if (!m) perLayer.set(l, (m = new Map()));
    if (!m.has(key)) m.set(key, make());
    return m.get(key) as T;
}

/** A shape drawn once on its own small canvas; `size` is its width in the CSS pixels it is stamped at. */
export interface Sprite { img: HTMLCanvasElement; size: number }
/** Draws a shape centered on (0, 0) and reaching `half` CSS px out, at `scale` canvas pixels per CSS pixel. */
export function sprite(half: number, scale: number, draw: (c: CanvasRenderingContext2D) => void): Sprite {
    const px = Math.max(1, Math.ceil((half * 2 + 2) * scale));
    const img = document.createElement('canvas');
    img.width = img.height = px;
    const c = img.getContext('2d');
    if (c) {
        c.setTransform(scale, 0, 0, scale, px / 2, px / 2);
        draw(c);
    }
    return { img, size: px / scale };
}
/** Draws a sprite centered on (x, y). */
export const stamp = (ctx: CanvasRenderingContext2D, s: Sprite, x: number, y: number) => ctx.drawImage(s.img, x - s.size / 2, y - s.size / 2, s.size, s.size);

export type Rgb = [number, number, number];
export const hexToRgb = (h: string): Rgb => {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const frac = (x: number) => x - Math.floor(x);
export const smoothstep = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
};

/** 256-entry cyclic palette: color -> color2 -> color3 -> back to color. */
export function makeLut(l: BgLayer): Uint8ClampedArray {
    const cs = [hexToRgb(l.color), hexToRgb(l.color2), hexToRgb(l.color3)];
    const lut = new Uint8ClampedArray(256 * 3);
    for (let i = 0; i < 256; i++) {
        const p = (i / 256) * 3;
        const k = Math.floor(p);
        const f = p - k;
        const a = cs[k % 3], b = cs[(k + 1) % 3];
        for (let j = 0; j < 3; j++) lut[i * 3 + j] = a[j] + (b[j] - a[j]) * f;
    }
    return lut;
}
export const lutIndex = (p: number) => ((frac(p) * 256) | 0) * 3;
// CSS strings for each palette entry, built once per palette instead of once per call.
const rgbStrings = new WeakMap<Uint8ClampedArray, string[]>();
export const rgbAt = (lut: Uint8ClampedArray, p: number) => {
    let strs = rgbStrings.get(lut);
    if (!strs) {
        strs = [];
        for (let i = 0; i < 256; i++) strs.push(`rgb(${lut[i * 3]} ${lut[i * 3 + 1]} ${lut[i * 3 + 2]})`);
        rgbStrings.set(lut, strs);
    }
    return strs[(frac(p) * 256) | 0];
};

// ── Per-pixel shaders (drawn small, scaled up by the browser) ────────────────
// Each fills `d` (RGBA, W*H) for time `t` in seconds-ish units.

export type Shader = (d: Uint8ClampedArray, W: number, H: number, t: number, l: BgLayer, lut: Uint8ClampedArray) => void;

// ── Vector drawings (full size 2D canvas) ────────────────────────────────────

export type Painter = (ctx: CanvasRenderingContext2D, W: number, H: number, t: number, l: BgLayer, lut: Uint8ClampedArray) => void;

export function mix(a: string, b: string, f: number): string {
    const [r1, g1, b1] = hexToRgb(a), [r2, g2, b2] = hexToRgb(b);
    return `rgb(${Math.round(r1 + (r2 - r1) * f)} ${Math.round(g1 + (g2 - g1) * f)} ${Math.round(b1 + (b2 - b1) * f)})`;
}

// Floating shapes: convex solids, each a vertex list plus faces given as vertex indices.
export type Vec = [number, number, number];

export const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const unit = (a: Vec): Vec => { const m = Math.hypot(...a) || 1; return [a[0] / m, a[1] / m, a[2] / m]; };

export const lerpRgb = (a: Rgb, b: Rgb, f: number): Rgb => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
export const rgbCss = (c: Rgb, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

export const rclamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const scaleRgb = (c: Rgb, f: number): Rgb => [c[0] * f, c[1] * f, c[2] * f];

export const rgba = (hex: string, a: number) => {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};
/** The layer's three colors, indexed 0..2 (crisp, unlike the blended palette). */
export const colorsOf = (l: BgLayer) => [l.color, l.color2, l.color3];

export const SHADER_W = 160;
