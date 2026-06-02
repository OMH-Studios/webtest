// Archivo: js/gridproyectos.js
// Componente modular y paramétrico para el Grid de Proyectos de OMH Estudio
// Versión Final: Tamaño Adaptativo + Lightbox Popup + Corrección de Cursores

document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("grid-proyectos-dinamico");
    
    if (gridContainer && window.gridProyectosConfig) {
        const { 
            introTitle = "Nuestros Proyectos",
            introSubtitle = "Casos de éxito",
            proyectos = [] 
        } = window.gridProyectosConfig;

        let tarjetasHtml = "";
        
        proyectos.forEach(proj => {
            const isVideo = proj.mediaPath.toLowerCase().endsWith('.mp4');
            let fondoHtml = "";

            if (isVideo) {
                fondoHtml = `
                    <video autoplay muted loop playsinline class="card-media-bg" data-fullmedia="${proj.mediaPath}" data-type="video">
                        <source src="${proj.mediaPath}" type="video/mp4">
                    </video>`;
            } else {
                fondoHtml = `<img src="${proj.mediaPath}" class="card-media-bg" data-fullmedia="${proj.mediaPath}" data-type="img" alt="${proj.title}">`;
            }

            tarjetasHtml += `
                <div class="media-card">
                    ${fondoHtml}
                    <div class="media-overlay-info">
                        <div class="media-cat-text">${proj.category}</div>
                        <h3 class="media-title-text">${proj.title}</h3>
                    </div>
                </div>
            `;
        });

        gridContainer.innerHTML = `
            <style>
                /* ─── ESTILOS ENCAPSULADOS DEL GRID DE PROYECTOS ─── */
                .main-content-section { padding: 4rem 0 4rem 0; background: var(--negro); }
                .grid-container-inner { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }
                
                /* Introducción */
                .intro-text-layout { max-width: 850px; margin: 0 auto 5rem auto; text-align: center; }
                .intro-text-layout h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 3vw, 2.8rem); font-style: italic; font-weight: 400; margin-bottom: 2.5rem; color: var(--blanco); line-height: 1.4; }
                .intro-text-layout h2 em { color: var(--color-seccion); font-weight: 600; font-style: normal; }
                .intro-text-layout p { font-family: 'Raleway', sans-serif; font-size: 1.05rem; color: var(--gris-texto); line-height: 1.8; margin-bottom: 1.5rem; font-weight: 400; }
                .intro-divider { width: 60px; height: 2px; background: var(--color-seccion); margin: 0 auto 3rem auto; }

                /* Grid Estructura */
                .media-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem; margin-bottom: 2rem; align-items: start; }
                
                /* Tarjeta Individual */
                .media-card { background: var(--gris-medio); border: 1px solid var(--gris-borde); overflow: hidden; position: relative; display: flex; flex-direction: column; justify-content: flex-end; transition: border-color 0.4s ease; cursor: pointer; }
                
                /* Imagen/Video de fondo */
                .media-card .card-media-bg { 
                    position: relative; 
                    width: 100%; 
                    height: auto; 
                    display: block; 
                    z-index: 1; 
                    opacity: 1; 
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                /* Efectos de Hover */
                .media-card:hover { border-color: var(--color-seccion); }
                .media-card:hover .card-media-bg { transform: scale(1.05); }

                /* Información en Hover */
                .media-overlay-info { 
                    position: absolute; 
                    inset: 0; 
                    z-index: 2; 
                    padding: 2.5rem 2rem; 
                    box-sizing: border-box; 
                    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 70%, transparent 100%); 
                    opacity: 0; 
                    transform: translateY(15px); 
                    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); 
                    text-align: left;
                    display: flex; 
                    flex-direction: column;
                    justify-content: flex-end;
                }
                .media-card:hover .media-overlay-info { opacity: 1; transform: translateY(0); }
                .media-cat-text { font-family: 'Raleway', sans-serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-seccion); margin-bottom: 0.4rem; font-weight: 700; }
                .media-title-text { font-family: 'Lexend Tera', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--blanco); margin: 0; }

                /* ─── ESTILOS PARA EL LIGHTBOX / POP-UP ─── */
                .lightbox-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.4s ease;
                    cursor: zoom-out; /* Cursor indicador para cerrar al hacer click fuera */
                }
                
                .lightbox-overlay.active {
                    opacity: 1;
                    pointer-events: auto;
                }

                .lightbox-content-wrapper {
                    position: relative;
                    max-width: 85vw;
                    max-height: 85vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transform: scale(0.9);
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: default; /* Retorna el cursor a modo normal sobre el contenido */
                }
                .lightbox-overlay.active .lightbox-content-wrapper {
                    transform: scale(1);
                }

                .lightbox-media {
                    max-width: 100%;
                    max-height: 85vh;
                    object-fit: contain;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    background: #000;
                }

                .lightbox-close-btn {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: var(--blanco);
                    font-size: 2rem;
                    font-weight: 300;
                    cursor: pointer; /* Mano interactiva garantizada */
                    line-height: 1;
                    padding: 5px;
                    transition: color 0.3s ease, transform 0.3s ease;
                }
                .lightbox-close-btn:hover {
                    color: var(--color-seccion);
                    transform: scale(1.1);
                }

                /* 💡 BOTÓN REGRESAR (Cursor reparado de 'none' a 'pointer') */
                .back-box { text-align: center; padding-bottom: 4rem; background: var(--negro); }
                .btn-back { display: inline-block; padding: 1.1rem 2.5rem; border: 1px solid var(--gris-borde); color: var(--blanco); font-family: 'Raleway', sans-serif; text-decoration: none; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; background: transparent; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; }
                .btn-back:hover { border-color: var(--color-seccion); background-color: var(--color-seccion); color: var(--negro); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1); }

                @media (max-width: 900px) {
                    .grid-container-inner { padding: 0 1.5rem; }
                    .media-grid { grid-template-columns: 1fr; gap: 1.5rem; }
                    .lightbox-close-btn { right: 10px; top: -50px; font-size: 2.5rem; }
                }
            </style>

            <section class="main-content-section">
                <div class="grid-container-inner reveal">
                    
                    <div class="intro-text-layout">
                        <h2>${introTitle}</h2>
                        <div class="intro-divider"></div>
                        <p>${introSubtitle}</p>
                    </div>

                    <div class="media-grid">
                        ${tarjetasHtml}
                    </div>

                </div>
            </section>

            <div id="custom-lightbox" class="lightbox-overlay">
                <div class="lightbox-content-wrapper">
                    <button id="lightbox-close" class="lightbox-close-btn" aria-label="Cerrar vista">&times;</button>
                    <div id="lightbox-target"></div>
                </div>
            </div>
        `;

        // ─── LÓGICA JAVASCRIPT DEL POP-UP (LIGHTBOX) ───
        const lightbox = document.getElementById("custom-lightbox");
        const lightboxTarget = document.getElementById("lightbox-target");
        const lightboxClose = document.getElementById("lightbox-close");
        const cards = gridContainer.querySelectorAll(".media-card");

        // Abrir el Pop-up al hacer click en la tarjeta
        cards.forEach(card => {
            card.addEventListener("click", () => {
                const mediaElement = card.querySelector(".card-media-bg");
                const mediaUrl = mediaElement.getAttribute("data-fullmedia");
                const mediaType = mediaElement.getAttribute("data-type");

                lightboxTarget.innerHTML = ""; 

                if (mediaType === "video") {
                    lightboxTarget.innerHTML = `
                        <video src="${mediaUrl}" class="lightbox-media" autoplay controls loop playsinline></video>
                    `;
                } else {
                    lightboxTarget.innerHTML = `
                        <img src="${mediaUrl}" class="lightbox-media" alt="Vista ampliada">
                    `;
                }

                lightbox.classList.add("active");
                document.body.style.overflow = "hidden"; // Bloquea el scroll del fondo
            });
        });

        // Función para cerrar el Pop-up
        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = ""; // Restaura el scroll
            setTimeout(() => { lightboxTarget.innerHTML = ""; }, 400); 
        };

        // Eventos de cierre
        lightboxClose.addEventListener("click", closeLightbox);
        
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });

        // Animación Reveal original del scroll
        const reveals = gridContainer.querySelectorAll('.reveal');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach(el => observer.observe(el));
    }
});