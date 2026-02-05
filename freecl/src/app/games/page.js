"use client";

import { useEffect, useState } from "react";
import { getGames, getFavorites } from "@/services/api";
import GameCard from "@/components/GameCard";
import Filters from "@/components/Filters";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({});

  // --- 1. ESTADOS PARA PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage] = useState(18);

  useEffect(() => {
    let favs = [];
    // fetch favorites first (if user logged in) to mark items
    getFavorites().then((fres) => {
      if (fres && fres.success && Array.isArray(fres.data)) {
        favs = fres.data.map((f) => f.external_id || f.id);
      }

      return getGames(filters);
    }).then((res) => {
      let list = res.data || [];
      // mark favorites
      list = list.map((g) => ({ ...g, is_favorite: favs.includes(g.external_id ?? g.id) }));
      // Si hay filtro por título, filtramos en el cliente
      if (filters.title && filters.title.trim() !== "") {
        const q = filters.title.toLowerCase();
        list = list.filter((g) => (g.title || "").toLowerCase().includes(q));
      }

      setGames(list);
    }).catch((e) => {
      console.error('Error fetching games list:', e);
      setGames([]);
    });
  }, [filters]);

  const handleFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
    // --- 2. RESETEAR PÁGINA AL FILTRAR ---
    // Si cambias el filtro, siempre vuelves a la página 1
    setCurrentPage(1);
  };

  // --- 3. LÓGICA MATEMÁTICA DE PAGINACIÓN ---
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  // Solo mostramos los juegos de ESTA página
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(games.length / gamesPerPage);

  // Funciones para los botones
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-primary">Listado de juegos</h1>

      <Filters onFilter={handleFilter} />

      {/* GRID DE JUEGOS */}
      {/* Importante: Mapeamos 'currentGames', NO 'games' */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 flex-grow">
        {currentGames.length > 0 ? (
          currentGames.map((game) => (
            <GameCard key={game.external_id ?? game.id} game={game} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground text-lg font-medium">
              No se encontraron juegos con esos filtros.
            </p>
          </div>
        )}
      </div>

      {/* --- 4. CONTROLES DE PAGINACIÓN --- */}
      {/* Solo se muestran si hay más juegos que el límite por página */}
      {games.length > gamesPerPage && (
        <div className="flex justify-center items-center gap-4 mt-12 py-4">

          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${currentPage === 1
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-blue-600 shadow-md hover:shadow-lg"
              }`}
          >
            ← Anterior
          </button>

          <span className="text-muted-foreground font-medium bg-card px-4 py-2 rounded-lg border border-border">
            Página <span className="text-foreground font-bold">{currentPage}</span> de {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${currentPage === totalPages
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-blue-600 shadow-md hover:shadow-lg"
              }`}
          >
            Siguiente →
          </button>
        </div>
      )}
    </main>
  );
}