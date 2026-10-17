import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MedMap.css";
import { formatCurrency } from "../../services/formatters";
import { formatDistance } from "../../services/geo";

function MedMap({ center, radiusKm, pharmacies = [], onSelectPharmacy, selectedPharmacyId }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current).setView([center.lat, center.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    // 1. Círculo de radio si es finito (< 1000 km)
    if (radiusKm && radiusKm < 1000) {
      L.circle([center.lat, center.lng], {
        radius: radiusKm * 1000,
        color: "#2563eb",
        weight: 1.5,
        fillColor: "#3b82f6",
        fillOpacity: 0.08,
        dashArray: "5, 5",
      }).addTo(layer);
    }

    // 2. Marcador del usuario / centro de búsqueda
    const userLabel = center.label ? `Ubicación: ${center.label}` : "Tu ubicación de búsqueda";
    L.marker([center.lat, center.lng], {
      icon: L.divIcon({ className: "medmap__user", iconSize: [20, 20] }),
    })
      .bindPopup(`<div class="medmap__user-popup"><strong>📍 ${userLabel}</strong></div>`)
      .addTo(layer);

    // 3. Marcador para cada farmacia
    pharmacies.forEach((p) => {
      if (p.lat == null || p.lng == null) return;
      const isSelected = selectedPharmacyId === p.id;
      const markerIcon = L.divIcon({
        className: `medmap__pin ${isSelected ? "medmap__pin--selected" : ""}`,
        html: `<span>✚</span>`,
        iconSize: isSelected ? [36, 36] : [30, 30],
      });

      const prodsList = (p.productos || [])
        .slice(0, 4)
        .map(
          (prod) =>
            `<li class="medmap__popup-prod">
              <span class="medmap__popup-prod-name">${prod.medicamento}</span>
              <span class="medmap__popup-prod-meta">${formatCurrency(prod.precio)} · <strong>${prod.stock} disp.</strong></span>
            </li>`
        )
        .join("");

      const extraCount = (p.productos || []).length > 4 ? `+ ${(p.productos || []).length - 4} más...` : "";

      const popupHtml = `
        <div class="medmap__popup">
          <div class="medmap__popup-header">
            <h4>${p.nombre}</h4>
            <span class="medmap__popup-dist">${formatDistance(p.distancia)}</span>
          </div>
          <p class="medmap__popup-addr">📍 ${p.direccion || "Dirección no registrada"}</p>
          <div class="medmap__popup-products">
            <span class="medmap__popup-prod-title">Productos en existencias (${(p.productos || []).length}):</span>
            <ul>${prodsList || "<li>No hay productos en stock</li>"}</ul>
            ${extraCount ? `<small class="medmap__popup-extra">${extraCount}</small>` : ""}
          </div>
          <button class="medmap__popup-btn" id="btn-popup-${p.id}">
            Ver droguería y productos ➔
          </button>
        </div>
      `;

      const m = L.marker([p.lat, p.lng], { icon: markerIcon })
        .bindPopup(popupHtml, { minWidth: 260, maxWidth: 320 })
        .addTo(layer);

      m.on("click", () => {
        if (onSelectPharmacy) onSelectPharmacy(p);
      });

      m.on("popupopen", () => {
        const btn = document.getElementById(`btn-popup-${p.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectPharmacy) onSelectPharmacy(p);
          };
        }
      });
    });

    // 4. Ajustar encuadre de la vista
    const validPoints = [
      [center.lat, center.lng],
      ...pharmacies.filter((p) => p.lat != null && p.lng != null).map((p) => [p.lat, p.lng]),
    ];

    if (validPoints.length > 1) {
      map.fitBounds(validPoints, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView([center.lat, center.lng], 13);
    }
  }, [center, radiusKm, pharmacies, selectedPharmacyId, onSelectPharmacy]);

  return <div ref={containerRef} className="medmap" />;
}

export default MedMap;
