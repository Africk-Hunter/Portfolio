// WebGL helpers, effect shaders and the dither grain tile.

/** Width of the dither grain tile, CSS px (a power of two, so WebGL 1 can repeat it). Per-pixel grain repeating every 256px cannot be seen. */
export const GRAIN_TILE = 256;

const HIGHP = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
export const QUAD_VERT = 'attribute vec2 a; varying vec2 uv; void main() { uv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }';
export const COPY_FRAG = 'precision mediump float; varying vec2 uv; uniform sampler2D base; void main() { gl_FragColor = texture2D(base, uv); }';
// Separable blend modes as CSS defines them (Compositing and Blending), on premultiplied colors: the result is
// source-over, with the overlap colored by the mode's B(backdrop, source).
export const BLEND_FRAG = `
precision mediump float;
varying vec2 uv;
uniform sampler2D base;
uniform sampler2D layer;
uniform float mode;
uniform float opacity;
vec3 blendMode(vec3 b, vec3 s) {
    if (mode < 0.5) return s;
    if (mode < 1.5) return b * s;
    if (mode < 2.5) return b + s - b * s;
    if (mode < 3.5) return mix(2.0 * b * s, 1.0 - 2.0 * (1.0 - b) * (1.0 - s), step(0.5, b));
    vec3 d = mix(((16.0 * b - 12.0) * b + 4.0) * b, sqrt(b), step(0.25, b));
    return mix(b - (1.0 - 2.0 * s) * b * (1.0 - b), b + (2.0 * s - 1.0) * (d - b), step(0.5, s));
}
void main() {
    vec4 B = texture2D(base, uv);
    vec4 S = texture2D(layer, uv) * opacity;
    vec3 b = B.a > 0.0 ? clamp(B.rgb / B.a, 0.0, 1.0) : vec3(0.0);
    vec3 s = S.a > 0.0 ? clamp(S.rgb / S.a, 0.0, 1.0) : vec3(0.0);
    gl_FragColor = vec4(S.rgb * (1.0 - B.a) + B.rgb * (1.0 - S.a) + S.a * B.a * clamp(blendMode(b, s), 0.0, 1.0), S.a + B.a - S.a * B.a);
}`;
// The Dither filter step by step (EffectFilter): grey noise added with feComposite arithmetic (k2 = 1, k3, k4, on
// premultiplied values, clamped), kept inside the picture's alpha, then each channel snapped to `levels` shades.
export const DITHER_FRAG = `${HIGHP}
varying vec2 uv;
uniform sampler2D base;
uniform sampler2D grain;
uniform vec2 res;
uniform float dpr;
uniform float k3;
uniform float k4;
uniform float levels;
void main() {
    vec4 S = texture2D(base, uv);
    vec2 css = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y) / dpr;
    float grey = texture2D(grain, css / ${GRAIN_TILE}.0).r;
    vec4 noisy = clamp(S + vec4(vec3(k3 * grey + k4), k3 + k4), 0.0, 1.0);
    noisy.rgb = min(noisy.rgb, noisy.a);
    vec4 kept = noisy * S.a;
    vec3 c = kept.a > 0.0 ? clamp(kept.rgb / kept.a, 0.0, 1.0) : vec3(0.0);
    gl_FragColor = vec4(min(floor(c * levels), levels - 1.0) / (levels - 1.0) * kept.a, kept.a);
}`;
// Pixelate: every block takes the color at its middle, blocks counted from the top left in CSS px.
export const PIXELATE_FRAG = `${HIGHP}
varying vec2 uv;
uniform sampler2D base;
uniform vec2 res;
uniform float dpr;
uniform float block;
void main() {
    vec2 css = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y) / dpr;
    vec2 mid = (floor(css / block) + 0.5) * block * dpr;
    gl_FragColor = texture2D(base, vec2(mid.x / res.x, 1.0 - mid.y / res.y));
}`;

interface GlProgram { p: WebGLProgram; u: (name: string) => WebGLUniformLocation | null }
export function glProgram(gl: WebGLRenderingContext, vert: string, frag: string): GlProgram | null {
    const p = gl.createProgram();
    if (!p) return null;
    for (const [type, src] of [[gl.VERTEX_SHADER, vert], [gl.FRAGMENT_SHADER, frag]] as const) {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        gl.attachShader(p, s);
        gl.deleteShader(s);
    }
    gl.bindAttribLocation(p, 0, 'a'); // every program reads the same full-screen triangle
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { gl.deleteProgram(p); return null; }
    const locs = new Map<string, WebGLUniformLocation | null>();
    return { p, u: (n) => { if (!locs.has(n)) locs.set(n, gl.getUniformLocation(p, n)); return locs.get(n) ?? null; } };
}

export function glTexture(gl: WebGLRenderingContext, filter: number, wrap: number = gl.CLAMP_TO_EDGE): WebGLTexture {
    const t = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    return t;
}

