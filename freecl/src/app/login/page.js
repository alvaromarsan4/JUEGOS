"use client";

import { useState, useContext } from "react";
// 1. IMPORTANTE: Importamos el contexto en lugar de la api directa
import { AuthContext } from "@/context/AuthContext"; 
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  // 2. Extraemos la función 'login' del contexto global
  const { login } = useContext(AuthContext);

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
      // 3. Usamos la función del contexto. 
      // Esta función ya se encarga internamente de llamar a la API y guardar el usuario en el estado global.
      const res = await login(form);

      if (res.success) {
        // 4. Redirigimos a la raíz (donde están los juegos)
        router.push("/"); 
      } else {
        // Manejamos el error que nos devuelve el contexto
        setErrors({ general: res.message || "Credenciales incorrectas" });
      }
    } catch (e) {
      setErrors({ general: 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Iniciar Sesión</h1>

      {errors && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {errors.general && <div>{errors.general}</div>}
        </div>
      )}

      <input 
        type="email" 
        placeholder="Email" 
        required 
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full mb-2 p-2 border rounded text-black" 
      />

      <input 
        type="password" 
        placeholder="Contraseña" 
        required 
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full mb-4 p-2 border rounded text-black" 
      />

      <button 
        disabled={loading} 
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
      >
        {loading ? 'Entrando...' : 'Iniciar Sesión'}
      </button>

      <p className="mt-4 text-sm text-center">
        ¿No tienes cuenta? <a href="/register" className="text-blue-500 underline">Regístrate aquí</a>
      </p>
    </form>
  );
}