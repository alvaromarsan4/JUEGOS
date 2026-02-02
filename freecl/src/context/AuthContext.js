"use client";

import { createContext, useEffect, useState } from "react";
import { 
  login as loginService, 
  toggleFavorite as toggleFavoriteService,
  getFavorites as getFavoritesService 
} from "@/services/api";

export const AuthContext = createContext({ 
  user: null, 
  login: async () => {}, 
  logout: () => {},
  toggleFavorite: async () => {} 
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 1. Carga inicial
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pg_user");
      if (raw) {
        const parsedUser = JSON.parse(raw);
        parsedUser.favorites = (parsedUser.favorites || []).map(Number);
        setUser(parsedUser);
      }
    } catch (e) { /* ignore */ }
  }, []);

  // 2. Sincronización en segundo plano (para asegurar que los datos son reales)
  useEffect(() => {
    if (!user) return;

    const syncFavorites = async () => {
        try {
            const favsResult = await getFavoritesService();
            const favsArray = Array.isArray(favsResult) ? favsResult : (favsResult.data || []);
            const cleanFavs = favsArray.map(f => Number(f.external_id || f.id)).filter(n => !isNaN(n));

            setUser(prev => {
                if (!prev) return null;
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

  const login = async (credentials) => {
    try {
      const result = await loginService(credentials);
      if (result && result.success) {
        let cleanFavs = [];
        try {
            const favsResult = await getFavoritesService();
            const favsArray = Array.isArray(favsResult) ? favsResult : (favsResult.data || []);
            cleanFavs = favsArray.map(f => Number(f.external_id || f.id)).filter(n => !isNaN(n));
        } catch (e) {
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pg_user");
  };

  // --- AQUÍ ESTÁ EL CAMBIO PARA QUE SEA INSTANTÁNEO ---
  const toggleFavorite = async (gameData) => {
    if (!user) return;

    const rawId = typeof gameData === 'object' ? (gameData.external_id || gameData.id) : gameData;
    const gameId = Number(rawId); 

    // 1. Guardamos una copia del estado actual por si hay error
    const previousUser = { ...user };

    // 2. ACTUALIZACIÓN OPTIMISTA: ¡Cambiamos el estado YA, sin esperar a la API!
    setUser(prev => {
        const currentFavs = (prev.favorites || []).map(Number);
        const isFav = currentFavs.includes(gameId);
        let newFavs;

        if (isFav) {
            // Si ya lo tiene, lo quitamos visualmente al instante
            newFavs = currentFavs.filter(id => id !== gameId);
        } else {
            // Si no lo tiene, lo añadimos visualmente al instante
            newFavs = [...currentFavs, gameId];
        }

        const updated = { ...prev, favorites: newFavs };
        // Actualizamos también localStorage para que persista si recargas rápido
        localStorage.setItem("pg_user", JSON.stringify(updated));
        return updated;
    });

    try {
        // 3. Llamamos a la API en segundo plano
        const res = await toggleFavoriteService(gameData);

        // Si la API falla, lanzamos error para que salte al catch
        if (!res || !res.success) {
            throw new Error("Error en API");
        }
        // Si todo va bien, no hacemos nada, porque ya pintamos el corazón en el paso 2.

    } catch (error) {
        console.error("Error al guardar favorito, revirtiendo...", error);
        
        // 4. ROLLBACK: Si falló el servidor, volvemos a poner el estado como estaba antes
        // (El corazón volverá a su estado original y avisamos al usuario)
        setUser(previousUser);
        localStorage.setItem("pg_user", JSON.stringify(previousUser));
        alert("No se pudo guardar el favorito. Revisa tu conexión.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}