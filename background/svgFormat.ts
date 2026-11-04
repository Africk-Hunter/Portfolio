// Number and id formatting for SVG filters.

export const svgId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '_');
export const f2 = (n: number) => n.toFixed(2);
