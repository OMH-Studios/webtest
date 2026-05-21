// Archivo: js/gridproyectos.js
// Componente modular y paramétrico para el Grid de Proyectos de OMH Estudio

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
                    <video autoplay muted loop playsinline class="card-img-bg">
                        <source src="${proj.mediaPath}" type="video/mp4">
                    </video>`;
            } else {
                fondoHtml = `<img src="${proj.mediaPath}" class="card-img-bg" alt="${proj.title}">`;
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
                .media-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem; margin-bottom: 2rem; }
                
                /* Tarjeta Individual */
                .media-card { background: var(--gris-medio); aspect-ratio: 16/10; border: 1px solid var(--gris-borde); overflow: hidden; position: relative; display: flex; flex-direction: column; justify-content: flex-end; transition: border-color 0.4s ease; }
                .media-card .card-img-bg { width: 100%; height: 100%; object-fit: cover; opacity: 0.5; position: absolute; inset: 0; z-index: 1; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s; }
                .media-card:hover { border-color: var(--color-seccion); }
                .media-card:hover .card-img-bg { transform: scale(1.05); opacity: 0.85; }

                /* Información en Hover */
                .media-overlay-info { position: relative; z-index: 2; width: 100%; padding: 2.5rem 2rem; box-sizing: border-box; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 70%, transparent 100%); opacity: 0; transform: translateY(15px); transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); text-align: left; }
                .media-card:hover .media-overlay-info { opacity: 1; transform: translateY(0); }
                .media-cat-text { font-family: 'Raleway', sans-serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-seccion); margin-bottom: 0.4rem; font-weight: 700; }
                .media-title-text { font-family: 'Lexend Tera', sans-serif; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--blanco); margin: 0; }

                /* 💡 ESTILOS GLOBALES COMPARTIDOS PARA EL BOTÓN REGRESAR (Si se usa en el HTML) */
                .back-box { text-align: center; padding-bottom: 4rem; background: var(--negro); }
                .btn-back { display: inline-block; padding: 1.1rem 2.5rem; border: 1px solid var(--gris-borde); color: var(--blanco); font-family: 'Raleway', sans-serif; text-decoration: none; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; background: transparent; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: none; }
                .btn-back:hover { border-color: var(--color-seccion); background-color: var(--color-seccion); color: var(--negro); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1); }

                @media (max-width: 900px) {
                    .grid-container-inner { padding: 0 1.5rem; }
                    .media-grid { grid-template-columns: 1fr; gap: 1.5rem; }
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
        `;

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