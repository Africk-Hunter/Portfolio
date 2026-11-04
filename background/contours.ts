// Contours painter.

import { hexToRgb, type Painter } from './shared';

/**
 * Topographic map: a smooth height field h(x, y) sampled on a coarse grid, then traced with marching
 * squares into iso-lines h = k / bands, stroked as vectors at full resolution (so they stay sharp and
 * the work is per grid cell, not per pixel). Every fifth line is an index line, drawn heavier. The
 * ground tint (color2 low -> color3 high) is the same grid drawn as a tiny image and smoothly scaled up.
 */
const CONTOUR_CELL = 8;
// Per marching-squares case (bits: top-left 1, top-right 2, bottom-right 4, bottom-left 8), the cell edges
// the line crosses, in pairs. Edges: 0 top, 1 right, 2 bottom, 3 left.
const CONTOUR_EDGES = [[], [3, 0], [0, 1], [3, 1], [1, 2], [3, 0, 1, 2], [0, 2], [3, 2], [3, 2], [0, 2], [0, 1, 3, 2], [1, 2], [3, 1], [0, 1], [3, 0], []];
let heights = new Float32Array(0);
let groundCanvas: HTMLCanvasElement | null = null;
export const contours: Painter = (ctx, W, H, t, l) => {
    const s = 1.5 + Math.max(10, l.size) * 0.45; // scale runs 10-20: any closer looks coarse
    const bands = 4 + l.density * 1.6;
    const asp = H / W;
    const cell = CONTOUR_CELL;
    const gw = Math.ceil(W / cell) + 1, gh = Math.ceil(H / cell) + 1;
    if (heights.length < gw * gh) heights = new Float32Array(gw * gh);
    for (let j = 0; j < gh; j++) {
        const v = (j * cell / H - 0.5) * s * asp;
        for (let i = 0; i < gw; i++) {
            const u = (i * cell / W - 0.5) * s;
            heights[j * gw + i] = 0.5 + 0.22 * Math.sin(u * 1.3 + t * 0.3) * Math.cos(v * 1.1 - t * 0.2)
                + 0.14 * Math.sin((u - v) * 2.1 + t * 0.25) + 0.1 * Math.sin(Math.hypot(u + 1, v - 0.5) * 3 - t * 0.4);
        }
    }

    // Ground tint
    const lo = hexToRgb(l.color2), hi = hexToRgb(l.color3);
    groundCanvas ??= document.createElement('canvas');
    if (groundCanvas.width !== gw || groundCanvas.height !== gh) { groundCanvas.width = gw; groundCanvas.height = gh; }
    const gctx = groundCanvas.getContext('2d')!;
    const img = gctx.createImageData(gw, gh);
    for (let o = 0; o < gw * gh; o++) {
        const k = Math.min(1, Math.max(0, (heights[o] - 0.15) / 0.7));
        img.data[o * 4] = lo[0] + (hi[0] - lo[0]) * k;
        img.data[o * 4 + 1] = lo[1] + (hi[1] - lo[1]) * k;
        img.data[o * 4 + 2] = lo[2] + (hi[2] - lo[2]) * k;
        img.data[o * 4 + 3] = 255;
    }
    gctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(groundCanvas, -cell / 2, -cell / 2, gw * cell, gh * cell);

    // Iso-lines (marching squares)
    const thin = new Path2D(), thick = new Path2D();
    let ex = 0, ey = 0;
    for (let j = 0; j < gh - 1; j++) {
        const y0 = j * cell;
        for (let i = 0; i < gw - 1; i++) {
            const x0 = i * cell;
            const a = heights[j * gw + i], b = heights[j * gw + i + 1], c = heights[(j + 1) * gw + i + 1], d = heights[(j + 1) * gw + i];
            const kLo = Math.ceil(Math.min(a, b, c, d) * bands), kHi = Math.floor(Math.max(a, b, c, d) * bands);
            for (let k = kLo; k <= kHi; k++) {
                const L = k / bands;
                const edges = CONTOUR_EDGES[(a >= L ? 1 : 0) | (b >= L ? 2 : 0) | (c >= L ? 4 : 0) | (d >= L ? 8 : 0)];
                if (!edges.length) continue;
                const path = ((k % 5) + 5) % 5 === 0 ? thick : thin;
                for (let n = 0; n < edges.length; n++) {
                    const e = edges[n];
                    if (e === 0) { ex = x0 + cell * (L - a) / (b - a); ey = y0; }
                    else if (e === 1) { ex = x0 + cell; ey = y0 + cell * (L - b) / (c - b); }
                    else if (e === 2) { ex = x0 + cell * (L - d) / (c - d); ey = y0 + cell; }
                    else { ex = x0; ey = y0 + cell * (L - a) / (d - a); }
                    if (n % 2 === 0) path.moveTo(ex, ey); else path.lineTo(ex, ey);
                }
            }
        }
    }
    ctx.lineCap = 'round';
    ctx.strokeStyle = l.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.stroke(thin);
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.95;
    ctx.stroke(thick);
    ctx.globalAlpha = 1;
};
