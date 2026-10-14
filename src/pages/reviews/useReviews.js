import { useMemo, useState } from "react";
import { pharmacies } from "../../services/mockPharmacies";

const pharmacy = pharmacies[0]; // Droguería La Esperanza (la del administrador de prueba)

export const tabs = [
  { id: "todas", label: "Todas" },
  { id: "sin-responder", label: "Sin responder" },
];

function useReviews() {
  const [reviews, setReviews] = useState(pharmacy.resenas);
  const [tab, setTab] = useState("todas");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const visible = useMemo(
    () => (tab === "sin-responder" ? reviews.filter((r) => !r.respuesta) : reviews),
    [reviews, tab]
  );

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: pharmacy.distribucion[stars],
    percent: (pharmacy.distribucion[stars] / pharmacy.totalResenas) * 100,
  }));

  const startReply = (id) => {
    setReplyingId(id);
    setReplyText("");
  };

  const publishReply = (id) => {
    if (!replyText.trim()) return;
    setReviews((current) => current.map((r) => (r.id === id ? { ...r, respuesta: replyText.trim() } : r)));
    setReplyingId(null);
  };

  return {
    pharmacy, reviews: visible, tab, setTab, distribution,
    replyingId, replyText, setReplyText, startReply, publishReply,
    cancelReply: () => setReplyingId(null),
  };
}

export default useReviews;
