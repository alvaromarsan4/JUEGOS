"use client";

import { useEffect, useState } from "react";
import { getGameById } from "@/services/api";

export default function GameDetail({ params }) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      const id = params?.id;

      // Evitamos realizar la petición si el id no está definido o es la cadena 'undefined'
      if (!id || id === 'undefined') {
        if (mounted) {
          setError('ID de juego inválido');
          setLoading(false);
        }
        return;
      }

      try {
        const res = await getGameById(id);

        // API returns { success, data }
        const payload = res && res.data ? res.data : res;

        if (mounted) setGame(payload);
      } catch (e) {
        console.error('Error loading game:', e);
        if (mounted) setError(e.message || 'Error al cargar el juego');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (!game) return <p>No se encontró el juego.</p>;

  return (
    <div>
      <h1>{game.title}</h1>
      <img src={game.thumbnail} alt={game.title} />

      <h2 className="mt-4">Descripción</h2>
      <table className="table-auto border-collapse border">
        <thead>
          <tr>
            <th className="border px-2 py-1 text-left">Campo</th>
            <th className="border px-2 py-1 text-left">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1 align-top">short_description</td>
            <td className="border px-2 py-1">{game.short_description || '—'}</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-4"><strong>Plataforma:</strong> {game.platform}</p>
      <p><strong>Género:</strong> {game.genre}</p>
    </div>
  );
}
