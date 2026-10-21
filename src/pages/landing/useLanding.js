import { useCallback, useEffect, useMemo, useState } from "react";
import useHashRoute from "../../hooks/useHashRoute";
import { DEFAULT_LOCATION, CITIES_PRESETS, distanceKm } from "../../services/geo";
import { getUser, setUser, clearUser } from "../../services/session";
import { authApi, inventarioApi, farmaciasApi, medicamentosApi } from "../../services/api";
import { ROLES } from "../../services/users";

const features = [
  { id: 1, title: "Búsqueda por cercanía", description: "Encuentra tu medicamento por nombre comercial o principio activo y mira primero las droguerías más cercanas." },
  { id: 2, title: "Stock en tiempo real", description: "Consulta cuántas unidades quedan antes de salir de casa, sin llamadas ni recorridos innecesarios." },
  { id: 3, title: "Reserva con código", description: "Aparta tu medicamento por 2 horas y recógelo en la droguería con un código de retiro." },
];

const steps = [
  { id: 1, title: "Busca o explora", description: "Consulta el catálogo completo de medicamentos o escribe el que necesitas." },
  { id: 2, title: "Compara", description: "Revisa droguería, distancia, precio y unidades disponibles en existencias." },
  { id: 3, title: "Reserva", description: "Aparta el producto y recibe tu código de retiro." },
  { id: 4, title: "Recoge", description: "Presenta el código en la droguería y listo." },
];

const roles = Object.values(ROLES);

export const radiusOptions = [
  { value: 5, label: "5 km (muy cerca)" },
  { value: 10, label: "10 km (en mi zona)" },
  { value: 25, label: "25 km (mi ciudad)" },
  { value: 50, label: "50 km (área metropolitana)" },
  { value: 100, label: "100 km (ciudades vecinas)" },
  { value: 250, label: "250 km (región)" },
  { value: 1000, label: "Todas las distancias (sin límite)" },
];

export const suggestions = ["Acetaminofén", "Advil", "Amoxidal", "Clarityne", "Omeprazol"];

