import { useState } from "react";
import { getUser } from "../../services/session";
import { ROLES } from "../../services/users";

export const cities = ["Armenia", "Calarcá", "Circasia", "Montenegro", "Quimbaya", "La Tebaida"];

function useProfile() {
  const user = getUser();
  const isAdmin = user?.rol === "ADMIN_FARMACIA";

  const tabs = [
    { id: "datos", label: "Datos personales" },
    ...(isAdmin ? [{ id: "farmacia", label: "Mi farmacia" }] : []),
    { id: "notificaciones", label: "Notificaciones" },
    { id: "seguridad", label: "Seguridad" },
  ];

  const [tab, setTab] = useState("datos");
  const [saved, setSaved] = useState("");

  const [personal, setPersonal] = useState({
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    telefono: "310 456 7890",
    ciudad: "Armenia",
  });

  const [pharmacy, setPharmacy] = useState({
    nombre: user?.farmacia ?? "Droguería La Esperanza",
    nit: "900.123.456-7",
    direccion: "Cra 14 # 12-30, Armenia",
    telefono: "606 741 2020",
    apertura: "07:00",
    cierre: "21:00",
    latitud: "4.5360",
    longitud: "-75.6740",
    activa: true,
    domicilio: true,
  });

  const [notifications, setNotifications] = useState(
    isAdmin
      ? { nuevaReserva: true, stockBajo: true, nuevaResena: true, correo: true }
      : { disponibilidad: true, reservaPorVencer: true, promociones: false, correo: true }
  );

  const updatePersonal = (field) => (event) => setPersonal((c) => ({ ...c, [field]: event.target.value }));
  const updatePharmacy = (field) => (event) => setPharmacy((c) => ({ ...c, [field]: event.target.value }));
  const togglePharmacy = (field) => (value) => setPharmacy((c) => ({ ...c, [field]: value }));
  const toggleNotification = (field) => (value) => setNotifications((c) => ({ ...c, [field]: value }));

  const save = (event) => {
    event.preventDefault();
    setSaved("Cambios guardados.");
    setTimeout(() => setSaved(""), 3000);
  };

  return {
    user, isAdmin, roleLabel: ROLES[user?.rol],
    tabs, tab, setTab,
    personal, updatePersonal,
    pharmacy, updatePharmacy, togglePharmacy,
    notifications, toggleNotification,
    saved, save,
  };
}

export default useProfile;
