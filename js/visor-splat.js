/**
 * ============================================================
 * visor-splat.js — OMH Estudio | Visor Gaussian Splatting
 * v3.1 — FOV Dinámico, Ángulos de Cámara Configurables
 * ============================================================
 */

(function () {
  "use strict";

  // ── 1. CONFIGURACIÓN ──────────────────────────────────────
  const cfg = Object.assign(
    {
      modelPath:       null,
      containerId:     "visor-splat-dinamico",
      height:          "70vh",
      background:      "transparent",
      autoRotate:      false,
      autoRotateSpeed: 0.3,
      debug:           true,
      upVector:        [0, 1, 0],
      subtitle:        "EXTERIOR",
      title:           "Nombre del Modelo",
      // NUEVO: Parámetros de cámara por defecto configurables
      defaultFov:      55,
      defaultTheta:    0.5, 
      defaultPhi:      1.2  
    },
    window.visorSplatConfig || {}
  );

  function log(msg)  { if (cfg.debug) console.log("[visor-splat]", msg); }
  function err(msg)  { console.error("[visor-splat]", msg); }

  // ── 2. ÍCONOS SVG ─────────────────────────────────────────
  const ICONS = {
    autorot:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.32-9.52l-1.02.51"/></svg>`,
    reset:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
    fullscr:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
    exitfull: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/></svg>`,
    share:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    tour:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20z"/><path d="M2 12h20"/></svg>`,
    fov:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`
  };

  // ── 3. CSS ────────────────────────────────────────────────
  const CSS = `
    .omh-wrap {
      position: relative; width: 100%; max-width: 1400px; margin: 0 auto;
      overflow: hidden; background: var(--negro, #0a0a0a);
      border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;
    }
    .omh-wrap.fullscreen { max-width: none; border-radius: 0; border: none; }
    .omh-wrap canvas { display: block; width: 100%; height: 100%; touch-action: none; outline: none; }

    .omh-loader { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.2rem; background: var(--negro, #000); z-index: 10; transition: opacity 0.6s ease; }
    .omh-loader.out { opacity: 0; pointer-events: none; }
    .omh-ring { width: 48px; height: 48px; border: 1.5px solid rgba(255,255,255,0.07); border-top-color: var(--color-seccion, #ff6c00); border-radius: 50%; animation: omhSpin .85s linear infinite; }
    @keyframes omhSpin { to { transform: rotate(360deg); } }
    .omh-lbl { font-family: 'Lexend Tera', sans-serif; font-size: .5rem; letter-spacing: .22em; color: var(--color-seccion, #ff6c00); text-transform: uppercase; }
    .omh-bar-wrap { width: 140px; height: 1px; background: rgba(255,255,255,0.07); }
    .omh-bar { height: 100%; width: 0%; background: var(--color-seccion, #ff6c00); transition: width .2s ease; }
    .omh-pct { font-family: 'Raleway', sans-serif; font-size: .6rem; letter-spacing: .1em; color: rgba(255,255,255,.25); }

    .omh-error { position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; gap: .8rem; background: var(--negro, #000); z-index: 20; }
    .omh-error.show { display: flex; }
    .omh-error-icon { font-size: 1.8rem; opacity: .35; }
    .omh-error-title { font-family: 'Lexend Tera', sans-serif; font-size: .48rem; letter-spacing: .2em; color: rgba(255,255,255,.3); text-transform: uppercase; text-align: center; }
    .omh-error-msg { font-family: 'Raleway', monospace; font-size: .68rem; color: rgba(255,255,255,.18); max-width: 340px; text-align: center; line-height: 1.6; }

    .omh-ui-layer { position: absolute; inset: 0; pointer-events: none; z-index: 5; padding: 30px 40px; display: flex; flex-direction: column; justify-content: space-between; opacity: 0; transition: opacity 0.5s ease 0.3s; }
    .omh-ui-layer.show { opacity: 1; }

    .omh-top-left .omh-sub { font-family: 'Lexend Tera', sans-serif; font-size: 0.6rem; font-weight: bold; color: var(--color-seccion, #ff6c00); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; line-height: 1; }
    .omh-top-left .omh-tit { font-family: 'Lexend Tera', sans-serif; font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0; letter-spacing: 0.05em; line-height: 1; }

    .omh-top-right { display: flex; gap: 10px; position: absolute; top: 30px; right: 40px; }
    .omh-bottom-left { display: flex; gap: 10px; align-items: center; position: absolute; bottom: 30px; left: 40px; }
    .omh-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.15); margin: 0 10px; }
    .omh-bottom-right { position: absolute; bottom: 30px; right: 40px; }

    .omh-btn-rect { pointer-events: auto; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.15); border-radius: 2px; color: rgba(255,255,255,0.6); font-family: 'Lexend Tera', sans-serif; font-size: 0.55rem; letter-spacing: 0.15em; font-weight: bold; padding: 10px 16px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; }
    .omh-btn-rect svg { width: 14px; height: 14px; }
    .omh-btn-rect:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
    .omh-btn-rect.active { color: #fff; border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }
    
    .omh-btn-rect.orange { border-color: var(--color-seccion, #ff6c00); color: var(--color-seccion, #ff6c00); }
    .omh-btn-rect.orange:hover { background: var(--color-seccion, #ff6c00); color: #fff; }

    .omh-btn-sq { pointer-events: auto; width: 38px; height: 38px; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.15); border-radius: 2px; color: rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; }
    .omh-btn-sq svg { width: 16px; height: 16px; }
    .omh-btn-sq:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

    .omh-hint { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 4; opacity: 0; transition: opacity .4s ease; }
    .omh-hint.show { opacity: 1; }
    .omh-hint-icon { width:40px; height:40px; border:1px solid rgba(255,255,255,.18); border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 10px; animation: omhFloat 2.8s ease-in-out infinite; }
    @keyframes omhFloat { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
    .omh-hint-txt { font-family: 'Lexend Tera', sans-serif; font-size:.4rem; letter-spacing:.18em; color:rgba(255,255,255,.25); text-transform:uppercase; text-align: center; }

    @media (max-width: 768px) {
      .omh-ui-layer { padding: 20px; }
      .omh-top-right { top: 20px; right: 20px; }
      .omh-bottom-left { bottom: 20px; left: 20px; flex-wrap: wrap; max-width: 60%; gap: 6px; }
      .omh-bottom-right { bottom: 20px; right: 20px; }
      .omh-divider { display: none; }
      .omh-top-left .omh-tit { font-size: 1.1rem; }
      .omh-btn-rect { padding: 8px 12px; font-size: 0.5rem; }
    }
  `;

  // ── 4. SHADERS ────────────────────────────────────────────
  const VS = `
    precision highp float;
    attribute vec2  a_uv;        
    attribute vec3  a_center;    
    attribute vec2  a_axes0;     
    attribute vec2  a_axes1;     
    attribute vec4  a_color;     
    uniform mat4   u_view;
    uniform mat4   u_proj;
    uniform vec2   u_vp;         
    varying vec4  v_color;
    varying vec2  v_uv;
    void main() {
      v_color = a_color;
      v_uv    = a_uv;
      vec4 posView = u_view * vec4(a_center, 1.0);
      vec4 posClip = u_proj * posView;
      vec2 offset = a_uv.x * a_axes0 + a_uv.y * a_axes1;
      offset = offset / u_vp * 2.0;      
      posClip.xy += offset * posClip.w;
      gl_Position = posClip;
    }
  `;

  const FS = `
    precision highp float;
    varying vec4 v_color;
    varying vec2 v_uv;
    void main() {
      float r2 = dot(v_uv, v_uv);
      if (r2 > 1.0) discard;
      float alpha = exp(-3.0 * r2) * v_color.a;
      if (alpha < 0.004) discard;
      gl_FragColor = vec4(v_color.rgb, alpha);
    }
  `;

  // ── 5. RENDERER ───────────────────────────────────────────
  class SplatRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) throw new Error("WebGL no disponible en tu navegador.");
      this.gl = gl;
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.disable(gl.DEPTH_TEST);

      this._buildProgram();
      this.splatCount  = 0;
      this.vbo         = gl.createBuffer();
      
      // Aplicamos los valores iniciales configurados
      this.camera = { 
        theta: cfg.defaultTheta, 
        phi: cfg.defaultPhi, 
        radius: 4, 
        target: [0, 0, 0], 
        fov: cfg.defaultFov 
      };
      this._defaultCam = null;
      this.dirty = true;
    }

    _buildProgram() {
      const gl = this.gl;
      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("Shader: " + gl.getShaderInfoLog(s));
        return s;
      };
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("Link: " + gl.getProgramInfoLog(prog));
      this.prog = prog;

      this.u = { view: gl.getUniformLocation(prog, "u_view"), proj: gl.getUniformLocation(prog, "u_proj"), vp: gl.getUniformLocation(prog, "u_vp") };
      this.a = { uv: gl.getAttribLocation(prog, "a_uv"), center: gl.getAttribLocation(prog, "a_center"), axes0: gl.getAttribLocation(prog, "a_axes0"), axes1: gl.getAttribLocation(prog, "a_axes1"), color: gl.getAttribLocation(prog, "a_color") };
    }

    async load(url, onProgress) {
      log("Iniciando carga: " + url);
      let resp;
      try { resp = await fetch(url); } catch (e) { throw new Error("Error de conexión. " + e.message); }
      if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);

      const contentLength = parseInt(resp.headers.get("content-length") || "0");
      const reader = resp.body.getReader();
      const chunks = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.byteLength;
        if (onProgress && contentLength) onProgress(loaded / contentLength * 0.8);
      }

      const buffer = new ArrayBuffer(loaded);
      const view   = new Uint8Array(buffer);
      let offset = 0;
      for (const c of chunks) { view.set(c, offset); offset += c.byteLength; }
      if (onProgress) onProgress(0.85);

      const ext = url.split(".").pop().toLowerCase();
      let splats;
      if      (ext === "splat") splats = this._parseSplat(buffer);
      else if (ext === "ply")   splats = this._parsePly(buffer);
      else throw new Error(`Formato no soportado.`);

      if (onProgress) onProgress(0.9);
      this._fitCamera(splats);
      this._buildGeometry(splats);
      if (onProgress) onProgress(1);
      this.dirty = true;
    }

    _parseSplat(buffer) {
      const STRIDE = 32; const count = Math.floor(buffer.byteLength / STRIDE);
      if (count === 0) throw new Error("Archivo .splat vacío.");
      const dv = new DataView(buffer), pos = new Float32Array(count * 3), scale = new Float32Array(count * 3), color = new Float32Array(count * 4), rot = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        const b = i * STRIDE;
        pos[i*3] = dv.getFloat32(b, true); pos[i*3+1] = dv.getFloat32(b+4, true); pos[i*3+2] = dv.getFloat32(b+8, true);
        scale[i*3] = dv.getFloat32(b+12, true); scale[i*3+1] = dv.getFloat32(b+16, true); scale[i*3+2] = dv.getFloat32(b+20, true);
        color[i*4] = dv.getUint8(b+24)/255; color[i*4+1] = dv.getUint8(b+25)/255; color[i*4+2] = dv.getUint8(b+26)/255; color[i*4+3] = dv.getUint8(b+27)/255;
        rot[i*4] = (dv.getUint8(b+28)-128)/128; rot[i*4+1] = (dv.getUint8(b+29)-128)/128; rot[i*4+2] = (dv.getUint8(b+30)-128)/128; rot[i*4+3] = (dv.getUint8(b+31)-128)/128;
      }
      return { count, pos, scale, color, rot };
    }

    _parsePly(buffer) {
      const headerBytes = Math.min(8192, buffer.byteLength);
      const headerText  = new TextDecoder().decode(new Uint8Array(buffer, 0, headerBytes));
      const lines       = headerText.split(/\r?\n/);
      let vertCount = 0, dataStart = 0, isBinary = false; const props = [];

      for (let i = 0; i < lines.length; i++) {
        const l = lines[i].trim();
        if (l.startsWith("element vertex")) vertCount = parseInt(l.split(" ")[2]);
        if (l.includes("binary_little_endian")) isBinary = true;
        if (l.startsWith("property ")) { const [, type, name] = l.split(" "); props.push({ type, name }); }
        if (l === "end_header") {
          const enc = new TextEncoder(); let off = 0;
          for (let j = 0; j <= i; j++) off += enc.encode(lines[j] + "\n").byteLength;
          dataStart = off; break;
        }
      }
      if (vertCount === 0) throw new Error("PLY vacio");

      const propIdx = name => props.findIndex(p => p.name === name);
      const SIZES = { float: 4, double: 8, int: 4, uint: 4, short: 2, ushort: 2, char: 1, uchar: 1 };
      const stride = props.reduce((s, p) => s + (SIZES[p.type] || 4), 0);
      const offsets = []; let cur = 0;
      for (const p of props) { offsets.push(cur); cur += (SIZES[p.type] || 4); }

      const count = vertCount, pos = new Float32Array(count * 3), scale = new Float32Array(count * 3), color = new Float32Array(count * 4), rot = new Float32Array(count * 4);
      const xi = propIdx("x"), yi = propIdx("y"), zi = propIdx("z"), s0i = propIdx("scale_0"), s1i = propIdx("scale_1"), s2i = propIdx("scale_2"), r0i = propIdx("rot_0"), r1i = propIdx("rot_1"), r2i = propIdx("rot_2"), r3i = propIdx("rot_3"), dc0 = propIdx("f_dc_0"), dc1 = propIdx("f_dc_1"), dc2 = propIdx("f_dc_2"), oi = propIdx("opacity");
      const SH_C0 = 0.28209479177387814;

      if (isBinary) {
        const dv = new DataView(buffer, dataStart);
        const getF = (base, pi) => {
          if (pi < 0) return 0;
          const t = props[pi].type, o = base + offsets[pi];
          if (t === "float") return dv.getFloat32(o, true); if (t === "double") return dv.getFloat64(o, true); if (t === "uchar") return dv.getUint8(o); return dv.getFloat32(o, true);
        };
        for (let i = 0; i < count; i++) {
          const base = i * stride;
          pos[i*3] = getF(base, xi); pos[i*3+1] = getF(base, yi); pos[i*3+2] = getF(base, zi);
          scale[i*3] = s0i >= 0 ? Math.exp(getF(base, s0i)) : 0.05; scale[i*3+1] = s1i >= 0 ? Math.exp(getF(base, s1i)) : 0.05; scale[i*3+2] = s2i >= 0 ? Math.exp(getF(base, s2i)) : 0.05;
          if (dc0 >= 0) { color[i*4] = Math.min(1, Math.max(0, 0.5 + SH_C0 * getF(base, dc0))); color[i*4+1] = Math.min(1, Math.max(0, 0.5 + SH_C0 * getF(base, dc1))); color[i*4+2] = Math.min(1, Math.max(0, 0.5 + SH_C0 * getF(base, dc2))); } else { color[i*4] = color[i*4+1] = color[i*4+2] = 0.8; }
          color[i*4+3] = oi >= 0 ? 1 / (1 + Math.exp(-getF(base, oi))) : 1;
          if (r0i >= 0) {
            const qw = getF(base, r0i), qx = getF(base, r1i), qy = getF(base, r2i), qz = getF(base, r3i);
            const len = Math.sqrt(qw*qw+qx*qx+qy*qy+qz*qz) || 1;
            rot[i*4] = qx/len; rot[i*4+1] = qy/len; rot[i*4+2] = qz/len; rot[i*4+3] = qw/len;
          } else { rot[i*4+3] = 1; }
        }
      } else {
        const allLines = new TextDecoder().decode(buffer).split(/\r?\n/);
        const start = allLines.indexOf("end_header") + 1;
        for (let i = 0; i < count; i++) {
          const vals = (allLines[start + i] || "").trim().split(/\s+/).map(Number);
          pos[i*3] = vals[xi] || 0; pos[i*3+1] = vals[yi] || 0; pos[i*3+2] = vals[zi] || 0;
          scale[i*3] = s0i >= 0 ? Math.exp(vals[s0i]) : 0.05; scale[i*3+1] = s1i >= 0 ? Math.exp(vals[s1i]) : 0.05; scale[i*3+2] = s2i >= 0 ? Math.exp(vals[s2i]) : 0.05;
          if (dc0 >= 0) { color[i*4] = Math.min(1, Math.max(0, 0.5 + SH_C0 * vals[dc0])); color[i*4+1] = Math.min(1, Math.max(0, 0.5 + SH_C0 * vals[dc1])); color[i*4+2] = Math.min(1, Math.max(0, 0.5 + SH_C0 * vals[dc2])); } else { color[i*4] = color[i*4+1] = color[i*4+2] = 0.8; }
          color[i*4+3] = oi >= 0 ? 1/(1+Math.exp(-vals[oi])) : 1;
          if (r0i >= 0) { const qw=vals[r0i], qx=vals[r1i], qy=vals[r2i], qz=vals[r3i]; const len = Math.sqrt(qw*qw+qx*qx+qy*qy+qz*qz) || 1; rot[i*4]=qx/len; rot[i*4+1]=qy/len; rot[i*4+2]=qz/len; rot[i*4+3]=qw/len; } else { rot[i*4+3] = 1; }
        }
      }
      return { count, pos, scale, color, rot };
    }

    _fitCamera({ count, pos }) {
      let x0=Infinity, y0=Infinity, z0=Infinity, x1=-Infinity, y1=-Infinity, z1=-Infinity;
      for (let i = 0; i < count; i++) {
        if (pos[i*3] < x0) x0 = pos[i*3]; if (pos[i*3] > x1) x1 = pos[i*3];
        if (pos[i*3+1] < y0) y0 = pos[i*3+1]; if (pos[i*3+1] > y1) y1 = pos[i*3+1];
        if (pos[i*3+2] < z0) z0 = pos[i*3+2]; if (pos[i*3+2] > z1) z1 = pos[i*3+2];
      }
      const cx = (x0+x1)/2, cy = (y0+y1)/2, cz = (z0+z1)/2, size = Math.max(x1-x0, y1-y0, z1-z0);
      
      // Actualizamos solo el target y calculamos el radio ideal
      this.camera.target = [cx, cy, cz]; 
      this.camera.radius = size * 2.0;
      
      // Guardamos la configuración "default"
      this._defaultCam = { 
        target: [cx, cy, cz], 
        radius: size * 2.0, 
        theta: cfg.defaultTheta, 
        phi: cfg.defaultPhi 
      };
    }

    resetCamera() {
      if (this._defaultCam) { 
        // Restauramos a los valores iniciales configurados (sin tocar el FOV actual)
        this.camera.target = [...this._defaultCam.target]; 
        this.camera.radius = this._defaultCam.radius;
        this.camera.theta = this._defaultCam.theta;
        this.camera.phi = this._defaultCam.phi;
        this.dirty = true; 
      }
    }

    _buildGeometry({ count, pos, scale, color, rot }) {
      const VERTS = 6, FLOATS_PER_VERT = 13, data = new Float32Array(count * VERTS * FLOATS_PER_VERT);
      this._pendingSplats = { count, pos, scale, color, rot };
      this.splatCount = count; this._geoNeedsRebuild = true; this._data = data;
    }

    _buildGeoWithView(view, vpW, vpH) {
      const { count, pos, scale, color, rot } = this._pendingSplats;
      const VERTS = 6, FPV = 13, data = this._data;
      const fov = this.camera.fov * Math.PI / 180, f = 1 / Math.tan(fov / 2), fx = f / (vpW / vpH), fy = f;
      const uvs = [-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1];
      const depths = new Float32Array(count);
      for (let i = 0; i < count; i++) depths[i] = view[2]*pos[i*3] + view[6]*pos[i*3+1] + view[10]*pos[i*3+2] + view[14];
      const order = Array.from({ length: count }, (_, i) => i).sort((a, b) => depths[a] - depths[b]);

      for (let ii = 0; ii < count; ii++) {
        const i = order[ii], px = pos[i*3], py = pos[i*3+1], pz = pos[i*3+2];
        const vx = view[0]*px + view[4]*py + view[8]*pz + view[12], vy = view[1]*px + view[5]*py + view[9]*pz + view[13], vz = view[2]*px + view[6]*py + view[10]*pz + view[14];
        if (vz >= 0) { for (let v = 0; v < VERTS; v++) data[(ii*VERTS+v)*FPV + 4] = 0; continue; }

        const qx=rot[i*4], qy=rot[i*4+1], qz=rot[i*4+2], qw=rot[i*4+3];
        const r00=1-2*(qy*qy+qz*qz), r01=2*(qx*qy-qw*qz), r02=2*(qx*qz+qw*qy), r10=2*(qx*qy+qw*qz), r11=1-2*(qx*qx+qz*qz), r12=2*(qy*qz-qw*qx), r20=2*(qx*qz-qw*qy), r21=2*(qy*qz+qw*qx), r22=1-2*(qx*qx+qy*qy);
        const sx=scale[i*3], sy=scale[i*3+1], sz=scale[i*3+2];
        const m00=r00*sx, m01=r01*sy, m02=r02*sz, m10=r10*sx, m11=r11*sy, m12=r12*sz, m20=r20*sx, m21=r21*sy, m22=r22*sz;
        const w00=view[0]*m00+view[4]*m10+view[8]*m20, w01=view[0]*m01+view[4]*m11+view[8]*m21, w02=view[0]*m02+view[4]*m12+view[8]*m22, w10=view[1]*m00+view[5]*m10+view[9]*m20, w11=view[1]*m01+view[5]*m11+view[9]*m21, w12=view[1]*m02+view[5]*m12+view[9]*m22, w20=view[2]*m00+view[6]*m10+view[10]*m20, w21=view[2]*m01+view[6]*m11+view[10]*m21, w22=view[2]*m02+view[6]*m12+view[10]*m22;
        const s00=w00*w00+w01*w01+w02*w02, s01=w00*w10+w01*w11+w02*w12, s11=w10*w10+w11*w11+w12*w12;

        const tz = -vz, J00 = fx * vpW / 2 / tz, J11 = fy * vpH / 2 / tz;
        const c00 = J00 * J00 * s00, c01 = J00 * J11 * s01, c11 = J11 * J11 * s11;
        const det = c00 * c11 - c01 * c01, tr = c00 + c11, disc = Math.max(0, tr * tr / 4 - det), l1 = tr / 2 + Math.sqrt(disc), l2 = Math.max(0, tr / 2 - Math.sqrt(disc));

        let ax0, ay0, ax1, ay1;
        if (Math.abs(c01) > 0.0001) { const len0 = Math.sqrt((l1 - c11) ** 2 + c01 * c01) || 1; ax0 = (l1 - c11) / len0; ay0 = c01 / len0; } else { ax0 = 1; ay0 = 0; }
        ax1 = -ay0; ay1 = ax0;
        const r1 = Math.min(3 * Math.sqrt(l1), Math.max(vpW, vpH) * 0.5), r2 = Math.min(3 * Math.sqrt(l2), Math.max(vpW, vpH) * 0.5);
        const A0x = ax0 * r1, A0y = ay0 * r1, A1x = ax1 * r2, A1y = ay1 * r2;
        const cr = color[i*4], cg = color[i*4+1], cb = color[i*4+2], ca = color[i*4+3];

        for (let v = 0; v < VERTS; v++) {
          const base = (ii * VERTS + v) * FPV;
          data[base] = uvs[v*2]; data[base+1] = uvs[v*2+1]; data[base+2] = px; data[base+3] = py; data[base+4] = pz;
          data[base+5] = A0x; data[base+6] = A0y; data[base+7] = A1x; data[base+8] = A1y;
          data[base+9] = cr; data[base+10] = cg; data[base+11] = cb; data[base+12] = ca;
        }
      }

      const gl = this.gl; gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      this._geoNeedsRebuild = false; this._lastView = view.slice();
    }

    _perspective(fov, aspect, near, far) {
      const f = 1 / Math.tan(fov * Math.PI / 360), nf = 1 / (near - far);
      return new Float32Array([ f/aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far+near)*nf, -1, 0, 0, 2*far*near*nf, 0 ]);
    }

    _lookAt(eye, center, up) {
      let [fx,fy,fz] = [center[0]-eye[0], center[1]-eye[1], center[2]-eye[2]]; let fl = Math.sqrt(fx*fx+fy*fy+fz*fz) || 1; fx/=fl; fy/=fl; fz/=fl;
      let [sx,sy,sz] = [fy*up[2]-fz*up[1], fz*up[0]-fx*up[2], fx*up[1]-fy*up[0]]; let sl = Math.sqrt(sx*sx+sy*sy+sz*sz) || 1; sx/=sl; sy/=sl; sz/=sl;
      const ux=sy*fz-sz*fy, uy=sz*fx-sx*fz, uz=sx*fy-sy*fx;
      return new Float32Array([ sx, ux, -fx, 0, sy, uy, -fy, 0, sz, uz, -fz, 0, -(sx*eye[0]+sy*eye[1]+sz*eye[2]), -(ux*eye[0]+uy*eye[1]+uz*eye[2]), fx*eye[0]+fy*eye[1]+fz*eye[2], 1 ]);
    }

    _eye() {
      const { theta, phi, radius, target } = this.camera;
      return [ target[0] + radius * Math.sin(phi) * Math.sin(theta), target[1] + radius * Math.cos(phi), target[2] + radius * Math.sin(phi) * Math.cos(theta) ];
    }

    render() {
      if (!this.splatCount) return;
      const gl = this.gl, { width: W, height: H } = this.canvas;
      gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);

      const eye = this._eye(), view = this._lookAt(eye, this.camera.target, cfg.upVector || [0, 1, 0]), proj = this._perspective(this.camera.fov, W / H, 0.01, 1000);
      if (this._geoNeedsRebuild || this._pendingSplats) this._buildGeoWithView(view, W, H);

      gl.useProgram(this.prog); gl.uniformMatrix4fv(this.u.view, false, view); gl.uniformMatrix4fv(this.u.proj, false, proj); gl.uniform2f(this.u.vp, W, H);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

      const FPV = 13, STRIDE = FPV * 4, { uv, center, axes0, axes1, color } = this.a;
      gl.enableVertexAttribArray(uv); gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, STRIDE, 0);
      gl.enableVertexAttribArray(center); gl.vertexAttribPointer(center, 3, gl.FLOAT, false, STRIDE, 2*4);
      gl.enableVertexAttribArray(axes0); gl.vertexAttribPointer(axes0, 2, gl.FLOAT, false, STRIDE, 5*4);
      gl.enableVertexAttribArray(axes1); gl.vertexAttribPointer(axes1, 2, gl.FLOAT, false, STRIDE, 7*4);
      gl.enableVertexAttribArray(color); gl.vertexAttribPointer(color, 4, gl.FLOAT, false, STRIDE, 9*4);

      gl.drawArrays(gl.TRIANGLES, 0, this.splatCount * 6);
      this.dirty = false;
    }
  }

  // ── 6. MONTAR UI ──────────────────────────────────────────
  function init() {
    const container = document.getElementById(cfg.containerId);
    if (!container) return err("No se encontró #" + cfg.containerId);

    if (!document.getElementById("omh-visor-css")) {
      const s = document.createElement("style"); s.id = "omh-visor-css"; s.textContent = CSS; document.head.appendChild(s);
    }

    container.innerHTML = `
      <div class="omh-wrap" id="omh-wrap" style="height:${cfg.height}">
        <canvas id="omh-canvas" tabindex="0"></canvas>

        <div class="omh-ui-layer" id="omh-ui-layer">
          <div class="omh-top-left">
            <div class="omh-sub">${cfg.subtitle}</div>
            <h2 class="omh-tit">${cfg.title}</h2>
          </div>

          <div class="omh-top-right">
            <button class="omh-btn-sq" id="btn-fs" title="Pantalla completa">${ICONS.fullscr}</button>
            <button class="omh-btn-sq" id="btn-share" title="Compartir enlace">${ICONS.share}</button>
          </div>

          <div class="omh-bottom-left">
            <button class="omh-btn-rect" id="btn-rst">${ICONS.reset} Centrar</button>
            <button class="omh-btn-rect" id="btn-ar">${ICONS.autorot} Auto-rotar</button>
            <button class="omh-btn-rect" id="btn-fov">${ICONS.fov} FOV: ${cfg.defaultFov}°</button>
            <div class="omh-divider"></div>
            <button class="omh-btn-rect active" id="btn-exterior">Exterior</button>
            <button class="omh-btn-rect" id="btn-interior">Interior</button>
          </div>

          <div class="omh-bottom-right">
            <button class="omh-btn-rect orange" id="btn-tour">${ICONS.tour} Tour 360°</button>
          </div>
        </div>

        <div class="omh-hint" id="omh-hint">
          <div class="omh-hint-inner">
            <div class="omh-hint-icon"><svg viewBox="0 0 24 24"><path fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg></div>
            <span class="omh-hint-txt">Arrastra para rotar · Scroll para zoom</span>
          </div>
        </div>

        <div class="omh-loader" id="omh-loader">
          <div class="omh-ring"></div><div class="omh-lbl">Cargando modelo</div>
          <div class="omh-bar-wrap"><div class="omh-bar" id="omh-bar"></div></div>
          <div class="omh-pct" id="omh-pct">0%</div>
        </div>

        <div class="omh-error" id="omh-error">
          <div class="omh-error-icon">⚠</div>
          <div class="omh-error-title">Error al cargar</div>
          <div class="omh-error-msg" id="omh-error-msg"></div>
        </div>
      </div>
    `;

    const wrap = document.getElementById("omh-wrap"), canvas = document.getElementById("omh-canvas"), loader = document.getElementById("omh-loader"), bar = document.getElementById("omh-bar"), pctEl = document.getElementById("omh-pct"), hint = document.getElementById("omh-hint"), errBox = document.getElementById("omh-error"), errMsg = document.getElementById("omh-error-msg"), uiLayer = document.getElementById("omh-ui-layer");
    let renderer = null;

    function resize() {
      canvas.width = wrap.clientWidth; canvas.height = wrap.clientHeight;
      if (renderer) { renderer.dirty = true; renderer._geoNeedsRebuild = true; }
    }
    new ResizeObserver(resize).observe(wrap); resize();

    try { renderer = new SplatRenderer(canvas); } catch (e) {
      loader.classList.add("out"); errBox.classList.add("show"); errMsg.textContent = e.message; err(e.message); return;
    }

    function showReady() {
      loader.classList.add("out"); uiLayer.classList.add("show"); hint.classList.add("show");
      setTimeout(() => hint.classList.remove("show"), 3500);
    }

    if (!cfg.modelPath) { loader.classList.add("out"); errBox.classList.add("show"); errMsg.textContent = "Configura modelPath"; return; }

    renderer.load(cfg.modelPath, (p) => {
      const v = Math.round(p * 100); bar.style.width = v + "%"; pctEl.textContent = v + "%";
    }).then(showReady).catch(e => { loader.classList.add("out"); errBox.classList.add("show"); errMsg.textContent = "Verifica la ruta del archivo."; });

    // ── Interacciones UI ──────────────────────────────────────
    document.getElementById("btn-rst").addEventListener("click", () => { renderer.resetCamera(); renderer._geoNeedsRebuild = true; });
    
    // Botón para ciclar FOV
    const btnFov = document.getElementById("btn-fov");
    const fovValues = [35, 55, 75, 90];
    btnFov.addEventListener("click", () => {
      let currIdx = fovValues.indexOf(renderer.camera.fov);
      if (currIdx === -1) currIdx = 1; // Default a 55 si no lo encuentra
      let nextIdx = (currIdx + 1) % fovValues.length;
      renderer.camera.fov = fovValues[nextIdx];
      btnFov.innerHTML = `${ICONS.fov} FOV: ${renderer.camera.fov}°`;
      renderer.dirty = true;
      renderer._geoNeedsRebuild = true;
    });

    let autoRot = cfg.autoRotate;
    const btnAr = document.getElementById("btn-ar");
    if(autoRot) btnAr.classList.add("active");
    btnAr.addEventListener("click", () => { autoRot = !autoRot; btnAr.classList.toggle("active", autoRot); });

    const btnFs = document.getElementById("btn-fs");
    btnFs.addEventListener("click", () => { !document.fullscreenElement ? wrap.requestFullscreen() : document.exitFullscreen(); });
    document.addEventListener("fullscreenchange", () => {
      const full = !!document.fullscreenElement;
      wrap.classList.toggle("fullscreen", full);
      btnFs.innerHTML = full ? ICONS.exitfull : ICONS.fullscr;
      wrap.style.height = full ? "100vh" : cfg.height;
      setTimeout(resize, 80);
    });

    document.getElementById("btn-share").addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    });

    const btnExt = document.getElementById("btn-exterior"), btnInt = document.getElementById("btn-interior");
    btnExt.addEventListener("click", () => { btnExt.classList.add("active"); btnInt.classList.remove("active"); });
    btnInt.addEventListener("click", () => { btnInt.classList.add("active"); btnExt.classList.remove("active"); });

    // ── Controles Cámara ──────────────────────────────────────
    let dragging = false, rightDrag = false, lastX = 0, lastY = 0;
    canvas.addEventListener("mousedown", e => { dragging = true; rightDrag = e.button === 2; lastX = e.clientX; lastY = e.clientY; hint.classList.remove("show"); });
    window.addEventListener("mouseup", () => { dragging = false; });
    canvas.addEventListener("contextmenu", e => e.preventDefault());

    window.addEventListener("mousemove", e => {
      if (!dragging || !renderer.splatCount) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      if (rightDrag) {
        const s = renderer.camera.radius * 0.001;
        renderer.camera.target[0] -= Math.cos(renderer.camera.theta) * dx * s; renderer.camera.target[2] -= Math.sin(renderer.camera.theta) * dx * s; renderer.camera.target[1] += dy * s;
      } else {
        renderer.camera.theta -= dx * 0.008; renderer.camera.phi = Math.max(0.05, Math.min(Math.PI - 0.05, renderer.camera.phi - dy * 0.008));
      }
      renderer.dirty = true; renderer._geoNeedsRebuild = true;
    });

    canvas.addEventListener("wheel", e => { e.preventDefault(); renderer.camera.radius = Math.max(0.05, renderer.camera.radius * (1 + e.deltaY * 0.001)); renderer.dirty = true; renderer._geoNeedsRebuild = true; }, { passive: false });

    // ── Loop ──────────────────────────────────────────────────
    let prevT = 0;
    function loop(t) {
      requestAnimationFrame(loop);
      const dt = t - prevT; prevT = t;
      if (!renderer.splatCount) return;
      if (autoRot) { renderer.camera.theta += cfg.autoRotateSpeed * dt * 0.001 * (Math.PI / 180); renderer.dirty = true; renderer._geoNeedsRebuild = true; }
      if (renderer.dirty) renderer.render();
    }
    requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();