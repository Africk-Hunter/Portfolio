// Bayer dithering and the baked-scene plumbing (Scene, Recorder, bakeFor).

import { type BgLayer } from './types';
import { cached } from './shared';

// 4x4 Bayer matrix, as thresholds in (0, 1).
export const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const DITHER_PX = 3;     // size of one dithered pixel on screen
const DITHER_LEVELS = 4; // shades per color channel
let lowCanvas: HTMLCanvasElement | null = null;

/** The cell size and shade count that drawDithered uses for a W x H canvas. */
export const ditherGrid = (W: number, H: number, shades = DITHER_LEVELS) => {
    // On a phone the same 3px cells and 4 shades read as heavy noise: finer cells, more shades.
    const small = Math.min(W, H) < 600;
    return { px: small ? 2 : DITHER_PX, levels: small ? 8 : shades };
};

/** Runs `draw` on a small canvas (3px cells, 2px on a phone), dithers the result and scales it up onto ctx. */
export function drawDithered(ctx: CanvasRenderingContext2D, W: number, H: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, shades = DITHER_LEVELS) {
    const { px, levels } = ditherGrid(W, H, shades);
    const lw = Math.max(1, Math.ceil(W / px)), lh = Math.max(1, Math.ceil(H / px));
    const low = (lowCanvas ??= document.createElement('canvas'));
    if (low.width !== lw || low.height !== lh) { low.width = lw; low.height = lh; }
    const lctx = low.getContext('2d', { willReadFrequently: true });
    if (!lctx) return;
    lctx.clearRect(0, 0, lw, lh);
    draw(lctx, lw, lh);
    const img = lctx.getImageData(0, 0, lw, lh);
    bayerQuantize(img.data, lw, lh, levels);
    lctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(low, 0, 0, lw * px, lh * px);
}

/** Like drawDithered, but the result stays small: `out` becomes one pixel per cell (a scene's still picture, scaled up where it is shown). */
function ditherBake(out: HTMLCanvasElement, W: number, H: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, shades = DITHER_LEVELS) {
    const { px, levels } = ditherGrid(W, H, shades);
    const lw = Math.max(1, Math.ceil(W / px)), lh = Math.max(1, Math.ceil(H / px));
    out.width = lw;
    out.height = lh;
    const c = out.getContext('2d', { willReadFrequently: true });
    if (!c) return;
    draw(c, lw, lh);
    const img = c.getImageData(0, 0, lw, lh);
    bayerQuantize(img.data, lw, lh, levels);
    c.putImageData(img, 0, 0);
}

/** The part of a 2D context a scene's moving parts draw with (so a Recorder can stand in for one). */
export interface Draw2D {
    fillStyle: string | CanvasGradient | CanvasPattern;
    imageSmoothingEnabled: boolean;
    fillRect(x: number, y: number, w: number, h: number): void;
    beginPath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    closePath(): void;
    fill(): void;
    rect(x: number, y: number, w: number, h: number): void;
    clip(): void;
    save(): void;
    restore(): void;
    drawImage(img: CanvasImageSource, x: number, y: number, w: number, h: number): void;
}

const Op = { Style: 0, FillRect: 1, Begin: 2, Move: 3, Line: 4, Close: 5, Fill: 6, Rect: 7, Clip: 8, Save: 9, Restore: 10, Image: 11, Smooth: 12 } as const;

/**
 * Records drawing calls instead of making them. A dithered scene draws its moving parts into one every frame: they
 * snap to whole cells, so at slow speeds most frames come out the same as the one before, and those are skipped
 * (the canvas is left alone, so the browser has nothing to re-composite).
 */
export class Recorder implements Draw2D {
    private nums: number[] = [];
    private refs: unknown[] = [];
    private prevNums: number[] = [];
    private prevRefs: unknown[] = [];
    private style: string | CanvasGradient | CanvasPattern = '#000';
    private smooth = true;

    get fillStyle() { return this.style; }
    set fillStyle(v) { this.style = v; this.nums.push(Op.Style); this.refs.push(v); }
    get imageSmoothingEnabled() { return this.smooth; }
    set imageSmoothingEnabled(v) { this.smooth = v; this.nums.push(Op.Smooth, v ? 1 : 0); }
    fillRect(x: number, y: number, w: number, h: number) { this.nums.push(Op.FillRect, x, y, w, h); }
    beginPath() { this.nums.push(Op.Begin); }
    moveTo(x: number, y: number) { this.nums.push(Op.Move, x, y); }
    lineTo(x: number, y: number) { this.nums.push(Op.Line, x, y); }
    closePath() { this.nums.push(Op.Close); }
    fill() { this.nums.push(Op.Fill); }
    rect(x: number, y: number, w: number, h: number) { this.nums.push(Op.Rect, x, y, w, h); }
    clip() { this.nums.push(Op.Clip); }
    save() { this.nums.push(Op.Save); }
    restore() { this.nums.push(Op.Restore); }
    // A canvas redrawn every frame (the road's relief) carries a `ver` that it bumps, so identical arguments are not "unchanged".
    drawImage(img: CanvasImageSource, x: number, y: number, w: number, h: number) { this.nums.push(Op.Image, x, y, w, h, (img as { ver?: number }).ver ?? 0); this.refs.push(img); }

