/**
 * OMH Estudio - Componente Dinámico: Carrusel de Álbum Amontonado Continuo (Flat Square)
 * Autoejecutable. Lee window.carruselConfig para renderizar el contenido.
 */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("carrusel-dinamico");
    if (!contenedor) return;

    // 1. Configuración por defecto
    const config = Object.assign({
      label: "Galería",
      titleHtml: "Nuestra <em>Selección</em>",
      bg: "negro", // "gris" o "negro"
      padding: "5rem 0",
      images: [], // Array de rutas de imágenes
      // ⏱️ CONTROL DE VELOCIDAD POR DEFECTO (Menos es más lento)
      // 0.0025 = Normal | 0.0012 = Mitad de velocidad | 0.0006 = Súper lento
      speed: 0.0012 
    }, window.carruselConfig);

    const colorFondo = config.bg === "negro" ? "var(--negro)" : "var(--gris-oscuro)";
    const numImages = config.images.length;

    if (numImages === 0) return;

    // 2. Inyectar Estilos CSS Modernos (Formato Cuadrado y Superpuesto)
    if (!document.getElementById("carrusel-3d-styles")) {
      const styles = `
        <style id="carrusel-3d-styles">
          .carousel-section {
            background: ${colorFondo} !important;
            padding: ${config.padding};
            overflow: hidden; 
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            position: relative;
          }
          
          .carousel-label {
            font-family: 'Raleway', sans-serif;
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: var(--color-seccion) !important;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .carousel-label::before {
            content: '';
            display: block;
            width: 24px;
            height: 1px;
            background: var(--color-seccion) !important;
          }
          .carousel-title {
            font-family: 'Lexend Tera', sans-serif;
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 900;
            line-height: 1.05;
            letter-spacing: -0.02em;
            text-transform: uppercase;
            margin-bottom: 4rem;
            text-align: center;
            color: var(--blanco) !important;
          }
          .carousel-title em {
            color: var(--color-seccion) !important;
            font-style: normal;
          }

          .carousel-scene {
            width: 100%;
            max-width: 1100px;
            height: 420px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            user-select: none;
          }

          .carousel-track-stacked {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: grab;
          }
          .carousel-track-stacked:active {
            cursor: grabbing;
          }

          .carousel-item-square {
            position: absolute;
            width: 320px; 
            height: 320px;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--gris-borde);
            box-shadow: 0 20px 45px rgba(0,0,0,0.6);
            will-change: transform, opacity;
          }

          .carousel-item-square::after {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #000;
            opacity: var(--darkness, 0);
            pointer-events: none;
          }

          .carousel-item-square img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            pointer-events: none;
          }

          .carousel-section .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          .carousel-section .reveal.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          @media (max-width: 768px) {
            .carousel-scene { height: 300px; }
            .carousel-item-square { width: 220px; height: 220px; }
          }
        </style>
      `;
      document.head.insertAdjacentHTML("beforeend", styles);
    }

    // 3. Generar HTML de las imágenes cuadradas
    let itemsHtml = "";
    config.images.forEach((src) => {
      itemsHtml += `<div class="carousel-item-square"><img src="${src}" alt="Proyecto OMH"></div>`;
    });

    contenedor.innerHTML = `
      <section class="carousel-section">
        <div class="carousel-label reveal">${config.label}</div>
        <h2 class="carousel-title reveal">${config.titleHtml}</h2>
        <div class="carousel-scene reveal">
          <div class="carousel-track-stacked" id="carousel-track-stacked">
            ${itemsHtml}
          </div>
        </div>
      </section>
    `;

    // 4. Lógica de Mazo Amontonado de Desplazamiento Continuo
    const track = document.getElementById("carousel-track-stacked");
    const items = track.querySelectorAll(".carousel-item-square");
    
    let viewWidth = track.offsetWidth;
    let horizontalSpread = viewWidth * 0.35;

    let globalOffset = 0; 
    let isDragging = false;
    let startX = 0;
    let dragVelocity = 0;

    const spacingStep = (Math.PI * 2) / numImages;

    function updateLayout() {
      viewWidth = track.offsetWidth;
      horizontalSpread = viewWidth < 768 ? viewWidth * 0.32 : viewWidth * 0.35;

      items.forEach((item, index) => {
        let positionAngle = globalOffset + (index * spacingStep);
        
        positionAngle = ((positionAngle + Math.PI) % (Math.PI * 2)) - Math.PI;
        if (positionAngle < -Math.PI) positionAngle += Math.PI * 2;

        const xPos = Math.sin(positionAngle) * horizontalSpread;
        const zCos = Math.cos(positionAngle);

        const scale = 0.8 + (zCos + 1) * 0.1; 
        const opacity = zCos > -0.2 ? 1 : (zCos + 1) / 0.8; 
        const darkness = 1 - (zCos + 1) * 0.5; 

        const zIndex = Math.round((zCos + 1) * 100);

        item.style.transform = `translateX(${xPos}px) scale(${scale})`;
        item.style.zIndex = zIndex;
        item.style.opacity = opacity;
        item.style.setProperty('--darkness', darkness * 0.6); 
      });
    }

    // Loop de Animación Continuo y Autónomo
    function animate() {
      if (!isDragging) {
        // ✨ AHORA JALA LA VELOCIDAD DE LA CONFIGURACIÓN DIRECTAMENTE
        globalOffset -= config.speed; 
      } else {
        globalOffset += dragVelocity;
        dragVelocity *= 0.9; 
      }

      updateLayout();
      requestAnimationFrame(animate);
    }

    // Interacción Manual / Touch Móvil
    function onDragStart(clientX) {
      isDragging = true;
      startX = clientX;
      dragVelocity = 0;
    }

    function onDragMove(clientX) {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      const movementModifier = (deltaX / viewWidth) * 2;
      globalOffset += movementModifier;
      dragVelocity = movementModifier;
      startX = clientX;
    }

    function onDragEnd() {
      isDragging = false;
    }

    // Listeners Ratón
    track.addEventListener("mousedown", (e) => onDragStart(e.clientX));
    window.addEventListener("mousemove", (e) => onDragMove(e.clientX));
    window.addEventListener("mouseup", onDragEnd);

    // Listeners Táctiles Pantallas Móviles
    track.addEventListener("touchstart", (e) => onDragStart(e.touches[0].clientX), { passive: true });
    window.addEventListener("touchmove", (e) => onDragMove(e.touches[0].clientX), { passive: true });
    window.addEventListener("touchend", onDragEnd);

    window.addEventListener("resize", updateLayout);

    // Inicializar el render del componente
    setTimeout(() => {
      updateLayout();
      animate();
      contenedor.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    }, 100);
  });
})();