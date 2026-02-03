<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'game_id',
        'comment',
        'rating'
    ];

    /**
     * Casting de atributos.
     * Esto asegura que el rating siempre sea un entero al salir de la DB.
     */
    protected $casts = [
        'rating' => 'integer',
        'game_id' => 'integer',
    ];

    /**
     * Obtener el usuario que realizó la reseña.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
// En app/Models/Review.php
public function game()
{
    // Asumiendo que tu modelo de juegos se llama Game
    return $this->belongsTo(Game::class, 'game_id');
}
    /**
     * Si tienes un modelo de Juegos interno, descomenta esto.
     * Si los juegos vienen solo de una API externa, no necesitas esta relación.
     */
    /*
    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
    */
}
