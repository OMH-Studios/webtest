// Archivo: js/ar-viewer.js

export function initOMHViewer(containerId, glbPath, usdzPath = null, options = null) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!document.querySelector('script[src*="model-viewer"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js';
        document.head.appendChild(script);
    }

    const iosAttr = usdzPath ? `ios-src="${usdzPath}"` : '';
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    
    // Compartir guarda la posición de la cámara
    let shareUrl = `${baseUrl}visor-ar.html?glb=${encodeURIComponent(glbPath)}${usdzPath ? '&usdz=' + encodeURIComponent(usdzPath) : ''}`;
    if (options && options.cameraOrbit) {
        shareUrl += `&orbit=${encodeURIComponent(options.cameraOrbit)}`;
    }

    const initialOrbit = (options && options.cameraOrbit) ? options.cameraOrbit : "0deg 75deg 85%";
    const maxOrbit = (options && options.maxCameraOrbit) ? options.maxCameraOrbit : "auto 90deg auto";
    
    let environmentAttr = "";
    let backgroundStyle = "";

    if (options) {
        if (options.hdri) {
            environmentAttr += `environment-image="${options.hdri}" `;
            if (options.mostrarFondoHdri) environmentAttr += `skybox-image="${options.hdri}" `;
        }
        if (!options.mostrarFondoHdri && options.bgColor) {
            backgroundStyle = `style="background: ${options.bgColor};"`;
        }
    }

    let materialPickerHtml = '';
    if (options && options.opciones && options.opciones.length > 0) {
        const botonesHtml = options.opciones.map((opt, i) => {
            let bgStyle = opt.tipo === 'color' 
                ? `background-color: ${opt.hex};` 
                : `background-image: url('${opt.thumbnail || opt.url}');`;

            return `<button class="omh-color-swatch ${i === 0 ? 'active' : ''}" 
                            style="${bgStyle}" 
                            data-tipo="${opt.tipo}"
                            data-val="${opt.tipo === 'color' ? opt.hex : opt.url}">
                    </button>`;
        }).join('');
        
        materialPickerHtml = `
            <div class="omh-material-dropdown">
                <button class="omh-material-toggle" id="omh-btn-toggle-${containerId}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--blanco)"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                    PERSONALIZAR
                </button>
                <div class="omh-material-menu" id="omh-menu-opciones-${containerId}">
                    ${botonesHtml}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <model-viewer 
            class="omh-model-viewer"
            src="${glbPath}" 
            ${iosAttr}
            ${backgroundStyle}
            ar 
            ar-modes="webxr scene-viewer quick-look" 
            ar-scale="fixed" 
            camera-controls 
            camera-orbit="${initialOrbit}"
            max-camera-orbit="${maxOrbit}"
            ${environmentAttr}
            disable-pan 
            tone-mapping="neutral" 
            shadow-intensity="1.5"
            shadow-softness="1"
            exposure="1"
            autoplay>
            
            <button class="omh-btn-share" title="Compartir modelo">
                <svg class="omh-share-icon" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
            </button>
            <div class="omh-share-tooltip">¡Enlace copiado!</div>

            <button class="omh-btn-fullscreen" title="Ver en pantalla completa">
                <svg viewBox="0 0 24 24" fill="var(--blanco)"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
            </button>

            ${materialPickerHtml}

            <div id="ar-loading-toast-${containerId}" class="omh-ar-toast"></div>

            <div slot="ar-button" style="display: none;"></div>

            <button class="omh-btn-ar omh-btn-pre-ar" id="btn-pre-ar-${containerId}">
                <svg class="omh-ar-icon" viewBox="0 0 24 24"><path d="M19 12h-2v3H7v-3H5v5h14v-5zM12 9V5.41l1.29 1.3 1.42-1.42L12 2.58 9.29 5.29l1.42 1.42L12 5.41V9H5v2h14V9h-7z"/></svg>
                VER EN TU ESPACIO
            </button>

            <div slot="ar-prompt" class="omh-ar-prompt">
                <div class="omh-prompt-content">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--color-seccion)"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-5-2h2v-2h-2v2z"/></svg>
                    <span>Escaneando el entorno... Mueve tu dispositivo.</span>
                </div>
            </div>

            <div class="omh-pre-ar-overlay" id="overlay-${containerId}">
                <div class="omh-pre-ar-card">
                    <div class="omh-pre-ar-icon">📱</div>
                    <div class="omh-pre-ar-text">Para una mejor experiencia, ubícate en un espacio bien iluminado y apunta al suelo despejado.</div>
                    <button class="omh-btn-real-ar" id="btn-real-${containerId}">
                        ENTENDIDO, ABRIR CÁMARA
                    </button>
                    <button class="omh-btn-cancel-ar" id="btn-cancel-${containerId}">Cancelar</button>
                </div>
            </div>

        </model-viewer>
    `;

    const modelViewer = container.querySelector('model-viewer');
    const toast = container.querySelector(`#ar-loading-toast-${containerId}`);

    modelViewer.addEventListener('ar-status', (event) => {
        if (event.detail.status === 'session-started') {
            container.classList.add('omh-in-ar'); 
            if(toast) {
                toast.innerHTML = "⏳ Calculando entorno y escala...";
                toast.style.color = "var(--blanco)";
                toast.style.borderColor = "var(--color-seccion)";
                toast.classList.add('show');
            }
        } else if (event.detail.status === 'object-placed') {
            container.classList.add('omh-in-ar'); 
            if(toast) {
                toast.style.color = "#4ade80"; 
                toast.style.borderColor = "#4ade80";
                toast.innerHTML = "✅ Modelo colocado a escala real";
                setTimeout(() => toast.classList.remove('show'), 3500);
            }
        } else if (event.detail.status === 'not-presenting') {
            container.classList.remove('omh-in-ar'); 
            if(toast) { toast.classList.remove('show'); }
        }
    });

    const btnPreAr = container.querySelector(`#btn-pre-ar-${containerId}`);
    const overlay = container.querySelector(`#overlay-${containerId}`);
    const btnCancel = container.querySelector(`#btn-cancel-${containerId}`);
    const btnRealAr = container.querySelector(`#btn-real-${containerId}`);

    btnPreAr.addEventListener('click', () => overlay.classList.add('active'));
    btnCancel.addEventListener('click', () => overlay.classList.remove('active'));
    
    btnRealAr.addEventListener('click', () => {
        overlay.classList.remove('active');
        modelViewer.activateAR(); 
    });

    const btnShare = container.querySelector('.omh-btn-share');
    const tooltip = container.querySelector('.omh-share-tooltip');
    btnShare.addEventListener('click', async () => {
        if (navigator.share) {
            try { await navigator.share({ title: 'OMH Estudio | Visor AR', url: shareUrl }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                tooltip.style.opacity = '1';
                setTimeout(() => tooltip.style.opacity = '0', 2000);
            });
        }
    });

    const btnFullscreen = container.querySelector('.omh-btn-fullscreen');
    btnFullscreen.addEventListener('click', () => {
        if (container.classList.contains('omh-fake-fullscreen')) {
            container.classList.remove('omh-fake-fullscreen');
            return;
        }
        if (container.requestFullscreen) {
            if (!document.fullscreenElement) { container.requestFullscreen().catch(() => container.classList.add('omh-fake-fullscreen')); } 
            else { document.exitFullscreen(); }
        } else if (container.webkitRequestFullscreen) {
            if (!document.webkitFullscreenElement) { container.webkitRequestFullscreen(); } 
            else { document.webkitExitFullscreen(); }
        } else { container.classList.add('omh-fake-fullscreen'); }
    });

    if (options && options.materialName && options.opciones) {
        const swatches = container.querySelectorAll('.omh-color-swatch');
        const toggleBtn = container.querySelector(`#omh-btn-toggle-${containerId}`);
        const menuOpciones = container.querySelector(`#omh-menu-opciones-${containerId}`);

        if (toggleBtn && menuOpciones) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuOpciones.classList.toggle('open');
            });
            document.addEventListener('mousedown', (e) => {
                if (menuOpciones.classList.contains('open') && !menuOpciones.contains(e.target) && !toggleBtn.contains(e.target)) {
                    menuOpciones.classList.remove('open');
                }
            });
        }

        modelViewer.addEventListener('load', () => {
            const material = modelViewer.model.materials.find(mat => mat.name.toLowerCase().includes(options.materialName.toLowerCase()));
            if (!material) return;

            swatches.forEach(swatch => {
                swatch.addEventListener('click', async (e) => {
                    swatches.forEach(s => s.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    const tipo = e.target.getAttribute('data-tipo');
                    const valor = e.target.getAttribute('data-val');

                    if (tipo === 'color') {
                        if (material.pbrMetallicRoughness.baseColorTexture) material.pbrMetallicRoughness.baseColorTexture.setTexture(null);
                        let hex = valor.replace(/^#/, '');
                        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                        const bigint = parseInt(hex, 16);
                        const colorArray = [((bigint >> 16) & 255) / 255, ((bigint >> 8) & 255) / 255, (bigint & 255) / 255, 1];
                        material.pbrMetallicRoughness.setBaseColorFactor(colorArray);
                        
                    } else if (tipo === 'textura') {
                        material.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
                        const texture = await modelViewer.createTexture(valor);
                        if (material.pbrMetallicRoughness.baseColorTexture) material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                    }
                });
            });
        });
    }
}