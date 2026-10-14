import "./Sidebar.css";
import useHashRoute from "../../hooks/useHashRoute";
import { clearUser, getUser } from "../../services/session";

const adminLinks = [
    { path: "/dashboard", icon: "▦", label: "Dashboard" },
    { path: "/inventario", icon: "♙", label: "Inventario" },
    { path: "/ventas", icon: "▣", label: "Punto de venta" },
    { path: "/reservas", icon: "▤", label: "Reservas" },
    { path: "/calificaciones", icon: "★", label: "Calificaciones" },
    { path: "/perfil", icon: "☺", label: "Mi perfil" },
];

const patientLinks = [
    { path: "/", icon: "⌕", label: "Buscar medicamentos" },
    { path: "/mis-reservas", icon: "▤", label: "Mis reservas" },
    { path: "/favoritos", icon: "♡", label: "Favoritos y alertas" },
    { path: "/perfil", icon: "☺", label: "Mi perfil" },
];

function Sidebar() {
    const { route } = useHashRoute();
    const user = getUser();
    const links = user?.rol === "PACIENTE" ? patientLinks : adminLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <div className="sidebar__logo">M</div>
                <h2>MedLoc</h2>
            </div>

            <p className="sidebar__label">MENÚ PRINCIPAL</p>

            <nav className="sidebar__nav">
                {links.map((link) => (
                    <a
                        key={link.path}
                        href={`#${link.path}`}
                        className={`sidebar__link ${route === link.path ? "sidebar__link--active" : ""}`}
                    >
                        <span>{link.icon}</span>
                        {link.label}
                    </a>
                ))}
            </nav>

            <div className="sidebar__footer">
                <a href="#/" className="sidebar__link" onClick={clearUser}>
                    <span>⎋</span>
                    Cerrar sesión
                </a>
                <p>{user?.rol === "PACIENTE" ? "Cuenta de paciente" : "Sistema de administración"}</p>
            </div>
        </aside>
    );
}

export default Sidebar;
