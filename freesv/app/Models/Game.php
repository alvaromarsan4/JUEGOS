<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'title',
        'thumbnail',
        'short_description',
        'game_url',
        'genre',
        'platform',
        'publisher',
        'developer',
        'release_date',
        'freetogame_profile_url',
    ];

    // We don't want Eloquent to treat `external_id` as primary key,
    // default auto-increment `id` will be used.
}
