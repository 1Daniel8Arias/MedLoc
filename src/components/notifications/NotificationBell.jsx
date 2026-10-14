import { useEffect, useRef, useState } from "react";
import "./NotificationBell.css";

function NotificationBell({ notifications }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notifications);
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const unread = items.filter((n) => !n.leida).length;
  const markAllRead = () => setItems((current) => current.map((n) => ({ ...n, leida: true })));

  return (
    <div className="bell" ref={ref}>
      <button
        className="bell__button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaciones, ${unread} sin leer`}
        aria-expanded={open}
      >
        🔔
        {unread > 0 && <span className="bell__count">{unread}</span>}
      </button>

      {open && (
        <div className="bell__panel">
          <div className="bell__panel-header">
            <strong>Notificaciones</strong>
            <button onClick={markAllRead}>Marcar como leídas</button>
          </div>
          {items.map((n) => (
            <div key={n.id} className={n.leida ? "bell__item" : "bell__item bell__item--unread"}>
              <strong>{n.titulo}</strong>
              <p>{n.detalle}</p>
              <span>{n.tiempo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
