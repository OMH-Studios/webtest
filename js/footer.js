// Archivo: js/footer.js
// Componente de pie de página autónomo - OMH Estudio

document.addEventListener("DOMContentLoaded", () => {
    const footerContainer = document.getElementById("footer-dinamico");
    
    if (footerContainer) {
        const isSubpage = window.location.pathname.includes('/pages/');
        const rootPath = isSubpage ? '../' : './';
        const pagesPath = isSubpage ? './' : './pages/';
        
        // Función principal que construye el footer
        const buildFooter = () => {
            // Extraer datos del objeto global
            const contacto = window.contactoGlobal || {};

            // Mapeo seguro: si falta el link, se queda con "#"
            const igUrl = contacto.instagram || "#";
            const tkUrl = contacto.tiktok || "#";
            const ytUrl = contacto.youtube || "#";
            const fbUrl = contacto.facebook || "#";
            const inUrl = contacto.linkedin || "#";
            const waUrl = contacto.whatsapp || "#";
            const mailLink = contacto.email_link || "#";
            const mailText = contacto.email_display || "contacto@omhestudio.com";

            footerContainer.innerHTML = `
                <style>
                    .social-strip { background: var(--gris-oscuro); border-top: 1px solid var(--gris-borde); border-bottom: 1px solid var(--gris-borde); padding: 2rem 4rem; display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap; }
                    .social-strip p { font-family: 'Raleway', sans-serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.3); font-weight: 700; }
                    .social-links { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; justify-content: center; }
                    .social-link { display: flex; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.4); text-decoration: none; font-family: 'Raleway', sans-serif; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; transition: color 0.2s; cursor: none; }
                    .social-link:hover { color: var(--color-seccion, var(--amarillo)); }
                    .social-link svg { width: 18px; height: 18px; fill: currentColor; }

                    footer { background: var(--negro); padding: 4rem; border-top: 1px solid var(--gris-borde); }
                    .footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 4rem; align-items: start; margin-bottom: 4rem; }
                    .footer-logo img { height: 32px; margin-bottom: 1.2rem; display: block; }
                    .footer-desc { font-family: 'Raleway', sans-serif; font-size: 0.85rem; color: var(--gris-texto); line-height: 1.8; max-width: 300px; }
                    .footer-col h5 { font-family: 'Lexend Tera', sans-serif; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1.2rem; }
                    .footer-col ul { list-style: none; padding: 0; margin: 0; }
                    .footer-col ul li { margin-bottom: 0.7rem; }
                    .footer-col ul li a { font-family: 'Raleway', sans-serif; font-size: 0.85rem; color: var(--gris-texto); text-decoration: none; transition: color 0.2s; cursor: none; }
                    .footer-col ul li a:hover { color: var(--color-seccion, var(--blanco)); }
                    
                    .footer-bottom { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--gris-borde); padding-top: 2rem; flex-wrap: wrap; gap: 1rem; }
                    .footer-copy { font-family: 'Raleway', sans-serif; font-size: 0.75rem; color: rgba(255,255,255,0.2); letter-spacing: 0.05em; }
                    .footer-copy span { color: var(--color-seccion, var(--rojo)); }
                    .footer-brand { font-family: 'Lexend Tera', sans-serif; font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.15); }

                    @media (max-width: 900px) {
                        .footer-inner { grid-template-columns: 1fr; gap: 2.5rem; }
                        .footer-bottom { flex-direction: column; text-align: center; }
                        .social-strip { padding: 1.5rem; }
                    }
                </style>

                <div class="social-strip">
                  <p>Síguenos</p>
                  <div class="social-links">
                    <a href="${igUrl}" class="social-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Instagram
                    </a>
                    <a href="${tkUrl}" class="social-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                      TikTok
                    </a>
                    <a href="${ytUrl}" class="social-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                      YouTube
                    </a>
                    <a href="${fbUrl}" class="social-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    <a href="${inUrl}" class="social-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                    <a href="${mailLink}" class="social-link">
                      <svg viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.909 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                      Email
                    </a>
                    <a href="${waUrl}" class="social-link" target="_blank" rel="noopener">
                      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </div>

                <footer>
                  <div class="footer-inner">
                    <div class="footer-logo">
                      <img src="${rootPath}assets/logos/LogoOMH_white_Mesa_de_trabajo_1.png" alt="OMH Estudio" onerror="this.style.display='none'">
                      <p class="footer-desc">Estudio creativo de producción visual y experiencias digitales. Transformamos ideas en contenido de alto impacto para marcas, espacios y proyectos.</p>
                    </div>
                    <div class="footer-col">
                      <h5>Servicios</h5>
                      <ul>
                        <li><a href="${pagesPath}archviz.html">Visualización Arquitectónica</a></li>
                        <li><a href="${pagesPath}audiovisual.html">Producción Audiovisual</a></li>
                        <li><a href="${pagesPath}anim_vfx.html">Animación & VFX</a></li>
                        <li><a href="${pagesPath}ar_vr.html">Experiencias XR / AR / VR</a></li>
                        <li><a href="${pagesPath}tours_360.html">Fotografía & Tours 360</a></li>
                        <li><a href="${pagesPath}escaneos.html">Escaneo 3D & Prop Tech</a></li>
                        <li><a href="${pagesPath}mkt.html">Marketing Digital (MKT)</a></li>
                        <li><a href="${pagesPath}ia.html">IA Aplicada a Visual</a></li>
                      </ul>
                    </div>
                    <div class="footer-col">
                      <h5>Contacto</h5>
                      <ul>
                        <li><a href="${waUrl}" target="_blank">WhatsApp</a></li>
                        <li><a href="${mailLink}">${mailText}</a></li>
                        <li><a href="${igUrl}" target="_blank">@omh_estudio</a></li>
                        <li><a href="${inUrl}" target="_blank">LinkedIn</a></li>
                        <li><a href="${tkUrl}" target="_blank">TikTok</a></li>
                        <li><a href="${fbUrl}" target="_blank">Facebook</a></li>
                        <li><a href="${ytUrl}" target="_blank">YouTube</a></li>
                      </ul>
                    </div>
                  </div>
                  <div class="footer-bottom">
                    <p class="footer-copy">© 2026 OMH Estudio — Todos los derechos reservados. Hecho con <span>♥</span> en México.</p>
                    <p class="footer-brand">Visuales que capturan</p>
                  </div>
                </footer>
            `;

            // Interacción con el cursor personalizado de la web si existe
            const cursor = document.getElementById('cursor');
            const ring = document.getElementById('cursor-ring');
            if (cursor && ring) {
                footerContainer.querySelectorAll('a').forEach(el => {
                    el.addEventListener('mouseenter', () => {
                        cursor.style.transform = 'translate(-50%,-50%) scale(2)';
                        ring.style.borderColor = 'var(--color-seccion, var(--amarillo))';
                    });
                    el.addEventListener('mouseleave', () => {
                        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
                        ring.style.borderColor = 'var(--color-seccion, rgba(204,0,0,0.4))';
                    });
                });
            }
        };

        // Verificamos si la variable global ya existe
        if (window.contactoGlobal) {
            buildFooter();
        } else {
            // Si no existe, inyectamos el script dinámicamente según el nivel de la ruta
            const scriptContacto = document.createElement("script");
            scriptContacto.src = rootPath + "data/contacto.js";
            
            scriptContacto.onload = () => {
                // Una vez cargado el script con la data, pintamos el footer
                buildFooter();
            };
            
            scriptContacto.onerror = () => {
                console.error("OMH Error: No se pudo cargar el archivo data/contacto.js");
                // Si falla, de todos modos pintamos el footer con los fallbacks (#)
                buildFooter();
            };
            
            document.body.appendChild(scriptContacto);
        }
    }
});