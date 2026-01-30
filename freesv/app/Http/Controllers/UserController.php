<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Devuelve el usuario autenticado
     */
    public function profile()
    {
        return response()->json([
            'success' => true,
            'user' => Auth::user()
        ]);
    }
}
