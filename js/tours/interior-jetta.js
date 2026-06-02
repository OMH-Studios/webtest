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
        { tipo: "navegacion", destino: "asientos_copiloto", pitch: -19.1, yaw: 86.8, etiqueta: "Copiloto" },
        { tipo: "navegacion", destino: "asientos_atras", pitch: -18.3, yaw: 157.1, etiqueta: "Pasajeros" }
      ]
    },
    asientos_copiloto: {
      zona: "Coopiloto",
      principalZona: true,
      imagen: "/assets/tours/interior-jetta/int-copiloto.jpg",
      hotspots: [
        { tipo: "navegacion", destino: "asientos_piloto", pitch: -14.5, yaw: 285.7, etiqueta: "Piloto" },
        { tipo: "navegacion", destino: "asientos_atras", pitch: -12.9, yaw: 226.5, etiqueta: "Pasajeros" }
      ]
    },
    asientos_atras: {
      zona: "Asientos Pasajeros",
      principalZona: true,
      imagen: "/assets/tours/interior-jetta/int-atras.jpg",
      hotspots: [
        { tipo: "navegacion", destino: "asientos_piloto", pitch: -11.3, yaw: 339.1, etiqueta: "Piloto" },
        { tipo: "navegacion", destino: "asientos_copiloto", pitch: -11.3, yaw: 15.2, etiqueta: "Copiloto" }
      ]
    }
  }
};