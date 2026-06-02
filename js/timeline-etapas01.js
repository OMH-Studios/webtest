(function () {
  'use strict';

  function injectStyles() {
    if (document.getElementById('tl-etapas01-styles')) return;
    const link = document.createElement('link');
    link.id   = 'tl-etapas01-styles';
    link.rel  = 'stylesheet';
    link.href = '../css/timeline-etapas01.css';
    document.head.appendChild(link);
  }

  function buildHTML(config) {
    const { anclaId, etapas } = config;
    
    // Leemos tu opacidad configurada, o usamos 0.06 por defecto
    const opacidadNumeros = config.numerosOpacity || 0.06;

    const videosHTML = etapas.map((etapa, i) => {
      if (etapa.videoPath) {
        return `<video id="tl-bg-video-${i}" class="tl-bg-video ${i === 0 ? 'is-active' : ''}" src="${etapa.videoPath}" muted loop playsinline preload="auto"></video>`;
      }
      return '';
    }).join('');

    const bloquesHTML = etapas.map((etapa, i) => {
      const tagsHTML = etapa.servicios.map(s => {
        if (typeof s === 'object' && s.nombre) {
          return `<li><a href="${s.url}" class="tl-servicio-tag">${s.nombre}</a></li>`;
        } else {
          return `<li><span class="tl-servicio-tag static-tag">${s}</span></li>`;
        }
      }).join('');

      return `
        <div class="tl-etapa-block ${i === 0 ? 'is-active' : ''}" id="tl-block-${i}" aria-hidden="${i !== 0}">
          <span class="tl-numero-bg" style="opacity: ${opacidadNumeros};">${etapa.numero}</span>
          <p class="tl-fase">${etapa.fase}</p>
          <h3 class="tl-titulo">${etapa.titulo}</h3>
          <p class="tl-descripcion">${etapa.descripcion}</p>
          <ul class="tl-servicios">${tagsHTML}</ul>
        </div>
      `;
    }).join('');

    const dotsHTML = etapas.map((_, i) => `<div class="tl-dot ${i === 0 ? 'is-active' : ''}" id="tl-dot-${i}"></div>`).join('');

    return `
      <section id="${anclaId}" class="tl-track">
        <div class="tl-stage">
          <div class="tl-video-container-bg">${videosHTML}</div>
          <div class="tl-video-overlay-master"></div>
          
          <div class="tl-layout">
            <div class="tl-wheel-col">
              <div class="tl-wheel-canvas" id="tl-wheel">
                <div id="svg-placeholder-container"></div>
              </div>
            </div>
            <div class="tl-details-col">
              <h2 class="tl-section-title">TE ACOMPAÑAMOS <br><span class="highlight">EN CADA ETAPA</span></h2>
              <div class="tl-details-container">${bloquesHTML}</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function initScrollEngine(config) {
    const track = document.getElementById(config.anclaId);
    const wheel = document.getElementById('tl-wheel');
    const n = config.etapas.length;

    if (!track || !wheel) return;

    let rafId = null;
    let lastProgress = -1;
    let activeIdx = 0;

    const primerVideo = document.getElementById('tl-bg-video-0');
    if (primerVideo) primerVideo.play().catch(() => {});

    function getProgress() {
      const rect = track.getBoundingClientRect();
      const trackH = track.offsetHeight;
      const viewH = window.innerHeight;
      const scrolled = -rect.top;
      const maxScroll = trackH - viewH;
      return Math.min(1, Math.max(0, scrolled / maxScroll));
    }

    function switchActiveFases(idx) {
      if (idx === activeIdx && lastProgress !== -1) return;
      
      const videoViejo = document.getElementById(`tl-bg-video-${activeIdx}`);
      const videoNuevo = document.getElementById(`tl-bg-video-${idx}`);
      
      if (videoViejo && idx !== activeIdx) {
        videoViejo.classList.remove('is-active');
        setTimeout(() => videoViejo.pause(), 800); 
      }
      if (videoNuevo) {
        videoNuevo.classList.add('is-active');
        videoNuevo.play().catch(() => {});
      }

      activeIdx = idx;

      for (let i = 0; i < n; i++) {
        const block = document.getElementById('tl-block-' + i);
        const svgGroup = document.getElementById('etapa' + (i + 1)); 
        const isA = i === idx;

        if (block) block.classList.toggle('is-active', isA);
        
        if (svgGroup) {
          svgGroup.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          svgGroup.style.opacity = isA ? '1' : '0.25';
        }
      }
    }

    function update() {
      rafId = null;
      if (window.innerWidth <= 768) return; 

      const p = getProgress();
      if (Math.abs(p - lastProgress) < 0.0005) return;
      lastProgress = p;

      const deg = p * config.totalRotation; 
      wheel.style.transform = `translate3d(0,0,0) rotate(${deg.toFixed(2)}deg)`;

      const logoSVG = document.getElementById('logo');
      if (logoSVG) {
        logoSVG.style.transformOrigin = 'center center';
        logoSVG.style.transform = `rotate(${-deg.toFixed(2)}deg)`;
      }

      const segSize = 1 / n;
      let idx = Math.floor(p / segSize);
      if (idx >= n) idx = n - 1;
      
      switchActiveFases(idx);
    }

    window.addEventListener('scroll', () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    }, { passive: true });

    fetch('../assets/inmob/timeline.svg')
      .then(response => {
        if (!response.ok) throw new Error("No se encontró el SVG en esa ruta");
        return response.text();
      })
      .then(data => {
        const container = document.getElementById('svg-placeholder-container');
        if (container) {
          container.innerHTML = data;
          
          /* SOLUCIÓN DE COLORES SVG:
             Al usar "> :first-child", solo pintamos la base de cada etapa (la primera capa en Illustrator).
             Tus textos, que están por encima, conservarán el color blanco original. */
          const styleDef = document.createElement('style');
          styleDef.innerHTML = `
            #etapa1 > :first-child { fill: var(--color-seccion) !important; }
            #etapa2 > :first-child { fill: color-mix(in srgb, var(--color-seccion) 80%, #fff) !important; }
            #etapa3 > :first-child { fill: color-mix(in srgb, var(--color-seccion) 60%, #000) !important; }
            
            /* Logo: La última capa (el centro) se pinta del color de la página. El fondo o aro asume blanco */
            #logo > :last-child { fill: var(--color-seccion) !important; }
            #logo > :first-child { fill: var(--blanco) !important; }
            
            #extras > * { fill: var(--color-seccion) !important; opacity: 0.5; }
            svg path, svg polygon, svg rect { stroke: none; }
          `;
          container.querySelector('svg').prepend(styleDef);
          
          update(); 
        }
      }).catch(err => console.error("Error cargando el SVG de Illustrator:", err));
  }

  function init() {
    injectStyles();
    if (typeof window.timelineConfig === 'undefined') return;
    
    const config = window.timelineConfig;
    let anchor = document.getElementById(config.anclaId);
    if (anchor) {
      anchor.outerHTML = buildHTML(config);
      setTimeout(() => initScrollEngine(config), 60);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();