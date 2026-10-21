import "./Landing.css";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import SearchBar from "../../components/searchbar/SearchBar";
import FormField from "../../components/formfield/FormField";
import Modal from "../../components/modal/Modal";
import MedMap from "../../components/medmap/MedMap";
import { formatCurrency } from "../../services/formatters";
import { formatDistance } from "../../services/geo";
import useLanding, { radiusOptions, suggestions } from "./useLanding";

function Landing() {
  const {
    mode, setMode, handleSubmit, goToAccess, features, steps, roles,
    user, authError, authLoading, logout, goToPanel,
    query, setQuery, radius, setRadius, view, setView,
    location, locating, locationError, requestLocation, selectCityPreset, citiesPresets,
    results, dataLoading,
    mapPharmacies,
    selectedPharmacy, setSelectedPharmacy,
    reserve, reservedIds,
    reservationError, reservationLoading,
    reservationTarget, reservationQuantity, setReservationQuantity,
    openReservation, closeReservation,
  } = useLanding();

  const isLogin = mode === "login";
  const hasQuery = query.trim().length > 0;
  const isUnlimited = radius >= 1000;

  return (
      <div className="landing">
        <header className="landing__nav">
          <div className="landing__brand">
            <div className="landing__logo">M</div>
            <span>MedLoc</span>
          </div>
          <nav className="landing__links">
            <a href="#catalogo">Medicamentos y Droguerías</a>
            <a href="#como-funciona">Cómo funciona</a>
            {user ? (
              <div className="landing__user-nav">
                <span>Hola, {user.nombre_completo || user.email}</span>
                {(user.rol === "administrador" || user.rol === "ADMIN_FARMACIA") && (
                  <Button size="sm" variant="secondary" onClick={goToPanel}>Panel Farmacia</Button>
                )}

                <Modal
                  open={Boolean(reservationTarget)}
                  title="Confirmar reserva"
                  onClose={closeReservation}
                >
                  {reservationTarget && (
                    <div className="reservation-confirm">
                      <div className="reservation-confirm__summary">
                        <span className="reservation-confirm__label">Medicamento</span>
                        <h3>{reservationTarget.medicamento}</h3>
                        {reservationTarget.presentacion && <p>{reservationTarget.presentacion}</p>}
                      </div>
                      <dl className="reservation-confirm__details">
                        <div><dt>Farmacia</dt><dd>{reservationTarget.farmacia}</dd></div>
                        <div><dt>Dirección</dt><dd>{reservationTarget.direccion}</dd></div>
                        <div><dt>Precio unitario</dt><dd>{formatCurrency(reservationTarget.precio)}</dd></div>
                        <div><dt>Disponibles</dt><dd>{reservationTarget.stock} unidades</dd></div>
                      </dl>
                      <label className="reservation-confirm__quantity">
                        <span>Cantidad a reservar</span>
                        <input
                          type="number"
                          min="1"
                          max={reservationTarget.stock}
                          value={reservationQuantity}
                          onChange={(event) => setReservationQuantity(
                            Math.min(reservationTarget.stock, Math.max(1, Number(event.target.value)))
                          )}
                        />
                      </label>
                      <p className="reservation-confirm__total">
                        Total estimado: <strong>{formatCurrency(reservationTarget.precio * reservationQuantity)}</strong>
                      </p>
                      {reservationError && <p className="landing__auth-alert" role="alert">{reservationError}</p>}
                      <div className="reservation-confirm__actions">
                        <Button variant="secondary" onClick={closeReservation} disabled={reservationLoading}>Cancelar</Button>
                        <Button
                          onClick={() => reserve(reservationTarget, reservationQuantity)}
                          disabled={reservationLoading || reservationTarget.stock < 1}
                        >
                          {reservationLoading ? "Reservando..." : "Confirmar reserva"}
                        </Button>
                      </div>
                    </div>
                  )}
                </Modal>
                <Button size="sm" variant="ghost" onClick={logout}>Cerrar sesión</Button>
              </div>
            ) : (
              <a href="#acceso" onClick={() => setMode("login")}>Ingresar</a>
            )}
          </nav>
        </header>

        <section className="landing__hero">
          <div className="landing__hero-text">
            <h1>Tu medicamento, en la droguería más cercana</h1>
            <p>
              Filtra medicamentos por cercanía en tiempo real. Consulta precios, existencias y ubicación de droguerías.
            </p>

            <div className="landing__search" id="buscar">
              <SearchBar
                  value={query}
                  onChange={setQuery}
                  placeholder="Nombre comercial o principio activo (ej. Acetaminofén, Advil...)"
                  aria-label="Buscar medicamento"
              />
              <div className="landing__suggestions">
                {suggestions.map((s) => (
                    <button
                      key={s}
                      className={query.toLowerCase() === s.toLowerCase() ? "is-active" : ""}
                      onClick={() => setQuery(query.toLowerCase() === s.toLowerCase() ? "" : s)}
                    >
                      {s}
                    </button>
                ))}
                {hasQuery && (
                  <button className="landing__clear-search" onClick={() => setQuery("")}>
                    ✕ Ver todos los medicamentos
                  </button>
                )}
              </div>

              {/* Opciones de filtrado por distancia y ubicación */}
              <div className="landing__search-options">
                <div className="landing__filter-group">
                  <label htmlFor="radius-select">
                    Distancia máxima:
                  </label>
                  <select
                    id="radius-select"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="landing__select"
                  >
                    {radiusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="landing__city-pills">
                  <span className="landing__city-label">Ciudad de referencia:</span>
                  {citiesPresets.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`landing__city-btn ${location.label === c.label ? "is-active" : ""}`}
                      onClick={() => selectCityPreset(c)}
                    >
                      {c.label}
                    </button>
                  ))}
                  <Button
                    variant={location.source === "gps" ? "primary" : "secondary"}
                    size="sm"
                    onClick={requestLocation}
                    disabled={locating}
                  >
                    {locating ? "Ubicando..." : "📍 Mi GPS"}
                  </Button>
                </div>
              </div>

              <p className="landing__location">
                📍 Centro de búsqueda: <strong>{location.label || "Coordenadas fijadas"}</strong>
                {!isUnlimited && ` · Filtrando a menos de ${radius} km`}
              </p>
              {locationError && <p className="landing__error">{locationError}</p>}
            </div>
          </div>

          {!user && <div className="landing__auth" id="acceso">
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

              {authError && (
                <div className="landing__auth-alert" role="alert">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <div className="landing__auth-alert-content">
                    <strong>Acceso denegado</strong>
                    <span>{authError}</span>
                  </div>
                </div>
              )}

              {!isLogin && (
                  <>
                    <FormField id="nombre" label="Nombre completo" name="nombre" required />
                    <FormField id="telefono" label="Teléfono" name="telefono" type="tel" />
                    <FormField id="rol" label="Tipo de cuenta" name="rol" options={roles} />
                  </>
              )}

              <FormField
                id="email"
                label="Correo electrónico"
                name="email"
                type="email"
                autoComplete="email"
                required
              />

              <FormField
                id="password"
                label="Contraseña"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />

              {!isLogin && (
                  <FormField
                    id="password2"
                    label="Confirmar contraseña"
                    name="password2"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
              )}

              <Button type="submit" size="lg" fullWidth disabled={authLoading}>
                {authLoading ? "Verificando..." : (isLogin ? "Ingresar" : "Crear cuenta")}
              </Button>

              <p className="landing__switch">
                {isLogin ? "¿Aún no tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                <button type="button" onClick={() => setMode(isLogin ? "register" : "login")}>
                  {isLogin ? "Regístrate" : "Ingresa"}
                </button>
              </p>
            </form>
          </div>}
        </section>

        {/* Sección de Catálogo / Resultados / Mapa */}
        <section className="landing__results" id="catalogo">
          <div className="landing__results-header">
            <div>
              <h2>{hasQuery ? `Resultados para "${query.trim()}"` : "Medicamentos disponibles"}</h2>
              <p>
                {results.length > 0 ? (
                  isUnlimited ? (
                    `Mostrando ${results.length} ${results.length === 1 ? "medicamento disponible" : "medicamentos disponibles"} ordenados por cercanía.`
                  ) : (
                    `Mostrando ${results.length} ${results.length === 1 ? "medicamento disponible" : "medicamentos disponibles"} a menos de ${radius} km de ${location.label || "tu ubicación"}.`
                  )
                ) : (
                  `No hay medicamentos encontrados a menos de ${radius} km de ${location.label || "tu ubicación"}.`
                )}
              </p>
            </div>

            <div className="landing__toggle" role="group" aria-label="Forma de visualización">
              <button className={view === "list" ? "is-active" : ""} onClick={() => setView("list")}>
                Lista ({results.length})
              </button>
              <button className={view === "map" ? "is-active" : ""} onClick={() => setView("map")}>
                🗺️ Mapa ({mapPharmacies.length} droguerías)
              </button>
            </div>
          </div>

          {dataLoading && (
            <p className="landing__hint">Cargando inventario de medicamentos en tiempo real...</p>
          )}

          {!dataLoading && results.length === 0 && (
            <div className="landing__empty-box">
              <p className="landing__hint">
                {hasQuery
                  ? `No encontramos droguerías con "${query.trim()}" en un radio de ${isUnlimited ? "cualquier distancia" : `${radius} km`}.`
                  : `No hay droguerías registradas a menos de ${radius} km de ${location.label || "tu ubicación"}.`}
              </p>
              <div className="landing__empty-actions">
                <Button variant="secondary" size="sm" onClick={() => setRadius(1000)}>
                  Ampliar a todas las distancias
                </Button>
                <button className="landing__link-btn" onClick={() => selectCityPreset(citiesPresets[0])}>
                  Probar con Bogotá
                </button>
                <button className="landing__link-btn" onClick={() => selectCityPreset(citiesPresets[1])}>
                  Probar con Medellín
                </button>
              </div>
            </div>
          )}

          {/* VISTA DE LISTA */}
          {results.length > 0 && view === "list" && (
              <div className="landing__list">
                {results.map((r) => (
                    <article key={r.id} className="offer">
                      <div className="offer__main">
                        <div className="offer__title-row">
                          <h3>{r.medicamento}</h3>
                          {r.principioActivo && (
                            <span className="offer__active-badge">Activo: {r.principioActivo}</span>
                          )}
                        </div>
                        <p className="offer__pharmacy">
                          📍 {r.farmacia}
                          {r.nit && <span className="offer__nit"> · NIT: {r.nit}</span>}
                        </p>
                        <p className="offer__address">
                          {r.direccion} {r.laboratorio && `· Lab: ${r.laboratorio}`}
                        </p>
                      </div>

                      <div className="offer__meta">
                        <strong className="offer__distance">{formatDistance(r.distancia)}</strong>
                        {r.stock > 0 ? (
                          <Badge tone={r.stock <= 5 ? "warning" : "success"}>
                            {r.stock <= 5 ? `Quedan ${r.stock}` : `${r.stock} disponibles`}
                          </Badge>
                        ) : (
                          <Badge tone="neutral">Consultar disponibilidad</Badge>
                        )}
                        <span className="offer__price">
                          {r.precio > 0 ? formatCurrency(r.precio) : "Consultar precio"}
                        </span>
                      </div>

                      <div className="offer__actions">
                        <Button
                          size="sm"
                          disabled={reservationLoading || reservedIds.includes(r.id)}
                          onClick={() => openReservation(r)}
                        >
                          {reservedIds.includes(r.id) ? "Reservado" : "Reservar"}
                        </Button>
                        <button
                          type="button"
                          className="offer__map-link"
                          onClick={() => {
                            setView("map");
                            const found = mapPharmacies.find((p) => p.id === r.farmaciaId);
                            if (found) setSelectedPharmacy(found);
                          }}
                        >
                          Ver en mapa
                        </button>
                      </div>
                    </article>
                ))}
              </div>
          )}

          {/* VISTA DE MAPA INTERACTIVO */}
          {view === "map" && (
            <div className="landing__map-wrapper">
              <div className="landing__map-banner">
                <span>💡 <strong>Consejo:</strong> Haz clic en cualquier droguería (✚) en el mapa para ver su información y los medicamentos que maneja.</span>
              </div>
              <MedMap
                center={location}
                radiusKm={radius}
                pharmacies={mapPharmacies}
                onSelectPharmacy={setSelectedPharmacy}
                selectedPharmacyId={selectedPharmacy?.id}
              />
            </div>
          )}

          {results.length > 0 && !user && (
              <p className="landing__note">
                ℹ️ Para apartar medicamentos necesitas una cuenta. Buscar y explorar el catálogo siempre es libre y sin costo.
              </p>
          )}
          {user && (
            <p className="landing__note">
              Sesión iniciada como <strong>{user.nombre_completo || user.email}</strong>. Ya puedes reservar medicamentos.
            </p>
          )}
          {reservationError && <p className="landing__auth-alert" role="alert">{reservationError}</p>}
        </section>

        {/* MODAL / PANEL DE DETALLE DE FARMACIA Y SUS PRODUCTOS */}
        {selectedPharmacy && (
          <div className="pharmacy-modal__backdrop" onClick={() => setSelectedPharmacy(null)}>
            <div className="pharmacy-modal" onClick={(e) => e.stopPropagation()}>
              <header className="pharmacy-modal__header">
                <div>
                  <div className="pharmacy-modal__badge-row">
                    <span className="pharmacy-modal__badge">Droguería</span>
                    <span className="pharmacy-modal__dist-badge">📏 {formatDistance(selectedPharmacy.distancia)} de tu ubicación</span>
                  </div>
                  <h2>{selectedPharmacy.nombre}</h2>
                  <p className="pharmacy-modal__address">📍 {selectedPharmacy.direccion} {selectedPharmacy.nit && `· NIT: ${selectedPharmacy.nit}`}</p>
                </div>
                <button
                  type="button"
                  className="pharmacy-modal__close"
                  onClick={() => setSelectedPharmacy(null)}
                  aria-label="Cerrar detalle"
                >
                  ✕
                </button>
              </header>

              <div className="pharmacy-modal__body">
                <h3>📦 Productos disponibles en esta droguería ({(selectedPharmacy.productos || []).length}):</h3>
                
                {(!selectedPharmacy.productos || selectedPharmacy.productos.length === 0) ? (
                  <p className="pharmacy-modal__empty">Esta droguería aún no tiene productos registrados en su inventario activo.</p>
                ) : (
                  <div className="pharmacy-modal__products-list">
                    {selectedPharmacy.productos.map((prod) => (
                      <div key={prod.id} className="pharmacy-modal__product-item">
                        <div className="pharmacy-modal__prod-info">
                          <h4>{prod.medicamento}</h4>
                          {prod.principioActivo && (
                            <span className="pharmacy-modal__prod-active">Principio activo: {prod.principioActivo}</span>
                          )}
                          <p className="pharmacy-modal__prod-meta">
                            {prod.presentacion && `Presentación: ${prod.presentacion}`}
                            {prod.laboratorio && ` · Lab: ${prod.laboratorio}`}
                          </p>
                        </div>

                        <div className="pharmacy-modal__prod-pricing">
                          <span className="pharmacy-modal__prod-price">{formatCurrency(prod.precio)}</span>
                          <Badge tone={prod.stock <= 5 ? "warning" : "success"}>
                            {prod.stock <= 5 ? `Quedan ${prod.stock}` : `${prod.stock} disponibles`}
                          </Badge>
                          <Button
                            size="sm"
                            disabled={reservationLoading || reservedIds.includes(`${selectedPharmacy.id}-${prod.id}`)}
                            onClick={() => {
                              openReservation({
                                id: `${selectedPharmacy.id}-${prod.id}`,
                                farmaciaId: selectedPharmacy.id,
                                medicamentoId: prod.id,
                                medicamento: prod.medicamento,
                                farmacia: selectedPharmacy.nombre,
                                direccion: selectedPharmacy.direccion,
                                precio: prod.precio,
                                stock: prod.stock,
                                presentacion: prod.presentacion,
                              });
                              setSelectedPharmacy(null);
                            }}
                          >
                            {reservedIds.includes(`${selectedPharmacy.id}-${prod.id}`) ? "Reservado" : "Reservar"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <footer className="pharmacy-modal__footer">
                <Button variant="secondary" onClick={() => setSelectedPharmacy(null)}>
                  Cerrar
                </Button>
                {!user && (
                  <Button onClick={() => {
                    setSelectedPharmacy(null);
                    goToAccess("register");
                  }}>
                    Crear cuenta para apartar
                  </Button>
                )}
              </footer>
            </div>
          </div>
        )}

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
