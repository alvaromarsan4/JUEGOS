"use client";
 import Link from "next/link";
import React from "react";
export default function Footer({ setView }) {
  const currentYear = new Date().getFullYear();
 
  return (
    <footer className="w-full bg-slate-900 text-white border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="font-bold text-xl tracking-tight">
              Project <span className="text-blue-500">Games</span>
            </Link>
            <p className="text-sm opacity-60 mt-2">Tu biblioteca de juegos gratis favorita.</p>
          </div>

          <div className="flex gap-8 text-sm">
            {/* Estos botones ahora cambian la vista en el page.js */}

            <Link href="/about" className="opacity-70 hover:opacity-100 transition-opacity">
              Sobre nosotros
            </Link>
            <Link href="/privacy" className="opacity-70 hover:opacity-100 transition-opacity">
              Privacidad
            </Link>
          </div>
 
          <div className="flex gap-4">
            <span className="text-xs px-3 py-1 bg-slate-800 rounded-full border border-slate-700">v1.0.0</span>
          </div>
        </div>
 
        <hr className="my-6 border-slate-800" />
        <div className="text-center text-xs opacity-50">
          © {currentYear} Project Games. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
 