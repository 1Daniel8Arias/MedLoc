import { useCallback, useEffect, useMemo, useState } from "react";
import useHashRoute from "../../hooks/useHashRoute";
import { DEFAULT_LOCATION, distanceKm } from "../../services/geo";
import { getUser, setUser, clearUser } from "../../services/session";
import { authApi, inventarioApi, farmaciasApi } from "../../services/api";
import { ROLES } from "../../services/users";

const features = [
  { id: 1, title: "Búsqueda por cercanía", description: "Encuentra tu medicamento por nombre comercial o principio activo y mira primero las droguerías más cercanas." },
  { id: 2, title: "Stock en tiempo real", description: "Consulta cuántas unidades quedan antes de salir de casa, sin llamadas ni recorridos innecesarios." },
  { id: 3, title: "Reserva con código", description: "Aparta tu medicamento por 2 horas y recógelo en la droguería con un código de retiro." },
];

const steps = [
  { id: 1, title: "Busca", description: "Escribe el medicamento que necesitas." },
  { id: 2, title: "Compara", description: "Revisa distancia, precio y unidades disponibles." },
  { id: 3, title: "Reserva", description: "Aparta el producto y recibe tu código de retiro." },
  { id: 4, title: "Recoge", description: "Presenta el código en la droguería y listo." },
];

const roles = Object.values(ROLES);
export const radiusOptions = [2, 5, 10];
export const suggestions = ["Acetaminofén", "Ibuprofeno", "Losartán", "Omeprazol"];

const normalize = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/**
 * Construye la lista de ofertas aplanando el inventario de todas las farmacias.
 * Cada ítem = { farmacia, direccion, lat, lng, medicamento, principioActivo, stock, precio }
 */
function buildOffers(farmacias, inventarioMap, medicamentoMap) {
  const result = [];
  for (const f of farmacias) {
    const items = inventarioMap[f.id] || [];
    for (const item of items) {
      const med = medicamentoMap[item.id_medicamento];
      if (!med) continue;
      result.push({
        id: `${f.id}-${item.id_medicamento}`,
        farmaciaId: f.id,
        medicamentoId: item.id_medicamento,
        farmacia: f.nombre_sucursal,
        direccion: f.direccion,
        lat: f.latitud || 4.536,
        lng: f.longitud || -75.674,
        medicamento: `${med.nombre_comercial}${med.concentracion ? " " + med.concentracion : ""}`,
        principioActivo: med.principio_activo,
        stock: item.stock_actual,
        precio: item.precio_unitario,
      });
    }
  }
  return result;
}

