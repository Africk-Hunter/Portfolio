// Per-pixel color shaders (plasma, ripples, fractal, ...).

import { type BgLayer } from './types';
import { hashId, lutIndex, rng, type Shader, SHADER_W, smoothstep } from './shared';

/** Sum of four travelling sines, mapped through the palette (classic demoscene plasma). */
const plasma: Shader = (d, W, H, t, l, lut) => {
    const s = 2 + l.size * 0.9;
    const bands = 0.5 + l.density * 0.25;
    const asp = H / W;
    let o = 0;
    for (let y = 0; y < H; y++) {
        const v = (y / H - 0.5) * s * asp;
        for (let x = 0; x < W; x++) {
            const u = (x / W - 0.5) * s;
            const sum = Math.sin(u * 1.7 + t) + Math.sin(v * 2.1 - t * 0.8) + Math.sin((u + v) * 1.2 + t * 1.3) + Math.sin(Math.sqrt(u * u + v * v) * 2.2 - t * 0.9);
            const i = lutIndex(((sum + 4) / 8) * bands);
            d[o++] = lut[i]; d[o++] = lut[i + 1]; d[o++] = lut[i + 2]; d[o++] = 255;
        }
    }
};

/** Three drifting point sources each emitting cos(k*r - wt): their interference is the picture. */
const ripples: Shader = (d, W, H, t, l, lut) => {
    const k = 90 / (1 + l.size * 0.35);
    const asp = H / W;
    const src = [0, 1, 2].map((i) => [0.5 + 0.38 * Math.cos(t * 0.17 * (i + 1) + i * 2.1), asp * (0.5 + 0.38 * Math.sin(t * 0.13 * (i + 2) + i * 1.3))]);
    let o = 0;
    for (let y = 0; y < H; y++) {
        const py = y / W;
        for (let x = 0; x < W; x++) {
            const px = x / W;
            let sum = 0;
            for (let i = 0; i < 3; i++) { const dx = px - src[i][0], dy = py - src[i][1]; sum += Math.cos(k * Math.sqrt(dx * dx + dy * dy) - t * 2.2); }
            const i = lutIndex((sum / 3 + 1) / 2);
            d[o++] = lut[i]; d[o++] = lut[i + 1]; d[o++] = lut[i + 2]; d[o++] = 255;
        }
    }
};

/** Julia set z -> z^2 + c, with c orbiting slowly so the shape morphs. */
const fractal: Shader = (d, W, H, t, l, lut) => {
    const span = 3.2 / (1 + l.size * 0.12);
    // c sweeps a small arc around the "rabbit" Julia set (c ~ -0.12+0.75i), morphing it.
    const a = 1.75 + 0.3 * Math.sin(t * 0.12);
    const cr = 0.76 * Math.cos(a), ci = 0.76 * Math.sin(a);
    const asp = H / W;
    const MAX = 28;
    // z -> z^2 + c gives the same result for z and -z, so the picture is point-symmetric. Pixel centers
    // are sampled so (x, y) mirrors exactly onto (W-1-x, H-1-y): only the top half is computed.
    for (let y = 0; y < (H + 1) >> 1; y++) {
        const y0 = ((y + 0.5) / H - 0.5) * span * asp;
        const my = H - 1 - y;
        for (let x = 0; x < W; x++) {
            let zr = ((x + 0.5) / W - 0.5) * span, zi = y0, n = 0, r2 = 0;
            while (n < MAX) {
                const nr = zr * zr - zi * zi + cr;
                zi = 2 * zr * zi + ci;
                zr = nr;
                r2 = zr * zr + zi * zi;
                if (r2 > 256) break;
                n++;
            }
            let r: number, g: number, b: number;
            if (n === MAX) {
                r = lut[0] * 0.3; g = lut[1] * 0.3; b = lut[2] * 0.3;
            } else {
                const mu = n + 1 - Math.log2(Math.log2(r2) / 2); // smooth iteration count
                const i = lutIndex(mu * 0.045);
                // Fade into the interior color over the last few iterations, so the set's edge is a ramp
                // instead of a step (a step upscales into a staircase).
                const f = smoothstep(MAX - 8, MAX, mu);
                r = lut[i] + (lut[0] * 0.3 - lut[i]) * f;
                g = lut[i + 1] + (lut[1] * 0.3 - lut[i + 1]) * f;
                b = lut[i + 2] + (lut[2] * 0.3 - lut[i + 2]) * f;
            }
            const o = (y * W + x) * 4;
            d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255;
            const m = (my * W + (W - 1 - x)) * 4;
            d[m] = r; d[m + 1] = g; d[m + 2] = b; d[m + 3] = 255;
        }
    }
};

