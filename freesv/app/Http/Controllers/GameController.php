<?php

namespace App\Http\Controllers;

use App\Services\FreeToGameService;
use Illuminate\Http\Request;
use App\Models\Game;

class GameController extends Controller
{
    private FreeToGameService $freeToGameService;

    public function __construct(FreeToGameService $freeToGameService)
    {
        $this->freeToGameService = $freeToGameService;
    }

    /**
     * Listado de juegos con filtros opcionales
     */
    public function index(Request $request)
    {
        // Queremos servir los juegos desde la base de datos local cuando estén disponibles.
        // Soportamos filtros opcionales: title (busqueda por nombre), platform y category (genre).
        $title = $request->query('title');
        $platform = $request->query('platform');
        $category = $request->query('category');

        try {
            $query = Game::query();

            if (!empty($title)) {
                $query->where('title', 'like', '%' . $title . '%');
            }

            if (!empty($platform)) {
                // Hacemos búsqueda insensible a mayúsculas y parcial para coincidir e.g. 'pc' -> 'PC (Windows)'
                $query->whereRaw('LOWER(platform) LIKE ?', ['%' . strtolower($platform) . '%']);
            }

            if (!empty($category)) {
                // 'category' in requests maps to the 'genre' column in the local DB
                // Usamos búsqueda parcial e insensible a mayúsculas para mayor tolerancia
                $query->whereRaw('LOWER(genre) LIKE ?', ['%' . strtolower($category) . '%']);
            }

            $games = $query->get();

            return response()->json([
                'success' => true,
                'data' => $games
            ]);
        } catch (\Throwable $e) {
            // Si ocurre cualquier fallo intentamos devolver un JSON claro
            return response()->json([
                'success' => false,
                'message' => 'No se pudieron obtener los juegos desde la base de datos: ' . $e->getMessage()
            ], 502);
        }
    }

    /**
     * Detalle de un juego
     */
    public function show($id)
    {
        try {
            // Validamos el id. Si no es numérico, devolvemos 404.
            if (!is_numeric($id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID inválido'
                ], 404);
            }

            $intId = (int) $id;

            // Primero intentamos obtener el juego desde la base de datos local
            $local = Game::where('external_id', $intId)->first();

            if ($local) {
                return response()->json([
                    'success' => true,
                    'data' => $local
                ]);
            }

            // Si no existe localmente, solicitamos a la API externa
            $game = $this->freeToGameService->getGameById($intId);

            return response()->json([
                'success' => true,
                'data' => $game
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo obtener el juego: ' . $e->getMessage()
            ], 502);
        }
    }
}
