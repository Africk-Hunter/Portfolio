import React from 'react';
// Layers drawn from CSS-like settings, on a canvas or as CSS styles.

import { type CSSProperties } from 'react';
import { BG_TYPE_BY_KEY, type BgLayer } from './types';
import { MathCanvas, SceneCanvas } from './canvasLayers';
import { paperSize, paperUrl } from './cssLayerDraw';
import { CausticsGL } from './caustics';
import { glSupported } from './glSupport';
import { type CanvasProps } from './frame';
import { SCENES } from './registry';

// ── CSS-only layers ──────────────────────────────────────────────────────────

function patternBackground(l: BgLayer): CSSProperties {
    const s = 10 + l.size * 6; // px (size 5 = the 40px Classic grid)
    const c = l.color;
    switch (l.kind) {
        case 'dots':
            return { backgroundImage: `radial-gradient(${c} ${Math.max(1, l.size / 2)}px, transparent ${Math.max(1, l.size / 2) + 0.5}px)`, backgroundSize: `${s}px ${s}px` };
        case 'stripes':
            return { backgroundImage: `repeating-linear-gradient(${l.angle}deg, ${c} 0 ${s / 3}px, transparent ${s / 3}px ${s}px)` };
        case 'checker':
            return { backgroundImage: `conic-gradient(${c} 25%, transparent 0 50%, ${c} 0 75%, transparent 0)`, backgroundSize: `${s * 2}px ${s * 2}px` };
        case 'triangles': // three sets of lines, 60 degrees apart
            return { backgroundImage: [0, 60, 120].map((a) => `repeating-linear-gradient(${a}deg, ${c} 0 1px, transparent 1px ${s}px)`).join(', ') };
        case 'zigzag':
            return {
                backgroundImage: `linear-gradient(135deg, ${c} 25%, transparent 25%), linear-gradient(225deg, ${c} 25%, transparent 25%), linear-gradient(315deg, ${c} 25%, transparent 25%), linear-gradient(45deg, ${c} 25%, transparent 25%)`,
                backgroundSize: `${s}px ${s}px`,
                backgroundPosition: `${-s / 2}px 0, ${-s / 2}px 0, 0 0, 0 0`,
            };
        case 'rings':
            return { backgroundImage: `repeating-radial-gradient(circle at 50% 50%, ${c} 0 2px, transparent 2px ${s}px)` };
        case 'burst':
            return { backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, ${c} 0 1deg, transparent 1deg ${4 + l.size * 2}deg)` };
        default: // grid
            return { backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(to right, ${c} 1px, transparent 1px)`, backgroundSize: `${s}px ${s}px` };
    }
}

function gradientBackground(l: BgLayer): CSSProperties {
    const stops = `${l.color}, ${l.color2}, ${l.color3}`;
    const image = l.kind === 'radial' ? `radial-gradient(circle at 50% 40%, ${stops})`
        : l.kind === 'conic' ? `conic-gradient(from ${l.angle}deg at 50% 50%, ${l.color}, ${l.color2}, ${l.color3}, ${l.color})`
            : `linear-gradient(${l.angle}deg, ${stops})`;
    return { backgroundImage: image };
}

/**
 * Paper, woven canvas or corrugated board as a tiling SVG: a flat tint plus noise that is stretched
 * along one or both axes for fibres and threads. The layer multiplies onto what is below, so it only darkens.
 */
function paperBackground(l: BgLayer): CSSProperties {
    return { backgroundImage: `url("${paperUrl(l)}")`, backgroundSize: `${paperSize(l)}px` };
}
/** Each style's own blend (see BgTypeDef.blend): Scanlines and Vignette darken what is below, lights add to it. */
export function LayerView({ layer, lite, clock, paused }: CanvasProps) {
    const style: CSSProperties = { opacity: layer.opacity / 100, mixBlendMode: BG_TYPE_BY_KEY[layer.type].blend };
    if (layer.type === 'gradient') return <div className="tbg" style={{ ...style, ...gradientBackground(layer) }} />;
    if (layer.type === 'pattern') return <div className="tbg" style={{ ...style, ...patternBackground(layer) }} />;
    if (layer.type === 'scanlines') return <div className="tbg" style={{ ...style, backgroundImage: `repeating-linear-gradient(0deg, ${layer.color} 0 1px, transparent 1px ${2 + layer.size * 1.2}px)` }} />;
    if (layer.type === 'paper') return <div className="tbg" style={{ ...style, ...paperBackground(layer) }} />;
    if (layer.type === 'vignette') return <div className="tbg" style={{ ...style, backgroundImage: `radial-gradient(ellipse at center, transparent ${Math.max(0, 85 - layer.size * 7)}%, ${layer.color} 100%)` }} />;
    return (
        <div className="tbg" style={style}>
            {SCENES[layer.type]
                ? <SceneCanvas layer={layer} lite={lite} clock={clock} paused={paused} />
                : layer.type === 'caustics' && glSupported()
                    ? <CausticsGL layer={layer} lite={lite} clock={clock} paused={paused} />
                    : <MathCanvas layer={layer} lite={lite} clock={clock} paused={paused} />}
        </div>
    );
}
