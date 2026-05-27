/**
 * ui.js — OMH Estudio | Capa de Interfaz, Estilos y Hotspots
 */

export const ICONS = {
  autorot:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.32-9.52l-1.02.51"/></svg>`,
  reset:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  fullscr:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  exitfull: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/></svg>`,
  share:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  tour:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20z"/><path d="M2 12h20"/></svg>`,
  fov:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`,
  info:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  cursor:   `<svg viewBox="0 0 24 24"><path fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>`,
};

const CSS = `
  .omh-wrap { position: relative; width: 100%; max-width: 1400px; margin: 0 auto; overflow: hidden; background: var(--negro, #0a0a0a); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; }
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
  .omh-bottom-right { position: absolute; bottom: 30px; right: 40px; }
  .omh-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.15); margin: 0 10px; }

  .omh-btn-rect { pointer-events: auto; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.15); border-radius: 2px; color: rgba(255,255,255,0.6); font-family: 'Lexend Tera', sans-serif; font-size: 0.55rem; letter-spacing: 0.15em; font-weight: bold; padding: 10px 16px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; white-space: nowrap; }
  .omh-btn-rect svg { width: 14px; height: 14px; flex-shrink: 0; }
  .omh-btn-rect:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
  .omh-btn-rect.active { color: #fff; border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }
  .omh-btn-rect.accent { border-color: var(--color-seccion, #ff6c00); color: var(--color-seccion, #ff6c00); }
  .omh-btn-rect.accent:hover { background: var(--color-seccion, #ff6c00); color: #000; }
  .omh-btn-sq { pointer-events: auto; width: 38px; height: 38px; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.15); border-radius: 2px; color: rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
  .omh-btn-sq svg { width: 16px; height: 16px; }
  .omh-btn-sq:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

  /* ── HOTSPOTS CSS ACTUALIZADO PARA EMOJIS ── */
  .omh-hotspot {
    position: absolute; width: 28px; height: 28px; /* Más grande para el emoji */
    background: var(--color-seccion, #ff6c00); border-radius: 50%;
    transform: translate(-50%, -50%); cursor: pointer; z-index: 6;
    box-shadow: 0 0 0 4px rgba(255,108,0,0.3);
    transition: transform 0.2s, background 0.2s; pointer-events: auto;
    display: flex; align-items: center; justify-content: center; font-size: 14px;
  }
  .omh-hotspot:hover { transform: translate(-50%, -50%) scale(1.2); }
  .omh-hs-label {
    position: absolute; top: -35px; left: 50%; transform: translateX(-50%);
    background: rgba(0,0,0,0.8); color: #fff; padding: 6px 10px;
    border-radius: 4px; font-size: 0.55rem; font-family: 'Lexend Tera', sans-serif; letter-spacing: 0.1em;
    white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s;
    border: 1px solid rgba(255,255,255,0.1);
  }
  .omh-hotspot:hover .omh-hs-label { opacity: 1; }
  
  /* Hotspot con imagen PNG: sin fondo, sin borde, solo el icono */
.omh-hotspot--icon {
  background: transparent;
  box-shadow: none;
  border: none;
  width: 36px;
  height: 36px;
}
.omh-hotspot--icon:hover {
  background: transparent;
}
.omh-hs-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
}

  /* ── MODAL ── */
  .omh-modal {
    position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    z-index: 100; display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
  }
  .omh-modal.open { opacity: 1; pointer-events: auto; }
  .omh-modal-content {
    background: var(--negro, #0a0a0a); border: 1px solid rgba(255,255,255,0.1);
    padding: 30px; border-radius: 6px; max-width: 80%; max-height: 85%;
    overflow-y: auto; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  }
  .omh-modal-close {
    position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.1);
    border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%;
    font-size: 1.2rem; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.2s;
  }
  .omh-modal-close:hover { background: var(--color-seccion, #ff6c00); color: #000; }
  .omh-modal-body img { width: 100%; border-radius: 4px; margin-bottom: 15px; }
  .omh-modal-body h3 { font-family: 'Lexend Tera', sans-serif; font-size: 1rem; color: var(--color-seccion, #ff6c00); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
  .omh-modal-body p { font-family: 'Raleway', sans-serif; font-size: 0.85rem; color: #ccc; line-height: 1.6; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .omh-ui-layer { padding: 20px; }
    .omh-top-right { top: 20px; right: 20px; gap: 6px; }
    .omh-bottom-left { bottom: 20px; left: 20px; flex-wrap: wrap; max-width: 65%; gap: 6px; }
    .omh-bottom-right { bottom: 20px; right: 20px; }
    .omh-divider { display: none; }
    .omh-top-left .omh-tit { font-size: 1.1rem; }
    .omh-btn-rect { padding: 8px 12px; font-size: 0.5rem; }
    .omh-btn-sq { width: 34px; height: 34px; }
    .omh-modal-content { max-width: 95%; padding: 20px; }
  }

  #omh-gizmo {
  position: absolute;
  bottom: 30px;
  right: 90px;   /* a la izquierda del botón fullscreen */
  width: 80px;
  height: 80px;
  pointer-events: none;
  z-index: 7;
  opacity: 0;
  transition: opacity 0.5s ease 0.3s;
}
#omh-gizmo.show { opacity: 1; }
`;

const TEMPLATES = {
  auto: (cfg, ICONS) => `
    <div class="omh-top-left">
      <div class="omh-sub">${cfg.subtitle}</div>
      <h2 class="omh-tit">${cfg.title}</h2>
    </div>
    <div class="omh-top-right">
      <button class="omh-btn-sq" id="btn-info"  title="Información">${ICONS.info}</button>
      <button class="omh-btn-sq" id="btn-fs"    title="Pantalla completa">${ICONS.fullscr}</button>
      <button class="omh-btn-sq" id="btn-share" title="Compartir enlace">${ICONS.share}</button>
    </div>
    <div class="omh-bottom-left">
      <button class="omh-btn-rect"        id="btn-rst">${ICONS.reset} Centrar</button>
      <button class="omh-btn-rect"        id="btn-ar">${ICONS.autorot} Auto-rotar</button>
      <button class="omh-btn-rect"        id="btn-fov">${ICONS.fov} FOV: ${cfg.defaultFov}°</button>
      <div class="omh-divider"></div>
      <button class="omh-btn-rect active" id="btn-ext">${cfg.labelExterior}</button>
      <button class="omh-btn-rect"        id="btn-int">${cfg.labelInterior}</button>
    </div>
    ${cfg.tourUrl ? `
    <div class="omh-bottom-right">
      <button class="omh-btn-rect accent" id="btn-tour">${ICONS.tour} Tour 360°</button>
    </div>` : ''}
  `,
  showroom: (cfg, ICONS) => `
    <div class="omh-top-left">
      <div class="omh-sub">${cfg.subtitle}</div>
      <h2 class="omh-tit">${cfg.title}</h2>
    </div>
    <div class="omh-top-right">
      <button class="omh-btn-sq" id="btn-info"  title="Información">${ICONS.info}</button>
      <button class="omh-btn-sq" id="btn-fs"    title="Pantalla completa">${ICONS.fullscr}</button>
      <button class="omh-btn-sq" id="btn-share" title="Compartir enlace">${ICONS.share}</button>
    </div>
    <div class="omh-bottom-left">
      <button class="omh-btn-rect"  id="btn-rst">${ICONS.reset} Centrar</button>
      <button class="omh-btn-rect"  id="btn-ar">${ICONS.autorot} Auto-rotar</button>
      <button class="omh-btn-rect"  id="btn-fov">${ICONS.fov} FOV: ${cfg.defaultFov}°</button>
      ${cfg.tourUrl ? `<div class="omh-divider"></div>
      <button class="omh-btn-rect accent" id="btn-tour">${ICONS.tour} Recorrido 360°</button>` : ''}
    </div>
  `,
  producto: (cfg, ICONS) => `
    <div class="omh-top-right">
      <button class="omh-btn-sq" id="btn-fs" title="Pantalla completa">${ICONS.fullscr}</button>
    </div>
    <div class="omh-bottom-left">
      <button class="omh-btn-rect" id="btn-rst">${ICONS.reset} Centrar</button>
      <button class="omh-btn-rect" id="btn-ar">${ICONS.autorot} Auto-rotar</button>
    </div>
  `,
  simple: (_cfg, _ICONS) => ``,
};

export class VisorUI {
  constructor(container, cfg) {
    this.container = container;
    this.cfg       = cfg;
    this.els       = {}; 
  }

  injectCSS() {
    if (document.getElementById("omh-visor-css")) return;
    const s = document.createElement("style");
    s.id          = "omh-visor-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  build() {
    this.injectCSS();

    const template = TEMPLATES[this.cfg.mode] || TEMPLATES.auto;
    const uiInner  = template(this.cfg, ICONS);

    // INYECCIÓN DE EMOJIS EN HOTSPOTS HTML
    let hotspotsHtml = "";
    if (this.cfg.hotspots && this.cfg.hotspots.length > 0) {
      this.cfg.hotspots.forEach(hs => {
        const iconContent = hs.icon
        ? `<img src="${hs.icon}" class="omh-hs-icon-img" alt="${hs.label}">`
        : (hs.emoji || '');
        hotspotsHtml += `<div class="omh-hotspot ${hs.icon ? 'omh-hotspot--icon' : ''}" id="hs-${hs.id}" style="display:none;">${iconContent}<span class="omh-hs-label">${hs.label}</span></div>`;
      });
    }

    this.container.innerHTML = `
      <div class="omh-wrap" id="omh-wrap" style="height:${this.cfg.height}">
        <canvas id="omh-canvas" tabindex="0"></canvas>

        <div class="omh-ui-layer" id="omh-ui-layer">
          ${uiInner}
        </div>

        <div id="omh-hotspots-layer" style="position:absolute; inset:0; pointer-events:none; z-index:6; overflow:hidden;">
          ${hotspotsHtml}
        </div>

        <div class="omh-hint" id="omh-hint">
          <div class="omh-hint-inner">
            <div class="omh-hint-icon">${ICONS.cursor}</div>
            <span class="omh-hint-txt">Arrastra para rotar · Scroll para zoom</span>
          </div>
        </div>

        <div class="omh-loader" id="omh-loader">
          <div class="omh-ring"></div>
          <div class="omh-lbl">Cargando modelo</div>
          <div class="omh-bar-wrap"><div class="omh-bar" id="omh-bar"></div></div>
          <div class="omh-pct" id="omh-pct">0%</div>
        </div>

        <div class="omh-error" id="omh-error">
          <div class="omh-error-icon">⚠</div>
          <div class="omh-error-title">Error al cargar</div>
          <div class="omh-error-msg" id="omh-error-msg"></div>
        </div>

        <canvas id="omh-gizmo" width="80" height="80"></canvas>

        <div class="omh-modal" id="omh-modal">
          <div class="omh-modal-content">
            <button class="omh-modal-close" id="btn-modal-close">&times;</button>
            <div class="omh-modal-body" id="omh-modal-body"></div>
          </div>
        </div>
      </div>
    `;

    const g = id => document.getElementById(id);
    this.els = {
      wrap:        g("omh-wrap"),
      canvas:      g("omh-canvas"),
      uiLayer:     g("omh-ui-layer"),
      hsLayer:     g("omh-hotspots-layer"),
      hint:        g("omh-hint"),
      loader:      g("omh-loader"),
      bar:         g("omh-bar"),
      pct:         g("omh-pct"),
      errBox:      g("omh-error"),
      errMsg:      g("omh-error-msg"),
      modal:       g("omh-modal"),
      modalBody:   g("omh-modal-body"),
      modalClose:  g("btn-modal-close"),
      
      btnInfo:     g("btn-info"),
      btnRst:      g("btn-rst"),
      btnAr:       g("btn-ar"),
      btnFov:      g("btn-fov"),
      btnFs:       g("btn-fs"),
      btnShare:    g("btn-share"),
      btnTour:     g("btn-tour"),
      btnExt:      g("btn-ext"),
      btnInt:      g("btn-int"),
    };

    return this.els;
  }

  setProgress(p) {
    const v = Math.round(p * 100);
    if (this.els.bar) this.els.bar.style.width = v + "%";
    if (this.els.pct) this.els.pct.textContent = v + "%";
  }

  showReady() {
    this.els.loader.classList.add("out");
    this.els.uiLayer.classList.add("show");
    this.els.hint.classList.add("show");
    setTimeout(() => this.els.hint.classList.remove("show"), 3500);
    const gizmo = document.getElementById("omh-gizmo");
    if (gizmo) gizmo.classList.add("show");
  }

  showError(msg) {
    this.els.loader.classList.add("out");
    this.els.errBox.classList.add("show");
    this.els.errMsg.textContent = msg;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.els.wrap.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onFullscreenChange(cfg, onResize) {
    const full = !!document.fullscreenElement;
    this.els.wrap.classList.toggle("fullscreen", full);
    if (this.els.btnFs)
      this.els.btnFs.innerHTML = full ? ICONS.exitfull : ICONS.fullscr;
    this.els.wrap.style.height = full ? "100dvh" : cfg.height;
    setTimeout(onResize, 80);
  }

  openModal(htmlContent) {
    if(!this.els.modal || !this.els.modalBody) return;
    this.els.modalBody.innerHTML = htmlContent;
    this.els.modal.classList.add("open");
  }

  closeModal() {
    if(this.els.modal) this.els.modal.classList.remove("open");
  }
}