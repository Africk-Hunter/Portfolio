// Per-layer render loops for the canvas layers: a shader or painter, and a baked scene.

import { type BgLayer } from './types';
import { bayerQuantize, ditherGrid, Recorder, type Scene, type SceneSize } from './dither';
import { LITE_MS, LITE_SCALE, SMOOTH, SMOOTH_MS, SPEED_DIVISOR } from './frame';
import { PAINTERS } from './registry';
import { DITHER_SHADER_LEVELS, SHADERS, shaderWidth } from './shaders';
import { makeLut } from './shared';

// Slow motion steps visibly at low rates (sub-pixel jumps), fast motion strobes, so every speed gets 30/40 fps;
// the adaptive throttle (see canvasRenderer) backs off when a frame is expensive.
// A smooth layer (spinning edges stutter at low rates) runs at up to 60 fps. The dithered look is chunky pixels,
// which read fine at 40, and reads its pixels back every frame, so it is not smooth.
const isSmooth = (l: BgLayer) => SMOOTH.has(l.type) && l.kind === 'smooth';
const baseMsOf = (l: BgLayer, lite?: boolean) => (lite ? LITE_MS : isSmooth(l) ? SMOOTH_MS : 1000 / (SHADERS[l.type] ? 30 : 40));
/** Animation time per second of real time. */
export const speedOf = (l: BgLayer) => Math.min(l.type === 'contours' ? 4 : 10, l.speed) / SPEED_DIVISOR;

/**
 * Draws a shader or painter layer onto a 2D canvas: on the page (MathCanvas) or off it, as a texture (GpuEffects).
 * `draw` returns how long to wait before the next frame: the base rate, or longer when a frame is expensive
 * (keeping the layer to ~10% of main-thread time, 20% for a smooth layer, so the app stays responsive).
 */
export function canvasRenderer(layer: BgLayer, lite?: boolean) {
    const shader = SHADERS[layer.type];
    const painter = PAINTERS[layer.type];
    const lut = makeLut(layer);
    const baseMs = baseMsOf(layer, lite);
    const costFactor = isSmooth(layer) ? 5 : 10;
    let img: ImageData | null = null;
    return {
        baseMs,
        /** Sizes the canvas for a w x h CSS px box: shaders render ~160px wide and are smoothly scaled up; drawings use real size. */
        fit(canvas: HTMLCanvasElement, w: number, h: number) {
            const sw = Math.round(shaderWidth(layer) * (lite ? LITE_SCALE : 1));
            const cw = shader ? sw : w;
            const ch = shader ? Math.max(1, Math.round((h / w) * sw)) : h;
            if (canvas.width !== cw || canvas.height !== ch) {
                canvas.width = cw;
                canvas.height = ch;
                img = null;
            }
        },
        draw(ctx: CanvasRenderingContext2D, t: number): number {
            const started = performance.now();
            const { width: W, height: H } = ctx.canvas;
            if (shader) {
                img ??= ctx.createImageData(W, H);
                shader(img.data, W, H, t, layer, lut);
                if (layer.kind === 'dithered') bayerQuantize(img.data, W, H, DITHER_SHADER_LEVELS);
                ctx.putImageData(img, 0, 0);
            } else if (painter) {
                ctx.clearRect(0, 0, W, H);
                painter(ctx, W, H, t, layer, lut);
            }
            return Math.min(250, Math.max(baseMs, (performance.now() - started) * costFactor));
        },
    };
}

/** A dithered shader is drawn small and shown with hard edges. */
export const isCrisp = (l: BgLayer) => l.kind === 'dithered' && !!SHADERS[l.type];

/**
 * One copy of a scene: sizes it for a box, hands out the still picture, and draws what moves onto a canvas the
 * still picture's size. Dithered, a frame whose moving parts land on the same cells in the same shades as the last
 * one is skipped.
 */
export function sceneRun(scene: Scene, layer: BgLayer, lite?: boolean) {
    const dithered = layer.kind === 'dithered';
    const baseMs = baseMsOf(layer, lite);
    const rec = new Recorder();
    let size: SceneSize | null = null, W = 0, H = 0;
    // Shapes (paint): drawn at cell size here, dithered, then copied over; the last frame's pixels, to compare.
    let scratch: HTMLCanvasElement | null = null, sctx: CanvasRenderingContext2D | null = null, last: Uint32Array | null = null;
    const run = {
        baseMs,
        /** Canvas size, and CSS px per canvas pixel (the dither cell; 1 when smooth). */
        w: 1, h: 1, px: 1,
        /** Sizes for a W x H CSS px box; true when the size changed (every canvas must be resized and redrawn). */
        fit(bw: number, bh: number): boolean {
            if (size && bw === W && bh === H) return false;
            W = bw; H = bh;
            size = scene(layer, W, H);
            run.w = size.img.width; run.h = size.img.height;
            run.px = size.px ?? (dithered ? ditherGrid(W, H).px : 1);
            last = null;
            return true;
        },
        still: () => size?.img ?? null,
        /** How long to wait before the next frame after one that took `ms` (keeps a scene to ~10% of main-thread time). */
        next: (ms: number) => Math.min(250, Math.max(baseMs, ms * 10)),
        /**
         * Draws what moves at t onto ctx (run.w x run.h), over `under` when one canvas holds both, else over a clear
         * canvas. Returns false, leaving ctx untouched, when it would look the same as last time (unless `force`).
         */
        moving(ctx: CanvasRenderingContext2D, t: number, force: boolean, under?: HTMLCanvasElement | null): boolean {
            const s = size;
            if (!s) return false;
            const prep = () => {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                if (under) ctx.drawImage(under, 0, 0);
                else ctx.clearRect(0, 0, run.w, run.h);
            };
            if (s.paint) {
                if (!dithered) { prep(); s.paint(ctx, run.w, run.h, t); return true; }
                const { w, h } = run;
                scratch ??= document.createElement('canvas');
                if (scratch.width !== w || scratch.height !== h) { scratch.width = w; scratch.height = h; }
                sctx ??= scratch.getContext('2d', { willReadFrequently: true });
                if (!sctx) return false;
                sctx.clearRect(0, 0, w, h);
                s.paint(sctx, w, h, t);
                const im = sctx.getImageData(0, 0, w, h);
                bayerQuantize(im.data, w, h, ditherGrid(W, H, s.shades).levels);
                const words = new Uint32Array(im.data.buffer);
                if (!force && last && last.length === words.length) {
                    let i = 0;
                    while (i < words.length && words[i] === last[i]) i++;
                    if (i === words.length) return false;
                }
                last = words;
                sctx.putImageData(im, 0, 0);
                prep();
                ctx.drawImage(scratch, 0, 0);
                return true;
            }
            if (!s.move) return false;
            if (!dithered) { prep(); s.move(ctx, t); return true; }
            rec.begin();
            s.move(rec, t);
            if (!force && !rec.changed()) return false;
            prep();
            // The moving parts are drawn in CSS px, snapped to whole cells: scaled down, each cell is one pixel.
            ctx.setTransform(1 / run.px, 0, 0, 1 / run.px, 0, 0);
            rec.replay(ctx);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            return true;
        },
    };
    return run;
}
