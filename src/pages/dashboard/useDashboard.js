import { useEffect, useMemo, useState } from "react";
import { getUser } from "../../services/session";
import { inventarioApi, medicamentosApi, farmaciasApi } from "../../services/api";

const STOCK_MINIMO_DEFAULT = 10; // umbral si no hay mínimo definido

function useDashboard() {
  const user = getUser();
  const farmaciaId = user?.farmacia_id || null;

  const [inventario, setInventario] = useState([]);
  const [medicamentosMap, setMedicamentosMap] = useState({});
  const [farmacia, setFarmacia] = useState(null);
  const [loading, setLoading] = useState(false);

  // Datos estáticos de ejemplo para gráficas (sin endpoint en el back aún)
  const weeklySales = [
    { day: "Lun", value: 320 },
    { day: "Mar", value: 410 },
    { day: "Mié", value: 280 },
    { day: "Jue", value: 530 },
    { day: "Vie", value: 610 },
    { day: "Sáb", value: 740 },
    { day: "Dom", value: 482 },
  ];

  useEffect(() => {
    if (!farmaciaId) return;
    let cancelled = false;

    async function cargar() {
      setLoading(true);
      try {
        // Cargar datos de la farmacia y su inventario en paralelo
        const [resF, resI] = await Promise.all([
          farmaciasApi.obtener(farmaciaId),
          inventarioApi.listarPorFarmacia(farmaciaId),
        ]);
        if (cancelled) return;

        setFarmacia(resF.data);
        const items = resI.data || [];
        setInventario(items);

        // Cargar nombres de medicamentos
        const medMap = {};
        await Promise.all(
          items.map(async (item) => {
            if (medMap[item.id_medicamento]) return;
            try {
              const resM = await medicamentosApi.obtener(item.id_medicamento);
              if (!cancelled) medMap[item.id_medicamento] = resM.data;
            } catch {/* ignorar */}
          })
        );
        if (!cancelled) setMedicamentosMap(medMap);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    cargar();
    return () => { cancelled = true; };
  }, [farmaciaId]);

  // ── Estadísticas calculadas desde el inventario real ─────────────────────

  const lowStock = useMemo(() =>
    inventario
      .filter((i) => i.stock_actual > 0 && i.stock_actual <= STOCK_MINIMO_DEFAULT)
      .map((i) => ({
        id: i.id_medicamento,
        medicamento: medicamentosMap[i.id_medicamento]
          ? `${medicamentosMap[i.id_medicamento].nombre_comercial}${
              medicamentosMap[i.id_medicamento].concentracion
                ? " " + medicamentosMap[i.id_medicamento].concentracion
                : ""
            }`
          : i.id_medicamento,
        stock: i.stock_actual,
        minimo: STOCK_MINIMO_DEFAULT,
      })),
    [inventario, medicamentosMap]
  );

  const agotados = useMemo(
    () => inventario.filter((i) => i.stock_actual === 0).length,
    [inventario]
  );

  const statistics = [
    { id: 1, title: "Ventas de hoy", value: "$ —", description: "Próximamente disponible", tone: "success" },
    { id: 2, title: "Reservas pendientes", value: "—", description: "Próximamente disponible", tone: "default" },
    { id: 3, title: "Stock bajo", value: lowStock.length, description: "Medicamentos por reponer", tone: "warning" },
    { id: 4, title: "Agotados", value: agotados, description: "Sin unidades disponibles", tone: "danger" },
  ];

  // Reseña más reciente (placeholder hasta tener endpoint de reseñas)
  const latestReview = {
    autor: "—",
    puntuacion: null,
    comentario: "Las reseñas estarán disponibles próximamente.",
  };

  return {
    statistics,
    weeklySales,
    pendingReservations: [],   // endpoint de reservas pendiente
    lowStock,
    latestReview,
    farmacia,
    loading,
  };
}

export default useDashboard;
