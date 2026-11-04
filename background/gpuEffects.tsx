import React from 'react';
// Dither and pixelate effects run on the GPU over the layers below them.

import { useEffect, useRef, useState } from 'react';
import { BG_TYPE_BY_KEY, type BgLayer } from './types';
import { canvasRenderer, isCrisp, sceneRun, speedOf } from './canvasRun';
import { CAUSTICS_FRAG, CAUSTICS_MS, CAUSTICS_VERT } from './caustics';
import { BLEND_MODES, CSS_TYPES, drawCssLayer, moves } from './cssLayerDraw';
import { f2 } from './svgFormat';
import { animate, FrameClock, LITE_MS, timeOf, watchOnScreen } from './frame';
import { BLEND_FRAG, COPY_FRAG, DITHER_FRAG, glProgram, glTarget, glTexture, GRAIN_TILE, grainTile, PIXELATE_FRAG, QUAD_VERT, sizeTarget, type Target } from './glFx';
import { SCENES } from './registry';
import { SHADERS } from './shaders';
import { hexToRgb } from './shared';

/** One layer as GpuEffects draws it: a texture, redrawn on resize and, if it moves, on its own clock. */
interface GpuLayer {
    layer: BgLayer;
    tex: WebGLTexture;
    /** Redraws it for the current size and time (`force` after a resize); false when nothing changed, so nothing was uploaded. */
    draw: (force?: boolean) => boolean | void;
    t: number;
    clock: FrameClock;
}

