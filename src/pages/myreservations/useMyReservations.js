import { useEffect, useState } from "react";
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

function useMyReservations() {
  const userId = getUser()?.id || null;
  const [reservations, setReservations] = useState([]);
  const [tab, setTab] = useState("activas");
  const [rateTarget, setRateTarget] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    reservasApi.listarPorUsuario(userId)
      .then((response) => {
        if (cancelled) return;
        setReservations((response.data || []).map((reservation) => {
          const detail = reservation.detalles?.[0];
          return {
            ...reservation,
            medicamento: detail?.medicamento || "Medicamento",
            cantidad: detail?.cantidad || 0,
            farmacia: reservation.farmacia || "Farmacia",
            direccion: reservation.direccion_farmacia || "Dirección no disponible",
            codigo: reservation.codigo_retiro || "—",
            calificada: false,
          };
        }));
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "No se pudieron cargar tus reservas.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const active = reservations.filter((r) =>
    ["pendiente", "confirmada", "lista_para_retiro"].includes(r.estado)
  );
  const history = reservations.filter((r) => !active.includes(r));

  const tabs = [
    { id: "activas", label: `Activas (${active.length})` },
    { id: "historial", label: `Historial (${history.length})` },
  ];

  const cancel = async (id) => {
    try {
      await reservasApi.actualizarEstado(id, "cancelada");
      setReservations((current) => current.map((r) =>
        r.id === id ? { ...r, estado: "cancelada" } : r
      ));
    } catch (requestError) {
      setError(requestError.message || "No se pudo cancelar la reserva.");
    }
  };

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
    loading, error,
  };
}

export default useMyReservations;
