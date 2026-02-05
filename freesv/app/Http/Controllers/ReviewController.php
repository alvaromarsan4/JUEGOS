<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * OBTENER RESEÑAS DE UN JUEGO (PÚBLICO)
     */
    public function index($gameId)
    {
        // CORRECCIÓN: Usamos 'whereHas' para buscar por 'external_id'.
        // Esto permite que si la URL es /games/540/reviews, encuentre el juego
        // aunque tu ID interno en la base de datos sea 1, 2, 3...
        $reviews = Review::whereHas('game', function($query) use ($gameId) {
                            $query->where('external_id', $gameId);
                         })
                         ->with('user:id,name,profileImage') // Solo datos seguros del usuario
                         ->with('game') // Incluimos el juego por si acaso
                         ->latest()
                         ->get();

        return response()->json($reviews);
    }

    /**
     * GUARDAR O ACTUALIZAR RESEÑA
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'required', // Este es el ID de la API (ej: 540)
            'comment' => 'required|string|min:3',
            'rating'  => 'required|integer|min:1|max:5',
            'title'   => 'nullable|string',
            'thumbnail' => 'nullable|string',
        ]);

        // 1. BUSCAR O CREAR EL JUEGO
        // CORRECCIÓN IMPORTANTE: Usamos 'external_id' como clave de búsqueda.
        // Esto soluciona el error "Field 'external_id' doesn't have a default value".
        $game = Game::firstOrCreate(
            ['external_id' => $validated['game_id']], // Buscamos por el ID externo
            [
                // Si no existe, lo creamos con estos datos:
                'title' => $validated['title'] ?? 'Juego Desconocido',
                'thumbnail' => $validated['thumbnail'] ?? null,
                'genre' => 'N/A',
                'platform' => 'N/A'
            ]
        );

        // 2. CREAR O ACTUALIZAR LA RESEÑA
        // CORRECCIÓN: Usamos $game->id (el ID interno de Laravel) para la relación.
        $review = Review::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'game_id' => $game->id // <--- Enlazamos con el ID real de la tabla games
            ],
            [
                'comment' => $validated['comment'],
                'rating'  => $validated['rating']
            ]
        );

        // Devolvemos la reseña con el usuario y el juego cargados
        return response()->json($review->load(['user:id,name,profileImage', 'game']), 201);
    }

    /**
     * OBTENER RESEÑAS DEL USUARIO LOGUEADO
     */
    public function userReviews(Request $request)
    {
        $reviews = Review::where('user_id', Auth::id())
                         ->with('game') // Importante para ver el título en el perfil
                         ->latest()
                         ->get();

        return response()->json($reviews);
    }

    /**
     * ELIMINAR UNA RESEÑA
     */
    public function destroy($id)
    {
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Reseña no encontrada'], 404);
        }

        // Seguridad: Solo el dueño puede borrarla
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $review->delete();

        return response()->json(['message' => 'Reseña eliminada']);
    }
}

