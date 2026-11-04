// Spinning solids for the Shapes background.

import { type BgLayer } from './types';
import { cached, cross, dot, frac, hashId, hexToRgb, type Painter, rng, sub, unit, type Vec } from './shared';

interface Solid { v: Vec[]; f: number[][] }

/** Faces of a solid made of equilateral triangles: every vertex triple whose three sides are all the edge length. */
function triFaces(v: Vec[]): number[][] {
    const d = (a: number, b: number) => Math.hypot(...sub(v[a], v[b]));
    let edge = Infinity;
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) edge = Math.min(edge, d(i, j));
    const adj = (a: number, b: number) => Math.abs(d(a, b) - edge) < 1e-6;
    const f: number[][] = [];
    for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) for (let k = j + 1; k < v.length; k++)
        if (adj(i, j) && adj(j, k) && adj(i, k)) f.push([i, j, k]);
    return f;
}

/** Scales to a circumradius of 1 and winds each face so (b - a) x (c - a) points outward. */
function solid(v: Vec[], f: number[][]): Solid {
    const r = Math.max(...v.map((p) => Math.hypot(...p)));
    const s = v.map((p) => [p[0] / r, p[1] / r, p[2] / r] as Vec);
    return {
        v: s,
        f: f.map((face) => {
            const [a, b, c] = face.map((i) => s[i]);
            return dot(cross(sub(b, a), sub(c, a)), a) < 0 ? [...face].reverse() : face;
        }),
    };
}

