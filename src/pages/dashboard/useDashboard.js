function useDashboard() {
  const statistics = [
    { id: 1, title: "Ventas de hoy", value: "$ 482.600", description: "18 ventas registradas", tone: "success" },
    { id: 2, title: "Reservas pendientes", value: 3, description: "Esperando retiro", tone: "default" },
    { id: 3, title: "Stock bajo", value: 3, description: "Medicamentos por reponer", tone: "warning" },
    { id: 4, title: "Calificación", value: "4.6 ★", description: "128 reseñas", tone: "default" },
  ];

  const weeklySales = [
    { day: "Lun", value: 320 },
    { day: "Mar", value: 410 },
    { day: "Mié", value: 280 },
    { day: "Jue", value: 530 },
    { day: "Vie", value: 610 },
    { day: "Sáb", value: 740 },
    { day: "Dom", value: 482 },
  ]; // miles de pesos

  const pendingReservations = [
    { id: 1, cliente: "María Fernanda Rojas", medicamento: "Losartán 50mg × 2", codigo: "483921", restante: "1 h 20 min" },
    { id: 2, cliente: "Carlos Andrés Gómez", medicamento: "Ibuprofeno 400mg × 1", codigo: "175304", restante: "1 h 45 min" },
    { id: 3, cliente: "Luz Marina Torres", medicamento: "Metformina 850mg × 3", codigo: "906118", restante: "20 min" },
  ];

  const lowStock = [
    { id: 1, medicamento: "Amoxicilina 500mg", stock: 0, minimo: 15 },
    { id: 2, medicamento: "Ibuprofeno 400mg", stock: 4, minimo: 10 },
    { id: 3, medicamento: "Losartán 50mg", stock: 8, minimo: 12 },
  ];

  const latestReview = {
    autor: "Laura M.",
    puntuacion: 5,
    comentario: "Tenían el medicamento que no encontraba en ninguna parte. Atención rápida.",
  };

  return { statistics, weeklySales, pendingReservations, lowStock, latestReview };
}

export default useDashboard;
