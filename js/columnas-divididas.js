/**
 * OMH Estudio - Componente Dinámico de Columnas Divididas
 * (Estructura: Antetítulo, Título, párrafo, línea central responsiva al scroll y dos columnas)
 */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('modulo-columnas-divididas');
        if (!container) return;

        const config = Object.assign({
            eyebrowHtml: "Una pequeña muestra de nuestro trabajo", 
            titleHtml: "Título Principal",
            paragraphHtml: "Descripción breve...",
            columnaIzq: [],
            columnaDer: [],
            paddingTop: "4rem", 
            paddingBottom: "4rem",
            bgColor: "var(--negro)"
        }, window.columnasDivididasConfig);

        // 1. Inyectar Estilos CSS
        if (!document.getElementById('estilos-columnas-divididas')) {
            const styles = `
                <style id="estilos-columnas-divididas">
                    .seccion-columnas {
                        padding-left: 5%;
                        padding-right: 5%;
                        max-width: 1400px;
                        margin: 0 auto;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    /* HEADER */
                    .columnas-header {
                        text-align: left; 
                        width: 100%;
                        margin-bottom: 4rem;
                    }
                    .columnas-eyebrow {
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        margin-bottom: 1.5rem;
                    }
                    .eyebrow-linea {
                        width: 30px;
                        height: 2px;
                        background-color: var(--color-seccion);
                        margin-right: 15px;
                    }
                    .eyebrow-texto {
                        font-family: 'Lexend Tera', sans-serif;
                        font-size: 0.8rem;
                        font-weight: 600;
                        letter-spacing: 2px;
                        color: var(--color-seccion);
                        text-transform: uppercase;
                    }
                    .columnas-titulo {
                        font-family: 'Lexend Tera', sans-serif;
                        font-size: clamp(2rem, 4vw, 3.5rem); 
                        line-height: 1.1;
                        font-weight: 900; 
                        color: var(--blanco);
                        margin-bottom: 1.5rem;
                        text-transform: uppercase;
                    }
                    .columnas-titulo .resalte {
                        color: var(--color-seccion);
                    }
                    .columnas-desc {
                        font-family: 'Raleway', sans-serif;
                        font-size: 1rem;
                        line-height: 1.6;
                        color: var(--blanco);
                        opacity: 0.9;
                        max-width: 800px;
                    }
                    
                    /* BODY DE COLUMNAS */
                    .columnas-body {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        width: 100%;
                        position: relative;
                        padding-top: 2rem;
                    }
                    
                    /* LÍNEA CENTRAL - Animada por Scroll Directo */
                    .linea-central {
                        width: 2px;
                        background-color: var(--color-seccion);
                        position: absolute;
                        left: 50%;
                        top: 0;
                        bottom: 0;
                        transform: translateX(-50%) scaleY(0);
                        transform-origin: top; /* Crece de arriba hacia abajo */
                        /* No lleva transition porque se actualizará cada frame con el scroll */
                    }
                    
                    .columna {
                        width: 45%;
                        display: flex;
                        flex-direction: column;
                        gap: 3.5rem; /* Espacio entre los bloques */
                    }
                    
                    /* BLOQUES INDIVIDUALES: Estado Oculto (Centro) */
                    .bloque-izq {
                        text-align: left;
                        opacity: 0;
                        transform: translateX(60px); /* Oculto más hacia el centro */
                        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                    }
                    .bloque-der {
                        text-align: right;
                        opacity: 0;
                        transform: translateX(-60px); /* Oculto más hacia el centro */
                        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                    }
                    
                    /* BLOQUES INDIVIDUALES: Estado Visible (Hacia afuera) */
                    .bloque-izq.visible, .bloque-der.visible {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    
                    /* TEXTOS INTERNOS */
                    .bloque-texto h3 {
                        font-family: 'Lexend Tera', sans-serif;
                        font-size: 1.1rem;
                        color: var(--blanco);
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    .bloque-texto p {
                        font-family: 'Raleway', sans-serif;
                        font-size: 0.95rem;
                        line-height: 1.5;
                        color: var(--gris-texto);
                    }
                    
                    /* ANIMACIÓN TÍTULOS (Se ejecuta UNA vez) */
                    .reveal-up {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: all 0.6s ease;
                    }
                    .reveal-up.visible {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    /* MÓVIL */
                    @media (max-width: 900px) {
                        .columnas-body { flex-direction: column; gap: 3rem; }
                        .columna { width: 100%; text-align: left; gap: 2rem; }
                        .bloque-izq, .bloque-der { 
                            text-align: left; 
                            transform: translateY(40px); /* En móvil vienen de abajo */
                        }
                        .linea-central { display: none; } /* En móvil se oculta la línea central para simplificar */
                    }
                </style>
            `;
            document.head.insertAdjacentHTML("beforeend", styles);
        }

        // 2. Mapear bloques (asignando clases específicas para Izquierda y Derecha)
        const renderBlocks = (items, sideClass) => items.map(item => `
            <div class="bloque-texto ${sideClass}">
                <h3>${item.titulo}</h3>
                <p>${item.texto}</p>
            </div>
        `).join('');

        // 3. Renderizar en el DOM
        container.parentElement.style.backgroundColor = config.bgColor;
        
        container.innerHTML = `
            <section class="seccion-columnas" style="padding-top: ${config.paddingTop}; padding-bottom: ${config.paddingBottom};">
                <div class="columnas-header reveal-up">
                    ${config.eyebrowHtml ? `
                        <div class="columnas-eyebrow">
                            <div class="eyebrow-linea"></div>
                            <span class="eyebrow-texto">${config.eyebrowHtml}</span>
                        </div>
                    ` : ''}
                    <h2 class="columnas-titulo">${config.titleHtml}</h2>
                    <p class="columnas-desc">${config.paragraphHtml}</p>
                </div>

                <div class="columnas-body">
                    <div class="columna columna-izq">
                        ${renderBlocks(config.columnaIzq, 'bloque-izq')}
                    </div>
                    
                    <div class="linea-central"></div>
                    
                    <div class="columna columna-der">
                        ${renderBlocks(config.columnaDer, 'bloque-der')}
                    </div>
                </div>
            </section>
        `;

        // 4. ANIMACIONES
        
        // A) Observador para Títulos: Se dispara solo UNA vez
        const observerTítulos = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        container.querySelectorAll('.reveal-up').forEach(el => observerTítulos.observe(el));

        // B) Observador para Columnas: Se activa al bajar y se desactiva al subir
        const observerBloques = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    // Si el elemento sale de la pantalla hacia abajo, le quitamos la clase 
                    // para que vuelva a animarse la próxima vez que el usuario haga scroll hacia él.
                    if (entry.boundingClientRect.top > 0) {
                        entry.target.classList.remove('visible');
                    }
                }
            });
        }, { 
            rootMargin: "0px 0px -15% 0px", // Dispara cuando el bloque cruza el 85% de la pantalla hacia abajo
            threshold: 0 
        });
        container.querySelectorAll('.bloque-izq, .bloque-der').forEach(el => observerBloques.observe(el));

        // C) Línea Central: Conectada a la rueda del ratón (Scroll)
        const lineaCentral = container.querySelector('.linea-central');
        const columnasBody = container.querySelector('.columnas-body');
        
        const manejarScrollLinea = () => {
            if (!columnasBody || !lineaCentral || window.innerWidth <= 900) return;
            const rect = columnasBody.getBoundingClientRect();
            const ventanaAlto = window.innerHeight;
            
            // Empieza a crecer cuando el contenedor cruza el 75% de la pantalla
            const inicio = ventanaAlto * 0.75; 
            // Termina de crecer antes de que acabe el contenedor
            const fin = ventanaAlto * 0.2; 
            
            let progreso = (inicio - rect.top) / (inicio - fin);
            progreso = Math.max(0, Math.min(1, progreso)); // Limita entre 0 y 1
            
            lineaCentral.style.transform = `translateX(-50%) scaleY(${progreso})`;
        };
        
        window.addEventListener('scroll', manejarScrollLinea);
        manejarScrollLinea(); // Ejecutar una vez al cargar por si el usuario ya está ahí
    });
})();