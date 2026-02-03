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
 * --- SECCIÓN DE RESEÑAS ---
 */

/**
 * Obtener las reseñas de un juego específico
 */
export async function getReviewsByGame(gameId) {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}/reviews`, {
      headers: {
        "Accept": "application/json",
      },
    });

    // Si hay un error 500 o similar, evitamos que la app falle devolviendo []
    if (!response.ok) {
      console.warn(`Aviso: El servidor respondió con error ${response.status} al cargar reseñas.`);
      return [];
    }
    
    // Devolvemos el JSON completo para que el componente decida si usar .data o el array directo
    return await response.json();
  } catch (err) {
    console.error("Error de red cargando reseñas:", err);
    return [];
  }
}

/**
 * Publicar o actualizar una reseña
 * @param {Object} data { game_id, content, rating }
 */
export async function submitReview(data) {
  try {
    // 1. Asegurar cookie CSRF
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    // 2. Enviar POST con tipos de datos normalizados
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest", 
        "X-XSRF-TOKEN": xsrfToken,
      },
      body: JSON.stringify({
        game_id: Number(data.game_id),
        comment: String(data.comment),
        rating: Number(data.rating),
        title: data.title,
        thumbnail: data.thumbnail
      }),
      credentials: "include",
    });

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { 
        success: false, 
        message: json.message || "Error al publicar la reseña",
        errors: json.errors || null 
      };
    }

    return { success: true, data: json };
  } catch (err) {
    return { success: false, message: "Error de conexión con el servidor" };
  }
}

/**
 * Obtener las reseñas del usuario actual (Para el perfil)
 */
export async function getUserReviews() {
  try {
    const response = await fetch(`${API_URL}/user/reviews`, {
      headers: {
        "Accept": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    return [];
  }
}

/**
 * Eliminar una reseña
 */
export async function deleteReview(reviewId) {
  try {
    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-XSRF-TOKEN": xsrfToken,
      },
      credentials: "include",
    });

    return response.ok;
  } catch (err) {
    return false;
  }
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
 * Registro de usuario
 */
export async function register(data) {
  try {
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    const response = await fetch(`${API_URL}/register`, {
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
 * Alternar favorito
 */
export async function toggleFavorite(gameData) {
  try {
    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

    const payload = typeof gameData === 'object' 
      ? { 
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
 * Actualizar perfil de usuario
 */
export async function updateProfile(data) {
  try {
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
    });

    const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));

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