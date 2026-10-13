import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <div className="sidebar__logo">M</div>
                <h2>MedLoc</h2>
            </div>

            <p className="sidebar__label">MENÚ PRINCIPAL</p>

            <nav className="sidebar__nav">
                <a href="#" className="sidebar__link sidebar__link--active">
                    <span>▦</span>
                    Dashboard
                </a>

                <a href="#" className="sidebar__link">
                    <span>♙</span>
                    Inventario
                </a>

                <a href="#" className="sidebar__link">
                    <span>▤</span>
                    Reservas
                </a>

                <p className="sidebar__label">GESTIÓN</p>

                <a href="#" className="sidebar__link">
                    <span>⚙</span>
                    Configuración
                </a>
            </nav>

            <div className="sidebar__footer">
                Sistema de administración
            </div>
        </aside>
    );
}

export default Sidebar;
