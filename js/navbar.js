// Archivo: js/navbar.js
// Componente inteligente y autónomo para la barra de navegación y cursor global de OMH Estudio

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar-dinamico");
    
    if (navbarContainer) {
        const isSubpage = window.location.pathname.includes('/pages/');
        const rootPath = isSubpage ? '../' : './';
        const pagesPath = isSubpage ? './' : './pages/';

        // 1. Mostrar menú de secciones estáticas SOLO en el index (versión escritorio)
        const indexLinks = !isSubpage ? `
            <ul class="nav-links">
                <li><a href="#video-showcase-dinamico">Showcase</a></li>
                <li><a href="#icon-cards-dinamico">Servicios</a></li>
                <li><a href="#text-cards-dinamico">FAQ</a></li>
                <li><a href="#tecnologia-dinamica">Tecnología</a></li>
            </ul>
        ` : '';

        // 2. El enlace de "Inicio" en el menú desplegable SOLO aparece en subpáginas
        const inicioLink = isSubpage ? `<li><a href="${rootPath}index.html" class="menu-link"><span>🏠</span> Inicio</a></li>` : '';

        // 3. Estructura del Dropdown (Ahora se carga en TODAS las páginas)
        const dropdownMenu = `
            <div id="extended-menu" class="menu-dropdown">
                <div class="menu-dropdown-content">
                    <p class="menu-subtitle">Conoce lo que hacemos</p>
                    <ul class="menu-nav-list">
                        ${inicioLink}
                        <li><a href="${pagesPath}nosotros.html" class="menu-link"><span>👥</span> Nosotros / Estudio</a></li>
                        <li><a href="${pagesPath}archviz.html" class="menu-link"><span>🏛️</span> Visualización Arquitectónica</a></li>
                        <li><a href="${pagesPath}audiovisual.html" class="menu-link"><span>🎥</span> Producción Audiovisual</a></li>
                        <li><a href="${pagesPath}anim_vfx.html" class="menu-link"><span>🎬</span> Animación & VFX</a></li>
                        <li><a href="${pagesPath}ar_vr.html" class="menu-link"><span>🥽</span> Experiencias Inmersivas</a></li>
                        <li><a href="${pagesPath}tours_360.html" class="menu-link"><span>📷</span> Fotografía & Tours 360</a></li>
                        <li><a href="${pagesPath}escaneos.html" class="menu-link"><span>📡</span> Escaneo 3D & PropTech</a></li>
                        <li><a href="${pagesPath}mkt.html" class="menu-link"><span>✦</span> Contenido Digital / MKT</a></li>
                        <li><a href="${pagesPath}inmob.html" class="menu-link"><span>🏘️</span> Tecnología Inmobiliaria</a></li>
                    </ul>
                </div>
            </div>
        `;

        navbarContainer.innerHTML = `
            <style>
                /* ─── RECUPERAR CURSOR NATIVO PARA EL VISOR 3D ─── */
                .omh-wrap, .omh-wrap * { cursor: default !important; }
                .omh-wrap canvas { cursor: grab !important; }
                .omh-wrap canvas:active { cursor: grabbing !important; }
                .omh-wrap button, .omh-wrap .omh-hotspot { cursor: pointer !important; }

                /* ─── ESTILOS ENCAPSULADOS DEL CURSOR INTERACTIVO GLOBAL ─── */
                #cursor { 
                    position: fixed; width: 10px; height: 10px; 
                    background: var(--color-seccion, #cc0000); border-radius: 50%; 
                    pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); 
                    transition: transform 0.1s, background 0.2s; 
                }
                #cursor-ring { 
                    position: fixed; width: 36px; height: 36px; 
                    border: 1px solid var(--color-seccion, #cc0000); border-radius: 50%; 
                    pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); 
                    transition: transform 0.15s ease, border-color 0.2s; opacity: 0.5;
                }

                /* ─── ESTILOS ENCAPSULADOS DE NAVBAR Y COMPONENTES DE MENÚ ─── */
                nav { position: fixed; top: 0; left: 0; right: 0; z-index: 3000; display: flex; align-items: center; justify-content: space-between; padding: 1.5rem 4rem; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); transition: background 0.3s; }
                nav.scrolled { background: rgba(0,0,0,0.95); border-bottom: 1px solid var(--gris-borde); }
                
                .nav-logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; cursor: none; }
                .nav-logo svg { transition: color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .nav-logo:hover svg { transform: scale(1.05); }
                
                .nav-links { display: flex; gap: 2.5rem; list-style: none; margin: 0; padding: 0; }
                .nav-links a { color: rgba(255,255,255,0.7); text-decoration: none; font-family: 'Raleway', sans-serif; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; transition: color 0.2s; cursor: none; }
                .nav-links a:hover { color: var(--color-secundario, #f4d431); }
                
                .nav-right-container { display: flex; align-items: center; gap: 1.5rem; }

                .nav-cta { background: transparent; border: 1px solid var(--color-seccion, #ffffff); color: var(--blanco, #ffffff); padding: 0.6rem 1.5rem; font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: background 0.2s, color 0.2s, border-color 0.2s; cursor: none; display: inline-block; }
                .nav-cta:hover { background: var(--color-seccion, #ffffff); border-color: var(--color-seccion, #ffffff); color: var(--negro, #000000); }

                /* Menú Hamburguesa */
                .menu-hamburger { background: transparent; border: none; cursor: none; display: flex; flex-direction: column; justify-content: space-between; width: 25px; height: 18px; position: relative; z-index: 3001; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                .menu-hamburger span { width: 100%; height: 2px; background-color: var(--blanco, #ffffff); transition: all 0.3s; transform-origin: left center; }
                
                .menu-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(2px, -1px); background-color: var(--color-seccion, #cc0000); }
                .menu-hamburger.open span:nth-child(2) { width: 0%; opacity: 0; }
                .menu-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(2px, 1px); background-color: var(--color-seccion, #cc0000); }
                .menu-hamburger:hover { transform: scale(1.15); }
                .menu-hamburger:hover span { background-color: var(--color-seccion, #cc0000) !important; }

                /* Desplegable Dropdown */
                .menu-dropdown { position: fixed; top: 90px; right: 4rem; background-color: var(--gris-oscuro, #0a0a0a); border: 1px solid var(--gris-borde, #222222); border-radius: 12px; padding: 2rem; z-index: 3000; min-width: 340px; box-shadow: 0 15px 40px rgba(0,0,0,0.9); opacity: 0; visibility: hidden; transform: translateY(-20px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .menu-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); }
                
                .menu-subtitle { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-seccion, #cc0000); margin-bottom: 1.5rem; border-bottom: 1px solid var(--gris-borde, #222222); padding-bottom: 1rem; }
                
                .menu-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.2rem; }
                .menu-link { font-family: 'Lexend Tera', sans-serif; font-size: 0.75rem; color: var(--blanco, #ffffff); text-decoration: none; text-transform: uppercase; display: flex; align-items: center; gap: 1rem; transition: 0.3s; cursor: none; }
                .menu-link:hover { color: var(--color-seccion, #ffffff); transform: translateX(8px); }

                @media (max-width: 900px) {
                    nav { padding: 1.2rem 1.5rem; }
                    .nav-links { display: none; }
                    .menu-dropdown { right: 1.5rem; left: 1.5rem; top: 80px; min-width: auto; }
                }
            </style>

            <div id="cursor"></div>
            <div id="cursor-ring"></div>

            <nav id="navbar">
              <a href="${rootPath}index.html" class="nav-logo" aria-label="OMH Estudio Inicio">
                <svg viewBox="0 0 971.46 201.96" width="165" height="34" style="color: var(--color-seccion, #ffffff); display: block;">
                  <use href="${rootPath}assets/logos/logo_omh_vector.svg#omh-logo-library"></use>
                </svg>
              </a>
              
              ${indexLinks}
              
              <div class="nav-right-container">
                <button id="menu-toggle" class="menu-hamburger" aria-label="Abrir menú" style="flex-shrink: 0;">
                    <span></span><span></span><span></span>
                </button>
                <a href="${rootPath}index.html#contacto" class="nav-cta">Contacto</a>
              </div>
            </nav>

            ${dropdownMenu}
        `;

        // ─── LÓGICA DE MOVIMIENTO DEL CURSOR GLOBAL ───
        const cursor = document.getElementById('cursor');
        const ring = document.getElementById('cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => { 
            mx = e.clientX; 
            my = e.clientY; 
            if(cursor) { 
                cursor.style.left = mx + 'px'; 
                cursor.style.top = my + 'px'; 
            }

            // Detectar qué elemento está debajo del puntero (Solución del Visor 3D)
            const elementoDebajo = document.elementFromPoint(mx, my);
            const estaEnVisor3D = elementoDebajo && (elementoDebajo.closest('.omh-wrap') || elementoDebajo.closest('.omh-360-widget'));

            if (estaEnVisor3D) {
                if(cursor) cursor.style.opacity = '0';
                if(ring) ring.style.opacity = '0';
            } else {
                if(cursor) cursor.style.opacity = '1';
                if(ring) ring.style.opacity = '0.5'; 
            }
        });
        
        (function animRing() { 
            rx += (mx - rx) * 0.12; 
            ry += (my - ry) * 0.12; 
            if(ring) { 
                ring.style.left = rx + 'px'; 
                ring.style.top = ry + 'px'; 
            }
            requestAnimationFrame(animRing); 
        })();

        // ─── LOGICA DEL INTERACTIVO (HOVERS DE LA NAVBAR Y GLOBALES) ───
        document.addEventListener('mouseover', e => {
            const target = e.target.closest('a, button, .menu-hamburger, .menu-link, .media-card, .tech-item, .servicio-card, .faq-card');
            if (target && cursor && ring) {
                cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                ring.style.transform = 'translate(-50%,-50%) scale(1.2)';
            }
        });

        document.addEventListener('mouseout', e => {
            const target = e.target.closest('a, button, .menu-hamburger, .menu-link, .media-card, .tech-item, .servicio-card, .faq-card');
            if (target && cursor && ring) {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                ring.style.transform = 'translate(-50%,-50%) scale(1)';
            }
        });

        // ─── LÓGICA DEL MENÚ HAMBURGUESA Y SCROLL ───
        const nav = document.getElementById('navbar');
        const menuToggle = document.getElementById("menu-toggle");
        const extendedMenu = document.getElementById("extended-menu");

        window.addEventListener('scroll', () => { if(nav) nav.classList.toggle('scrolled', window.scrollY > 60); });

        if (menuToggle && extendedMenu) {
            menuToggle.addEventListener("click", function(event) {
                menuToggle.classList.toggle("open");
                extendedMenu.classList.toggle("active");
                event.stopPropagation();
            });
            
            document.querySelectorAll(".menu-link").forEach(link => {
                link.addEventListener("click", () => {
                    menuToggle.classList.remove("open");
                    extendedMenu.classList.remove("active");
                });
            });
            
            document.addEventListener("click", function(event) {
                if (extendedMenu.classList.contains("active") && !extendedMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                    menuToggle.classList.remove("open");
                    extendedMenu.classList.remove("active");
                }
            });
        }
    }
});