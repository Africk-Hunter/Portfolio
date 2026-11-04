import React from 'react';
// Caustics drawn on the GPU.

import { useEffect, useRef } from 'react';
import { animate, type CanvasProps, FrameClock, LITE_MS, REDUCED, SPEED_DIVISOR, timeOf, watchOnScreen } from './frame';
import { hexToRgb } from './shared';

// ── Caustics on the GPU ──────────────────────────────────────────────────────
// The same recipe as the `caustics` shader above, as a fragment shader: it runs per pixel on the GPU, so it can
// fill the screen at near full resolution (sharp lines) for almost no CPU. The CPU version is the fallback.

export const CAUSTICS_VERT = 'attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }';
export const CAUSTICS_FRAG = `
precision highp float;
uniform vec2 res;
uniform float t;
uniform float sc;
uniform vec3 c1;
uniform vec3 c2;
uniform float dith;
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
void main() {
    vec2 p = gl_FragCoord.xy / res.x * sc * 6.28318 - 250.0;
    vec2 i = p;
    float c = 1.0;
    for (int n = 0; n < 5; n++) {
        float tt = t * (1.0 - 3.5 / float(n + 1));
        i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / 0.005), p.y / (cos(i.y + tt) / 0.005)));
    }
    c = 1.17 - pow(c / 5.0, 1.4);
    float v = clamp(pow(abs(c), 8.0), 0.0, 1.0);
    vec3 col = mix(c1, c2, v);
    if (dith > 0.5) { // ordered dither: 4 shades per channel, alpha on or off (one canvas pixel is one chunky cell)
        float th = bayer4(gl_FragCoord.xy) + 0.03;
        vec3 q = col * 3.0;
        vec3 lo = floor(q);
        col = (lo + step(vec3(th), q - lo)) / 3.0;
        v = step(th, v);
    }
    gl_FragColor = vec4(col * v, v); // premultiplied alpha
}`;

export const CAUSTICS_MS = 1000 / 30;

export function CausticsGL({ layer, lite, clock, paused }: CanvasProps) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const box = canvas?.parentElement;
        const gl = canvas?.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
        if (!canvas || !box || !gl) return;

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        };
        const prog = gl.createProgram()!;
        const vs = compile(gl.VERTEX_SHADER, CAUSTICS_VERT), fs = compile(gl.FRAGMENT_SHADER, CAUSTICS_FRAG);
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);
        // One triangle that covers the whole canvas.
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'a');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const u = (n: string) => gl.getUniformLocation(prog, n);
        const [uRes, uT, uSc, uC1, uC2, uDith] = [u('res'), u('t'), u('sc'), u('c1'), u('c2'), u('dith')];
        const dithered = layer.kind === 'dithered';
        gl.uniform1f(uDith, dithered ? 1 : 0);
        const c1 = hexToRgb(layer.color).map((v) => v / 255), c2 = hexToRgb(layer.color2).map((v) => v / 255);
        gl.uniform1f(uSc, 1 + (11 - layer.size) * 0.35);
        gl.uniform3f(uC1, c1[0], c1[1], c1[2]);
        gl.uniform3f(uC2, c2[0], c2[1], c2[2]);

        // Smooth upscaling hides the slightly lower render size; lite mode (phones) renders smaller still.
        // Dithered: one canvas pixel is one 3px cell (4px on a phone), shown with hard edges, so it is also far fewer pixels.
        const scale = dithered ? 1 / (lite ? 4 : 3) : lite ? 0.5 : 0.8;
        let t = timeOf.get(layer.id) ?? 0;
        // Capped like the CPU shaders: the GPU work is small, but every frame also re-composites the page and
        // re-runs any effect above this layer.
        const own = clock ?? new FrameClock();
        const me = {};
        own.want(me, lite ? LITE_MS : CAUSTICS_MS);
        const screen = watchOnScreen(canvas);
        const draw = () => {
            const w = Math.max(1, Math.round(box.clientWidth * scale)), h = Math.max(1, Math.round(box.clientHeight * scale));
            if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
            gl.viewport(0, 0, w, h);
            gl.uniform2f(uRes, w, h);
            gl.uniform1f(uT, t);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        draw();
        const still = layer.speed === 0 || REDUCED();
        const stop = still || paused ? null : animate((now) => {
            if (!screen.on || !own.tick(now)) return;
            t += (own.dt / 1000) * (Math.min(10, layer.speed) / SPEED_DIVISOR);
            timeOf.set(layer.id, t);
            draw();
        });
        const ro = new ResizeObserver(() => draw());
        ro.observe(box);

        return () => {
            if (stop) timeOf.set(layer.id, t);
            stop?.();
            own.drop(me);
            screen.stop();
            ro.disconnect();
            gl.deleteProgram(prog);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            gl.deleteBuffer(buf);
        };
    }, [layer, lite, clock, paused]);

    return <canvas ref={ref} className={layer.kind === 'dithered' ? 'tbg-canvas tbg-canvas--crisp' : 'tbg-canvas'} />;
}
