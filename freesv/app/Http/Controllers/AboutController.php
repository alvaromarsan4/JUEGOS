<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function index()
    {
        return response()->json([
            'title' => 'Sobre Project Games',
            'description' => 'Project Games nació con una misión sencilla: crear la biblioteca de videojuegos más accesible y rápida de la web. Utilizamos las últimas tecnologías como Next.js y Tailwind CSS para ofrecerte una experiencia fluida.',
            'features' => [
                [
                    'title' => 'Rápido',
                    'description' => 'Carga instantánea de tus juegos favoritos.'
                ],
                [
                    'title' => 'Moderno',
                    'description' => 'Diseñado con las mejores prácticas de UI/UX.'
                ],
                [
                    'title' => 'Open Source',
                    'description' => 'Código transparente y colaborativo.'
                ]
            ]
        ]);
    }
}
