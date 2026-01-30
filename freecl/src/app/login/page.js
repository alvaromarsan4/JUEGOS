"use client";

import { useState } from "react";
import { login } from "@/services/api"; // Asegúrate de tener esta función en tu api.js
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const res = await login(form);

      if (res && res.success) {
        // Aquí podrías guardar el token en cookies o localStorage si no lo hace tu api.js
        // localStorage.setItem('token', res.token); 
        
        // Redirigir al dashboard o home tras éxito
        router.push("/dashboard"); 
      } else if (res && res.errors) {
        setErrors(res.errors);
      } else if (res && res.message) {
        setErrors({ general: res.message });
      } else {
        setErrors({ general: 'Credenciales incorrectas o error en el servidor' });
      }
    } catch (e) {
      setErrors({ general: e.message || 'Error de red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Iniciar Sesión</h1>

      {errors && (
        <div className="mb-4 p-2 bg-red-100 text-red-800">
          {errors.general && <div>{errors.general}</div>}
          {errors.email && <div>{errors.email}</div>}
          {errors.password && <div>{errors.password}</div>}
        </div>
      )}

      <input 
        type="email" 
        placeholder="Email" 
        required 
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full mb-2 p-2 border rounded" 
      />

      <input 
        type="password" 
        placeholder="Contraseña" 
        required 
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full mb-4 p-2 border rounded" 
      />

      <button 
        disabled={loading} 
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Entrando...' : 'Iniciar Sesión'}
      </button>

      <p className="mt-4 text-sm text-center">
        ¿No tienes cuenta? <a href="/register" className="text-blue-500 underline">Regístrate aquí</a>
      </p>
    </form>
  );
}