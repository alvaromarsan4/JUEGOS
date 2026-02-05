"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="w-full bg-card/90 backdrop-blur-md text-card-foreground shadow-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CAMBIO AQUI: h-16 (64px) en móvil, h-20 (80px) en escritorio */}
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* --- LOGO --- */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {/* CAMBIO AQUI: h-10 en móvil, h-14 en escritorio */}
              <img
                src="/logo.png"
                alt="Logo Project Games"
                className="h-10 md:h-14 w-auto object-contain"
              />

              {/* CAMBIO AQUI: text-xl en móvil, text-2xl en escritorio */}
              <span className="font-bold text-xl md:text-2xl hover:text-blue-400 transition-colors truncate max-w-[200px] md:max-w-none">
                Project Games
              </span>
            </Link>
          </div>

          {/* --- MENÚ DE ESCRITORIO --- */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/games" className="text-sm font-medium hover:text-primary transition-colors">
              Listado de juegos
            </Link>

            {user ? (
              <>
                <Link href="/favoritos" className="text-sm font-medium flex items-center gap-1 hover:text-red-500 transition-colors">
                  ❤️ Mis Favoritos
                </Link>

                <div className="h-4 w-px bg-border"></div>

                <Link href="/Profile" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                  <img
                    src="/perfil1.png"
                    alt="Perfil"
                    className="h-6 w-6 object-contain mr-2 inline-block rounded-full"
                  />
                  {user.name}
                </Link>
                <Link href="/login">
                <button
                  onClick={() => logout()}
                  className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                  
                >
                  Cerrar sesión
                </button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  🔑 Iniciar sesión
                </Link>
                <Link href="/register" className="text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full transition-colors shadow-sm">
                  ➕ Registrarse
                </Link>
              </>
            )}
          </div>

          {/* --- BOTÓN HAMBURGUESA --- */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-card-foreground focus:outline-none p-2"
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
        <div className="lg:hidden bg-card border-t border-border shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
            <Link href="/games" onClick={closeMenu} className="block py-2 text-sm font-medium hover:text-primary border-b border-border">
              Listado de Juegos
            </Link>

            {user ? (
              <>
                <Link href="/favoritos" onClick={closeMenu} className="block py-2 text-sm font-medium hover:text-red-500">
                  ❤️ Mis Favoritos
                </Link>
                <Link href="/Profile" onClick={closeMenu} className="block py-2 text-sm text-primary font-bold hover:text-primary/80">
                  <img
                    src="/perfil1.png"
                    alt="Perfil"
                    className="h-6 w-6 object-contain mr-2 inline-block rounded-full"
                  /> ({user.name})
                </Link>
                <Link href="/login">
                <button
                  onClick={() => { logout(); closeMenu(); }}
                  className="w-full text-left py-2 text-sm text-red-400 hover:text-red-300 font-bold"
                 
                >
                  Cerrar sesión
                </button>
                </Link>
              </>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/login" onClick={closeMenu} className="text-center py-2 border border-border rounded-full hover:bg-muted font-medium text-muted-foreground">
                  🔑 Iniciar sesión
                </Link>
                <Link href="/register" onClick={closeMenu} className="text-center py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 font-medium">
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