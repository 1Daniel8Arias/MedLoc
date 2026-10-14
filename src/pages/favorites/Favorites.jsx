import "./Favorites.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import Toggle from "../../components/toggle/Toggle";
import FormField from "../../components/formfield/FormField";
import useFavorites from "./useFavorites";

function Favorites() {
  const { favorites, newName, setNewName, addFavorite, toggleAlert, removeFavorite } = useFavorites();

  return (
    <div className="favs">
      <Sidebar />

      <div className="favs__main">
        <Header titulo="Favoritos y alertas" />

        <main className="favs__content">
          <p className="favs__intro">
            Guarda los medicamentos que usas con frecuencia y te avisamos cuando haya existencias cerca de ti.
          </p>

          <form className="favs__add" onSubmit={addFavorite}>
            <FormField
              id="nuevo-favorito"
              label="Agregar medicamento"
              placeholder="Ej. Enalapril 20mg"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button type="submit">Agregar a favoritos</Button>
          </form>

          <div className="favs__list">
            {favorites.map((f) => (
              <article key={f.id} className="fav">
                <div className="fav__info">
                  <h3>{f.medicamento}</h3>
                  <p>{f.principioActivo}</p>
                  <Badge tone={f.disponible ? "success" : "danger"}>{f.disponibilidad}</Badge>
                </div>

                <div className="fav__alert">
                  <Toggle
                    label="Avisarme"
                    description="Cuando haya stock"
                    checked={f.alerta}
                    onChange={toggleAlert(f.id)}
                  />
                </div>

                <div className="fav__actions">
                  <a href="#/" className="fav__search">Buscar cerca</a>
                  <Button size="sm" variant="danger" onClick={() => removeFavorite(f.id)}>Quitar</Button>
                </div>
              </article>
            ))}

            {favorites.length === 0 && (
              <p className="favs__empty">Aún no tienes favoritos. Agrega un medicamento para recibir alertas.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Favorites;
