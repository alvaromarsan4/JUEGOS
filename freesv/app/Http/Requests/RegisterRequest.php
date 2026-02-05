<?php

namespace App\Http\Requests;

use App\Http\Requests\ApiRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Rules\Recaptcha; // <--- 1. IMPORTANTE: AÑADE ESTO AQUÍ

class RegisterRequest extends ApiRequest
{
    /**
     * Autorizar la petición
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Reglas de validación
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',

            // 2. AÑADE ESTA LÍNEA AL FINAL:
            // Validamos que el token sea obligatorio y cumpla la regla de Google
            'recaptcha_token' => ['required', new Recaptcha]
        ];
    }
}

