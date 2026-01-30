<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\GameController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ImportController;

// Keep API-style endpoints under /api but routed through web middleware so
// session cookies are available for login/register and favorites.
Route::prefix('api')->group(function () {
    // Import endpoint (dev)
    Route::post('/import-games', [ImportController::class, 'import']);

    // Auth routes (use session cookie)
    Route::post('/login', [LoginController::class, 'login']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'toggle']);
});
