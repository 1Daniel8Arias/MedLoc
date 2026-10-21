// Sesión guardada en sessionStorage: sobrevive a recargas, se borra al cerrar la pestaña.
const KEY = "medloc_user";

export const getUser = () => {
    try {
        const raw = sessionStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const setUser = (user) => {
    const safeUser = { ...user };
    delete safeUser.password; // nunca guardar la contraseña
    try {
        sessionStorage.setItem(KEY, JSON.stringify(safeUser));
    } catch {
        /* sin almacenamiento disponible */
    }
};

export const clearUser = () => {
    try {
        sessionStorage.removeItem(KEY);
    } catch {
        /* nada que limpiar */
    }
};

export const homeFor = (rol) =>
    ["administrador", "admin_farmacia"].includes(rol?.toLowerCase())
        ? "/dashboard"
        : "/";
