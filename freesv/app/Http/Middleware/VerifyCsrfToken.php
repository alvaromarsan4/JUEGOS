<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     * We'll exclude API prefixed routes so our SPA can POST without a CSRF token.
     * In production consider a safer approach (Sanctum / CSRF token exchange).
     *
     * @var array<int, string>
     */
    protected $except = [
        'api/*',
    ];
}
