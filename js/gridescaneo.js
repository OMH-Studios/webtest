// Archivo: js/gridescaneo.js
// Componente de Tarjetas "Escáner" con Lightbox Integrado y Encabezado Dinámico
// Ajuste: Enlaces del pie de foto configurados para abrirse siempre en una pestaña nueva (_blank)

document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("grid-escaneo-dinamico");
    
    if (gridContainer && window.gridEscaneoConfig) {
        const { 
            label = "",
            titleHtml = "",
            desc = "",
            items = [] 
        } = window.gridEscaneoConfig;

        let tarjetasHtml = "";
        
        items.forEach(item => {
            tarjetasHtml += `
                <div class="scanner-card reveal">
                    <div class="scanner-visuals">
                        <img src="${item.baseImg}" class="scanner-base" alt="${item.title}">
                        <img src="${item.overlayImg}" class="scanner-overlay" alt="Scan Data">
                    </div>
                    
                    <div class="scanner-caption">
                        <h3 class="caption-title">${item.title}</h3>
                        <div class="caption-subtitle">
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.subtitle}</a>
                        </div>
                    </div>
                </div>
            `;
        });

        // Generar Encabezado Condicional
        let headerHtml = "";
        if (label || titleHtml || desc) {
            headerHtml = `
                <div class="scan-header-layout">
                    ${label ? `<div class="scan-label-din reveal">${label}</div>` : ""}
                    ${titleHtml ? `<h2 class="scan-title-din reveal reveal-delay-1">${titleHtml}</h2>` : ""}
                    ${desc ? `<p class="scan-desc-din reveal reveal-delay-2">${desc}</p>` : ""}
                </div>
            `;
        }

        gridContainer.innerHTML = `
            <style>
                /* ─── ESTILOS GENERALES ─── */
                .scan-main-section { padding: 4rem 0; background: var(--negro, #050505); position: relative; }
                .scan-container-inner { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }
                
                /* ─── ENCABEZADO TIPO TECHGRID ─── */
                .scan-header-layout { margin-bottom: 4rem; }
                .scan-label-din {
                    font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 700;
                    letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-seccion);
                    margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;
                }
                .scan-label-din::before {
                    content: ''; display: block; width: 24px; height: 1px; background: var(--color-seccion);
                }
                .scan-title-din {
                    font-family: 'Lexend Tera', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 900; line-height: 0.95; letter-spacing: -0.02em; text-transform: uppercase;
                    margin-bottom: 2rem; color: var(--blanco);
                }
                .scan-title-din em { color: var(--color-seccion); font-style: normal; }
                .scan-desc-din {
                    font-family: 'Raleway', sans-serif; font-size: 1.05rem; color: var(--gris-texto);
                    line-height: 1.8; max-width: 800px; margin-bottom: 2rem;
                }

                /* ─── GRID Y TARJETAS ─── */
                .scanner-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4rem; }
                .scanner-card { display: flex; flex-direction: column; }

                /* Contenedor Interactivo de Imágenes */
                .scanner-visuals {
                    position: relative; overflow: hidden; background: var(--negro);
                    cursor: zoom-in; margin-bottom: 1.5rem; border: 1px solid var(--gris-borde);
                    transition: border-color 0.4s ease;
                }
                .scanner-base { 
                    width: 100%; height: auto; display: block; 
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease;
                }
                .scanner-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    object-fit: cover; opacity: 0; z-index: 10; transition: opacity 0.5s ease;
                }

                /* Hover Effect */
                .scanner-visuals:hover { border-color: var(--color-seccion); }
                .scanner-visuals:hover .scanner-base {
                    transform: scale(1.08); filter: grayscale(100%) brightness(40%);
                }
                .scanner-visuals:hover .scanner-overlay { opacity: 1; }

                /* Pie de Foto */
                .scanner-caption { text-align: left; }
                .caption-title {
                    font-family: 'Lexend Tera', sans-serif; font-size: 1.2rem;
                    font-weight: 700; text-transform: uppercase; color: var(--blanco); margin-bottom: 0.4rem;
                }
                .caption-subtitle {
                    font-family: 'Raleway', sans-serif; font-size: 0.8rem;
                    font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
                }
                .caption-subtitle a {
                    color: var(--color-seccion); text-decoration: none; position: relative;
                    transition: color 0.3s ease; display: inline-block;
                }
                .caption-subtitle a::after {
                    content: ''; position: absolute; width: 0; height: 1px;
                    bottom: -2px; left: 0; background-color: var(--blanco); transition: width 0.3s ease;
                }
                .caption-subtitle a:hover { color: var(--blanco); }
                .caption-subtitle a:hover::after { width: 100%; }

                /* ─── LIGHTBOX ─── */
                .scan-lightbox {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                    z-index: 9999; display: flex; justify-content: center; align-items: center;
                    opacity: 0; pointer-events: none; transition: opacity 0.4s ease; cursor: zoom-out;
                }
                .scan-lightbox.active { opacity: 1; pointer-events: auto; }
                
                .lightbox-content-wrapper {
                    position: relative; max-width: 90vw; max-height: 90vh;
                    transform: scale(0.9); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: default; display: inline-block;
                }
                .scan-lightbox.active .lightbox-content-wrapper { transform: scale(1); }

                /* Contenedor que mantiene la base y el overlay unidos en tamaño grande */
                .lightbox-image-container { position: relative; display: block; }
                .lb-base { max-width: 100%; max-height: 85vh; display: block; filter: grayscale(100%) brightness(50%); }
                .lb-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; z-index: 11; }

                .lightbox-close-btn {
                    position: absolute; top: -40px; right: 0; background: none; border: none;
                    color: var(--blanco); font-size: 2.5rem; font-weight: 300; cursor: pointer;
                    line-height: 1; transition: color 0.3s ease, transform 0.3s ease; z-index: 12;
                }
                .lightbox-close-btn:hover { color: var(--color-seccion); transform: scale(1.1); }

                /* Revelado */
                .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
                .reveal.visible { opacity: 1; transform: translateY(0); }
                .reveal-delay-1 { transition-delay: 0.2s; }
                .reveal-delay-2 { transition-delay: 0.4s; }

                @media (max-width: 900px) {
                    .scan-container-inner { padding: 0 1.5rem; }
                    .scanner-grid { grid-template-columns: 1fr; gap: 3rem; }
                }
            </style>

            <section class="scan-main-section">
                <div class="scan-container-inner">
                    ${headerHtml}
                    <div class="scanner-grid">
                        ${tarjetasHtml}
                    </div>
                </div>
            </section>

            <div id="scan-lightbox-overlay" class="scan-lightbox">
                <div class="lightbox-content-wrapper">
                    <button id="scan-lightbox-close" class="lightbox-close-btn">&times;</button>
                    <div id="scan-lightbox-target" class="lightbox-image-container"></div>
                </div>
            </div>
        `;

        // ─── LÓGICA DEL LIGHTBOX ───
        const lightbox = document.getElementById("scan-lightbox-overlay");
        const lightboxTarget = document.getElementById("scan-lightbox-target");
        const closeBtn = document.getElementById("scan-lightbox-close");
        const visuals = gridContainer.querySelectorAll(".scanner-visuals");

        visuals.forEach(visual => {
            visual.addEventListener("click", () => {
                const baseSrc = visual.querySelector(".scanner-base").src;
                const overSrc = visual.querySelector(".scanner-overlay").src;

                // Inyectamos ambas imágenes en el lightbox, forzando el estado "Escaneado"
                lightboxTarget.innerHTML = `
                    <img src="${baseSrc}" class="lb-base" alt="Base">
                    <img src="${overSrc}" class="lb-overlay" alt="Scan Overlay">
                `;
                
                lightbox.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
            setTimeout(() => { lightboxTarget.innerHTML = ""; }, 400); 
        };

        closeBtn.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) closeLightbox();
        });

        // ─── ANIMACIÓN REVEAL ───
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