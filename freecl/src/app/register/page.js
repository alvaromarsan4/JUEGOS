"use client";

import { useState, useRef } from "react"; // NUEVO: Importamos useRef
import { register } from "@/services/api";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha"; // NUEVO: Importamos la librería

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  
  // NUEVO: Estado para el token del Captcha
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null); // Para resetear el captcha si falla el registro

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState(null);

  // Estados para ver/ocultar contraseñas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // NUEVO: Función que se ejecuta cuando el usuario resuelve el Captcha
  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
    // Limpiamos error de captcha si existía
    if (errors?.captcha) {
        setErrors(prev => ({ ...prev, captcha: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrors(null);

    // NUEVO: Validación estricta del Captcha antes de enviar
    if (!captchaToken) {
        setErrors({ general: "Por favor, completa el Captcha para verificar que no eres un robot." });
        setLoading(false);
        return;
    }

    try {
      // NUEVO: Enviamos el token junto con el formulario al backend
      const res = await register({ ...form, recaptcha_token: captchaToken });

      if (res && res.success) {
        setMessage('Usuario registrado correctamente. Puedes iniciar sesión.');
        setForm({ name: '', email: '', password: '', password_confirmation: '' });
        setCaptchaToken(null); // Reseteamos estado
        recaptchaRef.current.reset(); // Reseteamos visualmente el captcha
      } else if (res && res.errors) {
        setErrors(res.errors);
        recaptchaRef.current.reset(); // Reiniciar captcha en error para obligar a validar de nuevo
        setCaptchaToken(null);
      } else if (res && res.message) {
        setErrors({ general: res.message });
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      } else {
        setErrors({ general: 'Error desconocido al registrar' });
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    } catch (e) {
      setErrors({ general: e.message || 'Error de red' });
      recaptchaRef.current.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Componente del Icono de Ojo
  const EyeIcon = ({ visible, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
    >
      {visible ? (
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
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white relative overflow-hidden p-4">
      {/* Luces */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Crear <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Cuenta</span></h2>
          <p className="text-slate-400 text-sm">Únete a la comunidad de Project Games</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-200 text-sm text-center">{message}</div>}
          {errors && errors.general && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{errors.general}</div>}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Nombre</label>
            <input type="text" placeholder="Tu nombre de usuario" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email</label>
            <input type="email" placeholder="ejemplo@correo.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg bg-slate-950 border ${errors?.email ? 'border-red-500' : 'border-slate-800'} text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`} />
            {errors?.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* CONTRASEÑA */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full px-4 py-3 pr-10 rounded-lg bg-slate-950 border ${errors?.password ? 'border-red-500' : 'border-slate-800'} text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all`}
              />
              <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
            </div>
            {errors?.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••" required value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                className="w-full px-4 py-3 pr-10 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              <EyeIcon visible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>
          </div>

          {/* NUEVO: RECAPTCHA */}
          <div className="flex justify-center pt-2">
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} // <--- PEGA TU CLAVE PÚBLICA AQUÍ
                onChange={onCaptchaChange}
                theme="dark" // Importante: Tema oscuro para tu diseño
            />
          </div>

          <div className="pt-2">
            <button disabled={loading} className={`w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>¿Ya tienes cuenta? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}