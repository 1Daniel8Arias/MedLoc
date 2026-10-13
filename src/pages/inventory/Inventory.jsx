import "./Inventory.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import useInventory from "./useInventory";

function Inventory() {
    const {statistics} = useInventory();
    return (
        <div className="inventory">
            <Sidebar/>

            <div className="inventory__main">
                <Header titulo="Inventario"/>

                <main className="inventory__content">

                    <p>Gestiona existencias y disponibilidad en tiempo real.</p>

                    <div className="inventory__table-container">
                        <div className="inventory__table-header">
                            <h3>Stock actual</h3>

                            <button className="inventory__add-button" onClick={() => alert("Agregar medicamento")}>
                                + Agregar medicamento
                            </button>
                        </div>
                        <table className="table-auto">
                            <thead>
                            <tr>
                                <th>MEDICAMENTO</th>
                                <th>CATEGORIÁ</th>
                                <th>STOCK ACTUAL</th>
                                <th>ESTADO</th>
                                <th>PRECIO UNITARIO</th>
                                <th>ACCIONES</th>
                            </tr>
                            </thead>
                            <tbody>
                            {statistics.map((statistic) => (
                                <tr key={statistic.id}>
                                    <td>{statistic.medicamento}</td>
                                    <td>{statistic.categoria}</td>
                                    <td>{statistic.stockActual}</td>
                                    <td>{statistic.estado}</td>
                                    <td>{statistic.precioUnitario}</td>
                                    <td>
                                        <button className="inventory__delete-button">
                                            eliminar
                                        </button>
                                        <button className="inventory__edit-button">editar</button>
                                    </td>
                                </tr>
                            ))

                            }
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Inventory;