function hash2(x: number, y: number): number {
    let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/**
 * Caustics: the bright network of light on a pool floor. Each pixel is pushed around by a few
 * layered sine/cosine warps (the "tileable water caustic" recipe); where the warped paths bunch
 * up the sum of 1/length spikes, and a high power keeps only those thin bright lines.
 */
const caustics: Shader = (d, W, H, t, l, lut) => {
    const sc = 1 + (11 - l.size) * 0.35;
    const inten = 0.005, TAU = 6.28318;
    // Per-iteration time offsets don't depend on the pixel.
    const tts = [0, 1, 2, 3, 4].map((n) => t * (1 - 3.5 / (n + 1)));
    let o = 0;
    for (let y = 0; y < H; y++) {
        const py = (y / W) * sc * TAU - 250;
        for (let x = 0; x < W; x++) {
            const px = (x / W) * sc * TAU - 250;
            let ix = px, iy = py, c = 1;
            for (let n = 0; n < 5; n++) {
                const tt = tts[n];
                ix = px + Math.cos(tt - ix) + Math.sin(tt + iy);
                iy = py + Math.sin(tt - iy) + Math.cos(tt + ix);
                // 1 / hypot(px / (sin / inten), py / (cos / inten)), without the slow hypot.
                const a = (px * inten) / Math.sin(ix + tt), b = (py * inten) / Math.cos(iy + tt);
                c += 1 / Math.sqrt(a * a + b * b);
            }
            c = 1.17 - (c / 5) ** 1.4;
            // |c|^8 by squaring: three multiplies instead of a pow.
            const c2 = c * c, c4 = c2 * c2;
            const v = Math.min(1, c4 * c4);
            const i = lutIndex(v * 0.33);
            d[o++] = lut[i]; d[o++] = lut[i + 1]; d[o++] = lut[i + 2]; d[o++] = v * 255;
        }
    }
};

// Scratch tables for the shaders below, grown once and reused every frame.
const MB_X = new Float32Array(10), MB_Y = new Float32Array(10), MB_R = new Float32Array(10);

/** Metaballs: each ball adds r^2 / d^2 to a field; the picture is the field's total, so nearby balls bulge toward each other and merge. */
const metaballs: Shader = (d, W, H, t, l, lut) => {
    const n = 3 + Math.round(l.density * 0.6);
    const asp = H / W, r = rng(hashId(l.id)), base = 0.05 + l.size * 0.012;
    for (let i = 0; i < n; i++) {
        MB_X[i] = 0.5 + 0.42 * Math.sin(t * (0.25 + 0.4 * r()) + r() * 6.28);
        MB_Y[i] = asp * (0.5 + 0.42 * Math.sin(t * (0.2 + 0.4 * r()) + r() * 6.28));
        MB_R[i] = base * base * (0.6 + 0.8 * r());
    }
    let o = 0;
    for (let y = 0; y < H; y++) {
        const py = y / W;
        for (let x = 0; x < W; x++) {
            const px = x / W;
            let f = 0;
            for (let i = 0; i < n; i++) { const dx = px - MB_X[i], dy = py - MB_Y[i]; f += MB_R[i] / (dx * dx + dy * dy + 1e-5); }
            const k = lutIndex((f / (1 + f)) * 0.66);
            d[o++] = lut[k]; d[o++] = lut[k + 1]; d[o++] = lut[k + 2]; d[o++] = 255;
        }
    }
};

/** Smooth value noise in [0, 1): random values on the integer lattice, blended with a smoothstep. */
export function vnoise(x: number, y: number): number {
    const xi = Math.floor(x), yi = Math.floor(y);
    let fx = x - xi, fy = y - yi;
    fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
    const a = hash2(xi, yi), b = hash2(xi + 1, yi), c = hash2(xi, yi + 1), e = hash2(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + e) * fx * fy;
}
const fbm2 = (x: number, y: number) => 0.65 * vnoise(x, y) + 0.35 * vnoise(x * 2.03 + 7.1, y * 2.03 + 3.7);

/** Domain warping: noise read at a point that two other noise fields have pushed around, which folds it into smoke or marble. */
const warp: Shader = (d, W, H, t, l, lut) => {
    const s = 1.5 + (11 - l.size) * 0.35, amt = 0.8 + l.density * 0.35, drift = t * 0.15;
    let o = 0;
    for (let y = 0; y < H; y++) {
        const v = (y / W) * s;
        for (let x = 0; x < W; x++) {
            const u = (x / W) * s;
            const q0 = fbm2(u + drift, v), q1 = fbm2(u + 5.2, v + 1.3 - drift);
            const f = fbm2(u + amt * q0 + 1.7 - drift * 0.5, v + amt * q1 + 9.2 + drift * 0.3);
            const k = lutIndex(f * 1.4 + q0 * 0.3);
            d[o++] = lut[k]; d[o++] = lut[k + 1]; d[o++] = lut[k + 2]; d[o++] = 255;
        }
    }
};

let gySx = new Float32Array(0), gyCx = new Float32Array(0), gySy = new Float32Array(0), gyCy = new Float32Array(0);
/** A slice of the gyroid sin x cos y + sin y cos z + sin z cos x = 0, with the slice moving through z. Trig is tabled per column and row. */
const gyroid: Shader = (d, W, H, t, l, lut) => {
    if (gySx.length < W) { gySx = new Float32Array(W); gyCx = new Float32Array(W); }
    if (gySy.length < H) { gySy = new Float32Array(H); gyCy = new Float32Array(H); }
    const k = 6.2832 * (1 + l.size * 0.3), bands = 0.6 + l.density * 0.3;
    for (let x = 0; x < W; x++) { const p = (x / W) * k + t * 0.4; gySx[x] = Math.sin(p); gyCx[x] = Math.cos(p); }
    for (let y = 0; y < H; y++) { const p = (y / W) * k + t * 0.3; gySy[y] = Math.sin(p); gyCy[y] = Math.cos(p); }
    const cz = Math.cos(t * 0.5), sz = Math.sin(t * 0.5);
    let o = 0;
    for (let y = 0; y < H; y++) {
        const sy = gySy[y], cy = gyCy[y], yz = sy * cz;
        for (let x = 0; x < W; x++) {
            const f = gySx[x] * cy + yz + sz * gyCx[x];
            const k2 = lutIndex((f * 0.33 + 0.5) * bands);
            d[o++] = lut[k2]; d[o++] = lut[k2 + 1]; d[o++] = lut[k2 + 2]; d[o++] = 255;
        }
    }
};

export const SHADERS: Partial<Record<BgLayer['type'], Shader>> = { plasma, ripples, fractal, caustics, metaballs, warp, gyroid };
/** Render width in pixels, where a shader needs more than the default. */
const SHADER_WIDTH: Partial<Record<BgLayer['type'], number>> = { fractal: 320, caustics: 150 };
/** A dithered shader renders at this width and is shown with hard edges, so one cell is a chunky pixel (about 8px on a wide screen). */
const DITHER_SHADER_W = 240;
export const DITHER_SHADER_LEVELS = 5;
export const shaderWidth = (l: BgLayer) => (l.kind === 'dithered' ? DITHER_SHADER_W : SHADER_WIDTH[l.type] ?? SHADER_W);
