"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false); 

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="w-full bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CAMBIO AQUI: h-20 (80px) para hacer la barra más alta */}
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO --- */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              onClick={closeMenu} 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {/* CAMBIO AQUI: h-16 (64px) para que el logo sea enorme */}
              <img 
                src="/logo.png" 
                alt="Logo Project Games" 
                className="h-18 w-auto object-contain" 
              />

              {/* CAMBIO AQUI: text-2xl para que el texto acompañe al tamaño del logo */}
              <span className="font-bold text-2xl hover:text-blue-400 transition-colors">
                 Project Games
              </span>
            </Link>
          </div>

          {/* --- MENÚ DE ESCRITORIO --- */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/games" className="text-sm hover:text-blue-400 transition-colors">
              Listado de juegos
            </Link>

            {user ? (
              <>
                <Link href="/favoritos" className="text-sm flex items-center gap-1 hover:text-red-400 transition-colors">
                  ❤️ Mis Favoritos
                </Link>
                
                <div className="h-4 w-px bg-gray-600"></div>

                <Link href="/Profile" className="text-sm font-semibold text-blue-200 hover:text-white transition-colors">
                  <img 
                src="/perfil1.png" 
                alt="Perfil" 
                className="h-6 w-6 object-contain mr-2 inline-block rounded-full" 
              />
                  {user.name}
                </Link>

                <button
                  onClick={() => logout()}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm hover:text-blue-400 transition-colors">
                  🔑 Iniciar sesión
                </Link>
                <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors">
                  ➕ Registrarse
                </Link>
              </>
            )}
          </div>

          {/* --- BOTÓN HAMBURGUESA --- */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              <span className="sr-only">Abrir menú</span>
              {!isOpen ? (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MENÚ MÓVIL DESPLEGABLE --- */}
      {isOpen && (
        <div className="lg:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
            <Link href="/games" onClick={closeMenu} className="block py-2 text-sm hover:text-blue-400 border-b border-slate-700">
              Listado de Juegos
            </Link>

            {user ? (
              <>
                <Link href="/favoritos" onClick={closeMenu} className="block py-2 text-sm hover:text-red-400">
                  ❤️ Mis Favoritos
                </Link>
                <Link href="/Profile" onClick={closeMenu} className="block py-2 text-sm text-blue-200 font-bold hover:text-white">
                   <img 
                src="/perfil1.png" 
                alt="Perfil" 
                className="h-6 w-6 object-contain mr-2 inline-block rounded-full" 
              /> ({user.name})
                </Link>
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="w-full text-left py-2 text-sm text-red-400 hover:text-red-300 font-bold"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/login" onClick={closeMenu} className="text-center py-2 border border-slate-600 rounded hover:bg-slate-700">
                  🔑 Iniciar sesión
                </Link>
                <Link href="/register" onClick={closeMenu} className="text-center py-2 bg-blue-600 rounded hover:bg-blue-700">
                  ➕ Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}