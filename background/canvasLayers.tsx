import React from 'react';
// Canvas components that run a painter or a baked scene.

import { useEffect, useRef } from 'react';
import { canvasRenderer, isCrisp, sceneRun, speedOf } from './canvasRun';
import { animate, type CanvasProps, FrameClock, REDUCED, timeOf, watchOnScreen } from './frame';
import { SCENES } from './registry';

export function MathCanvas({ layer, lite, clock, paused }: CanvasProps) {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = ref.current;
        const box = canvas?.parentElement;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !box || !ctx) return;

        const r = canvasRenderer(layer, lite);
        const own = clock ?? new FrameClock();
        const me = {};
        let t = timeOf.get(layer.id) ?? 0;
        const draw = () => {
            r.fit(canvas, Math.max(1, box.clientWidth), Math.max(1, box.clientHeight));
            own.want(me, r.draw(ctx, t));
        };
        own.want(me, r.baseMs);
        const speed = speedOf(layer);
        const screen = watchOnScreen(canvas);

        draw();
        const still = layer.speed === 0 || REDUCED();
        const stop = still || paused ? null : animate((now) => {
            if (!screen.on || !own.tick(now)) return;
            t += (own.dt / 1000) * speed;
            timeOf.set(layer.id, t);
            draw();
        });
        const ro = new ResizeObserver(() => draw());
        ro.observe(box);

        return () => {
            // A still copy (the editor's preview) reads the running phase but must not reset it.
            if (stop) timeOf.set(layer.id, t);
            stop?.();
            own.drop(me);
            screen.stop();
            ro.disconnect();
        };
    }, [layer, lite, clock, paused]);

    return <canvas ref={ref} className={isCrisp(layer) ? 'tbg-canvas tbg-canvas--crisp' : 'tbg-canvas'} />;
}

/** A scene on the page: the still picture on one canvas, what moves on a transparent one over it (see sceneRun). */
export function SceneCanvas({ layer, lite, clock, paused }: CanvasProps) {
    const stillRef = useRef<HTMLCanvasElement>(null);
    const moveRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const sc = stillRef.current, mc = moveRef.current, box = sc?.parentElement;
        const sctx = sc?.getContext('2d'), mctx = mc?.getContext('2d');
        const scene = SCENES[layer.type];
        if (!sc || !mc || !box || !sctx || !mctx || !scene) return;

        const run = sceneRun(scene, layer, lite);
        const own = clock ?? new FrameClock();
        const me = {};
        let t = timeOf.get(layer.id) ?? 0;
        const draw = (force: boolean) => {
            if (run.fit(Math.max(1, box.clientWidth), Math.max(1, box.clientHeight))) {
                force = true;
                // Whole cells: the canvases run a little past the box (it clips them) so a cell is never stretched.
                for (const c of [sc, mc]) {
                    c.width = run.w; c.height = run.h;
                    c.style.width = `${run.w * run.px}px`; c.style.height = `${run.h * run.px}px`;
                }
                const img = run.still();
                if (img) sctx.drawImage(img, 0, 0);
            }
            const started = performance.now();
            run.moving(mctx, t, force);
            own.want(me, run.next(performance.now() - started));
        };
        own.want(me, run.baseMs);
        const speed = speedOf(layer);
        const screen = watchOnScreen(sc);

        draw(true);
        const still = layer.speed === 0 || REDUCED();
        const stop = still || paused ? null : animate((now) => {
            if (!screen.on || !own.tick(now)) return;
            t += (own.dt / 1000) * speed;
            timeOf.set(layer.id, t);
            draw(false);
        });
        const ro = new ResizeObserver(() => draw(false));
        ro.observe(box);

        return () => {
            stop?.();
            own.drop(me);
            screen.stop();
            ro.disconnect();
        };
    }, [layer, lite, clock, paused]);

    const cls = `tbg-canvas tbg-canvas--scene${layer.kind === 'dithered' ? ' tbg-canvas--crisp' : ''}`;
    return (
        <>
            <canvas ref={stillRef} className={cls} />
            <canvas ref={moveRef} className={cls} />
        </>
    );
}
