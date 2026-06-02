/**
 * OMH Estudio - Componente Dinámico de Frase Destacada (Versión Final)
 * Autoejecutable. Lee window.fraseDestacadaConfig para renderizar el contenido.
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("frase-destacada-dinamica");
    if (!contenedor) return;

    // Configuración por defecto
    const config = Object.assign({
      text: "",
      bg: "negro",
      highlightColor: "var(--color-seccion)",
      fontFamily: "raleway", // "raleway", "lexend" o "playfair"
      fontSize: "2.3rem",
      align: "right",
      padding: "6rem 0"
    }, window.fraseDestacadaConfig);

    // 🔤 Mapeo de las 3 tipografías corporativas
    const mapaFuentes = {
      'raleway': "'Raleway', sans-serif",
      'lexend': "'Lexend Tera', sans-serif",
      'playfair': "'Playfair Display', serif"
    };

    // Seleccionar la fuente configurada (si no existe o hay error, usa Raleway por defecto)
    const fuenteSeleccionada = mapaFuentes[config.fontFamily.toLowerCase()] || mapaFuentes['raleway'];

    // Procesar estilos de formato en el texto plano
    let textoProcesado = config.text;
    textoProcesado = textoProcesado.replace(/\*\*(.*?)\*\*/g, '<span class="quote-highlight">$1</span>');
    textoProcesado = textoProcesado.replace(/__(.*?)__/g, '<em>$1</em>');
    textoProcesado = textoProcesado.replace(/--(.*?)--/g, '<ins>$1</ins>');

    // Determinación del fondo
    const colorFondo = config.bg === "negro" ? "var(--negro)" : "var(--gris-oscuro)";

    // Inyectar estilos CSS únicos una sola vez en el documento
    if (!document.getElementById("frasedestacada-styles")) {
      const styles = `
        <style id="frasedestacada-styles">
          .editorial-quote-section {
            width: 100%;
            transition: background 0.3s ease;
          }
          .editorial-quote-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 4rem;
            width: 100%;
          }
          .editorial-quote-text {
            font-weight: 300;
            line-height: 1.4;
            color: var(--gris-texto);
            letter-spacing: -0.01em;
            margin: 0;
          }
          .editorial-quote-text .quote-highlight {
            color: var(--quote-accent-color);
            font-weight: 500;
          }
          .editorial-quote-text em { font-style: italic; }
          .editorial-quote-text ins { text-decoration: underline; }
          @media (max-width: 768px) {
            .editorial-quote-container { padding: 0 2rem; }
            .editorial-quote-text { text-align: left !important; }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // Renderizar la estructura con la tipografía dinámica inyectada inline
    contenedor.innerHTML = `
      <section class="editorial-quote-section" style="background: ${colorFondo}; padding: ${config.padding};">
        <div class="editorial-quote-container">
          <p class="editorial-quote-text" style="
            text-align: ${config.align}; 
            font-family: ${fuenteSeleccionada};
            font-size: clamp(1.4rem, 3vw, ${config.fontSize});
            --quote-accent-color: ${config.highlightColor};
          ">
            ${textoProcesado}
          </p>
        </div>
      </section>
    `;
  });
})();