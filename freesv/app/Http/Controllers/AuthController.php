<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;
class AuthController extends Controller
{
    /**
     * Registrar un nuevo usuario
     */
    public function register(Request $request)
    {
        // 1. Validar datos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // 2. Crear usuario
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // 3. Loguear automáticamente
        Auth::login($user);

        // 4. Devolver respuesta
        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado correctamente',
            'user' => $user,
        ], 201);
    }

    /**
     * Iniciar sesión
     */
    public function login(Request $request)
    {
        // 1. Validar datos
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Intentar autenticar
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'message' => 'Login correcto',
                'user' => Auth::user(),
            ]);
        }

        // 3. Si falla
        return response()->json([
            'success' => false,
            'message' => 'Las credenciales no coinciden con nuestros registros.',
        ], 401);
    }

    /**
     * Cerrar sesión
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    /**
     * Actualizar perfil (MODIFICADO PARA INCLUIR IMAGEN Y DATOS EXTRA)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // 1. Validar datos (Añadidos los nuevos campos)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
            // Nuevos campos opcionales:
            'profileImage' => 'nullable|string',
            'description' => 'nullable|string',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
        ]);

        // 2. Actualizar datos básicos
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // 3. Actualizar contraseña SOLO si el usuario escribió una nueva
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        // 4. Actualizar nuevos campos si vienen en la petición
        // Usamos 'profileImage' tal cual está en tu base de datos
        if ($request->has('profileImage')) {
            $user->profileImage = $validated['profileImage'];
        }
        if ($request->has('description')) {
            $user->description = $validated['description'];
        }
        if ($request->has('age')) {
            $user->age = $validated['age'];
        }
        if ($request->has('gender')) {
            $user->gender = $validated['gender'];
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'user' => $user
        ]);
    }
}
