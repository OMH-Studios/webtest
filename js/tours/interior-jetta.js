window.tourConfig = {
  tourId:   "jetta-interior",
  titulo:   "JETTA A4 - INTERIOR",
  autoRotar: false,
  velocidadRotacion: 0.05,
  escenaInicial: "asientos_piloto",
  
  // Igualamos la identidad visual a la del Visor Splat
  tema: {
    colorPrimario:    "var(--color-seccion)", 
    colorSecundario:  "rgba(255, 255, 255, 0.15)", 
    fuentePrincipal:  "'Raleway', sans-serif",
    fuenteTitulos:    "'Lexend Tera', sans-serif"
  },

  escenas: {
    asientos_piloto: {
      zona: "Piloto",
      principalZona: true,
      imagen: "/assets/tours/interior-jetta/int-piloto.jpg", // Cambia a tus rutas reales
      hotspots: [
        { tipo: "navegacion", destino: "asientos_copiloto", pitch: -18.5, yaw: 269.5, etiqueta: "Copiloto" },
        { tipo: "navegacion", destino: "asientos_atras", pitch: -20.4, yaw: 325.3, etiqueta: "Pasajeros" }
      ]
    },
    asientos_copiloto: {
      zona: "Coopiloto",
      principalZona: true,
      imagen: "/assets/tours/interior-jetta/int-copiloto.jpg",
      hotspots: [
        { tipo: "navegacion", destino: "asientos_piloto", pitch: -22.6, yaw: 88.5, etiqueta: "Piloto" },
        { tipo: "navegacion", destino: "asientos_atras", pitch: -13.8, yaw: 34.5, etiqueta: "Pasajeros" }
      ]
    },
    asientos_atras: {
      zona: "Asientos Pasajeros",
      principalZona: true,
      imagen: "/assets/tours/interior-jetta/int-atras.jpg",
      hotspots: [
        { tipo: "navegacion", destino: "asientos_piloto", pitch: -20.9, yaw: 155.6, etiqueta: "Piloto" },
        { tipo: "navegacion", destino: "asientos_copiloto", pitch: -20.9, yaw: 195.2, etiqueta: "Copiloto" }
      ]
    }
  }
};