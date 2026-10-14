import { useState } from "react";

const initialFavorites = [
  { id: 1, medicamento: "Amoxicilina 500mg", principioActivo: "Amoxicilina", disponibilidad: "Agotado en tu zona", disponible: false, alerta: true },
  { id: 2, medicamento: "Losartán 50mg", principioActivo: "Losartán potásico", disponibilidad: "Disponible en 3 droguerías", disponible: true, alerta: false },
  { id: 3, medicamento: "Metformina 850mg", principioActivo: "Metformina", disponibilidad: "Disponible en 1 droguería", disponible: true, alerta: true },
];

function useFavorites() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [newName, setNewName] = useState("");

  const addFavorite = (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setFavorites((current) => [
      ...current,
      { id: Date.now(), medicamento: name, principioActivo: "—", disponibilidad: "Consultando disponibilidad…", disponible: false, alerta: true },
    ]);
    setNewName("");
  };

  const toggleAlert = (id) => (value) =>
    setFavorites((current) => current.map((f) => (f.id === id ? { ...f, alerta: value } : f)));

  const removeFavorite = (id) => setFavorites((current) => current.filter((f) => f.id !== id));

  return { favorites, newName, setNewName, addFavorite, toggleAlert, removeFavorite };
}

export default useFavorites;
