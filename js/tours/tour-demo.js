// ============================================================
// tour-demo.js — Configuración de Zonas para OMH Estudio
// Proyecto: Departamento Residencial (6 Zonas Completas)
// ============================================================

window.tourConfig = {
  tourId:   "demo-departamento",
  cliente:  "BAY VIEW GRAND MARINA | IXTAPA",
  titulo:   "DEPARTAMENTO 315 CENTRO",

  autoRotar:          true,
  velocidadRotacion:  0.03,
  escenaInicial:      "acceso_01", // Arranca en la primera foto de acceso

// ─── NUEVO: FICHA TÉCNICA COMERCIAL Y GOOGLE MAPS ───
  datosComerciales: {
    nombreAgente:     "Hugo Robles",
    telefono:         "+52 446 132 8102",
    correo:           "contacto@omhestudio.com",
    metrosCuadrados:  "75 m²",
    descripcion:      "Penthouse exclusivo con acabados premium, iluminación natural automatizada y terraza panorámica.",
    googleMapsURL:    "https://maps.app.goo.gl/5eBavvbgMyHVaoCQ6" // Enlace para el botón del Splash
  },

  tema: {
    colorPrimario:    "#01eeff",                
    colorSecundario:  "rgba(255, 255, 255, 0.15)", 
    fuentePrincipal:  "'Raleway', sans-serif",
    fuenteTitulos:    "'Lexend Tera', sans-serif",
    logoURL:          "../assets/tours/demo/demo_logo.png" 
  },

  escenas: {
    // ─── ZONA 1: ACCESO (2 Imágenes) ───
    acceso_01: {
      zona: "Acceso",
      principalZona: true, // Aparece en el minimap
      tituloEscena: "Recibidor Principal",
      imagen: "../assets/tours/demo/gb_acceso01.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "acc1_nav1", tipo: "navegacion", destino: "acceso_02", pitch: -30.9, yaw: 352.6, etiqueta: "", iconoPng: "../assets/tours/icon_circulo.png",
          tamano: 40,      // Ancho en píxeles que tendrá tu PNG en la pantalla
          opacidad: 0.8   // 65% de opacidad para que se mezcle sutilmente con el fondo
         },
         { id: "acc1_nav2", tipo: "navegacion", destino: "sala_01", pitch: -18.9, yaw: 353.8, etiqueta: "Sala" }
      ]
    },
    acceso_02: {
      zona: "Acceso",
      principalZona: false, // Oculto en el minimap
      tituloEscena: "Acceso - Vista Interna",
      imagen: "../assets/tours/demo/gb_acceso02.jpg",
      correccionHorizonte: 0.2,
      hotspots: [
        { id: "acc2_nav1", tipo: "navegacion", destino: "acceso_01", pitch: -31.1, yaw: 179, etiqueta: "acceso" },
        { id: "acc2_nav2", tipo: "navegacion", destino: "cocina_01", pitch: -32.4, yaw: 267.6, etiqueta: "cocina" },
        { id: "acc2_nav3", tipo: "navegacion", destino: "sala_01", pitch: -27.9, yaw: 355.9, etiqueta: "sala 1" }
      ]
    },

    // ─── ZONA 2: COCINA (4 Imágenes) ───
    cocina_01: {
      zona: "Cocina",
      principalZona: true, // Portada de la cocina
      tituloEscena: "Cocina Principal",
      imagen: "../assets/tours/demo/gb_cocina01.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "coc1_nav1", tipo: "navegacion", destino: "acceso_02", pitch: -33.7, yaw: 90.4, etiqueta: "Recibidor" },
        { id: "coc1_nav2", tipo: "navegacion", destino: "cocina_02", pitch: -36, yaw: 268.4, etiqueta: "cocina 2" },
        { id: "coc1_nav3", tipo: "navegacion", destino: "bano_01", pitch: -0.3, yaw: 272.3, etiqueta: "baño" },
        { id: "coc1_nav4", tipo: "navegacion", destino: "cocina_03", pitch: -35.7, yaw: 208.7, etiqueta: "cocina 3" }
      ]
    },
    cocina_02: {
      zona: "Cocina",
      principalZona: false,
      tituloEscena: "Cocina - Barra e Isla",
      imagen: "../assets/tours/demo/gb_cocina02.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "coc2_nav1", tipo: "navegacion", destino: "cocina_01", pitch: -35.8, yaw: 95.1, etiqueta: "cocina 1" },
        { id: "coc2_nav2", tipo: "navegacion", destino: "bano_01", pitch: -5, yaw: 243.7, etiqueta: "baño" },
        { id: "coc2_nav3", tipo: "navegacion", destino: "cocina_03", pitch: -31.3, yaw: 152.1, etiqueta: "Cocina 3" },
        { id: "coc2_nav4", tipo: "navegacion", destino: "habitacion_01", pitch: -38.1, yaw: 355.7, etiqueta: "Habitación 1" }
        ]
    },
    cocina_03: {
      zona: "Cocina",
      principalZona: false,
      tituloEscena: "Cocina - Alacena",
      imagen: "../assets/tours/demo/gb_cocina03.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "coc3_nav1", tipo: "navegacion", destino: "cocina_04", pitch: -52.9, yaw: 123.2, etiqueta: "Cocina 4" },
        { id: "coc3_nav2", tipo: "navegacion", destino: "cocina_02", pitch: -35.3, yaw: 336.7, etiqueta: "Hotspot 2" },
        { id: "coc3_nav3", tipo: "navegacion", destino: "cocina_01", pitch: -35.7, yaw: 32, etiqueta: "Hotspot 2" }
      ]
    },
    cocina_04: {
      zona: "Cocina",
      principalZona: false,
      tituloEscena: "Cocina - Vista Servicios",
      imagen: "../assets/tours/demo/gb_cocina04.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "coc4_nav1", tipo: "navegacion", destino: "cocina_03", pitch: -44.4, yaw: 303.8, etiqueta: "Cocina 3" },
        { id: "coc4_nav2", tipo: "navegacion", destino: "cocina_02", pitch: -25.6, yaw: 321.1, etiqueta: "Cocina 2" }
      ]
    },

    // ─── ZONA 3: BAÑO (1 Imagen) ───
    bano_01: {
      zona: "Baño",
      principalZona: true, // Única foto, va directo en el menú
      tituloEscena: "Baño Completo",
      imagen: "../assets/tours/demo/gb_bano01.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "ban1_nav1", tipo: "navegacion", destino: "cocina_02", pitch: -16.9, yaw: 79.3, etiqueta: "Cocina 2" }
      ]
    },

    // ─── ZONA 4: SALA (3 Imágenes) ───
    sala_01: {
      zona: "Sala",
      principalZona: true,
      tituloEscena: "Estancia Principal",
      imagen: "../assets/tours/demo/gb_sala01.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "sal1_nav1", tipo: "navegacion", destino: "acceso_02", pitch: -33.2, yaw: 168.1, etiqueta: "Acceso 2" },
        { id: "sal1_nav2", tipo: "navegacion", destino: "cocina_01", pitch: -26.7, yaw: 216.5, etiqueta: "Cocina 1" },
        { id: "sal1_nav3", tipo: "navegacion", destino: "sala_02", pitch: -37.9, yaw: 343.2, etiqueta: "Sala 2" },
        { id: "sal1_nav4", tipo: "navegacion", destino: "sala_03", pitch: -26.7, yaw: 355.4, etiqueta: "Sala 3" },
        { id: "sal1_nav5", tipo: "navegacion", destino: "terraza_01", pitch: -7.2, yaw: 16.1, etiqueta: "Exterior" }

      ]
    },
    sala_02: {
      zona: "Sala",
      principalZona: false,
      tituloEscena: "Sala - Comedor",
      imagen: "../assets/tours/demo/gb_sala02.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "sal2_nav1", tipo: "navegacion", destino: "sala_01", pitch: -30.3, yaw: 187.3, etiqueta: "Sala 1" },
        { id: "sal2_nav2", tipo: "navegacion", destino: "sala_03", pitch: -43.1, yaw: 9.4, etiqueta: "Sala 3" },
        { id: "sal2_nav3", tipo: "navegacion", destino: "terraza_01", pitch: -11.5, yaw: 49.2, etiqueta: "Terraza" }
      ]
    },
    sala_03: {
      zona: "Sala",
      principalZona: false,
      tituloEscena: "Sala - Centro de Entretenimiento",
      imagen: "../assets/tours/demo/gb_sala03.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "sal3_nav1", tipo: "navegacion", destino: "sala_02", pitch: -28, yaw: 179.2, etiqueta: "Sala 2" },
        { id: "sal3_nav2", tipo: "navegacion", destino: "terraza_01", pitch: -12.4, yaw: 94.1, etiqueta: "Terraza" }
      ]
    },

    // ─── ZONA 5: HABITACIÓN (3 Imágenes) ───
    habitacion_01: {
      zona: "Habitación",
      principalZona: true,
      tituloEscena: "Recámara Principal",
      imagen: "../assets/tours/demo/gb_hab01.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "hab1_nav1", tipo: "navegacion", destino: "cocina_02", pitch: -35.6, yaw: 184.7, etiqueta: "Cocina 2" },
        { id: "hab1_nav2", tipo: "navegacion", destino: "habitacion_02", pitch: -32.5, yaw: 353.2, etiqueta: "Habitación 2" }
      ]
    },
    habitacion_02: {
      zona: "Habitación",
      principalZona: false,
      tituloEscena: "Recámara - Closet Vestidor",
      imagen: "../assets/tours/demo/gb_hab02.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "hab2_nav1", tipo: "navegacion", destino: "habitacion_01", pitch: -30.8, yaw: 172.4, etiqueta: "Habitación 1" },
        { id: "hab2_nav2", tipo: "navegacion", destino: "habitacion_03", pitch: -42.2, yaw: 355.3, etiqueta: "Habitación 3" },
        { id: "hab2_nav2", tipo: "navegacion", destino: "terraza_hab01", pitch: -6.3, yaw: 18.5, etiqueta: "Terraza Hab" }
      ]
    },
    habitacion_03: {
      zona: "Habitación",
      principalZona: false,
      tituloEscena: "Recámara - Vista Esquina",
      imagen: "../assets/tours/demo/gb_hab03.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "hab3_nav1", tipo: "navegacion", destino: "habitacion_01", pitch: -22.4, yaw: 181.5, etiqueta: "Habitación 1" },
        { id: "hab3_nav2", tipo: "navegacion", destino: "habitacion_02", pitch: -39.8, yaw: 185.2, etiqueta: "Habitación 2" },
        { id: "hab3_nav2", tipo: "navegacion", destino: "terraza_hab01", pitch: -12.1, yaw: 35.2, etiqueta: "Terraza Hab" }
      ]
    },

    // ─── ZONA 6: TERRAZA (4 Imágenes) ───
    terraza_01: {
      zona: "Terraza",
      principalZona: true,
      tituloEscena: "Terraza Frontal",
      imagen: "../assets/tours/demo/gb_terraza01.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "terr1_nav1", tipo: "navegacion", destino: "terraza_02", pitch: -22.9, yaw: 274.1, etiqueta: "Terraza 2" },
        { id: "terr1_nav2", tipo: "navegacion", destino: "terraza_03", pitch: -21.3, yaw: 331.8, etiqueta: "Terraza 3" },
        { id: "terr1_nav3", tipo: "navegacion", destino: "sala_03", pitch: -6.5, yaw: 187.4, etiqueta: "Interior" }
      ]
    },
    terraza_02: {
      zona: "Terraza",
      principalZona: false,
      tituloEscena: "Terraza - Área de Descanso",
      imagen: "../assets/tours/demo/gb_terraza02.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "terr2_nav1", tipo: "navegacion", destino: "terraza_01", pitch: -8.6, yaw: 81.7, etiqueta: "Terraza 1" },
        { id: "terr2_nav2", tipo: "navegacion", destino: "terraza_hab01", pitch: -3.3, yaw: 175.5, etiqueta: "Terraza Hab" },
        { id: "terr2_nav3", tipo: "navegacion", destino: "terraza_03", pitch: -29.5, yaw: 11.7, etiqueta: "Terraza 3" }
      ]
    },
    terraza_03: {
      zona: "Terraza",
      principalZona: false,
      tituloEscena: "Terraza - Vista Panorámica",
      imagen: "../assets/tours/demo/gb_terraza03.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "terr3_nav1", tipo: "navegacion", destino: "terraza_01", pitch: -32.5, yaw: 151.1, etiqueta: "Hotspot 1" },
        { id: "terr3_nav2", tipo: "navegacion", destino: "terraza_02", pitch: -31.9, yaw: 234.5, etiqueta: "Terraza 2" },
        { id: "terr3_nav3", tipo: "navegacion", destino: "terraza_hab01", pitch: 0.2, yaw: 220, etiqueta: "Terraza Privada" },
        { id: "terr3_nav4", tipo: "navegacion", destino: "sala_03", pitch: -0.4, yaw: 175.4, etiqueta: "Interior" }
      ]
    },
    terraza_hab01: {
      zona: "Terraza",
      principalZona: false,
      tituloEscena: "Terraza Privada Recámara",
      imagen: "../assets/tours/demo/gb_terrazahab01.jpg",
      correccionHorizonte: 0,
      hotspots: [
        { id: "terrh_nav1", tipo: "navegacion", destino: "habitacion_03", pitch: -9.8, yaw: 262.8, etiqueta: "Habitacion 3" },
        { id: "terrh_nav2", tipo: "navegacion", destino: "terraza_02", pitch: -7.5, yaw: 84.2, etiqueta: "Terraza 2" }
      ]
    }
  }
};