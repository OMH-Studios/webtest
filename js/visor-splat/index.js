/**
 * index.js — OMH Estudio | Visor Gaussian Splatting
 * ─────────────────────────────────────────────────────────────
 * Punto de entrada único del visor modular.
 * Este es el ÚNICO archivo que se referencia en el HTML.
 *
 * Se encarga de:
 *   1. Leer y validar la configuración (config.js)
 *   2. Construir la UI (ui.js)
 *   3. Inicializar el renderer WebGL (renderer.js)
 *   4. Activar los controles (controls.js)
 *   5. Arrancar la carga del modelo
 *
 * USO EN LA PÁGINA:
 * ─────────────────
 *   <!-- 1. Div contenedor -->
 *   <div id="visor-splat-dinamico"></div>
 *
 *   <!-- 2. Configuración (antes del script) -->
 *   <script>
 *     window.visorSplatConfig = {
 *       mode:      "auto",
 *       modelPath: "../assets/escaneos/auto.ply",
 *       title:     "Volkswagen ID.4",
 *       subtitle:  "EXTERIOR",
 *       height:    "65vh",
 *
 *       // Cámara inicial
 *       defaultTheta: 0.8,
 *       defaultPhi:   2.2,
 *       defaultFov:   35,
 *
 *       // Si el Y está invertido en tu modelo:
 *       upVector: [0, -1, 0],
 *
 *       // Tour 360° (null = oculta el botón)
 *       tourUrl: "../tours/auto-interior.html",
 *     };
 *   </script>
 *
 *   <!-- 3. Script del visor (type="module" para ES6 imports) -->
 *   <script type="module" src="../js/visor-splat/index.js"></script>
 *
 * MODOS DISPONIBLES:
 *   "auto"     → Vehículos. Exterior/Interior, Tour, FOV, Auto-rotar.
 *   "showroom" → Inmuebles. Título, Tour, FOV, Auto-rotar.
 *   "producto" → Objetos. Solo controles básicos. Auto-rota por default.
 *   "simple"   → Solo canvas. Sin UI.
 */

import { buildConfig }    from "./config.js";
import { SplatRenderer }  from "./renderer.js";
import { VisorUI }        from "./ui.js";
import { VisorControls }  from "./controls.js";

// ── Función principal ──────────────────────────────────────
function init() {

  // 1. Construir configuración final (defaults + modo + config del usuario)
  const cfg = buildConfig();
  const log = msg => { if (cfg.debug) console.log("[visor-splat]", msg); };
  const err = msg => console.error("[visor-splat]", msg);

  // 2. Encontrar el contenedor en el DOM
  const container = document.getElementById(cfg.containerId);
  if (!container) {
    err(`No se encontró el elemento #${cfg.containerId} en la página.`);
    return;
  }

  if (!cfg.modelPath) {
    err("Falta modelPath en window.visorSplatConfig");
    // Mostrar error inline
    container.innerHTML = `
      <div style="padding:2rem;color:rgba(255,255,255,.3);font-family:'Raleway',sans-serif;font-size:.8rem;text-align:center;">
        ⚠ Configura <code>modelPath</code> en <code>window.visorSplatConfig</code>
      </div>`;
    return;
  }

  // 3. Construir la UI (inyecta CSS, genera el HTML del visor)
  const ui  = new VisorUI(container, cfg);
  const els = ui.build();
  if (cfg.background) {
    els.wrap.style.backgroundColor = cfg.background;
  }

  // 4. Inicializar el renderer WebGL
  let renderer;
  try {
    renderer = new SplatRenderer(els.canvas, cfg);
  } catch (e) {
    ui.showError(e.message);
    err(e.message);
    return;
  }

  // 5. Conectar controles (mouse, touch, botones)
  const controls = new VisorControls(renderer, els, cfg, ui, els.wrap);
  controls.init();

  // 6. Cargar el modelo
  log(`Modo: ${cfg.mode} | Modelo: ${cfg.modelPath}`);

  renderer
    .load(cfg.modelPath, p => ui.setProgress(p))
    .then(() => {
      ui.showReady();
      log("Modelo listo ✓");
    })
    .catch(e => {
      ui.showError("Verifica la ruta del archivo.\n" + e.message);
      err(e.message);
    });
}

// ── Arrancar cuando el DOM esté listo ─────────────────────
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
