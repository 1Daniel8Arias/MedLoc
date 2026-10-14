import { useMemo, useState } from "react";
import useHashRoute from "../../hooks/useHashRoute";
import { DEFAULT_LOCATION, distanceKm } from "../../services/geo";

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

const roles = ["Paciente / Cliente", "Administrador de farmacia"];
export const radiusOptions = [2, 5, 10];
export const suggestions = ["Acetaminofén", "Ibuprofeno", "Losartán", "Omeprazol"];

// Datos quemados: cada oferta = un medicamento disponible en una droguería.
const offers = [
  { id: 1, farmacia: "Droguería La Esperanza", direccion: "Cra 14 # 12-30, Armenia", telefono: "606 741 2020", lat: 4.5360, lng: -75.6740, medicamento: "Acetaminofén 500mg", principioActivo: "Acetaminofén", stock: 48, precio: 3200 },
  { id: 2, farmacia: "Droguería La Esperanza", direccion: "Cra 14 # 12-30, Armenia", telefono: "606 741 2020", lat: 4.5360, lng: -75.6740, medicamento: "Ibuprofeno 400mg", principioActivo: "Ibuprofeno", stock: 4, precio: 5200 },
  { id: 3, farmacia: "Farma Salud Centenario", direccion: "Av. Bolívar # 21-45, Armenia", telefono: "606 745 3311", lat: 4.5473, lng: -75.6735, medicamento: "Acetaminofén 500mg", principioActivo: "Acetaminofén", stock: 20, precio: 3500 },
  { id: 4, farmacia: "Farma Salud Centenario", direccion: "Av. Bolívar # 21-45, Armenia", telefono: "606 745 3311", lat: 4.5473, lng: -75.6735, medicamento: "Losartán 50mg", principioActivo: "Losartán potásico", stock: 8, precio: 9200 },
  { id: 5, farmacia: "Droguería Quindío Plus", direccion: "Cl 2 Sur # 18-10, Armenia", telefono: "606 749 1200", lat: 4.5170, lng: -75.6830, medicamento: "Omeprazol 20mg", principioActivo: "Omeprazol", stock: 16, precio: 4500 },
  { id: 6, farmacia: "Droguería Quindío Plus", direccion: "Cl 2 Sur # 18-10, Armenia", telefono: "606 749 1200", lat: 4.5170, lng: -75.6830, medicamento: "Ibuprofeno 400mg", principioActivo: "Ibuprofeno", stock: 12, precio: 5000 },
  { id: 7, farmacia: "Droguería San Rafael", direccion: "Cra 25 # 38-12, Calarcá", telefono: "606 742 8890", lat: 4.5300, lng: -75.6420, medicamento: "Losartán 50mg", principioActivo: "Losartán potásico", stock: 15, precio: 8900 },
  { id: 8, farmacia: "Droguería San Rafael", direccion: "Cra 25 # 38-12, Calarcá", telefono: "606 742 8890", lat: 4.5300, lng: -75.6420, medicamento: "Acetaminofén 500mg", principioActivo: "Acetaminofén", stock: 33, precio: 3000 },
  { id: 9, farmacia: "Botica del Parque", direccion: "Cl 40 # 24-05, Calarcá", telefono: "606 742 1005", lat: 4.5262, lng: -75.6455, medicamento: "Omeprazol 20mg", principioActivo: "Omeprazol", stock: 3, precio: 4800 },
  { id: 10, farmacia: "Farmacia Vida Circasia", direccion: "Cra 14 # 6-20, Circasia", telefono: "606 747 5566", lat: 4.6180, lng: -75.6350, medicamento: "Losartán 50mg", principioActivo: "Losartán potásico", stock: 25, precio: 8700 },
];

const normalize = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function useLanding() {
  const { navigate } = useHashRoute();
  const [mode, setMode] = useState("login"); // "login" | "register"

  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(5);
  const [view, setView] = useState("list"); // "list" | "map"
  const [location, setLocation] = useState({ ...DEFAULT_LOCATION, source: "example" });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

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
  }, [query, radius, location]);

  const goToAccess = (nextMode) => {
    setMode(nextMode);
    document.getElementById("acceso")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard"); // sin lógica de negocio todavía
  };

  return {
    mode, setMode, handleSubmit, goToAccess,
    features, steps, roles,
    query, setQuery, radius, setRadius,
    view, setView,
    location, locating, locationError, requestLocation, useExampleLocation,
    results,
  };
}

export default useLanding;
