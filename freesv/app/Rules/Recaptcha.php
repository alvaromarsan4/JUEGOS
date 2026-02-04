<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Recaptcha implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // 1. Preparamos los datos
        $secret = env('RECAPTCHA_SECRET_KEY');
        $remoteIp = request()->ip();

        // 2. Construimos la URL con los parámetros (Forma nativa de PHP)
        $url = "https://www.google.com/recaptcha/api/siteverify?secret={$secret}&response={$value}&remoteip={$remoteIp}";

        // 3. Hacemos la petición (Sin usar la fachada Http de Laravel)
        // Usamos file_get_contents que es estándar de PHP
        $response = file_get_contents($url);

        // 4. Decodificamos el JSON
        $responseKeys = json_decode($response, true);

        // 5. Verificamos
        if (!($responseKeys["success"] ?? false)) {
            $fail('La verificación de reCAPTCHA ha fallado. Por favor, intenta de nuevo.');
        }
    }
}
