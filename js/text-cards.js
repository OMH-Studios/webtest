// js/text-cards.js
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("text-cards-dinamico");
    if (!container || !window.textCardsConfig) return;

    const config = window.textCardsConfig;

    // 1. INYECTAR CSS MODULAR
    const style = document.createElement('style');
    style.innerHTML = `
        .text-cards-section { background: var(--negro); padding: 7rem 0; }
        .text-cards-container { max-width: 1100px; margin: 0 auto; padding: 0 4rem; }
        
        .tc-header-label {
            font-family: 'Raleway', sans-serif; font-size: 0.65rem; font-weight: 700; 
            letter-spacing: 0.3em; text-transform: uppercase; color: var(--gris-texto); 
            text-align: center; margin-bottom: 1.5rem; 
            display: flex; align-items: center; justify-content: center; gap: 1rem;
        }
        .tc-header-label span { width: 24px; height: 1px; background: var(--color-seccion); }
        
        .tc-title {
            font-family: 'Lexend Tera', sans-serif; font-size: clamp(1.8rem, 4vw, 2.8rem); 
            font-weight: 900; letter-spacing: -0.02em; text-align: center; 
            margin-bottom: 1.5rem; text-transform: uppercase; line-height: 1.1; color: var(--blanco);
        }
        
        .tc-subtitle {
            font-family: 'Playfair Display', serif; font-size: 1.1rem; font-style: italic; 
            color: rgba(255,255,255,0.5); text-align: center; max-width: 700px; 
            margin: 0 auto 5rem auto; line-height: 1.6;
        }
        
        .tc-grid {
            display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 30px; margin-bottom: 5rem;
        }
        
        .text-card {
            border-left: 1px solid var(--gris-borde); padding-left: 20px; 
            transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease;
            cursor: none;
        }
        
        /* HOVER EFFECTS: Adaptado a colores dinámicos */
        .text-card:hover {
            transform: scale(1.03);
            border-color: var(--color-seccion) !important;
        }
        
        .text-card h4 {
            font-family: 'Raleway', sans-serif; color: var(--blanco); font-size: 0.85rem; 
            font-weight: 700; margin-top: 0; margin-bottom: 15px; letter-spacing: 0.1em; 
            text-transform: uppercase; transition: color 0.3s ease;
        }
        
        .text-card:hover h4 {
            color: var(--color-secundario) !important;
        }
        
        .text-card p {
            font-family: 'Raleway', sans-serif; color: var(--gris-texto); font-size: 0.85rem; 
            line-height: 1.7; text-align: justify; margin: 0;
        }

        .tc-btn-container { text-align: center; }
        .tc-btn {
            display: inline-block;
            background: var(--color-seccion);
            color: var(--blanco);
            padding: 0.9rem 2.5rem;
            text-decoration: none;
            font-family: 'Raleway', sans-serif;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            transition: transform 0.2s, box-shadow 0.2s;
            cursor: none;
        }
        .tc-btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 30px rgba(0,0,0,0.4); 
        }

        /* ANIMACIÓN SCROLL */
        .tc-fade-in {
            opacity: 0; transform: translateY(30px);
            transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            visibility: hidden;
        }
        .tc-fade-in.visible {
            opacity: 1; transform: translateY(0); visibility: visible;
        }

        @media (max-width: 900px) {
            .tc-grid { grid-template-columns: repeat(2, 1fr); }
            .text-cards-container { padding: 0 1.5rem; }
        }
        @media (max-width: 600px) {
            .tc-grid { grid-template-columns: 1fr; }
        }
    `;
    document.head.appendChild(style);

    // 2. CONSTRUIR HTML
    const cardsHTML = config.items.map(item => `
        <div class="text-card">
            <h4>${item.title}</h4>
            <p>${item.text}</p>
        </div>
    `).join('');

    let btnHTML = '';
    if (config.ctaBtn) {
        btnHTML = `
            <div class="tc-btn-container">
                <a href="${config.ctaBtn.url}" target="${config.ctaBtn.target || '_self'}" class="tc-btn">
                    ${config.ctaBtn.text}
                </a>
            </div>
        `;
    }

    container.innerHTML = `
        <section class="text-cards-section tc-fade-in">
            <div class="text-cards-container">
                <div class="tc-header-label">
                    <span></span>${config.label}<span></span>
                </div>
                <h2 class="tc-title">${config.titleHtml}</h2>
                <p class="tc-subtitle">${config.subtitle}</p>
                
                <div class="tc-grid">
                    ${cardsHTML}
                </div>
                
                ${btnHTML}
            </div>
        </section>
    `;

    // 3. ANIMACIONES (Scroll Reveal)
    const section = container.querySelector('.tc-fade-in');
    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    if(section) scrollObserver.observe(section);

    // 4. INTEGRACIÓN CON CURSOR PERSONALIZADO
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (cursor && ring) {
        container.querySelectorAll('.text-card, .tc-btn').forEach(el => {
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