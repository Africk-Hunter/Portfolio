// Canvas painters that draw a layer straight onto the canvas each frame.

import { drawDithered } from './dither';
import { drawShapes } from './shapes';
import { frac, hashId, mix, type Painter, rgbAt, rng, smoothstep } from './shared';

/** Phyllotaxis: dot i sits at radius c*sqrt(i), angle i*137.5deg (the golden angle). */
export const spiral: Painter = (ctx, W, H, t, l, lut) => {
    const N = 120 + l.density * 80;
    const maxR = Math.hypot(W, H) / 2 * 1.05;
    const c = maxR / Math.sqrt(N);
    const rot = t * 0.05;
    // Spacing follows the canvas but dot size is in pixels, so a small editor tile would be all dots: shrink them with it.
    const fit = Math.min(1, Math.hypot(W, H) / 1800);
    for (let i = 1; i < N; i++) {
        const r = c * Math.sqrt(i);
        const th = i * 2.399963 + rot;
        const x = W / 2 + r * Math.cos(th), y = H / 2 + r * Math.sin(th);
        const rad = Math.max(0.5, (0.8 + l.size * 0.5 * (0.3 + r / maxR)) * fit);
        if (x < -rad || x > W + rad || y < -rad || y > H + rad) continue; // off the canvas
        ctx.fillStyle = rgbAt(lut, i / N + t * 0.01);
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, 6.2832);
        ctx.fill();
    }
};

/** Stacked, rotated hypotrochoids (spirograph curves) whose pen offset slowly breathes. */
export const mandala: Painter = (ctx, W, H, t, l, lut) => {
    const K = 3 + l.density * 2;
    const R = 5, r = 3, d = 3.5 + Math.sin(t * 0.18) * 1.5;
    const scale = (Math.min(W, H) * 0.46) / (R - r + d);
    ctx.lineWidth = 0.8 + l.size * 0.25;
    ctx.lineJoin = 'round';
    for (let k = 0; k < K; k++) {
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.rotate((k * 2 * Math.PI) / K / 2 + t * 0.06);
        const s = 1 - (k / K) * 0.55;
        ctx.strokeStyle = rgbAt(lut, k / K);
        ctx.beginPath();
        for (let i = 0; i <= 360; i++) {
            const a = (i / 360) * Math.PI * 6;
            const x = ((R - r) * Math.cos(a) + d * Math.cos(((R - r) / r) * a)) * scale * s;
            const y = ((R - r) * Math.sin(a) - d * Math.sin(((R - r) / r) * a)) * scale * s;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
    }
};

/** Layered hills: each ridge is a sum of three sines, tinted from far (color2) to near (color). */
export const ridges: Painter = (ctx, W, H, t, l) => {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, l.color3);
    sky.addColorStop(1, mix(l.color3, '#ffffff', 0.45));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    const N = l.density + 2;
    const r = rng(hashId(l.id));
    for (let i = 0; i < N; i++) {
        const f = N === 1 ? 1 : i / (N - 1);
        const base = H * (0.3 + 0.6 * f);
        const amp = H * (0.07 + 0.05 * (1 - f));
        const p1 = r() * 6.28, p2 = r() * 6.28, p3 = r() * 6.28;
        const k = 1 + r() * 0.8;
        ctx.fillStyle = mix(l.color2, l.color, f);
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let x = 0; x <= W + 8; x += 8) {
            const u = (x / W) * k * 6.28;
            const y = base + amp * (0.5 * Math.sin(u * 0.9 + p1 + t * 0.12) + 0.3 * Math.sin(u * 1.9 + p2 - t * 0.09) + 0.2 * Math.sin(u * 3.7 + p3 + t * 0.15));
            ctx.lineTo(x, y);
        }
        ctx.lineTo(W + 8, H);
        ctx.closePath();
        ctx.fill();
    }
};

/**
 * Truchet tiles: each square holds two quarter circles joining opposite edges, so any rotation
 * still meets its neighbours and the arcs form endless winding paths. Every tile turns 90 degrees
 * now and then, briefly breaking and re-forming the paths around it.
 */
