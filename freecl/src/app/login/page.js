"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form);
      if (!res.success) {
        setError(res.message || "Error al iniciar sesión");
      } else {
        // redirect to home or wherever
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Error en la petición");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Contraseña"
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      {error && <p>{error}</p>}
    </form>
  );
}
