import "./Header.css";
import { getUser } from "../../services/session";
import { ROLES } from "../../services/users";

function Header({ titulo }) {
    const user = getUser();
    const name = user ? user.nombre : "DANIEL";
    const role = user ? ROLES[user.rol] : "Administrador";

    return (
        <header className="header">
            <div className="header__title">
                <h1>{titulo}</h1>
                <p>Bienvenido a MedLoc</p>
            </div>

            <div className="header__user">
                <div className="header__avatar">{name.charAt(0).toUpperCase()}</div>

                <div className="header__user-info">
                    <span className="header__user-name">{name}</span>
                    <span className="header__user-role">{role}</span>
                </div>
            </div>
        </header>
    );
}

export default Header;
