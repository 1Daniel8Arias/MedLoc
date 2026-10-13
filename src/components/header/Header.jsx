
import "./Header.css";

function Header({ titulo }) {
  return (
    <header className="header">
      <div className="header__title">
        <h1>{titulo}</h1>
        <p>Bienvenido a MedLoc</p>
      </div>

      <div className="header__user">
        <div className="header__avatar">U</div>

        <div className="header__user-info">
          <span className="header__user-name">DANIEL</span>
          <span className="header__user-role">Administrador</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