export const truchet: Painter = (ctx, W, H, t, l, lut) => {
    const cell = 26 + l.size * 9;
    const h = cell / 2;
    const cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
    const r = rng(hashId(l.id));
    ctx.lineWidth = 1 + l.density * 0.7;
    ctx.lineCap = 'round';
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const u = t * 0.06 + r() * 40;
            const turn = (r() < 0.5 ? 0 : 1) + Math.floor(u) + smoothstep(0.82, 1, frac(u));
            const a = turn * Math.PI / 2, cs = Math.cos(a), sn = Math.sin(a);
            ctx.setTransform(cs, sn, -sn, cs, (i + 0.5) * cell, (j + 0.5) * cell);
            ctx.strokeStyle = rgbAt(lut, (i + j) / (cols + rows) + t * 0.015);
            ctx.beginPath();
            ctx.arc(-h, -h, h, 0, Math.PI / 2);
            ctx.moveTo(0, h);
            ctx.arc(h, h, h, Math.PI, Math.PI * 1.5);
            ctx.stroke();
        }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
};

/**
 * 3D wave grid: a height field y = f(x, z) sampled on a grid and drawn with a pinhole camera
 * (screen = center + world * focal / depth). The camera moves forward through world z, so the
 * landscape itself stays put and rolls toward the viewer; far lines fade into the horizon.
 */
export const terrain: Painter = (ctx, W, H, t, l, lut) => {
    const rows = 12 + l.density * 2, cols = 14 + l.density * 3;
    const dz = 0.5, zMax = rows * dz;
    const amp = 0.05 + l.size * 0.035;
    const horizon = H * 0.46, focal = H * 0.9, camY = 0.9;
    const X = ((W / 2) * zMax) / focal; // half-width that fills the screen at the far row
    const camZ = t * 0.5;
    const k0 = Math.floor(camZ / dz);
    const height = (x: number, z: number) => amp * (Math.sin(x * 1.1 + z * 0.7) * 0.6 + Math.sin(x * 0.45 - z * 1.3 + 1) * 0.4 + Math.sin(z * 0.35) * 0.5);
    const pts: [number, number][][] = [];
    const depth: number[] = [];
    for (let j = rows; j >= 1; j--) { // far to near
        const zw = (k0 + j) * dz;
        const zr = Math.max(0.05, zw - camZ); // the nearest row passes the camera; keep it off zero depth
        const row: [number, number][] = [];
        for (let i = 0; i <= cols; i++) {
            const x = -X + (2 * X * i) / cols;
            row.push([W / 2 + (x * focal) / zr, horizon + ((camY - height(x, zw)) * focal) / zr]);
        }
        pts.push(row);
        depth.push(zr);
    }
    ctx.lineWidth = 1 + l.size * 0.08;
    for (let r = 0; r < pts.length; r++) {
        const zr = depth[r];
        ctx.globalAlpha = smoothstep(0, dz * 1.5, zr) * (1 - zr / (zMax + dz)) ** 0.7;
        ctx.strokeStyle = rgbAt(lut, (zr / zMax) * 0.66); // near = color, through color2, far = color3
        ctx.beginPath();
        pts[r].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        // Lines toward the viewer, from this row to the next nearer one.
        if (r + 1 < pts.length) {
            for (let i = 0; i <= cols; i++) {
                ctx.moveTo(pts[r][i][0], pts[r][i][1]);
                ctx.lineTo(pts[r + 1][i][0], pts[r + 1][i][1]);
            }
        }
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
};

/**
 * The shapes drawn small, then ordered-dithered: each channel is snapped to a few levels, choosing
 * the upper or lower one by comparing the leftover against a repeating Bayer pattern, so smooth
 * shading becomes a crosshatch of two shades. Edges and the distance fade are dithered the same
 * way (alpha is either on or off), and the result is scaled up without smoothing into chunky pixels.
 */
export const shapes: Painter = (ctx, W, H, t, l, lut) => {
    if (l.kind === 'smooth') return drawShapes(ctx, W, H, t, l, lut);
    drawDithered(ctx, W, H, (c, w, h) => drawShapes(c, w, h, t, l, lut));
};
