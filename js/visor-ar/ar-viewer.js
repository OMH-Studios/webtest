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
    const shareUrl = `${baseUrl}visor-ar.html?glb=${encodeURIComponent(glbPath)}${usdzPath ? '&usdz=' + encodeURIComponent(usdzPath) : ''}`;

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
                    PERSONALIZAR MODELO
                </button>
                <div class="omh-material-menu" id="omh-menu-opciones-${containerId}">
                    ${botonesHtml}
                </div>
            </div>
        `;
    }

    // EL ERROR ESTABA AQUÍ: Le quité el comentario HTML que rompía el código
    container.innerHTML = `
        <model-viewer 
            class="omh-model-viewer"
            src="${glbPath}" 
            ${iosAttr}
            ar 
            ar-modes="webxr scene-viewer quick-look" 
            camera-controls 
            camera-orbit="-45deg 75deg 85%"
            max-camera-orbit="auto 90deg auto"
            disable-pan 
            tone-mapping="neutral" 
            shadow-intensity="1.5"
            exposure="1"
            autoplay>
            
            <button class="omh-btn-share" title="Compartir modelo">
                <svg class="omh-share-icon" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>
            </button>
            <div class="omh-share-tooltip">¡Enlace copiado!</div>

            ${materialPickerHtml}

            <button slot="ar-button" class="omh-btn-ar">
                <svg class="omh-ar-icon" viewBox="0 0 24 24"><path d="M19 12h-2v3H7v-3H5v5h14v-5zM12 9V5.41l1.29 1.3 1.42-1.42L12 2.58 9.29 5.29l1.42 1.42L12 5.41V9H5v2h14V9h-7z"/></svg>
                VER EN TU ESPACIO
            </button>
        </model-viewer>
    `;

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

    if (options && options.materialName && options.opciones) {
        const modelViewer = container.querySelector('model-viewer');
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
                        if (material.pbrMetallicRoughness.baseColorTexture) {
                            material.pbrMetallicRoughness.baseColorTexture.setTexture(null);
                        }
                        
                        let hex = valor.replace(/^#/, '');
                        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                        const bigint = parseInt(hex, 16);
                        const colorArray = [
                            ((bigint >> 16) & 255) / 255, 
                            ((bigint >> 8) & 255) / 255,  
                            (bigint & 255) / 255,         
                            1                             
                        ];
                        
                        material.pbrMetallicRoughness.setBaseColorFactor(colorArray);
                        
                    } else if (tipo === 'textura') {
                        material.pbrMetallicRoughness.setBaseColorFactor([1, 1, 1, 1]);
                        const texture = await modelViewer.createTexture(valor);
                        if (material.pbrMetallicRoughness.baseColorTexture) {
                            material.pbrMetallicRoughness.baseColorTexture.setTexture(texture);
                        }
                    }
                });
            });
        });
    }
}