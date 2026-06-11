// js/icon-cards.js
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("icon-cards-dinamico");
    if (!container || !window.iconCardsConfig) return;

    const config = window.iconCardsConfig;

    // 1. INYECTAR CSS MODULAR
    const style = document.createElement('style');
    style.innerHTML = `
        #servicios { background: var(--gris-oscuro); padding: 7rem 0; }
        .servicios-header { display:grid; grid-template-columns:1fr 1fr; gap:4rem; margin-bottom:5rem; align-items:end; }
        
        /* AQUÍ ESTÁ LA MAGIA: Cambiamos a 4 columnas (repeat(4, 1fr)) */
        .servicios-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:1px; background:var(--gris-borde); border:1px solid var(--gris-borde); }
        
        .servicio-card { 
            background:var(--negro); 
            padding:2.5rem 1.5rem; /* Reduje un poco el padding lateral para que 4 columnas respiren bien */
            position:relative; 
            overflow:hidden; 
            transition:background 0.3s; 
            cursor: none; 
            display: block; 
            text-decoration: none; 
        }
        
        .servicio-card > * { position: relative; z-index: 2; transition: transform 0.3s ease; }
        
        .servicio-video-bg {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            object-fit: cover; z-index: 1; opacity: 0;
            transition: opacity 0.4s ease, transform 4s linear;
            pointer-events: none;
        }

        .servicio-card::before {
            content:''; position:absolute; top:0; left:0; width:100%; height:2px;
            background:var(--color-seccion); transform:scaleX(0); transform-origin:left; transition:transform 0.3s; z-index: 3;
        }

        .servicio-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.65); z-index: 1; opacity: 0;
            transition: opacity 0.4s ease;
        }
        
        .servicio-card:hover { background: var(--negro); }
        .servicio-card:hover::before { transform: scaleX(1); }
        .servicio-card:hover .servicio-video-bg { opacity: 1; transform: scale(1.05); }
        .servicio-card:hover .servicio-overlay { opacity: 1; }
        .servicio-card:hover > *:not(.servicio-video-bg):not(.servicio-overlay) { transform: translateY(-5px); }
        
        .servicio-num { font-family:'Lexend Tera',sans-serif; font-size:0.6rem; letter-spacing:0.2em; color:var(--color-seccion); margin-bottom:1.5rem; opacity:0.8; }
        .servicio-icon { font-size:2rem; margin-bottom:1.2rem; display:block; }
        
        /* Tamaño de fuente ligeramente menor para que los títulos largos quepan en 4 columnas */
        .servicio-titulo { font-family:'Lexend Tera',sans-serif; font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem; line-height:1.3; color: var(--blanco); }
        .servicio-desc { font-family:'Raleway',sans-serif; font-size:0.8rem; color:var(--blanco); line-height:1.6; opacity: 0.8; }
        
        .servicio-tags { margin-top:1.2rem; display:flex; flex-wrap:wrap; gap:0.4rem; }
        .tag-dinamico { font-size:0.55rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-secundario); border:1px solid var(--color-secundario); padding:0.2rem 0.5rem; background: rgba(0,0,0,0.5); backdrop-filter: blur(2px); }
        
        /* ─── RESPONSIVE OPTIMIZADO ─── */
        /* Pantallas medianas (Laptops pequeñas / Tablets en horizontal) */
        @media (max-width: 1150px) {
            .servicios-grid { grid-template-columns: repeat(2, 1fr); } /* Bajamos a 2 columnas para no apretar el texto */
        }

        /* Tablets en vertical */
        @media (max-width: 900px) {
            .servicios-header { grid-template-columns: 1fr; gap: 2rem; }
        }

        /* Teléfonos móviles */
        @media (max-width: 600px) {
            .servicios-grid { grid-template-columns: 1fr; } /* 1 sola columna */
            .servicio-card { padding: 2rem 1.5rem; }
        }
    `;
    document.head.appendChild(style);

    // 2. CONSTRUIR HTML
    const cardsHTML = config.items.map((item, index) => {
        const linkUrl = item.linkUrl || "#";
        const linkTarget = item.linkTarget || "_self";
        // Si hay un video configurado, inyectamos la etiqueta
        const videoHTML = item.videoSrc ? `<video class="servicio-video-bg" src="${item.videoSrc}" muted loop playsinline></video><div class="servicio-overlay"></div>` : `<div class="servicio-overlay" style="background: var(--gris-suave);"></div>`;

        return `
            <a href="${linkUrl}" target="${linkTarget}" class="servicio-card">
                ${videoHTML}
                <div class="servicio-num">0${index + 1}</div>
                <span class="servicio-icon">${item.icon}</span>
                <h3 class="servicio-titulo">${item.title}</h3>
                <p class="servicio-desc">${item.desc}</p>
                <div class="servicio-tags">
                    ${item.tags.map(tag => `<span class="tag-dinamico">${tag}</span>`).join('')}
                </div>
            </a>
        `;
    }).join('');

    container.innerHTML = `
        <section id="servicios">
            <div class="container">
                <div class="servicios-header">
                    <div>
                        <div class="section-label reveal" style="color: var(--color-seccion);">
                            <span style="display:inline-block; width:24px; height:1px; background:var(--color-seccion); margin-right:1rem; vertical-align:middle;"></span>
                            ${config.label}
                        </div>
                        <h2 class="section-title reveal reveal-delay-1">${config.titleHtml}</h2>
                    </div>
                    <div>
                        <p class="section-sub reveal reveal-delay-2">${config.subtitle}</p>
                    </div>
                </div>
                <div class="servicios-grid reveal">
                    ${cardsHTML}
                </div>
            </div>
        </section>
    `;

    // 3. ENCAPSULAR ANIMACIONES (Scroll Reveal)
    const reveals = container.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));

    // 4. LÓGICA DE CURSOR INTERACTIVO Y REPRODUCCIÓN DE VIDEO
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    
    container.querySelectorAll('.servicio-card').forEach(el => {
        const video = el.querySelector('video'); // Busca si la tarjeta tiene video
        
        el.addEventListener('mouseenter', () => {
            if(cursor && ring) {
                cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                ring.style.borderColor = 'var(--color-secundario)';
            }
            // Si hay video, lo reproducimos al poner el cursor encima
            if(video) {
                video.play().catch(error => console.log("Auto-play prevenido:", error));
            }
        });
        
        el.addEventListener('mouseleave', () => {
            if(cursor && ring) {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                ring.style.borderColor = 'rgba(204,0,0,0.4)';
            }
            // Si hay video, lo pausamos y regresamos al inicio al quitar el cursor
            if(video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });
});