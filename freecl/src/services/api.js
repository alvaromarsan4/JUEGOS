const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Obtener listado de juegos con filtros
 */
export async function getGames(filters = {}) {
  const params = new URLSearchParams(filters).toString();

  const response = await fetch(`${API_URL}/games?${params}`);

  if (!response.ok) {
    throw new Error("Error al cargar los juegos");
  }

  return response.json();
}

/**
 * Obtener detalle de un juego
 */
export async function getGameById(id) {
  const response = await fetch(`${API_URL}/games/${id}`);

  if (!response.ok) {
    throw new Error("Error al cargar el juego");
  }

  return response.json();
}

/**
 * Login
 */
export async function login(data) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { success: false, message: json.message || "Error en login", errors: json.errors || null };
    }

    // Expecting backend to return user data in { user: { ... } } or similar
    return { success: true, user: json.user || json };
  } catch (err) {
    return { success: false, message: err.message || "Network error" };
  }
}

/**
 * Registro
 */
export async function register(data) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    // Intenta parsear JSON, si falla (por HTML), devuelve error genérico
    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: json.message || "Error en registro",
        errors: json.errors || null
      };
    }

    return { success: true, ...json };
  } catch (err) {
    return { success: false, message: err.message || "Network error" };
  }
}

/**
 * Obtener favoritos del usuario autenticado
 */
export async function getFavorites() {
  try {
    const res = await fetch(`${API_URL}/favorites`, {
      credentials: "include",
    });
    if (!res.ok) return { success: false };
    const json = await res.json();
    return json;
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Alternar favorito por external_id
 */
export async function toggleFavorite(external_id) {
  try {
    const res = await fetch(`${API_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ external_id }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    return { success: false, message: err.message };
  }
}
