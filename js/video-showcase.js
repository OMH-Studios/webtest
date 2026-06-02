// js/video-showcase.js
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("video-showcase-dinamico");
    if (!container || !window.videoShowcaseConfig) return;

    const config = window.videoShowcaseConfig;

    // 1. INYECTAR CSS MODULAR Y AUTÓNOMO
    if (!document.getElementById('estilos-video-showcase')) {
        const style = document.createElement('style');
        style.id = 'estilos-video-showcase';
        style.innerHTML = `
            /* ─── CONTENEDOR Y TIPOGRAFÍAS ─── */
            .showcase-wrapper { background: var(--negro); padding: 7rem 0; }
            .showcase-container { max-width: 1400px; margin: 0 auto; padding: 0 5%; }
            
            .showcase-label {
                font-family: 'Raleway', sans-serif;
                font-size: 0.7rem;
                font-weight: 700;
                letter-spacing: 0.3em;
                text-transform: uppercase;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                color: var(--color-seccion);
            }
            .showcase-label-line {
                display: inline-block;
                width: 24px;
                height: 1px;
                background: var(--color-seccion);
                margin-right: 1rem;
            }
            .showcase-title {
                font-family: 'Lexend Tera', sans-serif;
                font-size: clamp(2rem, 4vw, 3.5rem);
                font-weight: 900;
                line-height: 1.2;
                text-transform: uppercase;
                color: var(--blanco);
                margin-bottom: 0;
            }

            /* ─── GRID Y TARJETAS DE PROYECTO ─── */
            .proyectos-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--gris-borde); margin-top:4rem; border:1px solid var(--gris-borde); }
            
            .proyecto-card { 
                display: block; 
                text-decoration: none; 
                position:relative; 
                aspect-ratio:4/3; /* Las tarjetas 3, 4 y 5 toman este valor por defecto */
                overflow:hidden; 
                background:var(--gris-medio); 
                cursor:none; 
            }
            
            /* LA MAGIA DE TU CÓDIGO ORIGINAL RESTAURADA */
            .proyecto-card:first-child { 
                grid-column: span 2; 
                aspect-ratio: 8/5; /* Tarjeta horizontal doble */
            }
            .proyecto-card:nth-child(2) { 
                aspect-ratio: 4/5; /* Tarjeta vertical sencilla que empata EXACTO con la primera */
            }
            
            .proyecto-bg {
                position:absolute; inset:0;
                transition:transform 0.5s cubic-bezier(0.16,1,0.3,1);
                object-fit: cover; width: 100%; height: 100%;
            }
            .proyecto-card:hover .proyecto-bg { transform:scale(1.05); }
            
            .proyecto-overlay {
                position:absolute; inset:0;
                background:linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 60%);
                z-index:2; display:flex; flex-direction:column; justify-content:flex-end; padding:2rem;
                transform:translateY(8px); opacity:0; transition:opacity 0.3s, transform 0.3s;
            }
            .proyecto-card:hover .proyecto-overlay { opacity:1; transform:translateY(0); }
            
            .proyecto-cat { font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--color-seccion); margin-bottom:0.4rem; }
            .proyecto-nombre { font-family:'Lexend Tera',sans-serif; font-size:0.9rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color: var(--blanco); }
            
            .proyecto-label-static { position:absolute; bottom:1.5rem; left:1.5rem; z-index:3; pointer-events:none; }
            .proyecto-cat-static { font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--color-seccion); margin-bottom:0.3rem; opacity: 0.5; }
            .proyecto-nombre-static { font-family:'Lexend Tera',sans-serif; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; color:rgba(255,255,255,0.4); }

            .btn-showcase {
                display: inline-block;
                background: transparent;
                color: var(--blanco);
                padding: 0.9rem 2.5rem;
                text-decoration: none;
                font-family: 'Raleway', sans-serif;
                font-size: 0.75rem;
                font-weight: 700;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                border: 1px solid rgba(255,255,255,0.3);
                transition: border-color 0.2s, color 0.2s;
                cursor: none;
            }
            .btn-showcase:hover { border-color: var(--color-seccion); color: var(--color-seccion); }

            /* MEDIA QUERIES PARA CELULARES Y TABLETS */
            @media (max-width: 900px) {
                .proyectos-grid { grid-template-columns:1fr 1fr; }
                .proyecto-card:first-child { grid-column:span 2; }
                /* En móvil/tablet regresamos la segunda tarjeta a 4/3 para que no descuadre con la tercera */
                .proyecto-card:nth-child(2) { aspect-ratio: 4/3; }
            }
            @media (max-width: 600px) {
                .proyectos-grid { grid-template-columns:1fr; }
                .proyecto-card:first-child { grid-column:span 1; aspect-ratio:4/3; }
            }
        `;
        document.head.appendChild(style);
    }

    // 2. CONSTRUIR EL GRID DE PROYECTOS
    const cardsHTML = config.items.map(item => {
        // Validación para el Link
        const linkHref = item.linkUrl ? item.linkUrl : 'javascript:void(0)';
        const linkTarget = item.linkTarget ? `target="${item.linkTarget}"` : '';
        
        return `
        <a href="${linkHref}" ${linkTarget} class="proyecto-card reveal">
            <video autoplay muted loop playsinline class="proyecto-bg">
                <source src="${item.videoSrc}" type="video/mp4">
            </video>
            
            <div class="proyecto-label-static">
                <div class="proyecto-cat-static">${item.catStatic || ''}</div>
                <div class="proyecto-nombre-static">${item.nameStatic || ''}</div>
            </div>
            
            <div class="proyecto-overlay">
                <div class="proyecto-cat">${item.catHover}</div>
                <div class="proyecto-nombre">${item.nameHover}</div>
            </div>
        </a>
    `}).join('');

    // 3. INYECTAR HTML EN EL CONTENEDOR
    container.innerHTML = `
        <section class="showcase-wrapper">
            <div class="showcase-container">
                <div class="showcase-label reveal">
                    <span class="showcase-label-line"></span>
                    ${config.label}
                </div>
                <h2 class="showcase-title reveal reveal-delay-1">${config.titleHtml}</h2>
            </div>
            
            <div class="showcase-container" style="padding-top:0;">
                <div class="proyectos-grid reveal">
                    ${cardsHTML}
                </div>
                
                <div style="text-align:center; margin-top:4rem;" class="reveal reveal-delay-2">
                    <a href="${config.btnUrl}" target="_blank" class="btn-showcase">
                        ${config.btnText}
                    </a>
                </div>
            </div>
        </section>
    `;

    // 4. ANIMACIONES AL HACER SCROLL
    if (typeof observer !== "undefined" && observer.observe) {
        container.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
        const localObserver = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    localObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        container.querySelectorAll('.reveal').forEach(el => localObserver.observe(el));
    }

    // 5. INTEGRACIÓN CON CURSOR
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (cursor && ring) {
        container.querySelectorAll('.proyecto-card, .btn-showcase').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                ring.style.borderColor = 'var(--color-seccion)'; 
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                ring.style.borderColor = 'rgba(204,0,0,0.4)'; 
            });
        });
    }
});