/**
 * ui.js — OMH Estudio | Capa de Interfaz, Estilos y Hotspots
 */

export const ICONS = {
  autorot:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.32-9.52l-1.02.51"/></svg>`,
  reset:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  fullscr:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
  exitfull: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/></svg>`,
  tour:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20z"/><path d="M2 12h20"/></svg>`,
  info:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  cursor:   `<svg viewBox="0 0 24 24"><path fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" d="M4 4l7.07 17 2.51-7.39L21 11.07z"/></svg>`,
  exterior: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h18M5 10l1.5-4.5A2 2 0 0 1 8.4 4h7.2a2 2 0 0 1 1.9 1.5L19 10m-16 0v10h16V10M8 14v4m8-4v4"/></svg>`,
  interior: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 15v7M7.5 10l-6-4M16.5 10l6-4"/></svg>`,
  gyro:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  eye:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
};

const CSS = `
  .omh-wrap { position: relative; width: 100%; max-width: 1400px; margin: 0 auto; overflow: hidden; background: var(--negro, #0a0a0a); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; }
  .omh-wrap.fullscreen { max-width: none; border-radius: 0; border: none; }
  .omh-wrap.fullscreen, .omh-wrap.fullscreen * { cursor: default !important; }
  .omh-wrap.fullscreen canvas { cursor: grab !important; }
  .omh-wrap.fullscreen canvas:active { cursor: grabbing !important; }
  .omh-wrap.fullscreen button, .omh-wrap.fullscreen .omh-hotspot { cursor: pointer !important; }
  
  .omh-wrap canvas { display: block; width: 100%; height: 100%; touch-action: none; outline: none; }
  .omh-loader { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.2rem; background: var(--negro, #000); z-index: 10; transition: opacity 0.6s ease; }
  .omh-loader.out { opacity: 0; pointer-events: none; }
  .omh-ring { width: 48px; height: 48px; border: 1.5px solid rgba(255,255,255,0.07); border-top-color: var(--color-seccion); border-radius: 50%; animation: omhSpin .85s linear infinite; }
  @keyframes omhSpin { to { transform: rotate(360deg); } }
  .omh-lbl { font-family: 'Lexend Tera', sans-serif; font-size: .5rem; letter-spacing: .22em; color: var(--color-seccion); text-transform: uppercase; }
  .omh-bar-wrap { width: 140px; height: 1px; background: rgba(255,255,255,0.07); }
  .omh-bar { height: 100%; width: 0%; background: var(--color-seccion); transition: width .2s ease; }
  .omh-pct { font-family: 'Raleway', sans-serif; font-size: .6rem; letter-spacing: .1em; color: rgba(255,255,255,.25); }
  .omh-error { position: absolute; inset: 0; display: none; flex-direction: column; align-items: center; justify-content: center; gap: .8rem; background: var(--negro, #000); z-index: 20; }
  .omh-error.show { display: flex; }
  .omh-error-icon { font-size: 1.8rem; opacity: .35; }
  .omh-error-title { font-family: 'Lexend Tera', sans-serif; font-size: .48rem; letter-spacing: .2em; color: rgba(255,255,255,.3); text-transform: uppercase; text-align: center; }
  .omh-error-msg { font-family: 'Raleway', monospace; font-size: .68rem; color: rgba(255,255,255,.18); max-width: 340px; text-align: center; line-height: 1.6; }
  .omh-ui-layer { position: absolute; inset: 0; pointer-events: none; z-index: 5; padding: 30px 40px; display: flex; flex-direction: column; justify-content: space-between; opacity: 0; transition: opacity 0.5s ease 0.3s; }
  .omh-ui-layer.show { opacity: 1; }
  .omh-top-left .omh-sub { font-family: 'Lexend Tera', sans-serif; font-size: 0.6rem; font-weight: bold; color: var(--color-seccion); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; line-height: 1; }
  .omh-top-left .omh-tit { font-family: 'Lexend Tera', sans-serif; font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0; letter-spacing: 0.05em; line-height: 1; }
  .omh-top-right { display: flex; gap: 10px; position: absolute; top: 30px; right: 40px; }
  
  .omh-bottom-left { display: flex; gap: 10px; align-items: center; position: absolute; bottom: 30px; left: 40px; transition: all 0.4s ease; }
  .omh-bottom-right { position: absolute; bottom: 30px; right: 40px; }
  .omh-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.15); margin: 0 10px; transition: opacity 0.3s ease; }
  
  .omh-wrap.view-interior .splat-btn-hide { display: none !important; }
  
  .tour-btn-show { display: none !important; }
  .omh-wrap.view-interior .tour-btn-show { display: flex !important; }
  @media (min-width: 769px) { .mobile-only { display: none !important; } }

  .omh-btn-rect { pointer-events: auto; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.15); border-radius: 2px; color: rgba(255,255,255,0.6); font-family: 'Lexend Tera', sans-serif; font-size: 0.55rem; letter-spacing: 0.15em; font-weight: bold; padding: 10px 16px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; white-space: nowrap; }
  .omh-btn-rect svg { width: 14px; height: 14px; flex-shrink: 0; }
  .omh-btn-rect:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
  .omh-btn-rect.active { color: #fff; border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }
  .omh-btn-rect.accent { border-color: var(--color-seccion); color: var(--color-seccion); }
  .omh-btn-rect.accent:hover { background: var(--color-seccion); color: #000; }
  .omh-btn-sq { pointer-events: auto; width: 38px; height: 38px; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.15); border-radius: 2px; color: rgba(255,255,255,0.6); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; flex-shrink: 0; }
  .omh-btn-sq svg { width: 16px; height: 16px; }
  .omh-btn-sq:hover { border-color: rgba(255,255,255,0.5); color: #fff; }

  /* ── MODO MÓVIL (Responsivo y textos) ── */
  @media (max-width: 768px) {
    .omh-wrap { display: flex; flex-direction: column; }
    /* Anclaje estricto del título: obliga a terminar 150px antes del borde derecho */
    .omh-top-left { position: absolute; top: 20px; left: 20px; right: 150px; width: auto; z-index: 7; pointer-events: none; }
    .omh-top-left .omh-tit { font-size: clamp(1rem, 4.5vw, 1.25rem); line-height: 1.2; overflow-wrap: break-word; hyphens: auto; margin-top: 4px; pointer-events: auto; }
    
    .btn-text { display: none !important; }
    .omh-btn-rect { padding: 0 !important; width: 36px !important; height: 36px !important; justify-content: center !important; }
    .omh-btn-rect svg { margin: 0 !important; }
    .omh-ui-layer { padding: 20px; }
    .omh-top-right { top: 20px; right: 20px; gap: 6px; }
    .omh-bottom-left { bottom: 20px; left: 20px; gap: 6px; }
    .omh-bottom-right { bottom: 20px; right: 20px; }
    .omh-divider { display: none; }
    .omh-btn-sq { width: 34px; height: 34px; }
    #omh-gizmo { display: none !important; opacity: 0 !important; pointer-events: none !important; }
  }

  .omh-hotspot { position: absolute; width: 46px; height: 46px; padding: 10px; box-sizing: border-box; background: var(--color-seccion); border-radius: 50%; transform: translate(-50%, -50%); cursor: pointer; z-index: 6; box-shadow: 0 0 0 4px rgba(255,255,255,0.15); transition: transform 0.2s, background 0.2s; pointer-events: auto; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .omh-hotspot:hover { transform: translate(-50%, -50%) scale(1.15); }
  .omh-hs-label { position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); color: #fff; padding: 6px 10px; border-radius: 4px; font-size: 0.55rem; font-family: 'Lexend Tera', sans-serif; letter-spacing: 0.1em; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; border: 1px solid rgba(255,255,255,0.1); }
  .omh-hotspot:hover .omh-hs-label { opacity: 1; }
  .omh-hotspot--icon { background: transparent; box-shadow: none; border: none; padding: 0; width: 42px; height: 42px; }
  .omh-hotspot--icon:hover { background: transparent; }
  .omh-hs-icon-img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)); }
  
  .omh-modal { position: absolute; inset: 0; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 100; display: flex; align-items: center; justify-content: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
  .omh-modal.open { opacity: 1; pointer-events: auto; }
  .omh-modal-content { background: transparent; border: none; padding: 0; max-width: 550px; width: 85%; max-height: 85%; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
  .omh-modal-close { position: absolute; top: 15px; right: 15px; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; z-index: 10; }
  .omh-modal-close:hover { background: var(--color-seccion); color: #000; border-color: transparent; }
  .omh-modal-body { position: relative; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); padding: 30px; color: #fff; }
  .omh-modal-body:has(img) { background: transparent; border: none; padding: 0; }
  .omh-modal-body img { width: 100%; height: auto; display: block; }
  .omh-modal-body h3 { font-family: 'Lexend Tera', sans-serif; font-size: 1rem; color: var(--color-seccion); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 15px; }
  .omh-modal-body p { font-family: 'Raleway', sans-serif; font-size: 0.85rem; color: #e0e0e0; line-height: 1.6; margin-bottom: 10px; }
  .omh-modal-body:has(img)::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 40%, transparent 70%); pointer-events: none; z-index: 1; }
  .omh-modal-body:has(img) h3 { position: absolute; bottom: 50px; left: 25px; right: 25px; z-index: 2; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.8); }
  .omh-modal-body:has(img) p { position: absolute; bottom: 20px; left: 25px; right: 25px; z-index: 2; margin: 0; text-shadow: 0 1px 3px rgba(0,0,0,0.9); }
  
  .omh-info-panel { position: absolute; top: 20px; right: -360px; width: 320px; max-height: calc(100% - 100px); background: rgba(15, 15, 15, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 25px; color: #fff; z-index: 90; box-shadow: -5px 10px 30px rgba(0,0,0,0.5); transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow-y: auto; }
  .omh-info-panel.open { right: 20px; }
  .omh-info-panel-close { position: absolute; top: 12px; right: 12px; background: transparent; border: none; color: rgba(255,255,255,0.4); font-size: 1.1rem; cursor: pointer; transition: 0.2s; }
  .omh-info-panel-close:hover { color: var(--color-seccion); }
  .omh-info-panel h3 { font-family: 'Lexend Tera', sans-serif; font-size: 0.9rem; color: var(--color-seccion); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 15px; padding-right: 20px; }
  .omh-info-panel p { font-family: 'Raleway', sans-serif; font-size: 0.8rem; color: #e0e0e0; line-height: 1.6; margin-bottom: 10px; }
  
  .omh-360-layer { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 4; opacity: 0; pointer-events: none; transition: opacity 0.6s ease; border: none; background: transparent; }
  .omh-360-layer.activa { opacity: 1; pointer-events: auto; }
  #omh-canvas, #omh-hotspots-layer { transition: opacity 0.6s ease; }
  .splat-oculto { opacity: 0 !important; pointer-events: none !important; }

  @media (max-width: 768px) {
    .omh-modal-content { max-width: 95%; padding: 20px; }
    .omh-info-panel { width: calc(100% - 40px); }
  }

  #omh-gizmo { position: absolute; bottom: 30px; right: 90px; width: 80px; height: 80px; pointer-events: none; z-index: 7; opacity: 0; transition: opacity 0.5s ease 0.3s; }
  #omh-gizmo.show { opacity: 1; }

  /* ── FALSO FULLSCREEN ── */
  .omh-wrap.fake-fullscreen { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100dvh !important; z-index: 999999 !important; border-radius: 0 !important; border: none !important; margin: 0 !important; }

  /* ── MODO ZEN (Ahora oculta también los de utilidades pero respeta el botón Zen) ── */
  .omh-wrap.zen-mode .omh-top-left, 
  .omh-wrap.zen-mode .omh-bottom-left, 
  .omh-wrap.zen-mode .omh-bottom-right, 
  .omh-wrap.zen-mode #omh-hotspots-layer, 
  .omh-wrap.zen-mode #omh-gizmo, 
  .omh-wrap.zen-mode #btn-info, 
  .omh-wrap.zen-mode #btn-fs { 
      opacity: 0 !important; 
      pointer-events: none !important; 
      transition: opacity 0.3s ease; 
  }
`;

