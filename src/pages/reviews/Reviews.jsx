import "./Reviews.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import StarRating from "../../components/starrating/StarRating";
import Tabs from "../../components/tabs/Tabs";
import FormField from "../../components/formfield/FormField";
import useReviews, { tabs } from "./useReviews";

function Reviews() {
  const {
    pharmacy, reviews, tab, setTab, distribution,
    replyingId, replyText, setReplyText, startReply, publishReply, cancelReply,
  } = useReviews();

  return (
    <div className="reviews">
      <Sidebar />

      <div className="reviews__main">
        <Header titulo="Calificaciones" />

        <main className="reviews__content">
          <p className="reviews__intro">
            Así te ven los pacientes. Responder a las reseñas mejora la confianza en tu droguería.
          </p>

          <section className="reviews__summary">
            <div className="reviews__score">
              <strong>{pharmacy.rating.toFixed(1)}</strong>
              <StarRating value={pharmacy.rating} size={22} />
              <span>{pharmacy.totalResenas} reseñas</span>
            </div>

            <div className="reviews__bars">
              {distribution.map((d) => (
                <div key={d.stars} className="reviews__bar-row">
                  <span>{d.stars} ★</span>
                  <div className="reviews__bar"><div style={{ width: `${d.percent}%` }} /></div>
                  <span>{d.count}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="reviews__list">
            <Tabs tabs={tabs} active={tab} onChange={setTab} />

            {reviews.map((r) => (
              <article key={r.id} className="review">
                <div className="review__top">
                  <div>
                    <strong>{r.autor}</strong>
                    <span>{r.fecha}</span>
                  </div>
                  <StarRating value={r.puntuacion} />
                </div>
                <p>{r.comentario}</p>

                {r.respuesta && (
                  <div className="review__reply">
                    <strong>Tu respuesta</strong>
                    <p>{r.respuesta}</p>
                  </div>
                )}

                {!r.respuesta && replyingId !== r.id && (
                  <Button size="sm" variant="secondary" onClick={() => startReply(r.id)}>Responder</Button>
                )}

                {replyingId === r.id && (
                  <div className="review__form">
                    <FormField
                      id={`reply-${r.id}`}
                      label="Tu respuesta"
                      multiline
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Agradece y responde con respeto."
                    />
                    <div className="review__form-actions">
                      <Button size="sm" onClick={() => publishReply(r.id)}>Publicar respuesta</Button>
                      <Button size="sm" variant="ghost" onClick={cancelReply}>Cancelar</Button>
                    </div>
                  </div>
                )}
              </article>
            ))}

            {reviews.length === 0 && (
              <p className="reviews__empty">No tienes reseñas pendientes por responder.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Reviews;
