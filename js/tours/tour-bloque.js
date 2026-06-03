window.tourConfig = {
  tourId:   "Bloque",
  titulo:   "Bloque - Lobby",
  autoRotar: false,
  velocidadRotacion: 0.05,
  escenaInicial: "acceso_lobby",
  
  // Igualamos la identidad visual a la del Visor Splat
  tema: {
    colorPrimario:    "var(--color-seccion)", 
    colorSecundario:  "rgba(255, 255, 255, 0.15)", 
    fuentePrincipal:  "'Raleway', sans-serif",
    fuenteTitulos:    "'Lexend Tera', sans-serif"
  },

  escenas: {
    acceso_lobby: {
      zona: "Lobby",
      principalZona: true,
      imagen: "/assets/tours/bloque/bloque.jpg", // Cambia a tus rutas reales
      hotspots: [
      ]
    }
  }
};