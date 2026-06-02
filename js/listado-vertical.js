/**
 * OMH Estudio - Componente Dinámico de Listado Vertical 
 * (Estructura: Título Arriba, Párrafo centrado a la izquierda / Lista a la derecha)
 */
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('listado-vertical-dinamico');
        if (!container) return;

        // Configuración global genérica
        const config = Object.assign({
            titleHtml: "",
            paragraph: "",
            items: [],
            paddingTop: "4rem", 
            paddingBottom: "4rem"
        }, window.listadoVerticalConfig);

        // 1. Inyectar Estilos CSS únicos en el <head>
        if (!document.getElementById('estilos-listado-vertical')) {
            const styles = `
                <style id="estilos-listado-vertical">
                    /* CONTENEDOR PRINCIPAL */
                    .seccion-listado {
                        padding-left: 5%;
                        padding-right: 5%;
                        background-color: transparent;
                        max-width: 1400px;
                        margin: 0 auto;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    /* HEADER: Título arriba */
                    .listado-header {
                        margin-bottom: 3rem; 
                        max-width: 90%;
                    }
                    .listado-titulo {
                        font-family: 'Lexend Tera', sans-serif;
                        font-size: clamp(1.8rem, 3.5vw, 2.8rem);
                        line-height: 1.2;
                        font-weight: 700;
                        color: var(--blanco);
                        text-transform: uppercase; /* 🔠 FORZA MAYÚSCULAS */
                    }
                    .listado-titulo em {
                        font-style: normal;
                        color: var(--color-seccion); 
                    }
                    
                    /* BODY: Contenedor dividido en 2 columnas */
                    .listado-body {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center; /* 🎯 CENTRADO VERTICAL RESPECTO A LA LISTA */
                    }
                    
                    /* COLUMNA IZQUIERDA: Párrafo */
                    .listado-izq {
                        width: 35%;
                        padding-right: 5%;
                    }
                    .listado-desc {
                        font-family: 'Raleway', sans-serif;
                        font-size: 1rem;
                        line-height: 1.5;
                        font-weight: 400;
                        color: var(--color-seccion); 
                        text-align: right; /* ➡️ ALINEADO A LA DERECHA */
                    }
                    .listado-desc em {
                        font-style: normal;
                        font-weight: 600;
                    }
                    
                    /* COLUMNA DERECHA: Lista de elementos */
                    .listado-der {
                        width: 60%;
                        display: flex;
                        flex-direction: column;
                    }
                    .item-fila {
                        display: flex;
                        align-items: center;
                        padding: 0.8rem 0; 
                        border-bottom: 1px solid var(--gris-borde);
                        font-family: 'Raleway', sans-serif;
                        font-size: clamp(1rem, 1.5vw, 1.15rem);
                        font-weight: 400;
                        color: var(--blanco);
                        transition: transform 0.3s ease, border-color 0.3s ease, color 0.3s ease;
                    }
                    .item-fila:first-child {
                        padding-top: 0;
                    }
                    .item-fila:hover {
                        transform: translateX(10px);
                        color: var(--color-seccion);
                        border-bottom-color: var(--color-seccion);
                    }
                    .item-emoji {
                        margin-right: 15px;
                        font-size: 1.2rem;
                        opacity: 0.9;
                    }
                    
                    /* Optimización para Smartphones */
                    @media (max-width: 900px) {
                        .listado-header {
                            margin-bottom: 2rem;
                        }
                        .listado-titulo {
                            font-size: 1.8rem;
                        }
                        .listado-body {
                            flex-direction: column;
                            align-items: flex-start; /* En móvil regresa a la izquierda */
                        }
                        .listado-izq, .listado-der {
                            width: 100%;
                            padding-right: 0;
                        }
                        .listado-izq {
                            margin-bottom: 2rem;
                        }
                        .listado-desc {
                            text-align: left; /* En móvil mejor alineado a la izquierda para lectura */
                        }
                        .listado-der {
                            margin-top: 0;
                        }
                    }
                </style>
            `;
            document.head.insertAdjacentHTML("beforeend", styles);
        }

        // 2. Mapear las filas 
        const itemsHtml = config.items.map((item, index) => `
            <div class="item-fila reveal" style="transition-delay: ${index * 0.1}s;">
                ${item.emoji ? `<span class="item-emoji">${item.emoji}</span>` : ''}
                <span class="item-texto">${item.text}</span>
            </div>
        `).join('');

        // 3. Renderizar en el DOM
        container.innerHTML = `
            <section class="seccion-listado" style="padding-top: ${config.paddingTop}; padding-bottom: ${config.paddingBottom};">
                <div class="listado-header reveal">
                    <h2 class="listado-titulo">${config.titleHtml}</h2>
                </div>
                <div class="listado-body">
                    <div class="listado-izq reveal" style="transition-delay: 0.2s;">
                        <p class="listado-desc">${config.paragraph}</p>
                    </div>
                    <div class="listado-der">
                        ${itemsHtml}
                    </div>
                </div>
            </section>
        `;

        // 4. Lógica de Intersection Observer
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
            }, { threshold: 0.1 });
            container.querySelectorAll('.reveal').forEach(el => localObserver.observe(el));
        }
    });
})();