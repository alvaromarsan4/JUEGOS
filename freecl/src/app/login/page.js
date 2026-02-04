"use client";

import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  // Estado para el ojo del login
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const res = await login(form);
      if (res.success) {
        router.push("/");
      } else {
        setErrors({ general: res.message || "Credenciales incorrectas" });
      }
    } catch (e) {
      setErrors({ general: 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden p-4">
      {/* Luces */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md bg-card/90 backdrop-blur-md border border-border rounded-2xl shadow-xl p-6 animate-fade-in-up">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold mb-1 text-card-foreground">Iniciar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Sesión</span></h2>
          <p className="text-muted-foreground text-sm">Bienvenido de nuevo a Project Games</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 text-sm text-center">
              {errors.general && <span>{errors.general}</span>}
            </div>
          )}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Correo Electrónico</label>
            <input type="email" id="email" placeholder="ejemplo@correo.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 pr-10 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className={`w-full py-3.5 px-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {loading ? 'Entrando...' : 'Entrar a mi cuenta'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>¿No tienes cuenta? <Link href="/register" className="text-primary hover:text-blue-600 font-semibold transition-colors">Regístrate gratis aquí</Link></p>
        </div>
      </div>
    </div>
  );
}