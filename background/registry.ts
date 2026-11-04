// Which painter draws each background type. The 3D scenes are not part of the portable build, so SCENES stays empty.

import { type BgLayer } from './types';
import { type Scene } from './dither';
import { bubbles, dust, starfield } from './overlays';
import { contours } from './contours';
import { mandala, ridges, shapes, spiral, terrain, truchet } from './painters';
import { type Painter } from './shared';

export const PAINTERS: Partial<Record<BgLayer['type'], Painter>> = { spiral, mandala, ridges, truchet, terrain, shapes, contours, starfield, bubbles, dust };
export const SCENES: Partial<Record<BgLayer['type'], Scene>> = {};