/** The layers up to and including the top effect, drawn as one WebGL canvas (see "Effects on the GPU"). */
export function GpuEffects({ layers, lite, paused, onFail }: { layers: BgLayer[]; lite?: boolean; paused?: boolean; onFail: () => void }) {
    const ref = useRef<HTMLCanvasElement>(null);
    const [gen, setGen] = useState(0); // bumped when a lost GPU context comes back

    useEffect(() => {
        const canvas = ref.current;
        const box = canvas?.parentElement;
        const gl = canvas?.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
        if (!canvas || !box || !gl) { onFail(); return; }
        const fail = () => { dead = true; onFail(); };
        let dead = false;

        const copy = glProgram(gl, QUAD_VERT, COPY_FRAG), blend = glProgram(gl, QUAD_VERT, BLEND_FRAG);
        const dither = layers.some((l) => l.type === 'dither') ? glProgram(gl, QUAD_VERT, DITHER_FRAG) : null;
        const pixelate = layers.some((l) => l.type === 'pixelate') ? glProgram(gl, QUAD_VERT, PIXELATE_FRAG) : null;
        const caustics = layers.some((l) => l.type === 'caustics') ? glProgram(gl, CAUSTICS_VERT, CAUSTICS_FRAG) : null;
        if (!copy || !blend || (!dither && layers.some((l) => l.type === 'dither')) || (!pixelate && layers.some((l) => l.type === 'pixelate'))) { fail(); return; }

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        // Canvas uploads land the way framebuffers are laid out (bottom row first) and premultiplied, like everything else here.
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        let grainTex: WebGLTexture | null = null;
        if (dither) {
            grainTex = glTexture(gl, gl.LINEAR, gl.REPEAT);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, GRAIN_TILE, GRAIN_TILE, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, grainTile());
        }
        // What is drawn so far, and the next step's output.
        let src = glTarget(gl, gl.NEAREST), dst = glTarget(gl, gl.NEAREST);
        const targets: Target[] = [src, dst];

        // Keeps the picture sharp; phones render a little smaller (the grain is per CSS px either way).
        const dpr = Math.min(lite ? 1.5 : 2, window.devicePixelRatio || 1);
        let w = 1, h = 1;
        const upload = (tex: WebGLTexture, from: HTMLCanvasElement) => {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, from);
        };

        const items: (GpuLayer | { fx: BgLayer })[] = [];
        const animated: GpuLayer[] = [];
        for (const l of layers) {
            if (BG_TYPE_BY_KEY[l.type].effect) { items.push({ fx: l }); continue; }
            const item: GpuLayer = { layer: l, tex: null!, draw: () => {}, t: timeOf.get(l.id) ?? 0, clock: new FrameClock() };
            if (CSS_TYPES.has(l.type)) {
                item.tex = glTexture(gl, gl.LINEAR);
                item.draw = () => {
                    const c = document.createElement('canvas');
                    c.width = Math.max(1, Math.round(w * dpr));
                    c.height = Math.max(1, Math.round(h * dpr));
                    const ctx = c.getContext('2d');
                    if (!ctx) return;
                    ctx.scale(c.width / w, c.height / h);
                    drawCssLayer(ctx, l, w, h, dpr, () => { if (!dead) { item.draw(); composite(); } });
                    upload(item.tex, c);
                };
            } else if (l.type === 'caustics' && caustics) {
                // Rendered straight into a texture, the size CausticsGL would use.
                const dithered = l.kind === 'dithered';
                const tgt = glTarget(gl, dithered ? gl.NEAREST : gl.LINEAR);
                targets.push(tgt);
                item.tex = tgt.tex;
                const scale = dithered ? 1 / (lite ? 4 : 3) : lite ? 0.5 : 0.8;
                const [c1, c2] = [hexToRgb(l.color), hexToRgb(l.color2)].map((c) => c.map((v) => v / 255));
                item.clock.want(item, lite ? LITE_MS : CAUSTICS_MS);
                item.draw = () => {
                    sizeTarget(gl, tgt, Math.max(1, Math.round(w * scale)), Math.max(1, Math.round(h * scale)));
                    gl.bindFramebuffer(gl.FRAMEBUFFER, tgt.fb);
                    gl.viewport(0, 0, tgt.w, tgt.h);
                    gl.useProgram(caustics.p);
                    gl.uniform2f(caustics.u('res'), tgt.w, tgt.h);
                    gl.uniform1f(caustics.u('t'), item.t);
                    gl.uniform1f(caustics.u('sc'), 1 + (11 - l.size) * 0.35);
                    gl.uniform3f(caustics.u('c1'), c1[0], c1[1], c1[2]);
                    gl.uniform3f(caustics.u('c2'), c2[0], c2[1], c2[2]);
                    gl.uniform1f(caustics.u('dith'), dithered ? 1 : 0);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLES, 0, 3);
                };
            } else if (SCENES[l.type]) {
                // Still picture and moving parts on one canvas (the still one is copied under each changed frame).
                const run = sceneRun(SCENES[l.type]!, l, lite);
                const c = document.createElement('canvas');
                const ctx = c.getContext('2d');
                if (!ctx) { fail(); return; }
                item.tex = glTexture(gl, l.kind === 'dithered' ? gl.NEAREST : gl.LINEAR);
                item.clock.want(item, run.baseMs);
                item.draw = (force) => {
                    if (run.fit(w, h)) { force = true; c.width = run.w; c.height = run.h; }
                    const started = performance.now();
                    if (!run.moving(ctx, item.t, !!force, run.still())) return false;
                    upload(item.tex, c);
                    item.clock.want(item, run.next(performance.now() - started));
                };
            } else {
                const r = canvasRenderer(l, lite);
                const c = document.createElement('canvas');
                const ctx = c.getContext('2d', { willReadFrequently: !!SHADERS[l.type] });
                if (!ctx) { fail(); return; }
                item.tex = glTexture(gl, isCrisp(l) ? gl.NEAREST : gl.LINEAR);
                item.clock.want(item, r.baseMs);
                item.draw = () => {
                    r.fit(c, w, h);
                    const started = performance.now();
                    const next = r.draw(ctx, item.t);
                    upload(item.tex, c);
                    // The upload is part of what this layer costs.
                    item.clock.want(item, Math.max(next, Math.min(250, (performance.now() - started) * 10)));
                };
            }
            items.push(item);
            if (moves(l) && !paused) animated.push(item);
        }

        const composite = () => {
            const W = canvas.width, H = canvas.height;
            gl.bindFramebuffer(gl.FRAMEBUFFER, src.fb);
            gl.viewport(0, 0, W, H);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            for (const it of items) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb);
                gl.viewport(0, 0, W, H);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, src.tex);
                if ('fx' in it) {
                    const l = it.fx;
                    if (l.type === 'dither' && dither) {
                        const n = 2 + l.density, g = (l.size * 0.8) / n;
                        gl.useProgram(dither.p);
                        gl.uniform1i(dither.u('base'), 0);
                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, grainTex);
                        gl.uniform1i(dither.u('grain'), 1);
                        gl.uniform2f(dither.u('res'), W, H);
                        gl.uniform1f(dither.u('dpr'), W / w);
                        gl.uniform1f(dither.u('k3'), Number(f2(g)));
                        gl.uniform1f(dither.u('k4'), Number(f2(-g / 2)));
                        gl.uniform1f(dither.u('levels'), n);
                    } else if (pixelate) {
                        gl.useProgram(pixelate.p);
                        gl.uniform1i(pixelate.u('base'), 0);
                        gl.uniform2f(pixelate.u('res'), W, H);
                        gl.uniform1f(pixelate.u('dpr'), W / w);
                        gl.uniform1f(pixelate.u('block'), Math.round(3 + l.size * 3));
                    }
                } else {
                    gl.useProgram(blend.p);
                    gl.uniform1i(blend.u('base'), 0);
                    gl.activeTexture(gl.TEXTURE1);
                    gl.bindTexture(gl.TEXTURE_2D, it.tex);
                    gl.uniform1i(blend.u('layer'), 1);
                    gl.uniform1f(blend.u('mode'), Math.max(0, BLEND_MODES.indexOf(BG_TYPE_BY_KEY[it.layer.type].blend ?? 'normal')));
                    gl.uniform1f(blend.u('opacity'), it.layer.opacity / 100);
                }
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                [src, dst] = [dst, src];
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, W, H);
            gl.useProgram(copy.p);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, src.tex);
            gl.uniform1i(copy.u('base'), 0);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const fit = () => {
            const bw = Math.max(1, box.clientWidth), bh = Math.max(1, box.clientHeight);
            if (bw === w && bh === h && canvas.width > 1) return;
            w = bw;
            h = bh;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            for (const t of [src, dst]) sizeTarget(gl, t, canvas.width, canvas.height);
            for (const it of items) if (!('fx' in it)) it.draw(true);
            composite();
        };
        // A failure part-way (an image the browser won't hand to WebGL, a lost context) falls back to the SVG filters.
        const guard = (fn: () => void) => { if (dead) return; try { fn(); } catch { fail(); } };

        const onLost = (e: Event) => { e.preventDefault(); dead = true; };
        const onRestored = () => setGen((g) => g + 1);
        canvas.addEventListener('webglcontextlost', onLost);
        canvas.addEventListener('webglcontextrestored', onRestored);

        const screen = watchOnScreen(canvas);
        guard(fit);
        const stop = animated.length ? animate((now) => guard(() => {
            if (!screen.on) return;
            let changed = false;
            for (const it of animated) {
                if (!it.clock.tick(now)) continue;
                it.t += (it.clock.dt / 1000) * speedOf(it.layer);
                timeOf.set(it.layer.id, it.t);
                if (it.draw() !== false) changed = true;
            }
            if (changed) composite();
        })) : null;
        const ro = new ResizeObserver(() => guard(fit));
        ro.observe(box);

        return () => {
            for (const it of animated) timeOf.set(it.layer.id, it.t);
            stop?.();
            screen.stop();
            ro.disconnect();
            canvas.removeEventListener('webglcontextlost', onLost);
            canvas.removeEventListener('webglcontextrestored', onRestored);
            dead = true;
            for (const p of [copy, blend, dither, pixelate, caustics]) if (p) gl.deleteProgram(p.p);
            for (const it of items) if (!('fx' in it) && !targets.some((t) => t.tex === it.tex)) gl.deleteTexture(it.tex);
            for (const t of targets) { gl.deleteFramebuffer(t.fb); gl.deleteTexture(t.tex); }
            if (grainTex) gl.deleteTexture(grainTex);
            gl.deleteBuffer(buf);
        };
    }, [layers, lite, paused, gen, onFail]);

    return <canvas ref={ref} className="tbg-canvas" />;
}
