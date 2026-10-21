import { useCallback, useEffect, useMemo, useState } from "react";
import { getUser } from "../../services/session";
import { inventarioApi, medicamentosApi } from "../../services/api";

export function getStockStatus(medicine) {
    if (medicine.stockActual === 0) return { label: "Agotado", tone: "danger" };
    if (medicine.stockActual <= medicine.stockMinimo) return { label: "Stock bajo", tone: "warning" };
    return { label: "Disponible", tone: "success" };
}

/**
 * Fusiona datos de inventario (stock/precio) con datos del catálogo (nombre/principio activo).
 * El modelo del backend separa el medicamento del inventario, aquí los unimos.
 */
function mergeItems(inventarioItems, medicamentosData) {
    return inventarioItems.map((item) => {
        const med = medicamentosData[item.id_medicamento] || {};
        return {
            id: item.id_medicamento,              // UUID del medicamento
            id_farmacia: item.id_farmacia,
            medicamento: med.nombre_comercial
                ? `${med.nombre_comercial}${med.concentracion ? " " + med.concentracion : ""}`
                : item.id_medicamento,
            principioActivo: med.principio_activo || "—",
            presentacion: med.presentacion || "—",
            stockActual: item.stock_actual,
            stockMinimo: 10,                      // valor por defecto (la BD no lo tiene aún)
            precioUnitario: item.precio_unitario,
            _inventario: item,
        };
    });
}

function useInventory() {
    const user = getUser();
    const farmaciaId = user?.farmacia_id || null;  // UUID de la farmacia del admin

    const [rawInventario, setRawInventario] = useState([]);
    const [medicamentosMap, setMedicamentosMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [modalOpen, setModalOpen] = useState(false);

    // ── Cargar inventario desde la API ────────────────────────────────────────
    const cargarInventario = useCallback(async () => {
        if (!farmaciaId) {
            setError("No se encontró la farmacia asociada a tu cuenta.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const resI = await inventarioApi.listarPorFarmacia(farmaciaId);
            const items = resI.data || [];
            setRawInventario(items);

            // Cargar datos del catálogo de cada medicamento
            const medMap = {};
            await Promise.all(
                items.map(async (item) => {
                    if (medMap[item.id_medicamento]) return;
                    try {
                        const resM = await medicamentosApi.obtener(item.id_medicamento);
                        medMap[item.id_medicamento] = resM.data;
                    } catch {/* ignorar errores individuales */}
                })
            );
            setMedicamentosMap(medMap);
        } catch (err) {
            setError(err.message || "Error al cargar el inventario.");
        } finally {
            setLoading(false);
        }
    }, [farmaciaId]);

    useEffect(() => {
        cargarInventario();
    }, [cargarInventario]);

    const allMedicines = useMemo(
        () => mergeItems(rawInventario, medicamentosMap),
        [rawInventario, medicamentosMap]
    );

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return allMedicines.filter((m) => {
            const matchesText =
                m.medicamento.toLowerCase().includes(term) ||
                m.principioActivo.toLowerCase().includes(term);
            const matchesPresentation = category === "Todas" || m.presentacion === category;
            return matchesText && matchesPresentation;
        });
    }, [allMedicines, search, category]);

    const stats = {
        total: allMedicines.length,
        low: allMedicines.filter((m) => m.stockActual > 0 && m.stockActual <= m.stockMinimo).length,
        out: allMedicines.filter((m) => m.stockActual === 0).length,
        value: allMedicines.reduce((sum, m) => sum + m.stockActual * m.precioUnitario, 0),
    };

    /**
     * Agrega un medicamento nuevo al catálogo y lo registra en el inventario de la farmacia.
     * 1. POST /api/v1/medicamentos/   → crea el medicamento en el catálogo
     * 2. POST /api/v1/inventario/     → crea el ítem de inventario para esta farmacia
     */
    const addMedicine = async (data) => {
        try {
            // 1. Crear el medicamento en el catálogo global
            const resMed = await medicamentosApi.crear({
                nombre_comercial: data.nombre_comercial,
                principio_activo: data.principio_activo,
                concentracion: data.concentracion || null,
                presentacion: data.presentacion || null,
                laboratorio: data.laboratorio || null,
            });
            const nuevoMed = resMed.data;

            // 2. Crear el ítem en el inventario de esta farmacia
            await inventarioApi.upsert({
                id_farmacia: farmaciaId,
                id_medicamento: nuevoMed.id,
                stock_actual: data.stockActual,
                precio_unitario: data.precioUnitario,
            });

            setModalOpen(false);
            await cargarInventario(); // recargar para reflejar cambios
            return true;
        } catch (err) {
            setError(err.message || "Error al agregar el medicamento.");
            return false;
        }
    };

    /**
     * Elimina un ítem del inventario ajustando el stock a 0.
     * (El medicamento permanece en el catálogo global.)
     */
    const removeMedicine = async (medicamentoId) => {
        try {
            const item = rawInventario.find((i) => i.id_medicamento === medicamentoId);
            if (!item) return;
            // Reducir stock a 0 (delta negativo)
            await inventarioApi.ajustarStock(farmaciaId, medicamentoId, -item.stock_actual);
            await cargarInventario();
        } catch (err) {
            setError(err.message || "Error al eliminar el medicamento.");
        }
    };

    return {
        medicines: filtered,
        stats,
        loading, error,
        search, setSearch,
        category, setCategory,
        presentationOptions: [
            "Todas",
            ...new Set(allMedicines.map((medicine) => medicine.presentacion).filter(Boolean)),
        ],
        modalOpen, setModalOpen,
        addMedicine,
        removeMedicine,
        recargar: cargarInventario,
    };
}

export default useInventory;
