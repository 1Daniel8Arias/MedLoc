import "./Landing.css";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import SearchBar from "../../components/searchbar/SearchBar";
import FormField from "../../components/formfield/FormField";
import MedMap from "../../components/medmap/MedMap";
import { formatCurrency } from "../../services/formatters";
import { formatDistance } from "../../services/geo";
import useLanding, { radiusOptions, suggestions } from "./useLanding";

function Landing() {
  const {
    mode, setMode, handleSubmit, goToAccess, features, steps, roles,
    query, setQuery, radius, setRadius, view, setView,
    location, locating, locationError, requestLocation, useExampleLocation,
    results,
  } = useLanding();
  const isLogin = mode === "login";
  const hasQuery = query.trim().length > 0;

  const markers = results.map((r) => ({
    id: r.id,
    lat: r.lat,
    lng: r.lng,
    title: r.farmacia,
    subtitle: `${r.medicamento} · ${formatCurrency(r.precio)} · ${formatDistance(r.distancia)}`,
  }));

  return (
      <div className="landing">
        <header className="landing__nav">
          <div className="landing__brand">
            <div className="landing__logo">M</div>
            <span>MedLoc</span>
          </div>
          <nav className="landing__links">
            <a href="#buscar">Buscar medicamento</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#acceso" onClick={() => setMode("login")}>Ingresar</a>
          </nav>
        </header>

        <section className="landing__hero">
          <div className="landing__hero-text">
            <h1>Tu medicamento, en la droguería más cercana</h1>
            <p>
              Busca sin crear cuenta. Te mostramos qué droguerías cerca de ti tienen existencias.
            </p>

            <div className="landing__search" id="buscar">
              <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="Nombre comercial o principio activo"
                  aria-label="Buscar medicamento"
              />
              <div className="landing__suggestions">
                {suggestions.map((s) => (
                    <button key={s} onClick={() => setQuery(s)}>{s}</button>
                ))}
              </div>

              <div className="landing__search-options">
                <label>
                  Radio de búsqueda
                  <select value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
                    {radiusOptions.map((r) => (
                        <option key={r} value={r}>{r} km</option>
                    ))}
                  </select>
                </label>
                <Button variant="secondary" size="sm" onClick={requestLocation} disabled={locating}>
                  {locating ? "Ubicando..." : "Usar mi ubicación"}
                </Button>
                <button className="landing__link-btn" onClick={useExampleLocation}>
                  Ubicación de ejemplo (Armenia)
                </button>
              </div>

              <p className="landing__location">
                {location.source === "gps"
                    ? "Buscando cerca de tu ubicación actual."
                    : "Buscando cerca del centro de Armenia (ubicación de ejemplo)."}
              </p>
              {locationError && <p className="landing__error">{locationError}</p>}
            </div>
          </div>

          <div className="landing__auth" id="acceso">
            <div className="landing__tabs" role="tablist">
              <button
                  role="tab"
                  aria-selected={isLogin}
                  className={isLogin ? "landing__tab landing__tab--active" : "landing__tab"}
                  onClick={() => setMode("login")}
              >
                Ingresar
              </button>
              <button
                  role="tab"
                  aria-selected={!isLogin}
                  className={!isLogin ? "landing__tab landing__tab--active" : "landing__tab"}
                  onClick={() => setMode("register")}
              >
                Registrarse
              </button>
            </div>

            <form className="landing__form" onSubmit={handleSubmit}>
              <h2>{isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h2>

              {!isLogin && (
                  <>
                    <FormField id="nombre" label="Nombre completo" name="nombre" required />
                    <FormField id="telefono" label="Teléfono" name="telefono" type="tel" />
                    <FormField id="rol" label="Tipo de cuenta" name="rol" options={roles} />
                  </>
              )}

              <FormField id="email" label="Correo electrónico" name="email" type="email" required />
              <FormField id="password" label="Contraseña" name="password" type="password" required />

              {!isLogin && (
                  <FormField id="password2" label="Confirmar contraseña" name="password2" type="password" required />
              )}

              <Button type="submit" size="lg" fullWidth>
                {isLogin ? "Ingresar" : "Crear cuenta"}
              </Button>

              <p className="landing__switch">
                {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                <button type="button" onClick={() => setMode(isLogin ? "register" : "login")}>
                  {isLogin ? "Regístrate" : "Ingresa"}
                </button>
              </p>
            </form>
          </div>
        </section>

        <section className="landing__results">
          <div className="landing__results-header">
            <div>
              <h2>Resultados cerca de ti</h2>
              <p>
                {hasQuery
                    ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"} para "${query.trim()}" en ${radius} km`
                    : "Escribe un medicamento arriba para ver dónde conseguirlo."}
              </p>
            </div>

            <div className="landing__toggle" role="group" aria-label="Forma de visualización">
              <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")}>
                Lista
              </button>
              <button className={view === "map" ? "is-active" : ""} onClick={() => setView("map")}>
                Mapa
              </button>
            </div>
          </div>

          {!hasQuery && (
              <p className="landing__hint">
                Prueba con "Acetaminofén", "Losartán" o el principio activo que necesites.
              </p>
          )}

          {hasQuery && results.length === 0 && (
              <p className="landing__hint">
                No encontramos droguerías con ese medicamento en {radius} km. Amplía el radio o revisa el nombre.
              </p>
          )}

          {hasQuery && view === "list" && (
              <div className="landing__list">
                {results.map((r) => (
                    <article key={r.id} className="offer">
                      <div className="offer__main">
                        <h3>{r.medicamento}</h3>
                        <p className="offer__pharmacy">{r.farmacia}</p>
                        <p className="offer__address">{r.direccion} · {r.telefono}</p>
                      </div>
                      <div className="offer__meta">
                        <strong className="offer__distance">{formatDistance(r.distancia)}</strong>
                        <Badge tone={r.stock <= 5 ? "warning" : "success"}>
                          {r.stock <= 5 ? `Quedan ${r.stock}` : `${r.stock} disponibles`}
                        </Badge>
                        <span className="offer__price">{formatCurrency(r.precio)}</span>
                      </div>
                      <Button size="sm" onClick={() => goToAccess("register")}>
                        Reservar
                      </Button>
                    </article>
                ))}
              </div>
          )}

          {hasQuery && view === "map" && (
              <MedMap center={location} radiusKm={radius} markers={markers} />
          )}

          {hasQuery && results.length > 0 && (
              <p className="landing__note">
                Para reservar necesitas una cuenta. Buscar siempre es gratis y sin registro.
              </p>
          )}
        </section>

        <section className="landing__section" id="beneficios">
          <h2>Menos recorridos, más tiempo para tu salud</h2>
          <div className="landing__features">
            {features.map((feature) => (
                <article key={feature.id} className="landing__feature">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
            ))}
          </div>
        </section>

        <section className="landing__section landing__section--alt" id="como-funciona">
          <h2>Así funciona</h2>
          <ol className="landing__steps">
            {steps.map((step) => (
                <li key={step.id}>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
            ))}
          </ol>
        </section>

        <footer className="landing__footer">
          <span>© 2026 MedLoc · Medicamentos a tu disposición</span>
          <span>Tus datos están protegidos conforme a la Ley 1581 de 2012 (Habeas Data).</span>
        </footer>
      </div>
  );
}

export default Landing;
