import "./Header.css";
import NotificationBell from "../notifications/NotificationBell";
import { getUser } from "../../services/session";
import { ROLES } from "../../services/users";
import { notificationsByRole } from "../../services/mockNotifications";

function Header({ titulo }) {
    const user = getUser();
    const name = user ? user.nombre : "Invitado";
    const role = user ? ROLES[user.rol] : "";
    const notifications = notificationsByRole[user?.rol] ?? [];

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
