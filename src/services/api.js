/**
 * MedLoc - Cliente API centralizado
 * Todas las llamadas al backend Flask pasan por aquí.
 * El proxy de desarrollo o nginx redirige /api al backend.
 */

const BASE = "/api/v1";

// ── Utilidad de fetch ─────────────────────────────────────────────────────────

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== null) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    // El backend devuelve: { status: "error", message: "...", errors: {...} }
    const errDetail = json?.errors
      ? Object.values(json.errors).join(" | ")
      : null;
    const msg = errDetail || json?.message || `Error ${res.status}: ${res.statusText}`;
    throw new Error(msg);
  }
  return json;
}

const get = (path) => request("GET", path);
const post = (path, body) => request("POST", path, body);
const patch = (path, body) => request("PATCH", path, body);
const del = (path) => request("DELETE", path);

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * Verifica credenciales y obtiene el perfil del usuario.
   * @param {string} email
   * @param {string} password
   */
  login: (email, password) =>
    post("/auth/login", { email, password }),

  /**
   * Registra un nuevo usuario en la BD.
   * @param {{ nombre_completo: string, email: string, rol: string }} datos
   */
  register: (datos) =>
    post("/auth/register", datos),

  /**
   * Obtiene el perfil completo por email (para sincronizar sesión).
   * @param {string} email
   */
  me: (email) =>
    get(`/auth/me?email=${encodeURIComponent(email)}`),
};

// ── Farmacias ─────────────────────────────────────────────────────────────────

export const farmaciasApi = {
  /** Lista todas las farmacias. Con activas=true filtra solo las activas. */
  listar: (soloActivas = false) =>
    get(`/farmacias/?activas=${soloActivas}`),

  /** Obtiene el detalle de una farmacia por UUID. */
  obtener: (id) =>
    get(`/farmacias/${id}`),

  /** Crea una nueva farmacia. */
  crear: (datos) =>
    post("/farmacias/", datos),

  /** Actualiza los datos de una farmacia. */
  actualizar: (id, datos) =>
    patch(`/farmacias/${id}`, datos),
};

// ── Medicamentos ──────────────────────────────────────────────────────────────

export const medicamentosApi = {
  /** Lista todos los medicamentos. Con q= filtra por nombre/principio activo. */
  listar: (q = "") =>
    get(`/medicamentos/?q=${encodeURIComponent(q)}`),

  /** Obtiene un medicamento por UUID. */
  obtener: (id) =>
    get(`/medicamentos/${id}`),

  /** Agrega un medicamento al catálogo. */
  crear: (datos) =>
    post("/medicamentos/", datos),

  /** Actualiza datos del catálogo de un medicamento. */
  actualizar: (id, datos) =>
    patch(`/medicamentos/${id}`, datos),
};

// ── Reservas ──────────────────────────────────────────────────────────────────

export const reservasApi = {
  crear: (datos) => post("/reservas/", datos),
  listarPorFarmacia: (farmaciaId) =>
    get(`/reservas/?farmacia_id=${encodeURIComponent(farmaciaId)}`),
  listarPorUsuario: (usuarioId) =>
    get(`/reservas/?usuario_id=${encodeURIComponent(usuarioId)}`),
  actualizarEstado: (id, estado) =>
    patch(`/reservas/${id}/estado`, { estado }),
};

// ── Inventario ────────────────────────────────────────────────────────────────

export const inventarioApi = {
  /** Lista el inventario completo de una farmacia. */
  listarPorFarmacia: (farmaciaId) =>
    get(`/inventario/farmacia/${farmaciaId}`),

  /** Crea o actualiza un ítem de inventario (UPSERT). */
  upsert: (datos) =>
    post("/inventario/", datos),

  /** Ajusta el stock de un medicamento (+delta o -delta). */
  ajustarStock: (farmaciaId, medicamentoId, delta) =>
    patch(`/inventario/${farmaciaId}/${medicamentoId}/stock`, { delta }),

  /** Actualiza el precio unitario de un medicamento en la farmacia. */
  actualizarPrecio: (farmaciaId, medicamentoId, precio_unitario) =>
    patch(`/inventario/${farmaciaId}/${medicamentoId}/precio`, { precio_unitario }),
};

// ── Usuarios ──────────────────────────────────────────────────────────────────

export const usuariosApi = {
  /** Lista todos los usuarios. */
  listar: () =>
    get("/usuarios/"),

  /** Obtiene un usuario por UUID. */
  obtener: (id) =>
    get(`/usuarios/${id}`),

  /** Actualiza el perfil de un usuario. */
  actualizar: (id, datos) =>
    patch(`/usuarios/${id}`, datos),
};
