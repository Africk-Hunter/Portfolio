// How many layers the GPU path draws.

import { BG_TYPE_BY_KEY, type BgLayer } from './types';
import { conicOk, GPU_FX, moves } from './cssLayerDraw';
import { REDUCED } from './frame';
import { glSupported } from './glSupport';

/**
 * How many of the layers (from the bottom) GpuEffects should draw: up to and including the top effect, when every
 * effect there is one it can draw and something under it moves; else 0. A still picture is filtered once, so the SVG
 * filter is fine there, and previews of still themes don't each take a WebGL context.
 */
export function gpuEffectCount(layers: BgLayer[]): number {
    let end = -1;
    layers.forEach((l, i) => { if (BG_TYPE_BY_KEY[l.type].effect) end = i; });
    if (end < 0) return 0;
    const range = layers.slice(0, end + 1);
    if (range.some((l) => BG_TYPE_BY_KEY[l.type].effect && !GPU_FX.has(l.type))) return 0;
    if (REDUCED() || !range.some(moves) || !glSupported()) return 0;
    if (range.some((l) => l.type === 'gradient' && l.kind === 'conic') && !conicOk()) return 0;
    return end + 1;
}
