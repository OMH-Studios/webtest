// Archivo: js/hero.js
// Componente Hero autónomo para OMH Estudio

document.addEventListener("DOMContentLoaded", () => {
    const heroContainer = document.getElementById("hero-dinamico");
    
    if (heroContainer && window.heroConfig) {
        const { label, title, videoPath, overlayOpacity = 0.6 } = window.heroConfig;
        
        heroContainer.innerHTML = `
            <style>
                #hero-sub { position: relative; height: 75vh; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid var(--gris-borde); background-color: var(--negro); margin-bottom: 4rem; }
                .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
                .hero-bg .hero-video-bg { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; display: block; pointer-events: none; }
                .hero-overlay { position: absolute; inset: 0; z-index: 2; }
                .hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%); z-index: 3; pointer-events: none; }
                .hero-content { position: relative; z-index: 10; text-align: center; padding: 0 2rem; margin-top: 60px; }
                .hero-content .subpage-label { font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-seccion); margin-bottom: 1.2rem; }
                .hero-content .subpage-title { font-family: 'Lexend Tera', sans-serif; font-weight: 900; font-size: clamp(2.2rem, 5vw, 4.5rem); text-transform: uppercase; letter-spacing: -0.02em; line-height: 1.1; color: var(--blanco); }
                .anim-fade-up { opacity: 0; transform: translateY(30px); animation: fadeInUp 1s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }
                .delay-1 { animation-delay: 0.2s; }
                .delay-2 { animation-delay: 0.5s; }
                @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
            </style>

            <section id="hero-sub">
              <div class="hero-bg">
                <video autoplay loop muted playsinline class="hero-video-bg">
                  <source src="${videoPath}" type="video/mp4">
                </video>
              </div>
              <div class="hero-overlay" style="background: rgba(0,0,0, ${overlayOpacity});"></div>
              <div class="hero-vignette"></div>
              <div class="hero-content">
                <div class="subpage-label anim-fade-up delay-1">${label}</div>
                <h1 class="subpage-title anim-fade-up delay-2">${title}</h1>
              </div>
            </section>
        `;
    }
});