import React from 'react';
// Portable procedural background. Copy this folder into a React 18/19 + TypeScript project and import it:
//
//   import { Background, newLayer } from './background';
//   import './background/background.css';
//   <Background layers={[{ ...newLayer('plasma'), color: '#1b2a49', opacity: 100 }]} />
//
// Layers are drawn bottom first. An effect layer (dither, vhs) filters everything drawn below it.

import { useCallback, useId, useMemo, useState, type ReactNode } from 'react';
import { BG_TYPE_BY_KEY, type BgLayer } from './types';
import { LayerView } from './cssLayers';
import { EffectFilter, VhsScreen } from './effects';
import { svgId } from './svgFormat';
import { FrameClock } from './frame';
import { gpuEffectCount } from './gpuEffectCount';
import { GpuEffects } from './gpuEffects';

export { BG_TYPES, BG_TYPE_BY_KEY, KIND_OPTIONS, LAYER_RANGE_OVERRIDE, MAX_BG_LAYERS, newLayer, type BgLayer, type BgType, type BgTypeDef } from './types';
export { PRESETS } from './presets';
export * from './layers';

function LayerStack({ layers, lite, uid, paused }: { layers: BgLayer[]; lite?: boolean; uid: string; paused?: boolean }) {
    // Layers an effect re-filters whenever they change share one clock (see FrameClock).
    const fxClock = useState(() => new FrameClock())[0];
    const [gpuFailed, setGpuFailed] = useState(false);
    const failGpu = useCallback(() => setGpuFailed(true), []);
    const gpuCount = gpuFailed ? 0 : gpuEffectCount(layers);
    const gpuLayers = useMemo(() => layers.slice(0, gpuCount), [layers, gpuCount]);
    if (gpuCount > 0) {
        return (
            <>
                <div className="tbg"><GpuEffects layers={gpuLayers} lite={lite} paused={paused} onFail={failGpu} /></div>
                {layers.slice(gpuCount).map((l) => <LayerView key={l.id} layer={l} lite={lite} paused={paused} />)}
            </>
        );
    }

    // No GPU path: an SVG filter wraps everything drawn so far.
    const effects = layers.filter((l) => BG_TYPE_BY_KEY[l.type].effect && l.type !== 'vhs');
    const fxId = (l: BgLayer) => `fx-${uid}-${svgId(l.id)}`;
    let lastFx = -1;
    layers.forEach((l, i) => { if (BG_TYPE_BY_KEY[l.type].effect) lastFx = i; });
    let drawn: ReactNode[] = [];
    for (const [i, l] of layers.entries()) {
        if (!BG_TYPE_BY_KEY[l.type].effect) {
            drawn.push(<LayerView key={l.id} layer={l} lite={lite} paused={paused} clock={i < lastFx ? fxClock : undefined} />);
            continue;
        }
        if (!drawn.length) continue;
        if (l.type === 'vhs') { drawn = [<VhsScreen key={l.id} layer={l}>{drawn}</VhsScreen>]; continue; }
        drawn = [<div key={l.id} className="tbg" style={{ filter: `url(#${fxId(l)})` }}>{drawn}</div>];
    }
    return (
        <>
            {effects.length > 0 && (
                <svg className="tbg-defs" width="0" height="0" aria-hidden="true">
                    <defs>{effects.map((l) => <EffectFilter key={l.id} id={fxId(l)} layer={l} />)}</defs>
                </svg>
            )}
            {drawn}
        </>
    );
}

export interface BackgroundProps {
    layers: BgLayer[];
    /** Fill the parent (which needs position: relative or absolute) instead of the whole page. */
    contained?: boolean;
    /** Lower resolution and 20 fps, for phones. */
    lite?: boolean;
    /** Stop animating (e.g. while something opaque covers it). */
    paused?: boolean;
}

export function Background({ layers, contained, lite, paused }: BackgroundProps) {
    const uid = svgId(useId());
    return (
        <div className={`tbg-stack${contained ? ' tbg-stack--contained' : ''}`} aria-hidden="true">
            <LayerStack layers={layers} lite={lite} uid={uid} paused={paused} />
        </div>
    );
}

export default Background;
