import "./MyReservations.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import Tabs from "../../components/tabs/Tabs";
import Modal from "../../components/modal/Modal";
import FormField from "../../components/formfield/FormField";
import StarRating from "../../components/starrating/StarRating";
import useMyReservations, { statusConfig } from "./useMyReservations";

function MyReservations() {
  const {
    tabs, tab, setTab, list, cancel,
    rateTarget, openRate, closeRate, rating, setRating, comment, setComment, submitRating,
    loading, error,
  } = useMyReservations();

  return (
    <div className="myres">
      <Sidebar />

      <div className="myres__main">
        <Header titulo="Mis reservas" />

        <main className="myres__content">
          <p className="myres__intro">
            Presenta tu código de retiro en la droguería antes de que se cumplan las 2 horas.
          </p>
          {error && <p className="myres__error" role="alert">{error}</p>}

          <Tabs tabs={tabs} active={tab} onChange={setTab} />

          <div className="myres__list">
            {loading && <p className="myres__empty">Cargando tus reservas...</p>}
            {list.map((r) => (
              <article key={r.id} className="resv">
                <div className="resv__info">
                  <div className="resv__top">
                    <h3>{r.medicamento} <span>× {r.cantidad}</span></h3>
                    <Badge tone={statusConfig[r.estado]?.tone || "neutral"}>
                      {statusConfig[r.estado]?.label || r.estado}
                    </Badge>
                  </div>
                  <p className="resv__pharmacy">{r.farmacia}</p>
                  <p className="resv__address">{r.direccion}</p>

                  {["pendiente", "confirmada", "lista_para_retiro"].includes(r.estado) && (
                    <div className="resv__time">
                      <span>Te quedan {r.restante}</span>
                      <div className="resv__progress"><div style={{ width: `${r.progreso}%` }} /></div>
                    </div>
                  )}
                </div>

                <div className="resv__code">
                  <span>Código de retiro</span>
                  <strong>{r.codigo}</strong>
                </div>

                <div className="resv__actions">
                  {["pendiente", "confirmada", "lista_para_retiro"].includes(r.estado) && (
                    <>
                      <Button size="sm" variant="secondary">Cómo llegar</Button>
                      <Button size="sm" variant="danger" onClick={() => cancel(r.id)}>Cancelar reserva</Button>
                    </>
                  )}
                  {r.estado === "retirada" && (
                    r.calificada ? (
                      <Badge tone="info">Ya calificaste</Badge>
                    ) : (
                      <Button size="sm" onClick={() => openRate(r)}>Calificar droguería</Button>
                    )
                  )}
                  {(r.estado === "cancelada" || r.estado === "expirada") && (
                    <Button size="sm" variant="ghost">Reservar de nuevo</Button>
                  )}
                </div>
              </article>
            ))}

            {list.length === 0 && (
              <p className="myres__empty">
                {tab === "activas"
                  ? "No tienes reservas activas. Busca un medicamento para apartarlo."
                  : "Aún no tienes historial de reservas."}
              </p>
            )}
          </div>
        </main>
      </div>

      <Modal open={Boolean(rateTarget)} title="Calificar droguería" onClose={closeRate}>
        {rateTarget && (
          <form className="myres__rate" onSubmit={submitRating}>
            <p>¿Cómo fue tu experiencia en <strong>{rateTarget.farmacia}</strong>?</p>
            <StarRating value={rating} onChange={setRating} size={34} />
            <FormField
              id="comentario"
              label="Comentario (opcional)"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos qué tal fue la atención y la disponibilidad."
            />
            <Button type="submit" disabled={rating === 0} fullWidth>Enviar calificación</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default MyReservations;
