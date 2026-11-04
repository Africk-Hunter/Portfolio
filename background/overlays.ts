// Overlay painters: marks on a see-through layer (stars, bubbles, dust).

import { type BgLayer } from './types';
import { cached, colorsOf, frac, hashId, type Painter, rgba, rng, sprite, type Sprite, stamp } from './shared';

// ── Overlays: marks on a see-through layer ───────────────────────────────────

/** Stars fly outward from the center. Each has a depth z that shrinks over time; its distance from the center grows as (1 - z)^2, so it speeds up as it nears, and a short streak joins its previous position. */
export const starfield: Painter = (ctx, W, H, t, l) => {
    const r = rng(hashId(l.id));
    const n = 60 + l.density * 40;
    const cx = W / 2, cy = H / 2, maxR = Math.hypot(cx, cy) * 1.1;
    const cols = colorsOf(l);
    ctx.lineCap = 'round';
    for (let i = 0; i < n; i++) {
        const ang = r() * 6.2832, phase = r(), col = cols[i % 3], w = 0.4 + r();
        const z = frac(phase - t * 0.08);
        const d1 = maxR * (1 - z) ** 2, d0 = maxR * (1 - Math.min(1, z + 0.025)) ** 2;
        const ca = Math.cos(ang), sa = Math.sin(ang);
        ctx.globalAlpha = Math.min(1, (1 - z) * 4);
        ctx.strokeStyle = col;
        ctx.lineWidth = (0.4 + l.size * 0.25) * w * (0.4 + (1 - z) * 1.4);
        ctx.beginPath();
        ctx.moveTo(cx + ca * d0, cy + sa * d0);
        ctx.lineTo(cx + ca * d1, cy + sa * d1);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
};

/** Translucent bubbles: a radial fill that is clear in the middle and tinted at the rim, a thin outline and a small shine, rising with a sideways wobble. */
export const bubbles: Painter = (ctx, W, H, t, l) => {
    if (l.kind !== 'low-res') {
        ctx.imageSmoothingEnabled = true;
        return drawBubbles(ctx, W, H, t, l, 1.2);
    }
    // The same bubbles drawn on a small canvas (full-size coordinates, scaled down) and blown up with hard edges: chunky pixels, smooth shading.
    const px = Math.min(W, H) < 600 ? 3 : 4;
    const lw = Math.max(1, Math.ceil(W / px)), lh = Math.max(1, Math.ceil(H / px));
    const low = (lowResCanvas ??= document.createElement('canvas'));
    if (low.width !== lw || low.height !== lh) { low.width = lw; low.height = lh; }
    const lctx = low.getContext('2d');
    if (!lctx) return;
    lctx.clearRect(0, 0, lw, lh);
    lctx.save();
    lctx.scale(lw / W, lh / H);
    drawBubbles(lctx, W, H, t, l, 2, 1 / px);
    lctx.restore();
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(low, 0, 0, lw * px, lh * px);
};
let lowResCanvas: HTMLCanvasElement | null = null;

interface Bubble { rad: number; bx: number; sp: number; off: number; ph: number; col: string }

/** Each bubble's size, lane and timing (bx is a share of the width), worked out once per layer. */
const bubbleSet = (l: BgLayer) => cached(l, 'bubbles', () => {
    const r = rng(hashId(l.id));
    const cols = [l.color, l.color3];
    return Array.from({ length: 6 + l.density * 3 }, (_, i): Bubble => ({
        rad: (8 + l.size * 5) * (0.45 + r()), bx: r(), sp: 18 + 30 * r(), off: r() * 5000, ph: r() * 6.28, col: cols[i % 2],
    }));
});

/** One bubble (rim-tinted fill, outline, shine) drawn once at `scale` canvas pixels per CSS pixel. */
function bubbleSprite(l: BgLayer, b: Bubble, scale: number, outline: number): Sprite {
    return sprite(b.rad + outline, scale, (c) => {
        const g = c.createRadialGradient(0, 0, b.rad * 0.2, 0, 0, b.rad);
        g.addColorStop(0, rgba(b.col, 0.03));
        g.addColorStop(0.75, rgba(b.col, 0.18));
        g.addColorStop(1, rgba(b.col, 0.55));
        c.fillStyle = g;
        c.beginPath();
        c.arc(0, 0, b.rad, 0, 6.2832);
        c.fill();
        c.strokeStyle = rgba(l.color2, 0.55);
        c.lineWidth = outline;
        c.stroke();
        c.fillStyle = rgba(l.color2, 0.8);
        c.beginPath();
        c.ellipse(-b.rad * 0.38, -b.rad * 0.4, b.rad * 0.2, b.rad * 0.11, -0.7, 0, 6.2832);
        c.fill();
    });
}

/** `scale`: canvas pixels per CSS pixel of the context drawn into (the low-res look draws at 1 / its cell size). */
function drawBubbles(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, l: BgLayer, outline: number, scale = 1) {
    const set = bubbleSet(l);
    const look = cached(l, `bubble-sprites|${outline}|${scale}`, () => set.map((b) => bubbleSprite(l, b, scale, outline)));
    for (let i = 0; i < set.length; i++) {
        const b = set[i];
        const span = H + b.rad * 4;
        const y = H + b.rad * 2 - ((b.off + t * b.sp) % span);
        const x = b.bx * W + Math.sin(t * 0.8 + b.ph) * b.rad * 0.6;
        stamp(ctx, look[i], x, y);
    }
}

interface Mote { rad: number; bx: number; by: number; ph: number; ph2: number; col: string; a: number }

/** Bokeh: big soft discs (bright rim, clear middle fading out) drifting on slow sines. Each disc is drawn once, then only moved. */
export const dust: Painter = (ctx, W, H, t, l) => {
    const motes = cached(l, 'dust', () => {
        const r = rng(hashId(l.id));
        const cols = colorsOf(l);
        return Array.from({ length: 10 + l.density * 4 }, (_, i): Mote => {
            const rad = (14 + l.size * 9) * (0.4 + r() * 1.1), bx = r(), by = r(), ph = r() * 6.28, ph2 = r() * 6.28;
            return { rad, bx, by, ph, ph2, col: cols[i % 3], a: 0.1 + 0.2 * r() };
        });
    });
    const look = cached(l, 'dust-sprites', () => motes.map((m) => sprite(m.rad, 1, (c) => {
        const g = c.createRadialGradient(0, 0, 0, 0, 0, m.rad);
        g.addColorStop(0, rgba(m.col, m.a * 0.5));
        g.addColorStop(0.8, rgba(m.col, m.a));
        g.addColorStop(1, rgba(m.col, 0));
        c.fillStyle = g;
        c.beginPath();
        c.arc(0, 0, m.rad, 0, 6.2832);
        c.fill();
    })));
    ctx.imageSmoothingEnabled = true;
    for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        stamp(ctx, look[i], m.bx * W + Math.sin(t * 0.25 + m.ph) * 40, m.by * H + Math.cos(t * 0.2 + m.ph2) * 30);
    }
};
