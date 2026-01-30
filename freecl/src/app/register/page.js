"use client";

import { useState } from "react";
import { register } from "@/services/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrors(null);

    try {
      const res = await register(form);

      if (res && res.success) {
        setMessage('Usuario registrado correctamente. Puedes iniciar sesión.');
        setForm({ name: '', email: '', password: '', password_confirmation: '' });
      } else if (res && res.errors) {
        setErrors(res.errors);
      } else if (res && res.message) {
        setErrors({ general: res.message });
      } else {
        setErrors({ general: 'Error desconocido al registrar' });
      }
    } catch (e) {
      setErrors({ general: e.message || 'Error de red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Registro</h1>

      {message && <div className="mb-4 p-2 bg-green-100 text-green-800">{message}</div>}
      {errors && (
        <div className="mb-4 p-2 bg-red-100 text-red-800">
          {errors.general && <div>{errors.general}</div>}
          {errors.email && <div>{errors.email}</div>}
          {errors.password && <div>{errors.password}</div>}
        </div>
      )}

      <input placeholder="Nombre" required value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full mb-2 p-2 border rounded" />

      <input type="email" placeholder="Email" required value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full mb-2 p-2 border rounded" />

      <input type="password" placeholder="Contraseña" required value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full mb-2 p-2 border rounded" />

      <input type="password" placeholder="Confirmar contraseña" required value={form.password_confirmation}
        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
        className="w-full mb-4 p-2 border rounded" />

      <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
}
