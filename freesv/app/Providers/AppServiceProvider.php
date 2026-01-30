<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registrar servicios de la aplicación.
     */
    public function register(): void
    {
        // Aquí se podrían registrar servicios personalizados
    }

    /**
     * Arranque de servicios de la aplicación.
     */
    public function boot(): void
    {
        // Configuraciones globales si fueran necesarias
    }
}
