"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { getFavorites } from "@/services/api";
import GameCard from "@/components/GameCard";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]); // Aquí guardamos los datos completos (fotos, titulos...)
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario cargado aún, esperamos
    if (!user && !loading) {
      // Opcional: router.push('/login');
    }

    const fetchFavs = async () => {
      try {
        const res = await getFavorites();

        let data = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (res.data) {
          data = res.data;
        }

        setGames(data);
      } catch (error) {
        console.error("Error cargando favoritos", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavs();
    } else {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [user]); // Se recarga si cambia el usuario (login/logout)

  // --- LA MAGIA ESTÁ AQUÍ ---
  // Filtramos la lista 'games' en tiempo real.
  // Solo mostramos los juegos cuyo ID siga estando en 'user.favorites'.
  // Como 'user.favorites' cambia al instante (Optimistic UI), el juego desaparece al instante.
  const visibleGames = games.filter(game => {
    // Usamos la misma lógica de ID que en GameCard y AuthContext
    const gameId = Number(game.external_id || game.id);
    return user?.favorites?.includes(gameId);
  });

  if (loading) {
    return <div className="text-foreground text-center mt-20">Cargando tus favoritos...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-foreground">
        <h1 className="text-2xl">Debes iniciar sesión</h1>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-background text-foreground h-full">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Mis Favoritos ❤️</h1>

      {visibleGames.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          <p className="text-xl">Aún no tienes juegos favoritos.</p>
          <p className="text-sm mt-2">Ve al listado y añade algunos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Renderizamos visibleGames en lugar de games */}
          {visibleGames.map((game) => (
            <GameCard key={game.id || game.external_id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}