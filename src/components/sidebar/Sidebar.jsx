import "./Sidebar.css";
import useHashRoute from "../../hooks/useHashRoute";
import { clearUser } from "../../services/session";

const links = [
    { path: "/dashboard", icon: "▦", label: "Dashboard" },
    { path: "/inventario", icon: "♙", label: "Inventario" },
    { path: "/ventas", icon: "▣", label: "Punto de venta" },
    { path: "/reservas", icon: "▤", label: "Reservas" },
];

function Sidebar() {
    const { route } = useHashRoute();

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
                <p>Sistema de administración</p>
            </div>
        </aside>
    );
}

export default Sidebar;
