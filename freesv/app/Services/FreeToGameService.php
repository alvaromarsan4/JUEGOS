<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Log;


class FreeToGameService
{
    private string $baseUrl = 'https://www.freetogame.com/api';

    /**
     * Obtener listado de juegos (con filtros opcionales)
     */
    public function getGames(array $filters = [])
    {
        // Por defecto intentamos verificar certificados. Si falla por un
        // problema de CA en entornos de desarrollo (cURL error 60) reintentamos
        // con 'verify' => false para no romper la app localmente.
        $options = ['verify' => true];

        try {
            /** @var Response $response */
            $response = Http::withOptions($options)->get($this->baseUrl . '/games', $filters);
        } catch (ConnectionException $e) {
            // Si el fallo es por certificado, reintentamos en modo desarrollo.
            if (str_contains($e->getMessage(), 'SSL certificate problem')) {
                Log::warning('FreeToGameService: SSL verification failed, retrying without verification for development environment.');
                /** @var Response $response */
                $response = Http::withOptions(['verify' => false])->get($this->baseUrl . '/games', $filters);
            } else {
                throw $e;
            }
        }

        if ($response->failed()) {
            throw new \Exception('Error al consumir la API FreeToGame');
        }

        return $response->json();
    }

    /**
     * Obtener detalle de un juego por ID
     */
    public function getGameById(int $id)
    {
        $options = ['verify' => true];

        try {
            /** @var Response $response */
            $response = Http::withOptions($options)->get($this->baseUrl . '/game', [
                'id' => $id
            ]);
        } catch (ConnectionException $e) {
            if (str_contains($e->getMessage(), 'SSL certificate problem')) {
                Log::warning('FreeToGameService: SSL verification failed for game details, retrying without verification.');
                /** @var Response $response */
                $response = Http::withOptions(['verify' => false])->get($this->baseUrl . '/game', [
                    'id' => $id
                ]);
            } else {
                throw $e;
            }
        }

        if ($response->failed()) {
            throw new \Exception('Juego no encontrado');
        }

        return $response->json();
    }
}
