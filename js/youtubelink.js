// Archivo: js/youtubelink.js
// Componente autónomo y paramétrico para secciones de Video de OMH Estudio

document.addEventListener("DOMContentLoaded", () => {
    // Buscamos el contenedor en el HTML de la página actual
    const showreelContainer = document.getElementById("showreel-dinamico");
    
    // Si el contenedor existe y tiene configuraciones definidas:
    if (showreelContainer && window.showreelConfig) {
        
        // Extraemos los parámetros configurados en el HTML
        const {
            label = "Showreel",
            titleHtml = "Nuestro <em>trabajo</em>",
            youtubeId = "qUj9q0LFO7g",
            bottomText = "PRODUCTION REEL 2026",
            bg = "negro" // Puede ser: "negro", "gris-oscuro", "gris-medio", "gris-suave"
        } = window.showreelConfig;

        // Inyectamos la estructura con el CSS encapsulado completo
        showreelContainer.innerHTML = `
            <style>
                /* ─── CONTENEDOR GENERAL DEL MÓDULO ─── */
                #showreel-modulo { 
                    background: var(--${bg}); 
                    padding: 5rem 0; 
                    width: 100%;
                    overflow: hidden;
                }
                
                /* ─── FUENTES Y DISEÑO DE TEXTOS ENCAPSULADOS ─── */
                #showreel-modulo .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                
                #showreel-modulo .section-label {
                    color: var(--color-seccion);
                    font-family: 'Raleway', sans-serif; 
                    font-size: 0.65rem; 
                    font-weight: 700;
                    letter-spacing: 0.3em; 
                    text-transform: uppercase; 
                    margin-bottom: 1.5rem;
                    display: flex; 
                    align-items: center; 
                    gap: 1rem;
                }
                
                #showreel-modulo .section-label::before { 
                    content: ''; 
                    display: block; 
                    width: 24px; 
                    height: 1px; 
                    background: var(--color-seccion);
                }
                
                #showreel-modulo .section-title {
                    color: var(--blanco, #ffffff);
                    font-family: 'Lexend Tera', sans-serif; 
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 900; 
                    line-height: 0.95; 
                    letter-spacing: -0.02em; 
                    text-transform: uppercase; 
                    margin-bottom: 1.5rem;
                }
                
                /* El texto enfatizado toma dinámicamente el color de la sección activa */
                #showreel-modulo .section-title em { 
                    color: var(--color-seccion); 
                    font-style: normal; 
                }

                /* ─── MARCO DEL VIDEO Y ENTORNO REPRODUCIBLE ─── */
                .showreel-wrapper { 
                    position: relative; 
                    max-width: 1100px; 
                    margin: 3rem auto 0; 
                    padding: 0 4rem; 
                }
                .video-frame {
                    position: relative; 
                    aspect-ratio: 16/9;
                    background: var(--gris-suave, #111111); 
                    border: 1px solid var(--gris-borde, #222222); 
                    overflow: hidden;
                }
                
                /* Esquinas decorativas que obedecen al color maestro de la página */
                .video-frame .bracket { 
                    position: absolute; 
                    width: 24px; 
                    height: 24px; 
                    z-index: 3; 
                    pointer-events: none; 
                }
                .video-frame .bracket.tl { top:12px; left:12px; border-top:2px solid var(--color-seccion); border-left:2px solid var(--color-seccion); }
                .video-frame .bracket.tr { top:12px; right:12px; border-top:2px solid var(--color-seccion); border-right:2px solid var(--color-seccion); }
                .video-frame .bracket.bl { bottom:12px; left:12px; border-bottom:2px solid var(--color-seccion); border-left:2px solid var(--color-seccion); }
                .video-frame .bracket.br { bottom:12px; right:12px; border-bottom:2px solid var(--color-seccion); border-right:2px solid var(--color-seccion); }
                
                .video-frame iframe { 
                    width: 100%; 
                    height: 100%; 
                    border: none; 
                    display: block; 
                }

                /* Ajustes para pantallas móviles y tabletas */
                @media (max-width: 900px) {
                    .showreel-wrapper { padding: 0 1.5rem; }
                    #showreel-modulo { padding: 5rem 0; }
                    #showreel-modulo .container { padding: 0 1.5rem; }
                }
            </style>

            <section id="showreel-modulo">
              <div class="container">
                <div class="section-label reveal">${label}</div>
                <h2 class="section-title reveal reveal-delay-1">${titleHtml}</h2>
              </div>
              <div class="showreel-wrapper">
                <div class="video-frame reveal reveal-delay-2">
                  <div class="bracket tl"></div>
                  <div class="bracket tr"></div>
                  <div class="bracket bl"></div>
                  <div class="bracket br"></div>

                  <iframe
                    src="https://www.youtube.com/embed/${youtubeId}?rel=0&color=white"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen>
                  </iframe>
                </div>
                <p style="text-align:right; font-size:0.65rem; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.15); margin-top:0.75rem;">
                  ${bottomText}
                </p>
              </div>
            </section>
        `;

        // Activador de animaciones de scroll para los elementos recién creados
        const reveals = showreelContainer.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(el => observer.observe(el));
    }
});