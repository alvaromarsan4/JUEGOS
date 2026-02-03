<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importamos los controladores
use App\Http\Controllers\GameController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController; // Asegúrate de que este import exista

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS (No requieren login)
|--------------------------------------------------------------------------
*/

// Juegos
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);

// --- ¡AQUÍ FALTABA ESTA RUTA! ---
// Obtener reseñas de un juego específico (Pública)
Route::get('/games/{id}/reviews', [ReviewController::class, 'index']);

// Importar datos (dev)
Route::post('/import-games', [ImportController::class, 'import']);

// Registro y Login
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); // Asegúrate de tener ruta de login si la usas desde api.js

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Requieren Token / Login)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {

    // Obtener usuario actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Favoritos
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'toggle']);

    // Perfil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // --- RUTAS DE RESEÑAS (Escritura/Borrado) ---

    // Guardar una reseña (POST)
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Obtener mis reseñas (GET)
    Route::get('/user/reviews', [ReviewController::class, 'userReviews']);

    // Eliminar reseña (DELETE)
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});
