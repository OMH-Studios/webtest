/**
 * OMH Estudio - Componente Dinámico de Grid de Tecnología
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("tecnologia-dinamica");
    if (!contenedor) return;

    // 1. Configuración y controles de padding
    const config = Object.assign({
      label: "", 
      titleHtml: "", 
      bg: "negro", 
      bgColor: "", // Para forzar color personalizado si lo deseas
      paddingTop: "7rem",
      paddingBottom: "7rem",
      items: []
    }, window.techGridConfig);

    // 2. Definición ESTRICTA del gris más oscuro de tu colores.css
    let colorFondo = config.bgColor;
    if (!colorFondo) {
      colorFondo = config.bg === "gris" ? "var(--gris-oscuro)" : "var(--negro)";
    }

    // 3. Inyectar Estilos CSS
    if (!document.getElementById("techgrid-styles")) {
      const styles = `
        <style id="techgrid-styles">
          /* CONTENEDOR PRINCIPAL */
          .tech-section {
            position: relative;
            padding-top: ${config.paddingTop};
            padding-bottom: ${config.paddingBottom};
            z-index: 1;
          }
          
          /* LA MAGIA: Este pseudo-elemento pinta el fondo de lado a lado de la pantalla 
             sin importar en qué contenedor esté metido tu div en el HTML */
          .tech-section::before {
            content: "";
            position: absolute;
            top: 0;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100vw;
            background-color: ${colorFondo};
            z-index: -1;
          }

          .tech-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 4rem;
            position: relative;
          }

          .tech-label-din {
            font-family: 'Raleway', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: var(--color-seccion);
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
            background: var(--color-seccion);
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
            color: var(--color-seccion);
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
            background-color: ${colorFondo};
            padding: 2.5rem 1.5rem;
            text-align: center;
            transition: background-color 0.25s ease;
          }
          .tech-item-din:hover {
            background-color: var(--gris-suave);
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
          
          /* Animaciones de revelado originales */
          .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
          }
          .reveal.visible {
            opacity: 1;
            transform: translateY(0);
          }
          .reveal-delay-1 { transition-delay: 0.2s; }
          .reveal-delay-2 { transition-delay: 0.4s; }

          /* Responsive Integrado */
          @media (max-width: 900px) {
            .tech-container { padding: 0 1.5rem; }
            .tech-grid-din { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 600px) {
            .tech-section { 
                padding-top: calc(${config.paddingTop} * 0.6); 
                padding-bottom: calc(${config.paddingBottom} * 0.6); 
            }
            .tech-container { padding: 0 1.2rem; }
            .tech-grid-din { grid-template-columns: 1fr; }
            .tech-title-din { margin-bottom: 2.5rem; }
            .tech-item-din { padding: 2rem 1rem; }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // 4. Header condicional (No dibuja nada si lo dejas en blanco en el HTML)
    let headerHtml = "";
    if (config.label !== "" || config.titleHtml !== "") {
      headerHtml = `
        ${config.label ? `<div class="tech-label-din reveal">${config.label}</div>` : ""}
        ${config.titleHtml ? `<h2 class="tech-title-din reveal reveal-delay-1">${config.titleHtml}</h2>` : ""}
      `;
    }

    // 5. Items HTML
    let gridItemsHtml = "";
    config.items.forEach(item => {
      const descHtml = item.desc ? `<div class="tech-desc-din">${item.desc}</div>` : "";
      gridItemsHtml += `
        <div class="tech-item-din">
          <span class="tech-icon-din">${item.icon}</span>
          <div class="tech-name-din">${item.name}</div>
          ${descHtml}
        </div>
      `;
    });

    // 6. Inyectar DOM interactivo
    contenedor.innerHTML = `
      <section class="tech-section">
        <div class="tech-container">
          ${headerHtml}
          <div class="tech-grid-din reveal reveal-delay-2">
            ${gridItemsHtml}
          </div>
        </div>
      </section>
    `;

    // 7. Cursor Custom original
    const cursorCustom = document.getElementById('cursor');
    const ringCustom = document.getElementById('cursor-ring');
    if (cursorCustom && ringCustom) {
      contenedor.querySelectorAll('.tech-item-din').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorCustom.style.transform = 'translate(-50%,-50%) scale(2)';
          ringCustom.style.borderColor = 'var(--color-seccion)';
          ringCustom.style.opacity = '0.7';
        });
        el.addEventListener('mouseleave', () => {
          cursorCustom.style.transform = 'translate(-50%,-50%) scale(1)';
          ringCustom.style.borderColor = 'var(--color-seccion)';
          ringCustom.style.opacity = '0.4';
        });
      });
    }

    // 8. IntersectionObserver original intacto
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
      }, { threshold: 0.12 });
      contenedor.querySelectorAll('.reveal').forEach(el => localObserver.observe(el));
    }
  });
})();