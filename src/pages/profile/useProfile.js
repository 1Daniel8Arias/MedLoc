import { useEffect, useState } from "react";
import { getUser, setUser } from "../../services/session";
import { ROLES } from "../../services/users";
import { usuariosApi, farmaciasApi } from "../../services/api";

export const cities = ["Armenia", "Calarcá", "Circasia", "Montenegro", "Quimbaya", "La Tebaida"];

function useProfile() {
  const sessionUser = getUser();
  const isAdmin = ["ADMIN_FARMACIA", "administrador", "admin_farmacia"].includes(sessionUser?.rol);

  const tabs = [
    { id: "datos", label: "Datos personales" },
    ...(isAdmin ? [{ id: "farmacia", label: "Mi farmacia" }] : []),
    { id: "notificaciones", label: "Notificaciones" },
    { id: "seguridad", label: "Seguridad" },
  ];

  const [tab, setTab] = useState("datos");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [personal, setPersonal] = useState({
    nombre: sessionUser?.nombre_completo ?? sessionUser?.nombre ?? "",
    email: sessionUser?.email ?? "",
    ciudad: "Armenia",
  });

  const [pharmacy, setPharmacy] = useState({
    id: sessionUser?.farmacia_id ?? "",
    nombre: sessionUser?.farmacia_nombre ?? "",
    nit: "",
    direccion: "",
    apertura: "07:00",
    cierre: "21:00",
    latitud: "",
    longitud: "",
    activa: true,
  });

  const [notifications, setNotifications] = useState(
    isAdmin
      ? { nuevaReserva: true, stockBajo: true, nuevaResena: true, correo: true }
      : { disponibilidad: true, reservaPorVencer: true, promociones: false, correo: true }
  );

  // ── Cargar datos reales de la farmacia si el usuario es administrador ─────
  useEffect(() => {
    if (!isAdmin || !sessionUser?.farmacia_id) return;
    farmaciasApi.obtener(sessionUser.farmacia_id)
      .then((res) => {
        const f = res.data;
        setPharmacy((c) => ({
          ...c,
          id: f.id,
          nombre: f.nombre_sucursal,
          nit: f.nit,
          direccion: f.direccion,
          apertura: f.hora_apertura ? f.hora_apertura.slice(0, 5) : "",
          cierre: f.hora_cierre ? f.hora_cierre.slice(0, 5) : "",
          latitud: f.latitud ? String(f.latitud) : "",
          longitud: f.longitud ? String(f.longitud) : "",
          activa: f.activa,
        }));
      })
      .catch(() => {/* silencioso si no hay farmacia */});
  }, [isAdmin, sessionUser?.farmacia_id]);

  const updatePersonal = (field) => (event) =>
    setPersonal((c) => ({ ...c, [field]: event.target.value }));

  const updatePharmacy = (field) => (event) =>
    setPharmacy((c) => ({ ...c, [field]: event.target.value }));

  const togglePharmacy = (field) => (value) =>
    setPharmacy((c) => ({ ...c, [field]: value }));

  const toggleNotification = (field) => (value) =>
    setNotifications((c) => ({ ...c, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved("");

    try {
      if (tab === "datos" && sessionUser?.id) {
        // Actualizar nombre del perfil en el backend
        await usuariosApi.actualizar(sessionUser.id, {
          nombre_completo: personal.nombre,
        });
        // Actualizar la sesión local con el nuevo nombre
        setUser({ ...sessionUser, nombre_completo: personal.nombre });
      }

      if (tab === "farmacia" && sessionUser?.id) {
        const pharmacyData = {
          nombre_sucursal: pharmacy.nombre,
          nit: pharmacy.nit,
          direccion: pharmacy.direccion,
          hora_apertura: pharmacy.apertura || null,
          hora_cierre: pharmacy.cierre || null,
          latitud: pharmacy.latitud ? parseFloat(pharmacy.latitud) : null,
          longitud: pharmacy.longitud ? parseFloat(pharmacy.longitud) : null,
          activa: pharmacy.activa,
        };

        let savedPharmacy;
        if (pharmacy.id) {
          const response = await farmaciasApi.actualizar(pharmacy.id, pharmacyData);
          savedPharmacy = response.data;
        } else {
          const response = await farmaciasApi.crear({
            ...pharmacyData,
            id_administrador: sessionUser.id,
          });
          savedPharmacy = response.data;
        }

        setPharmacy((current) => ({
          ...current,
          id: savedPharmacy.id,
          nombre: savedPharmacy.nombre_sucursal,
          nit: savedPharmacy.nit,
          direccion: savedPharmacy.direccion,
          apertura: savedPharmacy.hora_apertura ? savedPharmacy.hora_apertura.slice(0, 5) : "",
          cierre: savedPharmacy.hora_cierre ? savedPharmacy.hora_cierre.slice(0, 5) : "",
          latitud: savedPharmacy.latitud ? String(savedPharmacy.latitud) : "",
          longitud: savedPharmacy.longitud ? String(savedPharmacy.longitud) : "",
          activa: savedPharmacy.activa,
        }));
        setUser({
          ...sessionUser,
          farmacia_id: savedPharmacy.id,
          farmacia_nombre: savedPharmacy.nombre_sucursal,
        });
      }

      setSaved("Cambios guardados correctamente.");
      setTimeout(() => setSaved(""), 3000);
    } catch (err) {
      setSaveError(err.message || "Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return {
    user: sessionUser,
    isAdmin,
    roleLabel: ROLES[sessionUser?.rol] || ROLES[sessionUser?.rol?.toUpperCase()] || sessionUser?.rol,
    tabs, tab, setTab,
    personal, updatePersonal,
    pharmacy, updatePharmacy, togglePharmacy,
    notifications, toggleNotification,
    saved, saving, saveError, save,
  };
}

export default useProfile;
