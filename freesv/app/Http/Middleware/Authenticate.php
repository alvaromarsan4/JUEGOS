<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Redirección si no está autenticado
     */
    protected function redirectTo($request): ?string
    {
        // Como es una API, devolvemos JSON en vez de redirigir
        if (!$request->expectsJson()) {
            return null;
        }

        return null;
    }
}
