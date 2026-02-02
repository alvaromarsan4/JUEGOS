<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Game; // Asegúrate de que tienes el modelo Game creado

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // URL de la API de FreeToGame
        $apiUrl = 'https://www.freetogame.com/api/games';

        $this->command->info("Conectando a la API: $apiUrl ...");

        try {
            $response = Http::withoutVerifying()->get($apiUrl); // withoutVerifying evita errores de certificado SSL locales

            if ($response->successful()) {
                $games = $response->json();
                $total = count($games);
                $this->command->info("Se han encontrado $total juegos. Insertando en base de datos...");

                // Barra de progreso para que se vea bonito en la terminal
                $bar = $this->command->getOutput()->createProgressBar($total);
                $bar->start();

                foreach ($games as $gameData) {
                    Game::updateOrCreate(
                        // 1. Buscamos por el ID externo para no duplicar
                        ['external_id' => $gameData['id']],

                        // 2. Si no existe, crea. Si existe, actualiza estos campos:
                        [
                            'title'                  => $gameData['title'],
                            'thumbnail'              => $gameData['thumbnail'],
                            'short_description'      => $gameData['short_description'] ?? null,
                            'game_url'               => $gameData['game_url'] ?? null,
                            'genre'                  => $gameData['genre'] ?? null,
                            'platform'               => $gameData['platform'] ?? null,
                            'publisher'              => $gameData['publisher'] ?? null,
                            'developer'              => $gameData['developer'] ?? null,
                            'release_date'           => $gameData['release_date'] ?? null,
                            'freetogame_profile_url' => $gameData['freetogame_profile_url'] ?? null,
                        ]
                    );
                    $bar->advance();
                }

                $bar->finish();
                $this->command->newLine();
                $this->command->info("¡Proceso finalizado con éxito!");

            } else {
                $this->command->error("Error al descargar los juegos. Código de estado: " . $response->status());
            }

        } catch (\Exception $e) {
            $this->command->error("Error fatal: " . $e->getMessage());
        }
    }
}
