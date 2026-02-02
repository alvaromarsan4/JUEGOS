"use client";

import { createContext, useEffect, useState } from "react";
import { 
  login as loginService, 
  toggleFavorite as toggleFavoriteService,
  getFavorites as getFavoritesService 
} from "@/services/api";

export const AuthContext = createContext({ 
  user: null, 
  setUser: () => {}, // <--- Esto evita errores de autocompletado
  login: async () => {}, 
  logout: () => {},
  toggleFavorite: async () => {} 
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 1. Carga inicial desde LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pg_user");
      if (raw) {
        const parsedUser = JSON.parse(raw);
        // Aseguramos que los favoritos sean números
        parsedUser.favorites = (parsedUser.favorites || []).map(Number);
        setUser(parsedUser);
      }
    } catch (e) { /* ignore */ }
  }, []);

  // 2. Sincronización en segundo plano (para asegurar que los datos son reales al recargar)
  useEffect(() => {
    if (!user) return;

    const syncFavorites = async () => {
        try {
            const favsResult = await getFavoritesService();
            const favsArray = Array.isArray(favsResult) ? favsResult : (favsResult.data || []);
            // Extraemos solo los IDs numéricos
            const cleanFavs = favsArray.map(f => Number(f.external_id || f.id)).filter(n => !isNaN(n));

            setUser(prev => {
                if (!prev) return null;
                // Comparamos para no renderizar si no hay cambios
                const prevFavsStr = JSON.stringify((prev.favorites || []).sort());
                const newFavsStr = JSON.stringify(cleanFavs.sort());
                
                if (prevFavsStr !== newFavsStr) {
                    const updated = { ...prev, favorites: cleanFavs };
                    localStorage.setItem("pg_user", JSON.stringify(updated));
                    return updated;
                }
                return prev;
            });
        } catch (error) { console.error("Sync error", error); }
    };
    syncFavorites();
  }, [user?.id]);

  // LOGIN
  const login = async (credentials) => {
    try {
      const result = await loginService(credentials);
      if (result && result.success) {
        let cleanFavs = [];
        // Intentamos obtener favoritos frescos
        try {
            const favsResult = await getFavoritesService();
            const favsArray = Array.isArray(favsResult) ? favsResult : (favsResult.data || []);
            cleanFavs = favsArray.map(f => Number(f.external_id || f.id)).filter(n => !isNaN(n));
        } catch (e) {
            // Fallback con los que vienen del login
            cleanFavs = (result.user.favorites || []).map(Number).filter(n => !isNaN(n));
        }
        const userWithFavs = { ...result.user, favorites: cleanFavs };
        
        setUser(userWithFavs);
        localStorage.setItem("pg_user", JSON.stringify(userWithFavs));
        return { success: true, user: userWithFavs };
      }
      return { success: false, message: result.message || "Credenciales inválidas" };
    } catch (err) {
      return { success: false, message: err.message || "Error de red" };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("pg_user");
  };

  // TOGGLE FAVORITE (OPTIMISTA)
  const toggleFavorite = async (gameData) => {
    if (!user) return;

    const rawId = typeof gameData === 'object' ? (gameData.external_id || gameData.id) : gameData;
    const gameId = Number(rawId); 

    // Guardamos estado anterior por si falla
    const previousUser = { ...user };

    // ACTUALIZACIÓN VISUAL INSTANTÁNEA
    setUser(prev => {
        const currentFavs = (prev.favorites || []).map(Number);
        const isFav = currentFavs.includes(gameId);
        let newFavs;

        if (isFav) {
            newFavs = currentFavs.filter(id => id !== gameId); // Quitar
        } else {
            newFavs = [...currentFavs, gameId]; // Añadir
        }

        const updated = { ...prev, favorites: newFavs };
        localStorage.setItem("pg_user", JSON.stringify(updated));
        return updated;
    });

    try {
        // Llamada a la API real
        const res = await toggleFavoriteService(gameData);

        if (!res || !res.success) {
            throw new Error("Error en API");
        }
    } catch (error) {
        console.error("Error al guardar favorito, revirtiendo...", error);
        
        // ROLLBACK: Si falla, volvemos atrás
        setUser(previousUser);
        localStorage.setItem("pg_user", JSON.stringify(previousUser));
        alert("No se pudo guardar el favorito. Revisa tu conexión.");
    }
  };

  return (
    // ⚠️ AQUÍ ESTÁ LA CORRECCIÓN: Añadido 'setUser'
    <AuthContext.Provider value={{ user, setUser, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}