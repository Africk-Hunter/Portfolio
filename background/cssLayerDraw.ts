// Canvas drawing for the CSS-like layers, and which layers the GPU path takes.

import { BG_TYPE_BY_KEY, type BgLayer } from './types';
import { rgba } from './shared';
import { f2 } from './svgFormat';

// ── Effects on the GPU ───────────────────────────────────────────────────────
// Dither and Pixelate as SVG filters re-run over everything under them whenever any of it moves, and Firefox runs
// SVG filters on the CPU (measured: Aero took about 7 cores and managed 22 fps; held still, 19% at 60 fps). Instead,
// the layers up to the top effect are drawn into one WebGL canvas: each layer is a texture, blended in order with its
// CSS blend mode and opacity, and each effect is a shader pass over what is drawn so far, the same maths as its filter.

/** Effects GpuEffects can draw. VHS (displacement) and app-wide effects (which filter the app itself) stay SVG filters. */
export const GPU_FX = new Set<BgLayer['type']>(['dither', 'pixelate']);
/** Styles the page draws with CSS; GpuEffects draws them on a canvas, once per size. */
export const CSS_TYPES = new Set<BgLayer['type']>(['gradient', 'pattern', 'scanlines', 'paper', 'vignette']);

export const BLEND_MODES = ['normal', 'multiply', 'screen', 'overlay', 'soft-light'];

// ── CSS layers drawn on a canvas ──

/** repeating-linear-gradient(deg, color 0 band, transparent band period), over a W x H box. */
function repeatingBands(ctx: CanvasRenderingContext2D, W: number, H: number, deg: number, band: number, period: number) {
    const a = (deg * Math.PI) / 180, dx = Math.sin(a), dy = -Math.cos(a);
    const len = Math.abs(W * dx) + Math.abs(H * dy); // the gradient line, through the middle
    const reach = Math.hypot(W, H);
    ctx.save();
    ctx.translate(W / 2 - (dx * len) / 2, H / 2 - (dy * len) / 2);
    ctx.rotate(Math.atan2(dy, dx));
    for (let k = Math.floor(-reach / period); k * period < len + reach; k++) ctx.fillRect(k * period, -reach, band, reach * 2);
    ctx.restore();
}

/** Fills the box with a repeating `s` CSS px tile, drawn at device resolution. */
function fillTiled(ctx: CanvasRenderingContext2D, W: number, H: number, dpr: number, s: number, color: string, draw: (c: CanvasRenderingContext2D) => void) {
    const px = Math.max(1, Math.round(s * dpr));
    const tile = document.createElement('canvas');
    tile.width = tile.height = px;
    const c = tile.getContext('2d');
    if (!c) return;
    c.scale(px / s, px / s);
    c.fillStyle = color;
    draw(c);
    const pattern = ctx.createPattern(tile, 'repeat');
    if (!pattern) return;
    pattern.setTransform(new DOMMatrix().scale(s / px));
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, W, H);
}

const paperImages = new Map<string, HTMLImageElement>();

