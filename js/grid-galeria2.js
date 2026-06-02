// Archivo: js/grid-galeria02.js

(function cargarCSS() {
  const cssId = 'grid-galeria02-estilos';
  if (!document.getElementById(cssId)) {
    const head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = cssId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '../css/grid-galeria02.css'; 
    head.appendChild(link);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("modulo-servicios-dinamico");
  if (!contenedor || !window.gridServiciosConfig) return;

  const config = window.gridServiciosConfig;

  // 1. Renderizar Métricas
  let metricasHTML = '';
  if (config.problem && config.problem.metrics) {
    metricasHTML = config.problem.metrics.map(m => `
      <div class="problem-stat reveal">
        <div class="stat-number-wrapper">
          <span class="stat-number" style="color: var(--color-seccion);">${m.number}</span>
        </div>
        <p class="stat-desc">${m.description}</p>
      </div>
    `).join('');
  }

  // 2. Renderizar Servicios
  let serviciosHTML = '';
  if (config.services) {
    serviciosHTML = config.services.map(s => {
      
      // Si hay videoPath, agregamos la clase "has-video" a la tarjeta para el CSS
      const cardClass = s.videoPath ? `service-card ${s.size} has-video reveal` : `service-card ${s.size} reveal`;
      
      const mediaTag = s.videoPath 
        ? `<video class="card-media" src="${s.videoPath}#t=0.1" muted loop playsinline preload="metadata"></video>`
        : `<div class="card-media" style="background-image: url('${s.mediaPath}');"></div>`;

      return `
      <a href="${s.url}" class="${cardClass}">
        ${mediaTag}
        <div class="card-overlay"></div>
        <div class="card-content">
          <h3 class="card-title">${s.title}</h3>
          <div class="card-icon-wrapper" style="color: var(--color-seccion);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </div>
      </a>
      `;
    }).join('');
  }

  // 3. Ensamblar HTML Completo
  contenedor.innerHTML = `
    <section class="section-problem-grid">
      <div class="intro-header-block reveal">
        <h2 class="problem-title">${config.problem.title}</h2>
        <div class="problem-stats-container">
          ${metricasHTML}
        </div>
      </div>
      
      <div class="solution-header-block reveal">
        <h2 class="solution-title">${config.solution.title}</h2>
        <p class="solution-subtitle">${config.solution.subtitle}</p>
      </div>
      
      <div class="services-gallery">
        ${serviciosHTML}
      </div>
    </section>
  `;

  // 4. Lógica de Reproducción de Video en Hover
  const tarjetas = contenedor.querySelectorAll('.service-card');
  tarjetas.forEach(tarjeta => {
    const video = tarjeta.querySelector('video.card-media');
    
    if (video) {
      tarjeta.addEventListener('mouseenter', () => {
        video.play().catch(err => console.log("Autoplay bloqueado", err));
      });
      
      tarjeta.addEventListener('mouseleave', () => {
        video.pause();
      });
    }
  });

  // 5. Animaciones de entrada (Reveal)
  setTimeout(() => {
    contenedor.querySelectorAll('.reveal').forEach((el, index) => {
      setTimeout(() => el.classList.add('visible'), index * 100);
    });
  }, 100);
});