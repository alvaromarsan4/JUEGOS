<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Para ver errores en storage/logs/laravel.log

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        // 1. Diagnóstico: Guardamos en el log qué está recibiendo Laravel realmente
        Log::info('Petición de perfil recibida:', $request->all());

        // 2. Identificación: Intentamos Auth, si no, buscamos por user_id enviado desde el front
        $user = Auth::user();

        if (!$user && $request->has('user_id')) {
            $user = User::find($request->user_id);
        }

        // 3. Si sigue sin haber usuario, devolvemos un error detallado
        if (!$user) {
            return response()->json([
                'message' => 'No autorizado. Laravel no reconoce tu sesión ni el user_id enviado.',
                'debug_received_id' => $request->user_id
            ], 401);
        }

        // 4. Validación manual (para evitar que falle antes de entrar si hay errores de formato)
        try {
            $request->validate([
                'username'    => 'required|string|max:255',
                'age'         => 'nullable|integer',
                'description' => 'nullable|string',
                'gender'      => 'nullable|string'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Error de validación', 'errors' => $e->errors()], 422);
        }

        // 5. Actualización Directa (Asignación manual para saltar protecciones de fillable si fallan)
        $user->name = $request->username;
        $user->description = $request->description;
        $user->age = $request->age;
        $user->gender = $request->gender;

        // Si mandas la imagen, la guardamos
        if ($request->has('profileImage')) {
            $user->profileImage = $request->profileImage;
        }

        $user->save();

        // 6. Respuesta limpia
        return response()->json([
            'message' => 'Perfil actualizado correctamente en la base de datos',
            'user'    => $user->fresh()
        ], 200);
    }
}

