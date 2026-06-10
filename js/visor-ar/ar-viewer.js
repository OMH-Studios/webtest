// Archivo: js/ar-viewer.js

export function initOMHViewer(containerId, glbPath, usdzPath = null) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`OMH Viewer: Contenedor ${containerId} no encontrado.`);
        return;
    }

    if (!document.querySelector('script[src*="model-viewer"]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js';
        document.head.appendChild(script);
    }

    const iosAttr = usdzPath ? `ios-src="${usdzPath}"` : '';

    // CORRECCIÓN AQUÍ: Apuntamos a visor-ar.html
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
    const shareUrl = `${baseUrl}visor-ar.html?glb=${encodeURIComponent(glbPath)}${usdzPath ? '&usdz=' + encodeURIComponent(usdzPath) : ''}`;

    container.innerHTML = `
        <model-viewer 
            class="omh-model-viewer"
            src="${glbPath}" 
            ${iosAttr}
            ar 
            ar-modes="webxr scene-viewer quick-look" 
            camera-controls 
            tone-mapping="neutral" 
            shadow-intensity="1.5"
            exposure="1"
            autoplay>
            
            <button class="omh-btn-share" title="Compartir modelo">
                <svg class="omh-share-icon" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
                </svg>
            </button>
            <div class="omh-share-tooltip">¡Enlace copiado!</div>

            <button slot="ar-button" class="omh-btn-ar">
                <svg class="omh-ar-icon" viewBox="0 0 24 24">
                    <path d="M19 12h-2v3H7v-3H5v5h14v-5zM12 9V5.41l1.29 1.3 1.42-1.42L12 2.58 9.29 5.29l1.42 1.42L12 5.41V9H5v2h14V9h-7z"/>
                </svg>
                VER EN TU ESPACIO
            </button>

            <div class="omh-desktop-prompt">
                <svg class="icon-mobile" viewBox="0 0 24 24">
                    <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                </svg>
                <span>AR disponible en móvil</span>
            </div>

        </model-viewer>
    `;

    // Lógica del botón de compartir
    const btnShare = container.querySelector('.omh-btn-share');
    const tooltip = container.querySelector('.omh-share-tooltip');

    btnShare.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'OMH Estudio | Visor AR',
                    text: 'Checa este modelo 3D en Realidad Aumentada:',
                    url: shareUrl
                });
            } catch (err) {
                console.log('Compartir cancelado', err);
            }
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                tooltip.style.opacity = '1';
                setTimeout(() => tooltip.style.opacity = '0', 2000);
            });
        }
    });
}