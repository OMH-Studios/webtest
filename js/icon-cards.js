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
        .servicios-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--gris-borde); border:1px solid var(--gris-borde); }
        
        .servicio-card { background:var(--negro); padding:2.5rem 2rem; position:relative; overflow:hidden; transition:background 0.3s; cursor: none; }
        .servicio-card::before {
            content:''; position:absolute; top:0; left:0; width:100%; height:2px;
            background:var(--color-seccion); transform:scaleX(0); transform-origin:left; transition:transform 0.3s;
        }
        .servicio-card:hover { background: var(--gris-suave); }
        .servicio-card:hover::before { transform: scaleX(1); }
        
        .servicio-num { font-family:'Lexend Tera',sans-serif; font-size:0.6rem; letter-spacing:0.2em; color:var(--color-seccion); margin-bottom:1.5rem; opacity:0.8; }
        .servicio-icon { font-size:2rem; margin-bottom:1.2rem; display:block; }
        .servicio-titulo { font-family:'Lexend Tera',sans-serif; font-size:0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.75rem; line-height:1.3; color: var(--blanco); }
        .servicio-desc { font-family:'Raleway',sans-serif; font-size:0.85rem; color:var(--gris-texto); line-height:1.7; }
        
        .servicio-tags { margin-top:1.2rem; display:flex; flex-wrap:wrap; gap:0.4rem; }
        .tag-dinamico { font-size:0.6rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--color-secundario); border:1px solid var(--color-secundario); padding:0.2rem 0.5rem; opacity: 0.7; }
        
        @media (max-width: 900px) {
            .servicios-header { grid-template-columns:1fr; gap:2rem; }
            .servicios-grid { grid-template-columns:1fr 1fr; }
        }
        @media (max-width: 600px) {
            .servicios-grid { grid-template-columns:1fr; }
        }
    `;
    document.head.appendChild(style);

    // 2. CONSTRUIR HTML
    const cardsHTML = config.items.map((item, index) => `
        <div class="servicio-card">
            <div class="servicio-num">0${index + 1}</div>
            <span class="servicio-icon">${item.icon}</span>
            <h3 class="servicio-titulo">${item.title}</h3>
            <p class="servicio-desc">${item.desc}</p>
            <div class="servicio-tags">
                ${item.tags.map(tag => `<span class="tag-dinamico">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');

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

    // 4. INTEGRACIÓN CON CURSOR PERSONALIZADO
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if(cursor && ring) {
        container.querySelectorAll('.servicio-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                ring.style.borderColor = 'var(--color-secundario)'; // Anillo cambia al color secundario
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                ring.style.borderColor = 'rgba(204,0,0,0.4)'; // Regresa al default
            });
        });
    }
});