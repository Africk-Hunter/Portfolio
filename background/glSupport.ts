// WebGL capability check.

let glOk: boolean | null = null;
/** WebGL with high-precision fragment floats (the recipe loses its lines at medium precision). Checked once. */
export function glSupported(): boolean {
    if (glOk !== null) return glOk;
    try {
        const gl = document.createElement('canvas').getContext('webgl');
        const f = gl?.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        glOk = !!gl && !!f && f.precision > 0;
    } catch { glOk = false; }
    return glOk;
}
