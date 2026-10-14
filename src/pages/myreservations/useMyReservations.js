import { useState } from "react";

const initialReservations = [
  { id: 1, codigo: "483921", medicamento: "Losartán 50mg", cantidad: 2, farmacia: "Droguería La Esperanza", direccion: "Cra 14 # 12-30, Armenia", restante: "1 h 20 min", progreso: 33, estado: "PENDIENTE", calificada: false },
  { id: 2, codigo: "175304", medicamento: "Ibuprofeno 400mg", cantidad: 1, farmacia: "Droguería Quindío Plus", direccion: "Cl 2 Sur # 18-10, Armenia", restante: "45 min", progreso: 62, estado: "PENDIENTE", calificada: false },
  { id: 3, codigo: "621047", medicamento: "Acetaminofén 500mg", cantidad: 2, farmacia: "Droguería San Rafael", direccion: "Cra 25 # 38-12, Calarcá", restante: "—", progreso: 0, estado: "RECOGIDA", calificada: false },
  { id: 4, codigo: "338275", medicamento: "Omeprazol 20mg", cantidad: 1, farmacia: "Botica del Parque", direccion: "Cl 40 # 24-05, Calarcá", restante: "—", progreso: 0, estado: "CANCELADA", calificada: false },
  { id: 5, codigo: "794560", medicamento: "Loratadina 10mg", cantidad: 1, farmacia: "Farma Salud Centenario", direccion: "Av. Bolívar # 21-45, Armenia", restante: "—", progreso: 0, estado: "EXPIRADA", calificada: false },
];

export const statusConfig = {
  PENDIENTE: { label: "Pendiente", tone: "warning" },
  RECOGIDA: { label: "Recogida", tone: "success" },
  CANCELADA: { label: "Cancelada", tone: "neutral" },
  EXPIRADA: { label: "Expirada", tone: "danger" },
};

function useMyReservations() {
  const [reservations, setReservations] = useState(initialReservations);
  const [tab, setTab] = useState("activas");
  const [rateTarget, setRateTarget] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const active = reservations.filter((r) => r.estado === "PENDIENTE");
  const history = reservations.filter((r) => r.estado !== "PENDIENTE");

  const tabs = [
    { id: "activas", label: `Activas (${active.length})` },
    { id: "historial", label: `Historial (${history.length})` },
  ];

  const cancel = (id) =>
    setReservations((current) => current.map((r) => (r.id === id ? { ...r, estado: "CANCELADA", restante: "—" } : r)));

  const openRate = (reservation) => {
    setRateTarget(reservation);
    setRating(0);
    setComment("");
  };

  const submitRating = (event) => {
    event.preventDefault();
    setReservations((current) => current.map((r) => (r.id === rateTarget.id ? { ...r, calificada: true } : r)));
    setRateTarget(null);
  };

  return {
    tabs, tab, setTab,
    list: tab === "activas" ? active : history,
    cancel,
    rateTarget, openRate, closeRate: () => setRateTarget(null),
    rating, setRating, comment, setComment, submitRating,
  };
}

export default useMyReservations;
