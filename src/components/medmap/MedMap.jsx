import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MedMap.css";

// markers: [{ id, lat, lng, title, subtitle }]
function MedMap({ center, radiusKm, markers }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const map = L.map(containerRef.current).setView([center.lat, center.lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    layer.clearLayers();

    L.circle([center.lat, center.lng], {
      radius: radiusKm * 1000,
      color: "#2563eb",
      weight: 1,
      fillOpacity: 0.06,
    }).addTo(layer);

    L.marker([center.lat, center.lng], {
      icon: L.divIcon({ className: "medmap__user", iconSize: [18, 18] }),
    })
      .bindPopup("Tu ubicación")
      .addTo(layer);

    markers.forEach((m) => {
      L.marker([m.lat, m.lng], {
        icon: L.divIcon({ className: "medmap__pin", html: "✚", iconSize: [30, 30] }),
      })
        .bindPopup(`<strong>${m.title}</strong><br/>${m.subtitle}`)
        .addTo(layer);
    });

    const points = [[center.lat, center.lng], ...markers.map((m) => [m.lat, m.lng])];
    if (points.length > 1) map.fitBounds(points, { padding: [40, 40], maxZoom: 15 });
    else map.setView([center.lat, center.lng], 14);
  }, [center, radiusKm, markers]);

  return <div ref={containerRef} className="medmap" />;
}

export default MedMap;
