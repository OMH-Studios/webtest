/**
 * OMH Estudio - Componente Dinámico de Bloques de Texto Editorial
 * Autoejecutable. Lee window.textBloqueConfig para renderizar el contenido.
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("texto-bloque-dinamico");
    if (!contenedor) return;

    // Configuración por defecto
    const config = Object.assign({
      label: "Historia",
      titleHtml: "Nuestro <em>Origen</em>",
      bg: "gris", // "gris" o "negro"
      padding: "7rem 0", // Arriba y abajo
      paragraphs: [] // Array de strings
    }, window.textBloqueConfig);

    // ✨ CORRECCIÓN: Mapeo de fondos usando variables globales heredadas del tema corporativo
    const colorFondo = config.bg === "negro" ? "var(--negro)" : "var(--gris-oscuro)";

    // 1. Inyectar Estilos CSS únicos para el bloque de texto
    if (!document.getElementById("textbloque-styles")) {
      const styles = `
        <style id="textbloque-styles">
          .text-block-section {
            background: ${colorFondo};
            padding: ${config.padding};
            transition: background 0.3s ease;
          }
          .text-block-container {
            max-width: 900px; /* Layout más cerrado para lectura cómoda */
            margin: 0 auto;
            padding: 0 4rem;
          }
          .text-block-label {
            font-family: 'Raleway', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            /* ✨ CORRECCIÓN: Cambiado de var(--rojo) a var(--color-seccion) para herencia dinámica */
            color: var(--color-seccion);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .text-block-label::before {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            /* ✨ CORRECCIÓN: Línea responde al color maestro de la subpágina */
            background: var(--color-seccion);
          }
          .text-block-title {
            font-family: 'Lexend Tera', sans-serif;
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 900;
            line-height: 1.05;
            letter-spacing: -0.02em;
            text-transform: uppercase;
            margin-bottom: 3.5rem;
          }
          .text-block-title em {
            /* ✨ CORRECCIÓN: El énfasis <em> mutará según la sección activa */
            color: var(--color-seccion);
            font-style: normal;
          }
          .text-block-body {
            font-family: 'Raleway', sans-serif;
            font-size: 1.05rem;
            color: var(--gris-texto);
            line-height: 1.8;
            font-weight: 300;
          }
          .text-block-body p {
            margin-bottom: 2rem;
          }
          .text-block-body p:last-child {
            margin-bottom: 0;
          }
          .text-block-body strong {
            color: var(--blanco);
            font-weight: 600;
          }
          
          @media (max-width: 900px) {
            .text-block-container { padding: 0 2rem; }
            .text-block-section { padding: 5rem 0; }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // 2. Construir los párrafos de texto
    let paragraphsHtml = "";
    if (config.paragraphs && config.paragraphs.length > 0) {
      config.paragraphs.forEach(text => {
        paragraphsHtml += `<p class="reveal reveal-delay-1">${text}</p>`;
      });
    }

    // 3. Renderizar en el DOM
    contenedor.innerHTML = `
      <section class="text-block-section">
        <div class="text-block-container">
          <div class="text-block-label reveal">${config.label}</div>
          <h2 class="text-block-title reveal">${config.titleHtml}</h2>
          <div class="text-block-body">
            ${paragraphsHtml}
          </div>
        </div>
      </section>
    `;

    // 4. Vincular con animaciones de Scroll (IntersectionObserver)
    if (typeof observer !== "undefined" && observer.observe) {
      contenedor.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
      const localObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            localObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      contenedor.querySelectorAll('.reveal').forEach(el => localObserver.observe(el));
    }
  });
})();