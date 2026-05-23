/**
 * OMH Estudio - Componente Dinámico de Grid de Tecnología / Características
 * Autoejecutable. Lee window.techGridConfig para renderizar el componente.
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("tecnologia-dinamica");
    if (!contenedor) return;

    // Configuración por defecto por si falta algún parámetro
    const config = Object.assign({
      label: "Stack Creativo",
      titleHtml: "Tecnología &<br><em>Herramientas</em>",
      bg: "negro", // "negro" o "gris"
      padding: "7rem 0", // El valor original por si no se declara en el HTML
      items: []
    }, window.techGridConfig);

    // Definición de colores basados en tu ecosistema CSS (colores.css)
    const colorFondo = config.bg === "gris" ? "var(--gris-oscuro)" : "var(--negro)";

    // 1. Inyectar Estilos CSS únicos para este componente
    if (!document.getElementById("techgrid-styles")) {
      const styles = `
        <style id="techgrid-styles">
          .tech-section {
            background: ${colorFondo};
            padding: ${config.padding};
            transition: background 0.3s ease;
          }
          .tech-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 4rem;
          }
          .tech-label-din {
            font-family: 'Raleway', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: var(--rojo);
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .tech-label-din::before {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            background: var(--rojo);
          }
          .tech-title-din {
            font-family: 'Lexend Tera', sans-serif;
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 900;
            line-height: 0.95;
            letter-spacing: -0.02em;
            text-transform: uppercase;
            margin-bottom: 4rem;
          }
          .tech-title-din em {
            color: var(--rojo);
            font-style: normal;
          }
          .tech-grid-din {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            background: var(--gris-borde);
            border: 1px solid var(--gris-borde);
          }
          .tech-item-din {
            background: ${colorFondo};
            padding: 2.5rem 1.5rem;
            text-align: center;
            transition: background 0.25s ease;
          }
          .tech-item-din:hover {
            background: var(--gris-suave);
          }
          .tech-icon-din {
            font-size: 2.2rem;
            margin-bottom: 1rem;
            display: block;
          }
          .tech-name-din {
            font-family: 'Lexend Tera', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--blanco);
            margin-bottom: 0.4rem;
          }
          .tech-desc-din {
            font-family: 'Raleway', sans-serif;
            font-size: 0.8rem;
            color: var(--gris-texto);
            line-height: 1.5;
          }
          
          /* Responsive Integrado */
          @media (max-width: 900px) {
            .tech-container { padding: 0 1.5rem; }
            .tech-grid-din { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 600px) {
            .tech-section { padding: 4rem 0; }
            .tech-container { padding: 0 1.2rem; }
            /* Cambio clave: 1 sola columna para smartphones */
            .tech-grid-din { grid-template-columns: 1fr; }
            .tech-title-din { margin-bottom: 2.5rem; }
            /* Reducción de padding interno en cada tarjeta para no alargar demasiado el scroll */
            .tech-item-din { padding: 2rem 1rem; }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // 2. Generar el HTML interno del Grid de Elementos
    let gridItemsHtml = "";
    config.items.forEach(item => {
      gridItemsHtml += `
        <div class="tech-item-din">
          <span class="tech-icon-din">${item.icon}</span>
          <div class="tech-name-din">${item.name}</div>
          <div class="tech-desc-din">${item.desc}</div>
        </div>
      `;
    });

    // 3. Construir e Inyectar la Estructura Completa de la Sección
    contenedor.innerHTML = `
      <section class="tech-section">
        <div class="tech-container">
          <div class="tech-label-din reveal">${config.label}</div>
          <h2 class="tech-title-din reveal reveal-delay-1">${config.titleHtml}</h2>
          <div class="tech-grid-din reveal reveal-delay-2">
            ${gridItemsHtml}
          </div>
        </div>
      </section>
    `;

    // 4. Vincular con el Cursor Rojo de OMH si existe en la página
    const cursorCustom = document.getElementById('cursor');
    const ringCustom = document.getElementById('cursor-ring');
    if (cursorCustom && ringCustom) {
      contenedor.querySelectorAll('.tech-item-din').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorCustom.style.transform = 'translate(-50%,-50%) scale(2)';
          ringCustom.style.borderColor = 'rgba(244,212,49,0.5)';
        });
        el.addEventListener('mouseleave', () => {
          cursorCustom.style.transform = 'translate(-50%,-50%) scale(1)';
          ringCustom.style.borderColor = 'rgba(204,0,0,0.4)';
        });
      });
    }

    // 5. Inicializar animaciones de Scroll (IntersectionObserver) para los nuevos elementos
    if (typeof observer !== "undefined" && observer.observe) {
      contenedor.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
      // Fallback si el observer global tarda en cargar
      const localObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            localObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
      contenedor.querySelectorAll('.reveal').forEach(el => localObserver.observe(el));
    }
  });
})();