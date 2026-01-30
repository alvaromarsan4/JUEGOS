<?php

use App\Http\Controllers\GameController;

use App\Http\Controllers\ImportController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;

// Juegos
Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{id}', [GameController::class, 'show']);

// Importar datos de FreeToGame a la base de datos (dev)
Route::post('/import-games', [ImportController::class, 'import']);

// Registro
Route::post('/register', [RegisterController::class, 'register']);

// Note: authentication and favorites routes moved to web.php to ensure the
// session middleware (StartSession) runs and the session store is available.
