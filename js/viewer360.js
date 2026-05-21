/**
 * viewer360.js — Motor OMH Estudio con Disolvencia Cruzada Tersa y Scroll Zoom (V12.5)
 */
(function () {
  'use strict';

  function inyectarDependencias(callback) {
    if (document.getElementById('v360-styles')) {
      if (window.THREE) return callback();
      return;
    }

    const s = document.createElement('style');
    s.id = 'v360-styles';
    s.textContent = `
      .omh-360-widget { position: relative; display: block; overflow: hidden; background: #000; }
      .v360-container { position: absolute; inset: 0; width: 100%; height: 100%; font-family: var(--v360-font, 'Raleway', sans-serif); color: #fff; }
      
      .v360-canvas-wrap { position: absolute; inset: 0; z-index: 1; cursor: grab; transition: filter 0.8s ease-in-out; }
      .v360-canvas-wrap:active { cursor: grabbing; }
      .v360-canvas-wrap.splash-blur { filter: blur(15px) brightness(0.5); transition: filter 1.5s ease-in-out; }
      .v360-canvas-wrap.motion-blur { filter: blur(4px) brightness(0.95); transition: filter 0.4s ease-in-out; }
      
      /* HUD Superior */
      .v360-hud { position: absolute; top: 0; left: 0; right: 0; padding: 1.5rem 2rem; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); display: flex; justify-content: space-between; align-items: center; z-index: 10; pointer-events: none; opacity: 0; transition: opacity 0.8s ease; }
      .v360-hud.visible { opacity: 1; }
      .v360-hud-logo { height: 24px; max-width: 130px; object-fit: contain; pointer-events: all; display: none; }
      .v360-hud-info { text-align: center; flex: 1; margin: 0 1rem; }
      .v360-hud-cliente { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--v360-color-primario, #0178ff); font-weight: 700; display: block; }
      .v360-hud-titulo { font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-top: 4px; display: block; font-family: var(--v360-font-title, 'Lexend Tera', sans-serif); }
      
      .v360-acciones { display: flex; gap: 0.5rem; pointer-events: all; }
      .v360-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--v360-color-secundario, rgba(255,255,255,0.1)); border: 1px solid rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); font-size: 0.9rem; }
      .v360-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); border-color: rgba(255,255,255,0.4); }
      .v360-btn.activo { background: var(--v360-color-primario, #0178ff); border-color: transparent; }
      
      /* Panel de Ficha Comercial */
      .v360-ficha-panel { position: absolute; top: 80px; left: 2rem; z-index: 90; background: rgba(10,10,10,0.95); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 1.5rem; width: 280px; pointer-events: all; display: none; backdrop-filter: blur(10px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .v360-ficha-titulo { font-family: var(--v360-font-title, 'Lexend Tera', sans-serif); font-size: 0.65rem; color: var(--v360-color-primario, #0178ff); margin-bottom: 1rem; letter-spacing: 0.1em; text-transform: uppercase; }
      .v360-ficha-item { margin-bottom: 0.8rem; font-size: 0.75rem; line-height: 1.4; color: rgba(255,255,255,0.85); }
      .v360-ficha-label { font-size: 0.55rem; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.4); display: block; margin-bottom: 2px; }

      /* Splash Screen */
      .v360-splash { position: absolute; inset: 0; z-index: 30; background: linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.2)); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; box-sizing: border-box; text-align: center; transition: opacity 1s, visibility 1s; }
      .v360-splash-overlay { position: absolute; inset: 0; background: var(--v360-color-primario, #0178ff); opacity: 0.08; z-index: -1; }
      .v360-splash-logo { max-height: 50px; max-width: 200px; object-fit: contain; margin-bottom: 1.5rem; display: none; }
      .v360-splash-cliente { font-size: 0.65rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--v360-color-primario, #0178ff); font-weight: 700; display: block; margin-bottom: 0.5rem; }
      .v360-splash-titulo { font-size: 1.4rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--v360-font-title, 'Lexend Tera', sans-serif); max-width: 600px; line-height: 1.3; margin-bottom: 2rem; text-shadow: 0 4px 20px rgba(0,0,0,0.6); }
      .v360-splash-bton-group { display: flex; gap: 1rem; align-items: center; }
      .v360-splash-btn { padding: 0.8rem 2.2rem; background: transparent; border: 1px solid rgba(255,255,255,0.4); border-radius: 40px; color: #fff; font-family: var(--v360-font, 'Raleway', sans-serif); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(8px); }
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

      /* Hotspots Capa */
      .v360-hotspot-layer { position: absolute; inset: 0; z-index: 5; pointer-events: none; opacity: 0; transition: opacity 0.6s ease-in-out; }
      .v360-hotspot { position: absolute; pointer-events: all; cursor: pointer; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center; transition: transform 0.2s ease; }
      .v360-hotspot:hover { transform: translate(-50%, -50%) scale(1.15) !important; }
      
      .v360-tooltip { position: absolute; background: rgba(10,10,10,0.96); color: #fff; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); max-width: 260px; pointer-events: none; opacity: 0; transition: opacity 0.2s ease; z-index: 20; transform: translate(-50%, calc(-100% - 15px)); line-height: 1.4; }
      .v360-editor-panel { position: absolute; top: 80px; right: 1.5rem; z-index: 100; background: rgba(8,8,8,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.2rem; width: 230px; pointer-events: all; display: none; }
      
      /* Spinner pequeño */
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

  class OMHWidget360 {
    constructor(contenedor) {
      this.contenedor = contenedor;
      this.id = Math.random().toString(36).substring(2, 9);
      this.configPath = contenedor.getAttribute('data-config');
      
      if (!this.configPath) return console.error('Visor 360: Falta data-config.');
      
      this.tourIniciado = false; 
      this.modoEditor = false;
      this.fichaActiva = false;
      this.hotspotsData = [];
      this.lastClickCoords = { pitch: 0, yaw: 0 };
      
      this.cameraFOV = 75;
      this.faseTransicion = "quieto"; 
      this.transitionProgress = 0;
      this.siguienteEscenaID = null;

      this.construirDOM();
      this.cargarConfig();
    }

    construirDOM() {
      this.contenedor.innerHTML = `
        <div class="v360-container">
          <div class="v360-spinner" id="spin-${this.id}"><div class="v360-spin-ring"></div><span id="spin-txt-${this.id}">Cargando...</span></div>
          <div class="v360-canvas-wrap splash-blur" id="canvas-${this.id}"></div>
          <div class="v360-hotspot-layer" id="hs-${this.id}"></div>
          <div class="v360-tooltip" id="tt-${this.id}"></div>
          
          <div class="v360-ficha-panel" id="ficha-${this.id}">
            <div class="v360-ficha-titulo">Ficha Comercial</div>
            <div id="ficha-content-${this.id}"></div>
          </div>
          
          <div class="v360-hud" id="hud-${this.id}">
            <img src="" class="v360-hud-logo" id="logo-${this.id}">
            <div class="v360-hud-info">
              <span class="v360-hud-cliente" id="cliente-${this.id}"></span>
              <span class="v360-hud-titulo" id="titulo-${this.id}"></span>
            </div>
            <div class="v360-acciones">
              <button class="v360-btn" id="btn-ficha-${this.id}" title="Ficha Técnica">ⓘ</button>
              <button class="v360-btn activo" id="btn-rot-${this.id}" title="Auto-Rotación">↻</button>
              <button class="v360-btn" id="btn-ed-${this.id}" title="Modo Editor">✦</button>
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
      const script = document.createElement('script');
      script.src = this.configPath;
      script.onload = () => {
        this.config = window.tourConfig;
        if (!this.config) return;
        this.aplicarBranding();
        this.renderFichaComercial();
        this.iniciarThreeJS();
        this.construirMinimap();
      };
      document.body.appendChild(script);
    }

    aplicarBranding() {
      const tema = this.config.tema || {};
      this.colorPrimario = tema.colorPrimario || '#0178ff';
      this.colorSecundario = tema.colorSecundario || 'rgba(255, 255, 255, 0.15)';
      
      this.contenedor.style.setProperty('--v360-color-primario', this.colorPrimario);
      this.contenedor.style.setProperty('--v360-color-secundario', this.colorSecundario);

      if (tema.logoURL) {
        document.getElementById('logo-' + this.id).src = tema.logoURL;
        document.getElementById('logo-' + this.id).style.display = 'block';
        document.getElementById('sp-logo-' + this.id).src = tema.logoURL;
        document.getElementById('sp-logo-' + this.id).style.display = 'block';
      }

      document.getElementById('cliente-' + this.id).textContent = this.config.cliente || '';
      document.getElementById('sp-cliente-' + this.id).textContent = this.config.cliente || '';
      document.getElementById('sp-titulo-' + this.id).textContent = this.config.titulo || '';

      if (this.config.datosComerciales && this.config.datosComerciales.googleMapsURL) {
        const btnMaps = document.getElementById('sp-maps-' + this.id);
        btnMaps.href = this.config.datosComerciales.googleMapsURL;
        btnMaps.style.display = 'flex';
      }
    }

    renderFichaComercial() {
      const dc = this.config.datosComerciales;
      const box = document.getElementById('ficha-content-' + this.id);
      if (!dc || !box) return;

      let html = '';
      if (dc.nombreAgente)     html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Asesor</span>' + dc.nombreAgente + '</div>';
      if (dc.telefono)         html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Teléfono</span>' + dc.telefono + '</div>';
      if (dc.correo)           html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Correo</span>' + dc.correo + '</div>';
      if (dc.metrosCuadrados)  html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Dimensiones</span>' + dc.metrosCuadrados + '</div>';
      if (dc.descripcion)      html += '<div class="v360-ficha-item"><span class="v360-ficha-label">Detalles</span>' + dc.descripcion + '</div>';
      box.innerHTML = html;
    }

    iniciarThreeJS() {
      const wrap = document.getElementById('canvas-' + this.id);
      
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, wrap.clientWidth / wrap.clientHeight, 1, 1100);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(wrap.clientWidth, wrap.clientHeight);
      wrap.appendChild(this.renderer.domElement);

      const geo = new THREE.SphereGeometry(500, 60, 40);
      geo.scale(-1, 1, 1);
      
      this.matPrincipal = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
      this.spherePrincipal = new THREE.Mesh(geo, this.matPrincipal);
      this.scene.add(this.spherePrincipal);

      this.lon = 0; this.lat = 0;
      this.autoRotar = true;
      this.raycaster = new THREE.Raycaster();
      this.mouseVector = new THREE.Vector2();

      let isDragging = false, prevX = 0, prevY = 0, totalMove = 0;
      
      wrap.addEventListener('mousedown', e => {
        if (!this.tourIniciado) return;
        isDragging = true; prevX = e.clientX; prevY = e.clientY; totalMove = 0;
        this.autoRotar = false;
        document.getElementById('btn-rot-' + this.id).classList.remove('activo');
      });
      
      window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - prevX; const dy = e.clientY - prevY;
        totalMove += Math.abs(dx) + Math.abs(dy);
        this.lon -= dx * 0.15; this.lat += dy * 0.15;
        prevX = e.clientX; prevY = e.clientY;
      });
      
      window.addEventListener('mouseup', e => {
        isDragging = false; this.ocultarTooltip();
        if (totalMove < 5 && this.modoEditor) this.procesarClickEnFoto(e);
      });

      // ─── NUEVO: ZOOM CON RUEDA DEL RATÓN (FOV DINÁMICO) ───
      wrap.addEventListener('wheel', e => {
        // Ignorar si el tour no ha iniciado o si estamos en medio de una transición
        if (!this.tourIniciado || this.faseTransicion !== "quieto") return;
        
        e.preventDefault(); // Bloquea el scroll de la página web para que no se mueva el sitio
        
        const zoomSpeed = 0.05;
        this.cameraFOV += e.deltaY * zoomSpeed;
        
        // Límites suaves: no alejar a menos de 100 grados ni acercar a más de 40 grados
        this.cameraFOV = Math.max(40, Math.min(100, this.cameraFOV));
      }, { passive: false }); // Se requiere false para permitir e.preventDefault()

      document.getElementById('btn-rot-' + this.id).addEventListener('click', e => {
        this.autoRotar = !this.autoRotar;
        e.currentTarget.classList.toggle('activo', this.autoRotar);
      });

      document.getElementById('btn-ficha-' + this.id).addEventListener('click', e => {
        this.fichaActiva = !this.fichaActiva;
        e.currentTarget.classList.toggle('activo', this.fichaActiva);
        document.getElementById('ficha-' + this.id).style.display = this.fichaActiva ? 'block' : 'none';
      });

      document.getElementById('btn-ed-' + this.id).addEventListener('click', e => this.toggleEditor(e.currentTarget));
      document.getElementById('btn-copy-' + this.id).addEventListener('click', () => this.copiarCoordenadas());

      document.getElementById('sp-btn-' + this.id).addEventListener('click', () => {
        this.tourIniciado = true;
        wrap.classList.remove('splash-blur');
        document.getElementById('splash-' + this.id).classList.add('oculto');
        document.getElementById('hud-' + this.id).classList.add('visible');
        document.getElementById('mm-wrap-' + this.id).classList.add('visible');
        document.getElementById('hs-' + this.id).style.opacity = '1';
      });

      document.getElementById('mm-toggle-' + this.id).addEventListener('click', () => {
        document.getElementById('mm-wrap-' + this.id).classList.toggle('colapsado');
      });

      this.cargarEscenaInicial(this.config.escenaInicial);
      this.animar();
    }

    procesarClickEnFoto(e) {
      const wrap = document.getElementById('canvas-' + this.id);
      const rect = wrap.getBoundingClientRect();
      this.mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      this.raycaster.setFromCamera(this.mouseVector, this.camera);
      const intersects = this.raycaster.intersectObject(this.spherePrincipal);
      if (intersects.length > 0) {
        const p = intersects[0].point;
        const r = p.length();
        let pitch = 90 - (Math.acos(p.y / r) * (180 / Math.PI));
        let yaw = Math.atan2(p.z, p.x) * (180 / Math.PI);
        yaw = ((yaw % 360) + 360) % 360;
        
        this.lastClickCoords.pitch = Math.round(pitch * 10) / 10;
        this.lastClickCoords.yaw = Math.round(yaw * 10) / 10;
        document.getElementById('coords-' + this.id).textContent = 'pitch: ' + this.lastClickCoords.pitch + ' | yaw: ' + this.lastClickCoords.yaw;
      }
    }

    cargarEscenaInicial(idEscena) {
      const datos = this.config.escenas[idEscena];
      if (!datos) return;
      this.escenaActual = idEscena;
      document.getElementById('titulo-' + this.id).textContent = datos.tituloEscena || '';

      const loader = new THREE.TextureLoader();
      loader.load(datos.imagen, tex => {
        this.matPrincipal.map = tex;
        this.matPrincipal.needsUpdate = true;
        this.spherePrincipal.rotation.z = datos.correccionHorizonte ? datos.correccionHorizonte * (Math.PI / 180) : 0;
        
        const spin = document.getElementById('spin-' + this.id);
        if (spin) { spin.style.opacity = '0'; setTimeout(() => spin.style.display = 'none', 300); }
        this.renderizarHotspots(datos.hotspots || []);
      });
    }

    dispararTransicionHacia(idSiguiente) {
      if (this.faseTransicion !== "quieto") return;
      
      const datosSiguiente = this.config.escenas[idSiguiente];
      if (!datosSiguiente) return;

      document.getElementById('hs-' + this.id).style.opacity = '0';
      const spin = document.getElementById('spin-' + this.id);
      if (spin) { spin.style.display = 'flex'; spin.style.opacity = '1'; }

      const loader = new THREE.TextureLoader();
      loader.load(datosSiguiente.imagen, tex => {
        const geoClon = new THREE.SphereGeometry(495, 60, 40); 
        geoClon.scale(-1, 1, 1);
        
        this.matClon = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0 }); 
        this.sphereClon = new THREE.Mesh(geoClon, this.matClon);
        this.sphereClon.rotation.z = datosSiguiente.correccionHorizonte ? datosSiguiente.correccionHorizonte * (Math.PI / 180) : 0;
        
        this.scene.add(this.sphereClon);

        if (spin) { spin.style.opacity = '0'; setTimeout(() => spin.style.display = 'none', 300); }

        this.siguienteEscenaID = idSiguiente;
        this.faseTransicion = "zoom_in";
        this.transitionProgress = 0;
      });
    }

    finalizarDisolvencia() {
      this.matPrincipal.map = this.matClon.map;
      this.matPrincipal.needsUpdate = true;
      this.spherePrincipal.rotation.z = this.sphereClon.rotation.z;
      this.matPrincipal.opacity = 1; 

      this.scene.remove(this.sphereClon);
      this.sphereClon.geometry.dispose();
      this.matClon.dispose();

      this.escenaActual = this.siguienteEscenaID;
      const datos = this.config.escenas[this.escenaActual];
      document.getElementById('titulo-' + this.id).textContent = datos.tituloEscena || '';

      this.faseTransicion = "zoom_out";
      this.renderizarHotspots(datos.hotspots || []);
      this.sincronizarMinimap();
    }

    renderizarHotspots(hotspots) {
      const layer = document.getElementById('hs-' + this.id);
      layer.innerHTML = '';
      this.hotspotsData = [];

      hotspots.forEach(hs => {
        const el = document.createElement('div');
        el.className = 'v360-hotspot';
        const op = hs.opacidad !== undefined ? hs.opacidad : 1;
        
        let renderIconoHTML = '';
        if (hs.iconoPng) {
          renderIconoHTML = '<img src="' + hs.iconoPng + '" style="width:' + (hs.tamano || 32) + 'px; height:auto; display:block;" onerror="this.style.display=\'none\'; this.nextSibling.style.display=\'block\';">';
          renderIconoHTML += '<span style="display:none; font-size:' + (hs.tamano || 28) + 'px;">' + (hs.tipo === 'navegacion' ? '➔' : '📍') + '</span>';
        } else if (hs.icono) {
          renderIconoHTML = '<span style="font-size:' + (hs.tamano || 28) + 'px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.5));">' + hs.icono + '</span>';
        } else {
          const defaultPNG = '../assets/tours/icon_circulo.png';
          renderIconoHTML = '<img src="' + defaultPNG + '" style="width:' + (hs.tamano || 32) + 'px; height:auto; display:block;" onerror="this.style.display=\'none\'; this.nextSibling.style.display=\'block\';">';
          const emojiFallback = hs.tipo === 'navegacion' ? '➔' : '📍';
          renderIconoHTML += '<span style="display:none; font-size:' + (hs.tamano || 28) + 'px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.5));">' + emojiFallback + '</span>';
        }

        el.innerHTML = 
          '<div style="display:flex; align-items:center; justify-content:center; opacity:' + op + '; transition:opacity 0.2s;">' +
            renderIconoHTML +
          '</div>' +
          (hs.etiqueta && hs.tipo === 'navegacion' ? '<div style="position:absolute; bottom:-22px; font-size:0.6rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; background:rgba(0,0,0,0.65); padding:2px 6px; border-radius:4px; white-space:nowrap; opacity:' + op + ';">' + hs.etiqueta + '</div>' : '');

        if (hs.tipo === 'navegacion') {
          el.addEventListener('click', () => { this.dispararTransicionHacia(hs.destino); });
        } else {
          el.addEventListener('click', e => { this.mostrarTooltip(e, hs); e.stopPropagation(); });
        }

        layer.appendChild(el);
        const phi = THREE.MathUtils.degToRad(90 - (hs.pitch || 0));
        const theta = THREE.MathUtils.degToRad(hs.yaw || 0);
        const pos3D = new THREE.Vector3(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta));
        this.hotspotsData.push({ el, pos3D });
      });
    }

    mostrarTooltip(e, hs) {
      const tt = document.getElementById('tt-' + this.id);
      const rect = e.currentTarget.getBoundingClientRect();
      const wrapRect = this.contenedor.getBoundingClientRect();
      tt.innerHTML = '<strong style="font-weight:600; font-size:0.75rem; display:block; margin-bottom:2px;">' + (hs.etiqueta || 'Información') + '</strong><span style="color:rgba(255,255,255,0.7); font-size:0.75rem;">' + (hs.descripcion || '') + '</span>';
      tt.style.left = (rect.left - wrapRect.left + rect.width / 2) + 'px';
      tt.style.top = (rect.top - wrapRect.top) + 'px';
      tt.style.opacity = '1';
    }

    ocultarTooltip() { document.getElementById('tt-' + this.id).style.opacity = '0'; }
    toggleEditor(btn) {
      this.modoEditor = !this.modoEditor;
      btn.classList.toggle('activo', this.modoEditor);
      document.getElementById('panel-ed-' + this.id).style.display = this.modoEditor ? 'block' : 'none';
    }
    copiarCoordenadas() {
      navigator.clipboard.writeText('pitch: ' + this.lastClickCoords.pitch + ',\nyaw: ' + this.lastClickCoords.yaw + ',').then(() => {
        const msg = document.getElementById('copy-msg-' + this.id);
        msg.textContent = '✓ Copiado'; setTimeout(() => msg.textContent = '', 2000);
      });
    }

    construirMinimap() {
      const mm = document.getElementById('mm-' + this.id);
      if (!mm || !this.config.escenas) return;
      mm.innerHTML = '';
      Object.entries(this.config.escenas).forEach(([k, esc]) => {
        if (esc.principalZona) {
          const item = document.createElement('div');
          item.className = 'v360-mm-escena';
          item.dataset.zonaName = esc.zona || k;
          item.innerHTML = '<div class="v360-mm-dot"></div><span class="v360-mm-label">' + (esc.zona || k) + '</span>';
          item.addEventListener('click', () => this.dispararTransicionHacia(k));
          mm.appendChild(item);
        }
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
      
      if (this.faseTransicion === "zoom_in") {
        this.transitionProgress += 0.045; 
        
        const t = Math.min(1, this.transitionProgress);
        const curvaSmooth = t * t * (3 - 2 * t); 
        
        this.cameraFOV = THREE.MathUtils.lerp(this.cameraFOV, 73, 0.08); // Zoom sutil a 73
        
        this.matPrincipal.opacity = 1 - curvaSmooth;
        this.matClon.opacity = curvaSmooth;

        if (this.transitionProgress >= 1) {
          this.finalizarDisolvencia(); 
        }
      } 
      else if (this.faseTransicion === "zoom_out") {
        this.cameraFOV = THREE.MathUtils.lerp(this.cameraFOV, 75, 0.06);
        
        if (Math.abs(this.cameraFOV - 75) < 0.1) {
          this.cameraFOV = 75;
          this.faseTransicion = "quieto";
          
          if (this.tourIniciado) {
            document.getElementById('hs-' + this.id).style.opacity = '1';
          }
        }
      }

      this.camera.fov = this.cameraFOV;
      this.camera.updateProjectionMatrix();

      if (this.autoRotar && this.faseTransicion === "quieto") {
        this.lon += (this.config.velocidadRotacion || 0.05);
      }
      
      this.lat = Math.max(-84, Math.min(84, this.lat));
      const phi = THREE.MathUtils.degToRad(90 - this.lat);
      const theta = THREE.MathUtils.degToRad(this.lon);
      this.camera.lookAt(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta));

      const W = this.contenedor.clientWidth; const H = this.contenedor.clientHeight;
      const vec = new THREE.Vector3();
      this.hotspotsData.forEach(({ el, pos3D }) => {
        vec.copy(pos3D).project(this.camera);
        if (vec.z > 1) { el.style.display = 'none'; return; }
        el.style.display = 'flex';
        el.style.left = ((vec.x * 0.5 + 0.5) * W) + 'px';
        el.style.top = ((vec.y * -0.5 + 0.5) * H) + 'px';
      });
      this.renderer.render(this.scene, this.camera);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('.omh-360-widget');
    if (widgets.length === 0) return;
    inyectarDependencias(() => {
      widgets.forEach(w => new OMHWidget360(w));
    });
  });

})();