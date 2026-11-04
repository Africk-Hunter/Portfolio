// Layer sets taken from the app's built-in themes (the ones with no 3D scene). bg is the theme's page color: set it as the
// page/body background, since layers are partly transparent.

import { newLayer, type BgLayer, type BgType } from './types';

const L = (type: BgType, id: string, over: Partial<BgLayer>): BgLayer => ({ ...newLayer(type), id, ...over });

export interface BackgroundPreset { id: string; name: string; bg: string; layers: BgLayer[] }

export const PRESETS: BackgroundPreset[] = [
    { id: 'dark', name: 'Classic Dark', bg: '#222226', layers: [
        L('pattern', 'dk-grid', { kind: 'grid', color: '#41bc28', size: 5, angle: 0, opacity: 10 }),
    ] },
    { id: 'aero', name: 'Frutiger Aero', bg: '#4fb3ee', layers: [
        L('gradient', 'fa-sky', { kind: 'linear', color: '#2f9be0', color2: '#7cd0f7', color3: '#d8f4ff', angle: 180, size: 5, density: 5, speed: 0, opacity: 100 }),
        L('bubbles', 'fa-bubbles', { kind: 'low-res', color: '#9be7ff', color2: '#ffffff', color3: '#b9f5d0', angle: 180, size: 5, density: 10, speed: 2, opacity: 85 }),
        L('caustics', 'fa-caustics', { kind: 'smooth', color: '#8fe6ff', color2: '#ffffff', color3: '#7cf0c9', angle: 180, size: 7, density: 5, speed: 1, opacity: 100 }),
        L('dither', 'fa-bokeh', { kind: '', color: '#ff5fa2', color2: '#6a8cff', color3: '#7cf0c9', angle: 180, size: 4, density: 4, speed: 3, opacity: 100 }),
    ] },
    { id: 'sunset', name: 'Sunset', bg: '#FFD2A6', layers: [
        L('gradient', 'sun-sky', { kind: 'linear', color: '#ffd9a8', color2: '#ff9a76', color3: '#c9508f', angle: 0 }),
        L('ridges', 'sun-ridges', { color: '#7a2e5c', color2: '#f2994a', color3: '#ffd9a8', density: 4, speed: 4, opacity: 85 }),
    ] },
    { id: 'midnight', name: 'Midnight', bg: '#141B33', layers: [
        L('plasma', 'mid-plasma', { color: '#0d1330', color2: '#2a1b6d', color3: '#12466e', size: 3, density: 3, speed: 2 }),
        L('spiral', 'mid-spiral', { color: '#ffffff', color2: '#9ab4ff', color3: '#d7a8ff', size: 2, density: 4, speed: 1, opacity: 55 }),
    ] },
    { id: 'cosmos', name: 'Cosmos', bg: '#0E0720', layers: [
        L('fractal', 'co-fractal', { color: '#120b26', color2: '#5b2bb5', color3: '#ff7ac8', size: 4, speed: 1 }),
        L('spiral', 'co-spiral', { color: '#ffffff', color2: '#ffd36b', color3: '#9ab4ff', size: 2, density: 6, speed: 1, opacity: 45 }),
    ] },
    { id: 'blueprint', name: 'Blueprint', bg: '#17469B', layers: [
        L('gradient', 'bp-base', { kind: 'radial', color: '#2d68c4', color2: '#1e4fa3', color3: '#143a80' }),
        L('pattern', 'bp-grid', { kind: 'grid', color: '#ffffff', size: 4, angle: 0, opacity: 35 }),
    ] },
    { id: 'zen', name: 'Zen Garden', bg: '#EFE8D6', layers: [
        L('mandala', 'zen-mandala', { color: '#b9a98a', color2: '#d8cdb4', color3: '#9bb58a', size: 6, density: 4, speed: 1, opacity: 57 }),
    ] },
    { id: 'tiles', name: 'Truchet', bg: '#1A3526', layers: [
        L('truchet', 'tr-tiles', { color: '#d9744a', color2: '#e8b84a', color3: '#9fca78', size: 5, density: 4, speed: 1, opacity: 70 }),
    ] },
    { id: 'floral-shoppe', name: 'Floral Shoppe', bg: '#FFA6E0', layers: [
        L('gradient', 'fs-sky', { kind: 'linear', color: '#5ee7e0', color2: '#b8a1ff', color3: '#ff9fe0', angle: 0 }),
        L('shapes', 'fs-shapes', { kind: 'dithered', color: '#ffffff', color2: '#ff71ce', color3: '#01cdfe', angle: 23, size: 6, density: 5, speed: 1, opacity: 40, spread: 6 }),
        L('terrain', 'fs-grid', { color: '#ff71ce', color2: '#b967ff', color3: '#01cdfe', size: 4, density: 5, speed: 2, opacity: 80 }),
    ] },
    { id: 'polygon', name: 'Polygon', bg: '#0E1430', layers: [
        L('plasma', 'pg-void', { kind: 'smooth', color: '#ff5fa2', color2: '#6a8cff', color3: '#7cf0c9', angle: 180, size: 5, density: 5, speed: 3, opacity: 12 }),
        L('shapes', 'pg-shapes', { kind: 'dithered', color: '#5fb8ff', color2: '#b07bff', color3: '#7cf0c9', angle: 13, size: 3, density: 8, speed: 1, opacity: 90 }),
        L('shapes', 'lmvcnrbru21', { kind: 'dithered', color: '#5fffe3', color2: '#80ff7b', color3: '#f07c9a', angle: 74, size: 5, density: 1, speed: 2, opacity: 100 }),
    ] },
    { id: 'art-nouveau', name: 'Art Nouveau', bg: '#F3E8D5', layers: [
        L('gradient', 'art-nouveau-wash', { kind: 'linear', color: '#F3E8D5', color2: '#E8D9C2', color3: '#D9C8B4', angle: 135, size: 5, density: 5, speed: 3, opacity: 100 }),
        L('pattern', 'botanical-motif', { kind: 'rings', color: '#9D3F32', color2: '#6a8cff', color3: '#7cf0c9', angle: 45, size: 8, density: 5, speed: 3, opacity: 9 }),
        L('dust', 'golden-atmosphere', { kind: '', color: '#D6A447', color2: '#C46F78', color3: '#4D7774', angle: 180, size: 3, density: 3, speed: 1, opacity: 16 }),
        L('metaballs', 'lmvhdqsoz234', { kind: '', color: '#4D7774', color2: '#B9C98A', color3: '#9d3f32', angle: 180, size: 5, density: 5, speed: 2, opacity: 46 }),
    ] },
];
