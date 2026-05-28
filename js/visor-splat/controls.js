/**
 * controls.js — OMH Estudio | Visor Gaussian Splatting
 */

export class VisorControls {

  constructor(renderer, els, cfg, ui, wrap) {
    this.renderer = renderer;
    this.els      = els;
    this.cfg      = cfg;
    this.ui       = ui;
    this.wrap     = wrap;

    this.autoRot  = cfg.autoRotate;
    this._prevT   = 0;

    this._fovValues = [35, 55, 75, 90];
  }

  init() {
    this._bindMouseEvents();
    this._bindTouchEvents();
    this._bindButtons();
    this._bindResize();
    this._startLoop();
  }

  _bindMouseEvents() {
    const { canvas } = this.els;
    let dragging = false, rightDrag = false, lastX = 0, lastY = 0;

    canvas.addEventListener("mousedown", e => {
      dragging  = true;
      rightDrag = e.button === 2;
      lastX     = e.clientX;
      lastY     = e.clientY;
      this.els.hint.classList.remove("show");
    });

    window.addEventListener("mouseup", () => { dragging = false; });
    canvas.addEventListener("contextmenu", e => e.preventDefault());

    window.addEventListener("mousemove", e => {
      if (!dragging || !this.renderer.splatCount) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (rightDrag) {
        const s = this.renderer.camera.radius * 0.001;
        const theta = this.renderer.camera.theta;
        this.renderer.camera.target[0] -= Math.cos(theta) * dx * s;
        this.renderer.camera.target[2] -= Math.sin(theta) * dx * s;
        this.renderer.camera.target[1] += dy * s;
      } else {
        this.renderer.camera.theta += dx * 0.008;
        this.renderer.camera.phi = Math.max(
          0.05,
          Math.min(Math.PI - 0.05, this.renderer.camera.phi + dy * 0.008)
        );
      }
      this._markDirty();
    });

    canvas.addEventListener("wheel", e => {
      e.preventDefault();
      this.renderer.camera.radius = Math.max(
        0.05,
        this.renderer.camera.radius * (1 + e.deltaY * 0.001)
      );
      this._markDirty();
    }, { passive: false });
  }

  _bindTouchEvents() {
    const { canvas } = this.els;
    let t0 = null, lastDist = 0;

    canvas.addEventListener("touchstart", e => {
      e.preventDefault();
      const ts = e.touches;
      t0 = { x: ts[0].clientX, y: ts[0].clientY };
      if (ts.length >= 2) {
        lastDist = Math.hypot(ts[1].clientX - ts[0].clientX, ts[1].clientY - ts[0].clientY);
      }
      this.els.hint.classList.remove("show");
    }, { passive: false });

    canvas.addEventListener("touchmove", e => {
      e.preventDefault();
      if (!this.renderer.splatCount) return;
      const ts = e.touches;

      if (ts.length === 1 && t0) {
        const dx = ts[0].clientX - t0.x;
        const dy = ts[0].clientY - t0.y;
        t0 = { x: ts[0].clientX, y: ts[0].clientY };
        this.renderer.camera.theta += dx * 0.012;
        this.renderer.camera.phi = Math.max(
          0.05,
          Math.min(Math.PI - 0.05, this.renderer.camera.phi + dy * 0.012)
        );
        this._markDirty();
      }

      if (ts.length >= 2) {
        const dist = Math.hypot(
          ts[1].clientX - ts[0].clientX,
          ts[1].clientY - ts[0].clientY
        );
        this.renderer.camera.radius = Math.max(
          0.05,
          this.renderer.camera.radius * (lastDist / dist)
        );
        lastDist = dist;
        t0 = { x: ts[0].clientX, y: ts[0].clientY };
        this._markDirty();
      }
    }, { passive: false });
  }

