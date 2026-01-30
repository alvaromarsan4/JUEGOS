<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Services\FreeToGameService;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    private FreeToGameService $freeToGameService;

    public function __construct(FreeToGameService $freeToGameService)
    {
        $this->freeToGameService = $freeToGameService;
    }

    /**
     * Import all games from FreeToGame API into local database.
     */
    public function import(Request $request)
    {
        $filters = $request->only(['platform', 'category']);

        $data = $this->freeToGameService->getGames($filters);

        $games = $data ?? [];
        $count = 0;

        foreach ($games as $g) {
            $attrs = [
                'external_id' => $g['id'] ?? null,
                'title' => $g['title'] ?? null,
                'thumbnail' => $g['thumbnail'] ?? null,
                'short_description' => $g['short_description'] ?? null,
                'game_url' => $g['game_url'] ?? null,
                'genre' => $g['genre'] ?? null,
                'platform' => $g['platform'] ?? null,
                'publisher' => $g['publisher'] ?? null,
                'developer' => $g['developer'] ?? null,
                'release_date' => $g['release_date'] ?? null,
                'freetogame_profile_url' => $g['freetogame_profile_url'] ?? null,
            ];

            // Update existing or create new
            Game::updateOrCreate(
                ['external_id' => $attrs['external_id']],
                $attrs
            );

            $count++;
        }

        return response()->json([
            'success' => true,
            'imported' => $count,
        ]);
    }
}
