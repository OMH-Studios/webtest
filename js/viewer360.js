/**
 * viewer360.js — Motor OMH Estudio (V14.3 - Ejes de Giroscopio Corregidos y Limitados)
 */
(function () {
  'use strict';

  // ─── DETECCIÓN MÓVIL ────────────────────────────────────────────────────────
  function isMobile() {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // ─── MODO STANDALONE: detectar si esta pestaña fue abierta por móvil ────────
  function detectarModoStandalone() {
    const params = new URLSearchParams(window.location.search);
    return params.get('v360frame') || params.get('v360fs') || null; 
  }

  function aplicarModoStandalone() {
    const css = document.createElement('style');
    css.id = 'v360-standalone-css';
    css.textContent = `
      body.v360-standalone > *:not(.omh-360-widget-standalone-wrap) {
        display: none !important;
      }
      .omh-360-widget-standalone-wrap {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        z-index: 99999 !important;
        background: #000;
      }
      .omh-360-widget-standalone-wrap .omh-360-widget {
        width: 100% !important;
        height: 100% !important;
        border-radius: 0 !important;
        border: none !important;
        margin: 0 !important;
        aspect-ratio: unset !important;
      }
    `;
    document.head.appendChild(css);
  }

  // ─── INYECCIÓN DE DEPENDENCIAS ──────────────────────────────────────────────
  function inyectarDependencias(callback) {
    if (document.getElementById('v360-styles')) {
      if (window.THREE) return callback();
      const t = setInterval(() => { if (window.THREE) { clearInterval(t); callback(); } }, 50);
      return;
    }

    const s = document.createElement('style');
    s.id = 'v360-styles';
    s.textContent = `
      .omh-360-widget { position: relative; display: block; overflow: hidden; background: #000; user-select: none; -webkit-user-select: none; }
      .v360-container { position: absolute; inset: 0; width: 100%; height: 100%; font-family: var(--v360-font, 'Raleway', sans-serif); color: #fff; }
      
      .v360-canvas-wrap { position: absolute; inset: 0; z-index: 1; cursor: grab; transition: filter 0.8s ease-in-out; }
      .v360-canvas-wrap:active { cursor: grabbing; }
      .v360-canvas-wrap.splash-blur { filter: blur(15px) brightness(0.5); transition: filter 1.5s ease-in-out; }
      .v360-canvas-wrap.motion-blur { filter: blur(4px) brightness(0.95); transition: filter 0.4s ease-in-out; }
      
      /* HUD Superior */
      .v360-hud { position: absolute; top: 0; left: 0; right: 0; padding: 1rem 1.2rem; background: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent); display: flex; justify-content: space-between; align-items: center; gap: 10px; z-index: 10; pointer-events: none; opacity: 0; transition: opacity 0.8s ease; }
      .v360-hud.visible { opacity: 1; }
      
      .v360-hud-left-group { display: flex; align-items: center; gap: 10px; pointer-events: all; }
      
      .v360-hud-logo { height: 20px; max-width: 90px; object-fit: contain; display: none; }
      .v360-hud-info { display: flex; flex-direction: column; justify-content: center; }
      .v360-hud-cliente { font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--v360-color-primario, #0178ff); font-weight: 700; line-height: 1; }
      .v360-hud-titulo { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; margin-top: 3px; line-height: 1; font-family: var(--v360-font-title, 'Lexend Tera', sans-serif); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
      
      .v360-acciones { display: flex; gap: 6px; pointer-events: all; align-items: center; margin-left: auto; }
      .v360-btn { width: 34px; height: 34px; border-radius: 50%; background: var(--v360-color-secundario, rgba(255,255,255,0.1)); border: 1px solid rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); font-size: 0.85rem; padding: 0; box-sizing: border-box; }
      .v360-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); border-color: rgba(255,255,255,0.4); }
      .v360-btn.activo { background: var(--v360-color-primario, #0178ff); border-color: transparent; color: #fff; }

      .v360-btn-fs { display: flex; }
      .v360-btn-giro { display: none; }
      .v360-btn-salir { display: none; } 
      
      @media (pointer: coarse) { 
        .v360-btn-fs { display: none !important; } 
        .v360-btn-giro { display: flex; }
        .v360-hud-logo { display: none !important; } 
        .v360-hud-titulo { max-width: 110px; }
      }
      
      /* Panel de Ficha Comercial */
      .v360-ficha-panel { position: absolute; top: 70px; left: 1.2rem; z-index: 90; background: rgba(10,10,10,0.96); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 1.2rem; width: 260px; pointer-events: all; display: none; backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .v360-ficha-titulo { font-family: var(--v360-font-title, 'Lexend Tera', sans-serif); font-size: 0.65rem; color: var(--v360-color-primario, #0178ff); margin-bottom: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
      .v360-ficha-item { margin-bottom: 0.7rem; font-size: 0.72rem; line-height: 1.4; color: rgba(255,255,255,0.85); }
      .v360-ficha-label { font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.4); display: block; margin-bottom: 1px; }

      /* Splash Screen */
      .v360-splash { position: absolute; inset: 0; z-index: 30; background: linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2)); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; box-sizing: border-box; text-align: center; transition: opacity 1s, visibility 1s; }
      .v360-splash-overlay { position: absolute; inset: 0; background: var(--v360-color-primario, #0178ff); opacity: 0.08; z-index: -1; }
      .v360-splash-logo { max-height: 50px; max-width: 200px; object-fit: contain; margin-bottom: 1.5rem; display: none; }
      .v360-splash-cliente { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--v360-color-primario, #0178ff); font-weight: 700; display: block; margin-bottom: 0.5rem; }
      .v360-splash-titulo { font-size: 1.3rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--v360-font-title, 'Lexend Tera', sans-serif); max-width: 500px; line-height: 1.3; margin-bottom: 2rem; text-shadow: 0 4px 20px rgba(0,0,0,0.6); }
      .v360-splash-bton-group { display: flex; gap: 1rem; align-items: center; }
      .v360-splash-btn { padding: 0.8rem 2rem; background: transparent; border: 1px solid rgba(255,255,255,0.4); border-radius: 40px; color: #fff; font-family: var(--v360-font, 'Raleway', sans-serif); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(8px); }
      .v360-splash-btn:hover { background: #fff; color: #000; border-color: #fff; transform: translateY(-2px); }
      .v360-maps-splash-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); display: none; align-items: center; justify-content: center; color: #fff; text-decoration: none; font-size: 1.1rem; transition: all 0.3s; backdrop-filter: blur(8px); }
      .v360-maps-splash-btn:hover { background: #4caf50; border-color: transparent; transform: scale(1.1); }
      .v360-splash.oculto { opacity: 0; pointer-events: none; visibility: hidden; }

      /* Minimap */
      .v360-minimap-wrapper { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 10; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; pointer-events: none; width: 90%; max-width: max-content; opacity: 0; transition: opacity 0.8s ease; }
      .v360-minimap-wrapper.visible { opacity: 1; }
      .v360-mm-toggle { padding: 0 12px; height: 24px; background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: var(--v360-color-primario, #0178ff); font-size: 0.55rem; font-weight: 700; letter-spacing: 0.12em; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; pointer-events: all; backdrop-filter: blur(10px); }
      .v360-minimap { display: flex; gap: 0.5rem; align-items: center; padding: 0.55rem 1.2rem; background: rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; backdrop-filter: blur(10px); pointer-events: all; max-width: 100%; overflow-x: auto; transition: all 0.3s ease; }
      .v360-minimap-wrapper.colapsado .v360-minimap { opacity: 0; transform: translateY(15px); pointer-events: none; visibility: hidden; height: 0; padding: 0; border-color: transparent; }
      .v360-mm-escena { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
      .v360-mm-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.3); }
      .v360-mm-escena.activa .v360-mm-dot { background: var(--v360-color-primario, #0178ff); transform: scale(1.4); }
      .v360-mm-label { font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4); white-space: nowrap; }
      .v360-mm-escena.activa .v360-mm-label { color: rgba(255,255,255,0.9); font-weight: 600; }

      /* Hotspots */
      .v360-hotspot-layer { position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: 0; transition: opacity 0.6s ease-in-out; }
      .v360-hotspot { position: absolute; pointer-events: all; cursor: pointer; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease; }
      .v360-hotspot:hover { transform: translate(-50%, -50%) scale(1.15) !important; }
      .v360-tooltip { position: absolute; background: rgba(10,10,10,0.96); color: #fff; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); max-width: 260px; pointer-events: none; opacity: 0; transition: opacity 0.2s ease; z-index: 20; transform: translate(-50%, calc(-100% - 15px)); line-height: 1.4; }
      .v360-editor-panel { position: absolute; top: 80px; right: 1.5rem; z-index: 100; background: rgba(8,8,8,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.2rem; width: 230px; pointer-events: all; display: none; }

      /* Spinner */
      .v360-spinner { position: absolute; bottom: 2rem; right: 2rem; z-index: 50; display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.6); font-size: 0.55rem; letter-spacing: 0.15em; text-transform: uppercase; background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
      .v360-spin-ring { width: 12px; height: 12px; border: 1.5px solid rgba(255,255,255,0.2); border-top-color: var(--v360-color-primario, #0178ff); border-radius: 50%; animation: v360spin 0.8s linear infinite; }
      @keyframes v360spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(s);

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  // ────────────────────────────────────────────────────────────────────────────
  class OMHWidget360 {
    constructor(contenedor, opcionesExtra) {
      this.contenedor    = contenedor;
      this.id            = Math.random().toString(36).substring(2, 9);
      this.configPath    = contenedor.getAttribute('data-config');
      this.autoIniciar   = opcionesExtra && opcionesExtra.autoIniciar ? true : false;

      if (!this.configPath) return console.error('Visor 360: Falta data-config.');

      this.tourIniciado       = false;
      this.modoEditor         = false;
      this.fichaActiva        = false;
      this.hotspotsData       = [];
      this.lastClickCoords    = { pitch: 0, yaw: 0 };
      this.cameraFOV          = 75;
      this.faseTransicion     = 'quieto';
      this.transitionProgress = 0;
      this.siguienteEscenaID  = null;

      // VARIABLES PARA GIROSCOPIO DE ALTA PRECISIÓN CALIBRADO
      this.giroscopioActivo   = false;
      this.targetLon          = 0; 
      this.targetLat          = 0;
      this.offsetLon          = 0; 
      this.offsetLat          = 0;

      this._textureCache = new Map();

      this.construirDOM();
      this.cargarConfig();
    }

    _disposeTex(tex) {
      if (!tex) return;
      tex.dispose();
      if (tex.image && tex.image.src) this._textureCache.delete(tex.image.src);
    }

    _cargarTextura(url, callback) {
      if (this._textureCache.has(url)) {
        callback(this._textureCache.get(url));
        return;
      }
      const loader = new THREE.TextureLoader();
      loader.load(url, tex => {
        tex.minFilter     = THREE.LinearFilter; 
        tex.generateMipmaps = false;
        this._textureCache.set(url, tex);
        callback(tex);
      });
    }

    construirDOM() {
      this.contenedor.innerHTML = `
        <div class="v360-container">
          <div class="v360-spinner" id="spin-${this.id}">
            <div class="v360-spin-ring"></div>
            <span id="spin-txt-${this.id}">Cargando...</span>
          </div>
          <div class="v360-canvas-wrap splash-blur" id="canvas-${this.id}"></div>
          <div class="v360-hotspot-layer" id="hs-${this.id}"></div>
          <div class="v360-tooltip" id="tt-${this.id}"></div>

          <div class="v360-ficha-panel" id="ficha-${this.id}">
            <div class="v360-ficha-titulo">Ficha Comercial</div>
            <div id="ficha-content-${this.id}"></div>
          </div>

          <div class="v360-hud" id="hud-${this.id}">
            <div class="v360-hud-left-group">
              <button class="v360-btn" id="btn-salir-${this.id}" title="Salir del Recorrido" style="display: ${this.autoIniciar ? 'flex' : 'none'}; background: rgba(220,20,20,0.85); font-weight: bold; border-color: transparent; box-shadow: 0 2px 8px rgba(0,0,0,0.4);">✕</button>
              <img src="" class="v360-hud-logo" id="logo-${this.id}">
              <div class="v360-hud-info">
                <span class="v360-hud-cliente" id="cliente-${this.id}"></span>
                <span class="v360-hud-titulo" id="titulo-${this.id}"></span>
              </div>
            </div>
            <div class="v360-acciones">
              <button class="v360-btn" id="btn-ficha-${this.id}" title="Ficha Técnica">ⓘ</button>
              <button class="v360-btn activo" id="btn-rot-${this.id}" title="Auto-Rotación">↻</button>
              <button class="v360-btn" id="btn-giro-${this.id}" title="Activar Brújula/Giroscopio">🧭</button>
              <button class="v360-btn" id="btn-ed-${this.id}" title="Modo Editor">✦</button>
              <button class="v360-btn v360-btn-fs" id="btn-fs-${this.id}" title="Pantalla Completa">⛶</button>
            </div>
          </div>

          <div class="v360-splash" id="splash-${this.id}">
            <div class="v360-splash-overlay"></div>
            <img src="" class="v360-splash-logo" id="sp-logo-${this.id}">
            <span class="v360-splash-cliente" id="sp-cliente-${this.id}"></span>
            <h3 class="v360-splash-titulo" id="sp-titulo-${this.id}"></h3>
            <div class="v360-splash-bton-group">
              <button class="v360-splash-btn" id="sp-btn-${this.id}">Iniciar Recorrido</button>
              <a href="#" target="_blank" class="v360-maps-splash-btn" id="sp-maps-${this.id}" title="Ver Ubicación">📍</a>
            </div>
          </div>

          <div class="v360-minimap-wrapper colapsado" id="mm-wrap-${this.id}">
            <button class="v360-mm-toggle" id="mm-toggle-${this.id}"><span>VER MAPA</span></button>
            <div class="v360-minimap" id="mm-${this.id}"></div>
          </div>

          <div class="v360-editor-panel" id="panel-ed-${this.id}">
            <div style="font-size:0.55rem; color:#0178ff; margin-bottom:10px; font-weight:bold;">◉ MODO EDITOR</div>
            <div id="coords-${this.id}" style="background:#000; padding:10px; font-family:monospace; font-size:0.75rem; margin-bottom:12px; text-align:center; border:1px solid #222; color:#4caf50;">Haz click en la foto</div>
            <button id="btn-copy-${this.id}" style="width:100%; padding:8px; background:#0178ff; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:0.7rem; font-weight:700;">COPIAR COORDENADAS</button>
            <div id="copy-msg-${this.id}" style="color:#4caf50; font-size:0.65rem; text-align:center; margin-top:5px; height:15px;"></div>
          </div>
        </div>
      `;
    }

    cargarConfig() {
      if (window.tourConfig) {
        this.config = window.tourConfig;
        this._onConfigLista();
        return;
      }
      const script = document.createElement('script');
      script.src = this.configPath;
      script.onload = () => {
        this.config = window.tourConfig;
        if (!this.config) return console.error('Visor 360: window.tourConfig no encontrado.');
        this._onConfigLista();
      };
      document.body.appendChild(script);
    }

    _onConfigLista() {
      this.aplicarBranding();
      this.renderFichaComercial();
      this.iniciarThreeJS();
      this.construirMinimap();
    }

    aplicarBranding() {
      const tema = this.config.tema || {};
      this.colorPrimario   = tema.colorPrimario   || '#0178ff';
      this.colorSecundario = tema.colorSecundario || 'rgba(255,255,255,0.15)';

      this.contenedor.style.setProperty('--v360-color-primario',   this.colorPrimario);
      this.contenedor.style.setProperty('--v360-color-secundario', this.colorSecundario);

      if (tema.fuentePrincipal) this.contenedor.style.setProperty('--v360-font',       tema.fuentePrincipal);
      if (tema.fuenteTitulos)   this.contenedor.style.setProperty('--v360-font-title', tema.fuenteTitulos);

      if (tema.logoURL) {
        document.getElementById('logo-'    + this.id).src = tema.logoURL;
        document.getElementById('logo-'    + this.id).style.display = 'block';
        document.getElementById('sp-logo-' + this.id).src = tema.logoURL;
        document.getElementById('sp-logo-' + this.id).style.display = 'block';
      }

      document.getElementById('cliente-'    + this.id).textContent = this.config.cliente || '';
      document.getElementById('sp-cliente-' + this.id).textContent = this.config.cliente || '';
      document.getElementById('sp-titulo-'  + this.id).textContent = this.config.titulo  || '';

      const dc = this.config.datosComerciales;
      if (dc && dc.googleMapsURL) {
        const btnMaps = document.getElementById('sp-maps-' + this.id);
        btnMaps.href = dc.googleMapsURL;
        btnMaps.style.display = 'flex';
      }
    }

    renderFichaComercial() {
      const dc  = this.config.datosComerciales;
      const box = document.getElementById('ficha-content-' + this.id);
      if (!dc || !box) return;
      let html = '';
      if (dc.nombreAgente)    html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Asesor</span>' + dc.nombreAgente + '</div>';
      if (dc.telefono)        html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Teléfono</span>' + dc.telefono + '</div>';
      if (dc.correo)          html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Correo</span>' + dc.correo + '</div>';
      if (dc.metrosCuadrados) html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Dimensiones</span>' + dc.metrosCuadrados + '</div>';
      if (dc.descripcion)     html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Detalles</span>' + dc.descripcion + '</div>';
      box.innerHTML = html;
    }

    iniciarThreeJS() {
      const wrap = document.getElementById('canvas-' + this.id);

      this.scene    = new THREE.Scene();
      this.camera   = new THREE.PerspectiveCamera(75, wrap.clientWidth / wrap.clientHeight, 1, 1100);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(wrap.clientWidth, wrap.clientHeight);
      wrap.appendChild(this.renderer.domElement);

      const geo = new THREE.SphereGeometry(500, 60, 40);
      geo.scale(-1, 1, 1);

      this.matPrincipal   = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
      this.spherePrincipal = new THREE.Mesh(geo, this.matPrincipal);
      this.scene.add(this.spherePrincipal);

      this.lon = 0; this.lat = 0;
      this.autoRotar = this.config.autoRotar !== false;
      this.raycaster  = new THREE.Raycaster();
      this.mouseVector = new THREE.Vector2();

      this._registrarInteraccionDrag(wrap);
      this._registrarZoomRueda(wrap);
      this._registrarTouchControls(wrap);
      this._registrarResizeObserver();
      this._registrarBotones(wrap);

      this.cargarEscenaInicial(this.config.escenaInicial);
      this.animar();

      if (this.autoIniciar) {
        setTimeout(() => this._activarVisor(wrap), 300);
        setTimeout(() => this._solicitarPermisoGiroscopio(false), 600);
      }
    }

    _activarVisor(wrap) {
      wrap = wrap || document.getElementById('canvas-' + this.id);
      this.tourIniciado = true;
      wrap.classList.remove('splash-blur');
      document.getElementById('splash-'  + this.id).classList.add('oculto');
      document.getElementById('hud-'     + this.id).classList.add('visible');
      document.getElementById('mm-wrap-' + this.id).classList.add('visible');
      document.getElementById('hs-'      + this.id).style.opacity = '1';
    }

    _registrarInteraccionDrag(wrap) {
      let isDragging = false, prevX = 0, prevY = 0, totalMove = 0;

      wrap.addEventListener('mousedown', e => {
        if (!this.tourIniciado) return;
        isDragging = true; prevX = e.clientX; prevY = e.clientY; totalMove = 0;
        this.autoRotar = false;
        document.getElementById('btn-rot-' + this.id).classList.remove('activo');
      });

      window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - prevX, dy = e.clientY - prevY;
        totalMove += Math.abs(dx) + Math.abs(dy);
        this.lon -= dx * 0.15; this.lat += dy * 0.15;
        prevX = e.clientX; prevY = e.clientY;
      });

      window.addEventListener('mouseup', e => {
        isDragging = false; this.ocultarTooltip();
        if (totalMove < 5 && this.modoEditor) this.procesarClickEnFoto(e);
      });
    }

    _registrarZoomRueda(wrap) {
      wrap.addEventListener('wheel', e => {
        if (!this.tourIniciado || this.faseTransicion !== 'quieto') return;
        e.preventDefault();
        this.cameraFOV = Math.max(40, Math.min(100, this.cameraFOV + e.deltaY * 0.05));
      }, { passive: false });
    }

    _registrarTouchControls(wrap) {
      let lastX = 0, lastY = 0, lastPinch = 0;

      wrap.addEventListener('touchstart', e => {
        if (!this.tourIniciado) return;
        this.autoRotar = false;
        document.getElementById('btn-rot-' + this.id).classList.remove('activo');
        if (e.touches.length === 1) {
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          lastPinch = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      }, { passive: true });

      wrap.addEventListener('touchmove', e => {
        if (!this.tourIniciado) return;
        e.preventDefault();
        if (e.touches.length === 1) {
          const dx = e.touches[0].clientX - lastX;
          const dy = e.touches[0].clientY - lastY;
          
          if (this.giroscopioActivo) {
            this.offsetLon -= dx * 0.22;
            this.offsetLat += dy * 0.22;
          } else {
            this.lon -= dx * 0.22; 
            this.lat += dy * 0.22;
          }
          
          lastX = e.touches[0].clientX;
          lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          const dist  = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          this.cameraFOV = Math.max(40, Math.min(100, this.cameraFOV + (lastPinch - dist) * 0.12));
          lastPinch = dist;
        }
      }, { passive: false });
    }

    _registrarResizeObserver() {
      const ro = new ResizeObserver(() => {
        const W = this.contenedor.clientWidth;
        const H = this.contenedor.clientHeight;
        if (!W || !H) return;
        this.renderer.setSize(W, H);
        this.camera.aspect = W / H;
        this.camera.updateProjectionMatrix();
      });
      ro.observe(this.contenedor);
    }

    _registrarBotones(wrap) {
      document.getElementById('btn-rot-' + this.id).addEventListener('click', e => {
        this.autoRotar = !this.autoRotar;
        e.currentTarget.classList.toggle('activo', this.autoRotar);
        if (this.autoRotar && this.giroscopioActivo) {
          this.giroscopioActivo = false;
          document.getElementById('btn-giro-' + this.id).classList.remove('activo');
        }
      });

      document.getElementById('btn-ficha-' + this.id).addEventListener('click', e => {
        this.fichaActiva = !this.fichaActiva;
        e.currentTarget.classList.toggle('activo', this.fichaActiva);
        document.getElementById('ficha-' + this.id).style.display = this.fichaActiva ? 'block' : 'none';
      });

      document.getElementById('btn-giro-' + this.id).addEventListener('click', () => {
        this._solicitarPermisoGiroscopio(true);
      });

      const btnSalir = document.getElementById('btn-salir-' + this.id);
      if (btnSalir) {
        btnSalir.addEventListener('click', () => {
          window.close(); 
        });
      }

      document.getElementById('btn-ed-'  + this.id).addEventListener('click', e => this.toggleEditor(e.currentTarget));
      document.getElementById('btn-copy-'+ this.id).addEventListener('click', () => this.copiarCoordenadas());

      const btnFS = document.getElementById('btn-fs-' + this.id);
      if (btnFS) {
        btnFS.addEventListener('click', () => this._toggleFullscreen());
        const syncIcon = () => {
          const enFS = !!(document.fullscreenElement || document.webkitFullscreenElement
            || document.mozFullScreenElement || document.msFullscreenElement);
          btnFS.textContent = enFS ? '⮌' : '⛶';
          btnFS.classList.toggle('activo', enFS);
        };
        ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange','MSFullscreenChange']
          .forEach(ev => document.addEventListener(ev, syncIcon));
      }

      document.getElementById('sp-btn-' + this.id).addEventListener('click', () => {
        if (isMobile()) {
          this._iniciarEnMovil();
        } else {
          this._activarVisor(wrap);
        }
      });

      document.getElementById('mm-toggle-' + this.id).addEventListener('click', () => {
        document.getElementById('mm-wrap-' + this.id).classList.toggle('colapsado');
      });
    }

    _solicitarPermisoGiroscopio(mostrarAlertaError) {
      const btnGiro = document.getElementById('btn-giro-' + this.id);
      
      if (this.giroscopioActivo) {
        this.giroscopioActivo = false;
        btnGiro.classList.remove('activo');
        return;
      }

      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              this._encenderGiroscopio();
            } else {
              if (mostrarAlertaError) alert('Permiso denegado para acceder al giroscopio.');
            }
          })
          .catch(err => {
            console.error(err);
            if (mostrarAlertaError) alert('Interactúa con la pantalla primero para otorgar permisos.');
          });
      } else {
        this._encenderGiroscopio();
      }
    }

    _encenderGiroscopio() {
      this.giroscopioActivo = true;
      this.autoRotar = false;
      
      document.getElementById('btn-rot-' + this.id).classList.remove('activo');
      document.getElementById('btn-giro-' + this.id).classList.add('activo');

      this.offsetLon = this.lon;
      this.offsetLat = this.lat;
      this.targetLon = 0;
      this.targetLat = 0;

      window.removeEventListener('deviceorientation', this._onDeviceOrientation);
      window.addEventListener('deviceorientation', e => this._onDeviceOrientation(e), false);
    }

    // ── RE-INGENIERÍA ABSOLUTA DE MATRICES DE GIRO (FIX ARRIBA/ABAJO + ESCOFINAS DE DIRECCIÓN) ──
    _onDeviceOrientation(event) {
      if (!this.giroscopioActivo || this.faseTransicion !== 'quieto') return;

      let alpha = event.alpha ? event.alpha : 0; // Eje Z (Norte/Brújula)
      let beta  = event.beta  ? event.beta  : 0; // Eje X (Frente/Atrás)
      let gamma = event.gamma ? event.gamma : 0; // Eje Y (Izquierda/Derecha)

      let orientacionPantalla = window.orientation || 0;

      // CALIBRACIÓN DE EJES PARA EVITAR ROTACIONES INVERTIDAS
      if (orientacionPantalla === 90) {
        this.targetLon = alpha - beta;
        this.targetLat = gamma;
      } else if (orientacionPantalla === -90) {
        this.targetLon = alpha + beta;
        this.targetLat = -gamma;
      } else if (orientacionPantalla === 180) {
        this.targetLon = alpha - gamma;
        this.targetLat = -beta;
      } else {
        // Vertical estándar (Retrato - iPhone / Android)
        // FIX PRINCIPAL: Ajuste del signo de Alpha (+alpha) para sincronizar paneo real a la derecha
        this.targetLon = alpha + gamma; 
        this.targetLat = beta - 70; // Centrado cómodo de mirada al horizonte físico
      }

      // CANDADO DE SEGURIDAD ABSOLUTO: Evitar que la esfera gire más de una vez en vertical
      // Limitamos el target vertical estrictamente entre -80° y 80° para que no se "vaya de paso"
      this.targetLat = Math.max(-80, Math.min(80, this.targetLat));

      this.targetLon = ((this.targetLon % 360) + 360) % 360;
    }

    _iniciarEnMovil() {
      const url    = new URL(window.location.href);
      url.search   = ''; 
      url.hash     = '';
      url.searchParams.set('v360fs', this.configPath);
      window.open(url.toString(), '_blank');
    }

    _toggleFullscreen() {
      const el  = this.contenedor;
      const enFS = !!(document.fullscreenElement || document.webkitFullscreenElement
        || document.mozFullScreenElement || document.msFullscreenElement);
      if (!enFS) {
        const req = el.requestFullscreen || el.webkitRequestFullscreen
          || el.mozRequestFullScreen  || el.msRequestFullscreen;
        if (req) req.call(el).catch(e => console.warn('Fullscreen:', e));
      } else {
        const exit = document.exitFullscreen || document.webkitExitFullscreen
          || document.mozCancelFullScreen   || document.msExitFullscreen;
        if (exit) exit.call(document).catch(e => console.warn('Exit FS:', e));
      }
    }

    procesarClickEnFoto(e) {
      const wrap = document.getElementById('canvas-' + this.id);
      const rect = wrap.getBoundingClientRect();
      this.mouseVector.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      this.mouseVector.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouseVector, this.camera);
      const hits = this.raycaster.intersectObject(this.spherePrincipal);
      if (hits.length > 0) {
        const p = hits[0].point, r = p.length();
        let pitch = 90 - (Math.acos(p.y / r) * (180 / Math.PI));
        let yaw   = Math.atan2(p.z, p.x) * (180 / Math.PI);
        yaw = ((yaw % 360) + 360) % 360;
        this.lastClickCoords.pitch = Math.round(pitch * 10) / 10;
        this.lastClickCoords.yaw   = Math.round(yaw   * 10) / 10;
        document.getElementById('coords-' + this.id).textContent =
          'pitch: ' + this.lastClickCoords.pitch + ' | yaw: ' + this.lastClickCoords.yaw;
      }
    }

    cargarEscenaInicial(idEscena) {
      const datos = this.config.escenas[idEscena];
      if (!datos) return;
      this.escenaActual = idEscena;
      document.getElementById('titulo-' + this.id).textContent = datos.tituloEscena || '';

      this._cargarTextura(datos.imagen, tex => {
        const vieja = this.matPrincipal.map;
        if (vieja && vieja !== tex) this._disposeTex(vieja);
        this.matPrincipal.map = tex;
        this.matPrincipal.needsUpdate = true;
        this.spherePrincipal.rotation.z = datos.correccionHorizonte
          ? datos.correccionHorizonte * (Math.PI / 180) : 0;
        const spin = document.getElementById('spin-' + this.id);
        if (spin) { spin.style.opacity = '0'; setTimeout(() => spin.style.display = 'none', 300); }
        this.renderizarHotspots(datos.hotspots || []);
      });
    }

    dispararTransicionHacia(idSiguiente) {
      if (this.faseTransicion !== 'quieto') return;
      const datosSig = this.config.escenas[idSiguiente];
      if (!datosSig) return;

      document.getElementById('hs-' + this.id).style.opacity = '0';
      const spin = document.getElementById('spin-' + this.id);
      if (spin) { spin.style.display = 'flex'; spin.style.opacity = '1'; }

      this._cargarTextura(datosSig.imagen, tex => {
        const geoClon = new THREE.SphereGeometry(495, 60, 40);
        geoClon.scale(-1, 1, 1);
        this.matClon    = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0 });
        this.sphereClon = new THREE.Mesh(geoClon, this.matClon);
        this.sphereClon.rotation.z = datosSig.correccionHorizonte
          ? datosSig.correccionHorizonte * (Math.PI / 180) : 0;
        this.scene.add(this.sphereClon);
        if (spin) { spin.style.opacity = '0'; setTimeout(() => spin.style.display = 'none', 300); }
        this.siguienteEscenaID = idSiguiente;
        this.faseTransicion     = 'zoom_in';
        this.transitionProgress = 0;
      });
    }

    finalizarDisolvencia() {
      const texAntigua = this.matPrincipal.map;

      this.matPrincipal.map = this.matClon.map;
      this.matPrincipal.needsUpdate = true;
      this.spherePrincipal.rotation.z = this.sphereClon.rotation.z;
      this.matPrincipal.opacity = 1;

      this.scene.remove(this.sphereClon);
      this.sphereClon.geometry.dispose();
      this.matClon.dispose(); 

      if (texAntigua && texAntigua !== this.matPrincipal.map) {
        this._disposeTex(texAntigua);
      }

      this.escenaActual = this.siguienteEscenaID;
      const datos = this.config.escenas[this.escenaActual];
      document.getElementById('titulo-' + this.id).textContent = datos.tituloEscena || '';
      
      if (this.giroscopioActivo) {
        this.offsetLon = this.lon;
        this.offsetLat = this.lat;
      }

      this.faseTransicion = 'zoom_out';
      this.renderizarHotspots(datos.hotspots || []);
      this.sincronizarMinimap();
    }

    renderizarHotspots(hotspots) {
      const layer = document.getElementById('hs-' + this.id);
      layer.innerHTML = '';
      this.hotspotsData = [];

      hotspots.forEach(hs => {
        const el  = document.createElement('div');
        el.className = 'v360-hotspot';
        const op  = hs.opacidad !== undefined ? hs.opacidad : 1;

        let iconHTML = '';
        if (hs.iconoPng) {
          iconHTML  = '<img src="' + hs.iconoPng + '" style="width:' + (hs.tamano||32) + 'px;height:auto;display:block;" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'block\';">';
          iconHTML += '<span style="display:none;font-size:' + (hs.tamano||28) + 'px;">' + (hs.tipo==='navegacion'?'➔':'📍') + '</span>';
        } else if (hs.icono) {
          iconHTML  = '<span style="font-size:' + (hs.tamano||28) + 'px;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.5));">' + hs.icono + '</span>';
        } else {
          const def = '../assets/tours/icon_circulo.png';
          iconHTML  = '<img src="' + def + '" style="width:' + (hs.tamano||32) + 'px;height:auto;display:block;" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'block\';">';
          iconHTML += '<span style="display:none;font-size:' + (hs.tamano||28) + 'px;filter:drop-shadow(0 2px 5px rgba(0,0,0,0.5));">' + (hs.tipo==='navegacion'?'➔':'📍') + '</span>';
        }

        el.innerHTML =
          '<div style="display:flex;align-items:center;justify-content:center;opacity:' + op + ';transition:opacity 0.2s;">' + iconHTML + '</div>' +
          (hs.etiqueta && hs.tipo==='navegacion'
            ? '<div style="position:absolute;bottom:-22px;font-size:0.6rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;background:rgba(0,0,0,0.65);padding:2px 6px;border-radius:4px;white-space:nowrap;opacity:' + op + ';">' + hs.etiqueta + '</div>'
            : '');

        if (hs.tipo === 'navegacion') {
          el.addEventListener('click', () => this.dispararTransicionHacia(hs.destino));
        } else {
          el.addEventListener('click', e => { this.mostrarTooltip(e, hs); e.stopPropagation(); });
        }

        layer.appendChild(el);
        const phi  = THREE.MathUtils.degToRad(90 - (hs.pitch || 0));
        const theta = THREE.MathUtils.degToRad(hs.yaw || 0);
        this.hotspotsData.push({
          el,
          pos3D: new THREE.Vector3(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta))
        });
      });
    }

    mostrarTooltip(e, hs) {
      const tt = document.getElementById('tt-' + this.id);
      const rect     = e.currentTarget.getBoundingClientRect();
      const wrapRect = this.contenedor.getBoundingClientRect();
      tt.innerHTML = '<strong style="font-weight:600;font-size:0.75rem;display:block;margin-bottom:2px;">' + (hs.etiqueta||'Información') + '</strong>' +
                     '<span style="color:rgba(255,255,255,0.7);font-size:0.75rem;">' + (hs.descripcion||'') + '</span>';
      tt.style.left    = (rect.left - wrapRect.left + rect.width / 2) + 'px';
      tt.style.top     = (rect.top  - wrapRect.top) + 'px';
      tt.style.opacity = '1';
    }

    ocultarTooltip() { document.getElementById('tt-' + this.id).style.opacity = '0'; }

    toggleEditor(btn) {
      this.modoEditor = !this.modoEditor;
      btn.classList.toggle('activo', this.modoEditor);
      document.getElementById('panel-ed-' + this.id).style.display = this.modoEditor ? 'block' : 'none';
    }

    copiarCoordenadas() {
      navigator.clipboard.writeText('pitch: ' + this.lastClickCoords.pitch + ',\nyaw: ' + this.lastClickCoords.yaw + ',')
        .then(() => {
          const msg = document.getElementById('copy-msg-' + this.id);
          msg.textContent = '✓ Copiado';
          setTimeout(() => msg.textContent = '', 2000);
        });
    }

    construirMinimap() {
      const mm = document.getElementById('mm-' + this.id);
      if (!mm || !this.config.escenas) return;
      mm.innerHTML = '';
      Object.entries(this.config.escenas).forEach(([k, esc]) => {
        if (!esc.principalZona) return;
        const item = document.createElement('div');
        item.className = 'v360-mm-escena';
        item.dataset.zonaName = esc.zona || k;
        item.innerHTML = '<div class="v360-mm-dot"></div><span class="v360-mm-label">' + (esc.zona || k) + '</span>';
        item.addEventListener('click', () => this.dispararTransicionHacia(k));
        mm.appendChild(item);
      });
      this.sincronizarMinimap();
    }

    sincronizarMinimap() {
      const esc = this.config.escenas[this.escenaActual];
      if (!esc) return;
      this.contenedor.querySelectorAll('.v360-mm-escena').forEach(el => {
        el.classList.toggle('activa', el.dataset.zonaName === esc.zona);
      });
    }

    animar() {
      requestAnimationFrame(() => this.animar());

      if (this.faseTransicion === 'zoom_in') {
        this.transitionProgress += 0.045;
        const t = Math.min(1, this.transitionProgress);
        const smooth = t * t * (3 - 2 * t);
        this.cameraFOV = THREE.MathUtils.lerp(this.cameraFOV, 73, 0.08);
        this.matPrincipal.opacity = 1 - smooth;
        this.matClon.opacity      = smooth;
        if (this.transitionProgress >= 1) this.finalizarDisolvencia();
      } else if (this.faseTransicion === 'zoom_out') {
        this.cameraFOV = THREE.MathUtils.lerp(this.cameraFOV, 75, 0.06);
        if (Math.abs(this.cameraFOV - 75) < 0.1) {
          this.cameraFOV      = 75;
          this.faseTransicion = 'quieto';
          if (this.tourIniciado) document.getElementById('hs-' + this.id).style.opacity = '1';
        }
      }

      this.camera.fov = this.cameraFOV;
      this.camera.updateProjectionMatrix();

      // ── MÓDULO CINEMÁTICO SUAVE CON CANDADO DE LATITUD (PASO BAJO) ──
      if (this.giroscopioActivo && this.faseTransicion === 'quieto') {
        const targetCalculadoLon = this.targetLon + this.offsetLon;
        const targetCalculadoLat = this.targetLat + this.offsetLat;

        let diffLon = targetCalculadoLon - this.lon;
        while (diffLon < -180) diffLon += 360;
        while (diffLon > 180) diffLon -= 360;
        
        // Amortiguación de velocidad constante (Seda total)
        this.lon += diffLon * 0.07;
        this.lat += (targetCalculadoLat - this.lat) * 0.07;
        
      } else if (this.autoRotar && this.faseTransicion === 'quieto') {
        this.lon += (this.config.velocidadRotacion || 0.05);
      }

      // DOBLE CANDADO FÍSICO DE SEGURIDAD EN EL RENDERIZADO VERTICAL
      this.lat = Math.max(-83, Math.min(83, this.lat));

      const phi   = THREE.MathUtils.degToRad(90 - this.lat);
      const theta = THREE.MathUtils.degToRad(this.lon);
      this.camera.lookAt(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta)
      );

      const W = this.contenedor.clientWidth, H = this.contenedor.clientHeight;
      const vec = new THREE.Vector3();
      this.hotspotsData.forEach(({ el, pos3D }) => {
        vec.copy(pos3D).project(this.camera);
        if (vec.z > 1) { el.style.display = 'none'; return; }
        el.style.display = 'flex';
        el.style.left = ((vec.x * 0.5 + 0.5) * W) + 'px';
        el.style.top  = ((vec.y * -0.5 + 0.5) * H) + 'px';
      });
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ─── BOOTSTRAP ──────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const configPathStandalone = detectarModoStandalone();

    if (configPathStandalone) {
      aplicarModoStandalone();

      const wrap = document.createElement('div');
      wrap.className = 'omh-360-widget-standalone-wrap';
      document.body.classList.add('v360-standalone');
      document.body.appendChild(wrap);

      const widget = document.createElement('div');
      widget.className = 'omh-360-widget';
      widget.setAttribute('data-config', configPathStandalone);
      wrap.appendChild(widget);

      inyectarDependencies(() => {
        new OMHWidget360(widget, { autoIniciar: true });
      });

    } else {
      const widgets = document.querySelectorAll('.omh-360-widget');
      if (widgets.length === 0) return;
      inyectarDependencias(() => {
        widgets.forEach(w => new OMHWidget360(w));
      });
    }
  });

  function inyectarDependencies(cb) { inyectarDependencias(cb); }

})();