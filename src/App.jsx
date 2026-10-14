import useHashRoute from "./hooks/useHashRoute";
import Landing from "./pages/landing/Landing";
import Dashboard from "./pages/dashboard/Dashboard";
import Inventory from "./pages/inventory/Inventory";
import Sales from "./pages/sales/Sales";
import Reservations from "./pages/reservations/Reservations";

const routes = {
  "/": Landing,
  "/dashboard": Dashboard,
  "/inventario": Inventory,
  "/ventas": Sales,
  "/reservas": Reservations,
};

function App() {
  const { route } = useHashRoute();
  const Page = routes[route] ?? Landing;

  return <Page />;
}

export default App;
