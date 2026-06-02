/**
 * OMH Estudio - Componente Dinámico de Marquee de Aliados / Clientes
 * Autoejecutable. Incluye título editable, control de padding, bordes y fondo.
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("marquee-clientes-dinamico");
    if (!contenedor) return;

    // ═══════════════════════════════════════════════════════════════
    //  0. DETECCIÓN AUTOMÁTICA DE RUTA (ROOT VS SUBPASTAS)
    // ═══════════════════════════════════════════════════════════════
    const esSubpagina = window.location.pathname.includes('/pages/') || 
                        document.body.classList.contains('page-sub') ||
                        !document.querySelector('.page-index'); 

    const prefijoRuta = esSubpagina ? "../" : "";

    // ═══════════════════════════════════════════════════════════════
    //  1. CONFIGURACIÓN DINÁMICA (EDITABLE DESDE EL HTML)
    // ═══════════════════════════════════════════════════════════════
    const config = Object.assign({
      title: "Empresas que confían en nosotros", // ← Título por defecto si no se pone en el HTML
      bg: "negro",           
      padding: "6rem 0",     
      mostrarBordes: true,   
    }, window.clientesMarqConfig); 

    const colorFondo = config.bg === "gris" ? "var(--gris-oscuro, #0a0a0a)" : "var(--negro, #000000)";

    // Lista global centralizada de logotipos
    const LOGOS_BASE = [
      "assets/logos/logo1.png",
      "assets/logos/logo2.png",
      "assets/logos/logo3.png",
      "assets/logos/logo4.png",
      "assets/logos/logo5.png",
      "assets/logos/logo6.png",
      "assets/logos/logo7.png"
    ];

    // ═══════════════════════════════════════════════════════════════
    //  2. INYECTAR ESTILOS CSS DINÁMICOS
    // ═══════════════════════════════════════════════════════════════
    if (!document.getElementById("omh-marquee-styles")) {
      const estiloBordes = config.mostrarBordes 
        ? "border-top: 1px solid var(--gris-borde, #222222); border-bottom: 1px solid var(--gris-borde, #222222);" 
        : "border: none !important;";

      const styles = `
        <style id="omh-marquee-styles">
          .marquee-section {
            background: ${colorFondo}; 
            padding: ${config.padding};   
            width: 100%;
            overflow: hidden;
            position: relative;
            box-sizing: border-box;
            transition: background 0.3s ease, padding 0.3s ease;
            ${estiloBordes} 
          }
          /* Estilo del texto pequeño superior */
          .marquee-title {
            color: var(--color-seccion); 
            font-family: 'Raleway', sans-serif; 
            font-size: 0.65rem; 
            font-weight: 700; 
            letter-spacing: 0.3em; 
            text-align: center; 
            margin-bottom: 2.5rem; /* Separación con los logos */
            text-transform: uppercase;
          }
          .omh-marquee-wrapper {
            display: flex;
            width: 100%;
            overflow: hidden;
          }
          .omh-marquee-content {
            display: flex;
            align-items: center;
            justify-content: space-around;
            white-space: nowrap;
            width: 300%; 
            animation: omhMarqueeAnimation 25s linear infinite;
          }
          .omh-marquee-content img {
            height: 40px; 
            margin: 0 40px; 
            filter: grayscale(100%) brightness(200%); 
            opacity: 0.6;
            transition: filter 0.3s ease, opacity 0.3s ease;
          }
          .omh-marquee-content img:hover {
            filter: grayscale(0%) brightness(100%);
            opacity: 1;
          }
          @keyframes omhMarqueeAnimation {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.333%); }
          }
          @media (max-width: 900px) {
            .marquee-section { padding: 3rem 0; }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // ═══════════════════════════════════════════════════════════════
    //  3. CONSTRUCCIÓN DEL CONTENIDO E INYECTAR AL DOM
    // ═══════════════════════════════════════════════════════════════
    let logosHtml = "";
    if (LOGOS_BASE.length > 0) {
      const tripleLogos = [...LOGOS_BASE, ...LOGOS_BASE, ...LOGOS_BASE];
      tripleLogos.forEach(rutaUrl => {
        logosHtml += `<img src="${prefijoRuta}${rutaUrl}" alt="Logo Aliado OMH">`;
      });
    }

    // Volvemos a inyectar la etiqueta <p class="marquee-title"> antes del wrapper de los logos
    contenedor.innerHTML = `
      <section class="marquee-section">
        <p class="marquee-title">${config.title}</p>
        <div class="omh-marquee-wrapper">
          <div class="omh-marquee-content">
            ${logosHtml}
          </div>
        </div>
      </section>
    `;
  });
})();