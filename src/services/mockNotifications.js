export const notificationsByRole = {
  PACIENTE: [
    { id: 1, titulo: "Medicamento disponible", detalle: "Amoxicilina 500mg ya está disponible cerca de ti.", tiempo: "Hace 10 min", leida: false },
    { id: 2, titulo: "Tu reserva vence pronto", detalle: "Losartán 50mg · te quedan 20 minutos para recogerlo.", tiempo: "Hace 40 min", leida: false },
    { id: 3, titulo: "Reserva recogida", detalle: "Acetaminofén 500mg fue entregado. ¿Quieres calificar la droguería?", tiempo: "Ayer", leida: true },
  ],
  ADMIN_FARMACIA: [
    { id: 1, titulo: "Nueva reserva", detalle: "María Fernanda Rojas reservó Losartán 50mg.", tiempo: "Hace 5 min", leida: false },
    { id: 2, titulo: "Stock bajo", detalle: "Ibuprofeno 400mg está por debajo del mínimo.", tiempo: "Hace 1 h", leida: false },
    { id: 3, titulo: "Nueva reseña", detalle: "Laura M. te calificó con 5 estrellas.", tiempo: "Ayer", leida: true },
  ],
};
