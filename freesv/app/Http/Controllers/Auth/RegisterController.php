<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\RegisterRequest;
class RegisterController extends Controller
{
    /**
     * Registro de usuario
     */
    public function register(RegisterRequest  $request)
    {
        // Usar las reglas del FormRequest y obtener datos validados
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            // Encriptación de contraseña (obligatorio en el PDF)
            'password' => Hash::make($validated['password'])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado correctamente'
        ], 201);
    }
}
