import "./Dashboard.css";

import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import useDashboard from "./useDashboard";

function Dashboard() {
    const {statistics} = useDashboard();

    return (
        <div className="dashboard">
            <Sidebar/>

            <div className="dashboard__main">
                <Header titulo="Dashboard"/>

                <main className="dashboard__content">
                    <div className="dashboard__welcome">
                        <h2>Resumen general</h2>
                        <p>
                            Aquí encontrarás la información principal de MedLoc.
                        </p>
                    </div>

                    <section className="dashboard__statistics">
                        {statistics.map((statistic) => (
                            <article
                                className="stat-card"
                                key={statistic.id}
                            >
                                <h3>{statistic.title}</h3>

                                <p className="stat-card__value">
                                    {statistic.value}
                                </p>

                                <p className="stat-card__description">
                                    {statistic.description}
                                </p>
                            </article>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