  _bindButtons() {
    const { els, cfg, renderer, ui } = this;

    if (els.btnRst) {
      els.btnRst.addEventListener("click", () => {
        renderer.resetCamera();
      });
    }

    if (els.btnAr) {
      if (this.autoRot) els.btnAr.classList.add("active");
      els.btnAr.addEventListener("click", () => {
        this.autoRot = !this.autoRot;
        els.btnAr.classList.toggle("active", this.autoRot);
      });
    }

    if (els.btnFov) {
      els.btnFov.addEventListener("click", () => {
        let idx = this._fovValues.indexOf(renderer.camera.fov);
        if (idx === -1) idx = 1;
        renderer.camera.fov = this._fovValues[(idx + 1) % this._fovValues.length];
        if (els.fovVal) els.fovVal.textContent = renderer.camera.fov;
        this._markDirty();
      });
    }

    if (els.btnFs) {
      els.btnFs.addEventListener("click", () => ui.toggleFullscreen());
      document.addEventListener("fullscreenchange", () =>
        ui.onFullscreenChange(cfg, () => this._onResize())
      );
    }

    if (els.btnShare) {
      els.btnShare.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const original = els.btnShare.innerHTML;
          els.btnShare.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>`;
          setTimeout(() => { els.btnShare.innerHTML = original; }, 1500);
        });
      });
    }

    if (els.btnTour && cfg.tourUrl) {
      els.btnTour.addEventListener("click", () => {
        window.open(cfg.tourUrl, "_blank");
      });
    }

    // ── CAMBIO ENTRE SPLAT Y 360 ──
    if (els.btnExt && els.btnInt) {
      els.btnExt.addEventListener("click", () => {
        if (els.btnExt.classList.contains("active")) return;
        els.btnExt.classList.add("active");
        els.btnInt.classList.remove("active");
        ui.switchView("exterior");
      });
      els.btnInt.addEventListener("click", () => {
        if (els.btnInt.classList.contains("active")) return;
        els.btnInt.classList.add("active");
        els.btnExt.classList.remove("active");
        ui.switchView("interior");
      });
    }

    // ── CONEXIÓN DE GIROSCOPIO (CRUZA AL IFRAME) ──
    if (els.btnGiroUi) {
      els.btnGiroUi.addEventListener("click", () => {
        const iframe = els.iframe360;
        if (iframe && iframe.contentDocument) {
          // Buscamos el botón nativo del giroscopio dentro del iframe y hacemos clic
          const btnGiroNativo = iframe.contentDocument.querySelector('.v360-btn-giro');
          if (btnGiroNativo) {
            btnGiroNativo.click();
            // Alternamos el estado visual de nuestro botón UI
            els.btnGiroUi.classList.toggle("active");
          }
        }
      });
    }

    // ── HOTSPOTS ──
    if (cfg.hotspots && cfg.hotspots.length > 0) {
      cfg.hotspots.forEach(hs => {
        const el = document.getElementById(`hs-${hs.id}`);
        if (!el) return;

        el.addEventListener("click", () => {
          ui.closeInfoPanel();
          
          if (hs.action === "interior") {
            if (els.btnInt) els.btnInt.click();
          } 
          else if (hs.url) {
            window.open(hs.url, "_blank");
          } 
          else if (hs.image) {
            let html = `<img src="${hs.image}" alt="${hs.label}">`;
            html += `<h3>${hs.label}</h3>`;
            if (hs.text) {
              html += `<p>${hs.text}</p>`;
            }
            ui.openModal(html);
          }
        });
      });
    }

    // ── MODAL ──
    if (els.modalClose) els.modalClose.addEventListener("click", () => ui.closeModal());
    if (els.modal) {
      els.modal.addEventListener("click", (e) => {
        if (e.target === els.modal) ui.closeModal();
      });
    }

    // ── PANEL DE INFORMACIÓN ──
    if (els.btnInfo) {
      els.btnInfo.addEventListener("click", (e) => {
        e.stopPropagation(); 
        if (cfg.infoHtml) {
          ui.toggleInfoPanel(cfg.infoHtml);
        } else {
          ui.toggleInfoPanel(`<h3>${cfg.title || 'Información'}</h3><p>No se ha cargado una ficha técnica para este modelo.</p>`);
        }
      });
    }
    if (els.infoClose) els.infoClose.addEventListener("click", () => ui.closeInfoPanel());
  }

  _bindResize() {
    new ResizeObserver(() => this._onResize()).observe(this.wrap);
    this._onResize();
  }

  _onResize() {
    const dpr = window.devicePixelRatio || 1;
    this.els.canvas.width  = this.wrap.clientWidth * dpr;
    this.els.canvas.height = this.wrap.clientHeight * dpr;
    this._markDirty();
  }

  _updateHotspots() {
    if (!this.cfg.hotspots || !this.renderer.splatCount) return;
    const dpr = window.devicePixelRatio || 1;

    this.cfg.hotspots.forEach(hs => {
      const el = document.getElementById(`hs-${hs.id}`);
      if (!el) return;

      const screenPos = this.renderer.projectToScreen(hs.position);

      if (screenPos) {
        el.style.display = "flex";
        el.style.left = (screenPos.x / dpr) + "px";
        el.style.top  = (screenPos.y / dpr) + "px";
      } else {
        el.style.display = "none";
      }
    });
  }

  _startLoop() {
    const loop = (t) => {
      requestAnimationFrame(loop);
      if (!this.renderer.splatCount) return;

      const dt = t - this._prevT;
      this._prevT = t;

      if (this.autoRot) {
        this.renderer.camera.theta +=
          this.cfg.autoRotateSpeed * dt * 0.001 * (Math.PI / 180);
        this._markDirty();
      }

      this._applyLimits();
      if (this.renderer.dirty) this.renderer.render();
      this._updateHotspots();
      this._drawGizmo();
    };
    requestAnimationFrame(loop);
  }

  _applyLimits() {
    const L = this.cfg.cameraLimits || {};
    const cam = this.renderer.camera;
    const phiMin    = L.phiMin    ?? 0.3;
    const phiMax    = L.phiMax    ?? 2.4;
    const radiusMin = L.radiusMin ?? 1.5;
    const radiusMax = L.radiusMax ?? 12.0;

    const prevPhi    = cam.phi;
    const prevRadius = cam.radius;

    cam.phi    = Math.max(phiMin,    Math.min(phiMax,    cam.phi));
    cam.radius = Math.max(radiusMin, Math.min(radiusMax, cam.radius));

    if (cam.phi !== prevPhi || cam.radius !== prevRadius) {
      this._markDirty();
    }
  }

  _markDirty() {
    this.renderer.dirty            = true;
    this.renderer._geoNeedsRebuild = true;
  }

  _drawGizmo() {
    const canvas = document.getElementById("omh-gizmo");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2, len = 26;

    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    ctx.arc(cx, cy, cx, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fill();

    const { theta, phi } = this.renderer.camera;
    const up = this.cfg.upVector || [0, 1, 0];

    const sinP = Math.sin(phi), cosP = Math.cos(phi);
    const sinT = Math.sin(theta), cosT = Math.cos(theta);
    const fwd = [-sinP * sinT, -cosP, -sinP * cosT];

    let rx = fwd[1]*up[2] - fwd[2]*up[1];
    let ry = fwd[2]*up[0] - fwd[0]*up[2];
    let rz = fwd[0]*up[1] - fwd[1]*up[0];
    const rl = Math.sqrt(rx*rx + ry*ry + rz*rz) || 1;
    rx /= rl; ry /= rl; rz /= rl;

    const cu = [
      ry*fwd[2] - rz*fwd[1],
      rz*fwd[0] - rx*fwd[2],
      rx*fwd[1] - ry*fwd[0],
    ];

    const project = (ax) => ({
      sx:    ax[0]*rx    + ax[1]*ry    + ax[2]*rz,
      sy:  -(ax[0]*cu[0] + ax[1]*cu[1] + ax[2]*cu[2]),
      depth: ax[0]*fwd[0] + ax[1]*fwd[1] + ax[2]*fwd[2],
    });

    const axes = [
      { label: "X", color: "#ff4444", axis: [1, 0, 0] },
      { label: "Y", color: "#44dd44", axis: [0, 1, 0] },
      { label: "Z", color: "#4488ff", axis: [0, 0, 1] },
    ].map(a => ({ ...a, ...project(a.axis) }));

    axes.sort((a, b) => a.depth - b.depth);

    for (const ax of axes) {
      const ex = cx + ax.sx * len;
      const ey = cy + ax.sy * len;
      const alpha = 0.35 + 0.65 * Math.max(0, (ax.depth + 1) / 2);

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = ax.color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fillStyle = ax.color;
      ctx.fill();

      ctx.globalAlpha = Math.max(0.6, alpha);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 8px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ax.label, ex, ey);
    }
    ctx.globalAlpha = 1;
  }
}