const normalize = (text) =>
    (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const isAdminRole = (role) =>
  role === "administrador" || role === "admin_farmacia" || role === "ADMIN_FARMACIA";

/**
 * Construye la lista de ofertas aplanando el inventario de todas las farmacias y el catálogo.
 */
function buildOffers(farmacias, inventarioMap, medicamentoMap, allMeds = []) {
  const result = [];
  const coveredMedIds = new Set();

  for (const f of farmacias) {
    const items = inventarioMap[f.id] || [];
    for (const item of items) {
      const med = medicamentoMap[item.id_medicamento];
      if (!med) continue;
      coveredMedIds.add(item.id_medicamento);
      result.push({
        id: `${f.id}-${item.id_medicamento}`,
        farmaciaId: f.id,
        medicamentoId: item.id_medicamento,
        farmacia: f.nombre_sucursal,
        direccion: f.direccion,
        nit: f.nit,
        lat: Number(f.latitud) || 4.536,
        lng: Number(f.longitud) || -75.674,
        medicamento: `${med.nombre_comercial}${med.concentracion ? " " + med.concentracion : ""}`,
        nombreComercial: med.nombre_comercial,
        principioActivo: med.principio_activo,
        presentacion: med.presentacion,
        laboratorio: med.laboratorio,
        stock: item.stock_actual,
        precio: Number(item.precio_unitario),
      });
    }
  }

  // Medicamentos del catálogo que aún no tengan inventario asignado
  for (const med of allMeds) {
    if (!coveredMedIds.has(med.id)) {
      result.push({
        id: `med-${med.id}`,
        farmaciaId: null,
        medicamentoId: med.id,
        farmacia: "Consultar droguería",
        direccion: "Catálogo general",
        nit: "",
        lat: 4.536,
        lng: -75.674,
        medicamento: `${med.nombre_comercial}${med.concentracion ? " " + med.concentracion : ""}`,
        nombreComercial: med.nombre_comercial,
        principioActivo: med.principio_activo,
        presentacion: med.presentacion,
        laboratorio: med.laboratorio,
        stock: 0,
        precio: 0,
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
  const [radius, setRadius] = useState(1000); // 1000 = sin límite por defecto para mostrar el catálogo completo
  const [view, setView] = useState("list"); // "list" | "map"
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Farmacia seleccionada para ver su detalle y lista de productos
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  // ── Datos desde la API ────────────────────────────────────────────────────
  const [farmacias, setFarmacias] = useState([]);
  const [allMedicamentos, setAllMedicamentos] = useState([]);
  const [inventarioMap, setInventarioMap] = useState({}); // { farmaciaId: [items] }
  const [medicamentoMap, setMedicamentoMap] = useState({}); // { medId: med }
  const [dataLoading, setDataLoading] = useState(false);

  // Cargar farmacias, catálogo completo e inventario al montar
  useEffect(() => {
    let cancelled = false;
    async function cargarDatos() {
      setDataLoading(true);
      try {
        const [resF, resM] = await Promise.all([
          farmaciasApi.listar(true),
          medicamentosApi.listar(),
        ]);
        if (cancelled) return;

        const farmaciasData = resF.data || [];
        const medsData = resM.data || [];
        setFarmacias(farmaciasData);
        setAllMedicamentos(medsData);

        const medMap = {};
        for (const m of medsData) {
          medMap[m.id] = m;
        }
        setMedicamentoMap(medMap);

        const invMap = {};
        await Promise.all(
          farmaciasData.map(async (f) => {
            try {
              const resI = await inventarioApi.listarPorFarmacia(f.id);
              if (cancelled) return;
              invMap[f.id] = resI.data || [];
            } catch {
              // Continuar con las demás farmacias si una falla
            }
          })
        );

        if (!cancelled) {
          setInventarioMap(invMap);
        }
      } catch (err) {
        console.error("Error cargando datos de farmacias y medicamentos:", err);
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    }
    cargarDatos();
    return () => { cancelled = true; };
  }, []);

  const offers = useMemo(
    () => buildOffers(farmacias, inventarioMap, medicamentoMap, allMedicamentos),
    [farmacias, inventarioMap, medicamentoMap, allMedicamentos]
  );

  // Construye la lista de farmacias con su catálogo completo de productos e inventario
  const pharmaciesWithInventory = useMemo(() => {
    return farmacias.map((f) => {
      const items = inventarioMap[f.id] || [];
      const dist = distanceKm(location, {
        lat: Number(f.latitud) || 4.536,
        lng: Number(f.longitud) || -75.674,
      });

      const productos = items.map((item) => {
        const med = medicamentoMap[item.id_medicamento] || {};
        return {
          id: item.id_medicamento,
          medicamento: `${med.nombre_comercial || "Medicamento"}${med.concentracion ? " " + med.concentracion : ""}`,
          nombreComercial: med.nombre_comercial || "",
          principioActivo: med.principio_activo || "",
          presentacion: med.presentacion || "",
          laboratorio: med.laboratorio || "",
          stock: item.stock_actual,
          precio: Number(item.precio_unitario),
        };
      });

      return {
        id: f.id,
        nombre: f.nombre_sucursal,
        nit: f.nit,
        direccion: f.direccion,
        lat: Number(f.latitud) || 4.536,
        lng: Number(f.longitud) || -75.674,
        distancia: dist,
        productos,
        totalProductos: productos.length,
      };
    }).sort((a, b) => a.distancia - b.distancia);
  }, [farmacias, inventarioMap, medicamentoMap, location]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no permite obtener la ubicación.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            source: "gps",
            label: "Mi ubicación GPS",
          });
          setLocating(false);
        },
        () => {
          setLocationError("No pudimos acceder a tu GPS. Selecciona una ciudad de referencia.");
          setLocating(false);
        }
    );
  };

  const selectCityPreset = (city) => {
    setLocation({
      lat: city.lat,
      lng: city.lng,
      source: "preset",
      label: city.label,
    });
    setLocationError("");
  };

  // ── FILTRADO ESTRICTO POR DISTANCIA Y POR TÉRMINO DE BÚSQUEDA ──────────────
  const results = useMemo(() => {
    const term = normalize(query.trim());
    const isUnlimited = radius >= 1000 || radius === "all";

    // 1. Calculamos la distancia para cada oferta según la ubicación actual/elegida
    const withDistance = offers.map((o) => ({
      ...o,
      distancia: distanceKm(location, o),
    }));

    // 2. Filtramos de acuerdo a la distancia seleccionada
    let filtered = withDistance;
    if (!isUnlimited && radius > 0) {
      filtered = filtered.filter((o) => o.distancia <= radius);
    }

    // 3. Filtramos por término de búsqueda (si el usuario escribió algo)
    if (term) {
      filtered = filtered.filter(
        (o) =>
          normalize(o.medicamento).includes(term) ||
          normalize(o.principioActivo).includes(term) ||
          normalize(o.laboratorio).includes(term) ||
          normalize(o.farmacia).includes(term)
      );
    }

    return filtered.sort((a, b) => a.distancia - b.distancia);
  }, [query, radius, location, offers]);

  // Farmacias a mostrar en el mapa (filtradas por el radio de distancia)
  const mapPharmacies = useMemo(() => {
    const isUnlimited = radius >= 1000 || radius === "all";
    if (isUnlimited) return pharmaciesWithInventory;
    return pharmaciesWithInventory.filter((f) => f.distancia <= radius);
  }, [pharmaciesWithInventory, radius]);

  const goToAccess = (nextMode) => {
    setMode(nextMode);
    setAuthError("");
    document.getElementById("acceso")?.scrollIntoView({ behavior: "smooth" });
  };

  const enter = useCallback((account) => {
    setUser(account);
    setUserState(account);
    setAuthError("");
    if (isAdminRole(account.rol)) {
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
        const res = await authApi.login(email, password);
        const userData = res.data;
        const rolFrontend = isAdminRole(userData.rol) ? "ADMIN_FARMACIA" : "PACIENTE";
        enter({ ...userData, rol: rolFrontend });
        return;
      }

      // Registro
      if (password !== form.get("password2")) {
        setAuthError("Las contraseñas no coinciden.");
        return;
      }

      const rolLabel = form.get("rol");
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
      const rolFrontend = isAdminRole(userData.rol) ? "ADMIN_FARMACIA" : "PACIENTE";
      enter({ ...userData, rol: rolFrontend });
    } catch (err) {
      setAuthError(err.message || "Correo o contraseña incorrectos.");
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
    location, locating, locationError, requestLocation, selectCityPreset,
    citiesPresets: CITIES_PRESETS,
    results, dataLoading,
    pharmaciesWithInventory, mapPharmacies,
    selectedPharmacy, setSelectedPharmacy,
  };
}

export default useLanding;
