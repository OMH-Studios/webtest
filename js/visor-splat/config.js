/**
 * config.js — OMH Estudio | Visor Gaussian Splatting
 * ─────────────────────────────────────────────────────────────
 * Centro de control de todos los parámetros del visor.
 *
 * MODOS DISPONIBLES  →  mode: "auto" | "producto" | "showroom" | "simple"
 *
 *   "auto"      → Visor completo para vehículos. Muestra título, botones
 *                 Exterior/Interior, Tour 360°, FOV, autorotar, pantalla completa.
 *
 *   "showroom"  → Para inmuebles / real estate. Como "auto" pero sin
 *                 los botones Exterior/Interior. Incluye espacio para hotspots.
 *
 *   "producto"  → Objeto simple centrado. Sin título principal, solo
 *                 controles básicos (reset, autorotar, fullscreen).
 *
 *   "simple"    → Mínimo absoluto. Solo el canvas con controles de cámara.
 *                 Sin ningún elemento UI encima. Ideal para embeds pequeños.
 *
 * EJEMPLO DE USO en la página:
 * ─────────────────────────────
 *   <script>
 *     window.visorSplatConfig = {
 *       mode:      "auto",
 *       modelPath: "../assets/escaneos/auto.ply",
 *       title:     "Volkswagen ID.4",
 *       subtitle:  "EXTERIOR",
 *       height:    "65vh",
 *     };
 *   </script>
 *   <script src="../js/visor-splat/index.js"></script>
 */

// ── Defaults base (aplican a todos los modos) ─────────────────
const DEFAULTS = {

  // ── MODELO ──────────────────────────────────────────────────
  modelPath:       null,           // REQUERIDO. Ruta al archivo .ply o .splat
  containerId:     "visor-splat-dinamico", // ID del div contenedor en el HTML

  // ── MODO Y APARIENCIA ────────────────────────────────────────
  mode:            "auto",         // "auto" | "showroom" | "producto" | "simple"
  height:          "70vh",         // Altura del visor. Acepta: "70vh", "600px", "100%"
  background:      "var(--negro, #0a0a0a)", // Color de fondo del visor

  // ── TEXTOS UI ────────────────────────────────────────────────
  title:           "Nombre del Modelo",
  subtitle:        "MODELO 3D",

  // ── CÁMARA ───────────────────────────────────────────────────
  defaultTheta:    0.5,    // Rotación horizontal inicial (radianes). 0 = frente
  defaultPhi:      1.2,    // Ángulo vertical inicial (radianes). 1.57 = ecuador
  defaultFov:      35,     // Campo de visión inicial en grados. 35=telefoto, 90=gran angular
  upVector:        [0, 1, 0], // Vector "arriba" del modelo. Usa [0,-1,0] si sale boca abajo
  cameraTargetOffset: [0, 0, 0], // <-- NUEVO: Desplaza el centro de mirada [X, Y, Z]

  // ── AUTO-ROTACIÓN ────────────────────────────────────────────
  autoRotate:      false,   // true = empieza girando al cargar
  autoRotateSpeed: 0.3,     // Velocidad en grados/segundo

  // ── BOTONES MODO "AUTO" ──────────────────────────────────────
  // Etiquetas de los botones de vista
  labelExterior:   "Exterior",
  labelInterior:   "Interior",
  // URL del tour 360° (null = oculta el botón)
  tourUrl:         null,

  // ── HOTSPOTS (próxima versión) ────────────────────────────────
  // hotspots: [
  //   { id: "hs1", position: [x, y, z], label: "Motor", icon: "info", url: null }
  // ],

  // ── DESARROLLO ───────────────────────────────────────────────
  debug: true,   // false en producción para silenciar los logs de consola

  // ── CÁMARA ───────────────────────────────────────────────────
  defaultTheta:    0.5,    // Rotación horizontal inicial (radianes). 0 = frente
  defaultPhi:      1.2,    // Ángulo vertical inicial (radianes). 1.57 = ecuador
  defaultFov:      55,     // Campo de visión inicial en grados. 35=telefoto, 90=gran angular
  upVector:        [0, 1, 0], // Vector "arriba" del modelo. Usa [0,-1,0] si sale boca abajo
  cameraRadiusMultiplier: 2.0, // <-- NUEVO: Controla qué tan cerca inicia la cámara (menor = más cerca)
};

// ── Defaults específicos por modo ─────────────────────────────
// Sobreescriben los DEFAULTS base cuando se elige ese modo
const MODE_OVERRIDES = {
  auto: {
    defaultFov:   55,
    defaultTheta: 0.8,
    defaultPhi:   1.2,
  },
  showroom: {
    defaultFov:   55,
    defaultTheta: 0.5,
    defaultPhi:   1.1,
    autoRotate:   false,
  },
  producto: {
    defaultFov:   55,
    defaultTheta: 0.5,
    defaultPhi:   1.2,
    autoRotate:   true,
    autoRotateSpeed: 0.2,
  },
  simple: {
    defaultFov:   55,
    defaultTheta: 0.5,
    defaultPhi:   1.2,
  },
};

/**
 * buildConfig()
 * Toma window.visorSplatConfig del HTML, lo mezcla con los defaults
 * del modo seleccionado y los defaults base.
 * Orden de prioridad: config del HTML > defaults del modo > defaults base
 */
export function buildConfig() {
  const userCfg  = window.visorSplatConfig || {};
  const mode     = userCfg.mode || DEFAULTS.mode;
  const modeDefs = MODE_OVERRIDES[mode] || {};

  const cfg = Object.assign({}, DEFAULTS, modeDefs, userCfg);
  cfg.mode = mode; // asegurar que el modo final queda registrado

  return cfg;
}

export { DEFAULTS, MODE_OVERRIDES };
