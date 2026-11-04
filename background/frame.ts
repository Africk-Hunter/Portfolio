// Shared frame clock and per-layer timing for the animated canvases.

import { type BgLayer } from './types';

// ── Canvas layer ─────────────────────────────────────────────────────────────

export const REDUCED = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Slider speed N advances animation time at N / SPEED_DIVISOR per second. Applies to every layer,
// including saved themes, since most presets already sit at the slider's slowest non-zero step (1).
export const SPEED_DIVISOR = 5;
// Each layer's animation phase, written every frame by whichever copy is running, so a copy that mounts later
// (the mind map's, or the page's after a slider restarts the loop) carries on from it instead of jumping.
export const timeOf = new Map<string, number>();
/** Layers whose smooth look runs near the display's rate (spinning edges stutter at low rates); capped at about 60 fps. */
export const SMOOTH = new Set<BgLayer['type']>(['shapes']);
export const SMOOTH_MS = 1000 / 60;

/** lite: for phones and busy pages. Shaders render smaller and every layer runs at a lower frame rate. */
export const LITE_SCALE = 0.65;
export const LITE_MS = 1000 / 20;

// ── Frame clock ──────────────────────────────────────────────────────────────

/**
 * Decides which frames a layer draws on. A clock runs at the slowest rate any of its layers asks for. Layers
 * under an effect share one, so they all change in the same frame and the effect's filter (which re-runs
 * whenever anything under it changes) runs once per frame instead of once per layer.
 */
export class FrameClock {
    private last = 0;
    private at = -1;
    private due = false;
    private wants = new Map<object, number>();
    private ms = 0;
    /** Time since the previous drawn frame, ms. */
    dt = 0;
    want(who: object, ms: number) { this.wants.set(who, ms); this.ms = Math.max(0, ...this.wants.values()); }
    drop(who: object) { this.wants.delete(who); this.ms = Math.max(0, ...this.wants.values()); }
    /** Whether the frame at `now` is one to draw: the same answer for every layer asking at the same `now`. */
    tick(now: number): boolean {
        if (now !== this.at) {
            this.at = now;
            // A few ms of slack: frames arrive with jitter, and a frame 1 ms early must not wait a whole extra frame.
            this.due = now - this.last >= this.ms - 3;
            if (this.due) { this.dt = this.last ? now - this.last : this.ms || 16; this.last = now; }
        }
        return this.due;
    }
}

// One requestAnimationFrame loop for every layer on the page, instead of one each.
const jobs = new Set<(now: number) => void>();
let loopRaf = 0;
function loop(now: number) {
    loopRaf = jobs.size ? requestAnimationFrame(loop) : 0;
    for (const job of jobs) job(now);
}
export function animate(job: (now: number) => void): () => void {
    jobs.add(job);
    loopRaf ||= requestAnimationFrame(loop);
    return () => { jobs.delete(job); };
}

/** Tracks whether an element is on screen (a preview scrolled out of view stops drawing). */
export function watchOnScreen(el: Element): { on: boolean; stop: () => void } {
    const state = { on: true, stop: () => {} };
    if (typeof IntersectionObserver !== 'function') return state;
    const io = new IntersectionObserver((entries) => { state.on = entries[entries.length - 1].isIntersecting; });
    io.observe(el);
    state.stop = () => io.disconnect();
    return state;
}

export interface CanvasProps {
    layer: BgLayer;
    lite?: boolean;
    /** Shared with the other layers under the same effect; a layer without one keeps its own. */
    clock?: FrameClock;
    /** Drawn once and held: the page background while something opaque covers it. */
    paused?: boolean;
}
