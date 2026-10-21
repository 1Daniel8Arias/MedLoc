import "./Reservations.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import SearchBar from "../../components/searchbar/SearchBar";
import StatCard from "../../components/statcard/StatCard";
import Modal from "../../components/modal/Modal";
import useReservations, { filters, statusConfig } from "./useReservations";

function Reservations() {
  const {
    reservations, search, setSearch, filter, setFilter,
    selected, setSelected, counts, changeStatus,
    error,
  } = useReservations();

  return (
    <div className="reservations">
      <Sidebar />

      <div className="reservations__main">
        <Header titulo="Reservas" />

        <main className="reservations__content">
          {error && <p className="reservations__empty">{error}</p>}
          <p className="reservations__intro">
            Verifica el código de retiro del cliente antes de entregar el medicamento.
          </p>

          <section className="reservations__stats">
            <StatCard title="Pendientes" value={counts.pendiente} description="Esperando retiro" tone="warning" />
            <StatCard title="Recogidas" value={counts.retirada} description="Entregadas" tone="success" />
            <StatCard title="Canceladas" value={counts.cancelada} description="Anuladas por el cliente" />
            <StatCard title="Expiradas" value={counts.expirada} description="Superaron las 2 horas" tone="danger" />
          </section>

          <div className="reservations__panel">
            <div className="reservations__toolbar">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Buscar por cliente, medicamento o código"
              />
              <div className="reservations__tabs">
                {filters.map((f) => (
                  <button
                    key={f}
                    className={f === filter ? "reservations__tab reservations__tab--active" : "reservations__tab"}
                    onClick={() => setFilter(f)}
                  >
                    {f === "TODAS" ? "Todas" : statusConfig[f].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="reservations__scroll">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Cliente</th>
                    <th>Medicamento</th>
                    <th>Cant.</th>
                    <th>Reservada</th>
                    <th>Tiempo restante</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id}>
                      <td className="reservations__code">{r.codigoRetiro}</td>
                      <td>
                        <strong>{r.cliente}</strong>
                        <span className="reservations__sub">{r.telefono}</span>
                      </td>
                      <td>{r.medicamento}</td>
                      <td>{r.cantidad}</td>
                      <td>{r.fecha}</td>
                      <td>{r.tiempoRestante}</td>
                      <td><Badge tone={statusConfig[r.estado]?.tone || "neutral"}>{statusConfig[r.estado]?.label || r.estado}</Badge></td>
                      <td>
                        <Button
                          size="sm"
                          variant={["pendiente", "confirmada", "lista_para_retiro"].includes(r.estado) ? "success" : "secondary"}
                          onClick={() => setSelected(r)}
                        >
                          {["pendiente", "confirmada", "lista_para_retiro"].includes(r.estado) ? "Entregar" : "Ver detalle"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {reservations.length === 0 && (
                <p className="reservations__empty">
                  No hay reservas con este filtro. Cambia el estado o la búsqueda.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      <Modal open={Boolean(selected)} title="Detalle de la reserva" onClose={() => setSelected(null)}>
        {selected && (
          <div className="reservations__detail">
            <dl>
              <dt>Código de retiro</dt><dd className="reservations__code">{selected.codigoRetiro}</dd>
              <dt>Cliente</dt><dd>{selected.cliente}</dd>
              <dt>Medicamento</dt><dd>{selected.medicamento} × {selected.cantidad}</dd>
              <dt>Reservada</dt><dd>{selected.fecha}</dd>
              <dt>Estado</dt>
              <dd><Badge tone={statusConfig[selected.estado]?.tone || "neutral"}>{statusConfig[selected.estado]?.label || selected.estado}</Badge></dd>
            </dl>

            {["pendiente", "confirmada", "lista_para_retiro"].includes(selected.estado) && (
              <div className="reservations__detail-actions">
                <Button variant="success" onClick={() => changeStatus(selected.id, "retirada")}>
                  Confirmar entrega
                </Button>
                <Button variant="danger" onClick={() => changeStatus(selected.id, "cancelada")}>
                  Cancelar reserva
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Reservations;
