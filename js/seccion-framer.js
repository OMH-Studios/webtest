document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("seccion-framer-dinamico");
  
  // Verificar que el contenedor y la configuración existan
  if (!contenedor || !window.framerConfig) return;

  const config = window.framerConfig;

  // 1. INYECTAR EL HTML CON SU BLOQUE DE STYLE INTERNO (Mismo método que hero.js)
  let htmlContenido = `
    <style>
      .framer-analytics-container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
      }
      /* Encabezado Principal */
      .framer-header {
        text-align: center;
        margin-bottom: 4rem;
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 1s ease, transform 1s ease;
      }
      .framer-header.visible {
        opacity: 1;
        transform: translateY(0);
      }
      .framer-subtitle {
        font-family: 'Raleway', sans-serif;
        font-size: 0.9rem;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: var(--color-seccion); /* Enlace directo a tu CSS global */
        opacity: 0.9;
        display: block;
        margin-bottom: 1rem;
      }
      .framer-title {
        font-family: 'Lexend Tera', sans-serif;
        font-weight: 700;
        font-size: 2.5rem;
        color: var(--blanco);
        line-height: 1.2;
      }
      .framer-title em {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-weight: 400;
        color: var(--color-seccion);
      }
      
      /* Grid de Filas Compacto */
      .framer-grid-rows {
        display: flex;
        flex-direction: column;
        gap: 5rem; 
      }
      
      /* Escenario de Animación de Capas */
      .framer-row {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
        overflow: hidden;
        padding: 2rem 0;
      }
      
      /* Contenedor del Texto */
      .framer-col-text {
        width: 45%;
        padding: 0 2.5rem;
        z-index: 1;
        opacity: 0;
        will-change: transform, opacity;
        transition: transform 0.05s ease-out, opacity 0.05s ease-out;
      }
      
      .framer-col-text h3 {
        font-family: 'Lexend Tera', sans-serif;
        font-size: 1.6rem;
        margin-bottom: 1.5rem;
        color: var(--color-seccion); /* Enlace directo a tu CSS global */
      }
      .framer-col-text p {
        font-family: 'Raleway', sans-serif;
        font-size: 1.1rem;
        line-height: 1.7;
        color: var(--blanco);
        opacity: 0.8;
      }
      
      /* Contenedor de la Imagen */
      .framer-col-media {
        width: 45%;
        max-width: 500px;
        overflow: hidden;
        border-radius: 12px;
        z-index: 2;
        box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        will-change: transform;
        transform: translateX(0px);
        transition: transform 0.05s ease-out;
      }
      .framer-col-media img {
        width: 100%;
        height: auto;
        display: block;
      }
      
      /* Dirección base para el entrelazado */
      .framer-row:nth-child(odd) { flex-direction: row-reverse; }
      .framer-row:nth-child(even) { flex-direction: row; }
      
      /* ─── RESPONSIVO MÓVIL OPTIMIZADO ─── */
      @media (max-width: 992px) {
        .framer-grid-rows { gap: 4rem; }
        .framer-row {
          flex-direction: column !important;
          gap: 1.5rem;
        }
        .framer-col-text, .framer-col-media {
          width: 100% !important;
          max-width: 100% !important;
          padding: 0;
          transform: translateY(20px) !important;
          opacity: 0;
          transition: transform 0.8s ease, opacity 0.8s ease;
        }
        .framer-row.active-mobile .framer-col-text,
        .framer-row.active-mobile .framer-col-media {
          transform: translateY(0) !important;
          opacity: 1;
        }
        .framer-title { font-size: 1.8rem; }
      }
    </style>

    <div class="framer-analytics-container">
      ${config.titulo || config.subtitulo ? `
        <div class="framer-header" id="framer-header-target">
          ${config.subtitulo ? `<span class="framer-subtitle">${config.subtitulo}</span>` : ''}
          ${config.titulo ? `<h2 class="framer-title">${config.titulo}</h2>` : ''}
        </div>
      ` : ''}
      
      <div class="framer-grid-rows">
  `;

  config.bloques.forEach((bloque) => {
    htmlContenido += `
      <div class="framer-row">
        <div class="framer-col-text">
          <h3>${bloque.title}</h3>
          <p>${bloque.desc}</p>
        </div>
        <div class="framer-col-media">
          <img src="${bloque.img}" alt="${bloque.title}" loading="lazy">
        </div>
      </div>
    `;
  });

  htmlContenido += `
      </div>
    </div>
  `;

  // Inyectamos todo junto en el contenedor
  contenedor.innerHTML = htmlContenido;

  // 2. SISTEMA DE REVELADO OPTIMIZADO (Legibilidad rápida del texto)
  const targetHeader = document.getElementById("framer-header-target");
  const filas = contenedor.querySelectorAll('.framer-row');

  const generalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.add('active-mobile');
      }
    });
  }, { threshold: 0.05 });

  if (targetHeader) generalObserver.observe(targetHeader);
  filas.forEach(fila => generalObserver.observe(fila));

  // Animación interactiva por scroll para escritorio
  if (window.innerWidth > 992) {
    const animarReveladoLegible = () => {
      const windowHeight = window.innerHeight;

      filas.forEach((fila, index) => {
        const rect = fila.getBoundingClientRect();
        
        // Puntos de disparo adelantados: la animación alcanza su fin 150px antes del centro
        // Esto garantiza que el texto se mantenga completamente revelado mientras se lee
        const puntoDisparoInicio = windowHeight; 
        const puntoDisparoFin = (windowHeight / 2) + 150; 

        const distanciaTotalViaje = puntoDisparoInicio - puntoDisparoFin;
        const avanceActual = puntoDisparoInicio - rect.top;

        let progreso = avanceActual / distanciaTotalViaje;
        
        if (progreso < 0) progreso = 0;
        if (progreso > 1) progreso = 1; // Se queda estático en 1 (revelado total) el resto del camino

        const texto = fila.querySelector('.framer-col-text');
        const media = fila.querySelector('.framer-col-media');
        
        if (texto && media) {
          const maxDesplazamiento = 160; 
          let desplazamientoEfectivo = (1 - progreso) * maxDesplazamiento;

          // La opacidad sube drásticamente rápido para que el texto sea legible de inmediato
          texto.style.opacity = progreso > 0.2 ? 1 : progreso * 5;

          const esFilaPar = (index % 2 !== 0);

          if (!esFilaPar) {
            media.style.transform = `translateX(${desplazamientoEfectivo}px)`;
            texto.style.transform = `translateX(${-desplazamientoEfectivo}px)`;
          } else {
            media.style.transform = `translateX(${-desplazamientoEfectivo}px)`;
            texto.style.transform = `translateX(${desplazamientoEfective = desplazamientoEfectivo}px)`;
          }
        }
      });
      requestAnimationFrame(animarReveladoLegible);
    };

    requestAnimationFrame(animarReveladoLegible);
  }
});