/** A texture to draw into. */
export interface Target { tex: WebGLTexture; fb: WebGLFramebuffer; w: number; h: number }
export function glTarget(gl: WebGLRenderingContext, filter: number): Target {
    const tex = glTexture(gl, filter);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fb, w: 1, h: 1 };
}
export function sizeTarget(gl: WebGLRenderingContext, t: Target, w: number, h: number) {
    if (t.w === w && t.h === h) return;
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    t.w = w;
    t.h = h;
}

// ── Dither grain, made once ──

let grain: Uint8Array | null = null;

/**
 * The Dither filter's noise: <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3"> made grey
 * by its <feColorMatrix>, worked out once with the Filter Effects spec's reference algorithm (stitched, so it tiles).
 * Checked against Chrome's own: the same mean and spread (126.2, 15.6).
 */
export function grainTile(): Uint8Array {
    if (grain) return grain;
    const size = GRAIN_TILE, BS = 0x100, BM = 0xff, PN = 0x1000;
    // Park-Miller generator, seeded as the spec does.
    const RM = 2147483647, RA = 16807, RQ = 127773, RR = 2836;
    let seed = 3;
    const random = () => {
        seed = RA * (seed % RQ) - RR * Math.floor(seed / RQ);
        if (seed <= 0) seed += RM;
        return seed;
    };
    const lattice = new Int32Array(BS + BS + 2);
    const grad = [0, 1, 2].map(() => new Float64Array((BS + BS + 2) * 2)); // R, G, B
    const alpha = new Float64Array((BS + BS + 2) * 2); // unused, but drawn so the random sequence stays the spec's
    for (const g of [...grad, alpha]) {
        for (let i = 0; i < BS; i++) {
            lattice[i] = i;
            const x = ((random() % (BS + BS)) - BS) / BS, y = ((random() % (BS + BS)) - BS) / BS;
            const m = Math.hypot(x, y) || 1;
            g[i * 2] = x / m;
            g[i * 2 + 1] = y / m;
        }
    }
    for (let i = BS - 1; i > 0; i--) {
        const j = random() % BS, k = lattice[i];
        lattice[i] = lattice[j];
        lattice[j] = k;
    }
    for (let i = 0; i < BS + 2; i++) {
        lattice[BS + i] = lattice[i];
        for (const g of grad) { g[(BS + i) * 2] = g[i * 2]; g[(BS + i) * 2 + 1] = g[i * 2 + 1]; }
    }
    // Stitching: the frequency is nudged so a whole number of lattice cells fits the tile, and the lattice wraps there.
    const lo = Math.floor(size * 0.9) / size, hi = Math.ceil(size * 0.9) / size;
    const freq = 0.9 / lo < hi / 0.9 ? lo : hi;
    const wrapN = Math.floor(size * freq + 0.5), wrapAt = PN + wrapN;
    const s = (v: number) => v * v * (3 - 2 * v);
    const noise = (g: Float64Array, vx: number, vy: number) => {
        let t = vx + PN;
        let bx0 = Math.trunc(t), bx1 = bx0 + 1;
        const rx0 = t - Math.trunc(t), rx1 = rx0 - 1;
        t = vy + PN;
        let by0 = Math.trunc(t), by1 = by0 + 1;
        const ry0 = t - Math.trunc(t), ry1 = ry0 - 1;
        if (bx0 >= wrapAt) bx0 -= wrapN;
        if (bx1 >= wrapAt) bx1 -= wrapN;
        if (by0 >= wrapAt) by0 -= wrapN;
        if (by1 >= wrapAt) by1 -= wrapN;
        bx0 &= BM; bx1 &= BM; by0 &= BM; by1 &= BM;
        const i = lattice[bx0], j = lattice[bx1];
        const b00 = lattice[i + by0] * 2, b10 = lattice[j + by0] * 2, b01 = lattice[i + by1] * 2, b11 = lattice[j + by1] * 2;
        const sx = s(rx0), sy = s(ry0);
        const u0 = rx0 * g[b00] + ry0 * g[b00 + 1], v0 = rx1 * g[b10] + ry0 * g[b10 + 1];
        const u1 = rx0 * g[b01] + ry1 * g[b01 + 1], v1 = rx1 * g[b11] + ry1 * g[b11 + 1];
        const a = u0 + sx * (v0 - u0), b = u1 + sx * (v1 - u1);
        return a + sy * (b - a);
    };
    const out = new Uint8Array(size * size);
    for (let y = 0, o = 0; y < size; y++) {
        for (let x = 0; x < size; x++, o++) {
            // fractalNoise: each channel is (noise + 1) / 2; the grey step then takes 0.33 of each.
            let sum = 0;
            for (const g of grad) sum += Math.min(1, Math.max(0, (noise(g, x * freq, y * freq) + 1) / 2));
            out[o] = Math.round(255 * 0.33 * sum);
        }
    }
    return (grain = out);
}
