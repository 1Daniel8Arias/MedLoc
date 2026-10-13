
function useDashboard() {
  const statistics = [
    {
      id: 1,
      title: "Usuarios registrados",
      value: 128,
      description: "Usuarios en el sistema",
    },
    {
      id: 2,
      title: "Registros",
      value: 24,
      description: "Registros creados",
    },
    {
      id: 3,
      title: "Actividad",
      value: 12,
      description: "Actividades recientes",
    },
  ];

  return {
    statistics,
  };
}

export default useDashboard;