function useLanding() {
  const { navigate } = useHashRoute();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [user, setUserState] = useState(getUser);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [reservedIds, setReservedIds] = useState([]);

  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(5);
  const [view, setView] = useState("list"); // "list" | "map"
  const [location, setLocation] = useState({ ...DEFAULT_LOCATION, source: "example" });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ── Datos desde la API ────────────────────────────────────────────────────
  const [farmacias, setFarmacias] = useState([]);
  const [inventarioMap, setInventarioMap] = useState({}); // { farmaciaId: [items] }
  const [medicamentoMap, setMedicamentoMap] = useState({}); // { medId: med }
  const [dataLoading, setDataLoading] = useState(false);

  // Cargar farmacias e inventario al montar
  useEffect(() => {
    let cancelled = false;
    async function cargarDatos() {
      setDataLoading(true);
      try {
        // 1. Obtener farmacias activas
        const resF = await farmaciasApi.listar(true);
        if (cancelled) return;
        const farmaciasData = resF.data || [];
        setFarmacias(farmaciasData);

        // 2. Para cada farmacia obtener su inventario
        const invMap = {};
        const medMap = {};
        await Promise.all(
          farmaciasData.map(async (f) => {
            try {
              const resI = await inventarioApi.listarPorFarmacia(f.id);
              if (cancelled) return;
              const items = resI.data || [];
              invMap[f.id] = items;

              // 3. Cargar datos de cada medicamento (si aún no los tenemos)
              await Promise.all(
                items.map(async (item) => {
                  if (medMap[item.id_medicamento]) return;
                  try {
                    const { default: medicamentosApi } = await import("../../services/api").then(
                      (m) => ({ default: m.medicamentosApi })
                    );
                    const resM = await medicamentosApi.obtener(item.id_medicamento);
                    if (!cancelled) medMap[item.id_medicamento] = resM.data;
                  } catch {/* ignorar errores individuales */}
                })
              );
            } catch {/* ignorar errores por farmacia */}
          })
        );
        if (!cancelled) {
          setInventarioMap(invMap);
          setMedicamentoMap(medMap);
        }
      } catch (err) {
        console.error("Error cargando datos de farmacias:", err);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }
    cargarDatos();
    return () => { cancelled = true; };
  }, []);

  const offers = useMemo(
    () => buildOffers(farmacias, inventarioMap, medicamentoMap),
    [farmacias, inventarioMap, medicamentoMap]
  );

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no permite obtener la ubicación.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, source: "gps" });
          setLocating(false);
        },
        () => {
          setLocationError("No pudimos acceder a tu ubicación. Usa la ubicación de ejemplo o activa el permiso.");
          setLocating(false);
        }
    );
  };

  const useExampleLocation = () => {
    setLocation({ ...DEFAULT_LOCATION, source: "example" });
    setLocationError("");
  };

  const results = useMemo(() => {
    const term = normalize(query.trim());
    if (!term) return [];
    return offers
        .filter(
            (o) =>
                normalize(o.medicamento).includes(term) ||
                normalize(o.principioActivo).includes(term)
        )
        .map((o) => ({ ...o, distancia: distanceKm(location, o) }))
        .filter((o) => o.distancia <= radius)
        .sort((a, b) => a.distancia - b.distancia);
  }, [query, radius, location, offers]);

  const goToAccess = (nextMode) => {
    setMode(nextMode);
    document.getElementById("acceso")?.scrollIntoView({ behavior: "smooth" });
  };

  const enter = useCallback((account) => {
    setUser(account);
    setUserState(account);
    setAuthError("");
    if (account.rol === "administrador" || account.rol === "ADMIN_FARMACIA") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const email = form.get("email").trim().toLowerCase();
    const password = form.get("password");

    setAuthLoading(true);
    setAuthError("");

    try {
      if (mode === "login") {
        // Llamar al backend para verificar el usuario
        const res = await authApi.login(email, password);
        const userData = res.data;
        // Mapear el rol del backend al formato del frontend
        const rolFrontend = userData.rol === "administrador" ? "ADMIN_FARMACIA" : "PACIENTE";
        enter({ ...userData, rol: rolFrontend });
        return;
      }

      // Registro
      if (password !== form.get("password2")) {
        setAuthError("Las contraseñas no coinciden.");
        return;
      }

      const rolLabel = form.get("rol");
      // Convertir la etiqueta visible al valor del backend
      const rolBackend = Object.entries(ROLES).find(([, v]) => v === rolLabel)?.[0]
        ?.toLowerCase() || "paciente";
      const nombre = form.get("nombre");

      const res = await authApi.register({
        nombre_completo: nombre,
        email,
        password,
        rol: rolBackend,
      });
      const userData = res.data;
      const rolFrontend = userData.rol === "administrador" ? "ADMIN_FARMACIA" : "PACIENTE";
      enter({ ...userData, rol: rolFrontend });
    } catch (err) {
      setAuthError(err.message || "Error de conexión con el servidor. Verifica que el backend esté activo.");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    clearUser();
    setUserState(null);
    setReservedIds([]);
  };

  const reserve = (offerId) => {
    if (!user) {
      goToAccess("register");
      return;
    }
    setReservedIds((current) => (current.includes(offerId) ? current : [...current, offerId]));
  };

  const changeMode = (next) => {
    setMode(next);
    setAuthError("");
  };

  return {
    mode, setMode: changeMode, handleSubmit, goToAccess,
    user, authError, authLoading, logout, reserve, reservedIds,
    goToPanel: () => navigate("/dashboard"),
    features, steps, roles,
    query, setQuery, radius, setRadius,
    view, setView,
    location, locating, locationError, requestLocation, useExampleLocation,
    results, dataLoading,
  };
}

export default useLanding;