const TEMPLATES = {
  auto: (cfg, ICONS) => `
    <div class="omh-top-left"><div class="omh-sub">${cfg.subtitle}</div><h2 class="omh-tit">${cfg.title}</h2></div>
    <div class="omh-top-right">
      <button class="omh-btn-sq" id="btn-info" title="Información">${ICONS.info}</button>
      <button class="omh-btn-sq" id="btn-fs" title="Pantalla completa">${ICONS.fullscr}</button>
      <button class="omh-btn-sq" id="btn-zen" title="Ocultar interfaz">${ICONS.eyeOff}</button>
    </div>
    <div class="omh-bottom-left">
      <button class="omh-btn-rect splat-btn-hide" id="btn-rst">${ICONS.reset} <span class="btn-text">Centrar</span></button>
      <button class="omh-btn-rect splat-btn-hide" id="btn-ar">${ICONS.autorot} <span class="btn-text">Auto-rotar</span></button>
      <div class="omh-divider splat-btn-hide"></div>
      <button class="omh-btn-rect active" id="btn-ext">${ICONS.exterior} <span class="btn-text">${cfg.labelExterior || 'Exterior'}</span></button>
      <button class="omh-btn-rect" id="btn-int">${ICONS.interior} <span class="btn-text">${cfg.labelInterior || 'Interior'}</span></button>
      <button class="omh-btn-rect tour-btn-show mobile-only" id="btn-giro-ui">${ICONS.gyro} <span class="btn-text">Giroscopio</span></button>
    </div>
  `,
  showroom: (cfg, ICONS) => `
    <div class="omh-top-left"><div class="omh-sub">${cfg.subtitle}</div><h2 class="omh-tit">${cfg.title}</h2></div>
    <div class="omh-top-right">
      <button class="omh-btn-sq" id="btn-info" title="Información">${ICONS.info}</button>
      <button class="omh-btn-sq" id="btn-fs" title="Pantalla completa">${ICONS.fullscr}</button>
      <button class="omh-btn-sq" id="btn-zen" title="Ocultar interfaz">${ICONS.eyeOff}</button>
    </div>
    <div class="omh-bottom-left">
      <button class="omh-btn-rect splat-btn-hide" id="btn-rst">${ICONS.reset} <span class="btn-text">Centrar</span></button>
      <button class="omh-btn-rect splat-btn-hide" id="btn-ar">${ICONS.autorot} <span class="btn-text">Auto-rotar</span></button>
    </div>
  `,
  producto: (cfg, ICONS) => `<div class="omh-top-right"><button class="omh-btn-sq" id="btn-fs" title="Pantalla completa">${ICONS.fullscr}</button></div><div class="omh-bottom-left"><button class="omh-btn-rect splat-btn-hide" id="btn-rst">${ICONS.reset} <span class="btn-text">Centrar</span></button><button class="omh-btn-rect splat-btn-hide" id="btn-ar">${ICONS.autorot} <span class="btn-text">Auto-rotar</span></button></div>`,
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
    s.id = "omh-visor-css"; s.textContent = CSS; document.head.appendChild(s);
  }

  build() {
    this.injectCSS();
    const template = TEMPLATES[this.cfg.mode] || TEMPLATES.auto;
    const uiInner  = template(this.cfg, ICONS);

    let hotspotsHtml = "";
    if (this.cfg.hotspots && this.cfg.hotspots.length > 0) {
      this.cfg.hotspots.forEach(hs => {
        const iconContent = hs.icon ? `<img src="${hs.icon}" class="omh-hs-icon-img" alt="${hs.label}">` : (hs.emoji || '');
        let extraClass = (hs.icon && hs.bg !== true) ? "omh-hotspot--icon" : "";
        hotspotsHtml += `<div class="omh-hotspot ${extraClass}" id="hs-${hs.id}" style="display:none;">${iconContent}<span class="omh-hs-label">${hs.label}</span></div>`;
      });
    }

    this.container.innerHTML = `
      <div class="omh-wrap" id="omh-wrap" style="height:${this.cfg.height}">
        <canvas id="omh-canvas" tabindex="0"></canvas>
        <iframe id="omh-360-iframe" class="omh-360-layer" allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking" frameborder="0"></iframe>
        <div class="omh-ui-layer" id="omh-ui-layer">${uiInner}</div>
        <div id="omh-hotspots-layer" style="position:absolute; inset:0; pointer-events:none; z-index:6; overflow:hidden;">${hotspotsHtml}</div>
        <div class="omh-hint" id="omh-hint"><div class="omh-hint-inner"><div class="omh-hint-icon">${ICONS.cursor}</div><span class="omh-hint-txt">Arrastra para rotar · Scroll para zoom</span></div></div>
        <div class="omh-loader" id="omh-loader"><div class="omh-ring"></div><div class="omh-lbl">Cargando modelo</div><div class="omh-bar-wrap"><div class="omh-bar" id="omh-bar"></div></div><div class="omh-pct" id="omh-pct">0%</div></div>
        <div class="omh-error" id="omh-error"><div class="omh-error-icon">⚠</div><div class="omh-error-title">Error al cargar</div><div class="omh-error-msg" id="omh-error-msg"></div></div>
        <canvas id="omh-gizmo" width="80" height="80"></canvas>
        <div class="omh-modal" id="omh-modal"><div class="omh-modal-content"><button class="omh-modal-close" id="btn-modal-close">&times;</button><div class="omh-modal-body" id="omh-modal-body"></div></div></div>
        <div class="omh-info-panel" id="omh-info-panel"><button class="omh-info-panel-close" id="omh-info-close">&times;</button><div id="omh-info-content"></div></div>
      </div>
    `;

    const g = id => document.getElementById(id);
    this.els = {
      wrap: g("omh-wrap"), canvas: g("omh-canvas"), iframe360: g("omh-360-iframe"),
      uiLayer: g("omh-ui-layer"), hsLayer: g("omh-hotspots-layer"),
      hint: g("omh-hint"), loader: g("omh-loader"), bar: g("omh-bar"), pct: g("omh-pct"),
      errBox: g("omh-error"), errMsg: g("omh-error-msg"), modal: g("omh-modal"), modalBody: g("omh-modal-body"), modalClose: g("btn-modal-close"),
      btnInfo: g("btn-info"), btnRst: g("btn-rst"), btnAr: g("btn-ar"), btnZen: g("btn-zen"),
      btnFs: g("btn-fs"), btnTour: g("btn-tour"), btnExt: g("btn-ext"), btnInt: g("btn-int"),
      btnGiroUi: g("btn-giro-ui"),
      infoPanel: g("omh-info-panel"), infoContent: g("omh-info-content"), infoClose: g("omh-info-close")
    };

    return this.els;
  }

  setProgress(p) { const v = Math.round(p * 100); if (this.els.bar) this.els.bar.style.width = v + "%"; if (this.els.pct) this.els.pct.textContent = v + "%"; }
  showReady() { this.els.loader.classList.add("out"); this.els.uiLayer.classList.add("show"); this.els.hint.classList.add("show"); setTimeout(() => this.els.hint.classList.remove("show"), 3500); const gizmo = document.getElementById("omh-gizmo"); if (gizmo) gizmo.classList.add("show"); }
  showError(msg) { this.els.loader.classList.add("out"); this.els.errBox.classList.add("show"); this.els.errMsg.textContent = msg; }
  
  toggleFullscreen() {
    const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (esMovil || !this.els.wrap.requestFullscreen) {
      const estaEnFakeFS = this.els.wrap.classList.toggle("fake-fullscreen");
      this.els.wrap.classList.toggle("fullscreen", estaEnFakeFS);
      if (this.els.btnFs) this.els.btnFs.innerHTML = estaEnFakeFS ? ICONS.exitfull : ICONS.fullscr;
      this.els.wrap.style.height = estaEnFakeFS ? "100dvh" : this.cfg.height;
      window.dispatchEvent(new Event('resize'));
    } else {
      if (!document.fullscreenElement) {
        this.els.wrap.requestFullscreen().catch(() => this.els.wrap.classList.add("fake-fullscreen"));
      } else { document.exitFullscreen(); }
    }
  }
  
  onFullscreenChange(cfg, onResize) { const full = !!document.fullscreenElement; this.els.wrap.classList.toggle("fullscreen", full); if (this.els.btnFs) this.els.btnFs.innerHTML = full ? ICONS.exitfull : ICONS.fullscr; this.els.wrap.style.height = full ? "100dvh" : cfg.height; setTimeout(onResize, 80); }
  
  openModal(htmlContent) { if (!this.els.modal || !this.els.modalBody) return; this.els.modalBody.innerHTML = htmlContent; this.els.modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; this.els.modal.classList.add("open"); }
  closeModal() { if (this.els.modal) this.els.modal.classList.remove("open"); }
  toggleInfoPanel(htmlContent) { if (!this.els.infoPanel || !this.els.infoContent) return; if (this.els.infoPanel.classList.contains("open")) { this.els.infoPanel.classList.remove("open"); } else { this.els.infoContent.innerHTML = htmlContent; this.els.infoPanel.classList.add("open"); } }
  closeInfoPanel() { if (this.els.infoPanel) { this.els.infoPanel.classList.remove("open"); } }

  switchView(vista) {
    const canvas = this.els.canvas, hsLayer = this.els.hsLayer, iframe = this.els.iframe360, gizmo = document.getElementById("omh-gizmo");
    if (vista === "interior" && iframe) {
      if (!iframe.src && this.cfg.tourUrl) { iframe.src = this.cfg.tourUrl; iframe.onload = () => { try { const colorPadre = getComputedStyle(document.body).getPropertyValue('--color-seccion').trim(); iframe.contentDocument.body.style.setProperty('--color-seccion', colorPadre); } catch(e) {} }; }
      canvas.classList.add("splat-oculto"); hsLayer.classList.add("splat-oculto"); if (gizmo) gizmo.classList.remove("show");
      this.els.wrap.classList.add("view-interior"); iframe.classList.add("activa");
    } else {
      canvas.classList.remove("splat-oculto"); hsLayer.classList.remove("splat-oculto"); if (gizmo) gizmo.classList.add("show");
      this.els.wrap.classList.remove("view-interior"); if (iframe) iframe.classList.remove("activa");
    }
  }
}