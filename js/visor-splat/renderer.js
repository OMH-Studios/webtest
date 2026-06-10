/**
 * renderer.js — OMH Estudio | Visor Gaussian Splatting
 * ─────────────────────────────────────────────────────────────
 * Núcleo WebGL con cálculo de Centro Exacto para Hotspots
 */

const VS = `
  precision highp float;
  attribute vec2  a_uv;      
  attribute vec3  a_center;  
  attribute vec2  a_axes0;   
  attribute vec2  a_axes1;   
  attribute vec4  a_color;   
  uniform mat4  u_view;      
  uniform mat4  u_proj;      
  uniform vec2  u_vp;        
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
    
    // Aumentamos de -3.0 a -4.0 para hacer el punto más pequeño y definido
    float alpha = exp(-4.0 * r2) * v_color.a;
    
    // Subimos el umbral de descarte de 0.004 a 0.02 para eliminar el "manchado" o niebla en los bordes
    if (alpha < 0.02) discard;  
    
    gl_FragColor = vec4(v_color.rgb, alpha);
  }
`;

export class SplatRenderer {
  constructor(canvas, cfg) {
    this.canvas = canvas;
    this.cfg    = cfg;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) throw new Error("WebGL no está disponible en este navegador.");
    this.gl = gl;

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,       gl.ONE_MINUS_SRC_ALPHA
    );
    gl.disable(gl.DEPTH_TEST);

    this._buildProgram();

    this.splatCount       = 0;
    this.vbo              = gl.createBuffer();
    this._pendingSplats   = null;
    this._data            = null;
    this._geoNeedsRebuild = false;
    this._defaultCam      = null;
    this.dirty            = true;

    this.camera = {
      theta:  cfg.defaultTheta,
      phi:    cfg.defaultPhi,
      radius: 4,
      target: [0, 0, 0],
      fov:    cfg.defaultFov,
    };
  }

  _buildProgram() {
    const gl = this.gl;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("Shader error: " + gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER,   VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("Link error: " + gl.getProgramInfoLog(prog));
    this.prog = prog;
    this.u = { view: gl.getUniformLocation(prog, "u_view"), proj: gl.getUniformLocation(prog, "u_proj"), vp: gl.getUniformLocation(prog, "u_vp") };
    this.a = { uv: gl.getAttribLocation(prog, "a_uv"), center: gl.getAttribLocation(prog, "a_center"), axes0: gl.getAttribLocation(prog, "a_axes0"), axes1: gl.getAttribLocation(prog, "a_axes1"), color: gl.getAttribLocation(prog, "a_color") };
  }

  async load(url, onProgress) {
    this._log("Cargando: " + url);
    let resp;
    try { resp = await fetch(url); } catch (e) { throw new Error("Error de red: " + e.message); }
    if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);

    const contentLength = parseInt(resp.headers.get("content-length") || "0");
    const reader = resp.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value); loaded += value.byteLength;
      if (onProgress && contentLength) onProgress(loaded / contentLength * 0.80); 
    }

    const buffer = new ArrayBuffer(loaded); const out = new Uint8Array(buffer); let offset = 0;
    for (const c of chunks) { out.set(c, offset); offset += c.byteLength; }
    if (onProgress) onProgress(0.85);

    const ext = url.split(".").pop().toLowerCase(); let splats;
    if (ext === "splat") splats = this._parseSplat(buffer);
    else if (ext === "ply") splats = this._parsePly(buffer);
    else throw new Error(`Formato no soportado.`);

    if (onProgress) onProgress(0.90);
    this._fitCamera(splats);
    this._buildGeometry(splats);
    if (onProgress) onProgress(1.0);
    this.dirty = true;
  }

  _parseSplat(buffer) {
    const STRIDE = 32; 
    const count = Math.floor(buffer.byteLength / STRIDE);
    if (count === 0) throw new Error("Archivo .splat vacío o corrupto.");
    
    const dv = new DataView(buffer); 
    const pos = new Float32Array(count * 3); 
    const scale = new Float32Array(count * 3); 
    const color = new Float32Array(count * 4); 
    const rot = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const b = i * STRIDE;

      // 1. Posición (X, Y, Z)
      pos[i*3]   = dv.getFloat32(b, true); 
      pos[i*3+1] = dv.getFloat32(b+4, true); 
      pos[i*3+2] = dv.getFloat32(b+8, true);

      // 2. Escala (Le quitamos el Math.exp porque el .splat ya viene lineal)
      scale[i*3]   = dv.getFloat32(b+12, true); 
      scale[i*3+1] = dv.getFloat32(b+16, true); 
      scale[i*3+2] = dv.getFloat32(b+20, true);

      // 3. Color
      color[i*4]   = dv.getUint8(b+24) / 255; 
      color[i*4+1] = dv.getUint8(b+25) / 255; 
      color[i*4+2] = dv.getUint8(b+26) / 255; 
      color[i*4+3] = dv.getUint8(b+27) / 255;

      // 4. Rotación (El secreto está aquí: SuperSplat guarda como W, X, Y, Z)
      const qw = (dv.getUint8(b+28) - 128) / 128; 
      const qx = (dv.getUint8(b+29) - 128) / 128; 
      const qy = (dv.getUint8(b+30) - 128) / 128; 
      const qz = (dv.getUint8(b+31) - 128) / 128;
      
      // Normalizamos la longitud para evitar deformaciones
      const len = Math.sqrt(qx*qx + qy*qy + qz*qz + qw*qw) || 1;
      
      // Guardamos en el orden que tu Shader espera: X, Y, Z, W
      rot[i*4]   = qx / len; 
      rot[i*4+1] = qy / len; 
      rot[i*4+2] = qz / len; 
      rot[i*4+3] = qw / len;
    }
    
    return { count, pos, scale, color, rot };
  }

  _parsePly(buffer) {
    const headerBytes = Math.min(8192, buffer.byteLength), headerText = new TextDecoder().decode(new Uint8Array(buffer, 0, headerBytes)), lines = headerText.split(/\r?\n/);
    let vertCount = 0, dataStart = 0, isBinary = false; const props = [];
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i].trim();
      if (l.startsWith("element vertex")) vertCount = parseInt(l.split(" ")[2]);
      if (l.includes("binary_little_endian")) isBinary = true;
      if (l.startsWith("property ")) { const [, type, name] = l.split(" "); props.push({ type, name }); }
      if (l === "end_header") { const enc = new TextEncoder(); let off = 0; for (let j = 0; j <= i; j++) off += enc.encode(lines[j] + "\n").byteLength; dataStart = off; break; }
    }
    const pi = name => props.findIndex(p => p.name === name), SIZES = { float:4, double:8, int:4, uint:4, short:2, ushort:2, char:1, uchar:1 }, stride = props.reduce((s, p) => s + (SIZES[p.type] || 4), 0), offsets = []; let cur = 0;
    for (const p of props) { offsets.push(cur); cur += (SIZES[p.type] || 4); }
    const xi = pi("x"), yi = pi("y"), zi = pi("z"), s0 = pi("scale_0"), s1 = pi("scale_1"), s2 = pi("scale_2"), dc0 = pi("f_dc_0"), dc1 = pi("f_dc_1"), dc2 = pi("f_dc_2"), oi = pi("opacity"), r0 = pi("rot_0"), r1 = pi("rot_1"), r2 = pi("rot_2"), r3 = pi("rot_3"), SH_C0 = 0.28209479177387814;
    const count = vertCount, pos = new Float32Array(count * 3), scale = new Float32Array(count * 3), color = new Float32Array(count * 4), rot = new Float32Array(count * 4);
    if (isBinary) {
      const dv = new DataView(buffer, dataStart), getF = (base, idx) => { if (idx < 0) return 0; const t = props[idx].type, o = base + offsets[idx]; if (t === "float") return dv.getFloat32(o, true); if (t === "double") return dv.getFloat64(o, true); if (t === "uchar") return dv.getUint8(o); return dv.getFloat32(o, true); };
      for (let i = 0; i < count; i++) {
        const b = i * stride; pos[i*3] = getF(b, xi); pos[i*3+1] = getF(b, yi); pos[i*3+2] = getF(b, zi);
        scale[i*3] = s0 >= 0 ? Math.exp(getF(b, s0)) : 0.05; scale[i*3+1] = s1 >= 0 ? Math.exp(getF(b, s1)) : 0.05; scale[i*3+2] = s2 >= 0 ? Math.exp(getF(b, s2)) : 0.05;
        if (dc0 >= 0) { color[i*4] = Math.min(1, Math.max(0, 0.5 + SH_C0 * getF(b, dc0))); color[i*4+1] = Math.min(1, Math.max(0, 0.5 + SH_C0 * getF(b, dc1))); color[i*4+2] = Math.min(1, Math.max(0, 0.5 + SH_C0 * getF(b, dc2))); } else { color[i*4] = color[i*4+1] = color[i*4+2] = 0.8; }
        color[i*4+3] = oi >= 0 ? 1 / (1 + Math.exp(-getF(b, oi))) : 1;
        if (r0 >= 0) { const qw = getF(b, r0), qx = getF(b, r1), qy = getF(b, r2), qz = getF(b, r3), len = Math.sqrt(qw*qw + qx*qx + qy*qy + qz*qz) || 1; rot[i*4] = qx / len; rot[i*4+1] = qy / len; rot[i*4+2] = qz / len; rot[i*4+3] = qw / len; } else { rot[i*4+3] = 1; }
      }
    } else {
      const allLines = new TextDecoder().decode(buffer).split(/\r?\n/), start = allLines.indexOf("end_header") + 1;
      for (let i = 0; i < count; i++) {
        const vals = (allLines[start + i] || "").trim().split(/\s+/).map(Number); pos[i*3] = vals[xi] || 0; pos[i*3+1] = vals[yi] || 0; pos[i*3+2] = vals[zi] || 0;
        scale[i*3] = s0 >= 0 ? Math.exp(vals[s0]) : 0.05; scale[i*3+1] = s1 >= 0 ? Math.exp(vals[s1]) : 0.05; scale[i*3+2] = s2 >= 0 ? Math.exp(vals[s2]) : 0.05;
        if (dc0 >= 0) { color[i*4] = Math.min(1, Math.max(0, 0.5 + SH_C0 * vals[dc0])); color[i*4+1] = Math.min(1, Math.max(0, 0.5 + SH_C0 * vals[dc1])); color[i*4+2] = Math.min(1, Math.max(0, 0.5 + SH_C0 * vals[dc2])); } else { color[i*4] = color[i*4+1] = color[i*4+2] = 0.8; }
        color[i*4+3] = oi >= 0 ? 1 / (1 + Math.exp(-vals[oi])) : 1;
        if (r0 >= 0) { const qw=vals[r0], qx=vals[r1], qy=vals[r2], qz=vals[r3], len = Math.sqrt(qw*qw+qx*qx+qy*qy+qz*qz) || 1; rot[i*4]=qx/len; rot[i*4+1]=qy/len; rot[i*4+2]=qz/len; rot[i*4+3]=qw/len; } else { rot[i*4+3] = 1; }
      }
    }
    return { count, pos, scale, color, rot };
  }

  _fitCamera({ count, pos }) {
    let x0= Infinity, y0= Infinity, z0= Infinity, x1=-Infinity, y1=-Infinity, z1=-Infinity;
    for (let i = 0; i < count; i++) {
      if (pos[i*3] < x0) x0 = pos[i*3]; if (pos[i*3] > x1) x1 = pos[i*3];
      if (pos[i*3+1] < y0) y0 = pos[i*3+1]; if (pos[i*3+1] > y1) y1 = pos[i*3+1];
      if (pos[i*3+2] < z0) z0 = pos[i*3+2]; if (pos[i*3+2] > z1) z1 = pos[i*3+2];
    }
    const cx = (x0+x1)/2, cy = (y0+y1)/2, cz = (z0+z1)/2, size = Math.max(x1-x0, y1-y0, z1-z0);
    
    // ── NUEVO: Compensación del centro (Offset) ──
    const ox = this.cfg.cameraTargetOffset ? this.cfg.cameraTargetOffset[0] : 0;
    const oy = this.cfg.cameraTargetOffset ? this.cfg.cameraTargetOffset[1] : 0;
    const oz = this.cfg.cameraTargetOffset ? this.cfg.cameraTargetOffset[2] : 0;

    const tX = cx + ox;
    const tY = cy + oy;
    const tZ = cz + oz;

    // MENSAJE EN CONSOLA PARA CALIBRAR HOTSPOTS
    console.warn(`================================================`);
    console.warn(`🎯 CENTRO EXACTO DEL MODELO: [${tX.toFixed(3)}, ${tY.toFixed(3)}, ${tZ.toFixed(3)}]`);
    console.warn(`Abre tu HTML y usa estas coordenadas como punto de partida para tus Hotspots.`);
    console.warn(`================================================`);

    const mult = this.cfg.cameraRadiusMultiplier || 2.0;

    this.camera.target = [tX, tY, tZ]; 
    this.camera.radius = size * mult; 
    
    this._defaultCam = { 
      target: [tX, tY, tZ], 
      radius: size * mult, 
      theta:  this.cfg.defaultTheta, 
      phi:    this.cfg.defaultPhi 
    };
  }

  resetCamera() {
    if (!this._defaultCam) return;
    this.camera.target = [...this._defaultCam.target]; 
    this.camera.radius = this._defaultCam.radius; 
    this.camera.theta  = this.cfg.defaultTheta; 
    this.camera.phi    = this.cfg.defaultPhi;   
    this.camera.fov    = this.cfg.defaultFov;
    this.dirty = true; 
    this._geoNeedsRebuild = true;
  }
  
  _buildGeometry({ count, pos, scale, color, rot }) {
    const FLOATS_PER_VERT = 13; 
    this._pendingSplats = { count, pos, scale, color, rot };
    this._data = new Float32Array(count * 6 * FLOATS_PER_VERT);
    this.splatCount = count; this._geoNeedsRebuild = true;
  }

  _buildGeoWithView(view, vpW, vpH) {
    const { count, pos, scale, color, rot } = this._pendingSplats, VERTS = 6, FPV = 13, data = this._data;
    const fov = this.camera.fov * Math.PI / 180, f = 1 / Math.tan(fov / 2), fx = f / (vpW / vpH), fy = f, uvs = [-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1], depths = new Float32Array(count);
    
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
      
      const w00=view[0]*m00+view[4]*m10+view[8]*m20;
      const w01=view[0]*m01+view[4]*m11+view[8]*m21;
      const w02=view[0]*m02+view[4]*m12+view[8]*m22;
      const w10=view[1]*m00+view[5]*m10+view[9]*m20;
      const w11=view[1]*m01+view[5]*m11+view[9]*m21;
      const w12=view[1]*m02+view[5]*m12+view[9]*m22;
      const w20=view[2]*m00+view[6]*m10+view[10]*m20;
      const w21=view[2]*m01+view[6]*m11+view[10]*m21;
      const w22=view[2]*m02+view[6]*m12+view[10]*m22;

      const s00=w00*w00+w01*w01+w02*w02;
      const s01=w00*w10+w01*w11+w02*w12;
      const s11=w10*w10+w11*w11+w12*w12;
      
      // ... código previo (cálculo de s00, s01, s11, vz, tz, J00, J11) ...
      const tz = -vz, J00 = fx * vpW / 2 / tz, J11 = fy * vpH / 2 / tz;

      // 1. Calculamos la matriz 2D original
      let c00 = J00 * J00 * s00;
      let c01 = J00 * J11 * s01;
      let c11 = J11 * J11 * s11;

      // 2. EL FILTRO DE SUAVIZADO (Anti-aliasing)
      // Agregamos un valor base a la diagonal de la matriz.
      // Si a la distancia se siguen viendo pelos, súbelo a 0.5. Si de cerca se ve muy borroso, bájalo a 0.15.
      const blur = 0.5;
      c00 += blur;
      c11 += blur;

      // 3. Continuamos con la matemática normal
      const det = c00 * c11 - c01 * c01;
      const tr = c00 + c11;
      const disc = Math.max(0, tr * tr / 4 - det);
      const l1 = tr / 2 + Math.sqrt(disc);
      const l2 = Math.max(0, tr / 2 - Math.sqrt(disc));
      // ... sigue tu código (let ax0, ay0...) ...

      let ax0, ay0;
      if (Math.abs(c01) > 0.0001) { const len0 = Math.sqrt((l1-c11)**2 + c01*c01) || 1; ax0 = (l1-c11) / len0; ay0 = c01 / len0; } else { ax0 = 1; ay0 = 0; }
      
      const ax1 = -ay0, ay1 = ax0, maxR = Math.max(vpW, vpH) * 0.5;
      const r1 = Math.min(3 * Math.sqrt(l1), maxR), r2 = Math.min(3 * Math.sqrt(l2), maxR);
      const A0x = ax0 * r1, A0y = ay0 * r1, A1x = ax1 * r2, A1y = ay1 * r2;
      const cr=color[i*4], cg=color[i*4+1], cb=color[i*4+2], ca=color[i*4+3];

      for (let v = 0; v < VERTS; v++) {
        const base = (ii * VERTS + v) * FPV;
        data[base] = uvs[v*2]; data[base+1] = uvs[v*2+1]; data[base+2] = px; data[base+3] = py; data[base+4] = pz; data[base+5] = A0x; data[base+6] = A0y; data[base+7] = A1x; data[base+8] = A1y; data[base+9] = cr; data[base+10] = cg; data[base+11] = cb; data[base+12] = ca;
      }
    }
    const gl = this.gl; gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW); this._geoNeedsRebuild = false;
  }

  // ── FUNCIÓN DE PROYECCIÓN PARA LOS HOTSPOTS ────
  projectToScreen(pos3D) {
    if (!this.splatCount) return null;
    const { width: W, height: H } = this.canvas;
    if (W === 0 || H === 0) return null;

    const up   = this.cfg.upVector || [0, 1, 0];
    const eye  = this._eye();
    const view = this._lookAt(eye, this.camera.target, up);
    const proj = this._perspective(this.camera.fov, W / H, 0.01, 1000);

    const vx = view[0]*pos3D[0] + view[4]*pos3D[1] + view[8]*pos3D[2]  + view[12];
    const vy = view[1]*pos3D[0] + view[5]*pos3D[1] + view[9]*pos3D[2]  + view[13];
    const vz = view[2]*pos3D[0] + view[6]*pos3D[1] + view[10]*pos3D[2] + view[14];

    if (vz >= 0) return null; // El punto está detrás de la cámara y no debe verse

    const cx = proj[0]*vx + proj[4]*vy + proj[8]*vz  + proj[12];
    const cy = proj[1]*vx + proj[5]*vy + proj[9]*vz  + proj[13];
    const cw = proj[3]*vx + proj[7]*vy + proj[11]*vz + proj[15];

    if (cw === 0) return null;

    return {
      x: (((cx / cw) + 1) / 2) * W,
      y: (((1 - (cy / cw))) / 2) * H
    };
  }

  _perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov * Math.PI / 360), nf = 1 / (near - far);
    return new Float32Array([ f/aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far+near)*nf, -1, 0, 0, 2*far*near*nf, 0 ]);
  }

  _lookAt(eye, center, up) {
    let [fx,fy,fz] = [center[0]-eye[0], center[1]-eye[1], center[2]-eye[2]]; let fl = Math.sqrt(fx*fx+fy*fy+fz*fz) || 1; fx/=fl; fy/=fl; fz/=fl;
    let [sx,sy,sz] = [fy*up[2]-fz*up[1], fz*up[0]-fx*up[2], fx*up[1]-fy*up[0]]; let sl = Math.sqrt(sx*sx+sy*sy+sz*sz) || 1; sx/=sl; sy/=sl; sz/=sl;
    const ux=sy*fz-sz*fy, uy=sz*fx-sx*fz, uz=sx*fy-sy*fx;
    return new Float32Array([ sx, ux, -fx, 0, sy, uy, -fy, 0, sz, uz, -fz, 0, -(sx*eye[0]+sy*eye[1]+sz*eye[2]), -(ux*eye[0]+uy*eye[1]+uz*eye[2]), (fx*eye[0]+fy*eye[1]+fz*eye[2]), 1 ]);
  }

  _eye() {
    const { theta, phi, radius, target } = this.camera;
    return [ target[0] + radius * Math.sin(phi) * Math.sin(theta), target[1] + radius * Math.cos(phi), target[2] + radius * Math.sin(phi) * Math.cos(theta) ];
  }

  render() {
    if (!this.splatCount) return;
    const gl = this.gl; const { width: W, height: H } = this.canvas;
    gl.viewport(0, 0, W, H); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);

    const up = this.cfg.upVector || [0, 1, 0]; const eye = this._eye(); const view = this._lookAt(eye, this.camera.target, up); const proj = this._perspective(this.camera.fov, W / H, 0.01, 1000);

    if (this._geoNeedsRebuild && this._pendingSplats) this._buildGeoWithView(view, W, H);

    gl.useProgram(this.prog); gl.uniformMatrix4fv(this.u.view, false, view); gl.uniformMatrix4fv(this.u.proj, false, proj); gl.uniform2f(this.u.vp, W, H);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

    const FPV = 13, STRIDE = FPV * 4, { uv, center, axes0, axes1, color } = this.a;
    gl.enableVertexAttribArray(uv); gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, STRIDE, 0); gl.enableVertexAttribArray(center); gl.vertexAttribPointer(center, 3, gl.FLOAT, false, STRIDE, 2*4); gl.enableVertexAttribArray(axes0); gl.vertexAttribPointer(axes0, 2, gl.FLOAT, false, STRIDE, 5*4); gl.enableVertexAttribArray(axes1); gl.vertexAttribPointer(axes1, 2, gl.FLOAT, false, STRIDE, 7*4); gl.enableVertexAttribArray(color); gl.vertexAttribPointer(color, 4, gl.FLOAT, false, STRIDE, 9*4);
    gl.drawArrays(gl.TRIANGLES, 0, this.splatCount * 6); this.dirty = false;
  }
  _log(msg) { if (this.cfg.debug) console.log("[visor-splat]", msg); }
}