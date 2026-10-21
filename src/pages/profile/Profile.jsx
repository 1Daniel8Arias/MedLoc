import "./Profile.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Button from "../../components/button/Button";
import Tabs from "../../components/tabs/Tabs";
import Toggle from "../../components/toggle/Toggle";
import FormField from "../../components/formfield/FormField";
import useProfile, { cities } from "./useProfile";

function Profile() {
  const {
    user, isAdmin, roleLabel, tabs, tab, setTab,
    personal, updatePersonal, pharmacy, updatePharmacy, togglePharmacy,
    notifications, toggleNotification, saved, save,
  } = useProfile();

  return (
    <div className="profile">
      <Sidebar />

      <div className="profile__main">
        <Header titulo="Mi perfil" />

        <main className="profile__content">
          <aside className="profile__card">
            <div className="profile__avatar">{personal.nombre.charAt(0).toUpperCase()}</div>
            <h2>{personal.nombre}</h2>
            <p>{roleLabel}</p>
            {user?.farmacia && <p className="profile__pharmacy">{user.farmacia}</p>}
            <Button variant="secondary" size="sm">Cambiar foto</Button>
            <small>Miembro desde septiembre de 2026</small>
          </aside>

          <section className="profile__panel">
            <Tabs tabs={tabs} active={tab} onChange={setTab} />

            <form className="profile__form" onSubmit={save}>
              {tab === "datos" && (
                <>
                  <div className="profile__row">
                    <FormField id="nombre" label="Nombre completo" value={personal.nombre} onChange={updatePersonal("nombre")} required />
                    <FormField id="email" label="Correo electrónico" type="email" value={personal.email} onChange={updatePersonal("email")} required />
                  </div>
                  <div className="profile__row">
                    <FormField id="ciudad" label="Ciudad" options={cities} value={personal.ciudad} onChange={updatePersonal("ciudad")} />
                  </div>
                </>
              )}

              {tab === "farmacia" && isAdmin && (
                <>
                  <div className="profile__row">
                    <FormField id="f-nombre" label="Nombre de la sucursal" value={pharmacy.nombre} onChange={updatePharmacy("nombre")} required />
                    <FormField id="f-nit" label="NIT" value={pharmacy.nit} onChange={updatePharmacy("nit")} required />
                  </div>
                  <div className="profile__row">
                    <FormField id="f-direccion" label="Dirección" value={pharmacy.direccion} onChange={updatePharmacy("direccion")} required />
                    <FormField id="f-apertura" label="Hora de apertura" type="time" value={pharmacy.apertura} onChange={updatePharmacy("apertura")} />
                  </div>
                  <div className="profile__row">
                    <FormField id="f-cierre" label="Hora de cierre" type="time" value={pharmacy.cierre} onChange={updatePharmacy("cierre")} />
                  </div>
                  <div className="profile__row">
                    <FormField id="f-lat" label="Latitud" value={pharmacy.latitud} onChange={updatePharmacy("latitud")} hint="Se usa para calcular la distancia a los pacientes." />
                    <FormField id="f-lng" label="Longitud" value={pharmacy.longitud} onChange={updatePharmacy("longitud")} />
                  </div>
                  <div className="profile__toggles">
                    <Toggle label="Droguería activa" description="Si la desactivas, no aparecerá en las búsquedas." checked={pharmacy.activa} onChange={togglePharmacy("activa")} />
                  </div>
                </>
              )}

              {tab === "notificaciones" && (
                <div className="profile__toggles">
                  {isAdmin ? (
                    <>
                      <Toggle label="Nueva reserva" description="Avísame cuando un paciente aparte un medicamento." checked={notifications.nuevaReserva} onChange={toggleNotification("nuevaReserva")} />
                      <Toggle label="Stock bajo" description="Avísame cuando un producto baje del mínimo." checked={notifications.stockBajo} onChange={toggleNotification("stockBajo")} />
                      <Toggle label="Nueva reseña" description="Avísame cuando alguien califique mi droguería." checked={notifications.nuevaResena} onChange={toggleNotification("nuevaResena")} />
                    </>
                  ) : (
                    <>
                      <Toggle label="Medicamento disponible" description="Avísame cuando un favorito vuelva a estar disponible." checked={notifications.disponibilidad} onChange={toggleNotification("disponibilidad")} />
                      <Toggle label="Reserva por vencer" description="Recordarme antes de que se cumplan las 2 horas." checked={notifications.reservaPorVencer} onChange={toggleNotification("reservaPorVencer")} />
                      <Toggle label="Novedades de MedLoc" description="Información sobre nuevas droguerías en mi zona." checked={notifications.promociones} onChange={toggleNotification("promociones")} />
                    </>
                  )}
                  <Toggle label="Recibir también por correo" checked={notifications.correo} onChange={toggleNotification("correo")} />
                </div>
              )}

              {tab === "seguridad" && (
                <>
                  <FormField id="actual" label="Contraseña actual" type="password" />
                  <div className="profile__row">
                    <FormField id="nueva" label="Nueva contraseña" type="password" hint="Mínimo 8 caracteres, con letras y números." />
                    <FormField id="confirmar" label="Confirmar nueva contraseña" type="password" />
                  </div>
                  <div className="profile__danger">
                    <div>
                      <strong>Eliminar mi cuenta</strong>
                      <span>Se borrarán tus datos personales y tu historial. Esta acción no se puede deshacer.</span>
                    </div>
                    <Button variant="danger" size="sm">Eliminar cuenta</Button>
                  </div>
                </>
              )}

              <div className="profile__actions">
                <Button type="submit">Guardar cambios</Button>
                {saved && <span className="profile__saved" role="status">{saved}</span>}
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Profile;
