import { useMemo, useState } from "react";

// Estados según el modelo de datos: PENDIENTE, RECOGIDA, CANCELADA, EXPIRADA
const initialReservations = [
  { id: 1, codigoRetiro: "483921", cliente: "María Fernanda Rojas", telefono: "310 456 7890", medicamento: "Losartán 50mg", cantidad: 2, fecha: "13 oct · 9:15 a. m.", tiempoRestante: "1 h 20 min", estado: "PENDIENTE" },
  { id: 2, codigoRetiro: "175304", cliente: "Carlos Andrés Gómez", telefono: "315 220 1144", medicamento: "Ibuprofeno 400mg", cantidad: 1, fecha: "13 oct · 9:40 a. m.", tiempoRestante: "1 h 45 min", estado: "PENDIENTE" },
  { id: 3, codigoRetiro: "906118", cliente: "Luz Marina Torres", telefono: "300 987 6543", medicamento: "Metformina 850mg", cantidad: 3, fecha: "13 oct · 8:05 a. m.", tiempoRestante: "20 min", estado: "PENDIENTE" },
  { id: 4, codigoRetiro: "621047", cliente: "Julián Restrepo", telefono: "320 111 2233", medicamento: "Acetaminofén 500mg", cantidad: 2, fecha: "12 oct · 4:30 p. m.", tiempoRestante: "—", estado: "RECOGIDA" },
  { id: 5, codigoRetiro: "338275", cliente: "Ana Sofía Ríos", telefono: "311 654 3210", medicamento: "Omeprazol 20mg", cantidad: 1, fecha: "12 oct · 11:10 a. m.", tiempoRestante: "—", estado: "CANCELADA" },
  { id: 6, codigoRetiro: "794560", cliente: "Pedro Pablo Mejía", telefono: "314 888 0099", medicamento: "Loratadina 10mg", cantidad: 1, fecha: "11 oct · 2:00 p. m.", tiempoRestante: "—", estado: "EXPIRADA" },
];

export const statusConfig = {
  PENDIENTE: { label: "Pendiente", tone: "warning" },
  RECOGIDA: { label: "Recogida", tone: "success" },
  CANCELADA: { label: "Cancelada", tone: "neutral" },
  EXPIRADA: { label: "Expirada", tone: "danger" },
};

export const filters = ["TODAS", "PENDIENTE", "RECOGIDA", "CANCELADA", "EXPIRADA"];

function useReservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("TODAS");
  const [selected, setSelected] = useState(null);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reservations.filter(
      (r) =>
        (filter === "TODAS" || r.estado === filter) &&
        (r.cliente.toLowerCase().includes(term) ||
          r.medicamento.toLowerCase().includes(term) ||
          r.codigoRetiro.includes(term))
    );
  }, [reservations, search, filter]);

  const countBy = (estado) => reservations.filter((r) => r.estado === estado).length;

  const changeStatus = (id, estado) => {
    setReservations((current) =>
      current.map((r) => (r.id === id ? { ...r, estado, tiempoRestante: "—" } : r))
    );
    setSelected(null);
  };

  return {
    reservations: visible,
    search, setSearch,
    filter, setFilter,
    selected, setSelected,
    counts: {
      PENDIENTE: countBy("PENDIENTE"),
      RECOGIDA: countBy("RECOGIDA"),
      CANCELADA: countBy("CANCELADA"),
      EXPIRADA: countBy("EXPIRADA"),
    },
    changeStatus,
  };
}

export default useReservations;
