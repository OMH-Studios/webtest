// Archivo: js/banner-cta.js
// Componente modular: Bloque de Contenido / Call to Action aislado

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("banner-cta-dinamico");
    if (!container || !window.bannerCtaConfig) return;

    const config = window.bannerCtaConfig;

    // Asignación de ID y variables personalizables (Fondo y Padding)
    const bannerId = config.id || "cta-sec";
    const bannerBg = config.bg || "var(--negro)";
    const bannerPadding = config.padding || "8rem 0";

    // 1. INYECTAR CSS ENCAPSULADO CON VARIABLES DINÁMICAS
    const style = document.createElement('style');
    style.innerHTML = `
        .bf-banner-wrapper { background: ${bannerBg}; padding: ${bannerPadding}; position: relative; overflow: hidden; }
        .bf-banner-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(204,0,0,0.05) 0%, transparent 70%); z-index: 0; pointer-events: none; }
        
        /* Se aumentó el max-width a 1000px para que el título tenga más espacio horizontal */
        .bf-banner-content { position: relative; z-index: 1; text-align: center; max-width: 1000px; margin: 0 auto; padding: 0 2rem; }
        
        .bf-label {
            font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 700;
            letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-seccion); 
            margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 1rem;
        }
        .bf-label span { display: block; width: 24px; height: 1px; background: var(--color-seccion); }

        .bf-banner-title { font-family: 'Lexend Tera', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; line-height: 0.95; margin-bottom: 1.5rem; color: var(--blanco); }
        .bf-banner-title span { color: var(--color-seccion); }
        
        .bf-banner-sub { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-style: italic; color: rgba(255,255,255,0.45); margin-bottom: 3rem; line-height: 1.7; }
        .bf-banner-sub em { color: var(--color-secundario); font-style: normal; }
        
        .bf-banner-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        
        .bf-btn-primary {
            background: var(--color-seccion); color: var(--blanco); padding: 0.9rem 2.5rem; display: inline-block;
            text-decoration: none; font-family: 'Raleway', sans-serif; font-size: 0.75rem;
            font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
            transition: transform 0.2s, box-shadow 0.2s; cursor: none;
        }
        .bf-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.4); }
        
        .bf-btn-secondary {
            background: transparent; color: var(--blanco); padding: 0.9rem 2.5rem; display: inline-block;
            text-decoration: none; font-family: 'Raleway', sans-serif; font-size: 0.75rem;
            font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
            border: 1px solid rgba(255,255,255,0.3); transition: border-color 0.2s, color 0.2s; cursor: none;
        }
        .bf-btn-secondary:hover { border-color: var(--color-secundario); color: var(--color-secundario); }
    `;
    document.head.appendChild(style);

    // 2. MAPEAR BOTONES DINÁMICOS
    const btnsHTML = config.buttons ? config.buttons.map(btn => `
        <a href="${btn.url}" class="${btn.class}" target="${btn.target || '_self'}">${btn.text}</a>
    `).join('') : '';

    // 3. INYECTAR LA ESTRUCTURA SEMÁNTICA (Aislada del formulario)
    container.innerHTML = `
        <section id="${bannerId}" class="bf-banner-wrapper">
            <div class="bf-banner-bg"></div>
            <div class="bf-banner-content">
                <div class="bf-label reveal">
                    <span></span>${config.label}<span></span>
                </div>
                <h2 class="bf-banner-title reveal reveal-delay-1">${config.titleHtml}</h2>
                <p class="bf-banner-sub reveal reveal-delay-2">${config.subtitleHtml}</p>
                <div class="bf-banner-btns reveal reveal-delay-3">
                    ${btnsHTML}
                </div>
            </div>
        </section>
    `;

    // 4. ANIMACIONES INTERSECTION OBSERVER
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

    // 5. EVENTOS INTEGRADOS PARA EL ANILLO DEL CURSOR
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (cursor && ring) {
        container.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                ring.style.borderColor = 'var(--color-secundario)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                ring.style.borderColor = 'rgba(204,0,0,0.4)';
            });
        });
    }
});