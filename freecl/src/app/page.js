"use client";
 
import { useState } from "react";
import Filters from "@/components/Filters";
import GameCard from "@/components/GameCard";
import Footer from "@/components/Footer"; // Importamos EL footer de arriba

export default function HomePage() {
  const [view, setView] = useState("home");
 
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <main className="flex-grow max-w-7xl mx-auto p-6 text-white w-full">
       
        {/* --- VISTA DE JUEGOS --- */}
       <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Bienvenido a Project Games
      </h1>
      
      <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
        Tu destino definitivo para explorar y descubrir videojuegos gratuitos. 
        Filtra por plataforma, busca por género y encuentra tu próxima aventura 
        sin coste alguno.
      </p>

      <a 
      href="/games" // <--- Redirección directa a la ruta que maneja api.php
      className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30 inline-block"
    >
        Ver el Catálogo de Juegos 🚀
      </a>

      {/* Decoración visual sencilla */}
      <div className="mt-16 flex gap-8 opacity-40 grayscale">
        <span className="text-6xl">🎮</span>
        <span className="text-6xl">🕹️</span>
        <span className="text-6xl">👾</span>
      </div>
    </div>
 
      </main>

    </div>
  );
}