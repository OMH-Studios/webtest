document.addEventListener("DOMContentLoaded", () => {
  const contenedorBehance = document.getElementById("portfolio-behance-dinamico");
  
  // Si no existe el contenedor o la configuración, salimos silenciosamente
  if (!contenedorBehance || !window.behanceConfig) return;

  const configBehance = window.behanceConfig;

  let htmlBehance = `
    <style>
      .behance-portfolio-container {
        width: 100%;
        max-width: 1200px; /* Recuperamos el ancho completo para permitir el estiramiento lateral */
        margin: 0 auto;
        padding: 0 2rem;
      }
      /* Encabezado de la sección */
      .behance-header {
        text-align: center;
        margin-bottom: 3rem;
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 1s ease, transform 1s ease;
      }
      .behance-header.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .behance-subtitle {
        font-family: 'Raleway', sans-serif;
        font-size: 0.9rem;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--color-seccion);
        opacity: 0.9;
        display: block;
        margin-bottom: 1rem;
      }
      .behance-title {
        font-family: 'Lexend Tera', sans-serif;
        font-weight: 700;
        font-size: 2.5rem;
        color: var(--blanco);
        line-height: 1.2;
      }
      .behance-title em {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-weight: 400;
        color: var(--color-seccion);
      }
      
      /* Contenedor responsivo del Visor Panorámico */
      .behance-embed-wrapper {
        width: 100%;
        margin: 0 auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        background: var(--gris-oscuro);
        opacity: 0;
        transform: scale(0.98);
        transition: opacity 1.2s ease, transform 1.2s ease;
      }
      .behance-embed-wrapper.visible {
        opacity: 1;
        transform: scale(1);
      }
      
      /* Forzar formato ULTRA PANORÁMICO (Ancho completo, altura baja) */
      .behance-iframe {
        width: 100%;
        height: ${configBehance.embedHeight || '260px'}; /* Forzado a baja altura por defecto */
        display: block;
        border: none;
      }
      
      @media (max-width: 768px) {
        .behance-title { font-size: 1.8rem; }
        .behance-iframe {
          height: ${configBehance.embedHeightMobile || '180px'}; /* Proporción compacta para pantallas touch */
        }
        .behance-portfolio-container { padding: 0 1rem; }
      }
    </style>

    <div class="behance-portfolio-container">
      ${configBehance.titulo || configBehance.subtitulo ? `
        <div class="behance-header" id="b-header-tgt">
          ${configBehance.subtitulo ? `<span class="behance-subtitle">${configBehance.subtitulo}</span>` : ''}
          ${configBehance.titulo ? `<h2 class="behance-title">${configBehance.titulo}</h2>` : ''}
        </div>
      ` : ''}
      
      <div class="behance-embed-wrapper" id="b-wrapper-tgt">
        <iframe 
          src="https://www.behance.net/embed/project/${configBehance.proyectoId}?ilo0=1" 
          class="behance-iframe"
          allowfullscreen 
          lazyload 
          frameborder="0" 
          allow="clipboard-write" 
          refererPolicy="strict-origin-when-cross-origin">
        </iframe>
      </div>
    </div>
  `;

  contenedorBehance.innerHTML = htmlBehance;

  contenedorBehance.style.display = "block";
  contenedorBehance.style.backgroundColor = `var(--${configBehance.bg || 'negro'})`;
  contenedorBehance.style.paddingTop = configBehance.paddingTop || "4rem";
  contenedorBehance.style.paddingBottom = configBehance.paddingBottom || "8rem"; // Mantiene el espacio hacia la botonera

  const hBehance = document.getElementById("b-header-tgt");
  const wBehance = document.getElementById("b-wrapper-tgt");

  const obsBehance = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  if (hBehance) obsBehance.observe(hBehance);
  if (wBehance) obsBehance.observe(wBehance);
});