// Droguerías con calificaciones (datos quemados).
export const pharmacies = [
  {
    id: 1, nombre: "Droguería La Esperanza", direccion: "Cra 14 # 12-30, Armenia", telefono: "606 741 2020",
    horario: "Lun a sáb · 7:00 a. m. – 9:00 p. m.", servicios: ["Domicilio", "Pago con tarjeta", "Atención 24 h"],
    rating: 4.6, totalResenas: 128,
    resenas: [
      { id: 1, autor: "Laura M.", puntuacion: 5, fecha: "10 oct 2026", comentario: "Tenían el medicamento que no encontraba en ninguna parte. Atención rápida.", respuesta: "¡Gracias, Laura! Nos alegra haberte ayudado." },
      { id: 2, autor: "Andrés P.", puntuacion: 4, fecha: "08 oct 2026", comentario: "Buen servicio, aunque hubo algo de fila al medio día.", respuesta: "" },
      { id: 3, autor: "Camila R.", puntuacion: 5, fecha: "05 oct 2026", comentario: "El código de retiro funcionó perfecto, salí en cinco minutos.", respuesta: "" },
      { id: 4, autor: "Jorge T.", puntuacion: 3, fecha: "01 oct 2026", comentario: "El stock en la app no coincidía con el real de un producto.", respuesta: "" },
    ],
    distribucion: { 5: 84, 4: 28, 3: 10, 2: 4, 1: 2 },
  },
  {
    id: 2, nombre: "Farma Salud Centenario", direccion: "Av. Bolívar # 21-45, Armenia", telefono: "606 745 3311",
    horario: "Todos los días · 8:00 a. m. – 8:00 p. m.", servicios: ["Pago con tarjeta"],
    rating: 4.2, totalResenas: 76,
    resenas: [
      { id: 1, autor: "Marta L.", puntuacion: 4, fecha: "09 oct 2026", comentario: "Precios justos y buena atención.", respuesta: "" },
      { id: 2, autor: "Felipe G.", puntuacion: 4, fecha: "03 oct 2026", comentario: "Todo en orden con mi reserva.", respuesta: "" },
    ],
  },
  {
    id: 3, nombre: "Droguería Quindío Plus", direccion: "Cl 2 Sur # 18-10, Armenia", telefono: "606 749 1200",
    horario: "Lun a dom · 6:00 a. m. – 10:00 p. m.", servicios: ["Domicilio", "Atención 24 h"],
    rating: 4.8, totalResenas: 212,
    resenas: [
      { id: 1, autor: "Sofía V.", puntuacion: 5, fecha: "11 oct 2026", comentario: "La mejor atención de la zona, y llevan el pedido a casa.", respuesta: "" },
      { id: 2, autor: "Daniel C.", puntuacion: 5, fecha: "07 oct 2026", comentario: "Siempre tienen stock de lo que busco.", respuesta: "" },
    ],
  },
  {
    id: 4, nombre: "Droguería San Rafael", direccion: "Cra 25 # 38-12, Calarcá", telefono: "606 742 8890",
    horario: "Lun a sáb · 7:30 a. m. – 7:30 p. m.", servicios: ["Domicilio"],
    rating: 4.4, totalResenas: 51,
    resenas: [
      { id: 1, autor: "Rosa E.", puntuacion: 5, fecha: "06 oct 2026", comentario: "Muy amables y explican bien cómo tomar cada medicamento.", respuesta: "" },
      { id: 2, autor: "Iván S.", puntuacion: 4, fecha: "02 oct 2026", comentario: "Cumplen con los tiempos de reserva.", respuesta: "" },
    ],
  },
  {
    id: 5, nombre: "Botica del Parque", direccion: "Cl 40 # 24-05, Calarcá", telefono: "606 742 1005",
    horario: "Lun a sáb · 8:00 a. m. – 6:00 p. m.", servicios: ["Pago con tarjeta"],
    rating: 3.9, totalResenas: 33,
    resenas: [
      { id: 1, autor: "Paula N.", puntuacion: 4, fecha: "04 oct 2026", comentario: "Buena ubicación, pero cierran temprano.", respuesta: "" },
    ],
  },
  {
    id: 6, nombre: "Farmacia Vida Circasia", direccion: "Cra 14 # 6-20, Circasia", telefono: "606 747 5566",
    horario: "Todos los días · 7:00 a. m. – 9:00 p. m.", servicios: ["Domicilio", "Pago con tarjeta"],
    rating: 4.5, totalResenas: 40,
    resenas: [
      { id: 1, autor: "Héctor B.", puntuacion: 5, fecha: "09 oct 2026", comentario: "Atención cálida y precios competitivos.", respuesta: "" },
    ],
  },
];

export const getPharmacy = (nombre) => pharmacies.find((p) => p.nombre === nombre);
