"use client";

import Link from "next/link";
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="w-full bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
            
            {/* IZQUIERDA: LOGO Y ENLACES PÚBLICOS */}
            <div className="flex items-center gap-6">
                <Link href="/" className="font-bold text-lg hover:text-blue-400 transition-colors">
                    Project Games
                </Link>

                <Link href="/games" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                    Listado
                </Link>
            </div>

            {/* DERECHA: USUARIO Y ACCIONES */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {/* --- NUEVO ENLACE A FAVORITOS --- */}
                        <Link 
                            href="/favoritos" 
                            className="text-sm flex items-center gap-1 opacity-80 hover:opacity-100 hover:text-red-400 transition-all mr-2"
                        >
                            ❤️ Mis Favoritos
                        </Link>

                        {/* SEPARADOR VISUAL */}
                        <div className="h-4 w-px bg-gray-600 hidden sm:block"></div>

                        <Link
          href="/Profile"
          className="text-blue-400 font-medium hover:text-blue-300 transition-colors"
        >
 <span className="text-sm font-semibold text-blue-200">
                            {user.name}
                        </span>
          {/* O usa: {user ? user.username : "agfavdag"} */}
        </Link>

                        {/* BOTÓN LOGOUT */}
                        <button
							href="/"
                            onClick={() => logout()}
                            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors ml-2"
                        >
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
                            🔑 Iniciar sesión
                        </Link>

                        <Link 
                            href="/register" 
                            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                        >
                            ➕ Registrarse
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}