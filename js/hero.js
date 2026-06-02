// Archivo: js/hero.js
// Componente Hero cinematográfico y 100% responsivo para OMH Estudio (Subpáginas)

document.addEventListener("DOMContentLoaded", () => {
    const heroContainer = document.getElementById("hero-dinamico");
    
    if (heroContainer && window.heroConfig) {
        const { 
            label, 
            title, 
            videoPath, 
            overlayOpacity = 0.6, 
            // Modificamos el valor por defecto para que sea un poco más pequeño en general
            titleSize = "clamp(1.6rem, 3.2vw, 2.6rem)" 
        } = window.heroConfig;
        
        heroContainer.innerHTML = `
            <style>
                /* Contenedor maestro del Hero subpágina */
                .hero-sub-master {
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    background-color: var(--negro);
                    margin-bottom: 2rem;
                }

                /* Contenedor del video y contenido (92% del alto de pantalla) */
                #hero-sub { 
                    position: relative; 
                    height: 87vh; 
                    width: 100%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    overflow: hidden; 
                    border-bottom: 1px solid var(--gris-borde); 
                    background-color: var(--negro); 
                }

                .hero-bg { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; }
                .hero-bg .hero-video-bg { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; display: block; pointer-events: none; }
                .hero-overlay { position: absolute; inset: 0; z-index: 2; }
                .hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%); z-index: 3; pointer-events: none; }
                
                /* 📱 CONTENEDOR DE TEXTO RESPONSIVO MEJORADO */
                .hero-content { 
                    position: relative; 
                    z-index: 4; 
                    text-align: center; 
                    width: 100%;
                    max-width: 800px; /* Evita que el texto toque los bordes extremos */
                    padding: 0 1.5rem; /* Margen de protección para celulares */
                    box-sizing: border-box;
                }
                .hero-content .subpage-label { font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-seccion); margin-bottom: 1.2rem; }
                
                /* TÍTULO ANTI-CORTES */
                .hero-content .subpage-title { 
                    font-family: 'Lexend Tera', sans-serif; 
                    font-weight: 900; 
                    font-size: ${titleSize}; 
                    text-transform: uppercase; 
                    letter-spacing: -0.02em; 
                    line-height: 1.1; 
                    color: var(--blanco);
                    
                    /* ✨ LA SOLUCIÓN: Fuerza saltos de línea automáticos si la palabra es muy larga en móvil */
                    white-space: normal;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                }
                
                /* Área inferior negra (8% restante) donde vive el scroll */
                .hero-sub-bottom-bar {
                    height: 8vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--negro);
                }

                /* Indicador de Scroll Animado fuera del video */
                .hero-scroll-indicator { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    opacity: 0.7; 
                }
                .scroll-mouse { width: 22px; height: 36px; border: 2px solid var(--blanco); border-radius: 12px; position: relative; }
                .scroll-wheel { width: 4px; height: 8px; background: var(--color-seccion, #cc0000); border-radius: 2px; position: absolute; top: 6px; left: 50%; transform: translateX(-50%); animation: subScrollAnim 1.6s infinite; }
                
                /* Animaciones de entrada */
                .anim-fade-up { opacity: 0; transform: translateY(30px); animation: subHeroFadeUp 1s cubic-bezier(0.215, 0.610, 0.355, 1) forwards; }
                .delay-1 { animation-delay: 0.2s; }
                .delay-2 { animation-delay: 0.5s; }
                
                @keyframes subHeroFadeUp { to { opacity: 1; transform: translateY(0); } }
                @keyframes subScrollAnim {
                    0% { opacity: 0; top: 6px; }
                    20% { opacity: 1; }
                    60% { opacity: 0; top: 18px; }
                    100% { opacity: 0; top: 6px; }
                }
            </style>

            <div class="hero-sub-master">
                <section id="hero-sub">
                  <div class="hero-bg">
                    <video autoplay loop muted playsinline class="hero-video-bg">
                      <source src="${videoPath}" type="video/mp4">
                    </video>
                  </div>
                  <div class="hero-overlay" style="background: rgba(0,0,0,${overlayOpacity});"></div>
                  <div class="hero-vignette"></div>

                  <div class="hero-content">
                    <p class="subpage-label anim-fade-up">${label}</p>
                    <h1 class="subpage-title anim-fade-up delay-1">${title}</h1>
                  </div>
                </section>

                <div class="hero-sub-bottom-bar">
                    <div class="hero-scroll-indicator anim-fade-up delay-2">
                        <div class="scroll-mouse">
                          <div class="scroll-wheel"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
});