"use client";

import Link from "next/link";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function GameCard({ game }) {
  const { user, toggleFavorite } = useContext(AuthContext);
  const [busy, setBusy] = useState(false);

  // 1. LÓGICA DE LA IMAGEN (Calculamos la URL buena aquí)
  const imageUrl =
    game.thumbnails ||
    game.thumbnail ||
    game.background_image ||
    game.img ||
    game.image ||
    "https://placehold.co/600x400?text=No+Image";

  // 2. LÓGICA DEL ID (CRUCIAL)
  // Si viene de Laravel (Mis Favoritos), tiene 'external_id'. 
  // Si viene de la API externa (Listado), su 'id' ES el external.
  // Priorizamos external_id, y si no existe, usamos id.
  const realGameId = Number(game.external_id || game.id);

  // Verificamos si es favorito usando el ID correcto
  const isFav = user?.favorites?.includes(realGameId);

  const onToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Inicia sesión para añadir favoritos");
      return;
    }
    if (busy) return;
    setBusy(true);

    // 3. CONSTRUIMOS EL PAQUETE PERFECTO
    // No enviamos 'game' directo porque puede tener el ID '1' (interno) y liar a Laravel.
    // Enviamos explícitamente lo que queremos guardar.
    const gameToSend = {
      external_id: realGameId,           // Forzamos el ID real (ej: 540)
      title: game.title || game.name,    // Aseguramos título
      thumbnail: imageUrl                // ¡ENVIAMOS LA URL DE LA IMAGEN QUE YA CALCULAMOS!
    };

    try {
      await toggleFavorite(gameToSend);
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-slate-700 relative group transition-all hover:-translate-y-1">

      {/* IMAGEN */}
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={game.title || game.name || "Juego"}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Error+Imagen"; }}
        />

        {/* BOTÓN FAVORITO */}
        {user && (
          <button
            onClick={onToggle}
            disabled={busy}
            className="absolute top-2 right-2 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition z-10"
            title={isFav ? "Quitar favorito" : "Añadir favorito"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isFav ? "red" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={isFav ? "red" : "white"}
              className={`w-6 h-6 transition-transform ${busy ? 'scale-75 opacity-50' : 'scale-100'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        )}
      </div>

      {/* TEXTO */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-bold text-card-foreground truncate">
          {game.title || game.name}
        </h3>
        <p className="text-muted-foreground text-sm font-medium">
          {game.genre || "Juego"}
        </p>

        {realGameId ? (
          <Link
            href={`/games/${realGameId}`}
            className="mt-2 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Ver detalle
          </Link>
        ) : (
          <span className="text-muted-foreground text-sm">Detalles no disponibles</span>
        )}
      </div>
    </div >
  );
}