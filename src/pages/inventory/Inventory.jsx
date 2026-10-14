import "./Inventory.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import SearchBar from "../../components/searchbar/SearchBar";
import StatCard from "../../components/statcard/StatCard";
import Modal from "../../components/modal/Modal";
import FormField from "../../components/formfield/FormField";
import { formatCurrency } from "../../services/formatters";
import useInventory, { categories, getStockStatus } from "./useInventory";

function Inventory() {
    const {
        medicines, stats, search, setSearch, category, setCategory,
        categoryOptions, modalOpen, setModalOpen, addMedicine, removeMedicine,
    } = useInventory();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        addMedicine({
            medicamento: form.get("medicamento"),
            principioActivo: form.get("principioActivo"),
            categoria: form.get("categoria"),
            stockActual: Number(form.get("stockActual")),
            stockMinimo: Number(form.get("stockMinimo")),
            precioUnitario: Number(form.get("precioUnitario")),
        });
    };

    return (
        <div className="inventory">
            <Sidebar />

            <div className="inventory__main">
                <Header titulo="Inventario" />

                <main className="inventory__content">
                    <p className="inventory__intro">Gestiona existencias y disponibilidad en tiempo real.</p>

                    <section className="inventory__stats">
                        <StatCard title="Medicamentos" value={stats.total} description="Referencias registradas" />
                        <StatCard title="Stock bajo" value={stats.low} description="Por debajo del mínimo" tone="warning" />
                        <StatCard title="Agotados" value={stats.out} description="Sin unidades" tone="danger" />
                        <StatCard title="Valor del inventario" value={formatCurrency(stats.value)} tone="success" />
                    </section>

                    <div className="inventory__table-container">
                        <div className="inventory__table-header">
                            <h3>Stock actual</h3>
                            <Button onClick={() => setModalOpen(true)}>+ Agregar medicamento</Button>
                        </div>

                        <div className="inventory__filters">
                            <SearchBar
                                value={search}
                                onChange={setSearch}
                                placeholder="Buscar por nombre o principio activo"
                            />
                            <select
                                className="inventory__select"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                aria-label="Filtrar por categoría"
                            >
                                {categoryOptions.map((c) => (
                                    <option key={c} value={c}>{c === "Todas" ? "Todas las categorías" : c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="inventory__scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>Medicamento</th>
                                    <th>Categoría</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                    <th>Precio unitario</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {medicines.map((m) => {
                                    const status = getStockStatus(m);
                                    return (
                                        <tr key={m.id}>
                                            <td>
                                                <strong>{m.medicamento}</strong>
                                                <span className="inventory__sub">{m.principioActivo}</span>
                                            </td>
                                            <td>{m.categoria}</td>
                                            <td>
                                                {m.stockActual}
                                                <span className="inventory__sub">Mínimo: {m.stockMinimo}</span>
                                            </td>
                                            <td><Badge tone={status.tone}>{status.label}</Badge></td>
                                            <td>{formatCurrency(m.precioUnitario)}</td>
                                            <td className="inventory__actions">
                                                <Button size="sm" variant="secondary">Editar</Button>
                                                <Button size="sm" variant="danger" onClick={() => removeMedicine(m.id)}>
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>

                            {medicines.length === 0 && (
                                <p className="inventory__empty">
                                    No hay medicamentos que coincidan. Prueba con otro nombre o categoría.
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <Modal open={modalOpen} title="Agregar medicamento" onClose={() => setModalOpen(false)}>
                <form className="inventory__form" onSubmit={handleSubmit}>
                    <FormField id="medicamento" name="medicamento" label="Nombre y concentración" placeholder="Ej. Naproxeno 250mg" required />
                    <FormField id="principioActivo" name="principioActivo" label="Principio activo" required />
                    <FormField id="categoria" name="categoria" label="Categoría" options={categories} />
                    <div className="inventory__form-row">
                        <FormField id="stockActual" name="stockActual" label="Stock actual" type="number" min="0" required />
                        <FormField id="stockMinimo" name="stockMinimo" label="Stock mínimo" type="number" min="0" required />
                    </div>
                    <FormField id="precioUnitario" name="precioUnitario" label="Precio unitario (COP)" type="number" min="0" required />
                    <Button type="submit" fullWidth>Guardar medicamento</Button>
                </form>
            </Modal>
        </div>
    );
}

export default Inventory;
