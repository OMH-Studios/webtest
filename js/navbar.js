// Archivo: js/navbar.js
// Componente inteligente y autónomo para la barra de navegación y cursor global de OMH Estudio

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar-dinamico");
    
    if (navbarContainer) {
        const isSubpage = window.location.pathname.includes('/pages/');
        const rootPath = isSubpage ? '../' : './';
        const pagesPath = isSubpage ? './' : './pages/';

        // Función que construye la Navbar una vez tengamos los datos
        const buildNavbar = () => {
            // Extraer datos del objeto global (si no existe, usa un objeto vacío)
            const contacto = window.contactoGlobal || {};
            
            // Link dinámico para WhatsApp (con el fallback por si falla)
            const waUrl = contacto.whatsapp || "https://api.whatsapp.com/send/?phone=524461328102";

            const indexLinks = !isSubpage ? `
                <ul class="nav-links">
                    <li><a href="#servicios">Servicios</a></li>
                    <li><a href="#proyectos">Showcase</a></li>
                    <li><a href="#filosofia">Filosofía</a></li>
                    <li><a href="#tecnologia">Tecnología</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
            ` : '';

            navbarContainer.innerHTML = `
                <style>
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
                    nav.scrolled { background: rgba(0,0,0,0.95); border-bottom: 1px solid var(--gris-borde, #222222); }
                    .nav-logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; cursor: none; }
                    .nav-logo svg { transition: color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); width: 165px; height: 34px; }
                    .nav-logo:hover svg { transform: scale(1.05); }
                    .nav-right-container { display: flex; align-items: center; gap: 1.5rem; }

                    /* Botón CTA Contacto */
                    .nav-cta { background: transparent; border: 1px solid var(--color-seccion, #ffffff); color: var(--blanco, #ffffff); padding: 0.6rem 1.5rem; font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; transition: background 0.2s, color 0.2s, border-color 0.2s; cursor: none; display: inline-block; white-space: nowrap; }
                    .nav-cta:hover { background: var(--color-seccion, #ffffff); border-color: var(--color-seccion, #ffffff); color: var(--negro, #000000); }

                    /* Menú Hamburguesa */
                    .menu-hamburger { background: transparent; border: none; cursor: none; display: flex; flex-direction: column; justify-content: space-between; width: 25px; height: 18px; position: relative; z-index: 3001; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                    .menu-hamburger span { width: 100%; height: 2px; background-color: var(--blanco, #ffffff); transition: all 0.3s; transform-origin: left center; }
                    .menu-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(2px, -1px); background-color: var(--rojo, #cc0000); }
                    .menu-hamburger.open span:nth-child(2) { width: 0%; opacity: 0; }
                    .menu-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(2px, 1px); background-color: var(--rojo, #cc0000); }
                    .menu-hamburger:hover { transform: scale(1.15); }
                    .menu-hamburger:hover span { background-color: var(--color-seccion, #cc0000) !important; }

                    /* Desplegable Dropdown */
                    .menu-dropdown { position: fixed; top: 90px; right: 4rem; background-color: var(--gris-oscuro, #0a0a0a); border: 1px solid var(--gris-borde, #222222); border-radius: 12px; padding: 2rem; z-index: 3000; min-width: 340px; box-shadow: 0 15px 40px rgba(0,0,0,0.9); opacity: 0; visibility: hidden; transform: translateY(-20px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                    .menu-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); }
                    .menu-subtitle { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--rojo, #cc0000); margin-bottom: 1.5rem; border-bottom: 1px solid var(--gris-borde, #222222); padding-bottom: 1rem; }
                    .menu-nav-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.2rem; }
                    .menu-link { font-family: 'Lexend Tera', sans-serif; font-size: 0.75rem; color: var(--blanco, #ffffff); text-decoration: none; text-transform: uppercase; display: flex; align-items: center; gap: 1rem; transition: 0.3s; cursor: none; }
                    .menu-link:hover { color: var(--color-seccion, #ffffff); transform: translateX(8px); }

                    /* Adaptación para Tablets */
                    @media (max-width: 900px) {
                        nav { padding: 1.2rem 1.5rem; }
                        .menu-dropdown { right: 1.5rem; left: 1.5rem; top: 80px; min-width: auto; }
                        .nav-links { display: none !important; } /* Oculta forzosamente los links en móvil */
                    }

                    /* FIX CRÍTICO PARA ANDROID / PANTALLAS PEQUEÑAS */
                    @media (max-width: 480px) {
                        nav { padding: 1rem 1.2rem; }
                        .nav-logo svg { width: 120px; height: auto; } /* Achica el logo */
                        .nav-right-container { gap: 0.8rem; } /* Reduce el hueco entre botón y menú */
                        .nav-cta { padding: 0.5rem 1rem; font-size: 0.65rem; } /* Botón más compacto */
                    }
                </style>

                <div id="cursor"></div>
                <div id="cursor-ring"></div>

                <nav id="navbar">
                  <a href="${rootPath}index.html" class="nav-logo" aria-label="OMH Estudio Inicio">
                    <svg viewBox="0 0 971.46 201.96" style="color: var(--color-seccion, #ffffff); display: block;">
                      <use href="${rootPath}assets/logos/logo_omh_vector.svg#omh-logo-library"></use>
                    </svg>
                  </a>
                  ${indexLinks}
                  <div class="nav-right-container">
                    <button id="menu-toggle" class="menu-hamburger" aria-label="Abrir menú" style="flex-shrink: 0;">
                        <span></span><span></span><span></span>
                    </button>
                    <a href="${waUrl}" class="nav-cta" target="_blank">Contacto</a>
                  </div>
                </nav>

                <div id="extended-menu" class="menu-dropdown">
                    <div class="menu-dropdown-content">
                        <p class="menu-subtitle">Explora nuestras disciplinas</p>
                        <ul class="menu-nav-list">
                            <li><a href="${pagesPath}nosotros.html" class="menu-link"><span>👥</span> Nosotros / Estudio</a></li>
                            <li><a href="${pagesPath}archviz.html" class="menu-link"><span>🏛️</span> Visualización Arquitectónica</a></li>
                            <li><a href="${pagesPath}audiovisual.html" class="menu-link"><span>🎥</span> Producción Audiovisual</a></li>
                            <li><a href="${pagesPath}anim_vfx.html" class="menu-link"><span>🎬</span> Animación & VFX</a></li>
                            <li><a href="${pagesPath}ar_vr.html" class="menu-link"><span>🥽</span> Experiencias Inmersivas</a></li>
                            <li><a href="${pagesPath}tours_360.html" class="menu-link"><span>📷</span> Fotografía & Tours 360</a></li>
                            <li><a href="${pagesPath}escaneos.html" class="menu-link"><span>📡</span> Escaneo 3D & PropTech</a></li>
                            <li><a href="${pagesPath}mkt.html" class="menu-link"><span>✦</span> Contenido Digital / MKT</a></li>
                            <li><a href="${pagesPath}ia.html" class="menu-link"><span>🤖</span> IA Aplicada</a></li>
                        </ul>
                    </div>
                </div>
            `;

            // ─── LÓGICA DE MOVIMIENTO DEL CURSOR GLOBAL ───
            const cursor = document.getElementById('cursor');
            const ring = document.getElementById('cursor-ring');
            let mx = 0, my = 0, rx = 0, ry = 0;

            document.addEventListener('mousemove', e => { 
                mx = e.clientX; my = e.clientY; 
                if(cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
            });
            
            (function animRing() { 
                rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; 
                if(ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
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

            // Lógica del Menú Hamburguesa y Scroll
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
        };

        // Verificamos si la variable global ya existe para evitar errores
        if (window.contactoGlobal) {
            buildNavbar();
        } else {
            // Si no existe, inyectamos el script dinámicamente
            const scriptContacto = document.createElement("script");
            scriptContacto.src = rootPath + "data/contacto.js";
            
            scriptContacto.onload = () => {
                buildNavbar();
            };
            
            scriptContacto.onerror = () => {
                console.error("OMH Error: No se pudo cargar el archivo data/contacto.js en el navbar.");
                buildNavbar(); // Carga de todos modos con los valores por defecto
            };
            
            document.body.appendChild(scriptContacto);
        }
    }
});
