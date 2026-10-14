import { useMemo, useState } from "react";

const initialMedicines = [
    { id: 1, medicamento: "Acetaminofén 500mg", principioActivo: "Acetaminofén", categoria: "Analgésico", stockActual: 48, stockMinimo: 10, precioUnitario: 3200 },
    { id: 2, medicamento: "Ibuprofeno 400mg", principioActivo: "Ibuprofeno", categoria: "Antiinflamatorio", stockActual: 4, stockMinimo: 10, precioUnitario: 5200 },
    { id: 3, medicamento: "Losartán 50mg", principioActivo: "Losartán potásico", categoria: "Cardiovascular", stockActual: 8, stockMinimo: 12, precioUnitario: 9200 },
    { id: 4, medicamento: "Omeprazol 20mg", principioActivo: "Omeprazol", categoria: "Gastrointestinal", stockActual: 16, stockMinimo: 10, precioUnitario: 4500 },
    { id: 5, medicamento: "Amoxicilina 500mg", principioActivo: "Amoxicilina", categoria: "Antibiótico", stockActual: 0, stockMinimo: 15, precioUnitario: 12800 },
    { id: 6, medicamento: "Loratadina 10mg", principioActivo: "Loratadina", categoria: "Antialérgico", stockActual: 30, stockMinimo: 8, precioUnitario: 3900 },
    { id: 7, medicamento: "Metformina 850mg", principioActivo: "Metformina", categoria: "Endocrino", stockActual: 22, stockMinimo: 10, precioUnitario: 7400 },
];

export const categories = [
    "Analgésico", "Antiinflamatorio", "Cardiovascular", "Gastrointestinal",
    "Antibiótico", "Antialérgico", "Endocrino", "Otro",
];

export function getStockStatus(medicine) {
    if (medicine.stockActual === 0) return { label: "Agotado", tone: "danger" };
    if (medicine.stockActual <= medicine.stockMinimo) return { label: "Stock bajo", tone: "warning" };
    return { label: "Disponible", tone: "success" };
}

function useInventory() {
    const [medicines, setMedicines] = useState(initialMedicines);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todas");
    const [modalOpen, setModalOpen] = useState(false);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return medicines.filter((m) => {
            const matchesText =
                m.medicamento.toLowerCase().includes(term) ||
                m.principioActivo.toLowerCase().includes(term);
            const matchesCategory = category === "Todas" || m.categoria === category;
            return matchesText && matchesCategory;
        });
    }, [medicines, search, category]);

    const stats = {
        total: medicines.length,
        low: medicines.filter((m) => m.stockActual > 0 && m.stockActual <= m.stockMinimo).length,
        out: medicines.filter((m) => m.stockActual === 0).length,
        value: medicines.reduce((sum, m) => sum + m.stockActual * m.precioUnitario, 0),
    };

    const addMedicine = (data) => {
        setMedicines((current) => [...current, { id: Date.now(), ...data }]);
        setModalOpen(false);
    };

    const removeMedicine = (id) => {
        setMedicines((current) => current.filter((m) => m.id !== id));
    };

    return {
        medicines: filtered,
        stats,
        search, setSearch,
        category, setCategory,
        categoryOptions: ["Todas", ...categories],
        modalOpen, setModalOpen,
        addMedicine,
        removeMedicine,
    };
}

export default useInventory;
