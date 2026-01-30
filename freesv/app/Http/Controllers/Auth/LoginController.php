<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Log;
class LoginController extends Controller
{
    /**
     * Login de usuario
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        // Log attempt (do not log password). Helpful for debugging.
        Log::info('Login attempt', ['email' => $credentials['email']]);

        if (!Auth::attempt($credentials)) {
            Log::warning('Login failed', ['email' => $credentials['email']]);
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        Log::info('Login successful', ['email' => $credentials['email'], 'user_id' => Auth::id()]);

        $request->session()->regenerate();

        return response()->json([
            'success' => true,
            'message' => 'Login correcto',
            'user' => Auth::user()
        ]);
    }
}
