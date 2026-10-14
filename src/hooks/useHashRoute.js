import { useEffect, useState } from "react";

const getRoute = () => window.location.hash.replace("#", "") || "/";

function useHashRoute() {
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  return { route, navigate };
}

export default useHashRoute;
