<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            // Relación con el usuario que hace la reseña
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');

            // ID del juego. Usamos index() para que las consultas por juego sean rápidas
            // Si tus IDs de juegos de la API son muy grandes, unsignedBigInteger es correcto
            $table->unsignedBigInteger('game_id')->index();

            // Contenido de la reseña
            $table->text('comment');

            // Puntuación (ejemplo: 1 a 5)
            $table->tinyInteger('rating')->default(5);

            $table->timestamps();

            /**
             * OPCIONAL: Restricción de unicidad.
             * Esto evita que un mismo usuario califique el mismo juego dos veces.
             * Si quieres permitir múltiples reseñas por usuario en el mismo juego, elimina esta línea.
             */
            $table->unique(['user_id', 'game_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};