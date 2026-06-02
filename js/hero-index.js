// Archivo: js/hero-index.js
// Componente Hero exclusivo para la página principal (Index) de OMH Estudio

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("hero-index-dinamico");
    if (!container || !window.heroIndexConfig) return;

    const config = window.heroIndexConfig;
    const gap = config.centerGap || '3rem';
    
    // VALORES DINÁMICOS CON VALORES DEFAULT RETENIDOS
    const videoOpacity = config.videoOpacity !== undefined ? config.videoOpacity : 0.95;
    const overlayOpacity = config.overlayOpacity !== undefined ? config.overlayOpacity : 0.35;
    const vignetteOpacity = config.vignetteOpacity !== undefined ? config.vignetteOpacity : 0.7;

    // 1. INYECTAR CSS MODULAR
    const style = document.createElement('style');
    style.innerHTML = `
        #hero {
            position: relative; height: 100vh; min-height: 700px;
            display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        
        .hero-video-bg { position: absolute; inset: 0; z-index: 0; background: var(--negro); }
        .hero-video-bg video { width: 100%; height: 100%; object-fit: cover; opacity: ${videoOpacity}; }
        
        .hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0, ${overlayOpacity}); z-index: 1; }
        .hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0, ${vignetteOpacity}) 100%); z-index: 2; }
        
        .hero-content {
            position: relative; z-index: 3; text-align: center; max-width: 900px; padding: 0 2rem; width: 100%;
            animation: hero-in 1.4s cubic-bezier(0.16,1,0.3,1) both; animation-delay: 0.3s;
        }
        @keyframes hero-in {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .hero-label {
            font-family: 'Raleway', sans-serif; font-size: 0.7rem; font-weight: 600;
            letter-spacing: 0.3em; text-transform: uppercase; color: var(--color-seccion);
            display: flex; align-items: center; justify-content: center; gap: 1rem;
        }
        .hero-label::before, .hero-label::after {
            content: ''; display: block; width: 40px; height: 1px; background: var(--color-seccion);
        }

        .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        
        .btn-primary {
            background: var(--color-seccion); color: var(--blanco); padding: 0.9rem 2.5rem;
            text-decoration: none; font-family: 'Raleway', sans-serif; font-size: 0.75rem;
            font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
            transition: transform 0.2s, box-shadow 0.2s; cursor: none;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(204,0,0,0.4); }
        
        .btn-secondary {
            background: transparent; color: var(--blanco); padding: 0.9rem 2.5rem;
            text-decoration: none; font-family: 'Raleway', sans-serif; font-size: 0.75rem;
            font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
            border: 1px solid rgba(255,255,255,0.3); transition: border-color 0.2s, color 0.2s; cursor: none;
        }
        .btn-secondary:hover { border-color: var(--color-secundario); color: var(--color-secundario); }

        .hero-scroll {
            position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
            z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.5;
        }
        .hero-scroll span { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--blanco); }
        .scroll-line {
            width: 1px; height: 40px; background: linear-gradient(to bottom, var(--blanco), transparent);
            animation: scroll-drop 1.5s ease-in-out infinite;
        }
        @keyframes scroll-drop {
            0%, 100% { opacity: 0.4; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(6px); }
        }
    `;
    document.head.appendChild(style);

    // 2. CONSTRUIR HTML
    container.innerHTML = `
        <section id="hero">
            <div class="hero-video-bg">
                <video autoplay muted loop playsinline>
                    <source src="${config.videoPath}" type="video/mp4">
                </video>
            </div>
            
            <div class="hero-overlay"></div>
            <div class="hero-vignette"></div>

            <div class="hero-content">
                <div class="hero-label" style="margin-bottom: ${gap};">${config.label}</div>
                
                <div class="hero-ctas">
                    <a href="${config.btnPrimary.url}" class="btn-primary">${config.btnPrimary.text}</a>
                    <a href="${config.btnSecondary.url}" class="btn-secondary">${config.btnSecondary.text}</a>
                </div>
            </div>

            <div class="hero-scroll">
                <span>Scroll</span>
                <div class="scroll-line"></div>
            </div>
        </section>
    `;

    // 3. INTEGRACIÓN CON CURSOR PERSONALIZADO
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (cursor && ring) {
        container.querySelectorAll('.btn-primary, .btn-secondary').forEach(el => {
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