const PHI = (1 + Math.sqrt(5)) / 2;
const TETRA: Vec[] = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
const OCTA: Vec[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const ICOSA: Vec[] = [];
for (const a of [-1, 1]) for (const b of [-PHI, PHI]) ICOSA.push([0, a, b], [a, b, 0], [b, 0, a]);
// Vertex i has x, y, z = +1 where bit 0, 1, 2 of i is set; each face lists its four corners in order around it.
const CUBE: Vec[] = Array.from({ length: 8 }, (_, i) => [i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1]);
export const CUBE_FACES = [[0, 2, 6, 4], [1, 3, 7, 5], [0, 1, 5, 4], [2, 3, 7, 6], [0, 1, 3, 2], [4, 5, 7, 6]];

/** The icosahedron with every triangle cut into four and the new corners pushed out to the sphere: a faceted ball. */
function icosphere(): Solid {
    const v: Vec[] = ICOSA.map(unit);
    const mids = new Map<string, number>();
    const mid = (a: number, b: number) => {
        const key = a < b ? `${a}_${b}` : `${b}_${a}`;
        let i = mids.get(key);
        if (i === undefined) {
            i = v.length;
            v.push(unit([(v[a][0] + v[b][0]) / 2, (v[a][1] + v[b][1]) / 2, (v[a][2] + v[b][2]) / 2]));
            mids.set(key, i);
        }
        return i;
    };
    const f: number[][] = [];
    for (const [a, b, c] of triFaces(ICOSA)) {
        const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
        f.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    return solid(v, f);
}
const ring = (n: number, y: number): Vec[] => Array.from({ length: n }, (_, i): Vec => [Math.cos((i / n) * 6.2832), y, Math.sin((i / n) * 6.2832)]);
const HEX_PRISM: Vec[] = [...ring(6, 0.7), ...ring(6, -0.7)];
const HEX_PRISM_FACES = [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], ...Array.from({ length: 6 }, (_, i) => [i, (i + 1) % 6, 6 + ((i + 1) % 6), 6 + i])];
// Five points around the middle plus one apex above and one below.
const PENTA_BIPYRAMID: Vec[] = [...ring(5, 0), [0, 1.1, 0], [0, -1.1, 0]];
const PENTA_BIPYRAMID_FACES = Array.from({ length: 5 }, (_, i): number[][] => [[i, (i + 1) % 5, 5], [i, (i + 1) % 5, 6]]).flat();

export const SOLIDS: Solid[] = [
    solid(CUBE, CUBE_FACES),
    solid(TETRA, triFaces(TETRA)),
    solid(OCTA, triFaces(OCTA)),
    solid(ICOSA, triFaces(ICOSA)),
    // A tall crystal: the octahedron stretched along y (faces found before stretching, while its edges are equal).
    solid(OCTA.map(([x, y, z]) => [x * 0.62, y, z * 0.62] as Vec), triFaces(OCTA)),
    // Appended, not mixed in, so saved themes keep the same shapes in the same places.
    icosphere(),
    solid(HEX_PRISM, HEX_PRISM_FACES),
    solid(PENTA_BIPYRAMID, PENTA_BIPYRAMID_FACES),
];

/** Direction toward the light: upper left and in front (screen y points down, the camera looks along +z). */
const LIGHT = unit([-0.45, -0.75, -0.5]);

/**
 * Floating shapes: flat-shaded solids that spin on two axes and bob on a sine, seen through a
 * pinhole camera (screen = center + world * focal / depth). Faces turned away from the camera are
 * skipped and the shapes are drawn far to near, which is enough for convex solids that never touch.
 * Each face is lit by how directly it faces the light (Lambert), plus a small highlight; far shapes fade.
 */
const SHAPE_Z0 = 3, SHAPE_Z1 = 9;

/** Where each shape sits and how it moves, worked out once per layer (far to near). */
const shapeSet = (l: BgLayer) => cached(l, 'shapes', () => {
    const r = rng(hashId(l.id));
    const n = 3 + l.density;
    const palette = [hexToRgb(l.color), hexToRgb(l.color2), hexToRgb(l.color3)];
    const Z0 = SHAPE_Z0, Z1 = SHAPE_Z1;
    const k0 = Math.floor(r() * SOLIDS.length);
    // Position (stored in `angle`): 0 = top, 100 = bottom.
    const pos = Math.min(100, Math.max(0, l.angle));
    const midV = 0.12 + 0.76 * (pos / 100);
    // Spread (0 = as before): the height range widens and the heights even out, so shapes stop clumping.
    const sp = Math.min(10, Math.max(0, l.spread ?? 0)) / 10;
    const items = Array.from({ length: n }, (_, i) => ({
        // One slot of the width each, so they spread out, at a random height and depth.
        u: (i + 0.15 + 0.7 * r()) / n,
        v: Math.min(0.95, Math.max(0.05, midV + (0.5 + 0.7 * sp) * (((1 - sp) * r() + sp * frac((i + 0.5) * 0.618034)) - 0.5))),
        z: Z0 + (Z1 - Z0) * r(),
        solid: SOLIDS[(i + k0) % SOLIDS.length],
        rad: (0.22 + l.size * 0.055) * (0.75 + 0.5 * r()),
        spinX: (0.3 + 0.6 * r()) * (r() < 0.5 ? -1 : 1),
        spinY: (0.4 + 0.7 * r()) * (r() < 0.5 ? -1 : 1),
        p1: r() * 6.28,
        p2: r() * 6.28,
        bobRate: 0.9 + 0.8 * r(),
        bobPhase: r() * 6.28,
        color: palette[i % 3],
    })).sort((a, b) => b.z - a.z);
    return items;
});

export const drawShapes: Painter = (ctx, W, H, t, l) => {
    const focal = Math.min(W, H) * 1.15;
    const Z0 = SHAPE_Z0, Z1 = SHAPE_Z1;
    ctx.lineJoin = 'round';
    for (const s of shapeSet(l)) {
        const ca = Math.cos(s.p1 + t * s.spinX), sa = Math.sin(s.p1 + t * s.spinX);
        const cb = Math.cos(s.p2 + t * s.spinY), sb = Math.sin(s.p2 + t * s.spinY);
        // Spin about y, then about x.
        const rot = s.solid.v.map(([x, y, z]): Vec => {
            const x1 = x * cb + z * sb, z1 = z * cb - x * sb;
            return [x1, y * ca - z1 * sa, y * sa + z1 * ca];
        });
        const cx = ((s.u - 0.5) * W * s.z) / focal;
        const cy = ((s.v - 0.5) * H * s.z) / focal + Math.sin(t * s.bobRate + s.bobPhase) * 0.3;
        const world = rot.map(([x, y, z]): Vec => [cx + x * s.rad, cy + y * s.rad, s.z + z * s.rad]);
        const screen = world.map(([x, y, z]) => [W / 2 + (x * focal) / z, H / 2 + (y * focal) / z]);

        ctx.globalAlpha = 1 - 0.55 * ((s.z - Z0) / (Z1 - Z0));
        ctx.lineWidth = Math.max(1, (s.rad * focal) / s.z / 80);
        for (const face of s.solid.f) {
            const [a, b, c] = face.map((i) => rot[i]);
            const nrm = unit(cross(sub(b, a), sub(c, a)));
            if (dot(nrm, world[face[0]]) >= 0) continue; // faces away from the camera
            const lam = Math.max(0, dot(nrm, LIGHT));
            const k = 0.45 + 0.6 * lam, spec = lam ** 12 * 0.45;
            const [R, G, B] = s.color.map((ch) => {
                const lit = ch * k;
                return Math.round(lit + (255 - lit) * spec);
            });
            ctx.fillStyle = `rgb(${R} ${G} ${B})`;
            // Edges a little lighter than the face; they also cover the seams between faces.
            ctx.strokeStyle = `rgb(${Math.round(R + (255 - R) * 0.35)} ${Math.round(G + (255 - G) * 0.35)} ${Math.round(B + (255 - B) * 0.35)})`;
            ctx.beginPath();
            face.forEach((i, j) => (j ? ctx.lineTo(screen[i][0], screen[i][1]) : ctx.moveTo(screen[i][0], screen[i][1])));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
    ctx.globalAlpha = 1;
};
