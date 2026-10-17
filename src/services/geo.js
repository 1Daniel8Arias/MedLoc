// Ubicación de ejemplo por defecto (Bogotá donde está Farmacia Salud Norte o Armenia)
export const DEFAULT_LOCATION = { lat: 4.7110, lng: -74.0721, label: "Bogotá", source: "preset" };

export const CITIES_PRESETS = [
  { id: "bogota", label: "Bogotá", lat: 4.7110, lng: -74.0721 },
  { id: "medellin", label: "Medellín", lat: 6.2442, lng: -75.5812 },
  { id: "armenia", label: "Armenia", lat: 4.5339, lng: -75.6811 },
];

export function distanceKm(a, b) {
  if (!a || !b || a.lat == null || a.lng == null || b.lat == null || b.lng == null) return 0;
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(Number(b.lat) - Number(a.lat));
  const dLng = toRad(Number(b.lng) - Number(a.lng));
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(Number(a.lat))) * Math.cos(toRad(Number(b.lat))) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km) {
  if (km == null || isNaN(km)) return "0 km";
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
