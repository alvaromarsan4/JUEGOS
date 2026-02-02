// Definición de URLs base
const API_URL = "http://localhost:8000/api";
const BASE_URL = "http://localhost:8000";

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
 * Obtener detalle de un juego por ID
 */
export async function getGameById(id) {
  const response = await fetch(`${API_URL}/games/${id}`);

  if (!response.ok) {
    throw new Error("Error al cargar el juego");
  }

  return response.json();
}

/**
 * Helper interno para leer cookies (necesario para XSRF-TOKEN)
 */
function getCookie(name) {
  if (typeof document === "undefined") return null; 
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

/**
 * Login (Con soporte para CSRF de Laravel Sanctum)
 */
export async function login(data) {
  try {
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": xsrfToken, 
      },
      body: JSON.stringify(data),
      credentials: "include", 
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { 
        success: false, 
        message: json.message || "Error en login", 
        errors: json.errors || null 
      };
    }

    return { success: true, user: json.user || json };
  } catch (err) {
    return { success: false, message: err.message || "Error de red" };
  }
}

/**
 * Registro de usuario (CORREGIDO)
 */
export async function register(data) {
  try {
    // 1. Pedimos la cookie primero
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    // 2. Leemos el token
    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    // 3. Enviamos petición con el token en cabecera
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": xsrfToken, // <--- IMPORTANTE
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

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
      headers: {
        "Accept": "application/json"
      }
    });
    
    if (!res.ok) return { success: false };
    
    const json = await res.json();
    return json; 
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Alternar favorito (CORREGIDO)
 * Recibe: gameData (Objeto PREPARADO con external_id, title y thumbnail)
 */
export async function toggleFavorite(gameData) {
  try {
    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    // Preparamos los datos.
    const payload = typeof gameData === 'object' 
      ? { 
          // Prioridad absoluta a external_id.
          external_id: gameData.external_id,
          title: gameData.title || gameData.name,
          thumbnail: gameData.thumbnail || gameData.thumbnails || gameData.background_image
        }
      : { external_id: gameData }; 

    const res = await fetch(`${API_URL}/favorites`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": xsrfToken 
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    
    if (!res.ok) {
        return { success: false, message: json.message || "Error al actualizar favorito" };
    }

    return { success: true, data: json };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * Actualizar perfil de usuario (NUEVO - Para evitar error de conexión)
 */
export async function updateProfile(data) {
  try {
    // 1. Pedimos la cookie (OBLIGATORIO para peticiones POST/PUT)
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    // 2. Leemos el token
    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    // 3. Enviamos la petición (PUT es lo estándar para editar)
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-XSRF-TOKEN": xsrfToken, 
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: json.message || "Error al actualizar perfil",
        errors: json.errors || null
      };
    }

    return { success: true, user: json.user || json };
  } catch (err) {
    return { success: false, message: err.message || "Error de conexión" };
  }
}