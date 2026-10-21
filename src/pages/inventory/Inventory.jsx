import "./Inventory.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Badge from "../../components/badge/Badge";
import SearchBar from "../../components/searchbar/SearchBar";
import StatCard from "../../components/statcard/StatCard";
import Modal from "../../components/modal/Modal";
import FormField from "../../components/formfield/FormField";
import { useState } from "react";
import { formatCurrency } from "../../services/formatters";
import useInventory, { getStockStatus } from "./useInventory";

function Inventory() {
    const {
        medicines, stats, search, setSearch, category, setCategory,
        presentationOptions, modalOpen, setModalOpen, addMedicine, updateMedicine, removeMedicine,
        error,
    } = useInventory();
    const [createdMessage, setCreatedMessage] = useState("");
    const [editingMedicine, setEditingMedicine] = useState(null);

    const openCreateModal = () => {
        setEditingMedicine(null);
        setModalOpen(true);
    };

    const openEditModal = (medicine) => {
        setEditingMedicine(medicine);
        setModalOpen(true);
    };

    const closeModal = () => {
        setEditingMedicine(null);
        setModalOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        const data = {
            nombre_comercial: form.get("nombre_comercial"),
            principio_activo: form.get("principio_activo"),
            concentracion: form.get("concentracion"),
            presentacion: form.get("presentacion"),
            laboratorio: form.get("laboratorio"),
        };

        if (editingMedicine) {
            const updated = await updateMedicine(editingMedicine.id, {
                ...data,
                stockActual: Number(form.get("stockActual")),
                previousStock: editingMedicine.stockActual,
                precioUnitario: Number(form.get("precioUnitario")),
                previousPrice: Number(editingMedicine.precioUnitario),
            });
            if (updated) {
                setCreatedMessage(`Se actualizó "${data.nombre_comercial}" correctamente.`);
                setTimeout(() => setCreatedMessage(""), 5000);
            }
            return;
        }

        const created = await addMedicine({
            ...data,
            stockActual: Number(form.get("stockActual")),
            stockMinimo: Number(form.get("stockMinimo")),
            precioUnitario: Number(form.get("precioUnitario")),
        });
        if (created) {
            event.currentTarget.reset();
            setCreatedMessage(
                `Se creó "${form.get("nombre_comercial")}" correctamente. ` +
                "El producto ya está disponible en el inventario."
            );
            setTimeout(() => setCreatedMessage(""), 5000);
        }
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
                            <Button onClick={openCreateModal}>+ Agregar medicamento</Button>
                        </div>
                        {createdMessage && (
                            <div className="inventory__success" role="status">
                                <strong>Operación completada</strong>
                                <span>{createdMessage}</span>
                            </div>
                        )}
                        {error && <p className="inventory__error" role="alert">{error}</p>}

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
                                aria-label="Filtrar por presentación"
                            >
                                {presentationOptions.map((presentation) => (
                                    <option key={presentation} value={presentation}>
                                        {presentation === "Todas" ? "Todas las presentaciones" : presentation}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="inventory__scroll">
                            <table>
                                <thead>
                                <tr>
                                    <th>Medicamento</th>
                                    <th>Presentación</th>
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
                                            <td>{m.presentacion}</td>
                                            <td>
                                                {m.stockActual}
                                                <span className="inventory__sub">Mínimo: {m.stockMinimo}</span>
                                            </td>
                                            <td><Badge tone={status.tone}>{status.label}</Badge></td>
                                            <td>{formatCurrency(m.precioUnitario)}</td>
                                            <td className="inventory__actions">
                                                <Button size="sm" variant="secondary" onClick={() => openEditModal(m)}>
                                                    Editar
                                                </Button>
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
                                    No hay medicamentos que coincidan. Prueba con otro nombre o presentación.
                                </p>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <Modal
                open={modalOpen}
                title={editingMedicine ? "Editar medicamento" : "Agregar medicamento"}
                onClose={closeModal}
            >
                <form className="inventory__form" onSubmit={handleSubmit} key={editingMedicine?.id || "new"}>
                    <FormField id="nombre_comercial" name="nombre_comercial" label="Nombre comercial" defaultValue={editingMedicine?.nombreComercial || ""} required />
                    <FormField id="principio_activo" name="principio_activo" label="Principio activo" defaultValue={editingMedicine?.principioActivo === "—" ? "" : editingMedicine?.principioActivo || ""} required />
                    <FormField id="concentracion" name="concentracion" label="Concentración" placeholder="Ej. 500 mg" defaultValue={editingMedicine?.concentracion || ""} />
                    <FormField id="presentacion" name="presentacion" label="Presentación" placeholder="Ej. Caja x 20 tabletas" defaultValue={editingMedicine?.presentacion === "—" ? "" : editingMedicine?.presentacion || ""} />
                    <FormField id="laboratorio" name="laboratorio" label="Laboratorio" defaultValue={editingMedicine?.laboratorio || ""} />
                    {!editingMedicine && (
                    <div className="inventory__form-row">
                        <FormField id="stockActual" name="stockActual" label="Stock actual" type="number" min="0" required />
                        <FormField id="stockMinimo" name="stockMinimo" label="Stock mínimo" type="number" min="0" required />
                    </div>
                    )}
                    {editingMedicine && (
                    <div className="inventory__form-row">
                        <FormField
                            id="stockActual"
                            name="stockActual"
                            label="Stock actual"
                            type="number"
                            min="0"
                            defaultValue={editingMedicine.stockActual}
                            required
                        />
                        <FormField
                            id="precioUnitario"
                            name="precioUnitario"
                            label="Precio unitario (COP)"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={editingMedicine.precioUnitario}
                            required
                        />
                    </div>
                    )}
                    {!editingMedicine && (
                    <FormField id="precioUnitario" name="precioUnitario" label="Precio unitario (COP)" type="number" min="0" required />
                    )}
                    <Button type="submit" fullWidth>{editingMedicine ? "Guardar cambios" : "Guardar medicamento"}</Button>
                </form>
            </Modal>
        </div>
    );
}

export default Inventory;
