// Sesión en memoria: se conserva al navegar entre páginas, se pierde al recargar.
let currentUser = null;

export const getUser = () => currentUser;
export const setUser = (user) => { currentUser = user; };
export const clearUser = () => { currentUser = null; };
