import "./Dashboard.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import StatCard from "../../components/statcard/StatCard";
import Badge from "../../components/badge/Badge";
import StarRating from "../../components/starrating/StarRating";
import useDashboard from "./useDashboard";

function Dashboard() {
    const { statistics, weeklySales, pendingReservations, lowStock, latestReview } = useDashboard();
    const maxSale = Math.max(...weeklySales.map((d) => d.value));

    return (
        <div className="dashboard">
            <Sidebar />

            <div className="dashboard__main">
                <Header titulo="Dashboard" />

                <main className="dashboard__content">
                    <div className="dashboard__welcome">
                        <h2>Resumen de hoy</h2>
                        <p>Esto es lo que necesita tu atención en la droguería.</p>
                    </div>

                    <section className="dashboard__statistics">
                        {statistics.map((s) => (
                            <StatCard key={s.id} title={s.title} value={s.value} description={s.description} tone={s.tone} />
                        ))}
                    </section>

                    <div className="dashboard__grid">
                        <section className="panel">
                            <div className="panel__header">
                                <h3>Ventas de la semana</h3>
                                <span>Miles de pesos</span>
                            </div>
                            <div className="chart" role="img" aria-label="Gráfico de ventas de la semana">
                                {weeklySales.map((d) => (
                                    <div key={d.day} className="chart__col">
                                        <span className="chart__value">{d.value}</span>
                                        <div className="chart__bar" style={{ height: `${(d.value / maxSale) * 100}%` }} />
                                        <span className="chart__label">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="panel">
                            <div className="panel__header">
                                <h3>Reservas por entregar</h3>
                                <a href="#/reservas">Ver todas</a>
                            </div>
                            <ul className="panel__list">
                                {pendingReservations.map((r) => (
                                    <li key={r.id}>
                                        <div>
                                            <strong>{r.cliente}</strong>
                                            <span>{r.medicamento}</span>
                                        </div>
                                        <div className="panel__right">
                                            <code>{r.codigo}</code>
                                            <Badge tone="warning">{r.restante}</Badge>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="panel">
                            <div className="panel__header">
                                <h3>Alertas de inventario</h3>
                                <a href="#/inventario">Ir al inventario</a>
                            </div>
                            <ul className="panel__list">
                                {lowStock.map((m) => (
                                    <li key={m.id}>
                                        <div>
                                            <strong>{m.medicamento}</strong>
                                            <span>Mínimo recomendado: {m.minimo}</span>
                                        </div>
                                        <Badge tone={m.stock === 0 ? "danger" : "warning"}>
                                            {m.stock === 0 ? "Agotado" : `${m.stock} unidades`}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="panel">
                            <div className="panel__header">
                                <h3>Última reseña</h3>
                                <a href="#/calificaciones">Ver calificaciones</a>
                            </div>
                            <div className="dashboard__review">
                                <StarRating value={latestReview.puntuacion} />
                                <p>{latestReview.comentario}</p>
                                <span>{latestReview.autor}</span>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
