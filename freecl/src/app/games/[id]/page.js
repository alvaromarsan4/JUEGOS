"use client";

import { useEffect, useState, use } from "react";
import { getGameById, getReviewsByGame, submitReview } from "@/services/api";

export default function GameDetail({ params }) {
  const { id } = use(params);

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del formulario
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // --- NUEVO: ESTADO PARA NOTIFICACIONES ---
  const [notification, setNotification] = useState({ type: '', message: '' });

  // --- HELPER PARA MOSTRAR NOTIFICACIONES ---
  const showNotification = (type, msg) => {
    setNotification({ type, message: msg });
    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
        setNotification({ type: '', message: '' });
    }, 4000);
  };

  // --- HELPER PARA NORMALIZAR DATOS ---
  const normalizeReviews = (data) => {
     if (Array.isArray(data)) return data;
     if (data && Array.isArray(data.data)) return data.data; 
     if (data && Array.isArray(data.reviews)) return data.reviews;
     return [];
  };

  // Carga inicial de datos
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const [gameData, reviewsData] = await Promise.all([
          getGameById(id),
          getReviewsByGame(id)
        ]);

        if (mounted) {
          setGame(gameData.data || gameData);
          setReviews(normalizeReviews(reviewsData));
        }
      } catch (e) {
        console.error('Error al cargar datos:', e);
        if (mounted) setError('No se pudo cargar la información del juego');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Limpiamos notificaciones previas al intentar enviar
    setNotification({ type: '', message: '' });

    const result = await submitReview({
      game_id: id,
      comment: comment,
      rating: rating,
      title: game.title,
      thumbnail: game.thumbnail || game.background_image,
    });

    if (result.success) {
      try {
        const updatedReviews = await getReviewsByGame(id);
        setReviews(normalizeReviews(updatedReviews));

        setComment("");
        
        // CAMBIO: Usamos la notificación verde en lugar del alert
        showNotification('success', "¡Reseña publicada y lista actualizada!");
        
      } catch (error) {
        console.error("Error al refrescar las reseñas:", error);
        // CAMBIO: Notificación de error visual
        showNotification('error', "Reseña guardada, pero hubo un error al refrescar la lista.");
      }
    } else {
      // CAMBIO: Notificación de error visual
      showNotification('error', result.message || "Error al publicar. ¿Has iniciado sesión?");
    }
    
    setSubmitting(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-blue-400 animate-pulse font-bold text-xl">Cargando detalles...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="text-red-500 font-bold bg-red-500/10 p-4 rounded-lg border border-red-500">{error}</p>
    </div>
  );

  if (!game) return <p className="text-white p-4 text-center">Juego no encontrado.</p>;

  return (
    <div className="p-8 text-white max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* IZQUIERDA: Información del Juego */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6 text-blue-400 drop-shadow-md">{game.title}</h1>
          <div className="relative group">
            <img 
              src={game.thumbnail} 
              alt={game.title} 
              className="rounded-xl shadow-2xl w-full mb-8 border border-gray-700 object-cover transition-transform duration-500 group-hover:scale-[1.01]" 
            />
          </div>

          <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2 text-gray-200 flex items-center gap-2">
            <span className="text-blue-500">ℹ️</span> Ficha Técnica
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
            <p><strong className="text-blue-300">Género:</strong> <span className="text-gray-300">{game.genre}</span></p>
            <p><strong className="text-blue-300">Plataforma:</strong> <span className="text-gray-300">{game.platform}</span></p>
            <p><strong className="text-blue-300">Desarrollador:</strong> <span className="text-gray-300">{game.developer || 'N/A'}</span></p>
            <p><strong className="text-blue-300">Lanzamiento:</strong> <span className="text-gray-300">{game.release_date || 'N/A'}</span></p>
          </div>

          <h3 className="text-xl font-semibold mb-3 text-gray-200">Descripción</h3>
          <p className="text-gray-400 leading-relaxed text-lg bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
            {game.short_description}
          </p>
        </div>

        {/* DERECHA: Sistema de Reseñas */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700 shadow-xl backdrop-blur-md sticky top-8">
            <h3 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
              <span className="text-2xl">✍️</span> Danos tu opinión
            </h3>

            {/* --- AQUÍ MUESTRO LA NOTIFICACIÓN --- */}
            {notification.message && (
                <div className={`p-3 mb-4 rounded-lg border text-sm font-semibold transition-all duration-300 ${
                    notification.type === 'success' 
                        ? 'bg-green-500/20 border-green-500 text-green-200 shadow-[0_0_10px_rgba(34,197,94,0.2)]' 
                        : 'bg-red-500/20 border-red-500 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                }`}>
                    {notification.type === 'success' ? '✅ ' : '⚠️ '}
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-gray-500 font-bold italic">Tu calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`flex-1 py-2 rounded-lg border transition-all duration-300 ${
                        rating >= num 
                        ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]" 
                        : "bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {num}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-gray-500 font-bold italic">Reseña</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-200 transition-shadow"
                  placeholder="¿Qué tal la experiencia de juego?"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-black py-3 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-900/20"
              >
                {submitting ? "PROCESANDO..." : "PUBLICAR RESEÑA"}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                  Comunidad
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-gray-900/60 p-4 rounded-xl border border-gray-800 hover:border-blue-900/50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-blue-400 text-sm group-hover:text-blue-300 transition-colors">
                            {rev.user ? rev.user.name : (rev.username || 'Usuario')}
                          </p>
                          <p className="text-[10px] text-gray-500">
                             {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Reciente'}
                          </p>
                        </div>
                        <div className="flex text-yellow-500 text-[10px] bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20 shadow-sm">
                          {"★".repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed italic line-clamp-4">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-900/40 rounded-xl border border-dashed border-gray-700">
                    <p className="text-gray-500 text-sm italic">Sin reseñas aún. ¡Sé el primero!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}