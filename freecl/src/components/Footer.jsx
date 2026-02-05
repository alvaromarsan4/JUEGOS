"use client";
import Link from "next/link";
import React from "react";
export default function Footer({ setView }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card text-card-foreground border-t border-border mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="font-bold text-xl tracking-tight">
              Project <span className="text-primary">Games</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">Tu biblioteca de juegos gratis favorita.</p>
          </div>

          <div className="flex gap-8 text-sm">
            {/* Estos botones ahora cambian la vista en el page.js */}

            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              Sobre nosotros
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
          </div>

          <div className="flex gap-4">
            <span className="text-xs px-3 py-1 bg-muted text-muted-foreground rounded-full border border-border">v1.0.0</span>
          </div>
        </div>

        <hr className="my-6 border-border" />
        <div className="text-center text-xs text-muted-foreground">
          © {currentYear} Project Games. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
