"use client";

import { useEffect, useState } from "react";
import { getGames, getFavorites } from "@/services/api";
import GameCard from "@/components/GameCard";
import Filters from "@/components/Filters";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({});

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
  };

  return (
    <main>
      <h1>Listado de juegos</h1>
      <Filters onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <GameCard key={game.external_id ?? game.id} game={game} />
        ))}
      </div>
    </main>
  );
}
