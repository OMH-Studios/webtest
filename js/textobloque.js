/**
 * OMH Estudio - Componente Dinámico de Bloques de Texto Editorial
 * Autoejecutable. Carga texto plano desde archivos externos de forma automática.
 * Versión: Márgenes alineados a Grid 1200px y Tipografía Responsiva
 */
(function () {
  document.addEventListener("DOMContentLoaded", async () => {
    const contenedor = document.getElementById("texto-bloque-dinamico");
    if (!contenedor) return;

    // Configuración por defecto
    const config = Object.assign({
      label: "Historia",
      titleHtml: "Nuestro <em>Origen</em>",
      bg: "gris", 
      padding: "7rem 0", 
      paragraphs: [],
      urlTexto: null // Ruta al archivo .txt o .json
    }, window.textBloqueConfig);

    // 🚀 PROCESADOR DE TEXTO PLANO EXTERNO
    if (config.urlTexto) {
      try {
        const response = await fetch(config.urlTexto);
        if (response.ok) {
          let textoPlano = await response.text();
          
          // 1. Automatizar negritas: Convierte **texto** a <strong>texto</strong>
          textoPlano = textoPlano.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          
          // 2. Automatizar párrafos: Separa el texto cada vez que encuentra una línea en blanco
          config.paragraphs = textoPlano.split(/\n\s*\n/).filter(p => p.trim() !== "");
        } else {
          console.error("OMH Estudio - Error al cargar el archivo de texto:", response.statusText);
        }
      } catch (error) {
        console.error("OMH Estudio - Error en la petición del archivo:", error);
      }
    }

    // Mapeo de fondos usando variables globales
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
          
          /* CONTENEDOR AJUSTADO A 1200px (Igual que TechGrid y GridProyectos) */
          .text-block-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 4rem; 
          }

          .text-block-label {
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
          .text-block-label::before {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            background: var(--color-seccion);
          }

          /* TÍTULO RESPONSIVO PARA MÓVILES */
          .text-block-title {
            font-family: 'Lexend Tera', sans-serif;
            /* Se bajó el tamaño base de 2rem a 1.4rem para que palabras largas quepan en móvil */
            font-size: clamp(1.4rem, 5vw, 3.5rem); 
            font-weight: 900;
            line-height: 1.1;
            letter-spacing: -0.02em;
            text-transform: uppercase;
            margin-bottom: 3.5rem;
            /* Propiedades clave para evitar que el texto desborde la pantalla */
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto; 
          }
          .text-block-title em {
            color: var(--color-seccion);
            font-style: normal;
          }

          .text-block-body {
            font-family: 'Raleway', sans-serif;
            font-size: 1.05rem;
            color: var(--gris-texto);
            line-height: 1.8;
            font-weight: 300;
            /* Limitamos el ancho del texto a 850px para mantener una lectura óptima, 
               aunque el contenedor principal mida 1200px */
            max-width: 850px; 
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

          /* MEDIA QUERIES IGUALADAS A TUS OTROS COMPONENTES */
          @media (max-width: 900px) {
            .text-block-container { padding: 0 1.5rem; }
            .text-block-section { padding: 5rem 0; }
          }
          
          @media (max-width: 600px) {
            .text-block-container { padding: 0 1.2rem; }
            .text-block-title { margin-bottom: 2rem; } /* Menos espacio de separación en celular */
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // 2. Construir los párrafos de texto procesados
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