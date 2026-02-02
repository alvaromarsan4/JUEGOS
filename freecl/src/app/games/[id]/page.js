"use client";

import { useEffect, useState, use } from "react"; // <--- Importamos 'use'
import { getGameById } from "@/services/api";

export default function GameDetail({ params }) {
  // NEXT.JS 15 FIX: Desempaquetamos la promesa params con use()
  const { id } = use(params);

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      // Usamos el 'id' que ya sacamos arriba con use()
      if (!id || id === 'undefined') {
        if (mounted) {
          setError('ID de juego inválido');
          setLoading(false);
        }
        return;
      }

      try {
        const res = await getGameById(id);

        // API returns { success, data } o directo
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
  }, [id]); // <--- Dependencia correcta: 'id' (ya desempaquetado)

  if (loading) return <p className="text-white p-4">Cargando...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  if (!game) return <p className="text-white p-4">No se encontró el juego.</p>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      <div className="max-w-2xl">
          <img src={game.thumbnail} alt={game.title} className="rounded shadow-lg w-full mb-6" />

          <h2 className="text-xl font-semibold mt-4 mb-2">Descripción</h2>
          <table className="table-auto border-collapse border border-gray-600 w-full mb-6">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 px-4 py-2 text-left">Campo</th>
                <th className="border border-gray-600 px-4 py-2 text-left">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-600 px-4 py-2 align-top font-medium">Descripción corta</td>
                <td className="border border-gray-600 px-4 py-2">{game.short_description || '—'}</td>
              </tr>
            </tbody>
          </table>

          <p className="mt-4"><strong>Plataforma:</strong> <span className="text-gray-300">{game.platform}</span></p>
          <p><strong>Género:</strong> <span className="text-gray-300">{game.genre}</span></p>
      </div>
    </div>
  );
}