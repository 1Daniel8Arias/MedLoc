import "./Header.css";
import { useEffect, useState } from "react";
import NotificationBell from "../notifications/NotificationBell";
import { getUser } from "../../services/session";
import { ROLES } from "../../services/users";
import { reservasApi } from "../../services/api";

function Header({ titulo }) {
    const user = getUser();
    const [notifications, setNotifications] = useState([]);
    // El backend devuelve 'nombre_completo'; el mock legacy usaba 'nombre'
    const name = user ? (user.nombre_completo || user.nombre || "Usuario") : "Invitado";
    // Mapear rol del backend ("administrador") al label visible, o usar ROLES para mock
    const rolKey = ["administrador", "admin_farmacia"].includes(user?.rol) ? "ADMIN_FARMACIA"
        : user?.rol === "paciente" ? "PACIENTE"
        : user?.rol;
    const role = user ? (ROLES[rolKey] || user.rol || "") : "";
    useEffect(() => {
        const farmaciaId = user?.farmacia_id;
        if (!farmaciaId) {
            return undefined;
        }

        let cancelled = false;
        reservasApi.listarPorFarmacia(farmaciaId)
            .then((response) => {
                if (cancelled) return;
                const pending = (response.data || []).filter(
                    (reservation) => reservation.estado === "pendiente"
                );
                setNotifications(pending.map((reservation) => ({
                    id: reservation.id,
                    titulo: "Nueva reserva pendiente",
                    detalle: `${reservation.cliente || "Un cliente"} realizó una reserva.`,
                    tiempo: reservation.fecha_reserva
                        ? new Date(reservation.fecha_reserva).toLocaleString("es-CO")
                        : "Fecha no disponible",
                    leida: false,
                })));
            })
            .catch((error) => {
                if (!cancelled) {
                    console.error("Error cargando notificaciones de reservas:", error);
                    setNotifications([]);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [user?.farmacia_id]);


    return (
        <header className="header">
            <div className="header__title">
                <h1>{titulo}</h1>
                <p>Bienvenido a MedLoc</p>
            </div>

            <div className="header__right">
                <NotificationBell
                    key={notifications.map((notification) => notification.id).join("-")}
                    notifications={notifications}
                />

                <a href="#/perfil" className="header__user" title="Ver mi perfil">
                    <div className="header__avatar">{name.charAt(0).toUpperCase()}</div>
                    <div className="header__user-info">
                        <span className="header__user-name">{name}</span>
                        <span className="header__user-role">{role}</span>
                    </div>
                </a>
            </div>
        </header>
    );
}

export default Header;
