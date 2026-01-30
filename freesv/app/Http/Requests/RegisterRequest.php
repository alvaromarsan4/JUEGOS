<?php

namespace App\Http\Requests;

use App\Http\Requests\ApiRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

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
            'password' => 'required|min:6|confirmed'
        ];
    }

    // ...existing code...
}
