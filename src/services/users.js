// Usuarios de prueba (datos quemados). Reemplazar por el backend más adelante.
export const ROLES = {
  PACIENTE: "Paciente / Cliente",
  ADMIN_FARMACIA: "Administrador de farmacia",
};

export const registeredUsers = [
  {
    id: 1,
    nombre: "Daniel Pérez",
    email: "admin@medloc.com",
    password: "Admin123",
    rol: "ADMIN_FARMACIA",
    farmacia: "Droguería La Esperanza",
  },
  {
    id: 2,
    nombre: "María Fernanda Rojas",
    email: "paciente@medloc.com",
    password: "Paciente123",
    rol: "PACIENTE",
  },
];
