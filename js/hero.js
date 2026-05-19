// Archivo: js/hero.js
// Componente Hero dinámico para OMH Estudio (Soporta Video de fondo)

document.addEventListener("DOMContentLoaded", () => {
    const heroContainer = document.getElementById("hero-dinamico");
    
    if (heroContainer && window.heroConfig) {
        // Extraemos las variables que configuraste en el HTML
        const { label, title, videoPath } = window.heroConfig;
        
        // Inyectamos exactamente tu estructura HTML original, pero con <video> en lugar de <img>
        heroContainer.innerHTML = `
            <section id="hero-sub">
              <div class="hero-bg">
                <video autoplay loop muted playsinline class="hero-video-bg">
                  <source src="${videoPath}" type="video/mp4">
                </video>
              </div>
              <div class="hero-overlay"></div>
              <div class="hero-vignette"></div>
              <div class="hero-content">
                <div class="subpage-label anim-fade-up delay-1">${label}</div>
                <h1 class="subpage-title anim-fade-up delay-2">${title}</h1>
              </div>
            </section>
        `;
    }
});