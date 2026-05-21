/**
 * OMH Estudio - Componente Dinámico de Botones de Acción (Botonera)
 * Autoejecutable. Integrado con el Centro de Control Maestro y data/contacto.js
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("botonera-dinamica");
    if (!contenedor) return;

    // Configuración por defecto de la sección
    const config = Object.assign({
      bg: "negro",         
      padding: "4rem 0",   
      align: "center",     
      tituloText: "",      
      subtituloText: "",   
      botones: []          
    }, window.botoneraConfig);

    const colorFondo = config.bg === "gris" ? "var(--gris-oscuro)" : "var(--negro)";

    // Inyectar Estilos CSS
    if (!document.getElementById("botonera-styles")) {
      const styles = `
        <style id="botonera-styles">
          .btn-section {
            background: ${colorFondo};
            padding: ${config.padding};
            transition: background 0.3s ease;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: none !important;
          }
          .btn-title-din {
            font-family: 'Lexend Tera', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 2.5rem;
            color: var(--blanco);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            text-align: center;
          }
          .btn-subtitle-din {
            font-family: 'Raleway', sans-serif;
            font-size: 1.1rem;
            margin-bottom: 2.5rem;
            color: var(--gris-texto);
            max-width: 600px;
            text-align: center;
          }
          .btn-container {
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
            padding: 0 4rem;
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            justify-content: ${config.align === "left" ? "flex-start" : config.align === "right" ? "flex-end" : "center"};
          }
          .btn-din {
            padding: 1rem 2.8rem;
            text-decoration: none;
            font-family: 'Raleway', sans-serif;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            box-sizing: border-box;
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                        background-color 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease,
                        box-shadow 0.3s ease;
            cursor: none;
          }
          .btn-din-solido {
            background-color: var(--color-seccion);
            color: var(--negro); 
            border: 2px solid var(--color-seccion);
          }
          .btn-din-solido:hover {
            background-color: transparent;
            color: var(--color-seccion);
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(255, 255, 255, 0.05);
          }
          .btn-din-outline {
            background-color: transparent; 
            color: var(--color-seccion);   
            border: 2px solid var(--color-seccion); 
          }
          .btn-din-outline:hover {
            background-color: var(--color-seccion);
            color: var(--negro);
            transform: translateY(-3px);
          }
          .btn-din-marco {
            background-color: transparent;
            color: var(--blanco);
            border: 1px solid rgba(255, 255, 255, 0.25);
          }
          .btn-din-marco:hover {
            border-color: var(--color-secundario);
            color: var(--color-secundario);
            transform: translateY(-2px);
          }
          @media (max-width: 600px) {
            .btn-section { padding: 2.5rem 0; }
            .btn-container { flex-direction: column; align-items: stretch; padding: 0 1.5rem; }
            .btn-din { width: 100%; }
            .btn-title-din { font-size: 1.2rem; padding: 0 1rem; }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // Clasificación y construcción de botones
    let botonesHtml = "";
    config.botones.slice(0, 4).forEach(btn => {
      let claseTipo = "btn-din-outline"; 
      if (btn.type === "solido") claseTipo = "btn-din-solido";
      if (btn.type === "marco") claseTipo = "btn-din-marco";
      if (btn.type === "outline") claseTipo = "btn-din-outline";
      
      let finalUrl = btn.url;

      // ─── AUTOMATIZACIÓN DE WHATSAPP DESDE CONTACTO.JS ───
      if (btn.url === "whatsapp") {
        // Teléfono de respaldo por si no detecta el archivo (fallback)
        let phone = "524461328102"; 
        
        if (window.contactoGlobal && window.contactoGlobal.whatsapp) {
          // Extraer solo los números del string global usando una expresión regular
          const match = window.contactoGlobal.whatsapp.match(/\d+/);
          if (match) phone = match[0];
        }
        
        // Construir URL base limpia
        finalUrl = `https://wa.me/${phone}`;
        
        // Si tiene un mensaje personalizado, lo codifica de forma segura para la URL
        if (btn.msj) {
          finalUrl += `?text=${encodeURIComponent(btn.msj)}`;
        }
      }
      
      const targetAttr = btn.targetBlank ? 'target="_blank"' : '';

      botonesHtml += `
        <a href="${finalUrl}" class="btn-din ${claseTipo} reveal" ${targetAttr}>
          ${btn.text}
        </a>
      `;
    });

    contenedor.innerHTML = `
      <div class="btn-section">
        ${config.tituloText ? `<h3 class="btn-title-din">${config.tituloText}</h3>` : ''}
        ${config.subtituloText ? `<p class="btn-subtitle-din">${config.subtituloText}</p>` : ''}
        <div class="btn-container">
          ${botonesHtml}
        </div>
      </div>
    `;

    // Conexión con Cursor OMH
    const cursorCustom = document.getElementById('cursor');
    const ringCustom = document.getElementById('cursor-ring');
    if (cursorCustom && ringCustom) {
      contenedor.querySelectorAll('.btn-din').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorCustom.style.transform = 'translate(-50%,-50%) scale(2)';
          ringCustom.style.borderColor = 'rgba(255,255,255,0.3)';
        });
        el.addEventListener('mouseleave', () => {
          cursorCustom.style.transform = 'translate(-50%,-50%) scale(1)';
          ringCustom.style.borderColor = 'rgba(204,0,0,0.4)';
        });
      });
    }

    if (typeof observer !== "undefined" && observer.observe) {
      contenedor.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
      contenedor.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }
  });
})();