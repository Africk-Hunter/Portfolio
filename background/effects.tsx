import React from 'react';
// SVG-filter effects and the VHS screen.

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { VHS_MAX_BULGE, type BgLayer } from './types';
import { f2, svgId } from './svgFormat';

// ── Effects: SVG filters on everything drawn below them ─────────────────────

/** The <filter> for an effect layer. Sizes are CSS pixels (a filter on an HTML element works in user units). */
export function EffectFilter({ id, layer: l }: { id: string; layer: BgLayer }) {
    const common = { id, x: '0', y: '0', width: '1', height: '1', colorInterpolationFilters: 'sRGB' as const };
    switch (l.type) {
        case 'pixelate': {
            // One tiny square at the center of a block-sized tile, repeated, then grown back to fill each block with the color under its middle.
            const b = Math.round(3 + l.size * 3);
            return (
                <filter {...common}>
                    <feFlood x={b / 2 - 1} y={b / 2 - 1} width="2" height="2" />
                    <feComposite x="0" y="0" width={b} height={b} />
                    <feTile result="grid" />
                    <feComposite in="SourceGraphic" in2="grid" operator="in" />
                    <feMorphology operator="dilate" radius={b / 2} />
                </filter>
            );
        }
        default: { // dither
            // Grey noise is added to the picture, then each channel snaps to a few shades: the noise decides which side of a step a pixel lands on.
            const n = 2 + l.density;
            const g = (l.size * 0.8) / n;
            const steps = Array.from({ length: n }, (_, i) => f2(i / (n - 1))).join(' ');
            // Live noise, not a pre-made grain image: an feImage + feTile grain measured 4x slower in Firefox.
            return (
                <filter {...common}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="noise" />
                    <feColorMatrix in="noise" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="grey" />
                    <feComposite in="SourceGraphic" in2="grey" operator="arithmetic" k1="0" k2="1" k3={f2(g)} k4={f2(-g / 2)} result="noisy" />
                    <feComposite in="noisy" in2="SourceAlpha" operator="in" result="kept" />
                    <feComponentTransfer in="kept">
                        <feFuncR type="discrete" tableValues={steps} />
                        <feFuncG type="discrete" tableValues={steps} />
                        <feFuncB type="discrete" tableValues={steps} />
                    </feComponentTransfer>
                </filter>
            );
        }
    }
}

// ── VHS: worn tape on a bulging tube ─────────────────────────────────────────

let vhsMap = '';
/**
 * Displacement map for the bulge, drawn once at 64x64 and stretched by the filter. A pixel at (ux, uy), each
 * -1 to 1 from the center, is told to read the picture at p * (1 + k (r^2 - 2)): the middle is magnified, the
 * corners read themselves, and nothing is read from outside the picture, so there is no border. Red and green hold
 * the x and y offsets (0.5 = none); k and the picture's size are applied later through the filter's scale.
 */
function vhsMapUrl(): string {
    if (vhsMap) return vhsMap;
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    if (!ctx) return '';
    const img = ctx.createImageData(64, 64);
    for (let j = 0; j < 64; j++) {
        for (let i = 0; i < 64; i++) {
            const ux = ((i + 0.5) / 64) * 2 - 1, uy = ((j + 0.5) / 64) * 2 - 1, f = ux * ux + uy * uy - 2, o = (j * 64 + i) * 4;
            img.data[o] = 255 * (0.5 + 0.5 * ux * f);
            img.data[o + 1] = 255 * (0.5 + 0.5 * uy * f);
            img.data[o + 2] = 128;
            img.data[o + 3] = 255;
        }
    }
    ctx.putImageData(img, 0, 0);
    return (vhsMap = c.toDataURL());
}

/**
 * Everything below it as a tape on a tube monitor. Color bleed pushes red and blue apart; the Screen choice adds the
 * bulge (a displacement filter whose scale follows this box's size, so it has its own filter). The scanlines, tracking
 * bar and noise are plain elements that animate with transforms only. Flat skips the displacement entirely.
 */
export function VhsScreen({ layer: l, over, children }: { layer: BgLayer; over?: boolean; children?: ReactNode }) {
    const id = `vhs-${svgId(useId())}`;
    const ref = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState({ w: 0, h: 0 });
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const measure = () => setBox((b) => (b.w === el.clientWidth && b.h === el.clientHeight ? b : { w: el.clientWidth, h: el.clientHeight }));
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const curved = l.kind !== 'flat', wear = l.density / 10;
    const bleed = f2(0.6 + wear * 1.6);
    const long = Math.max(box.w, box.h);
    const warp = curved && long > 0;
    const ax = box.w / (long || 1), ay = box.h / (long || 1); // the shorter side moves fewer pixels
    const only = (r: number, g: number, b: number) => `${r} 0 0 0 0  0 ${g} 0 0 0  0 0 ${b} 0 0  0 0 0 1 0`;
    return (
        <div ref={ref} className="tbg tbg-vhs" style={{ '--vhs-wear': wear } as CSSProperties}>
            <svg className="tbg-defs" width="0" height="0" aria-hidden="true">
                <defs>
                    <filter id={id} x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
                        {/* Color bleed: red and blue are copied out of the picture, pushed apart sideways, and added back on top of green. */}
                        <feOffset in="SourceGraphic" dx={`-${bleed}`} dy="0" result="left" />
                        <feColorMatrix in="left" type="matrix" values={only(1, 0, 0)} result="red" />
                        <feOffset in="SourceGraphic" dx={bleed} dy="0" result="right" />
                        <feColorMatrix in="right" type="matrix" values={only(0, 0, 1)} result="blue" />
                        <feColorMatrix in="SourceGraphic" type="matrix" values={only(0, 1, 0)} result="green" />
                        <feComposite in="red" in2="green" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="rg" />
                        <feComposite in="rg" in2="blue" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="bled" />
                        {warp && (
                            <>
                                <feImage href={vhsMapUrl()} x="0" y="0" width={box.w} height={box.h} preserveAspectRatio="none" result="map" />
                                <feColorMatrix in="map" type="matrix" values={`${f2(ax)} 0 0 0 ${f2(0.5 * (1 - ax))}  0 ${f2(ay)} 0 0 ${f2(0.5 * (1 - ay))}  0 0 1 0 0  0 0 0 1 0`} result="mapAdj" />
                                <feDisplacementMap in="bled" in2="mapAdj" scale={f2((0.004 + Math.min(l.size, VHS_MAX_BULGE) * 0.003) * long)} xChannelSelector="R" yChannelSelector="G" />
                            </>
                        )}
                    </filter>
                </defs>
            </svg>
            {/* Over the whole app the filter reads what is already on screen behind it (a backdrop) instead of wrapping layers. */}
            <div className="tbg" style={over ? { backdropFilter: `url(#${id})`, WebkitBackdropFilter: `url(#${id})` } : { filter: `url(#${id})` }}>{children}</div>
            <div className="tbg tbg-vhs-scan" />
            <div className="tbg tbg-vhs-band" />
            <div className="tbg tbg-vhs-foot" />
            {curved && <div className="tbg tbg-vhs-glass" />}
        </div>
    );
}
