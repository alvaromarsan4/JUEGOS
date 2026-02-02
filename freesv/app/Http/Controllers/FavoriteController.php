<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Game;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'No autenticado'], 401);
        }

        $favorites = Favorite::where('user_id', $user->id)
            ->with('game')
            ->get()
            ->map(function ($f) {
                if (!$f->game) return null;

                return [
                    'id' => $f->game->id,
                    'external_id' => $f->game->external_id,
                    'title' => $f->game->title,
                    // Aseguramos que se envía la foto al frontend
                    'thumbnail' => $f->game->thumbnails ?? $f->game->thumbnail ?? null,
                ];
            })
            ->filter()
            ->unique('external_id')
            ->values();

        return response()->json(['success' => true, 'data' => $favorites]);
    }

    public function toggle(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'No autenticado'], 401);
        }

        // Recibimos todos los datos necesarios para crear el juego si no existe
        $externalId = $request->input('external_id');
        $title = $request->input('title');
        $thumbnail = $request->input('thumbnail');

        if (!$externalId) {
            return response()->json(['success' => false, 'message' => 'external_id requerido'], 422);
        }

        // --- SOLUCIÓN MAGISTRAL ---
        // Buscamos el juego por su ID externo.
        // Si NO existe en tu base de datos local, lo crea automáticamente con el título y foto.
        $game = Game::firstOrCreate(
            ['external_id' => $externalId], // Condición de búsqueda
            [
                'title' => $title ?? 'Juego sin título',
                'thumbnails' => $thumbnail, // Guardamos la foto en la columna 'thumbnails'
                'description' => 'Descripción pendiente', // Valores por defecto para campos obligatorios
                'genre' => 'General',
                'short_description' => '...'
            ]
        );

        // Ahora gestionamos el favorito sobre el juego (que ya seguro existe)
        $favorite = Favorite::where('user_id', $user->id)->where('game_id', $game->id)->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['success' => true, 'action' => 'removed']);
        }

        Favorite::create([
            'user_id' => $user->id,
            'game_id' => $game->id
        ]);

        return response()->json(['success' => true, 'action' => 'added']);
    }
}
