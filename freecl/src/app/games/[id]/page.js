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
    <div className="p-8 text-foreground max-w-6xl mx-auto bg-background flex-grow flex items-center justify-center">
      <p className="text-primary animate-pulse font-bold text-xl">Cargando detalles...</p>
    </div>
  );

  if (error) return (
    <div className="flex-grow flex items-center justify-center bg-background">
      <p className="text-red-500 font-bold bg-red-500/10 p-4 rounded-lg border border-red-500">{error}</p>
    </div>
  );

  if (!game) return <p className="text-foreground p-4 text-center">Juego no encontrado.</p>;

  return (
    <div className="p-8 text-foreground max-w-6xl mx-auto bg-background h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* IZQUIERDA: Información del Juego */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-6 text-primary drop-shadow-sm">{game.title}</h1>
          <div className="relative group">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="rounded-xl shadow-xl w-full mb-8 border border-border object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            />
          </div>

          <h2 className="text-2xl font-semibold mb-4 border-b border-border pb-2 text-foreground flex items-center gap-2">
            <span className="text-primary">ℹ️</span> Ficha Técnica
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-card p-6 rounded-xl border border-border shadow-md">
            <p><strong className="text-primary">Género:</strong> <span className="text-card-foreground">{game.genre}</span></p>
            <p><strong className="text-primary">Plataforma:</strong> <span className="text-card-foreground">{game.platform}</span></p>
            <p><strong className="text-primary">Desarrollador:</strong> <span className="text-card-foreground">{game.developer || 'N/A'}</span></p>
            <p><strong className="text-primary">Lanzamiento:</strong> <span className="text-card-foreground">{game.release_date || 'N/A'}</span></p>
          </div>

          <h3 className="text-xl font-semibold mb-3 text-foreground">Descripción</h3>
          <p className="text-foreground leading-relaxed text-lg">
            {game.short_description}
          </p>
        </div>

        {/* DERECHA: Sistema de Reseñas */}
        <div className="lg:col-span-1 space-y-8">

          <div className="bg-card p-6 rounded-2xl border border-border shadow-xl sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-card-foreground flex items-center gap-2">
              <span className="text-2xl">✍️</span> Danos tu opinión
            </h3>

            {/* --- AQUÍ MUESTRO LA NOTIFICACIÓN --- */}
            {notification.message && (
              <div className={`p-3 mb-4 rounded-lg border text-sm font-semibold transition-all duration-300 ${notification.type === 'success'
                  ? 'bg-green-500/20 border-green-500 text-green-700 shadow-sm'
                  : 'bg-red-500/20 border-red-500 text-red-700 shadow-sm'
                }`}>
                {notification.type === 'success' ? '✅ ' : '⚠️ '}
                {notification.message}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-muted-foreground font-bold italic">Tu calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`flex-1 py-2 rounded-lg border transition-all duration-300 ${rating >= num
                          ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-sm"
                          : "bg-muted border-border text-muted-foreground hover:border-border hover:bg-muted/80"
                        }`}
                    >
                      {num}★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2 text-muted-foreground font-bold italic">Reseña</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-shadow placeholder:text-muted-foreground/50"
                  placeholder="¿Qué tal la experiencia de juego?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-blue-600 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-bold py-3 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
              >
                {submitting ? "PROCESANDO..." : "PUBLICAR RESEÑA"}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2 border-l-4 border-primary pl-3">
                Comunidad
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-background p-4 rounded-xl border border-border hover:border-primary/50 transition-colors group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-primary text-sm group-hover:text-blue-600 transition-colors">
                            {rev.user ? rev.user.name : (rev.username || 'Usuario')}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : 'Reciente'}
                          </p>
                        </div>
                        <div className="flex text-yellow-500 text-[10px] bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20 shadow-sm">
                          {"★".repeat(rev.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed italic line-clamp-4">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border">
                    <p className="text-muted-foreground text-sm italic">Sin reseñas aún. ¡Sé el primero!</p>
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