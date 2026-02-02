<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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
            'password' => 'required|string|min:8|confirmed', // Requiere campo password_confirmation
        ]);

        // 2. Crear usuario
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // 3. Loguear automáticamente al usuario recién creado (Opcional)
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
            // Regenerar sesión para seguridad (Fixación de sesión)
            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'message' => 'Login correcto',
                'user' => Auth::user(),
            ]);
        }

        // 3. Si falla, devolver error
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
     * Actualizar perfil (Nombre, Email, Contraseña)
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        // 1. Validar datos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // El email debe ser único en la tabla users, PERO ignorando el ID del usuario actual
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            // La contraseña es opcional (nullable). Si viene, debe confirmarse.
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // 2. Actualizar datos básicos
        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // 3. Actualizar contraseña SOLO si el usuario escribió una nueva
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'user' => $user
        ]);
    }
}
