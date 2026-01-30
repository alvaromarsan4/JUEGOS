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

        $favorites = Favorite::where('user_id', $user->id)->with('game')->get()->map(function ($f) {
            return [
                'id' => $f->game->id,
                'external_id' => $f->game->external_id,
                'title' => $f->game->title,
            ];
        });

        return response()->json(['success' => true, 'data' => $favorites]);
    }

    public function toggle(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'No autenticado'], 401);
        }

        $externalId = $request->input('external_id');
        if (!$externalId) {
            return response()->json(['success' => false, 'message' => 'external_id requerido'], 422);
        }

        $game = Game::where('external_id', $externalId)->first();
        if (!$game) {
            return response()->json(['success' => false, 'message' => 'Juego no encontrado'], 404);
        }

        $favorite = Favorite::where('user_id', $user->id)->where('game_id', $game->id)->first();
        if ($favorite) {
            $favorite->delete();
            return response()->json(['success' => true, 'action' => 'removed']);
        }

        Favorite::create(['user_id' => $user->id, 'game_id' => $game->id]);
        return response()->json(['success' => true, 'action' => 'added']);
    }
}
