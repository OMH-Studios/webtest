// Archivo: js/navbar.js
// Componente inteligente para la barra de navegación de OMH Estudio

document.addEventListener("DOMContentLoaded", () => {
    const navbarContainer = document.getElementById("navbar-dinamico");
    
    if (navbarContainer) {
        // 1. Detección inteligente de rutas
        // Revisa si estamos en la carpeta 'pages' o en la raíz
        const isSubpage = window.location.pathname.includes('/pages/');
        const rootPath = isSubpage ? '../' : './';
        const pagesPath = isSubpage ? './' : './pages/';

        // 2. Inyección del código HTML paramétrico
        navbarContainer.innerHTML = `
            <nav id="navbar">
              <a href="${rootPath}index.html" class="nav-logo" aria-label="OMH Estudio Inicio">
                <svg viewBox="0 0 971.46 201.96" width="165" height="34" style="color: var(--color-seccion); display: block;">
                  <use href="${rootPath}assets/logos/logo_omh_vector.svg#omh-logo-library"></use>
                </svg>
              </a>

              <div class="nav-right-container">
                <button id="menu-toggle" class="menu-hamburger" aria-label="Abrir menú" style="flex-shrink: 0;">
                    <span></span><span></span><span></span>
                </button>
                <a href="https://api.whatsapp.com/send/?phone=524461328102" class="nav-cta" target="_blank">Contacto</a>
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
                        <li><a href="${pagesPath}escaneos.html" class="menu-link"><span>📡</span> Escaneo 3D & PropTech</a></li>
                        <li><a href="${pagesPath}mkt.html" class="menu-link"><span>✦</span> Contenido Digital / MKT</a></li>
                        <li><a href="${pagesPath}ia.html" class="menu-link"><span>🤖</span> IA Aplicada</a></li>
                    </ul>
                </div>
            </div>
        `;

        // 3. Lógica del Menú Hamburguesa
        const nav = document.getElementById('navbar');
        const menuToggle = document.getElementById("menu-toggle");
        const extendedMenu = document.getElementById("extended-menu");

        // Efecto de fondo oscuro al hacer scroll
        window.addEventListener('scroll', () => { 
            if(nav) nav.classList.toggle('scrolled', window.scrollY > 60); 
        });

        // Abrir/Cerrar menú
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

        // 4. Reactivador del Cursor Personalizado para la Navbar
        const cursor = document.getElementById('cursor');
        const ring = document.getElementById('cursor-ring');
        if (cursor && ring) {
            navbarContainer.querySelectorAll('a, button, .menu-hamburger, .menu-link').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                    ring.style.borderColor = 'var(--color-seccion)';
                });
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                    ring.style.borderColor = 'var(--color-seccion)';
                });
            });
        }
    }
});