    /** Starts a new frame; the last one is kept to compare against. */
    begin() {
        [this.prevNums, this.nums] = [this.nums, this.prevNums];
        [this.prevRefs, this.refs] = [this.refs, this.prevRefs];
        this.nums.length = 0;
        this.refs.length = 0;
    }

    /** Whether this frame's calls differ from the last frame's. */
    changed(): boolean {
        const a = this.nums, b = this.prevNums, ra = this.refs, rb = this.prevRefs;
        if (a.length !== b.length || ra.length !== rb.length) return true;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return true;
        for (let i = 0; i < ra.length; i++) if (ra[i] !== rb[i]) return true;
        return false;
    }

    /** Makes this frame's calls on a real context. */
    replay(ctx: CanvasRenderingContext2D) {
        const n = this.nums, r = this.refs;
        let k = 0;
        for (let i = 0; i < n.length;) {
            switch (n[i++]) {
                case Op.Style: ctx.fillStyle = r[k++] as string | CanvasPattern; break;
                case Op.FillRect: ctx.fillRect(n[i], n[i + 1], n[i + 2], n[i + 3]); i += 4; break;
                case Op.Begin: ctx.beginPath(); break;
                case Op.Move: ctx.moveTo(n[i], n[i + 1]); i += 2; break;
                case Op.Line: ctx.lineTo(n[i], n[i + 1]); i += 2; break;
                case Op.Close: ctx.closePath(); break;
                case Op.Fill: ctx.fill(); break;
                case Op.Rect: ctx.rect(n[i], n[i + 1], n[i + 2], n[i + 3]); i += 4; break;
                case Op.Clip: ctx.clip(); break;
                case Op.Save: ctx.save(); break;
                case Op.Restore: ctx.restore(); break;
                case Op.Image: ctx.drawImage(r[k++] as CanvasImageSource, n[i], n[i + 1], n[i + 2], n[i + 3]); i += 5; break;
                case Op.Smooth: ctx.imageSmoothingEnabled = n[i++] === 1; break;
            }
        }
    }
}

// ── 3D scenes (city, road, reef) ──
// The picture is baked once per size and shown on a canvas of its own; each frame only what moves is drawn, on a
// transparent canvas over it (see sceneRun). Dithered, both canvases are one pixel per cell, scaled up with hard edges.

/** A scene baked for one size. */
export interface SceneSize {
    /** The still picture: W x H, or one pixel per dither cell when dithered. */
    img: HTMLCanvasElement;
    /** Draws what moves at time t, in CSS px (snapped to the cells when dithered). */
    move?: (ctx: Draw2D, t: number) => void;
    /** Instead of move, for shapes that don't snap: draws what moves in the canvas's own pixels; dithered with `shades` afterwards. */
    paint?: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
    shades?: number;
    /** CSS px per canvas pixel, for a scene that picks its own resolution (Lagoon: about a PS2 frame, scaled up smoothly). */
    px?: number;
}
export type Scene = (l: BgLayer, W: number, H: number) => SceneSize;

/** A scene's bake for W x H. A few sizes are kept per layer: the page and the mind map share one, an editor preview is another. */
export function bakeFor(l: BgLayer, key: string, W: number, H: number, make: () => SceneSize): SceneSize {
    const list = cached(l, key, () => [] as { size: string; v: SceneSize }[]);
    const size = `${W}x${H}`, i = list.findIndex((e) => e.size === size);
    const e = i >= 0 ? list.splice(i, 1)[0] : { size, v: make() };
    list.unshift(e);
    if (list.length > 3) list.length = 3;
    return e.v;
}

/** A canvas for a scene's still picture, W x H with `draw` on it, or baked through ditherBake. */
export function sceneBake(l: BgLayer, W: number, H: number, shades: number, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void): HTMLCanvasElement {
    const img = document.createElement('canvas');
    if (l.kind !== 'smooth') { ditherBake(img, W, H, draw, shades); return img; }
    img.width = W;
    img.height = H;
    const c = img.getContext('2d', { willReadFrequently: true });
    if (c) draw(c, W, H);
    return img;
}

/** Ordered dither of RGBA pixels in place: each channel snaps to `levels` shades, alpha to on or off. */
export function bayerQuantize(d: Uint8ClampedArray, w: number, h: number, levels: number, ox = 0, oy = 0) {
    const top = levels - 1;
    for (let y = 0, o = 0; y < h; y++) {
        const row = ((y + oy) & 3) * 4;
        for (let x = 0; x < w; x++, o += 4) {
            if (d[o + 3] === 0) continue; // most of a layer of movers is empty
            const th = BAYER[row + ((x + ox) & 3)];
            if (d[o + 3] / 255 <= th) { d[o + 3] = 0; continue; }
            d[o + 3] = 255;
            for (let j = 0; j < 3; j++) {
                const v = (d[o + j] / 255) * top, lo = Math.floor(v);
                d[o + j] = ((lo + (v - lo > th ? 1 : 0)) / top) * 255;
            }
        }
    }
}