/** Draws a CSS style (see LayerView) onto a canvas already scaled to CSS px. `onImage` is called if it waits on an image. */
export function drawCssLayer(ctx: CanvasRenderingContext2D, l: BgLayer, W: number, H: number, dpr: number, onImage: () => void) {
    const c = l.color, TAU = Math.PI * 2, rad = (d: number) => ((d - 90) * Math.PI) / 180;
    ctx.fillStyle = c;
    ctx.strokeStyle = c;
    if (l.type === 'gradient') {
        let g: CanvasGradient;
        if (l.kind === 'radial') { // circle at 50% 40%, reaching the farthest corner
            g = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.hypot(W / 2, H * 0.6));
        } else if (l.kind === 'conic') {
            g = ctx.createConicGradient(rad(l.angle), W / 2, H / 2);
        } else {
            const a = (l.angle * Math.PI) / 180, dx = Math.sin(a), dy = -Math.cos(a), len = Math.abs(W * dx) + Math.abs(H * dy);
            g = ctx.createLinearGradient(W / 2 - (dx * len) / 2, H / 2 - (dy * len) / 2, W / 2 + (dx * len) / 2, H / 2 + (dy * len) / 2);
        }
        const stops = l.kind === 'conic' ? [l.color, l.color2, l.color3, l.color] : [l.color, l.color2, l.color3];
        stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
    } else if (l.type === 'scanlines') {
        repeatingBands(ctx, W, H, 0, 1, 2 + l.size * 1.2);
    } else if (l.type === 'vignette') { // ellipse at center, reaching the farthest corner
        const rx = (W / 2) * Math.SQRT2, ry = (H / 2) * Math.SQRT2;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(rx, ry);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        g.addColorStop(Math.max(0, 85 - l.size * 7) / 100, rgba(c, 0));
        g.addColorStop(1, c);
        ctx.fillStyle = g;
        ctx.fillRect(-W / 2 / rx, -H / 2 / ry, W / rx, H / ry);
        ctx.restore();
    } else if (l.type === 'paper') {
        const url = paperUrl(l);
        let img = paperImages.get(url);
        if (!img) {
            if (paperImages.size > 8) paperImages.clear();
            img = new Image();
            img.src = url;
            paperImages.set(url, img);
        }
        const size = paperSize(l);
        if (img.complete && img.naturalWidth) fillTiled(ctx, W, H, dpr, size, c, (t) => t.drawImage(img, 0, 0, size, size));
        else img.addEventListener('load', onImage, { once: true });
    } else if (l.type === 'pattern') {
        const s = 10 + l.size * 6; // as patternBackground
        const cx = W / 2, cy = H / 2;
        switch (l.kind) {
            case 'dots': {
                const r = Math.max(1, l.size / 2);
                fillTiled(ctx, W, H, dpr, s, c, (t) => { t.beginPath(); t.arc(s / 2, s / 2, r + 0.25, 0, TAU); t.fill(); });
                break;
            }
            case 'stripes': repeatingBands(ctx, W, H, l.angle, s / 3, s); break;
            case 'checker': fillTiled(ctx, W, H, dpr, s * 2, c, (t) => { t.fillRect(s, 0, s, s); t.fillRect(0, s, s, s); }); break;
            case 'triangles': for (const a of [0, 60, 120]) repeatingBands(ctx, W, H, a, 1, s); break;
            case 'zigzag': {
                const h = s / 2;
                const tri = (t: CanvasRenderingContext2D, pts: number[][], ox: number) => {
                    t.beginPath();
                    pts.forEach(([x, y], i) => (i ? t.lineTo(x + ox, y) : t.moveTo(x + ox, y)));
                    t.fill();
                };
                fillTiled(ctx, W, H, dpr, s, c, (t) => {
                    for (const ox of [-h, h]) { tri(t, [[0, 0], [h, 0], [0, h]], ox); tri(t, [[s, 0], [h, 0], [s, h]], ox); }
                    tri(t, [[s, s], [h, s], [s, h]], 0);
                    tri(t, [[0, s], [h, s], [0, h]], 0);
                });
                break;
            }
            case 'rings': {
                ctx.beginPath();
                ctx.arc(cx, cy, 2, 0, TAU);
                ctx.fill();
                ctx.lineWidth = 2;
                for (let r = s; r < Math.hypot(cx, cy) + s; r += s) { ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, TAU); ctx.stroke(); }
                break;
            }
            case 'burst': {
                const R = Math.hypot(W, H), step = 4 + l.size * 2;
                for (let d = 0; d < 360; d += step) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, rad(d), rad(d + 1)); ctx.closePath(); ctx.fill(); }
                break;
            }
            default: fillTiled(ctx, W, H, dpr, s, c, (t) => { t.fillRect(0, 0, s, 1); t.fillRect(0, 0, 1, s); }); // grid
        }
    }
}

export const conicOk = () => typeof CanvasRenderingContext2D !== 'undefined' && 'createConicGradient' in CanvasRenderingContext2D.prototype;
export const moves = (l: BgLayer) => !BG_TYPE_BY_KEY[l.type].effect && !CSS_TYPES.has(l.type) && l.speed > 0;


/** Width of one paper tile, CSS px. */
export const paperSize = (l: BgLayer) => Math.round(100 + l.size * 40);
export function paperUrl(l: BgLayer): string {
    const s = (l.density / 10) * 0.5; // strongest speck alpha
    const speck = (freq: string, oct: number, seed: number, gain: number) =>
        `<filter id="f${seed}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="${oct}" seed="${seed}" stitchTiles="stitch"/>`
        + `<feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${f2(gain * s * 4)} 0 0 0 ${f2(-gain * s * 1.7)}"/></filter><rect width="200" height="200" filter="url(#f${seed})"/>`;
    const body = l.kind === 'canvas' ? speck('0.5 0.03', 2, 2, 1) + speck('0.03 0.5', 2, 3, 1)
        : l.kind === 'cardboard' ? speck('0.9 0.04', 3, 4, 1.1) + speck('0.7', 2, 5, 0.5)
            : speck('0.8', 3, 1, 1) + speck('0.04 0.7', 2, 6, 0.45);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="${l.color}"/>${body}</svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
