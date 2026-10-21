import "./Header.css";
import NotificationBell from "../notifications/NotificationBell";
import { getUser } from "../../services/session";
import { ROLES } from "../../services/users";
import { notificationsByRole } from "../../services/mockNotifications";

function Header({ titulo }) {
    const user = getUser();
    // El backend devuelve 'nombre_completo'; el mock legacy usaba 'nombre'
    const name = user ? (user.nombre_completo || user.nombre || "Usuario") : "Invitado";
    // Mapear rol del backend ("administrador") al label visible, o usar ROLES para mock
    const rolKey = ["administrador", "admin_farmacia"].includes(user?.rol) ? "ADMIN_FARMACIA"
        : user?.rol === "paciente" ? "PACIENTE"
        : user?.rol;
    const role = user ? (ROLES[rolKey] || user.rol || "") : "";
    const notifications = notificationsByRole[rolKey] ?? [];


    return (
        <header className="header">
            <div className="header__title">
                <h1>{titulo}</h1>
                <p>Bienvenido a MedLoc</p>
            </div>

            <div className="header__right">
                <NotificationBell notifications={notifications} />

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
