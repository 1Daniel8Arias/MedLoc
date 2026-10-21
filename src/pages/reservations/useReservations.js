import { useEffect, useMemo, useState } from "react";
import { getUser } from "../../services/session";
import { reservasApi } from "../../services/api";

export const statusConfig = {
  pendiente: { label: "Pendiente", tone: "warning" },
  confirmada: { label: "Confirmada", tone: "success" },
  lista_para_retiro: { label: "Lista para retiro", tone: "success" },
  retirada: { label: "Retirada", tone: "success" },
  cancelada: { label: "Cancelada", tone: "neutral" },
  expirada: { label: "Expirada", tone: "danger" },
};

export const filters = ["TODAS", ...Object.keys(statusConfig)];

function formatDate(value) {
  return value ? new Date(value).toLocaleString("es-CO") : "—";
}

function normalizeReservation(reservation) {
  const detail = reservation.detalles?.[0];
  return {
    ...reservation,
    codigoRetiro: reservation.codigo_retiro || "—",
    cliente: reservation.cliente || "Cliente",
    medicamento: detail?.medicamento || "Sin detalle",
    cantidad: detail?.cantidad || 0,
    fecha: formatDate(reservation.fecha_reserva),
    tiempoRestante: "—",
  };
}

function useReservations() {
  const farmaciaId = getUser()?.farmacia_id || null;
  const [reservations, setReservations] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("TODAS");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    if (!farmaciaId) return;
    try {
      const response = await reservasApi.listarPorFarmacia(farmaciaId);
      setReservations((response.data || []).map(normalizeReservation));
    } catch (err) {
      setError(err.message || "No se pudieron cargar las reservas.");
    }
  };

  useEffect(() => {
    loadReservations(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [farmaciaId]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reservations.filter((reservation) =>
      (filter === "TODAS" || reservation.estado === filter) &&
      (reservation.cliente.toLowerCase().includes(term) ||
        reservation.medicamento.toLowerCase().includes(term) ||
        reservation.codigoRetiro.toLowerCase().includes(term))
    );
  }, [reservations, search, filter]);

  const changeStatus = async (id, estado) => {
    try {
      const response = await reservasApi.actualizarEstado(id, estado);
      const updated = normalizeReservation(response.data);
      setReservations((current) => current.map((item) => item.id === id ? updated : item));
      setSelected(null);
    } catch (err) {
      setError(err.message || "No se pudo actualizar la reserva.");
    }
  };

  const countBy = (estado) => reservations.filter((item) => item.estado === estado).length;

  return {
    reservations: visible, search, setSearch, filter, setFilter,
    selected, setSelected, error, reload: loadReservations,
    counts: Object.fromEntries(Object.keys(statusConfig).map((status) => [status, countBy(status)])),
    changeStatus,
  };
}

export default useReservations;
