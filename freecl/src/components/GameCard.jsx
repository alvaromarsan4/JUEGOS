"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { toggleFavorite } from "@/services/api";

export default function GameCard({ game }) {
  const gameId = game.external_id ?? game.id;
  const { user } = useContext(AuthContext);
  const [favState, setFavState] = useState(false);
  const [busy, setBusy] = useState(false);

  // If backend returns a `is_favorite` property, honor it initially
  useEffect(() => {
    if (typeof game.is_favorite !== "undefined") setFavState(!!game.is_favorite);
  }, [game]);

  const onToggle = async () => {
    if (!user) return; // optionally show login prompt
    if (busy) return;
    setBusy(true);
    try {
      const res = await toggleFavorite(game.external_id ?? game.id);
      if (res && res.success) {
        setFavState(res.action === "added");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border rounded p-4 relative">
      <img src={game.thumbnail} alt={game.title} />
      <h3 className="text-lg font-bold">{game.title}</h3>
      <p>{game.genre}</p>

      {gameId ? (
        <Link href={`/games/${gameId}`}>Ver detalle</Link>
      ) : (
        <span className="text-gray-500">Ver detalle</span>
      )}

      {user && (
        <button
          aria-label={favState ? "Quitar favorito" : "Marcar favorito"}
          onClick={onToggle}
          disabled={busy}
          className={`absolute top-2 right-2 p-2 rounded ${favState ? 'text-yellow-300' : 'text-gray-300'}`}
        >
          {favState ? "★" : "☆"}
        </button>
      )}
    </div>
  );
}
