import { useEffect } from "react";
import useHashRoute from "./hooks/useHashRoute";
import { getUser, homeFor } from "./services/session";
import Landing from "./pages/landing/Landing";
import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/inventory/Inventory";
import Sales from "./pages/sales/Sales";
import Reservations from "./pages/reservations/Reservations";
import Reviews from "./pages/reviews/Reviews";
import Profile from "./pages/profile/Profile";
import MyReservations from "./pages/myreservations/MyReservations";
import Favorites from "./pages/favorites/Favorites";

const ADMIN = ["admin_farmacia", "administrador"];
const PATIENT = ["paciente"];
const ANY = [...ADMIN, ...PATIENT];

// roles: quién puede entrar (null = público)
const routes = {
  "/": { Page: Landing, roles: null },
  "/dashboard": { Page: Dashboard, roles: ADMIN },
  "/inventario": { Page: Inventory, roles: ADMIN },
  "/ventas": { Page: Sales, roles: ADMIN },
  "/reservas": { Page: Reservations, roles: ADMIN },
  "/calificaciones": { Page: Reviews, roles: ADMIN },
  "/mis-reservas": { Page: MyReservations, roles: PATIENT },
  "/favoritos": { Page: Favorites, roles: PATIENT },
  "/perfil": { Page: Profile, roles: ANY },
};

function App() {
  const { route, navigate } = useHashRoute();
  const entry = routes[route] ?? routes["/"];
  const user = getUser();
  const normalizedRole = user?.rol?.toLowerCase();
  const allowed = !entry.roles || (user && entry.roles.includes(normalizedRole));

  useEffect(() => {
    if (!allowed) navigate(user ? homeFor(user.rol) : "/");
  }, [allowed]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!allowed) return null;
  const { Page } = entry;
  return <Page />;
}

export default App;
