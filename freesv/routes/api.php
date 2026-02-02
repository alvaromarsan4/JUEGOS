<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Importamos los controladores que hemos estado usando
use App\Http\Controllers\GameController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\AuthController;
// Si usas RegisterController por separado, mantenlo, pero AuthController es lo estándar
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\UserController;
// Juegos
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);

// Importar datos de FreeToGame a la base de datos (dev)
Route::post('/import-games', [ImportController::class, 'import']);

// Registro
Route::post('/register', [RegisterController::class, 'register']);
Route::put('/user/update', [UserController::class, 'updateProfile']);
// Note: authentication and favorites routes moved to web.php to ensure the
// session middleware (StartSession) runs and the session store is available.
Route::middleware(['auth:sanctum'])->group(function () {

    // Obtener usuario actual
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Favoritos
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'toggle']);

    // Perfil
    // IMPORTANTE: Esta ruta debe coincidir con la de api.js (/profile)
    // Y debe usar el controlador donde pegaste la función updateProfile (AuthController)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

});
